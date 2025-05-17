/// <reference types="lit" />
import ThemedElement from "@blit/shared/ThemedElement";
import { setIdleInterval } from "@ext/shared/Utils";
import { onInteration } from "@service/tasks/opening";
import initTaskManager from "@service/tasks/manager";

// @ts-ignore
import styles from "@scss/design/ov-navbar.scss?inline";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));

// @ts-ignore /* @vite-ignore */
import { H, property, defineElement } from "/externals/modules/blue.js";

// @ts-ignore
@defineElement('ui-navbar')
export class UINavBar extends ThemedElement {
    @property({ source: "attr" }) icon ?: string;
    @property({ source: "attr" }) label?: string;
    @property() public taskManager?: any;

    //
    protected initialAttributes = {
        "data-alpha": 0.6,
        "data-chroma": 0.1,
        "data-scheme": "base",
        "data-highlight": 2,
        "data-highlight-hover": 0,
    };

    // also "display" may be "contents"
    public styles = () => preInit;
    public render = () => H`
        <${"button.ui-menu-button.ui-anchor"}  data-alpha="0" data-highlight="0" data-highlight-hover="2" type="button" part="ui-menu-button"  data-popup="app-menu"><ui-icon inert icon="layout-grid"></ui-icon></button>
        <${"button.ui-back-button.ui-anchor"}  data-alpha="0" data-highlight="0" data-highlight-hover="2" type="button" part="ui-back-button"  @click=${this.backAction.bind(this)}><ui-icon inert icon="chevron-right"></ui-icon></button>
        <${"button.ui-title-handle.ui-anchor"} data-alpha="0" data-highlight="0" data-highlight-hover="2" type="button" part="ui-title-handle" @contextmenu=${this.menuAction.bind(this)} @click=${this.menuAction.bind(this)}><span>${this.label}</span><ui-icon inert icon=${this.icon||""}></ui-icon></button>`;

    //
    protected onInitialize(): this {
        super.onInitialize?.();
        const self = this as unknown as HTMLElement;
        self.classList?.add?.("ui-navbar");
        self.style.setProperty("z-index", "9999", "important");
        self.style.setProperty("background-color", "transparent", "important");
        return this;
    }

    //
    constructor(options = {icon: "", padding: "", taskManager: null}) {
        super(); this.taskManager ??= options?.taskManager || initTaskManager();
    }

    //
    protected adaptiveTheme() {
        const self = this as unknown as HTMLElement;
        const setTheme = ()=>{
            const factor = document.body.matches(":has(ui-frame:not([data-hidden]))");
            const newScheme = factor ? "solid" : "base";
            if (newScheme != self.getAttribute("data-scheme")) { self.setAttribute("data-scheme", newScheme); };
            const title = (self as any).shadowRoot.querySelector(".ui-title-handle");
            if (title) { title.dataset.visible = ""; };
        }

        //
        const showLabel = (ev?)=>{
            const onFocus = this.taskManager.getOnFocus(false);
            const a = (self as any).shadowRoot.querySelector(".ui-title-handle span");
            const b = (self as any).shadowRoot.querySelector(".ui-title-handle ui-icon");
            if (a) a.textContent = onFocus?.desc?.label || "";
            if (b) b.icon = onFocus?.desc?.icon || "menu";
        }

        //
        setIdleInterval(setTheme, 200);
        document.addEventListener("u2-appear", ()=>requestIdleCallback(setTheme));
        document.addEventListener("u2-hidden", ()=>requestIdleCallback(setTheme));

        //
        this.taskManager.on("focus", showLabel);
        this.taskManager.on("addTask", showLabel);
        this.taskManager.on("activate", showLabel);
        this.taskManager.on("deactivate", showLabel);
        this.taskManager.on("removeTask", showLabel);

        //
        setTheme();
        showLabel();
    }

    //
    protected onRender() { const root = this.shadowRoot; root.addEventListener("click", onInteration); this.adaptiveTheme(); return root; }
    protected backAction(ev) { history.back?.(); }
    protected menuAction(ev) {
        ev?.preventDefault?.();

        //
        const navbar  = document.querySelector("ui-taskbar") as HTMLElement;
        const focusId = this.taskManager.getOnFocus(false)?.taskId;
        if ((focusId && navbar.dataset.hidden != null) && ev.type != "contextmenu") {
            this.taskManager.deactivate(focusId);
        } else
        if (matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches) {
            if (navbar) { if (navbar.dataset.hidden != null) { delete navbar.dataset.hidden; } else { navbar.dataset.hidden = ""; } };
        }
    }
}
