/// <reference types="lit" />

// @ts-ignore
import { Calendar } from 'vanilla-calendar-pro';

// @ts-ignore
import layout from 'vanilla-calendar-pro/styles/layout.css?inline';

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
    static styles = css`${unsafeCSS(layout)}${unsafeCSS(styles)}`;
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        const self = this as unknown as HTMLElement;
        this.importFromTemplate(htmlCode);
        requestIdleCallback(()=>{
            console.log(root?.querySelector?.(".ui-calendar"));
            this.#calendar = new Calendar(root?.querySelector?.(".ui-calendar"));
            this.#calendar?.init?.();
            console.log(this.#calendar);
        });
        return root;
    }

    //
    constructor() { super(); }
    public connectedCallback() {
        super.connectedCallback();
        const self = this as unknown as HTMLElement;
        self.setAttribute("data-scheme", "solid");
    }
};

//
export default UICalendar;
