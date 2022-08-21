import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators";
import { IncomingTask } from "../types";
import { Log } from "../utilities/logger";

import "./task-list"
// _tasks: { [key: string]: IncomingTask }

@customElement("project-section")
export class ProjectSection extends LitElement {
  @state()
    private tasks!: {[key: string]: IncomingTask};
  @state()
    private projectKey = "";

    // https://lit.dev/docs/components/styles/
    static get styles(): CSSResultGroup {
      // CSS goes here...
      return css`
      h1 {
        color: blue
      }
      `;
    }
  protected render(): TemplateResult | void {
    // Log(`PROJECT SECTION :${this.projectKey}`)
    // Log(this.tasks)
    return html `
    <h1>${this.projectKey}</h1>
    <task-list .tasks = "${this.tasks}"></task-list>
    `
  }
}
