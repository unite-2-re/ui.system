/// <reference types="lit" />

// @ts-ignore
import { html, css, unsafeCSS } from "../../shared/LitUse.js";
import LitElementTheme from "../../shared/LitElementTheme.js";
import { placeWithElement } from "../../position/ts/ps-anchor.js";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./modal.scss?inline";

// @ts-ignore
import { whenAnyScreenChanges } from "/externals/core/agate.js";

// @ts-ignore
@customElement('ui-modal')
export class UIModal extends LitElementTheme {
    @property() protected current: string = "";
    @property() public boundElement?: WeakRef<HTMLElement> | null;
    @property({ attribute: true, reflect: true, type: String }) public type: string = "modal";

    //
    static styles = css`${unsafeCSS(styles)}`;
    protected render() { return html`${this.themeStyle}<slot></slot>`; }

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
        const self = this as unknown as HTMLElement;
        placeWithElement(self, element, "from-top", 10);

        // if element not found, do hide
        if (!element) { self.dataset.hidden = ""; }
        return this;
    }

    //
    public bindElement(element?: HTMLElement | null) {
        this.boundElement = element ? new WeakRef(element) : null;
        this?.placeWithElement?.();
        return this;
    }
};

//
export default UIModal;
