import { css, CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import { IncomingTask } from '../types';
import { Log } from '../utilities/logger';

import './task-list';
// This component renders the body of the Task List. Just a container.
// Mainly there for the heading.
// TODO: Do i need this?!?!?!

@customElement('project-section')
export class ProjectSection extends LitElement {
  @property({attribute:false}) numberOfTasks = 0
  @state()
  private tasks!: { [key: string]: IncomingTask };
  @state()
  private projectKey = '';

  // https://lit.dev/docs/components/styles/
  static get styles(): CSSResultGroup {
    // CSS goes here...
    return css`
      div {
        color: white;
        display: flex;
        position: absolute;
        top: 25%;
        flex-direction: column;
        align-items: center;
      }
      .icon {
        --mdc-icon-size: 3em;
      }
      task-list {
        display: flex;
        position: absolute;
        left: 15vw;
        height: 100%;
        overflow: hidden;
      }
    `;
  }
  protected render(): TemplateResult | void {
    return html`
      <div>
        <ha-icon id="${this.projectKey}" class="icon" icon="mdi:briefcase-clock"></ha-icon>
        <h1>${this.projectKey}</h1>
      </div>

      <task-list .tasks="${this.tasks}" .numberOfTasks="${this.numberOfTasks}"></task-list>
    `;
  }
}
