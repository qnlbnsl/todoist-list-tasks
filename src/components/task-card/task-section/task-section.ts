import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import { IncomingTask, TaskModel } from '../../../types';
import { toTaskModel } from '../../../utilities/modelConverter';
import './task-list-deprecated/task-list'
import { task_section_css } from './css';
import {range} from 'lit/directives/range'
import {map} from 'lit/directives/map';
import {ifDefined} from 'lit/directives/if-defined'
// This component renders an unordered list of tasks
@customElement('task-section')
export class TaskSection extends LitElement {
  @property({ attribute: false }) maxTasksPerList = 5;
  @property({attribute: false}) nextListDelay!: number;

  // Non Null, will make sure that no undefined tasks are passed in ever.
  @state() private taskListTasks!: TaskModel[]
  @state() private tasks!: { [key: string]: IncomingTask };
  @state() private startIndex = 0
  // Non Null.
  private _timerInterval!: NodeJS.Timeout | number;

  private async _notify() {
    await this.updateComplete;
    console.log("Task-Section: List Finished")
    const name = "list_finished"
    this.dispatchEvent(new CustomEvent(name, {bubbles: true, composed: true}));
    await this.updateComplete
    this.taskListTasks = this.buildFullList()
  }


  // Gets the stop index for the current list
  /**
   * @param  {number} currentListIndex Starts at 0
   * @returns number The index at which we stop rendering any more tasks
   */
  getTaskEnd = (): number => {
    const end = this.startIndex + this.maxTasksPerList;
    if (end > this.taskListTasks.length) {
      return this.taskListTasks.length-1
    }
    return end;
  };

  /**
   * updates the current list index to show the next set of tasks
   * An update causes a rerender
   * @returns void
   */
  _updateIndex(): void {
    // Subtract 1 as index starts at 0.
    // List has ended now. We will have the event listener update..
    // console.log("updating Index")
    if(this.getTaskEnd() == this.taskListTasks.length -1){
      this.startIndex = 0
    } else this.startIndex += this.maxTasksPerList
    // console.log(`New index: ${this.startIndex}`)
  }


  private buildFullList = (): TaskModel[] => {
    console.log("Task-Section: Building Full List")
    const list: TaskModel[] = [];
    Object.keys(this.tasks).forEach(id => {
      list.push(toTaskModel(this.tasks[id]))
    })
    return list
  }

  /**
   * @returns CSSResultGroup
   */
  static get styles(): CSSResultGroup {
    // CSS goes here...
    return task_section_css
  }

  protected firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void {
    console.log("Task-Section: First Updated")
    console.log(_changedProperties)
    this.taskListTasks = this.buildFullList()
    console.log(this.taskListTasks)
  }

  async connectedCallback() {
    console.log("Task-Section: Connected")
    super.connectedCallback();
    // I will wait for the first updated funtion and updated to get resolved. This should give us enough time...
    await this.updateComplete
    this._timerInterval = setInterval(() => {
      // console.log("Update index")
      const tasksInList = this.getTaskEnd() - this.startIndex
      // console.log(tasksInList)
      if( tasksInList < this.maxTasksPerList || this.getTaskEnd() == this.taskListTasks.length){
        // Emit event here that we need to change Projects
        this._notify();
      }
      this._updateIndex();
    }, 10000);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(Number(this._timerInterval));
  }

  protected renderList = (taskList: TaskModel[], startIndex:number, endIndex:number): TemplateResult => {
    return html `${map(range(startIndex, endIndex, 1), (i: number) => html`
      <li>${taskList[i].content}</li>
    `)}`
  }

  /**
   * @returns TemplateResult
   */
  protected render(): TemplateResult | null {
    console.log("Task-Section: Rendering")
    // console.log(this.taskListTasks)
    if (ifDefined(this.taskListTasks) && this.taskListTasks != undefined){
      return html`<ul>${this.renderList(this.taskListTasks, this.startIndex, this.getTaskEnd())}</ul>`
    }
    else return null;
  }
}
