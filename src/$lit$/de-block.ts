/// <reference types="lit" />
// whole dedicated, separate element for lucide icons...
// this component (or lucide icons) may to be distributed with main package.

// @ts-ignore
import { html, LitElement } from "../$service$/shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./index.scss?inline";

// @ts-ignore
import htmlCode from "./index.html?raw";
import { setAttributesIfNull } from "../$service$/shared/Utils";

//
const importStyle = `@import url("${URL.createObjectURL(new Blob([styles], {type: "text/css"}))}");`;

// @ts-ignore
@customElement('ui-block')
export class UIBlock extends LitElement {
    constructor() { super(); }

    // theme style property
    @property({ type: Array }) protected nodes?: HTMLElement[];

    //
    protected render() {
        return html`<style>${importStyle}</style>${this.nodes}`;
    }

    //
    protected importFromTemplate(htmlCode: string) {
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlCode, "text/html");
        this.nodes = Array.from((dom.querySelector("template") as HTMLTemplateElement)?.content?.childNodes) as HTMLElement[];
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        setAttributesIfNull(self, {
            "data-transparent": "",
            "data-alpha": 0,
            "data-chroma": 0.1,
            "data-scheme": "solid",
            "data-highlight": 0
        });
        if (!self.classList?.contains?.("ui-block")) self.classList?.add?.("ui-block");
        if (!self.classList?.contains?.("u2-block")) self.classList?.add?.("u2-block");
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);
        return root;
    }
}

//
export default UIBlock;
