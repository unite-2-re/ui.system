/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "../shared/BoxLayout.scss?inline";

// @ts-ignore
import htmlT from "../shared/BoxLayout.html?raw";

// @ts-ignore
@customElement('ui-switch')
export class UISwitch extends LitElement {

    //
    constructor() {
        super();

        // @ts-ignore
        this.classList?.add?.("ui-switch");

        // @ts-ignore
        this.classList?.add?.("u2-input");

        // @ts-ignore
        this.addEventListener("change", this.onSelect.bind(this));

        // @ts-ignore
        this.addEventListener("input", this.onSelect.bind(this));

        // @ts-ignore
        //this.style.setProperty("--checked", this.checked ? 1 : 0);
    }

    //
    protected onSelect(ev){
        //
        if (ev?.target?.checked) {
            this.value = ev.target.value;
        }
    }

    // theme style property
    @property() protected themeStyle?: HTMLStyleElement;
    @property() protected value: string = "";

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            // @ts-ignore
            if (root) {
                // @ts-ignore
                this.themeStyle = module?.default?.(root);
            }
        }).catch(console.warn.bind(console));

        // @ts-ignore
        return root;
    }

    //
    static styles = css`${unsafeCSS(styles)}`

    //
    render() {
        // use theme module if available
        return html`${this.themeStyle}<label part="ui-contain" class="ui-contain">
    <div part="ui-fill" class="ui-fill">
        <div data-scheme="inverse" part="ui-fill-inactive" class="ui-fill-inactive"></div>
        <div data-scheme="solid" part="ui-fill-active" class="ui-fill-active"></div>
    </div>
    <div part="ui-thumb" class="ui-thumb" data-scheme="inverse"></div>
    <div part="ui-inputs" class="ui-inputs"><slot></slot></div>
</label>`;
    }
}

//
export default UISwitch;
