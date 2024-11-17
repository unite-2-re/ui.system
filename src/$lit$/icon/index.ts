// whole dedicated, separate element for lucide icons...
// this component (or lucide icons) may to be distributed with main package.
/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic, PropertyValues } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./index.scss?inline";

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
export class UILucideIcon extends LitElement {

    // theme style property
    @property() protected iconElement?: SVGElement;
    @property() protected themeStyle?: HTMLStyleElement;
    @property({attribute: true, reflect: true, type: String}) icon: string = "";

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`

    //
    protected render() {
        return html`${this.themeStyle}${this.iconElement}`;
    }

    //
    constructor(options = {icon: "", padding: ""}) {
        super(); const self = this as unknown as HTMLElement;

        //
        self.classList?.add?.("ui-icon");
        self.classList?.add?.("u2-icon");

        //
        if (options?.icon) { this.icon = options?.icon; };
        if (options?.padding) { self.style.setProperty("padding", options?.padding); };
    }

    //
    public disconnectedCallback() {
        super.disconnectedCallback();
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        this.updateIcon();
    }

    //
    protected updateIcon() {
        ICON_MODULE.then((icons)=>{
            const ICON = toCamelCase(this.icon);
            console.log(icons);
            if (icons?.[ICON]) {
                this.iconElement = icons?.createElement?.(icons?.[ICON]);
                if (this.iconElement) {
                    this.iconElement.setAttribute("width", "100%");
                    this.iconElement.setAttribute("height", "100%");
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

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            if (root) { this.themeStyle = module?.default?.(root); }
        }).catch(console.warn.bind(console));
        return root;
    }
}

//
export default UILucideIcon;
