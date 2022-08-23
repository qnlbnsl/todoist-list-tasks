import { css, CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import { IncomingTask } from '../types';

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
  private projectIcon = 'mdi:briefcase-clock';

  /**
   * @returns CSSResultGroup
   */
  static get styles(): CSSResultGroup {
    return css`
      .icon {
        --mdc-icon-size: 3em;
      }

    `;
  }
  /**
   * @returns TemplateResult
   */
  protected render(): TemplateResult | void {
    console.log("---------------------------Rendering ${this.projectKey}---------------------------------------")
    return html`
      <!-- Set this based on type of project -->
      <ha-icon id="${this.projectKey}" class="icon" icon="${this.projectIcon}"></ha-icon>
      <h1>${this.projectKey}</h1>

    `;
  }
}
