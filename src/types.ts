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
  projects: Projects;
}
export interface TaskModel {
  id: number;
  content: string;
  is_overdue: boolean;
  recurring: boolean;
  due_date: Date | undefined;
  create_date: Date;
}

export interface Projects {
  business: { [key: string]: IncomingTask };
  school:   { [key: string]: IncomingTask };
  work:     { [key: string]: IncomingTask };
  personal: { [key: string]: IncomingTask };
}

export interface IncomingTask {
  id:            number;
  assigner:      number;
  project_id:    number;
  section_id:    number;
  order:         number;
  content:       string;
  description:   string;
  completed:     boolean;
  label_ids:     unknown[];
  priority:      number;
  comment_count: number;
  creator:       number;
  created:       string;
  url:           string;
  due?:          Due;
}

export interface Due {
  recurring: boolean;
  string:    string;
  date:      string;
  datetime?: string;
  timezone?: string;
}
