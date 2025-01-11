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
@customElement('ui-statusbar')
export class UIStatusBar extends LitElementTheme {
    @property() protected statusSW?: boolean = false;

    //
    static styles = css`${unsafeCSS(styles)}`;
    constructor() { super(); }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);

        //
        import("../../shared/Status").then((module)=>{
            if (root) {
                module?.default?.(root);
                this.statusSW = true;
            }
        }).catch(console.warn.bind(console));

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
        });

        //
        return root;
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        self.style.setProperty("z-index", "999999", "important");
        if (!self.hasAttribute("data-chroma")) { self.setAttribute("data-chroma", "0"); };
        if (!self.hasAttribute("data-scheme")) { self.setAttribute("data-scheme", "dynamic-transparent"); };
    }
};

//
export default UIStatusBar;
