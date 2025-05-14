/// <reference types="lit" />

// @ts-ignore
import ThemedElement from "@mods/shared/LitElementTheme";

//
import initTaskManager from "@service/tasks/manager";
import { makeControl } from "@service/layout/ps-draggable.js";
import { focusTask, onTasking } from "@service/tasks/binding";

// @ts-ignore
import htmlCode from "@temp/ov-window.html?raw";

// @ts-ignore
import styles from "@scss/design/ov-window.scss?inline";

// @ts-ignore /* @vite-ignore */
import { defineElement, H } from "/externals/lib/blue.js";

// @ts-ignore
@defineElement('ui-frame')
export class UIFrame extends ThemedElement {
    // theme style property
    protected taskManager?: any;
    protected initialAttributes = {
        "data-maximized": null,
        "data-alpha": 1,
        "data-chroma": 0.001,
        "data-scheme": "inverse",
        "data-highlight": 0
    };

    //
    constructor(options = {icon: "", padding: "", taskManager: null}) {
        super(); this.taskManager ??= options.taskManager || initTaskManager();
    }

    //
    public render = ()=> H(htmlCode);
    public styles = ()=> styles;
    public onInitialize() {
        super.onInitialize?.();
        const self = this as unknown as HTMLElement;
        self.classList?.add?.("ui-frame");
        self.classList?.add?.("u2-frame");
        self.addEventListener("pointerdown", (ev)=>{ this.whenTaskActive(); });

        //
        this.fixZLayer();
        makeControl(this as any);
        onTasking(this, this.taskManager);
        return this;
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        this.whenTaskActive();
        this.fixZLayer();
    }

    //
    protected whenTaskActive() {
        const self = this as unknown as HTMLElement;
        const id = "#" + (self.querySelector(".ui-content")?.id || self?.id || location.hash)?.replace?.("#", "");
        if (!this?.taskManager?.isActive?.(id)) { self.dataset.hidden = ""; } else { delete self.dataset.hidden; focusTask(this?.taskManager, self) }
    }

    //
    protected fixZLayer() {
        // if local/relative case
        const self = this as unknown as HTMLElement;
        const tasks  = this?.taskManager?.getTasks?.();
        const zIndex = tasks?.findIndex?.(({taskId}, I)=>self.matches("ui-frame:has("+taskId+"), ui-frame"+taskId+""));
        const exists = self.style.getPropertyValue("--z-index");
        if (exists != zIndex || !exists) { self.style.setProperty("--z-index", zIndex); };
    }

    //
    protected onRender() {
        const root = this.shadowRoot;
        const self = this as unknown as HTMLElement;
        root.addEventListener("click", (ev)=>{
            if (ev.target.matches(".ui-btn-close")) {
                //const content = location.hash && location.hash != "#" ? document.querySelector(location.hash) : null;
                const id = "#" + (self.querySelector(".ui-content")?.id || self?.id || location.hash)?.replace?.("#", "");
                self.addEventListener("u2-hidden", ()=>{
                    self?.dispatchEvent?.(new CustomEvent("u2-close", {
                        bubbles: true,
                        cancelable: true,
                        detail: {
                            taskId: id
                        }
                    }));
                }, {once: true});
                this.taskManager?.deactivate?.(id, true);
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
