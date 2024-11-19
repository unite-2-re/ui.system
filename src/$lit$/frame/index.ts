/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import {AxGesture} from "/externals/lib/interact.js";

// @ts-ignore
import htmlCode from "./index.html?raw";

// @ts-ignore
import styles from "./index.scss?inline";

// @ts-ignore
import {initTaskManager} from "/externals/core/core.js";



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
    // theme style property
    @property() protected themeStyle?: HTMLStyleElement;
    @property() protected nodes?: HTMLElement[];
    protected taskManager?: any;

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`

    //
    protected render() {
        return html`${this.themeStyle}${this.nodes}`;
    }

    //
    constructor(options = {icon: "", padding: "", taskManager: null}) {
        super(); const self = this as unknown as HTMLElement;
        self.classList?.add?.("ui-frame");
        self.classList?.add?.("u2-frame");

        //
        this.taskManager ??= options?.taskManager || initTaskManager();

        //
        this.taskManager.on("focus", ({task, index})=>{
            const isInFocus = (self.querySelector(".ui-content")?.id || self.id || self.querySelector(location.hash)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.id.trim?.()?.replace?.("#","")?.trim?.();
            if (isInFocus) {
                delete self.dataset.hidden;
            }
        });

        //
        this.taskManager.on("activate", ({task, index})=>{
            const isInFocus = (self.querySelector(".ui-content")?.id || self.id || self.querySelector(location.hash)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.id.trim?.()?.replace?.("#","")?.trim?.();
            if (isInFocus) {
                delete self.dataset.hidden;
            }
        });

        //
        this.taskManager.on("deactivate", ({task, index})=>{
            const isInFocus = (self.querySelector(".ui-content")?.id || self.id || self.querySelector(location.hash)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.id.trim?.()?.replace?.("#","")?.trim?.();
            if (isInFocus) {
                self.dataset.hidden = "";
            }
        });
    }

    //
    public disconnectedCallback() {
        super.disconnectedCallback();
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        this.updateAttributes();
        requestIdleCallback(()=>makeControl(this as unknown as HTMLElement), {timeout: 1000});
    }

    //
    protected updateAttributes() {
        const self = this as unknown as HTMLElement;

        //
        if (!self.dataset.chroma) { self.dataset.chroma = "0.2"; };
        if (!self.dataset.scheme) { self.dataset.scheme = "inverse"; };
        if (!self.dataset.highlight) { self.dataset.highlight = "6"; };
    }

    //
    protected createRenderRoot() {
        const self = this as unknown as HTMLElement;
        const root = super.createRenderRoot();

        //
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlCode, "text/html");
        this.nodes = Array.from((dom.querySelector("template") as HTMLTemplateElement)?.content?.childNodes) as HTMLElement[];

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            if (root) {
                this.themeStyle = module?.default?.(root);
            }
        }).catch(console.warn.bind(console));

        //
        root.addEventListener("click", (ev)=>{
            if (ev.target.matches(".ui-btn-close")) {
                const content = location.hash && location.hash != "#" ? document.querySelector(location.hash) : null;
                this.taskManager?.deactivate?.(location.hash);
                self.dataset.hidden = "";
            }
        });

        //
        return root;
    }
}

//
export default UIFrame;
