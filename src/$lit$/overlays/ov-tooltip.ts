// @ts-ignore
import LitElementTheme from "@mods/shared/LitElementTheme";

// @ts-ignore
import styles from "@scss/design/ov-tooltip.scss?inline";
import { defineElement, property } from "/externals/lib/blue.js";

// @ts-ignore
@defineElement('ui-tooltip')
export class UITooltip extends LitElementTheme {
    @property() protected current?: string;

    //
    public styles = () => styles;
    public initialAttributes = {
        "data-chroma": "0.001",
        "data-scheme": "solid",
        "data-alpha": 1
    };

    //
    protected onInitialize() {
        super.onInitialize?.();
        const self = this as unknown as HTMLElement;
        self.style.setProperty("z-index", "9999", "important");
        self.classList?.add?.("ui-tooltip");
        self.classList?.add?.("u2-tooltip");
        return this;
    }
}
