/// <reference types="lit" />
// whole dedicated, separate element for lucide icons...
// this component (or lucide icons) may to be distributed with main package.

// @ts-ignore
import { html, css, unsafeCSS, PropertyValues } from "../../shared/LitUse";
import LitElementTheme from "../../shared/LitElementTheme";

// @ts-ignore
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import styles from "./index.scss?inline";

// @ts-ignore
const ICON_MODULE = import("/externals/vendor/lucide.min.js");
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
    if (iconMap.has(name)) {
        return iconMap.get(name);
    };

    //
    const element = creator ? creator(name) : null;
    //const serializer = new XMLSerializer();
    const text = element.outerHTML;//element ? serializer.serializeToString(element) : "";
    const file = new Blob([`<?xml version=\"1.0\" encoding=\"UTF-8\"?>`, text], {
        type: "image/svg+xml"
    });
    const url = rasterizeSVG(file);//URL.createObjectURL(file);
    iconMap.set(name, url);
    return url;
};

// @ts-ignore
@customElement('ui-icon')
export class UILucideIcon extends LitElementTheme {
    @property() protected iconElement?: SVGElement;
    @property({attribute: true, reflect: true, type: String}) icon: string = "";
    @property({attribute: true, reflect: true, type: Number}) width: number = 1;

    // also "display" may be "contents"
    static styles = css`${unsafeCSS(styles)}`;
    protected render() { return html`${this.themeStyle}`; }

    //
    constructor(options = {icon: "", padding: ""}) {
        super(); const self = this as unknown as HTMLElement;
        if (options?.icon) { this.icon = options?.icon; };
        if (options?.padding) { self.style.setProperty("padding", options?.padding); };
        self.inert = true;
    }

    //
    public connectedCallback() {
        super.connectedCallback();
        this.updateIcon();

        //
        const self = this as unknown as HTMLElement;
        if (!self.classList?.contains?.("ui-icon")) self.classList?.add?.("ui-icon");
        if (!self.classList?.contains?.("u2-icon")) self.classList?.add?.("u2-icon");
    }

    //
    protected updateIcon() {
        ICON_MODULE.then((icons)=>{
            const ICON = toCamelCase(this.icon);
            if (icons?.[ICON]) {
                const self = this as unknown as HTMLElement;
                loadAsImage(ICON, (U)=>icons?.createElement?.(icons?.[U]))?.then?.((url)=>{
                    const src = `url(\"${url}\")`;
                    if (self.style.getPropertyValue("mask-image") != src) {
                        self.style.setProperty("mask-image", src);
                    }
                });
            }
        }).catch(console.warn.bind(console));
    }

    //
    protected hasChanged(changedProperties: PropertyValues<this>) {
        if (changedProperties.has("icon")) {
            this.updateIcon();
        }
    }
}

//
export default UILucideIcon;
