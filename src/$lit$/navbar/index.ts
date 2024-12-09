/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import htmlCode from "./index.html?raw";

// @ts-ignore
import styles from "./index.scss?inline";

// @ts-ignore
import {initTaskManager} from "/externals/core/core.js";
import LitElementTheme from "../shared/LitElementTheme";

// @ts-ignore
@customElement('ui-navbar')
export class UINavBar extends LitElementTheme {
    @property({attribute: true, reflect: true, type: String}) icon : string = "";
    @property({attribute: true, reflect: true, type: String}) label: string = "";
    @property() public taskManager?: any;

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`;

    //
    protected render() {
        return html`${this.themeStyle}
            <button type="button" class="ui-menu-button"  part="ui-menu-button"  @click=${this.menuAction.bind(this)}><ui-icon inert icon="menu"></ui-icon></button>
            <button type="button" class="ui-back-button"  part="ui-back-button"  @click=${this.backAction.bind(this)}><ui-icon inert icon="chevron-down"></ui-icon></button>
            <button type="button" class="ui-title-handle" part="ui-title-handle" @click=${this.menuAction.bind(this)}><ui-icon inert icon=${this.icon}></ui-icon><span>${this.label}</span></button>
        `;
    }

    //
    protected adaptiveTheme() {
        const self = this as unknown as HTMLElement;
        const setTheme = ()=>{
            //if (matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches) {
                self.setAttribute("data-scheme", document.body.matches(":has(ui-frame:not([data-hidden]))") ? "solid" : "dynamic-transparent");
            //} else {
                //self.setAttribute("data-scheme", "solid");
            //}
        }
        setInterval(setTheme, 1000);
    }

    //
    constructor(options = {icon: "", padding: "", taskManager: null}) {
        super(); const self = this as unknown as HTMLElement;
        self.classList?.add?.("ui-navbar");
        self.style.setProperty("z-index", "9999", "important");
        this.taskManager ??= options?.taskManager || initTaskManager();
    }

    //
    protected menuAction() {
        const navbar = document.querySelector("ui-taskbar") as HTMLElement;
        if (matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches) {
            if (navbar) { if (navbar.dataset.hidden != null) { delete navbar.dataset.hidden; } else { navbar.dataset.hidden = ""; } };
        }
    }

    //
    protected backAction(ev) {
        const navbar = document.querySelector("ui-taskbar:not([data-hidden])") as HTMLElement;
        const hash = (location.hash && location.hash != "#") ? location.hash : this.taskManager?.getOnFocus?.()?.id;
        console.log(hash);
        if (matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches) {
            if (navbar) { navbar.dataset.hidden = ""; return; };
        }
        if (this.taskManager?.inFocus?.(hash)) {
            this.taskManager?.deactivate?.(hash); return;
        }
        history.back();
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);
        this.adaptiveTheme();
        return root;
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        if (!self.hasAttribute("data-chroma"))          { self.setAttribute("data-chroma"         , "0.05" ); };
        if (!self.hasAttribute("data-scheme"))          { self.setAttribute("data-scheme"         , "dynamic-transparent"); };
        if (!self.hasAttribute("data-highlight"))       { self.setAttribute("data-highlight"      , "4"    ); };
        if (!self.hasAttribute("data-highlight-hover")) { self.setAttribute("data-highlight-hover", "6"    ); };
    }

}
