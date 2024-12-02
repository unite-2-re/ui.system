/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import htmlCode from "./index.html?raw";

// @ts-ignore
import styles from "./index.scss?inline";

//
import LitElementTheme from "../shared/LitElementTheme";

//
const focusTask = (taskManager, target: HTMLElement)=>{
    const hash = "#" + (target.dataset.id || (target as any).taskId).trim?.()?.replace?.("#","")?.trim?.();
    if (taskManager?.inFocus?.(hash) && matchMedia("((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape))").matches) {
        taskManager?.deactivate?.(hash);
    } else {
        taskManager?.focus?.(hash);
    }
    requestIdleCallback(()=>navigator?.vibrate?.([10]));
}

// @ts-ignore
@customElement('ui-task')
export class UITaskItem extends LitElementTheme {
    @property({attribute: "data-id", reflect: true, type: String}) taskId: string = "";
    @property({attribute: true, reflect: true, type: String}) icon: string = "";
    @property({attribute: true, reflect: true, type: String}) label: string = "";
    @property({attribute: true, reflect: true, type: String}) active: boolean = false;
    @property({attribute: true, reflect: true, type: String}) focused: boolean = false;
    @property() public taskManager?: any;

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`;

    //
    protected render() {
        return html`${this.themeStyle}  <ui-icon inert icon=${this.icon} data-alpha="0" data-transparent></ui-icon>`;
    }

    //
    constructor(options = {icon: "", padding: "", id: "", taskManager: null}) {
        super(); const self = this as unknown as HTMLElement;

        //
        if (options?.id)          { this.taskId = options?.id   ?? this.taskId; };
        if (options?.icon)        { this.icon   = options?.icon ?? this.icon; };
        if (options?.taskManager) { this.bindTaskManager(options?.taskManager); };

        //
        self.classList?.add?.("ui-task");
        self.addEventListener("click", () => focusTask(this.taskManager, self));

        //
        this.updateState();

        //
        addEventListener("popstate"  , ()=>{ this.updateState(); });
        addEventListener("hashchange", ()=>{ this.updateState(); });
    }

    //
    protected updateState(){
        //
        const self = this as unknown as HTMLElement;
        const hash = "#" + (self.dataset.id || this.taskId).trim?.()?.replace?.("#","")?.trim?.();
        const task = this.taskManager?.get?.(hash);
        this.focused = location.hash == hash;
        if (task?.active || this.focused) { this.active  = true; };

        //
        if (this.focused && !self.classList.contains("ui-focus")) { self.classList.add("ui-focus"); };
        if (!this.focused && self.classList.contains("ui-focus")) { self.classList.remove("ui-focus"); };

        //
        if (this.active && !self.classList.contains("ui-active")) { self.classList.add("ui-active"); };
        if (!this.active && self.classList.contains("ui-active")) { self.classList.remove("ui-active"); };
    }

    //
    public bindTaskManager(taskManager: any) {
        const self = this as unknown as HTMLElement;

        //
        if (this.taskManager = taskManager ?? this.taskManager) {
            //
            this.taskManager.on("focus", ({task, index})=>{
                const hash = (self.dataset.id || this.taskId).trim?.()?.replace?.("#","")?.trim?.();
                const isInFocus = hash == task.id.trim?.()?.replace?.("#","")?.trim?.();
                this.focused = isInFocus && location.hash == ("#"+hash);
                this.updateState();
            });

            //
            this.taskManager.on("activate", ({task, index})=>{
                const isInFocus = (self.dataset.id || this.taskId).trim?.()?.replace?.("#","")?.trim?.() == task.id.trim?.()?.replace?.("#","")?.trim?.();
                if (isInFocus) {
                    this.active = true;
                }
                this.updateState();
            });

            //
            this.taskManager.on("deactivate", ({task, index})=>{
                const isInFocus = (self.dataset.id || this.taskId).trim?.()?.replace?.("#","")?.trim?.() == task.id.trim?.()?.replace?.("#","")?.trim?.();
                if (isInFocus) {
                    this.active  = false;
                    this.focused = false;
                }
                this.updateState();
            });
        }

        //
        { this.updateState(); }
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);
        return root;
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        if ((self.parentNode as any).taskManager) {
            this.bindTaskManager((self.parentNode as any).taskManager);
        }

        //
        if (!self.hasAttribute("data-id") && this.taskId) { self.setAttribute("data-id"             , (this.taskId || self.dataset.id || "")); };
        if (!self.hasAttribute("data-transparent"))       { self.setAttribute("data-transparent"    , ""     ); };
        if (!self.hasAttribute("data-chroma"))            { self.setAttribute("data-chroma"         , "0.05" ); };
        if (!self.hasAttribute("data-scheme"))            { self.setAttribute("data-scheme"         , "dynamic-transparent"); };
        if (!self.hasAttribute("data-alpha"))             { self.setAttribute("data-alpha"          , "0"    ); };
        if (!self.hasAttribute("data-highlight"))         { self.setAttribute("data-highlight"      , "0"    ); };
        if (!self.hasAttribute("data-highlight-hover"))   { self.setAttribute("data-highlight-hover", "3"    ); };
        if (self.dataset.id && !this.taskId) { this.taskId = self.dataset.id; };

        //
        this.updateState();
    }
}
