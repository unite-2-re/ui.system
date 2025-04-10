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

//
import {connect} from "../../$service$/shared/Status";
import { onInteration } from "../../$service$/tasks/opening";
import { setAttributesIfNull } from "../../$service$/shared/Utils";

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
        requestAnimationFrame(()=>{
            if (root) { connect?.(root); this.statusSW = true; }
            root.addEventListener("click", onInteration);
        });
        return root;
    }

    //
    public connectedCallback() {
        super.connectedCallback();

        //
        const self = this as unknown as HTMLElement;
        self.style.setProperty("z-index", "999999", "important");
        setAttributesIfNull(self, {
            "data-scheme": "dynamic-transparent",
            "data-chroma": 0
        });
    }
};

//
export default UIStatusBar;
