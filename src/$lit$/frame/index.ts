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
import LitElementTheme from "../shared/LitElementTheme";



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


// if global case
/*
const tasks = this.taskManager.getTasks();
const winds: HTMLElement[] = tasks.map(({id}, index)=>{
    return document.querySelector("ui-frame:has("+id+"), ui-frame"+id+"");
});

//
Array.from(winds).filter((w)=>!!w).forEach((e: HTMLElement, I)=>{
    e.style.setProperty("--z-index", ""+I);
});*/

//
const focusTask = (taskManager, target: HTMLElement)=>{
    const hash = "#" + (target.dataset.id || (target.querySelector(".ui-content")?.id || target.id || target.querySelector(location.hash)?.id || "") || (target as any).taskId).trim?.()?.replace?.("#","")?.trim?.();
    taskManager?.focus?.(hash);
    requestIdleCallback(()=>navigator?.vibrate?.([10]));
}

// @ts-ignore
@customElement('ui-frame')
export class UIFrame extends LitElementTheme {
    // theme style property
    protected taskManager?: any;

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`;
    constructor(options = {icon: "", padding: "", taskManager: null}) {
        super(); const self = this as unknown as HTMLElement;
        self.classList?.add?.("ui-frame");
        self.classList?.add?.("u2-frame");
        self.dataset.hidden = "";
        this.initTaskManager(options);
    }

    //
    protected initTaskManager(options = {icon: "", padding: "", taskManager: null}) {
        const self = this as unknown as HTMLElement;

        //
        addEventListener("hashchange", (ev)=>{
            const isInFocus = ("#" + (self.querySelector(".ui-content")?.id || self.id || self.querySelector(location.hash)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.()) == (ev?.newURL || location.hash);
            if (isInFocus) {
                focusTask(this.taskManager, self);
                delete self.dataset.hidden;
                this.fixZLayer();
            }
        });

        //
        addEventListener("popstate", (ev)=>{
            const isInFocus = ("#" + (self.querySelector(".ui-content")?.id || self.id || self.querySelector(location.hash)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.()) == location.hash;
            if (isInFocus) {
                focusTask(this.taskManager, self);
                delete self.dataset.hidden;
                this.fixZLayer();
            }
        });

        //
        this.taskManager ??= options?.taskManager || initTaskManager();
        this.taskManager.on("focus", ({task, index})=>{
            const isInFocus = (self.querySelector(".ui-content")?.id || self.id || self.querySelector(location.hash)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.id.trim?.()?.replace?.("#","")?.trim?.();
            if (isInFocus) {
                delete self.dataset.hidden;
                this.fixZLayer();
            }
        });

        //
        this.taskManager.on("activate", ({task, index})=>{
            const isInFocus = (self.querySelector(".ui-content")?.id || self.id || self.querySelector(location.hash)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.id.trim?.()?.replace?.("#","")?.trim?.();
            if (isInFocus) {
                delete self.dataset.hidden;
                this.fixZLayer();
            }
        });

        //
        this.taskManager.on("deactivate", ({task, index})=>{
            const isInFocus = (self.querySelector(".ui-content")?.id || self.id || self.querySelector(location.hash)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.id.trim?.()?.replace?.("#","")?.trim?.();
            if (isInFocus) {
                self.dataset.hidden = "";
            }
        });

        //
        this.fixZLayer();
    }

    //
    protected fixZLayer() {
        // if local/relative case
        const self = this as unknown as HTMLElement;
        const tasks  = this?.taskManager?.getTasks?.();
        const zIndex = tasks?.findIndex?.(({id}, I)=>self.matches("ui-frame:has("+id+"), ui-frame"+id+""));
        self.style.setProperty("--z-index", zIndex);
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

        //
        const self      = this as unknown as HTMLElement;
        const isInFocus = ("#" + (self.querySelector(".ui-content")?.id || self.id || self.querySelector(location.hash)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.()) == location.hash;
        if (isInFocus) { delete self.dataset.hidden; };

        //
        this.fixZLayer();
    }

    //
    protected updateAttributes() {
        const self = this as unknown as HTMLElement;
        if (!self.dataset.chroma) { self.dataset.chroma = "0.2"; };
        if (!self.dataset.scheme) { self.dataset.scheme = "inverse"; };
        if (!self.dataset.highlight) { self.dataset.highlight = "6"; };
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        const self = this as unknown as HTMLElement;
        this.importFromTemplate(htmlCode);
        root.addEventListener("click", (ev)=>{
            if (ev.target.matches(".ui-btn-close")) {
                const content = location.hash && location.hash != "#" ? document.querySelector(location.hash) : null;
                this.taskManager?.deactivate?.(location.hash);
                self.dataset.hidden = "";
            }
        });
        return root;
    }
}

//
export default UIFrame;
