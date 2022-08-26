import { CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators';
import { project_section_css } from './css';

// This component renders the body of the Task List. Just a container.
// Mainly there for the heading.
// TODO: Do i need this?!?!?!

@customElement('project-section')
export class ProjectSection extends LitElement {
  @property() private projectIcon = 'mdi:briefcase-clock';
  @property() projectKey = "";


  /**
   * @returns CSSResultGroup
   */
  static get styles(): CSSResultGroup {
    return project_section_css
  }
  /**
   * @returns TemplateResult
   */
  protected render(): TemplateResult | void {
    console.log(`---------------------------Rendering Project: ${this.projectKey}---------------------------------------`)
    return html`
      <!-- Set this based on type of project -->
      <ha-icon id="${this.projectKey}" class="icon" icon="${this.projectIcon}"></ha-icon>
      <h1>${this.projectKey}</h1>

    `;
  }
}
