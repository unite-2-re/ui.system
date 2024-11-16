/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "../shared/BoxLayout.scss?inline";

// @ts-ignore
import htmlCode from "../shared/BoxLayout.html?raw";


// @ts-ignore
@customElement('ui-checkbox')
export class UICheckBox extends LitElement {

    // theme style property
    @property() protected themeStyle?: HTMLStyleElement;
    @property() protected checked: boolean = false;
    @property() protected nodes?: HTMLElement[];

    //
    static styles = css`${unsafeCSS(styles)}`

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;

        //
        self.classList?.add?.("ui-checkbox");
        self.classList?.add?.("u2-input");
        self.addEventListener("change", this.onSelect.bind(this));
        self.addEventListener("click", (e)=>{
            if (!(e.target as HTMLElement)?.matches?.("input[type=\"checkbox\"]")) {
                self.querySelector?.<HTMLElement>("input[type=\"checkbox\"]")?.click?.();
            }
        });
    }

    //
    protected onSelect(ev) {
        const self = this as unknown as HTMLElement;
        if (ev.target.checked != null) {
            this.checked = ev.target.checked;
            self.style.setProperty("--value", `${this.checked ? 1 : 0}`);
        }
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();

        //
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlCode, "text/html");
        this.nodes = Array.from((dom.querySelector("template") as HTMLTemplateElement)?.content?.childNodes) as HTMLElement[];

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            if (root) { this.themeStyle = module?.default?.(root); }
        }).catch(console.warn.bind(console));

        //
        return root;
    }

    //
    render() {
        // use theme module if available
        return html`${this.themeStyle}${this.nodes}`;
    }
}

//
export default UICheckBox;
