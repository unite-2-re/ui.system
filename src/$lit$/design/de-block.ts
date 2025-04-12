/// <reference types="lit" />
// whole dedicated, separate element for lucide icons...
// this component (or lucide icons) may to be distributed with main package.

// @ts-ignore
import { html, LitElement } from "@mods/shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

//
import { setAttributesIfNull } from "@service/Utils";

// @ts-ignore
import styles from "@scss/design/de-block.scss?inline";

//
const importStyle = `@import url("${URL.createObjectURL(new Blob([styles], {type: "text/css"}))}");`;

//
import { E } from "/externals/lib/blue";

//
const makeBlock = (root: HTMLElement, weak?: WeakRef<any>)=>{

    // TODO: make available with ".nodes" keys as element
    if (weak?.deref?.()) weak.deref().nodes = [
        E("div", {part: "ui-block-icon", dataset: {place: "icon"}}, [E("slot", {name: "icon"})]),
        E("div", {part: "ui-block-label", dataset: {place: "label"}}, [E("slot", {name: "label"})]),
        E("div", {part: "ui-block-element", dataset: {place: "element"}}, [E("slot")])
    ].map((e)=>e?.element);
}

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
        makeBlock(root, new WeakRef(this));
        return root;
    }
}

//
export default UIBlock;
