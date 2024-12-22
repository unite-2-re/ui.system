/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./index.scss?inline";
import LitElementTheme from "../shared/LitElementTheme";

// @ts-ignore
import { getBoundingOrientRect, whenAnyScreenChanges } from "/externals/core/agate.js";

//
const generateId = (len = 16) => {
    var arr = new Uint8Array((len || 16) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (dec)=>dec.toString(16).padStart(2, "0")).join('')
}

// @ts-ignore
@customElement('ui-popup')
export class UIPopup extends LitElementTheme {
    @property() protected current: string = "";
    @property() public boundElement?: WeakRef<HTMLElement> | null;

    //
    static styles = css`${unsafeCSS(styles)}`;
    protected render() {
        // use theme module if available
        return html`${this.themeStyle}<slot></slot>`;
    }

    //
    constructor() {
        super();

        //
        whenAnyScreenChanges?.(()=>{
            this.placeWithElement();
        });
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        if (!self.dataset?.alpha) self.dataset.alpha = "1";
        if (!self.dataset?.scheme) self.dataset.scheme = "solid";
        if (!self.dataset?.chroma) self.dataset.chroma = "0.001";

        //
        self.style.setProperty("z-index", "9999", "important");
        self.classList?.add?.("ui-popup");
        self.classList?.add?.("u2-popup");
        self.dataset.hidden = "";

        //
        this.placeWithElement();
    }

    //
    public showPopup(element?: HTMLElement) {
        if (element) { this.bindElement(element); };
        if (this.boundElement?.deref?.()) {
            const self = this as unknown as HTMLElement;
            if (self.dataset.hidden != null) {
                delete self.dataset.hidden;
            } else {
                self.dataset.hidden = "";
            }
        };
        this.placeWithElement();
        return this;
    }

    //
    public placeWithElement() {
        const element = this.boundElement?.deref?.();
        const self = this as unknown as HTMLElement;
        if (element && self.dataset.hidden == null) {
            const box = getBoundingOrientRect(element);
            const self_box = getBoundingOrientRect(self);
            self.style.setProperty("--inline-size", `${(box.width || self_box.width)}`);

            // for taskbar/navbar
            const updated_box = getBoundingOrientRect(self);
            self.style.setProperty("--client-x", `${(box.left || 0) - (updated_box.width - box.width) * 0.5}`);
            self.style.setProperty("--client-y", `${(box.top - updated_box.height - 10)}`);

            //
            const initialAnchor = element?.style?.getPropertyValue?.("anchor-name");
            const ID = generateId();
            if (!initialAnchor || initialAnchor == "none") {
                element?.style?.setProperty?.("anchor-name", "--" + ID, "");
            }

            //
            self.style.setProperty("--anchor-group", (element?.style?.getPropertyValue?.("anchor-name") || ("--" + ID)), "");
        }
        if (!element) {
            // if element not found, do hide
            self.dataset.hidden = "";
        }
        return this;
    }

    //
    public bindElement(element?: HTMLElement | null) {
        this.boundElement = element ? new WeakRef(element) : null;
        this?.placeWithElement?.();
        return this;
    }
}

//
document.documentElement.addEventListener("click", (ev: any)=>{
    if (!(ev?.target?.matches?.("ui-popup, ui-taskbar") || ev?.target?.closest?.("ui-popup, ui-taskbar"))) {
        document.documentElement.querySelectorAll("ui-popup")?.forEach?.((el: any)=>{
            el.dataset.hidden = "";
        });
    }
});
