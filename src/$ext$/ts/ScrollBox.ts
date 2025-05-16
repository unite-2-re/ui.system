// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";

// @ts-ignore
import html from "../html/ScrollBox.html?raw";

// @ts-ignore
import styles from "../scss/ScrollBox.scss?inline&compress";
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
export default class UIScrollBox extends HTMLElement {
    static observedAttributes = ["data-scroll-top", "data-scroll-left"];

    //
    #themeStyle?: HTMLStyleElement;
    #initialized: boolean = false;

    //
    constructor() {super(); this.attachShadow({ mode: "open"  }); }
    #initialize() {
        if (this.#initialized) return this;
        this.#initialized = true;

        //
        const shadowRoot = this.shadowRoot; const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");

        // @ts-ignore
        Promise.try(importCdn, ["/externals/core/theme.js"])?.then?.((module)=>{
            // @ts-ignore
            this.#themeStyle = module?.default?.(this.shadowRoot);
            if (this.#themeStyle) { this.shadowRoot?.appendChild?.(this.#themeStyle); }
        }).catch(console.warn.bind(console));

        //
        dom.querySelector("template")?.content?.childNodes.forEach(cp => {
            shadowRoot?.appendChild(cp.cloneNode(true));
        });

        //
        const style = document.createElement("style");
        style.innerHTML = `@import url("${preInit}");`;
        shadowRoot?.appendChild(style);

        //
        const content = shadowRoot?.querySelector?.(".content-box");

        // @ts-ignore
        Promise.try(importCdn, ["/externals/core/interact.js"])?.then?.(({ScrollBar})=>{
            this["@scrollbar-x"] = new ScrollBar(
                {
                    holder: this,
                    content: shadowRoot?.querySelector(".content-box"),
                    scrollbar: shadowRoot?.querySelector(".scrollbar-x"),
                },
                0
            );

            //
            this["@scrollbar-y"] = new ScrollBar(
                {
                    holder: this,
                    content: shadowRoot?.querySelector(".content-box"),
                    scrollbar: shadowRoot?.querySelector(".scrollbar-y"),
                },
                1
            );
        });


        //
        if (this.dataset.scrollTop || this.dataset.scrollLeft) {
            content?.scrollTo({
                top: parseFloat(this.dataset.scrollTop || "0") || 0,
                left: parseFloat(this.dataset.scrollLeft || "0") || 0,
                behavior: "instant",
            });

            //
            const event = new CustomEvent("scroll-set", {
                detail: {
                    scrollTop: this.dataset.scrollTop || 0,
                    scrollLeft: this.dataset.scrollLeft || 0,
                },
            });

            //
            this.dispatchEvent(event);
        }

        //
        return this;
    }

    //
    connectedCallback() {
        this.#initialize();
    }

    //
    attributeChangedCallback(name/*, oldValue, newValue*/) {
        //
        const content = this.shadowRoot?.querySelector(".content-box") as HTMLElement;

        //
        if (name == this?.dataset.scrollTop) {
            content?.scrollTo({
                top: parseFloat(this?.dataset.scrollTop || "0") || 0,
                left: content?.scrollLeft || 0,
                behavior: "instant",
            });

            //
            const event = new CustomEvent("scroll-set", {
                detail: {
                    scrollTop: parseFloat(this?.dataset.scrollTop || "0") || 0,
                    scrollLeft: parseFloat(this?.dataset.scrollLeft || "0") || 0,
                },
            });

            //
            this.dispatchEvent(event);
        }

        //
        if (name == this?.dataset.scrollLeft) {
            content?.scrollTo({
                top: this.scrollTop || 0,
                left: parseFloat(this?.dataset.scrollLeft || "0") || 0,
                behavior: "instant",
            });

            //
            const event = new CustomEvent("scroll-set", {
                detail: {
                    scrollTop: parseFloat(this?.dataset.scrollTop || "0") || 0,
                    scrollLeft: parseFloat(this?.dataset.scrollLeft || "0") || 0,
                },
            });

            //
            this.dispatchEvent(event);
        }
    }
}

//
customElements.define("ui-scrollbox", UIScrollBox);
