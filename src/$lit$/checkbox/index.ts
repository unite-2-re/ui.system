/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "../shared/BoxLayout.scss?inline";

// @ts-ignore
@customElement('ui-checkbox')
export class UICheckBox extends LitElement {

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;

        //
        self.classList?.add?.("ui-checkbox");
        self.classList?.add?.("u2-input");
        self.addEventListener("change", this.onSelect.bind(this));
        self.addEventListener("click", (e)=>{
            if (!(e.target as HTMLElement)?.matches?.("input[type=\"checkbox\"]")) {
                self.querySelector?.<HTMLElement>("input[type=\"checkbox\"]")?.click?.();
            }
        });
    }

    //
    protected onSelect(ev) {
        const self = this as unknown as HTMLElement;
        if (ev.target.checked != null) {
            this.checked = ev.target.checked;
            self.style.setProperty("--value", `${this.checked ? 1 : 0}`);
        }
    }

    // theme style property
    @property() protected themeStyle?: HTMLStyleElement;
    @property() protected checked: boolean = false;

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            if (root) { this.themeStyle = module?.default?.(root); }
        }).catch(console.warn.bind(console));

        //
        return root;
    }

    //
    static styles = css`${unsafeCSS(styles)}`

    //
    render() {
        // use theme module if available
        return html`${this.themeStyle}<label part="ui-contain" class="ui-contain">
    <div part="ui-fill" class="ui-fill">
        <div inert data-highlight="6" data-chroma="0.05" data-scheme="inverse" part="ui-fill-inactive" class="ui-fill-inactive"></div>
        <div inert data-highlight="6" data-chroma="0.05" data-scheme="solid" part="ui-fill-active" class="ui-fill-active"></div>
    </div>
    <div data-highlight-hover="10" data-highlight="8" data-chroma="0.1" data-scheme="inverse" part="ui-thumb" class="ui-thumb"></div>
    <div part="ui-inputs" class="ui-inputs"><slot></slot></div>
</label>`;
    }
}

//
export default UICheckBox;
