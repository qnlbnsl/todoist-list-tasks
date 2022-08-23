import { css, CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IncomingTask, Projects } from '../types';

import './project-section';
import './task-list'

// Full Wrapper for the card. The main body.
@customElement('task-card')
export class TaskCard extends LitElement {
  @property({attribute: false}) projectType=["Work","School","Business","Personal"]
  @property({attribute: false}) projectAutoplay = false;
  @property({attribute: false}) taskAutoplay = true;
  @state()
    private projects: Projects | undefined = undefined;
    private index = 0;
    private numberOfTasksPerProject: number[] = [];
    private maxTasksPerList = 5;
    /**
     * @returns void
     */
  __setVariableIndex = (): void => {
    for(let i =0; i< this.projectType.length; i++){
      if(this.projects != undefined) {
        const totalTasks = Object.keys(this.projects[this.projectType[i].toLowerCase()])
        // console.log(totalTasks)
        this.numberOfTasksPerProject.push(totalTasks.length)
      }
    }
  }
  /**
   * @returns void
   */
  _updateIndex = (): void => {
    console.log("TaskCard: _updateIndex")
    if(this.index === 3){
      this.index = 0;
    } else this.index++
    this.requestUpdate();
  }
  /**
   * @returns number
   */
  numberOfLists = (): number => {
    return Math.ceil(this.numberOfTasksPerProject[this.index]/this.maxTasksPerList)
  }
  /**
   * @returns void
   * Timeout for entire project. Number of lists x 5000
   * Number of lists in a project = round up (numberOfTasksPerProject/5)
   */
  nextProject = (): void => {
    setTimeout(()=>{
      this._updateIndex();
    }, this.numberOfLists()*10000)
  }

  /**
   * @returns CSSResultGroup
   */
  static get styles (): CSSResultGroup {
    // https://lit.dev/docs/components/styles/
    // CSS goes here...
    return css`
      div {
        color: white;
        display: grid;
        justify-content: flex-start;
        grid-auto-flow: column;
        gap: 4px;
        margin-left: 2vw;
        padding: 10px;
      }
      project-section {
        text-align: center;
        width: 15vw;
        margin-top: auto;
      }
      task-list {
        padding-left: 3em;
      }
    `;
  }

  /**
   * @param  {Projects} projects
   * @param  {number} index
   * @param  {number[]} numberOfTasksPerProject
   * @returns TemplateResult
   */
  section = (projects: Projects, index: number, numberOfTasksPerProject: number[]): TemplateResult | null => {
   if(index<0 || index > this.projectType.length) return null;

   const key = this.projectType[index]
   return html `
   <project-section .numberOfTasks="${numberOfTasksPerProject[this.index]}" .tasks="${projects[key.toLowerCase()]}" .projectKey="${key}"></project-section>
   <task-list .numberOfTasks="${numberOfTasksPerProject[this.index]}" .tasks="${projects[key.toLowerCase()]}" .taskAutoplay="${this.taskAutoplay}"></task-list>
   `
  }

  /**
   * @returns TemplateResult
   */
  protected render = (): TemplateResult => {
    // console.log(`Review Tasks: Autoplay is set to: ${this.projectAutoplay}`)
    // TODO: Format this nicely.
    if (this.projects === undefined) return html` <h1>Good Job!!</h1> `;
    this.projectAutoplay ? this.nextProject() : null
    this.__setVariableIndex();
    // Skip the rendering of empty projects.
    if (isEmpty(this.projects[this.projectType[this.index].toLowerCase()])) this._updateIndex()
    return html`
      <div>
        ${this.section(this.projects,this.index, this.numberOfTasksPerProject)}
      </div>
    `;
  }
}


/**
 * @param  {{[key:string]:IncomingTask}|undefined} tasks
 * @returns boolean
 */
const isEmpty = (tasks: { [key: string]: IncomingTask } | undefined): boolean => {
  if (tasks === undefined) return true;
  const objlen = Object.keys(tasks).length;
  if (objlen > 0) return false;
  return true;
};
