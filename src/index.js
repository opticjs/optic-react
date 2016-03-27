var Optic = require('optic'),
    React = require('react');

export function createContainer(ComponentClass, options) {
  return class OpticContainer extends React.Component {
    componentWillMount() {
      this._params = options.initialParams && options.initialParams(this.props) || {};
      this._submitQueries();
    }

    componentWillUnmount() {
      this._unmountStarted = true;
    }

    componentDidUpdate(prevProps, prevState) {
      // Submit queries if props change.
      var doUpdate = false;
      [...Object.keys(prevProps), ...Object.keys(this.props)].forEach(k => {
        if (prevProps[k] !== this.props[k]) {
          doUpdate = true;
        }
      });
      if (doUpdate) {
        this._submitQueries();
      }
    }

    _submitQueries() {
      var queries = options.queries && options.queries(this._params, this.props) || {};
      Object.keys(queries).forEach(name => {
        this._submitQuery(name, queries[name]);
      });
    }

    _submitUpdate(name, opts) {
      var updates = options.updates ? options.updates(this._params, this.props, opts) : {};
      var update = updates[name];
      if (update) {
        this._submitQuery(name, update);
      } else {
        throw new Error('An update query by the name of "' + name + '" does not exist.');
      }
    }

    _submitQuery(name, query) {
      if (query instanceof Optic.Query) {
        query.onQueryCacheInvalidate(
            new Optic.OpticObject.Source('queryCacheInvalidator', () => () => {
              if (!this._unmountStarted) {
                this.forceUpdate.bind(this);
              }
            }));
        query.submit(finalResponse => {
          if (!this._unmountStarted) {
            this.setState({
              [name]: finalResponse
            });
          }
        }, response => {
          if (!this._unmountStarted && response.isProvisional()) {
            this.setState({
              [name]: response
            });
          }
        });
      } else {
        if (!this._unmountStarted) {
          this.setState({
            [name]: query
          });
        }
      }
    }

    _newParams(newParams = {}) {
      Object.assign(this._params, newParams);
      this._submitQueries();
    }

    render() {
      var callbacks = options.callbacks &&
          options.callbacks(this._params, (...args) => this._newParams(...args), this.props) || {};

      var props = Object.assign({}, this.props || {}, this.state || {}, callbacks);

      return (
        <ComponentClass {...props} submitUpdate={this._submitUpdate.bind(this)} />
      );
    }
  }
};
