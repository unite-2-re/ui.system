/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
@customElement('ui-statusbar')
export class UIStatusBar extends LitElement {
    constructor() {
        super(); const self = this as unknown as HTMLElement;
    }

    //
    @property() protected themeStyle?: HTMLStyleElement;
    @property() protected statusSW?: boolean = false;

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            if (root) { this.themeStyle = module?.default?.(root); }
        }).catch(console.warn.bind(console));

        //
        import("./status").then((module)=>{
            if (root) {
                module?.default?.(root);
                this.statusSW = true;
            }
        }).catch(console.warn.bind(console));


        return root;
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        if (!self.hasAttribute("data-alpha")) { self.setAttribute("data-alpha", "1"); };
        if (!self.hasAttribute("data-chroma")) { self.setAttribute("data-chroma", "0"); };
        if (!self.hasAttribute("data-scheme")) { self.setAttribute("data-scheme", "dynamic"); };
    }

    //
    static styles = css`:host {
        & {
            inline-size: 100%;
            block-size: 2rem;
            font-size: 0.9rem;

            /* */
            display: inline grid !important;
            grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(6rem, max-content);
            grid-template-rows: minmax(0px, 1fr);

            /* */
            position: fixed;
            z-index: 99999;
            overflow: hidden;
            pointer-events: none;

            /* */
            justify-content: space-between;
            padding-inline: 0.5rem;
            gap: 0rem;
            box-sizing: border-box;

            inset: 0px;
            inset-block-end: auto;
            /*inset-inline-end: auto;*/
        }

        /* */
        & > * {
            inline-size: 100%;
            block-size: 100%;
            box-sizing: border-box;
            flex-direction: row;

            /* */
            & { background-color: transparent; };
            & { justify-content: space-between; }
        }

        /* */
        & > div { display: inline flex; flex-direction: row; inline-size: 100%; block-size: 100%; }

        /* */
        & *             { background-color: transparent; gap: 0rem; place-items: safe center; place-content: safe center; }
        & .left, .right { display: inline flex; flex-direction: row; }
        & .left         { grid-column: 1 / 1 span; grid-row: 1 / 1 span; justify-self: safe start;  justify-items: safe start ; justify-content: safe start ; gap: 0rem; }
        & .center       { grid-column: 2 / 2 span; grid-row: 1 / 1 span; justify-self: safe center; justify-items: safe center; justify-content: safe center; gap: 0rem; }
        & .right        { grid-column: 3 / 3 span; grid-row: 1 / 1 span; justify-self: safe end;    justify-items: safe end   ; justify-content: safe end   ; gap: 0rem; }

        /* */
        .icon-wrap {
            display: inline flex;
            inline-size: max-content;
            block-size: 100%;
            aspect-ratio: 1 / 1;
            box-sizing: border-box;
            place-items: safe center;
            place-content: safe center;
        }

        /* */
        .ui-indicator {
            & {
                padding: 0.5rem;
                pointer-events: none;
                inline-size: max-content;
                block-size: 100%;
                place-items: safe center;
                place-content: safe center;
                box-sizing: border-box;
                display: inline flex;
                flex-direction: row;
            }

            /* */
            &.ui-icon { aspect-ratio: 1 / 1; }

            /* */
            a {
                box-sizing: border-box;
                display: inline flex;
                inline-size: max-content;
                block-size: 100%;
                place-items: safe center;
                place-content: safe center;
            }
        }
    }

    /* */
    @media not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape))) { :host{display:none;} }`;

    //
    render() {
        // use theme module if available
        return html`${this.themeStyle}
        <div class="left">
            <div
                class="ui-indicator ui-time"
                data-scheme="dynamic-transparent"
                data-transparent
                data-alpha="0">
                <span class="ui-time-hour" inert>00</span>:<span class="ui-time-minute" inert>00</span>
            </div>
        </div>
        <div class="center"></div>
        <div class="right">
            <a
                class="ui-indicator ui-icon ui-github" style="pointer-events: auto;" href="https://github.com/orgs/unite-2-re"
                data-scheme="dynamic-transparent"
                data-tooltip="Our Github Repository"
                data-scheme="dynamic-transparent"
                data-alpha="0"
                data-transparent
                data-action="open-link"
                data-href="https://github.com/orgs/unite-2-re">
                <ui-icon inert
                    icon="github" class="icon-wrap ui-icon-state ui-github"
                    data-alpha="0"
                    data-scheme="dynamic-transparent"
                    data-transparent
                ></ui-icon>
            </a>
            <div
                class="ui-indicator ui-icon"
                data-scheme="dynamic-transparent"
                data-alpha="0"
                data-transparent>
                <ui-icon inert
                    icon="wifi-off" class="icon-wrap ui-icon-state ui-network"
                    data-scheme="dynamic-transparent"
                    data-alpha="0"
                    data-transparent
                ></ui-icon>
            </div>
            <div
                ref="target" class="ui-indicator ui-icon"
                data-scheme="dynamic-transparent"
                data-transparent
                data-alpha="0">
                <ui-icon inert
                    icon="battery" class="icon-wrap ui-icon-state ui-battery"
                    data-alpha="0"
                    data-scheme="dynamic-transparent"
                    data-transparent
                ></ui-icon>
            </div>
        </div>`;
    }
};

//
export default UIStatusBar;
