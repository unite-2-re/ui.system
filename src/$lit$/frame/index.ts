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
const makeControl = (frameElement)=>{
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
    if (frameElement) {
        // @ts-ignore
        frameElement.style.setProperty("--drag-x", (frameElement.parentNode.clientWidth - Math.min(Math.max(frameElement.offsetWidth, 48*16/0.8), frameElement.parentNode.clientWidth)) * (zoomOf() / 2), "");

        // @ts-ignore
        frameElement.style.setProperty("--drag-y", (frameElement.parentNode.clientHeight - Math.min(Math.max(frameElement.offsetHeight, 24*16/0.8), frameElement.parentNode.clientHeight)) * (zoomOf() / 2), "");
    }
}





// @ts-ignore
@customElement('ui-frame')
export class UIFrame extends LitElement {
    //
    constructor() {
        super();

        // @ts-ignore
        this.classList?.add?.("ui-frame");

        // @ts-ignore
        this.classList?.add?.("u2-frame");
    }

    //
    protected disconnectedCallback() {
        super.disconnectedCallback();
    }

    //
    protected connectedCallback() {
        super.connectedCallback();

        //
        this.updateAttributes();

        //
        requestAnimationFrame(()=>makeControl(this));
    }

    //
    protected updateAttributes() {
        // @ts-ignore
        if (!this.dataset.scheme) { this.dataset.scheme = "solid"; };

        // @ts-ignore
        if (!this.dataset.chroma) { this.dataset.chroma = "0.8"; };

        // @ts-ignore
        if (!this.dataset.highlight) { this.dataset.highlight = "8"; };
    }

    // theme style property
    @property() protected themeStyle?: HTMLStyleElement;

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

        //
        return root;
    }

    // also "display" may be "contents"
    static styles = css`:host {
        --initial-inline-size: 48rem;
        --initial-block-size : 32rem;
        --title-bar-height   : 2rem;
        --height-adjust      : 0px;

        --bound-inline-size: calc(100cqi);
        --bound-block-size : calc(100cqb - var(--height-adjust, 0px));

        --safe-area-left : 0px;
        --safe-area-right: 0px;
        --rx: calc(var(--drag-x, 0) * var(--zpx, 1px));
        --ry: calc(var(--drag-y, 0) * var(--zpx, 1px));
        --translate-x: clamp(0px, var(--rx, 0px), var(--bound-inline-size, 100%));
        --translate-y: clamp(0px, var(--ry, 0px), var(--bound-block-size , 100%));

        /* */
        will-change:
            inset-inline-start,
            inset-block-start,
            inline-size,
            block-size,
            transform,
            contents;

        /* */
        inline-size: clamp(min(var(--initial-inline-size, 100%), var(--bound-inline-size, 100%)), calc(var(--initial-inline-size, 100%) + var(--resize-x, 0) * var(--zpx, 1px)), calc(var(--bound-inline-size, 100%) - calc(var(--drag-x, 0) * var(--zpx, 1px))));
        block-size : clamp(min(var(--initial-block-size , 100%), var(--bound-block-size , 100%)), calc(var(--initial-block-size , 100%) + var(--resize-y, 0) * var(--zpx, 1px)), calc(var(--bound-block-size , 100%) - calc(var(--drag-y, 0) * var(--zpx, 1px))));

        /* */
        position: fixed;
        inset-inline-start: var(--translate-x, 0px);
        inset-block-start: var(--translate-y, 0px);
        inset-inline-end: auto;
        inset-block-end: auto;

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

        /* */
        box-sizing: border-box;

        /* */
        & .ui-title-bar {
            inline-size: 100%;
            block-size: 100%;
            min-block-size: var(--title-bar-height, 4rem);

            overflow: hidden;
            box-sizing: border-box;

            display: grid;
            grid-template-rows: minmax(0px, 1fr);
            grid-template-columns:
                [title] minmax(0px, 1fr)
                [buttons] minmax(0px, max-content);

            grid-column: 1 / -1;
            grid-row: 1 / 1 span;
            grid-row: title-bar;

            place-items: center;
            place-content: center;
            align-items: center;
            align-content: center;

            /* */
            & ::slotted(*) {
                inline-size: 100%;
                block-size: 100%;
                place-items: center;
                place-content: center;
                align-items: center;
                align-content: center;
                pointer-events: none;
            }

            /* */
            & .ui-title-handle {
                display: flex;
                flex-direction: row;
                flex-wrap: no-wrap;
                box-sizing: border-box;

                inline-size: 100%;
                block-size: 100%;

                grid-column: title;
                grid-row: 1 / 1 span;

                pointer-events: auto;
                user-select: none;
                touch-action: none;

                cursor: move;

                place-content: center;
                place-items: center;

                &:active { cursor: move; };
                &:hover  { cursor: move; };
            }
        }

        /* */
        & .ui-content {
            inline-size: 100%;
            block-size: 100%;
            box-sizing: border-box;

            grid-column: 1 / -1;
            grid-row: 2 / 2 span;
            grid-row: content;

            pointer-events: none;
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

            //
            background-color: transparent;
            cursor: nwse-resize;

            //
            pointer-events: auto;
            user-select: none;
            touch-action: none;
        }
    }`

    //
    render() {
        // @ts-ignore
        return html`${this.themeStyle}<div class="ui-title-bar" part="ui-title-bar" data-alpha="0"> <div class="ui-title-handle" part="ui-title-handle" data-alpha="0"></div> <slot name="ui-title-bar"></slot></div> <div data-scheme="solid" data-alpha="1" data-chroma="0" class="ui-content" part="ui-content"><slot></slot></div> <div data-alpha="0" part="ui-resize" class="ui-resize"></div>`;
    }
}

//
export default UIFrame;
