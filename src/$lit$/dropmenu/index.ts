/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import { openContextMenu } from "/externals/wcomp/contextmenu.js";

//
import UILucideIcon from "../icon/index";

//
const testMenu = [
    {icon: new UILucideIcon({icon: "github", padding: ""}), content: "Properties", callback: ()=>{console.log("Properties")}},
    {icon: new UILucideIcon({icon: "youtube", padding: ""}), content: "Clone", callback: ()=>{console.log("Clone")}}
];

// @ts-ignore
@customElement('ui-dropmenu')
export class UIDropMenu extends LitElement {

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

    //
    @property() protected themeStyle?: HTMLStyleElement;
    @property({}) dropMenu?: any = testMenu;

    // test only!
    protected onClick(ev) {
        ev?.preventDefault?.();
        ev?.stopPropagation?.();

        //
        openContextMenu?.(ev, this.dropMenu || testMenu, true);
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

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            if (root) { this.themeStyle = module?.default?.(root); }
        }).catch(console.warn.bind(console));
        return root;
    }

    //
    static styles = css`:host {
        & {
            text-align: center;
            padding: 0.25rem;
            cursor: pointer;
            min-inline-size: 6rem;
            display: inline flex;
            place-content: safe center;
            place-items: safe center;
            overflow: hidden;
            pointer-events: auto;
            border-radius: 0.25rem;
            box-sizing: border-box;

            /* */
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            -webkit-tap-highlight-color: transparent;

            /* */
            user-drag: none;
            user-select: none;
            touch-action: none;
        }

        /* */
        & button {
            gap: 0.25rem;
            text-align: start;
            padding: 0rem;
            user-select: none;
            display: flex;
            flex-direction: row;
            align-content: safe center;
            align-items: safe center;
            justify-items: stretch;
            justify-content: space-between;
            pointer-events: none;
            border-radius: 0px;
            outline: none 0px transparent;
            border: none 0px transparent;
            background-color: transparent;
            inline-size: 100%;
            block-size: 100%;
            box-sizing: border-box;

            /* */
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            -webkit-tap-highlight-color: transparent;

            /* */
            user-drag: none;
            user-select: none;
            touch-action: none;
        }

        /* */
        *, ::slotted(*) {
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            -webkit-tap-highlight-color: transparent;

            /* */
            user-drag: none;
            user-select: none;
            touch-action: none;
        }

        /* */
        ::slotted(*) {
            interactivity: inert;
            pointer-events: none;
        }
    }`

    //
    render() {
        // use theme module if available
        return html`${this.themeStyle}<button type="button" class="ui-button" part="ui-button" data-alpha="0"><slot></slot></button>`;
    }
}

//
export default UIDropMenu;
