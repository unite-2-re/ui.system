/// <reference types="lit" />

// @ts-ignore
import { Calendar } from 'vanilla-calendar-pro';

// @ts-ignore
import { html, css, unsafeCSS } from "../../shared/LitUse.js";
import LitElementTheme from "../../shared/LitElementTheme.js";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./calendar.scss?inline";

// @ts-ignore
import htmlCode from "./calendar.html?raw";

// @ts-ignore
@customElement('ui-calendar')
export class UICalendar extends LitElementTheme {
    @property({ attribute: true, reflect: true, type: String }) public type: string = "regular";
    #calendar?: any;

    //
    static styles = css`${unsafeCSS(styles)}`;
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        const self = this as unknown as HTMLElement;
        this.importFromTemplate(htmlCode);
        requestIdleCallback(()=>{
            this.#calendar = new Calendar(root?.querySelector?.(".ui-calendar"), {
layouts: {
    default: `<div class="vc-header" data-vc="header" role="toolbar" aria-label="Calendar Navigation">
    <div class="vc-header__content" data-vc-header="content">
        <#Month />
        <#Year />
    </div>

    <div class="vc-header__button">
        <#ArrowPrev [month] />
        <#ArrowNext [month] />
    </div>
</div>
<div class="vc-wrapper" data-vc="wrapper">
    <#WeekNumbers />
    <div class="vc-content" data-vc="content">
    <#Week />
    <#Dates />
    <#DateRangeTooltip />
    </div>
</div>
<#ControlTime />`,
    year: `<div class="vc-header" data-vc="header" role="toolbar" aria-label="Calendar Navigation">
    <div class="vc-header__content" data-vc-header="content">
        <#Month />
        <#Year />
    </div>
    <div class="vc-header__button">
        <#ArrowPrev [month] />
        <#ArrowNext [month] />
    </div>
</div>
<div class="vc-wrapper" data-vc="wrapper">
    <div class="vc-content" data-vc="content">
        <#Years />
    </div>
</div>`,
    month: `<div class="vc-header" data-vc="header" role="toolbar" aria-label="Calendar Navigation">
    <div class="vc-header__content" data-vc-header="content">
        <#Month />
        <#Year />
    </div>
    <div class="vc-header__button">
        <#ArrowPrev [month] />
        <#ArrowNext [month] />
    </div>
</div>
<div class="vc-wrapper" data-vc="wrapper">
    <div class="vc-content" data-vc="content">
        <#Months />
    </div>
</div>`
}});
            this.#calendar?.init?.();
        });
        return root;
    }

    //
    constructor() { super(); }
    public connectedCallback() {
        super.connectedCallback();
        const self = this as unknown as HTMLElement;
        if (!self.getAttribute("data-alpha")) {
            self.setAttribute("data-alpha", "0");
        }
    }
};

//
export default UICalendar;
