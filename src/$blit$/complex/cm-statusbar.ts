import { connect } from "@service/behaviour/bh-status";
import { onInteration } from "@service/tasks/opening";

// @ts-ignore
import htmlCode from "@temp/ov-statusbar.html?raw";

// @ts-ignore
import styles from "@scss/design/ov-statusbar.scss?inline";
import ThemedElement from "../shared/ThemedElement";

// @ts-ignore /* @vite-ignore */
import { H, property, defineElement } from "/externals/modules/blue.js";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));

// @ts-ignore
@defineElement('ui-statusbar')
export class UIStatusBar extends ThemedElement {
    @property() protected statusSW?: boolean = false;

    //
    protected initialAttributes = {
        "data-alpha": 0,
        "data-scheme": "dynamic-transparent",
        "data-chroma": 0
    };

    //
    public styles = () => preInit;
    public render = () => H(htmlCode);

    //
    constructor() { super(); }
    protected onInitialize() {
        super.onInitialize?.();
        this.style.setProperty("z-index", "999999", "important");
        this.style.setProperty("background-color", "transparent");
        return this;
    }

    //
    protected onRender() {
        const root = (this as HTMLElement).shadowRoot;
        if (root) { connect?.(root); this.statusSW = true; }
        root?.addEventListener?.("click", onInteration);
        return root;
    }
};

//
export default UIStatusBar;
