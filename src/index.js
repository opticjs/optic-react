var Optic = require('optic'),
    React = require('react');

export function createContainer(ComponentClass, options) {
  return class OpticContainer extends React.Component {
    render() {
      console.log('passing through optic-react');
      return (
        <ComponentClass {...this.props}>
          {this.props.children}
        </ComponentClass>
      );
    }
  }
};
