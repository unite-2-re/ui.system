/// <reference types="lit" />

// @ts-ignore
import { html, css, unsafeCSS } from "@mods/shared/LitUse";
import LitElementTheme from "@mods/shared/LitElementTheme";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

//
import { placeWithElement } from "@service/layout/ps-anchor";
import { setAttributesIfNull } from "@service/Utils";

// @ts-ignore /* @vite-ignore */
import { E } from "/externals/lib/blue.js";

// @ts-ignore
import styles from "@scss/design/ov-modal.scss?inline";

// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";

// @ts-ignore
@customElement('ui-modal')
export class UIModal extends LitElementTheme {
    @property() protected current?: string; //= "";
    @property({ type: Object }) public boundElement?: WeakRef<HTMLElement> | null;
    @property({ attribute: true, reflect: true, type: String }) public type?: string;// = "modal";

    //
    static styles = css`${unsafeCSS(`@layer ux-layer {${styles}};`)}`;
    protected render() { return html`${this.themeStyle}<slot></slot>`; }

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;

        // @ts-ignore
        Promise.try(importCdn, ["/externals/core/agate.js"])?.then?.(({whenAnyScreenChanges})=>{
            whenAnyScreenChanges?.(()=>this.placeWithElement());
        });

        //
        requestAnimationFrame(()=>{
            const place = (e)=>{ if (e.target == this) requestAnimationFrame(()=>this.placeWithElement()); };

            //
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

            //
            setAttributesIfNull(self, {
                //"type": "modal",
                "data-hidden": "",
                "data-chroma": "0.001",
                "data-scheme": "solid",
                "data-alpha": 1
            });

            // when something is appear, close contextmenu (except contextmenu itself)
            document.documentElement.addEventListener("u2-appear", (e)=>{
                const target = e.target as HTMLElement;
                if (!(target?.matches?.("ui-modal[type=\"contextmenu\"]") || target?.closest?.("ui-modal[type=\"contextmenu\"]")) && self?.matches?.("ui-modal[type=\"contextmenu\"]")) { self.dataset.hidden = ""; };
            });
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
