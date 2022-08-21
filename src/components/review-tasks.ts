import { css, CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import {customElement, state} from 'lit/decorators.js';
import { IncomingTask, Projects } from '../types';
import { Log } from '../utilities/logger';
import './project-section';

// Full Wrapper for the card. The main body.
@customElement("review-tasks")
export class ReviewTasks extends LitElement {
  @state()
    private projects: Projects | undefined = undefined;

    // https://lit.dev/docs/components/styles/
  static get styles(): CSSResultGroup {
      // CSS goes here...
      return css`
      /* :host {
        display: table-cell
      } */
      div {
        display: table-cell
      }
      `;
  }
  protected render(): TemplateResult {
    // Log(`Review Task -> ${JSON.stringify(this.projects)}`)
    if (this.projects === undefined)
      return html `
        <h1>Good Job!!</h1>
      `
    return html`
    <div>
      ${isEmpty(this.projects?.business)? null : html `<project-section .projectKey="${"Bussiness"}" .tasks="${(this.projects?.business)}"></project-section>`}
      ${isEmpty(this.projects?.school)? null : html`<project-section .projectKey="${"School"}" .tasks="${(this.projects?.school)}"></project-section>`}
      ${isEmpty(this.projects?.work)? null : html`<project-section .projectKey="${"Work"}" .tasks="${(this.projects?.work)}"></project-section>`}
      ${isEmpty(this.projects?.personal)? null : html`<project-section .projectKey="${"Personal"}" .tasks="${(this.projects?.personal)}"></project-section>`}
    </div>
      `
  }
}

const isEmpty = (tasks: {[key: string]: IncomingTask}| undefined): boolean => {
  if (tasks === undefined)
    return true;

  const objlen = Object.keys(tasks).length

  if (objlen > 0)
    return false
  return true;
}
