// whole dedicated, separate element for lucide icons...
// this component (or lucide icons) may to be distributed with main package.
/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, PropertyValues } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./index.scss?inline";

//
import LitElementTheme from "../shared/LitElementTheme";

// @ts-ignore
@customElement('ui-shaped')
export class UIShaped extends LitElementTheme {

    // theme style property
    @property({attribute: true, reflect: true, type: String}) icon: string = "";

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`;
    protected render() {
        return html`${this.themeStyle}<slot></slot> <ui-icon data-chroma="0" data-alpha="0" style="padding: 25%;" icon=${this.icon}></ui-icon>`;
    }

    //
    constructor(options = {icon: "", padding: ""}) {
        super(); const self = this as unknown as HTMLElement;
        if (options?.icon) { this.icon = options?.icon; };

        // vacuum issue
        //setInterval(()=>{
            //const icon = (self as any).shadowRoot?.querySelector?.("ui-icon");
            ///const computed = getComputedStyle(self);
            //const color = computed?.getPropertyValue?.("color") || computed?.getPropertyValue?.("stroke") || "inherit";
            //icon?.style?.setProperty?.("stroke", color, "");
            //icon?.style?.setProperty?.("color", color, "");

            //
            //(self as any)?.setAttribute("data-scheme", (self as any)?.closest("[data-scheme]")?.getAttribute?.("data-scheme") || (self as any)?.getAttribute?.("data-scheme"));
            //(icon as any)?.setAttribute("data-scheme", (self as any)?.getAttribute?.("data-scheme"));
        //}, 100);
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        if (!self.hasAttribute("data-chroma")) { self.setAttribute("data-chroma", "0.1"); };
        if (!self.hasAttribute("data-scheme")) { self.setAttribute("data-scheme", "solid"); };
        if (!self.hasAttribute("data-highlight")) { self.setAttribute("data-highlight", "0"); };
        if (!self.hasAttribute("data-alpha")) { self.setAttribute("data-alpha", "0"); };
        if (!self.classList?.contains?.("ui-shaped")) { self.classList?.add?.("ui-shaped"); };
        if (!self.classList?.contains?.("u2-shaped")) { self.classList?.add?.("u2-shaped"); };
    }
}

//
export default UIShaped;