// @ts-ignore
import styles from "./OrientBox.scss?inline&compress";

// @ts-ignore
import html from "./OrientBox.html?raw";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));

// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";
export {importCdn};

//
export const elementPointerMap = new WeakMap<any>()
export class UIOrientBox extends HTMLElement {
    static observedAttributes = ["orient", "zoom"];
    public size: [number, number] = [0, 0];

    //
    #themeStyle?: HTMLStyleElement;
    #initialized: boolean = false;

    //
    get orient() { return parseInt(this.getAttribute("orient") || "0") || 0; };
    set orient(nw) { if (this.getAttribute("orient") != (nw as unknown as string)) { this.setAttribute("orient", ((nw || 0) as unknown as string)); }; };

    //
    get zoom() { return parseFloat(this.getAttribute("zoom") || "1") || 1; };
    set zoom(nw) { if (this.getAttribute("zoom") != (nw as unknown as string)) { this.setAttribute("zoom", ((nw || 1) as unknown as string)); }; };

    //
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});

        // @ts-ignore
        Promise.try(importCdn, ["/externals/core/theme.js"]).then((module)=>{
            // @ts-ignore
            this.#themeStyle = module?.default?.(this.shadowRoot);
            if (this.#themeStyle) { this.shadowRoot?.appendChild?.(this.#themeStyle); }
        }).catch(console.warn.bind(console));

        //
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");
        dom.querySelector("template")?.content?.childNodes.forEach(cp => {
            shadowRoot.appendChild(cp.cloneNode(true));
        });

        //
        const style = document.createElement("style");
        style.innerHTML = `@import url("${preInit}");`;

        //
        shadowRoot.appendChild(style);
        requestAnimationFrame(()=>{
            this.style.setProperty("--orient", this.getAttribute("orient") || "0");
            this.style.setProperty("--zoom", this.getAttribute("zoom") || "1");
        });

        //
        const size = this.size;
        size[0] = this.clientWidth;
        size[1] = this.clientHeight;
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry?.contentBoxSize) {
                    const contentBoxSize = entry?.contentBoxSize?.[0];
                    size[0] = (contentBoxSize?.inlineSize || this.clientWidth);
                    size[1] = (contentBoxSize?.blockSize || this.clientHeight);
                }
            }
        });

        //
        resizeObserver.observe(this, {box: "content-box"});
        elementPointerMap.set(this, {
            pointerMap: new Map<number, any>(),
            pointerCache: new Map<number, any>()
        });
    }

    //
    #initialize() {
        if (this.#initialized) return this;
        const shadowRoot = this.shadowRoot;
        this.#initialized = true;
        this.style.setProperty("--orient", this.getAttribute("orient") || "0");
        this.style.setProperty("--zoom", this.getAttribute("zoom") || "1");
        return this;
    }

    //
    connectedCallback() {
        this.#initialize();
    }

    //
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "orient" && oldValue != newValue) { this.style.setProperty("--orient", newValue); };
        if (name == "zoom" && oldValue != newValue) { this.style.setProperty("--zoom", newValue); };
    }
}

//
try { customElements.define("ui-orientbox", UIOrientBox); } catch(e) {};
export default UIOrientBox;
