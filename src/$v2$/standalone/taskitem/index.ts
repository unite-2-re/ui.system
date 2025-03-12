/// <reference types="lit" />

// @ts-ignore
import { html, css, unsafeCSS } from "../../shared/LitUse";
import LitElementTheme from "../../shared/LitElementTheme";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import htmlCode from "./index.html?raw";

// @ts-ignore
import styles from "./index.scss?inline";
import { focusTask } from "../../functional/fn-task.js";
import { taskManage } from "../../tasks/binding";
import { setAttributesIfNull } from "../../shared/Utils";

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
    protected render() {
        return html`${this.themeStyle} <ui-icon inert icon=${this.icon} data-highlight="0" data-alpha="0"></ui-icon> <span inert data-highlight="0" data-alpha="0">${this.label}</span>`;
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
        self.addEventListener("click", () => focusTask(this.taskManager, self, true));
        this.updateState();

        //
        addEventListener("popstate"  , ()=>{ this.updateState(); });
        addEventListener("hashchange", ()=>{ this.updateState(); });
    }

    //
    protected updateState() {
        const self = this as unknown as HTMLElement;
        const hash = "#" + (self.dataset.id || this.taskId).trim?.()?.replace?.("#","")?.trim?.();
        const task = this.taskManager?.get?.(hash);

        //
        if (task?.active || (this.focused ||= location.hash == hash)) { this.active = true; };
        if (this.focused && !self.classList.contains("ui-focus")) { self.classList.add("ui-focus"); };
        if (this.active && !self.classList.contains("ui-active")) { self.classList.add("ui-active"); };
        if (!this.focused && self.classList.contains("ui-focus")) { self.classList.remove("ui-focus"); };
        if (!this.active && self.classList.contains("ui-active")) { self.classList.remove("ui-active"); };
    }

    //
    public bindTaskManager(taskManager: any) {
        const self = this as unknown as HTMLElement;
        
        //
        taskManage(this, this.taskManager ??= taskManager);
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
        setAttributesIfNull(self, {
            "data-id": (this.taskId || self.dataset.id || ""),
            "data-chroma": 0,
            "data-alpha": 0,
            "data-highlight": 0,
            "data-highlight-hover": 3
        });

        //
        this.updateState();
    }
}
