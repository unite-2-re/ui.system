/// <reference types="lit" />

// @ts-ignore
import { html, css, unsafeCSS } from "@mods/shared/LitUse";
import LitElementTheme from "@mods/shared/LitElementTheme";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

//
import { focusTask, taskManage } from "@service/tasks/binding";
import { setAttributes, setAttributesIfNull } from "@service/Utils";
import initTaskManager from "@service/tasks/manager";

// @ts-ignore
import styles from "@scss/design/ov-taskitem.scss?inline";

// @ts-ignore
@customElement('ui-task')
export class UITaskItem extends LitElementTheme {
    @property({attribute: "data-id", reflect: true, type: String}) taskId?: string; //= "";
    @property({attribute: true, reflect: true, type: Object}) desc?: any;// = {};
    @property() public taskManager?: any;

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(`@layer ux-layer {${styles}};`)}`;
    protected render() {
        return html`${this.themeStyle} <ui-icon inert icon=${this.desc?.icon} data-highlight="0" data-alpha="0"></ui-icon> <span inert data-highlight="0" data-alpha="0">${this.desc?.label}</span>`;
    }

    //
    constructor(options = {
        desc: "",
        padding: "",
        taskId: "",
        taskManager: null
    }) {
        super(); const self = this as unknown as HTMLElement;
        this.taskManager ??= options?.taskManager || initTaskManager();

        //
        requestAnimationFrame(()=>{
            if (options?.desc)        { this.desc   = options?.desc   ?? this.desc;   };
            if (options?.taskId)      { this.taskId = options?.taskId?.replace?.("#","") ?? this.taskId; };
            this.bindTaskManager(options?.taskManager ?? this.taskManager);

            //
            self.classList?.add?.("ui-task");
            self.addEventListener("click", () => {
                focusTask(this.taskManager, self, true);
                this.updateState();
            });

            //
            setAttributesIfNull(self, {
                //"data-scheme": "dynamic-transparent",
                "data-chroma": 0.01,
                "data-alpha": 0,
                "data-highlight": 0,
                "data-highlight-hover": 3
            });
        });

        //
        addEventListener("popstate"  , ()=>{ this.updateState(); });
        addEventListener("hashchange", ()=>{ this.updateState(); });
    }

    // TODO: improve classList system
    protected updateState() {
        const self = this as unknown as HTMLElement;
        const hash = "#" + (self.dataset?.id?.replace("#","") || this.taskId?.replace?.("#","") || "").trim?.()?.replace?.("#","")?.trim?.();
        const task = this.taskManager?.get?.(hash);
        const focused = task?.active && (this.taskManager?.getOnFocus?.()?.taskId?.replace("#","") == hash?.replace("#",""));

        //
        if (task?.active) {
            if (!self.classList.contains("ui-active")) self.classList.add("ui-active");
        } else {
            if (self.classList.contains("ui-active")) self.classList.remove("ui-active");
        }

        //
        if (focused) {
            if (!self.classList.contains("ui-focus")) self.classList.add("ui-focus");
        } else {
            if (self.classList.contains("ui-focus")) self.classList.remove("ui-focus");
        }
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        taskManage(this,this.taskManager);
        return root;
    }

    //
    public bindTaskManager(taskManager: any) { this.updateState(); }
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        if ((self.parentNode as any).taskManager) {
            this.bindTaskManager((self.parentNode as any).taskManager);
        }

        //
        setAttributes(self, {"data-id": (this.taskId || self.dataset.id || "")?.replace?.("#","")});
        this.updateState();
    }
}
