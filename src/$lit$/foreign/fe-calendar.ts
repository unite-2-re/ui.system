/// <reference types="lit" />

// @ts-ignore
import { Calendar } from 'vanilla-calendar-pro';

// @ts-ignore
import ThemedElement from "@mods/shared/LitElementTheme";

// @ts-ignore
import styles from "@scss/foreign/fe-calendar.scss?inline";

// @ts-ignore /* @vite-ignore */
import { defineElement, E, H, property } from '/externals/lib/blue.js';

// @ts-ignore
@defineElement('ui-calendar')
export class UICalendar extends ThemedElement {
    @property({ source: "attr" }) public type?: string; //= "regular";
    #calendar?: any;
    wrapper?: any;

    //
    public styles = () => styles;
    public render = () => H`${this.wrapper}`;

    //
    protected initialAttributes = { "data-alpha": 0 };
    protected onInitialize() {
        super.onInitialize?.();
        const self = this as unknown as HTMLElement;
        this.wrapper = E("div.ui-calendar");
        this.#calendar = new Calendar(this.wrapper, {
            layouts: {
                default: `<div class="vc-header" data-vc="header" role="toolbar" aria-label="Calendar Navigation"><div class="vc-header__content" data-vc-header="content"><#Month /><#Year /></div><div class="vc-header__button"><#ArrowPrev [month] /><#ArrowNext [month] /></div></div><div class="vc-wrapper" data-vc="wrapper"><#WeekNumbers /><div class="vc-content" data-vc="content"><#Week /><#Dates /><#DateRangeTooltip /></div></div><#ControlTime />`,
                year: `<div class="vc-header" data-vc="header" role="toolbar" aria-label="Calendar Navigation"><div class="vc-header__content" data-vc-header="content"><#Month /><#Year /></div><div class="vc-header__button"><#ArrowPrev [month] /><#ArrowNext [month] /></div></div><div class="vc-wrapper" data-vc="wrapper"><div class="vc-content" data-vc="content"><#Years /></div></div>`,
                month: `<div class="vc-header" data-vc="header" role="toolbar" aria-label="Calendar Navigation"><div class="vc-header__content" data-vc-header="content"><#Month /><#Year /></div><div class="vc-header__button"><#ArrowPrev [month] /><#ArrowNext [month] /></div></div><div class="vc-wrapper" data-vc="wrapper"><div class="vc-content" data-vc="content"><#Months /></div></div>`
            }});
        this.#calendar?.init?.();
        self.style.removeProperty("display");
        return this;
    }
};

//
export default UICalendar;
