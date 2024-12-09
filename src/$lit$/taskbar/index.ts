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
        return root;
    }

    //
    protected adaptiveTheme() {
        const self = this as unknown as HTMLElement;
        if (!self.hasAttribute("data-scheme")) { self.setAttribute("data-scheme", "solid"); };
        const setTheme = ()=>{
            if (matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches) {
                const hasFrame = document.body.matches(":has(ui-frame:not([data-hidden]))");
                self.setAttribute("data-scheme", hasFrame ? "solid" : "accent");
                self.setAttribute("data-alpha", hasFrame ? "1" : "0");
            } else {
                self.setAttribute("data-scheme", "solid");
                self.setAttribute("data-alpha", "1");
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
        if (!self.hasAttribute("data-chroma"))          { self.setAttribute("data-chroma"         , "0.05" ); };
        //if (!self.hasAttribute("data-scheme"))          { self.setAttribute("data-scheme"         , "accent"); };
        if (!self.hasAttribute("data-alpha"))           { self.setAttribute("data-alpha"          , "1"    ); };
        if (!self.hasAttribute("data-highlight"))       { self.setAttribute("data-highlight"      , "4"    ); };

        //
        this.taskManager?.addTasks?.(this.tasks || []);

        //
        if (matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches) {
            self.dataset.hidden = "";
        }

        //
        //this.adaptiveTheme();
    }

}
