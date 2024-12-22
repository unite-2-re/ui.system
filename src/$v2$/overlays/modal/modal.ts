/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../../shared/LitUse.js";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./index.scss?inline";
import LitElementTheme from "../../shared/LitElementTheme.js";

// @ts-ignore
import { whenAnyScreenChanges } from "/externals/core/agate.js";
import { placeWithElement } from "../../position/ts/ps-anchor.js";

// @ts-ignore
@customElement('ui-modal')
export class UIModal extends LitElementTheme {
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
        self.dataset.hidden = "";

        //
        this.placeWithElement();
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
        this.placeWithElement();
        return this;
    }

    //
    public placeWithElement() {
        const element = this.boundElement?.deref?.();
        placeWithElement(this, element, "from-top", 10);

        // if element not found, do hide
        if (!element) { this.dataset.hidden = ""; }
        return this;
    }

    //
    public bindElement(element?: HTMLElement | null) {
        this.boundElement = element ? new WeakRef(element) : null;
        this?.placeWithElement?.();
        return this;
    }
};
