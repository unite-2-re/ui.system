/// <reference types="lit" />
// whole dedicated, separate element for lucide icons...
// this component (or lucide icons) may to be distributed with main package.

// @ts-ignore /* @vite-ignore */
import { BLitElement, defineElement, E, H } from "/externals/modules/blue.js";

// @ts-ignore
import styles from "@scss/design/de-block.scss?inline";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
const loading = fetch(preInit, {priority: "high", keepalive: true, cache: "force-cache", mode: "same-origin"});

// @ts-ignore
@defineElement('ui-block')
export class UIBlock extends BLitElement() {
    protected initialAttributes = {
        "data-transparent": "",
        "data-alpha": 0,
        "data-chroma": 0.1,
        "data-scheme": "solid",
        "data-highlight": 0
    };

    //
    public styles = ()=>preInit;
    public render = ()=>H`
<div part="ui-block-icon" data-place="icon"><slot name="icon"/></div>
<div part="ui-block-label" data-place="label"><slot name="label"/></div>
<div part="ui-block-element" data-place="element"><slot/></div>
`;

    //
    public onInitialize() {
        super.onInitialize?.(); E(this, { classList: new Set(["ui-block", "u2-block"]), })
    }
}

//
export default UIBlock;
