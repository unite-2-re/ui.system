/// <reference types="lit" />

// @ts-ignore
import { html, css, unsafeCSS } from "../../shared/LitUse.js";
import LitElementTheme, { importCdn } from "../../shared/LitElementTheme.js";
import { placeWithElement } from "../../position/ts/ps-anchor.js";
import { setAttributesIfNull } from "../../shared/Utils";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./modal.scss?inline";

// @ts-ignore
@customElement('ui-modal')
export class UIModal extends LitElementTheme {
    @property() protected current?: string; //= "";
    @property({ type: Object }) public boundElement?: WeakRef<HTMLElement> | null;
    @property({ attribute: true, reflect: true, type: String }) public type?: string;// = "modal";

    //
    static styles = css`${unsafeCSS(styles)}`;
    protected render() { return html`${this.themeStyle}<slot></slot>`; }

    //
    constructor() {
        super();

        //
        const self = this as unknown as HTMLElement;

        // @ts-ignore
        Promise.try(importCdn, ["/externals/core/agate.js"])?.then?.(({whenAnyScreenChanges})=>{
            whenAnyScreenChanges?.(()=>this.placeWithElement());
        });

        //
        requestAnimationFrame(()=>{
            setAttributesIfNull(self, {
                //"type": "modal",
                "data-hidden": "",
                "data-chroma": "0.001",
                "data-scheme": "solid",
                "data-alpha": 1
            });

            //
            self.addEventListener("u2-appear", (e)=>{
                //self.style.removeProperty("display");
                const target = e.target as HTMLElement;
                if (e.target == this) requestAnimationFrame(()=>this.placeWithElement());
            });

            // when something is appear, close contextmenu (except contextmenu itself)
            document.documentElement.addEventListener("u2-appear", (e)=>{
                const target = e.target as HTMLElement;
                if (!(target?.matches?.("ui-modal[type=\"contextmenu\"]") || target?.closest?.("ui-modal[type=\"contextmenu\"]")) && self?.matches?.("ui-modal[type=\"contextmenu\"]")) { self.dataset.hidden = ""; };
            });

            //
            self.addEventListener("u2-before-show", (e)=>{
                if (e.target == this) requestAnimationFrame(()=> this.placeWithElement());
            });

            //
            self.addEventListener("click", (e)=>{
                requestAnimationFrame(()=>{
                    const target = e.target as HTMLElement;
                    if (self.dataset.hidden == null && self.matches("ui-modal[type=\"contextmenu\"]") && (target?.matches?.("ui-button-row, ui-select-row, li") || target?.closest?.("ui-button-row, ui-select-row, li"))) { self.dataset.hidden = ""; };
                });
            });
        });

        // force fix phantom appear
        /*document.documentElement.addEventListener("u2-before-show", (e)=>{
            self.style.display = "none";
        }, {once: true});*/

        //
        //self.style.display = "none";
        //self.dataset.hidden = "";
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        setAttributesIfNull(self, {
            //"type": "modal",
            "data-hidden": "",
            "data-chroma": "0.001",
            "data-scheme": "solid",
            "data-alpha": 1
        });

        //
        self.style.setProperty("z-index", "9999", "important");
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
        //this.placeWithElement();
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
