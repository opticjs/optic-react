var Optic = require('optic'),
    React = require('react');

export function createContainer(ComponentClass, options) {
  console.log('options: ');
  console.log(options);

  return class OpticContainer extends React.Component {
    componentWillMount() {
      this._params = options.initialParams && options.initialParams() || {};
      this._submitQueries();
    },

    _submitQueries() {
      var queries = options.queries();
      Object.keys(queries).forEach(name => {
        var query = queries[name];

        if (query instanceof Optic.Query) {
          query.submit(response => {
            this.setState({
              [name]: response
            });
          }, provisionalResponse => {
            this.setState({
              [name]: provisionalResponse
            });
          });
        } else {
          this.setState({
            [name]: query
          });
        }
      });
    },

    _newParams(newParams = {}) {
      Object.assign(this._params, newParams);
      this._submitQueries();
    },

    render() {
      var queries = options.queries();
      var callbacks = options.callbacks && options.callbacks(this._newParams) || {};
      var props = Object.assign({}, this.props, this.state, callbacks);

      return (
        <ComponentClass {...props}>
          {this.props.children}
        </ComponentClass>
      );
    }
  }
};