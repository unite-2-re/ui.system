/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import {AxGesture} from "/externals/lib/interact.js";

// @ts-ignore
import {zoomOf} from "/externals/lib/dom.js";


//
const $control$ = Symbol("@control");

//
const makeControl = (frameElement: HTMLElement)=>{
    let gestureControl: any = null;
    if (frameElement && !frameElement[$control$]) {
        gestureControl = new AxGesture(frameElement);
        frameElement[$control$] = gestureControl;

        //
        gestureControl.draggable({
            handler: frameElement?.shadowRoot?.querySelector(".ui-title-handle")
        });

        //
        gestureControl.resizable({
            handler: frameElement?.shadowRoot?.querySelector(".ui-resize")
        });
    }

    //
    if (frameElement && frameElement.parentNode) {
        // @ts-ignore
        const pn = (frameElement.offsetParent ?? frameElement.host ?? document.documentElement) as HTMLElement;
        frameElement.style.setProperty("--drag-x", `${(pn.clientWidth  - Math.min(Math.max(frameElement.offsetWidth , 48*16), pn.clientWidth)) * 0.5}`, "");
        frameElement.style.setProperty("--drag-y", `${(pn.clientHeight - Math.min(Math.max(frameElement.offsetHeight, 24*16), pn.clientHeight)) * 0.5}`, "");
    }
}





// @ts-ignore
@customElement('ui-frame')
export class UIFrame extends LitElement {
    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        self.classList?.add?.("ui-frame");
        self.classList?.add?.("u2-frame");
    }

    //
    public disconnectedCallback() {
        super.disconnectedCallback();
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        this.updateAttributes();
        requestAnimationFrame(()=>makeControl(this as unknown as HTMLElement));
    }

    //
    protected updateAttributes() {
        const self = this as unknown as HTMLElement;

        //
        if (!self.dataset.chroma) { self.dataset.chroma = "0.2"; };
        if (!self.dataset.scheme) { self.dataset.scheme = "inverse"; };
        if (!self.dataset.highlight) { self.dataset.highlight = "6"; };
    }

    // theme style property
    @property() protected themeStyle?: HTMLStyleElement;

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            if (root) {
                this.themeStyle = module?.default?.(root);
            }
        }).catch(console.warn.bind(console));

        //
        return root;
    }

    // also "display" may be "contents"
    static styles = css`:host {
        & {
            --initial-inline-size: 48rem;
            --initial-block-size : 32rem;
            --title-bar-height   : 2rem;
            --height-adjust      : 0px;

            /* */
            --bound-inline-size: calc(100cqi);
            --bound-block-size : calc(100cqb - var(--height-adjust, 0px));

            /* */
            --safe-area-left : 0px;
            --safe-area-right: 0px;

            /* */
            --translate-x: clamp(0px, var(--rx, 0px), var(--bound-inline-size, 100%));
            --translate-y: clamp(0px, var(--ry, 0px), var(--bound-block-size , 100%));

            /* */
            --rs-x: clamp(0px, calc(var(--resize-x, 0) * var(--zpx, 1px)), calc(var(--bound-inline-size, 0px) - var(--initial-inline-size, 100%)));
            --rs-y: clamp(0px, calc(var(--resize-y, 0) * var(--zpx, 1px)), calc(var(--bound-block-size , 0px) - var(--initial-block-size , 100%)));

            /* */
            --inline-size: min(calc(var(--initial-inline-size, 100%) + var(--rs-x, 0px)), var(--bound-inline-size, 100%));
            --block-size : min(calc(var(--initial-block-size , 100%) + var(--rs-y, 0px)), var(--bound-block-size , 100%));

            /* */
            --rx: clamp(0px, calc(var(--drag-x, 0) * var(--zpx, 1px)), max(calc(var(--bound-inline-size, 100%) - var(--inline-size, 100%)), 0px));
            --ry: clamp(0px, calc(var(--drag-y, 0) * var(--zpx, 1px)), max(calc(var(--bound-block-size , 100%) - var(--block-size , 100%)), 0px));
        }

        /* */
        & {
            will-change:
                inset-inline-start,
                inset-block-start,
                inline-size,
                block-size,
                transform,
                contents;

            /* */
            inline-size: clamp(0px, var(--inline-size, 100%), calc(var(--bound-inline-size, 0px) - var(--rx, 0px)));
            block-size : clamp(0px, var(--block-size , 100%), calc(var(--bound-block-size , 0px) - var(--ry, 0px)));

            /* */
            position: fixed;
            inset-inline-start: var(--translate-x, 0px);
            inset-block-start : var(--translate-y, 0px);
            inset-inline-end  : auto;
            inset-block-end   : auto;

            /* */
            display: grid;
            grid-template-columns: minmax(0px, 1fr);
            grid-template-rows:
                [title-bar] minmax(0px, max-content)
                [content]   minmax(0px, 1fr)
                [status]    minmax(1px, max-content);

            /* */
            container-type: size;
            container-name: ui-frame;
            contain: strict;
            overflow: hidden;

            /* */
            outline: solid 0.5px var(--current-surface-color);
            border-radius: 0.125rem;
            box-shadow: 0rem 0rem 1rem #10101060;

            /* */
            box-sizing: border-box;
            pointer-events: auto;
            z-index: calc(999 + var(--z-index, 0));

            /* */
            user-drag: none;
            user-select: none;
            touch-action: none;
            resize: none;

            /* */
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            -webkit-tap-highlight-color: transparent;
        }

        /* */
        & * {
            -webkit-tap-highlight-color: rgba(0,0,0,0);
            -webkit-tap-highlight-color: transparent;

            /* */
            user-drag: none;
            user-select: none;
            touch-action: none;
        }

        /* */
        & .ui-title-bar {

            & {
                font-size: 0.9rem;
                font-weight: bold;

                inline-size: 100%;
                block-size: 100%;
                min-block-size: var(--title-bar-height, 2rem);

                overflow: hidden;
                box-sizing: border-box;

                display: grid;
                grid-template-rows: minmax(0px, 1fr);
                grid-template-columns:
                    [title] minmax(0px, 1fr)
                    [buttons] minmax(var(--title-bar-height, 2rem), max-content);

                grid-column: 1 / -1;
                grid-row: 1 / 1 span;
                grid-row: title-bar;

                place-items: safe center;
                place-content: safe center;
                align-items: safe center;
                align-content: safe center;

                /* */
                user-select: none;
                pointer-events: none;
            }

            /* */
            ::slotted(*) {
                inline-size: 100%;
                block-size: 100%;
                place-items: safe center;
                place-content: safe center;
                align-items: safe center;
                align-content: safe center;
                pointer-events: none;
                user-select: none;
                padding-inline: 0.5rem;
                box-sizing: border-box;

                grid-column: 1 / -1;
                grid-row: 1 / 1 span;
            }

            /* */
            & .ui-title-handle {
                & {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: no-wrap;
                    box-sizing: border-box;

                    inline-size: 100%;
                    block-size: 100%;

                    grid-column: title;
                    grid-row: 1 / 1 span;

                    place-content: safe center;
                    place-items: safe center;

                    cursor: move;
                    pointer-events: auto;
                    user-select: none;
                    touch-action: none;
                }

                &:active { cursor: move; };
                &:hover  { cursor: move; };
            }
        }

        /* */
        & .ui-content, ::slotted(.ui-content) {
            inline-size: 100%;
            block-size: 100%;
            box-sizing: border-box;

            grid-column: 1 / -1;
            grid-row: 2 / 2 span;
            grid-row: content;

            pointer-events: none;
            user-select: none;

            /* */
            container-type: size;
            container-name: ui-content;
            contain: strict;
            overflow: hidden;
        }

        /* */
        & .ui-buttons {
            & {
                display: flex;
                place-items: safe center;
                place-content: safe center;
                inline-size: 100%;
                block-size: 100%;
                min-inline-size: max-content;

                box-sizing: border-box;

                grid-row: 1 / 1 span;
                grid-column: buttons;
                pointer-events: none;
                user-select: none;
                box-sizing: border-box;
            }

            /* */
            & > * {
                & {
                    display: flex;
                    inline-size: max-content;
                    block-size: 100%;
                    aspect-ratio: 1 / 1;
                    background-image: transparent;
                    place-items: safe center;
                    place-content: safe center;
                    cursor: pointer;
                    pointer-events: auto;
                    box-sizing: border-box;
                    border: none 0px transparent;
                    outline: none 0px transparent;
                    padding: 0.25rem;
                    user-select: none;
                }

                /* */
                & > * {
                    display: flex;
                    inline-size: max-content;
                    block-size: 100%;
                    aspect-ratio: 1 / 1;
                    box-sizing: border-box;
                    border: none 0px transparent;
                    outline: none 0px transparent;
                    pointer-events: none;
                    user-select: none;
                }
            }
        }

        /* */
        & .ui-resize {
            position: absolute;
            inset: auto;
            inset-inline-end: 0px;
            inset-block-end: 0px;
            inline-size: 1rem;
            block-size: 1rem;
            box-sizing: border-box;

            /* */
            background-color: transparent;
            cursor: nwse-resize;

            /* */
            pointer-events: auto;
            user-select: none;
            touch-action: none;
            resize: none;
        }
    }`

    //
    render() {
        return html`${this.themeStyle}
        <div class="ui-title-bar" part="ui-title-bar" data-alpha="0">
            <div class="ui-title-handle" part="ui-title-handle" data-alpha="0"></div>
            <slot name="ui-title-bar"></slot>
            <div class="ui-buttons" data-alpha="0"><button data-alpha="0" class="ui-btn-close"><ui-icon data-alpha="0" icon="x" data-scheme="dynamic"/></button></div>
        </div>
        <div data-scheme="solid" data-alpha="1" data-chroma="0" class="ui-content" part="ui-content"><slot></slot></div> <div data-alpha="0" part="ui-resize" class="ui-resize"></div>`;
    }
}

//
export default UIFrame;
