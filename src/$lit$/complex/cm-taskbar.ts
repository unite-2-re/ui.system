/// <reference types="lit" />

// @ts-ignore
import { css, unsafeCSS } from "@mods/shared/LitUse";
import LitElementTheme from "@mods/shared/LitElementTheme";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

//
import initTaskManager from "@service/tasks/manager";
import { connect } from "@service/behaviour/bh-status";
import { onInteration } from "@service/tasks/opening";
import { setAttributes, setAttributesIfNull, setIdleInterval } from "@service/Utils";

// @ts-ignore
import htmlCode from "@temp/ov-taskbar.html?raw";

// @ts-ignore
import styles from "@scss/design/ov-taskbar.scss?inline";

// @ts-ignore
@customElement('ui-taskbar')
export class UITaskBar extends LitElementTheme {
    // theme style property
    @property({ type: Boolean }) protected statusSW?: boolean;// = false;
    @property({ type: Array }) public tasks?: any[] = [];
    @property() public taskManager?: any;

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`;
    constructor(options = {icon: "", padding: "", taskManager: null}) {
        super(); const self = this as unknown as HTMLElement;

        // cupola
        requestAnimationFrame(()=>{
            const media = matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))");
            if (media.matches) { delete self.dataset.hidden; } else { self.dataset.hidden = ""; };
            media.addEventListener("change", ({matches}) => {
                if (matches) { delete self.dataset.hidden; } else { self.dataset.hidden = ""; };
            });
        });

        //
        const whenFocus = ()=>{
            const isMobile = matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches;
            const taskbar = isMobile ? document.querySelector("ui-taskbar:not([data-hidden])") : null;
            if (taskbar) (taskbar as HTMLElement).dataset.hidden = "";
        };

        //
        const taskManager = options?.taskManager || initTaskManager();
        this.taskManager ??= taskManager;
        this?.taskManager?.on?.("focus", whenFocus);
        this?.taskManager?.on?.("activate", whenFocus);
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        if (root) { connect?.(root); this.statusSW = true; }
        root.addEventListener("click", onInteration);
        root.addEventListener("click", (ev)=>{
            if (!ev.target.matches("button, .ui-indicator")) { document.documentElement.querySelectorAll("ui-modal:not([data-hidden])")?.forEach?.((el: any)=>{ el.dataset.hidden = ""; }); }
        });

        //.composed
        const self = this as unknown as HTMLElement;
        requestAnimationFrame(()=>{
            this.importFromTemplate(htmlCode);
            this.adaptiveTheme();
            
            //
            self.style.setProperty("z-index", "9998", "important");
            self.classList?.add?.("ui-taskbar");
            self.addEventListener("u2-appear", (ev)=>document.documentElement.querySelectorAll("ui-modal:not([data-hidden])")?.forEach?.((el: any)=>{ el.dataset.hidden = ""; }));
            self.addEventListener("click", (ev)=>{
                if (ev?.composedPath?.()?.[0] == self) {
                    if (document.documentElement?.querySelector?.("ui-modal:not([data-hidden])")) {
                        document.documentElement.querySelectorAll("ui-modal:not([data-hidden])")?.forEach?.((el: any)=>{ el.dataset.hidden = ""; });
                    } else
                    if (ev?.target == self) {
                        const isMobile = matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches;
                        const self: any = isMobile ? ev?.target : null;
                        if (self) (self as HTMLElement).dataset.hidden = "";
                    }
                }
            });

            //
            setAttributesIfNull(self, {
                "data-scheme": "dynamic-transparent",
                "data-chroma": 0.001,
                "data-alpha": 1,
                "data-highlight": 0
            });
        });

        //
        return root;
    }

    //
    protected adaptiveTheme() {
        const self = this as unknown as HTMLElement;
        setAttributesIfNull(self, { "data-scheme": "dynamic-transparent" });

        //
        const setTheme = ()=>{
            if (matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches) {
                const hasFrame = document.body.matches(":has(ui-frame:not([data-hidden]))");
                setAttributes(self, { "data-scheme": hasFrame ? "solid" : "dynamic-transparent", "data-alpha": hasFrame ? 1 : 0 });
            } else {
                setAttributes(self, { "data-scheme": "solid", "data-alpha": 1 });
            }
        }

        //
        setIdleInterval(setTheme, 200);
        setTheme();

        //
        document.addEventListener("u2-appear", ()=>requestAnimationFrame(setTheme));
        document.addEventListener("u2-hidden", ()=>requestAnimationFrame(setTheme));
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        this.taskManager?.addTasks?.(this.tasks || []);

        //
        const self  = this as unknown as HTMLElement;
        const media = matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))");

        // if mobile, hide it
        if (!media.matches) { self.dataset.hidden = ""; }
    }

}
