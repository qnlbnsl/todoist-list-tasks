import { css, CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import { IncomingTask } from '../types';
import { Log } from '../utilities/logger';
import { toTaskModel } from '../utilities/modelConverter';

// This component renders an unordered list of tasks
@customElement('task-list')
export class TaskList extends LitElement {
  // Number of tasks in the object passed in from the parent
  // Static value.
  @property({ attribute: false }) numberOfTasks = 0;
  // Max tasks per list. Can be overriden by parent.
  @property({ attribute: false }) maxTasksPerList = 5;
  // Autoadvance the list or not. can be overriden by parent.
  @property({attribute: false}) autoplay = false;
  @state()
  // Non Null, will make sure that no undefined tasks are passed in ever.
  private tasks!: { [key: string]: IncomingTask };
  // The index to identify currently shown range of tasks
  private currentListIndex = 0;
  // An array to store task IDs with list index numbers.
  // EG: [1]["1","2","3", "4"],[2]["5","6","7", "8"]
  private taskList: number[][] = [];

  /**
   * updates teh current list index to show the next set of tasks
   * An update causes a rerender
   * @returns void
   */
  _updateIndex(): void {
    Log('Updating task list index');
    if (this.currentListIndex === this.numberOfLists() - 1) {
      this.currentListIndex = 0;
    } else this.currentListIndex++;
    this.requestUpdate();
  }
  /**
   * Returns the number of lists required to show all tasks at least once
   * @returns number
   */
  numberOfLists(): number {
    return Math.ceil(this.numberOfTasks / this.maxTasksPerList);
  }
  /**
   * This function updates the list index after a set amount of time
   * The update results in a re-render of the component
   * Also moves the task list forward
   * @returns void
   */
  updateList = (): void => {
    setTimeout(() => {
      this._updateIndex();
    }, 5000);
  };

  /**
   * @param  {number} currentListIndex Starts at 0.
   * @returns number The index from where we would start displaying the tasks
   */
  getTaskStart = (currentListIndex: number): number => {
    return currentListIndex * this.maxTasksPerList;
  };
  // Gets the stop index for the current list
  /**
   * @param  {number} currentListIndex Starts at 0
   * @returns number The index at which we stop rendering any more tasks
   */
  getTaskEnd = (currentListIndex: number): number => {
    const end = this.getTaskStart(currentListIndex) + this.maxTasksPerList - 1;
    if (end > this.numberOfTasks) return this.numberOfTasks-1
    return end;
  };

  private buildTaskList(tasks: { [key: string]: IncomingTask }): void {
    Log("Setting up Task List raw data")
    const taskIds = Object.keys(tasks);
    for (let i = 0; i < this.numberOfLists(); i++) {
      // i is analogous to the current list
      this.taskList[i] = []
      // Log(`Loop #${i}`)
      for (let j = this.getTaskStart(i); j <= this.getTaskEnd(i); j++) {
        const id = Number(taskIds[j])
        this.taskList[i].push(id)
      }
    }
    Log(this.taskList)
  }

  /**
   * SubTemplate for the task list
   * @param  {IncomingTask} task Raw data for the task
   */
  private _taskCard(task: IncomingTask) {
    // Log(task)
    const formatted_task = toTaskModel(task);
    Log(formatted_task)
    return html`<li>${formatted_task.content}</li>`;
  }
  // https://lit.dev/docs/components/styles/
  static get styles(): CSSResultGroup {
    // CSS goes here...
    return css`
      li {
        color: white;
      }
      ul {
        height: 100%;
      }
    `;
  }
  protected render(): TemplateResult | void {
    this.buildTaskList(this.tasks)
    Log(`Task-List: Autoplay is set to: ${this.autoplay}`)
    this.autoplay ? this.updateList() : null;

    return html`
      <ul>
        ${this.taskList[this.currentListIndex].forEach((task) =>{
          return html `${this._taskCard(this.tasks[String(task)])}`
        })}
      </ul>
    `;
  }
}
