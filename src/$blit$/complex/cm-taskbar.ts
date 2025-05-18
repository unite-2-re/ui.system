/// <reference types="lit" />
import ThemedElement from "@blit/shared/ThemedElement";

//
import initTaskManager from "@service/tasks/manager";
import { connect } from "@service/behaviour/bh-status";
import { onInteration } from "@service/tasks/opening";
import { setAttributes, setIdleInterval } from "@ext/shared/Utils";

// @ts-ignore
import htmlCode from "@temp/ov-taskbar.html?raw";

// @ts-ignore
import styles from "@scss/design/ov-taskbar.scss?inline";

// @ts-ignore /* @vite-ignore */
import { E, H, defineElement, matchMediaRef, property } from "/externals/modules/blue.js";

//
const whenFocus = ()=>{
    const isMobile = matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches;
    const taskbar = isMobile ? document.querySelector("ui-taskbar:not([data-hidden])") : null;
    if (taskbar) (taskbar as HTMLElement).dataset.hidden = "";
};

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
const loading = fetch(preInit, {priority: "high", keepalive: true, cache: "force-cache", mode: "same-origin"});

// @ts-ignore
@defineElement('ui-taskbar')
export class UITaskBar extends ThemedElement {
    // theme style property
    @property({  }) protected statusSW?: boolean;// = false;
    @property({  }) public tasks?: any[] = [];
    @property() public taskManager?: any;

    //
    public styles = () => preInit;
    public render = () => H(htmlCode);

    //
    protected initialAttributes = {
        "data-scheme": "dynamic-transparent",
        "data-chroma": 0.001,
        "data-alpha": 1,
        "data-highlight": 0
    }

    //
    onInitialize() {
        super.onInitialize?.();
        E(this, { dataset: { hidden: matchMediaRef("(not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape))))") } })
        this?.taskManager?.on?.("focus", whenFocus);
        this?.taskManager?.on?.("activate", whenFocus);
        this.adaptiveTheme();

        //
        const self = this as unknown as HTMLElement;
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
        return this;
    }

    // also "display" may be "contents"
    constructor(options = {icon: "", padding: "", taskManager: null}) {
        super(); this.taskManager ??= options?.taskManager || initTaskManager();;
    }

    //
    protected onRender() {
        const root = this.shadowRoot;
        if (root) { connect?.(root); this.statusSW = true; }
        root.addEventListener("click", (ev)=>{
            onInteration(ev);
            if (!ev.target.matches("button, .ui-indicator")) {
                document.documentElement.querySelectorAll("ui-modal:not([data-hidden])")?.forEach?.((el: any)=>{ el.dataset.hidden = ""; });
            }
        });
        return root;
    }

    //
    protected adaptiveTheme() {
        const self = this as unknown as HTMLElement;
        const setTheme = ()=>{
            const hasFrame = document.body.matches(":has(ui-frame:not([data-hidden]))");
            const inDesktop = matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches;
            setAttributes(self, { "data-scheme": inDesktop && hasFrame ? "solid" : "dynamic-transparent", "data-alpha": inDesktop && hasFrame ? 1 : 0 });
        }

        //
        setIdleInterval(setTheme, 200); setTheme();
        document.addEventListener("u2-appear", ()=>requestAnimationFrame(setTheme));
        document.addEventListener("u2-hidden", ()=>requestAnimationFrame(setTheme));
    }

}
