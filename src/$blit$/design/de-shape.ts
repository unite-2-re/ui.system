/// <reference types="lit" />
// whole dedicated, separate element for lucide icons...
// this component (or lucide icons) may to be distributed with main package.

// @ts-ignore /* @vite-ignore */
import { BLitElement, defineElement, E, H, property } from "/externals/modules/blue.js";

// @ts-ignore
import styles from "@scss/design/de-shape.scss?inline";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
const loading = fetch(preInit, {priority: "high", keepalive: true, cache: "force-cache", mode: "same-origin"});

// @ts-ignore
@defineElement('ui-shaped')
export class UIShaped extends BLitElement() {
    @property({ source: "attr" }) icon?: string;

    //
    public styles = ()=>preInit;
    public render = (w)=>{
        return H`<slot></slot><ui-icon data-chroma="0" data-alpha="0" style="padding: 25%;" part="icon" icon=${w.deref().icon||""}/>`
    }
    public initialAttributes = {
        "data-transparent": "",
        "data-alpha": 0,
        "data-chroma": 0.1,
        "data-scheme": "solid",
        "data-highlight": 0
    };

    //
    constructor(options = {icon: "", padding: ""}) { super(); if (options?.icon) { this.icon = options?.icon || ""; }; }
    protected onInitialize() { super.onInitialize?.(); E(this, { classList: new Set(["ui-shaped", "u2-shaped"]) }); return this; }
}

//
export default UIShaped;
