/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import htmlCode from "./index.html?raw";

// @ts-ignore
import styles from "./index.scss?inline";

// @ts-ignore
import {initTaskManager} from "/externals/core/core.js";
import LitElementTheme from "../shared/LitElementTheme";

// @ts-ignore
@customElement('ui-taskbar')
export class UITaskBar extends LitElementTheme {
    // theme style property
    @property() protected statusSW?: boolean = false;
    @property() public tasks?: any[] = [];
    @property() public taskManager?: any;

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`;
    constructor(options = {icon: "", padding: "", taskManager: null}) {
        super(); const self = this as unknown as HTMLElement;

        //
        this.taskManager ??= options?.taskManager || initTaskManager();
        this.taskManager.addTasks(this.tasks || []);

        // cupola
        matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").addEventListener("change", ({matches}) => {
            if (matches) { delete self.dataset.hidden; } else { self.dataset.hidden = ""; };
        });
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);

        //
        import("../shared/Status").then((module)=>{
            if (root) {
                module?.default?.(root);
                this.statusSW = true;
            }
        }).catch(console.warn.bind(console));

        //
        this.adaptiveTheme();

        //
        root.addEventListener("click", (ev)=>{
            document.documentElement.querySelectorAll("ui-popup")?.forEach?.((el: any)=>{ el.dataset.hidden = ""; });
            if (ev?.target?.matches(".ui-time") || ev?.target?.closest?.(".ui-time")) { (document.querySelector("ui-popup[data-name=\"calendar\"]") as any)?.showPopup?.( (ev?.target?.matches(".ui-time") ? ev?.target : ev?.target?.closest(".ui-time")) ); }
            if (ev?.target?.matches(".ui-indicator:has(.ui-network)") || ev?.target?.closest?.(".ui-indicator:has(.ui-network)")) { (document.querySelector("ui-popup[data-name=\"quick-settings\"]") as any)?.showPopup?.( (ev?.target?.matches(".ui-indicator:has(.ui-network)") ? ev?.target : ev?.target?.closest(".ui-indicator:has(.ui-network)")) ); }
            if (ev?.target?.matches(".ui-indicator:has(.ui-battery)") || ev?.target?.closest?.(".ui-indicator:has(.ui-battery)")) { (document.querySelector("ui-popup[data-name=\"power-settings\"]") as any)?.showPopup?.( (ev?.target?.matches(".ui-indicator:has(.ui-battery)") ? ev?.target : ev?.target?.closest(".ui-indicator:has(.ui-battery)")) ); }
            if (ev?.target?.matches(".ui-app-menu:has(.button)") || ev?.target?.closest?.(".ui-app-menu:has(.button)")) { (document.querySelector("ui-popup[data-name=\"app-menu\"]") as any)?.showPopup?.( (ev?.target?.matches(".ui-app-menu:has(.button)") ? ev?.target : ev?.target?.closest(".ui-app-menu:has(.button)")) ); }
        });

        //
        return root;
    }

    //
    protected adaptiveTheme() {
        const self = this as unknown as HTMLElement;
        if (!self.hasAttribute("data-scheme")) { self.setAttribute("data-scheme", "solid"); };
        const setTheme = ()=>{
            if (matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches) {
                const hasFrame = document.body.matches(":has(ui-frame:not([data-hidden]))");
                self.setAttribute("data-scheme", hasFrame ? "solid" : "dynamic-transparent");
            } else {
                self.setAttribute("data-scheme", "solid");
            }
        }
        setInterval(setTheme, 1000);
        setTheme();
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        self.style.setProperty("z-index", "9998", "important");
        self.classList?.add?.("ui-taskbar");

        //
        if (!self.hasAttribute("data-chroma"))    { self.setAttribute("data-chroma"         , "0.05" ); };
        if (!self.hasAttribute("data-scheme"))    { self.setAttribute("data-scheme"         , "dynamic-transparent"); };
        if (!self.hasAttribute("data-highlight")) { self.setAttribute("data-highlight"      , "0"    ); };

        //
        this.taskManager?.addTasks?.(this.tasks || []);

        //
        if (matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches) {
            self.dataset.hidden = "";
        }
    }

}
