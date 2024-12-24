/// <reference types="lit" />
// Type: standalone

// @ts-ignore
import { customElement } from "lit/decorators.js";

//
import LitElementTheme from "../shared/LitElementTheme";

// @ts-ignore
@customElement('ui-button-base')
export class UIButtonBase extends LitElementTheme {
    $parentNode?: any;

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;
        self.addEventListener("contextmenu", (ev)=>{
            ev?.stopPropagation?.();
            ev?.preventDefault?.();
        });
    }

    //
    protected render() {
        return super.render();
    }

    //
    protected importFromTemplate(htmlCode) {
        return super.importFromTemplate?.(htmlCode);
    }

    //
    public connectedCallback() {
        super.connectedCallback();
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        return root;
    }
}

//
export default UIButtonBase;
