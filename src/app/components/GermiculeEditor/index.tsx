/**
 *
 * GermiculeEditor
 *
 * an interactive JSON editor for germicules
 *
 */
import React from 'react';
import ReactJson from 'react-json-view';

interface Props {
  src: object;
  style?: object;
  onUpdateSrc(params: { src: object }): void;
}

export class GermiculeEditor extends React.Component<Props> {
  render() {
    return (
      <ReactJson
        src={this.props.src}
        displayObjectSize={false}
        displayDataTypes={false}
        onEdit={params => {
          // console.log('onEdit', params);
          this.setState({ src: params.updated_src });
          this.props.onUpdateSrc({ src: params.updated_src });
        }}
        onAdd={params => {
          // console.log('onAdd', params);
          this.setState({ src: params.updated_src });
          this.props.onUpdateSrc({ src: params.updated_src });
        }}
        onDelete={params => {
          // console.log('onDelete', params);
          this.setState({ src: params.updated_src });
          this.props.onUpdateSrc({ src: params.updated_src });
        }}
        style={this.props.style}
      />
    );
  }
}
