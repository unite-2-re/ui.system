/// <reference types="lit" />

// @ts-ignore
import { Calendar } from 'vanilla-calendar-pro';

// @ts-ignore
import ThemedElement from "@blit/shared/ThemedElement";

// @ts-ignore
import styles from "@scss/foreign/fe-calendar.scss?inline";

// @ts-ignore /* @vite-ignore */
import { defineElement, E, H, property } from "/externals/modules/blue.js";

// @ts-ignore /* @vite-ignore */
import { loadInlineStyle } from "/externals/modules/dom.js";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
const loading = fetch(preInit, {priority: "high", keepalive: true, cache: "force-cache", mode: "same-origin"});
const styled  = loadInlineStyle(preInit, null, "ux-layer");
const marked  = H`<div class="ui-calendar"></div>`;

// @ts-ignore
@defineElement('ui-calendar')
export class UICalendar extends ThemedElement {
    @property({ source: "attr" }) public type?: string; //= "regular";
    #calendar?: any;
    wrapper?: any;

    //
    public styles = () => styled.cloneNode(true);
    public render = () => marked.cloneNode(true);

    //
    protected initialAttributes = { "data-alpha": 0 };
    protected onRender() {
        const self = this as unknown as HTMLElement;
        const wrapper = this.shadowRoot.querySelector(".ui-calendar");
        this.#calendar = new Calendar(wrapper, {
            layouts: {
                default: `<div class="vc-header" data-vc="header" role="toolbar" aria-label="Calendar Navigation"><div class="vc-header__content" data-vc-header="content"><#Month /><#Year /></div><div class="vc-header__button"><#ArrowPrev [month] /><#ArrowNext [month] /></div></div><div class="vc-wrapper" data-vc="wrapper"><#WeekNumbers /><div class="vc-content" data-vc="content"><#Week /><#Dates /><#DateRangeTooltip /></div></div><#ControlTime />`,
                year: `<div class="vc-header" data-vc="header" role="toolbar" aria-label="Calendar Navigation"><div class="vc-header__content" data-vc-header="content"><#Month /><#Year /></div><div class="vc-header__button"><#ArrowPrev [month] /><#ArrowNext [month] /></div></div><div class="vc-wrapper" data-vc="wrapper"><div class="vc-content" data-vc="content"><#Years /></div></div>`,
                month: `<div class="vc-header" data-vc="header" role="toolbar" aria-label="Calendar Navigation"><div class="vc-header__content" data-vc-header="content"><#Month /><#Year /></div><div class="vc-header__button"><#ArrowPrev [month] /><#ArrowNext [month] /></div></div><div class="vc-wrapper" data-vc="wrapper"><div class="vc-content" data-vc="content"><#Months /></div></div>`
            }});
        this.#calendar?.init?.();
        self.style.removeProperty("display");
    }
};

//
export default UICalendar;
