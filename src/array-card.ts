/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers

import type { ArrayCardConfig, Projects } from './types';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';
import './components/ha-wrapper';

console.info(
  `%c  Array-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker.
// Grabs customCards from HA's DOM or initializes it.
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'array-card',
  name: 'Array Card',
  description: 'A custom card for you to pass in an array as an attribute with a sensor',
});

// Defines out custom element by extending LitElement Library.
// TypeScript version of window.customElements.define.
@customElement('array-card')
export class ArrayCard extends LitElement {
  // Adds the editor card ui. I think this function is a part of hassio lovelace.
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./editor');
    return document.createElement('array-card-editor');
  }

  // TODO: Figure out what this does
  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  // TODO: Add any properities that should cause your element to re-render.
  /**
   * https://lit.dev/docs/components/properties/
   * @property is a typescript tag that is used to define a property.
   * It takes in the option for attribute.
   * When false, the property decaled will not be observed. If true then the property will be observed.
   *    NOTE: the default is to convert the attribute to lower case
   *    eg: MyProp would be myprop
   * Atttribute can also be set to string to override the observed proeprty name.
   *    eg: MyProp's default myprop can be overrriden {Attribute: 'my-prop'}
   * The `!` is a "Non Null Assertion Operator"
   * Basically states that hass will never be null so ignore the possibility.
   * Mainly for typescript to stop complaining.
   */
  @property({ attribute: false })
  public hass!: HomeAssistant;

  // Defines the state of teh custom element as config.
  // Typescript state. Lit will check if the value changes.
  /**
   * Lit also supports "internal reactive state".
   * Internal reactive state refers to reactive properties that
   * aren't part of the component's API. These properties don't
   * have a corresponding attribute, and are typically marked
   * protected or private in TypeScript.
   */
  @state()
  private config!: ArrayCardConfig;

  // https://lit.dev/docs/components/properties/#accessors-custom
  // Set the config. When and how is this being called?
  public setConfig(config: ArrayCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      ...config,
      name: 'Array',
    };
  }

  // https://lit.dev/docs/components/lifecycle/#reactive-update-cycle-performing
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  // https://lit.dev/docs/components/rendering/
  protected render(): TemplateResult | void {
    // TODO Check for stateObj or other necessary things and render a warning if missing
    if (this.config.show_warning) {
      return this._showWarning(localize('common.show_warning'));
    }

    if (this.config.show_error) {
      return this._showError(localize('common.show_error'));
    }

    this.config.projects = getProjectData(this.hass, this.config.entity as keyof typeof this.hass);

    return html`
      <ha-card>
        <review-tasks .projects="${this.config.projects}"></review-tasks>
      </ha-card>
    `;
  }

  private _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this.config && ev.detail.action) {
      handleAction(this, this.hass, this.config, ev.detail.action);
    }
  }

  private _showWarning(warning: string): TemplateResult {
    return html` <hui-warning>${warning}</hui-warning> `;
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this.config,
    });

    return html` ${errorCard} `;
  }

  // https://lit.dev/docs/components/styles/
  static get styles(): CSSResultGroup {
    // CSS goes here...
    return css``;
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getProjectData = (hass: HomeAssistant, entity: string): Projects => {
  console.log('Getting Project Data');
  return hass.states[entity].attributes.projects;
};

