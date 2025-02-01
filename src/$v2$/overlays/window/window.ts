/// <reference types="lit" />

// @ts-ignore
import { css, unsafeCSS } from "../../shared/LitUse";
import LitElementTheme from "../../shared/LitElementTheme";

// @ts-ignore
import { customElement } from "lit/decorators.js";

// @ts-ignore
import htmlCode from "./window.html?raw";

// @ts-ignore
import styles from "./window.scss?inline";

// @ts-ignore
import { initTaskManager } from "/externals/core/core.js";
import { focusTask } from "../../functional/fn-task.js";
import { makeControl } from "../../position/ts/ps-draggable.js";

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
        self.addEventListener("pointerdown", (ev)=>{
            focusTask(this?.taskManager, self);
        });
    }

    //
    protected initTaskManager(options = {icon: "", padding: "", taskManager: null}) {
        const self = this as unknown as HTMLElement;

        //
        this.taskManager ??= options?.taskManager || initTaskManager();
        this.taskManager.on("focus", ({task, index})=>{
            const isInFocus = (self.querySelector(".ui-content")?.id || self.id || self.querySelector(location.hash)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.id.trim?.()?.replace?.("#","")?.trim?.();
            if (isInFocus) { delete self.dataset.hidden; };
            this.fixZLayer();
        });

        //
        this.taskManager.on("activate", ({task, index})=>{
            const isInFocus = (self.querySelector(".ui-content")?.id || self.id || self.querySelector(location.hash)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.id.trim?.()?.replace?.("#","")?.trim?.();
            if (isInFocus) { delete self.dataset.hidden; };
            this.fixZLayer();
        });

        //
        this.taskManager.on("deactivate", ({task, index})=>{
            const isInFocus = (self.querySelector(".ui-content")?.id || self.id || self.querySelector(location.hash)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.id.trim?.()?.replace?.("#","")?.trim?.();
            if (isInFocus) { self.dataset.hidden = ""; };
            this.fixZLayer();
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
        const exists = self.style.getPropertyValue("--z-index");
        if (exists != zIndex || !exists) { self.style.setProperty("--z-index", zIndex); };
    }

    //
    public disconnectedCallback() {
        super.disconnectedCallback();
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        this.updateAttributes();
        requestAnimationFrame(()=>makeControl(this as any));

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
        if (!self.dataset.chroma) { self.dataset.chroma = "0"; };
        if (!self.dataset.scheme) { self.dataset.scheme = "inverse"; };
        if (!self.dataset.highlight) { self.dataset.highlight = "0"; };
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        const self = this as unknown as HTMLElement;
        this.importFromTemplate(htmlCode);
        root.addEventListener("click", (ev)=>{
            if (ev.target.matches(".ui-btn-close")) {
                //const content = location.hash && location.hash != "#" ? document.querySelector(location.hash) : null;
                const id = (self.querySelector(".ui-content")?.id || self?.id || location.hash);
                this.taskManager?.deactivate?.("#" + id);
                if (id?.startsWith?.("TASK-")) { this.taskManager?.removeTask?.("#" + id); };
            }

            //
            if (ev.target.matches(".ui-btn-maximize")) {
                if (self?.dataset?.maximized == null) { self.dataset.maximized = ""; } else
                if (self?.dataset?.maximized != null) { delete self.dataset.maximized; };
            }
        });
        return root;
    }
}

//
export default UIFrame;
