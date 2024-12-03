/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./index.scss?inline";

// @ts-ignore
import htmlCode from "./index.html?raw";

//
import LitElementTheme from "../shared/LitElementTheme";

// avoid memory leaking...
//const refMap = new WeakSet([]);

// @ts-ignore
@customElement('ui-number')
export class UINumber extends LitElementTheme {

    // theme style property
    @property() protected value: number = 0;

    //
    static styles = css`${unsafeCSS(styles)}`;

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        self.classList?.add?.("ui-number");
        self.classList?.add?.("u2-input");
        self.addEventListener("input", this.onSelect.bind(this));
        self.addEventListener("change", this.onSelect.bind(this));
    }

    //
    protected onSelect(ev?: any){
        const self = this as unknown as HTMLElement;
        const element = ev?.target ?? self;

        //
        if (element) {
            const input = ((element.matches("input[type=\"number\"]") ? element : element.querySelector?.("input[type=\"number\"]")) as HTMLInputElement);
            const value = input?.valueAsNumber || parseFloat(input?.value) || 0; this.value = value;
            const index = value - (parseFloat(input?.min) || 0);
            const indicator = self?.querySelector?.(".ui-indicator");

            //
            if (index >= 0 && ev?.type != "input") { self.style?.setProperty?.("--value", `${index}`); };
            self.style.setProperty("--max-value", `${((parseFloat(input?.max)||0) - (parseFloat(input?.min)||0))}`, "");

            //
            if (indicator) {
                indicator.innerHTML = "" + value?.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 1
                });
            }
        }
    }

    //
    protected createRenderRoot() {
        const weak = new WeakRef(this);
        const root = super.createRenderRoot();
        this.importFromTemplate(htmlCode);

        //
        requestIdleCallback(()=>{
            //
            root?.querySelector?.(".ui-step-up")?.addEventListener?.("click", (ev)=>{
                const btn   = ev?.target;
                const self  = weak?.deref?.() as (HTMLElement | undefined);
                const input = self?.querySelector?.("input") as (HTMLInputElement | undefined);
                input?.stepUp?.();
            });

            //
            root?.querySelector?.(".ui-step-down")?.addEventListener?.("click", (ev)=>{
                const btn  = ev?.target;
                const self = weak?.deref?.() as (HTMLElement | undefined);
                const input = self?.querySelector?.("input") as (HTMLInputElement | undefined);
                input?.stepDown?.();
            });
        });

        //
        return root;
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        requestIdleCallback(()=>this.onSelect(), {timeout: 1000});

        //
        const self = this as unknown as HTMLElement;
        if (!self.hasAttribute("data-scheme")) { self.setAttribute("data-scheme", "solid"); };
        if (!self.hasAttribute("data-highlight")) { self.setAttribute("data-highlight", "4"); };
    }
}

//
export default UINumber;
