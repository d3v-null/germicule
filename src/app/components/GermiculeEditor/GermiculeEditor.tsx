/**
 *
 * GermiculeEditor
 *
 * an interactive JSON editor for connections
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
          this.setState({ src: params.updated_src });
          this.props.onUpdateSrc({ src: params.updated_src });
        }}
        onAdd={params => {
          this.setState({ src: params.updated_src });
          this.props.onUpdateSrc({ src: params.updated_src });
        }}
        onDelete={params => {
          this.setState({ src: params.updated_src });
          this.props.onUpdateSrc({ src: params.updated_src });
        }}
        style={this.props.style}
      />
    );
  }
}
