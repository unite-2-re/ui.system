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
@customElement('ui-dropmenu')
export class UIDropMenu extends LitElement {

    //
    constructor() {
        super();

        // @ts-ignore
        this.classList?.add?.("ui-dropmenu");

        // @ts-ignore
        this.classList?.add?.("u2-dropmenu");

        // @ts-ignore
        this.classList?.add?.("u2-input");

        // test-only, may be removed...
        // @ts-ignore
        this.addEventListener("click", this.onClick.bind(this));

        // @ts-ignore
        this.addEventListener("contextmenu", (ev)=>{
            ev.stopPropagation();
            ev.preventDefault();
        });
    }

    // test only!
    protected onClick(ev) {
        ev?.preventDefault?.();
        ev?.stopPropagation?.();

        // TODO! better support of context menus
        openContextMenu?.(ev, [
            {icon: new UILucideIcon({icon: "github", padding: ""}), content: "Properties", callback: ()=>{console.log("Properties")}},
            {icon: new UILucideIcon({icon: "youtube", padding: ""}), content: "Clone", callback: ()=>{console.log("Clone")}}
        ], true);
    }

    //
    protected connectedCallback() {
        super.connectedCallback();

        // @ts-ignore
        if (!this.dataset.scheme) { this.dataset.scheme = "solid"; };

        // @ts-ignore
        if (!this.dataset.highlight) { this.dataset.highlight = "1"; };

        // @ts-ignore
        if (!this.dataset.highlightHover) { this.dataset.highlightHover = "2"; };
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            // @ts-ignore
            if (root) {
                // @ts-ignore
                this.themeStyle = module?.default?.(root);
            }
        }).catch(console.warn.bind(console));

        // @ts-ignore
        return root;
    }

    //
    static styles = css`:host { text-align: center; padding: 0.25rem; cursor: pointer; user-select: none; min-inline-size: 6rem; display: inline flex; place-content: center; place-items: center; overflow: hidden; pointer-events: auto; border-radius: 0.25rem; box-sizing: border-box; button { gap: 0.25rem; text-align: start; padding: 0rem; user-select: none; display: flex; flex-direction: row; align-content: center; align-items: center; justify-items: stretch; justify-content: space-between; pointer-events: none; border-radius: 0px; outline: none 0px transparent; border: none 0px transparent; background-color: transparent; inline-size: 100%; block-size: 100%; box-sizing: border-box; } }`

    //
    render() {
        // use theme module if available
        // @ts-ignore
        return html`${this.themeStyle}<button type="button" class="ui-button" part="ui-button" data-alpha="0"><slot></slot></button>`;
    }
}

//
export default UIDropMenu;
