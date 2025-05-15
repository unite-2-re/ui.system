/// <reference types="lit" />

// @ts-ignore
import ThemedElement from "@mods/shared/LitElementTheme";
import { focusTask, taskManage } from "@service/tasks/binding";
import { setAttributes, setAttributesIfNull } from "@service/Utils";
import initTaskManager from "@service/tasks/manager";

// @ts-ignore
import styles from "@scss/design/ov-taskitem.scss?inline";

// @ts-ignore /* @vite-ignore */
import { defineElement, H, property } from "/externals/lib/blue.js";

// @ts-ignore
@defineElement('ui-task')
export class UITaskItem extends ThemedElement {
    @property({ source: "attr", name: "data-id" }) taskId?: string; //= "";
    @property({  }) desc?: any;// = {};
    @property() public taskManager?: any;

    // also "display" may be "contents"
    public styles = ()=>styles;
    public render = ()=>{
        return H`${this.themeStyle} <ui-icon inert icon=${this.desc?.icon} data-highlight="0" data-alpha="0"></ui-icon> <span inert data-highlight="0" data-alpha="0">${this.desc?.label}</span>`;
    }

    //
    protected initialAttributes = {
        "data-chroma": 0.01,
        "data-alpha": 0,
        "data-highlight": 0,
        "data-highlight-hover": 3
    };

    //
    constructor(options = {
        desc: "",
        padding: "",
        taskId: "",
        taskManager: null
    }) {
        super(); this.taskManager ??= options?.taskManager || initTaskManager();
        if (options?.desc)   { this.desc   = options?.desc   ?? this.desc;   };
        if (options?.taskId) { this.taskId = options?.taskId?.replace?.("#","") ?? this.taskId; };
    }

    //
    protected onInitialize() {
        super.onInitialize?.();
        const self = this as unknown as HTMLElement;
        self.classList?.add?.("ui-task");
        this.taskManager ??= (self.parentNode as any)?.taskManager ?? this.taskManager;
        self.addEventListener("click", () => { focusTask(this.taskManager, self, true); this.updateState(); });
        addEventListener("popstate"  , () => { this.updateState(); });
        addEventListener("hashchange", () => { this.updateState(); });
        taskManage(this, this.taskManager);
        this.updateState(); return this;
    }

    // TODO: improve classList system
    protected updateState() {
        const self = this as unknown as HTMLElement;
        const hash = "#" + (self.dataset?.id?.replace("#","") || this.taskId?.replace?.("#","") || "").trim?.()?.replace?.("#","")?.trim?.();
        const task = this.taskManager?.get?.(hash);
        const focused = task?.active && (this.taskManager?.getOnFocus?.()?.taskId?.replace("#","") == hash?.replace("#",""));

        //
        if (task?.active)
            { if (!self.classList.contains("ui-active")) self.classList.add("ui-active"); } else
            { if (self.classList.contains("ui-active")) self.classList.remove("ui-active"); }

        //
        if (focused)
            { if (!self.classList.contains("ui-focus")) self.classList.add("ui-focus"); } else
            { if (self.classList.contains("ui-focus")) self.classList.remove("ui-focus"); }
    }
}
