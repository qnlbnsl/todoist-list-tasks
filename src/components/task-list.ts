import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators";
import { IncomingTask } from "../types";
import { Log } from "../utilities/logger";
import { toTaskModel } from "../utilities/modelConverter";

// _tasks: { [key: string]: IncomingTask }

@customElement("task-list")
export class TaskList extends LitElement {
  // Non Null, will make sure that no undefined tasks are passed in ever.
  @state()
    private tasks!: {[key: string]: IncomingTask};

  private _taskCard(task: IncomingTask) {
    const formatted_task = toTaskModel(task)
    // Here we have the raw data for the task.
    // We can now format the card the way we want...
    return html `<li>${formatted_task.content}</li>`
  }
   // https://lit.dev/docs/components/styles/
   static get styles(): CSSResultGroup {
    // CSS goes here...
    return css`
      li {
        color: green
      }
    `;
  }
  protected render(): TemplateResult | void {
    Log("TASK LIST")
    Log(this.tasks)
    return html `
    <ul>
      ${Object.entries(this.tasks).map(([_key, task]) => html `${this._taskCard(task)}`) }
    </ul>
    `
  }
}
