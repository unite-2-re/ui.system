/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import { openContextMenu } from "/externals/wcomp/contextmenu.js";

//
import UILucideIcon from "../icon/index";

// @ts-ignore
import htmlCode from "./index.html?raw";

// @ts-ignore
import styles from "./index.scss?inline";

//
import LitElementTheme from "../shared/LitElementTheme";

// @ts-ignore
@customElement('ui-dropmenu')
export class UIDropMenu extends LitElementTheme {
    @property({}) dropMenu?: any = null;
    @property({attribute: true, reflect: true, type: String}) value = "";
    @property({attribute: true, reflect: true, type: String}) icon = "";

    //
    static styles = css`${unsafeCSS(styles)}`;

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;

        //
        self.classList?.add?.("ui-dropmenu");
        self.classList?.add?.("u2-dropmenu");
        self.classList?.add?.("u2-input");
        self.addEventListener("click", this.onClick.bind(this));
        self.addEventListener("contextmenu", (ev)=>{
            ev.stopPropagation();
            ev.preventDefault();
        });
    }

    // test only!
    protected onClick(ev) {
        ev?.preventDefault?.();
        ev?.stopPropagation?.();

        //
        const self = this as unknown as HTMLElement;
        const dropMenuEl = Array.from(self?.querySelectorAll?.("ui-menuitem"));
        const dropMenu = dropMenuEl.map((el: any)=>{
            const dub = el?.cloneNode?.(true);
            dub?.querySelectorAll?.("input")?.forEach?.((el)=>el?.remove?.());
            const icon = dub?.querySelector?.("ui-icon");
            const input = el?.querySelector?.("input") ?? el;
            return {
                icon: icon?.cloneNode?.(true) || new UILucideIcon({icon: icon?.icon || el?.icon || el?.dataset?.icon, padding: ""}),
                content: dub?.innerHTML,
                callback() {
                    input?.click?.();
                    self.setAttribute("value", this.value = input?.value);
                }
            }
        });

        //
        openContextMenu?.(ev, dropMenu, true);
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        const self = this as unknown as HTMLElement;

        //
        if (!self.dataset.scheme) { self.dataset.scheme = "solid"; };
        if (!self.dataset.highlight) { self.dataset.highlight = "1"; };
        if (!self.dataset.highlightHover) { self.dataset.highlightHover = "2"; };
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);
        return root;
    }
}

//
export default UIDropMenu;
