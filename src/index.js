var Optic = require('optic'),
    React = require('react');

export function createContainer(ComponentClass, options) {
  return class OpticContainer extends React.Component {
    componentWillMount() {
      this._params = options.initialParams && options.initialParams() || {};
      this._submitQueries();
    }

    _submitQueries() {
      var queries = options.queries && options.queries(this._params) || {};
      Object.keys(queries).forEach(name => {
        this._submitQuery(queries[name]);
      });
    }

    _submitUpdate(name) {
      var updates = options.updates ? options.updates(this._params) : {};
      var update = updates[name];
      if (update) {
        this._submitQuery(update);
      } else {
        throw new Error('An update query by the name of "' + name + '" does not exist.');
      }
    }

    _submitQuery(query) {
      if (query instanceof Optic.Query) {
        query.onQueryCacheInvalidate(
            new Optic.OpticObject.Source('queryCacheInvalidator', this.forceUpdate));
        query.submit(finalResponse => {
          this.setState({
            [name]: finalResponse
          });
        }, response => {
          this.setState({
            [name]: response
          });
        });
      } else {
        this.setState({
          [name]: query
        });
      }
    }

    _newParams(newParams = {}) {
      Object.assign(this._params, newParams);
      this._submitQueries();
    }

    render() {
      var callbacks = options.callbacks &&
          options.callbacks(this._params, (...args) => this._newParams(...args)) || {};

      var props = Object.assign({}, this.props || {}, this.state || {}, callbacks);

      return (
        <ComponentClass {...props} submitUpdate={this._submitUpdate.bind(this)} />
      );
    }
  }
};
