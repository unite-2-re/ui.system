/// <reference types="lit" />

// @ts-ignore
import { css, unsafeCSS } from "../../shared/LitUse";
import LitElementTheme from "../../shared/LitElementTheme";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import htmlCode from "./index.html?raw";

// @ts-ignore
import styles from "./index.scss?inline";

// @ts-ignore
import {initTaskManager} from "/externals/core/core.js";

//
import {connect} from "../../shared/Status";


// @ts-ignore
@customElement('ui-taskbar')
export class UITaskBar extends LitElementTheme {
    // theme style property
    @property({ type: Boolean }) protected statusSW?: boolean = false;
    @property({ type: Array }) public tasks?: any[] = [];
    @property() public taskManager?: any;

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`;
    constructor(options = {icon: "", padding: "", taskManager: null}) {
        super(); const self = this as unknown as HTMLElement;

        //
        this.taskManager ??= options?.taskManager || initTaskManager();
        this.taskManager.addTasks(this.tasks || []);

        // cupola
        const media = matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))");

        //
        media.addEventListener("change", ({matches}) => {
            if (matches) { delete self.dataset.hidden; } else { self.dataset.hidden = ""; };
        });

        //
        requestAnimationFrame(()=>{
            if (media.matches) { delete self.dataset.hidden; } else { self.dataset.hidden = ""; };
        });
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);
        this.adaptiveTheme();

        //
        if (root) {
            connect?.(root);
            this.statusSW = true;
        }

        //
        const DOC = document.documentElement;
        root.addEventListener("click", (ev)=>{
            if (ev?.target?.matches("[data-popup]")) {
                const popup = document.querySelector("ui-modal[type=\"popup\"][data-name=\"" + ev?.target?.dataset?.popup + "\"]") as any;
                popup?.showPopup?.(ev?.target?.matches(".ui-anchor") ? ev?.target : ev?.target?.closest(".ui-anchor"))
                DOC.querySelectorAll("ui-modal[type=\"popup\"]")?.forEach?.((el: any)=>{ if (el != popup) { el.dataset.hidden = ""; }; });
            } else {
                DOC.querySelectorAll("ui-modal[type=\"popup\"]")?.forEach?.((el: any)=>{ el.dataset.hidden = ""; });
            }

            // TODO: native action registry support
            if (ev?.target?.matches("[data-action=\"fullscreen\"]")) {
                if (!document.fullscreenElement) {
                    document.documentElement?.requestFullscreen?.({
                        navigationUI: "hide", screen
                    })?.catch?.(console.warn.bind(console));
                } else
                if (document.exitFullscreen) {
                    document?.exitFullscreen?.();
                }
            }
        });

        //
        return root;
    }

    //
    protected adaptiveTheme() {
        const self = this as unknown as HTMLElement;
        if (!self.hasAttribute("data-scheme")) { self.setAttribute("data-scheme", "solid"); };

        //
        const setTheme = ()=>{
            if (matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches) {
                const hasFrame = document.body.matches(":has(ui-frame:not([data-hidden]))");
                self.setAttribute("data-scheme", hasFrame ? "solid" : "dynamic-transparent");
            } else {
                self.setAttribute("data-scheme", "solid");
            }
        }

        //
        setInterval(setTheme, 1000);
        setTheme();

        //
        document.addEventListener("u2-appear", setTheme);
        document.addEventListener("u2-hidden", setTheme);
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
        if (!self.hasAttribute("data-alpha"))     { self.setAttribute("data-alpha"          , "1" ); };
        if (!self.hasAttribute("data-chroma"))    { self.setAttribute("data-chroma"         , "0" ); };
        if (!self.hasAttribute("data-scheme"))    { self.setAttribute("data-scheme"         , "dynamic-transparent"); };
        if (!self.hasAttribute("data-highlight")) { self.setAttribute("data-highlight"      , "0"    ); };

        //
        const media = matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))");

        // if mobile, hide it
        if (!media.matches) { self.dataset.hidden = ""; }
    }

}
