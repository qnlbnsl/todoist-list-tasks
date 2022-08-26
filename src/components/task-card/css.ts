import { css, CSSResultGroup } from "lit";

 /**
   * @returns CSSResultGroup
   */
  export const task_card_css: CSSResultGroup=  css`
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
