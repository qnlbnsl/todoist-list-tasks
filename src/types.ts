import { ActionConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'array-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

// TODO Add your configuration elements here for type-checking
export interface ArrayCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  show_warning?: boolean;
  show_error?: boolean;
  test_gui?: boolean;
  entity?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  projects: any;
}
export interface Task {
  id: string;
  content: string;
  is_overdue: boolean;
  recurring: boolean;
  due_date: Date;
  create_date: Date;
}

// interface isTaskList {
//   project_name: string;
//   tasks: Array<isTask>;
// }

// export interface IsProjectList {
//   projects: Array<isTaskList>;
// }
