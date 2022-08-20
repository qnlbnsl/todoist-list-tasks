import { html, TemplateResult } from "lit";
import { ArrayCardConfig, Task } from "../types";
import { Log } from "./logger";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const HaWrapper = (config: ArrayCardConfig): TemplateResult =>  {
  const ha_card = document.createElement("ha-card")
  ha_card.style.width = "100%"
  ha_card.tabIndex = 0
  ha_card.appendChild(projectFormat(config.projects))

  return html`${ha_card}`
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const projectFormat = (projects: any): HTMLElement =>  {
  const formatted_project: HTMLElement = document.createElement('project-card');
  Object.keys(projects).forEach((project) => {
    if (isEmpty(projects[project])) return;
    return formatted_project.appendChild(buildTaskList(projects[project], project));
  });

  return formatted_project ;
};
/**
 * @param  {any} project
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildTaskList = (project: any, key: string): HTMLElement => {
  const task_list: HTMLElement = document.createElement('task-list')
  task_list.style.display = "table-cell"
  const tasks: HTMLElement = document.createElement('ul');
  tasks.innerHTML = key[0].toUpperCase() + key.substring(1)
  tasks.style.fontSize="1.5em"
  tasks.style.margin="0.5em"
  tasks.style.padding="20px"
  task_list.style.width = "calc(100% / 3)"

  Object.keys(project).forEach((task) => tasks.appendChild(formatTask(project[task])));
  // Build HTML for Project List
  task_list.appendChild(tasks);
  return task_list;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatTask = (task: any): HTMLLIElement => {
  const due_date: Date = new Date(task?.due?.dateTime) || null;
  const current_date: Date = new Date();
  const is_overdue = current_date < due_date ? false : true;
  const recurring = task.due?.recurring || false;

  const formatted_task: Task = {
    id: task.id,
    content: task.content,
    is_overdue: is_overdue,
    due_date: due_date,
    create_date: task.created,
    recurring: recurring,
  };
  // Need to build this in HTML

  const task_element = document.createElement('li');
  task_element.innerHTML = formatted_task.content;
  task_element.style.fontSize = '10px';
  return task_element;
};

const isEmpty = (obj): boolean =>  {
  return Object.keys(obj).length === 0;
}


const projectNameElement = (projectKey: string): HTMLElement => {

  const element = document.createElement('div')
  element.innerHTML = projectKey
  return element
}
