/// <reference types="lit" />

// @ts-ignore
import { css, unsafeCSS } from "../../$service$/shared/LitUse";
import LitElementTheme from "../../$service$/shared/LitElementTheme";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import htmlCode from "./index.html?raw";

// @ts-ignore
import styles from "./index.scss?inline";

// @ts-ignore
import initTaskManager from "../../$service$/tasks/manager";

//
import {connect} from "../../$service$/shared/Status";
import { onInteration } from "../../$service$/tasks/opening";
import { setAttributes, setAttributesIfNull } from "../../$service$/shared/Utils";

//
const setIdleInterval = (cb, timeout = 1000, ...args)=>{
    requestIdleCallback(async ()=>{
        if (!cb || (typeof cb != "function")) return;
        while (true) {
            await Promise.try(cb, ...args);
            await new Promise((r)=>setTimeout(r, timeout));
            await new Promise((r)=>requestIdleCallback(r, {timeout: 100}));
            await new Promise((r)=>requestAnimationFrame(r));
        }
    }, {timeout: 1000});
}

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
        const taskManager = options?.taskManager || initTaskManager();
        this.taskManager ??= taskManager;

        // cupola
        const media = matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))");
        requestAnimationFrame(()=>{
            media.addEventListener("change", ({matches}) => {
                if (matches) { delete self.dataset.hidden; } else { self.dataset.hidden = ""; };
            });
            if (media.matches) { delete self.dataset.hidden; } else { self.dataset.hidden = ""; };
            //.addTasks(this.tasks || []);
        });

        //
        this?.taskManager?.on?.("focus", ()=>{
            const isMobile = matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches;
            const taskbar = isMobile ? document.querySelector("ui-taskbar:not([data-hidden])") : null;
            if (taskbar) (taskbar as HTMLElement).dataset.hidden = "";
        });

        //
        this?.taskManager?.on?.("activate", ()=>{
            const isMobile = matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches;
            const taskbar = isMobile ? document.querySelector("ui-taskbar:not([data-hidden])") : null;
            if (taskbar) (taskbar as HTMLElement).dataset.hidden = "";
        });
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        const self = this as unknown as HTMLElement;
        root.addEventListener("click", (ev)=>{
            if (!ev.target.matches("button, .ui-indicator")) { document.documentElement.querySelectorAll("ui-modal:not([data-hidden])")?.forEach?.((el: any)=>{ el.dataset.hidden = ""; }); }
        }); //.composed
        requestAnimationFrame(()=>{
            this.importFromTemplate(htmlCode);
            this.adaptiveTheme();
            if (root) { connect?.(root); this.statusSW = true; }
            root.addEventListener("click", onInteration);
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
        });
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
        document.addEventListener("u2-appear", ()=>requestIdleCallback(setTheme));
        document.addEventListener("u2-hidden", ()=>requestIdleCallback(setTheme));

        //
        self.addEventListener("u2-appear", (ev)=>{
            document.documentElement.querySelectorAll("ui-modal:not([data-hidden])")?.forEach?.((el: any)=>{ el.dataset.hidden = ""; });
        });
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        this.taskManager?.addTasks?.(this.tasks || []);

        //
        const self = this as unknown as HTMLElement;
        self.style.setProperty("z-index", "9998", "important");
        self.classList?.add?.("ui-taskbar");

        //
        setAttributesIfNull(self, {
            "data-scheme": "dynamic-transparent",
            "data-chroma": 0.001,
            "data-alpha": 1,
            "data-highlight": 0
        });

        //
        const media = matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))");

        // if mobile, hide it
        if (!media.matches) { self.dataset.hidden = ""; }
    }

}
