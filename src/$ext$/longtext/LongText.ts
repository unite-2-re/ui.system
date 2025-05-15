//
import { importCdn, makeInput, styles } from "../../../../longtext.wcomp/src/$core$/Utils.js";

// @ts-ignore
import html from "./LongText.html?raw";
import { measureText } from "../../$service$/Measure.js";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
export class UILongTextElement extends HTMLElement {
    //#input?: HTMLInputElement | null;
    #selectionRange?: [number, number] | null;

    //
    get #input(): HTMLInputElement|null { return this.querySelector("input"); };
    #themeStyle?: HTMLStyleElement;
    #initialized: boolean = false;
    constructor() { super(); }
    #initialize() {
        if (!this.#initialized) {
            this.#initialized = true;

            //
            const parser = new DOMParser();
            const dom = parser.parseFromString(html, "text/html");
            const shadowRoot = this.attachShadow({ mode: "open" });
            dom.querySelector("template")?.content?.childNodes.forEach(cp => {
                shadowRoot.appendChild(cp.cloneNode(true));
            });

            // @ts-ignore
            Promise.try(importCdn, ["/externals/core/theme.js"])?.then?.((module)=>{
                // @ts-ignore
                this.#themeStyle = module?.default?.(shadowRoot);
                if (this.#themeStyle) { shadowRoot?.appendChild?.(this.#themeStyle); }
            }).catch(console.warn.bind(console));

            //
            const style = document.createElement("style");
            style.innerHTML = `@import url("${preInit}");`;
            shadowRoot.appendChild(style);

            //
            this?.addEventListener?.("change", (ev)=>this.#adaptiveInline(ev));
            this?.addEventListener?.("input", (ev)=>this.#adaptiveInline(ev));
            this?.addEventListener?.("focusout", (ev)=>{
                setTimeout(()=>{if (document.activeElement != this.#input) { this.#selectionRange = null; }}, 100);
            });

            //
            this.#adaptiveInline();
            makeInput(this);
        }
    }

    //
    #adaptiveInline(ev?) {
        const input = (ev?.target || this.#input) as HTMLInputElement;
        if (!CSS.supports("field-sizing", "content") && input?.matches?.("input")) {
            const measure = measureText(input?.value||"", input)?.width;
            input?.style?.setProperty("inline-size", measure != null ? ((measure||0) + "px") : (((input?.value||"")?.length || 0) + "ch"));
        }
    }

    //
    connectedCallback() {
        this.#initialize();
        this.#adaptiveInline();
    }

    //
    restoreFocus() {
        if (document.activeElement != this.#input) {
            this.#input?.focus?.();
            if (this.#selectionRange != null) {
                this.#input?.setSelectionRange?.(...this.#selectionRange);
                this.#selectionRange = null;
            }
        }
    }
}

//
export default (ROOT = document.documentElement) => {
    customElements.define("ui-longtext", UILongTextElement);
};
