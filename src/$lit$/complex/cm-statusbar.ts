/// <reference types="lit" />

// @ts-ignore
import { css, unsafeCSS } from "@mods/shared/LitUse";
import LitElementTheme from "@mods/shared/LitElementTheme";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

//
import { connect } from "@service/behaviour/bh-status";
import { onInteration } from "@service/tasks/opening";
import { setAttributesIfNull } from "@service/Utils";

// @ts-ignore
import htmlCode from "@temp/ov-statusbar.html?raw";

// @ts-ignore
import styles from "@scss/design/ov-statusbar.scss?inline";

// @ts-ignore
@customElement('ui-statusbar')
export class UIStatusBar extends LitElementTheme {
    @property() protected statusSW?: boolean = false;

    //
    static styles = css`${unsafeCSS(`@layer ux-layer {${styles}};`)}`;
    constructor() { super(); }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        if (root) { connect?.(root); this.statusSW = true; }
        root.addEventListener("click", onInteration);

        //
        this.importFromTemplate(htmlCode);
        const self = this as unknown as HTMLElement;
        requestAnimationFrame(()=>{
            self.style.setProperty("z-index", "999999", "important");
            setAttributesIfNull(self, {
                "data-scheme": "dynamic-transparent",
                "data-chroma": 0
            });
        });
        return root;
    }
};

//
export default UIStatusBar;
