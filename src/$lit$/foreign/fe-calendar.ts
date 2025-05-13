/// <reference types="lit" />

// @ts-ignore
import { Calendar } from 'vanilla-calendar-pro';
import { setAttributesIfNull } from '@service/Utils';

// @ts-ignore
import { css, unsafeCSS } from "@mods/shared/LitUse";
import LitElementTheme from "@mods/shared/LitElementTheme";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "@scss/foreign/fe-calendar.scss?inline";

// @ts-ignore /* @vite-ignore */
import { E } from '/externals/lib/blue.js';

// @ts-ignore
@customElement('ui-calendar')
export class UICalendar extends LitElementTheme {
    @property({ attribute: true, reflect: true, type: String }) public type?: string; //= "regular";
    #calendar?: any;

    //
    static styles = css`${unsafeCSS(`@layer ux-layer {${styles}};`)}`;
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        const self = this as unknown as HTMLElement;

        //
        let calendar = E("div.ui-calendar");
        this.nodes = [calendar.element];

        //self.style.display = "none";
        requestIdleCallback(()=>{
            this.#calendar = new Calendar(calendar.element, {
                layouts: {
                    default: `<div class="vc-header" data-vc="header" role="toolbar" aria-label="Calendar Navigation"><div class="vc-header__content" data-vc-header="content"><#Month /><#Year /></div><div class="vc-header__button"><#ArrowPrev [month] /><#ArrowNext [month] /></div></div><div class="vc-wrapper" data-vc="wrapper"><#WeekNumbers /><div class="vc-content" data-vc="content"><#Week /><#Dates /><#DateRangeTooltip /></div></div><#ControlTime />`,
                    year: `<div class="vc-header" data-vc="header" role="toolbar" aria-label="Calendar Navigation"><div class="vc-header__content" data-vc-header="content"><#Month /><#Year /></div><div class="vc-header__button"><#ArrowPrev [month] /><#ArrowNext [month] /></div></div><div class="vc-wrapper" data-vc="wrapper"><div class="vc-content" data-vc="content"><#Years /></div></div>`,
                    month: `<div class="vc-header" data-vc="header" role="toolbar" aria-label="Calendar Navigation"><div class="vc-header__content" data-vc-header="content"><#Month /><#Year /></div><div class="vc-header__button"><#ArrowPrev [month] /><#ArrowNext [month] /></div></div><div class="vc-wrapper" data-vc="wrapper"><div class="vc-content" data-vc="content"><#Months /></div></div>`
                }});
            this.#calendar?.init?.();
            self.style.removeProperty("display");
        });
        return root;
    }

    //
    constructor() { super(); }
    public connectedCallback() {
        super.connectedCallback();
        const self = this as unknown as HTMLElement;
        setAttributesIfNull(self, {"data-alpha": 0});
    }
};

//
export default UICalendar;
