/// <reference types="lit" />
// whole dedicated, separate element for lucide icons...
// this component (or lucide icons) may to be distributed with main package.

// @ts-ignore
import { html, PropertyValues, LitElement } from "@mods/shared/LitUse";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "@scss/foreign/fe-icon.scss?inline";

//
const importStyle = `@import url("${URL.createObjectURL(new Blob([styles], {type: "text/css"}))}");`;

// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";
import { E } from "/externals/lib/blue";

// @ts-ignore
const toCamelCase = (str: string) => {
    return str
        .split(/[-_]/)
        .map((word, index) => {
            /*if (index === 0) {
                return word;
            }*/
            return (
                word.charAt(0).toUpperCase() +
                word.slice(1)
            );
        })
        .join("");
}

//
const rasterizeSVG = async (blob)=>{
    /*const img = new Image();
    img.decoding = "async";
    img.src = URL.createObjectURL(blob);
    await img.decode();
    const raster = await createImageBitmap(img, {
        resizeWidth: 24 * devicePixelRatio,
        resizeHeight: 24 * devicePixelRatio,
    });
    const canvas = new OffscreenCanvas(raster.width, raster.height);
    canvas?.getContext?.('bitmaprenderer')?.transferFromImageBitmap?.(raster);
    return URL.createObjectURL(await canvas.convertToBlob({ type: 'image/png' }));*/
    return URL.createObjectURL(blob);
}

//
const iconMap = new Map<string, Promise<string>>();
const loadAsImage = (name: string, creator?: (name: string)=>any)=>{
    if (iconMap.has(name)) { return iconMap.get(name); };

    //
    const element = creator ? creator(name) : null;
    //const serializer = new XMLSerializer();
    const text = element.outerHTML;//element ? serializer.serializeToString(element) : "";
    const file = new Blob([`<?xml version=\"1.0\" encoding=\"UTF-8\"?>`, text], { type: "image/svg+xml" });
    const url = rasterizeSVG(file);//URL.createObjectURL(file);
    iconMap.set(name, url);
    return url;
};

// @ts-ignore
@customElement('ui-icon')
export class UILucideIcon extends LitElement {
    @property() protected iconElement?: SVGElement;
    @property({attribute: true, reflect: true, type: String}) icon?: string;// = "";
    @property({attribute: true, reflect: true, type: Number}) width?: number; //= 1;

    //
    constructor(options = {icon: "", padding: ""}) {
        super(); const self = this as unknown as HTMLElement;
        requestAnimationFrame(()=>{
            E(self, {
                classList: new Set(["ui-icon", "u2-icon"]),
                inert: true
            })
            if (!self?.style.getPropertyValue("padding") && options?.padding) { self.style.setProperty("padding", options?.padding); };
            if (!this?.icon && options?.icon) { this.icon = options?.icon; }
            this.updateIcon();
        });
    }

    // also "display" may be "contents"
    protected render() { return html`<style>${importStyle}</style><div class="fill"></div>`; }

    //
    public connectedCallback() { super.connectedCallback(); this.updateIcon(); }
    public firstUpdated() { this.updateIcon(); }

    //
    protected updateIcon($icon?: string) {
        const self = this as unknown as HTMLElement;
        const icon = this.icon || self.getAttribute("icon") || $icon || "circle-help";
        // @ts-ignore
        if (icon) Promise.try(importCdn, ["/externals/vendor/lucide.min.js"])?.then?.((icons)=>{
            const ICON = toCamelCase(icon);
            if (icons?.[ICON]) {
                const self = this as any;
                loadAsImage(ICON, (U)=>icons?.createElement?.(icons?.[U]))?.then?.((url)=>{
                    const src  = `url(\"${url}\")`;
                    const fill = self?.shadowRoot?.querySelector?.(".fill");
                    if (fill?.style?.getPropertyValue?.("mask-image") != src) {
                        fill?.style?.setProperty?.("mask-image", src);
                    }
                });
            }
        }).catch(console.warn.bind(console));
    }

    //
    protected updated(changedProperties: PropertyValues<this>) {
        if (changedProperties?.has?.("icon") || !changedProperties) {
            this.updateIcon(changedProperties?.get?.("icon"));
        }
    }
}

//
export default UILucideIcon;
