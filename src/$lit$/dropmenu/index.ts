/// <reference types="lit" />

// @ts-ignore
import { LitElement, html, css, unsafeCSS, unsafeStatic, withStatic } from "../shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import { openContextMenu } from "/externals/wcomp/contextmenu.js";

//
import UILucideIcon from "../icon/index";

// @ts-ignore
import htmlCode from "./index.html?raw";

// @ts-ignore
import styles from "./index.scss?inline";



//
const testMenu = [
    {icon: new UILucideIcon({icon: "github", padding: ""}), content: "Properties", callback: ()=>{console.log("Properties")}},
    {icon: new UILucideIcon({icon: "youtube", padding: ""}), content: "Clone", callback: ()=>{console.log("Clone")}}
];

// @ts-ignore
@customElement('ui-dropmenu')
export class UIDropMenu extends LitElement {

    //
    @property({}) dropMenu?: any = testMenu;
    @property() protected themeStyle?: HTMLStyleElement;
    @property() protected nodes?: HTMLElement[];

    //
    static styles = css`${unsafeCSS(styles)}`

    //
    protected render() {
        // use theme module if available
        return html`${this.themeStyle}${this.nodes}`;
    }

    //
    constructor() {
        super(); const self = this as unknown as HTMLElement;

        //
        self.classList?.add?.("ui-dropmenu");
        self.classList?.add?.("u2-dropmenu");
        self.classList?.add?.("u2-input");
        self.addEventListener("click", this.onClick.bind(this));
        self.addEventListener("contextmenu", (ev)=>{
            ev.stopPropagation();
            ev.preventDefault();
        });
    }

    // test only!
    protected onClick(ev) {
        ev?.preventDefault?.();
        ev?.stopPropagation?.();

        //
        openContextMenu?.(ev, this.dropMenu || testMenu, true);
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        const self = this as unknown as HTMLElement;

        //
        if (!self.dataset.scheme) { self.dataset.scheme = "solid"; };
        if (!self.dataset.highlight) { self.dataset.highlight = "1"; };
        if (!self.dataset.highlightHover) { self.dataset.highlightHover = "2"; };
    }

    //
    protected createRenderRoot() {
        const root = super.createRenderRoot();

        //
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlCode, "text/html");
        this.nodes = Array.from((dom.querySelector("template") as HTMLTemplateElement)?.content?.childNodes) as HTMLElement[];

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js").then((module)=>{
            if (root) { this.themeStyle = module?.default?.(root); }
        }).catch(console.warn.bind(console));
        return root;
    }
}

//
export default UIDropMenu;
