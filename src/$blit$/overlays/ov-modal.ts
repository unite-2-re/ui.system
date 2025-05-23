/// <reference types="lit" />

// @ts-ignore
import { ThemedElement } from "@blit/shared/ThemedElement";
import { placeWithElement } from "@service/layout/ps-anchor";

// @ts-ignore /* @vite-ignore */
import { E, property, defineElement } from "/externals/modules/blue.js";

// @ts-ignore
import styles from "@scss/design/ov-modal.scss?inline";

// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";

// @ts-ignore /* @vite-ignore */
import { loadInlineStyle } from "/externals/modules/dom.js";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
const loading = fetch(preInit, {priority: "high", keepalive: true, cache: "force-cache", mode: "same-origin"});
const styled  = loadInlineStyle(preInit, null, "ux-layer");

// @ts-ignore
@defineElement('ui-modal')
export class UIModal extends ThemedElement {
    public boundElement?: WeakRef<HTMLElement> | null;
    @property({ source: "attr" }) public type?: string;
    @property() protected current?: string;

    //
    public styles = () => styled.cloneNode(true);
    public initialAttributes = {
        "data-hidden": "",
        "data-chroma": "0.001",
        "data-scheme": "solid",
        "data-alpha": 1
    };

    //
    protected onInitialize() {
        super.onInitialize?.(); const self = this as unknown as HTMLElement;
        const place = (e)=>{ if (e.target == this) requestAnimationFrame(()=>this.placeWithElement()); };
        E(self, {style: {zIndex: 9999}, on:{
            "u2-appear": new Set([place]),
            "u2-before-show": new Set([place]),
            "click": new Set([(e)=>{
                requestAnimationFrame(()=>{
                    const target = e.target as HTMLElement;
                    if (self.dataset.hidden == null && self.matches("ui-modal[type=\"contextmenu\"]") && (target?.matches?.("ui-button-row, ui-select-row, li") || target?.closest?.("ui-button-row, ui-select-row, li"))) { self.dataset.hidden = ""; };
                });
            }])
        }})
        document.documentElement.addEventListener("u2-appear", (e)=>{
            const target = e.target as HTMLElement;
            if (!(target?.matches?.("ui-modal[type=\"contextmenu\"]") || target?.closest?.("ui-modal[type=\"contextmenu\"]")) && self?.matches?.("ui-modal[type=\"contextmenu\"]")) { self.dataset.hidden = ""; };
        });
        return this;
    }

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;

        // @ts-ignore
        Promise.try(importCdn, ["/externals/modules/dom.js"])?.then?.(({whenAnyScreenChanges})=>{
            whenAnyScreenChanges?.(()=>this.placeWithElement());
        });
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        (this as unknown as HTMLElement).dataset.hidden = "";
    }

    //
    public showPopup(element?: HTMLElement) {
        if (element) { this.bindElement(element); };
        const self = this as unknown as HTMLElement;
        if (self.dataset.hidden != null) {
            delete self.dataset.hidden;
        } else {
            self.dataset.hidden = "";
        }
        return this;
    }

    //
    public placeWithElement() {
        const element = this.boundElement?.deref?.();
        const self = this as unknown as HTMLElement;
        if (element) { placeWithElement(self, element, "from-top", 10); };
        return this;
    }

    //
    public bindElement(element?: HTMLElement | null) {
        this.boundElement = element ? new WeakRef(element) : null;
        if (element) { this?.placeWithElement?.(); };
        return this;
    }
};

//
export default UIModal;
