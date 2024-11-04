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
        //this.addEventListener("input", this.onSelect.bind(this));

        // @ts-ignore
        //this.style.setProperty("--checked", this.checked ? 1 : 0);

        //
        const sws = { pointerId: -1 };
        const doExaction = (clientX, clientY, confirm = false)=>{
            // @ts-ignore
            const box = this.getBoundingClientRect?.();
            const coord = [clientX - box.left, clientY - box.top];

            // @ts-ignore
            const radio = this.querySelectorAll?.("input[type=\"radio\"]");
            const count = (radio?.length || 0);
            const vary = [
                (coord[0]/box.width) * count,
                (coord[1]/box.height) * 1
            ];

            //
            const val = Math.min(Math.max(vary[0] - 0.5, 0), count-1);
            const exact = Math.min(Math.max(Math.floor(vary[0]), 0), count-1);
            if (!radio?.[exact]?.checked && confirm) {
                radio?.[exact]?.click?.();
            };

            //
            if (confirm) {
                // @ts-ignore
                if (!matchMedia("(prefers-reduced-motion: reduce)").matches && this.animate != null) {
                    let animation: any = null;

                    // @ts-ignore
                    (animation = this.animate?.([
                        // @ts-ignore
                        { "--value": this.style?.getPropertyValue?.("--value") ?? val },
                        { "--value": exact },
                    ], {
                        duration: 100,
                        iterations: 1,
                        fillMode: "both"
                    }))?.finished?.then(()=>{
                        animation?.commitStyles?.();
                        animation?.cancel?.();

                        // @ts-ignore
                        this.style.setProperty("--value", exact, "");
                    });
                } else {
                    // @ts-ignore
                    this.style.setProperty("--value", exact, "");
                }
            } else {
                // @ts-ignore
                this.style.setProperty("--value", val, "");
            }

            //
            if (radio?.[exact]) {
                this.onSelect?.({target: radio?.[exact]});
            }
        }

        // @ts-ignore
        this.addEventListener("pointerdown", (e)=>{
            if (sws.pointerId < 0) {
                sws.pointerId = e.pointerId;

                //
                e.target?.setPointerCapture?.(e.pointerId);
                document.documentElement.style.cursor = "grabbing";
            }
        });

        //
        document.addEventListener("pointermove", (e)=>{
            if (sws.pointerId == e.pointerId) {
                doExaction(e.clientX, e.clientY);
            }
        });

        //
        const stopMove = (e)=>{
            if (sws.pointerId == e.pointerId) {
                sws.pointerId = -1;
                doExaction(e.clientX, e.clientY, true);
                e.target?.releasePointerCapture?.(e.pointerId);
                document.documentElement.style.removeProperty("cursor");
            }
        }

        //
        document.addEventListener("pointerup", stopMove);
        document.addEventListener("pointercancel", stopMove);
    }

    //
    protected onSelect(ev){
        //
        if (ev?.target?.checked) {
            this.value = ev.target.value;

            // @ts-ignore
            const index = Array.from(this.querySelectorAll?.("input[type=\"radio\"]"))?.indexOf?.(ev.target.value);

            // @ts-ignore
            if (index >= 0) { this.style?.setProperty?.("--value", index); };
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
        <div inert data-highlight="6" data-chroma="0.05" data-scheme="inverse" part="ui-fill-inactive" class="ui-fill-inactive"></div>
        <div inert data-highlight="6" data-chroma="0.05" data-scheme="solid" part="ui-fill-active" class="ui-fill-active"></div>
    </div>
    <div data-highlight="8" data-chroma="0.1" part="ui-thumb" class="ui-thumb" data-scheme="inverse"></div>
    <div part="ui-inputs" class="ui-inputs"><slot></slot></div>
</label>`;
    }
}

//
export default UISwitch;
