// whole dedicated, separate element for lucide icons...
// this component (or lucide icons) may to be distributed with main package.
/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic, PropertyValues } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./index.scss?inline";

//
import LitElementTheme from "../shared/LitElementTheme";

// @ts-ignore
const ICON_MODULE = import("/externals/vendor/lucide.min.js");
const toCamelCase = (str: string) => {
    return str
        .split(/[-_]/)
        .map((word, index) => {
            /*if (index === 0) {
                return word;
            }*/
            return (
                word.charAt(0).toUpperCase() +
                word.slice(1)
            );
        })
        .join("");
}

// @ts-ignore
@customElement('ui-icon')
export class UILucideIcon extends LitElementTheme {
    @property() protected iconElement?: SVGElement;
    @property({attribute: true, reflect: true, type: String}) icon: string = "";

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`;
    protected render() { return html`${this.themeStyle}${this.iconElement}`; }

    //
    constructor(options = {icon: "", padding: ""}) {
        super(); const self = this as unknown as HTMLElement;
        if (options?.icon) { this.icon = options?.icon; };
        if (options?.padding) { self.style.setProperty("padding", options?.padding); };
        self.inert = true;

        // vacuum issue
        setInterval(()=>{
            const icon = (self as any).shadowRoot?.querySelector?.("svg");
            const computed = getComputedStyle(self);
            const color = computed?.getPropertyValue?.("color") || computed?.getPropertyValue?.("stroke") || "inherit";
            icon?.style?.setProperty?.("stroke", color, "");
            icon?.style?.setProperty?.("color", color, "");

            //
            //(self as any)?.setAttribute("data-scheme", (self as any)?.closest("[data-scheme]")?.getAttribute?.("data-scheme") || (self as any)?.getAttribute?.("data-scheme"));
            //(icon as any)?.setAttribute("data-scheme", (self as any)?.getAttribute?.("data-scheme"));
        }, 100);
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        this.updateIcon();

        //
        const self = this as unknown as HTMLElement;
        if (!self.classList?.contains?.("ui-icon")) self.classList?.add?.("ui-icon");
        if (!self.classList?.contains?.("u2-icon")) self.classList?.add?.("u2-icon");
        //self.setAttribute("data-scheme", "dynamic-transparent");
    }

    //
    protected updateIcon() {
        ICON_MODULE.then((icons)=>{
            const ICON = toCamelCase(this.icon);
            if (icons?.[ICON]) {
                this.iconElement = icons?.createElement?.(icons?.[ICON]);
                if (this.iconElement) {
                    this.iconElement.dataset.highlight = "0";
                    this.iconElement.dataset.alpha  = "0";

                    //
                    //const computed = getComputedStyle(this as unknown as HTMLElement);
                    //const color = computed?.getPropertyValue?.("color") || computed?.getPropertyValue?.("stroke") || "inherit";
                    //this.iconElement.style.setProperty("stroke", color, "");
                    //this.iconElement.style.setProperty("color", color, "");

                    //
                    this.iconElement.setAttribute("width", "100%");
                    this.iconElement.setAttribute("height", "100%");
                    this.iconElement.setAttribute("inert", "");
                }
            }
        }).catch(console.warn.bind(console));
    }

    //
    protected willUpdate(changedProperties: PropertyValues<this>) {
        if (changedProperties.has("icon")) {
            this.updateIcon();
        }
    }
}

//
export default UILucideIcon;
