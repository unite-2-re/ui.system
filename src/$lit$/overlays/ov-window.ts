/// <reference types="lit" />

// @ts-ignore
import { css, unsafeCSS } from "@mods/shared/LitUse";
import LitElementTheme from "@mods/shared/LitElementTheme";

// @ts-ignore
import { customElement } from "lit/decorators.js";

//
import initTaskManager from "@service/tasks/manager";
import { makeControl } from "@service/layout/ps-draggable.js";
import { focusTask, onTasking } from "@service/tasks/binding";
import { setAttributesIfNull } from "@service/Utils";

// @ts-ignore
import htmlCode from "@temp/ov-window.html?raw";

// @ts-ignore
import styles from "@scss/design/ov-window.scss?inline";

// @ts-ignore
@customElement('ui-frame')
export class UIFrame extends LitElementTheme {
    // theme style property
    protected taskManager?: any;

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`;
    constructor(options = {icon: "", padding: "", taskManager: null}) {
        super(); const self = this as unknown as HTMLElement;
        const taskManager = options.taskManager || initTaskManager();
        this.taskManager ??= taskManager;

        //
        requestAnimationFrame(()=>{
            self.classList?.add?.("ui-frame");
            self.classList?.add?.("u2-frame");

            //
            if (!this?.taskManager?.isActive?.("#" + self?.querySelector?.(".ui-content")?.id)) {
                self.dataset.hidden = "";
            } else {
                delete self.dataset.hidden;
            }

            //
            self.addEventListener("pointerdown", (ev)=>{
                const id = "#" + (self.querySelector(".ui-content")?.id || self?.id || location.hash)?.replace?.("#", "");
                if (this?.taskManager?.isActive?.(id)) focusTask(this?.taskManager, self);
            });

            //
            this.fixZLayer();
        });
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
        const isInFocus = ("#" + (self.querySelector(".ui-content")?.id || self.id || (location.hash ? self.querySelector(location.hash) : null)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.()) == location.hash;
        if (isInFocus) { delete self.dataset.hidden; };

        //
        this.fixZLayer();
    }

    //
    protected updateAttributes() {
        const self = this as unknown as HTMLElement;
        setAttributesIfNull(self, {
            //"data-hidden": true,
            "data-maximized": null,
            "data-chroma": 0.001,
            "data-scheme": "inverse",
            "data-highlight": 0
        });
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        const self = this as unknown as HTMLElement;
        onTasking(this, this.taskManager);
        this.importFromTemplate(htmlCode);
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
