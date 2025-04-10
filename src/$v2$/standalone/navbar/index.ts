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

// @ts-ignore
import initTaskManager, { blurTask } from "../../tasks/logic";
import { setAttributesIfNull } from "../../shared/Utils";

//
import { onInteration } from "../../tasks/opening";

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
@customElement('ui-navbar')
export class UINavBar extends LitElementTheme {
    @property({attribute: true, reflect: true, type: String}) icon ?: string;// = "";
    @property({attribute: true, reflect: true, type: String}) label?: string;// = "";
    @property() public taskManager?: any;

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`;

    //
    constructor(options = {icon: "", padding: "", taskManager: null}) {
        super(); const self = this as unknown as HTMLElement;
        requestAnimationFrame(()=>{
            self.classList?.add?.("ui-navbar");
            self.style.setProperty("z-index", "9999", "important");
            self.style.setProperty("background-color", "transparent", "important");
            this.taskManager ??= options?.taskManager || initTaskManager();
        });
    }

    //
    protected render() { return html`${this.themeStyle}
        <button data-alpha="0" data-highlight="0" data-highlight-hover="2" type="button" class="ui-menu-button ui-anchor"  part="ui-menu-button"  data-popup="app-menu">
            <ui-icon inert icon="layout-grid"></ui-icon>
        </button>
        <button data-alpha="0" data-highlight="0" data-highlight-hover="2" type="button" class="ui-back-button ui-anchor"  part="ui-back-button"  @click=${this.backAction.bind(this)}>
            <ui-icon inert icon="chevron-right"></ui-icon>
        </button>
        <button data-alpha="0" data-highlight="0" data-highlight-hover="2" type="button" class="ui-title-handle ui-anchor" part="ui-title-handle" @contextmenu=${this.menuAction.bind(this)} @click=${this.menuAction.bind(this)}>
            <span>${this.label}</span><ui-icon inert icon=${this.icon||""}></ui-icon>
        </button>`;
    }

    //
    protected adaptiveTheme() {
        const self = this as unknown as HTMLElement;
        const setTheme = ()=>{
            const factor = document.body.matches(":has(ui-frame:not([data-hidden]))");
            const newScheme = factor ? "solid" : "base";
            if (newScheme != self.getAttribute("data-scheme")) { self.setAttribute("data-scheme", newScheme); };
            (self as any).shadowRoot.querySelector(".ui-title-handle").dataset.visible = "";

            //
            /*if (document.body.matches(":has(ui-taskbar:not([data-hidden]))")) {
                (self as any).shadowRoot.querySelector(".ui-title-handle").dataset.visible = "";
            } else {
                delete (self as any).shadowRoot.querySelector(".ui-title-handle").dataset.visible;
            }*/
        }

        //
        setIdleInterval(setTheme, 200);
        setTheme();

        //
        document.addEventListener("u2-appear", ()=>requestIdleCallback(setTheme));
        document.addEventListener("u2-hidden", ()=>requestIdleCallback(setTheme));

        //
        const showLabel = (ev?)=>{
            const onFocus = this.taskManager.getOnFocus(false);
            (self as any).shadowRoot.querySelector(".ui-title-handle span").textContent = onFocus?.desc?.label || "";
            (self as any).shadowRoot.querySelector(".ui-title-handle ui-icon").icon = onFocus?.desc?.icon || "menu";
        }

        //
        this.taskManager.on("focus", showLabel);
        this.taskManager.on("addTask", showLabel);
        this.taskManager.on("activate", showLabel);
        this.taskManager.on("deactivate", showLabel);
        this.taskManager.on("removeTask", showLabel);
        showLabel();
    }

    //
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

    //
    protected backAction(ev) {
        // @ts-ignore
        //(navigator?.back ? navigator?.back : history.back)?.();
        history.back?.(); // za-e-ball-o1
        //blurTask(this.taskManager, true);
        //if (!blurTask()) { history.back(); };
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);
        requestAnimationFrame(()=>{
            root.addEventListener("click", (ev)=>{
                onInteration(ev);
            });
            this.adaptiveTheme();
        });
        return root;
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        setAttributesIfNull(self, {
            "data-alpha": 0.6,
            "data-chroma": 0.1,
            "data-scheme": "base",
            "data-highlight": 2,
            "data-highlight-hover": 0,
        });
    }

}
