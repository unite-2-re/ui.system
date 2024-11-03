// @ts-ignore
import styles from "../$scss$/Bundle.scss?inline&compress";

//
const OWNER = "design";

//
const hash = async (string) => {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    return "sha256-" + btoa(String.fromCharCode.apply(null, new Uint8Array(hashBuffer) as unknown as number[]));
}

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
const integrity = hash(styles);

//
export const styleCode = {preInit, integrity, styles};

//
const setStyleURL = (base: [any, any], url: string)=>{
    //
    if (base[1] == "innerHTML") {
        base[0][base[1]] = `@import url("${url}");`;
    } else {
        base[0][base[1]] = url;
    }
}

//
const loadStyleSheet = async (inline: string, base?: [any, any], integrity?: string|Promise<string>)=>{
    const url = URL.canParse(inline) ? inline : URL.createObjectURL(new Blob([inline], {type: "text/css"}));
    if (base?.[0] && (!URL.canParse(inline) || integrity) && base?.[0] instanceof HTMLLinkElement) {
        base[0].setAttribute("integrity", await (integrity || hash(inline)));
    }
    if (base) setStyleURL(base, url);
}

//
const loadBlobStyle = (inline: string, integrity?: string|Promise<string>)=>{
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.crossOrigin = "same-origin";
    style.dataset.owner = OWNER;
    loadStyleSheet(inline, [style, "href"], integrity);
    document.head.appendChild(style);
    return style;
}

//
const loadInlineStyle = (inline: string, rootElement = document.head, $integrity = integrity)=>{
    const PLACE = (rootElement?.querySelector?.("head") ?? rootElement) as HTMLElement;
    if (PLACE instanceof HTMLHeadElement) { return loadBlobStyle(inline); }

    //
    const style = document.createElement("style");
    style.dataset.owner = OWNER;
    loadStyleSheet(inline, [style, "innerHTML"], $integrity);
    PLACE?.appendChild?.(style);
    return style;
}

//
const initialize = (rootElement = document.head)=>{
    loadInlineStyle(preInit, rootElement);
}

//
export default initialize;
