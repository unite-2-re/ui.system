// whole dedicated, separate element for lucide icons...
// this component (or lucide icons) may to be distributed with main package.
/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic, PropertyValues } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

//
//import { createIcons, icons } from 'lucide';

// @ts-ignore
//import styles from "../shared/BoxLayout.scss?inline";

// @ts-ignore
//import htmlT from "../shared/BoxLayout.html?raw";

//
const ICON_MODULE = import("lucide");

//
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

    //
    constructor() {
        super();

        // @ts-ignore
        this.classList?.add?.("ui-icon");

        // @ts-ignore
        this.classList?.add?.("u2-input");
    }

    //
    protected disconnectedCallback() {
        super.disconnectedCallback();
    }

    //
    protected connectedCallback() {
        super.connectedCallback();

        //
        this.updateIcon();
    }

    // theme style property
    @property({attribute: true, reflect: true, type: String}) icon: string = "";
    @property() protected iconElement?: HTMLElement;

    //
    protected updateIcon() {
        ICON_MODULE.then((icons)=>{
            const ICON = toCamelCase(this.icon);
            if (icons[ICON]) {
                this.iconElement = icons.createElement(icons[ICON]);
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
            // @ts-ignore
            if (root) {
                // @ts-ignore
                this.themeStyle = module?.default?.(root);
            }
        }).catch(console.warn.bind(console));

        //
        return root;
    }

    // also "display" may be "contents"
    static styles = css`:host { pointer-events: none; user-select: none; touch-action: none; aspect-ratio: 1 / 1; inline-size: 2rem; block-size: 2rem; box-sizing: border-box; display: flex; place-items: center; place-content: center; & > * { box-sizing: border-box; inline-size: 100%; block-size: 100%; aspect-ratio: 1 / 1; }; }`

    //
    render() {
        // @ts-ignore
        return html`${this.themeStyle}${this.iconElement}`;
    }
}

//
export default UILucideIcon;
