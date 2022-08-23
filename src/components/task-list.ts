import { css, CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import { IncomingTask } from '../types';
import { Log } from '../utilities/logger';
import { toTaskModel } from '../utilities/modelConverter';

// This component renders an unordered list of tasks
@customElement('task-list')
export class TaskList extends LitElement {
  @state()
  // Non Null, will make sure that no undefined tasks are passed in ever.
  private tasks!: { [key: string]: IncomingTask };
  // The index to identify currently shown range of tasks
  private currentListIndex = 0;
  // private taskList: number[][] = this.buildTaskList(this.tasks);
  // Number of tasks in the object passed in from the parent
  // Static value.
  @property({ attribute: false }) numberOfTasks = 0;
  // Max tasks per list. Can be overriden by parent.
  @property({ attribute: false }) maxTasksPerList = 5;
   // Max tasks per list. Can be overriden by parent.
   @property({ attribute: false }) TaskListBuilt = false;
  // Autoadvance the list or not. can be overriden by parent.
  @property({attribute: false}) taskAutoplay = false;
  // An array to store task IDs with list index numbers.
  // EG: [1]["1","2","3", "4"],[2]["5","6","7", "8"]
  @property({type: Array})  private taskList: number[][] = []//this.buildTaskList(this.tasks);



  /**
   * updates teh current list index to show the next set of tasks
   * An update causes a rerender
   * @returns void
   */
  _updateIndex(): void {
    Log('Task-List:_updateIndex-> Updating task list index');
    if (this.currentListIndex == this.numberOfLists()) {
      this.currentListIndex = 0;
    } else this.currentListIndex++;
    Log(this.currentListIndex)
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
      Log("Task-List:UpdateList->updating......")
      this._updateIndex();
    }, 10000);
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

  private buildTaskList(tasks: { [key: string]: IncomingTask }): number[][] {
    const list: number[][] = [];
    Log(`Task-List:BuildTaskList-> Setting up Task List raw data for ${this.numberOfLists()} lists `)
    const taskIds = Object.keys(tasks);
    for (let i = 0; i < this.numberOfLists(); i++) {
      // i is analogous to the current list
      list[i] = []
      // Log(`Loop #${i}`)
      for (let j = this.getTaskStart(i); j <= this.getTaskEnd(i); j++) {
        const id = Number(taskIds[j])
        list[i].push(id)
      }
    }
    Log(`Task-List:BuildTaskList-> Returning List `)
    this.TaskListBuilt = true
    return list;
  }

  /**
   * SubTemplate for the task list
   * @param  {IncomingTask} task Raw data for the task
   */
  private _taskCard(task: IncomingTask) {
    Log(`Task-List:_taskCard->`)
    Log(task)
    const formatted_task = toTaskModel(task);
    // Log(formatted_task)
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
        margin: 0px;
        align-self: center;
      }
    `;
  }

  protected render(): TemplateResult | void {
    this.TaskListBuilt ? null : this.taskList = this.buildTaskList(this.tasks)
    // Log(`Task-List: Autoplay is set to: ${this.taskAutoplay}`)
    this.taskAutoplay ? this.updateList() : null;
    // debugger;
    return html`
      <ul>

            ${this.taskList[this.currentListIndex].map((task) => {
              Log(`Task-List:Render()->`)
              Log(task)
              return html `${this._taskCard(this.tasks[String(task)])}`
              })}


      </ul>
    `;
  }
}
