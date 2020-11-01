import React, { Component } from 'react';
import {
  ToggleButton,
  ToggleButtonGroup,
  ButtonToolbar,
} from 'react-bootstrap';

export interface Settings {
  graphBackend: string;
  toggledElements: Array<string>;
  toggledTypes: Array<string>;
  dataSource: string;
}

interface Props {
  onUpdateSettings?(settings: Partial<Settings>): void;
  settings?: Settings;
}

interface State {
  settings: Settings;
}

export function getDefaultState(): State {
  return {
    settings: {
      graphBackend: 'eCharts',
      toggledElements: ['title', 'icon'],
      toggledTypes: [],
      dataSource: 'defaultGermicule',
    },
  };
}

export const GRAPH_BACKEND_OPTIONS = ['eCharts', 'D3'];
export const TOGGLE_ELEMENT_OPTIONS = ['title', 'icon'];

export class GermiculeSettings extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const state: State = { ...getDefaultState() };
    if (props.settings) {
      state.settings = { ...state.settings, ...props.settings };
    }
    this.state = state;
  }

  handleUpdateSettings = (data: Partial<Settings>) => {
    this.setState({ settings: { ...this.state.settings, ...data } });
    if (this.props.onUpdateSettings) {
      this.props.onUpdateSettings(data);
    }
  };
  render() {
    return (
      <ButtonToolbar>
        <ToggleButtonGroup
          type="radio"
          name="graphBackend"
          value={this.state.settings.graphBackend}
          onChange={value =>
            this.handleUpdateSettings({
              graphBackend: value,
            })
          }
        >
          {GRAPH_BACKEND_OPTIONS.map((radio, idx) => (
            <ToggleButton
              key={idx}
              type="radio"
              variant="secondary"
              value={radio}
            >
              {radio}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <ToggleButtonGroup
          type="checkbox"
          name="toggledElements"
          value={this.state.settings.toggledElements}
          onChange={value =>
            this.handleUpdateSettings({
              toggledElements: value,
            })
          }
        >
          {TOGGLE_ELEMENT_OPTIONS.map((checkbox, idx) => (
            <ToggleButton
              key={idx}
              type="checkbox"
              variant="secondary"
              value={checkbox}
            >
              {checkbox}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </ButtonToolbar>
    );
  }
}
