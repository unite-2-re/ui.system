
//
export class UIGridBoxElement extends HTMLElement {
    #initialized: boolean = false;

    //
    #initialize() {
        if (!this.#initialized) {
            this.#initialized = true;

            // legacy?
            this.classList.add("u2-grid-layout");
        }
    }

    //
    constructor() {
        super();
    }

    //
    connectedCallback() {
        this.#initialize();
    }
}

//
try { customElements.define("ui-gridbox", UIGridBoxElement); } catch(e) {};
export default () => {};
