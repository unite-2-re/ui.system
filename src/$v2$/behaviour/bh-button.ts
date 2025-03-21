/// <reference types="lit" />
// Type: standalone

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import { LitElement, html } from "../shared/LitUse";

// @ts-ignore
@customElement('ui-button-base')
export class UIButtonBase extends LitElement {
    @property({ type: Array }) protected nodes?: HTMLElement[];

    //
    $parentNode?: any;
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        requestAnimationFrame(()=>{
            self.addEventListener("contextmenu", (ev)=>{
                ev?.stopPropagation?.();
                ev?.preventDefault?.();
            });
        });
    }

    //
    protected importFromTemplate(htmlCode: string) {
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlCode, "text/html");
        this.nodes = Array.from((dom.querySelector("template") as HTMLTemplateElement)?.content?.childNodes) as HTMLElement[];
    }

    //
    protected render() {
        return html`${this.nodes}`;
    }

    //
    public connectedCallback() {
        super.connectedCallback();
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        const self = this as unknown as HTMLElement;

        //
        requestAnimationFrame(()=>{
            if (!self.querySelector("input") && self.querySelector("ui-button-row[data-value], ui-select-row[data-value]")) {
                self.insertAdjacentHTML?.("afterbegin", `<input slot="radio" hidden data-alpha="0" part="ui-radio" placeholder=" " label=" " type="text" value="" name="${(self?.parentNode as HTMLElement)?.dataset?.name || self?.dataset?.name || "dummy-radio"}">`);
            }
        });


        return root;
    }
}

//
export default UIButtonBase;
