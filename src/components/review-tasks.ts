import { css, CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IncomingTask, Projects } from '../types';
import { Log } from '../utilities/logger';

import './project-section';

// Full Wrapper for the card. The main body.
@customElement('review-tasks')
export class ReviewTasks extends LitElement {
  @property({attribute: false}) projectType=["Work","School","Business","Personal"]
  @property({attribute: false}) autoplay = false;
  @state()
    private projects: Projects | undefined = undefined;
    private index = 0;
    private numberOfTasksPerProject: number[] = [];
    private maxTasksPerList = 5;
  __setVariableIndex(): void {
    for(let i =0; i< this.projectType.length; i++){
      if(this.projects != undefined) {
        const totalTasks = Object.keys(this.projects[this.projectType[i].toLowerCase()])
        // Log(totalTasks)
        this.numberOfTasksPerProject.push(totalTasks.length)
      }
    }
  }

  _updateIndex(): void {
    Log("Updating index")
    if(this.index === 3){
      this.index = 0;
    } else this.index++
    this.requestUpdate();
  }

  numberOfLists(): number {
    return Math.ceil(this.numberOfTasksPerProject[this.index]/this.maxTasksPerList)
  }
  // Timeout for entire project. Number of lists x 5000
  // Number of lists in a project = round up (numberOfTasksPerProject/5)
  timeout = (): void => {
    setTimeout(()=>{
      this._updateIndex();
    }, this.numberOfLists()*5000)
  }

  // https://lit.dev/docs/components/styles/
  static get styles(): CSSResultGroup {
    // CSS goes here...
    return css`
      div {
        height: 15vh;
        width: 100%;
        display: flex;
        overflow: hidden;
      }
      .item {
        width: 100%;
        margin-left: 20px;
        margin-right: 20px;
      }
      .hide {
        display: none;
      }
    `;
  }

  section(projects: Projects, index: number, numberOfTasksPerProject: number[]): TemplateResult | null{
   if(index<0 || index > this.projectType.length) return null;

   const key = this.projectType[index]
   return html `<project-section class="item" .numberOfTasks="${numberOfTasksPerProject[this.index]}" .projectKey="${key}" .tasks="${projects[key.toLowerCase()]}"></project-section>`
  }
  protected render(): TemplateResult {
    Log(`Review Tasks: Autoplay is set to: ${this.autoplay}`)
    // TODO: Format this nicely.
    if (this.projects === undefined) return html` <h1>Good Job!!</h1> `;
    this.autoplay ? this.timeout() : null
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



const isEmpty = (tasks: { [key: string]: IncomingTask } | undefined): boolean => {
  if (tasks === undefined) return true;
  const objlen = Object.keys(tasks).length;
  if (objlen > 0) return false;
  return true;
};
