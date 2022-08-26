import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Projects } from '../../types';
import { IsEmpty } from '../../utilities/isEmpty';

import './project-section/project-section';
import './task-section/task-section';
import './css';
import { task_card_css } from './css';

// Full Wrapper for the card. The main body.
@customElement('task-card')
export class TaskCard extends LitElement {
  @property({ attribute: false }) projectType = ['Work', 'School', 'Business', 'Personal'];
  @property({ attribute: false }) projectIcon = ['mdi:briefcase-clock','mdi:account-school', 'mdi:card-account-details', 'mdi:account-circle'];
  @property({ attribute: false }) nextTaskListDelay = 10000;
  @property({ attribute: false }) private maxTasksPerList = 5;
  @state() private projects!: Projects;
  @state() private projectIndex = 0;

  /**
   * Update teh project index
   * @returns void
   */
  _updateProjectIndex = (): void => {
    console.log('TaskCard: _updateIndex');
    if (this.projectIndex === 3) {
      this.projectIndex = 0;
    } else {
      this.projectIndex++;
      //Lets skip empty projects here as well.
      if(IsEmpty(this.projects[this.projectType[this.projectIndex].toLowerCase()])) this._updateProjectIndex()

    }
    this.requestUpdate();
  };


  /**
   * @param  {Projects} projects
   * @param  {number} projectIndex
   * @param  {number[]} numberOfTasksPerProject
   * @returns TemplateResult
   */
  section = (projects: Projects, projectIndex: number): TemplateResult | null => {
    if (projectIndex < 0 || projectIndex > this.projectType.length) return null;
    const taskArray = projects[this.projectType[this.projectIndex].toLowerCase()]
    return html`
      <project-section
      .projectKey="${this.projectType[projectIndex]}"
      .projectIcon="${this.projectIcon[projectIndex]}"
      ></project-section>
      <task-section
        .tasks="${taskArray}"
        .nextListDelay="${this.nextTaskListDelay}"
      ></task-section>
    `;
  };

  /**
   * @returns CSSResultGroup
   */
  static get styles(): CSSResultGroup {
    // https://lit.dev/docs/components/styles/
    // CSS goes here...
    return task_card_css;
  }

  protected updated(_changedProperties: Map<string | number | symbol, unknown>): void {
    console.log("Task-CARD updated")
    console.log(_changedProperties)
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('list_finished', (e: Event)=>{
      console.log(e)
      this._updateProjectIndex()
    });
  }
  disconnectedCallback() {
    window.removeEventListener('list_finished', (e: Event)=>{
      console.log(e)
      this._updateProjectIndex()
    });
    super.disconnectedCallback();
  }

  /**
   * @returns TemplateResult
   */
  protected render = (): TemplateResult => {
    // No tasks sooooo.
    if (this.projects === undefined) return html` <h1>Good Job!!</h1> `;
    return html` <div>${this.section(this.projects, this.projectIndex)}</div> `;
  };
}
