import { placeWithCursor } from "../position/ts/ps-cursor.js";

//
interface CTXMenuElement {
    icon: HTMLElement;
    content: string;
    callback: Function;
};

//
const excSel = "ui-button";
export const hideOnClick = (ev?)=>{
    const t = ev.target as HTMLElement;
    requestAnimationFrame(()=>{
        const self = document.querySelector(ctx) as HTMLElement;
        const isOutside = !((t?.closest(ctx) == self) || (t == self));
        const exception = t?.closest?.(excSel) || t?.matches?.(excSel);
        if (isOutside && !exception || (ev?.type == "click" && !document.activeElement?.matches?.("input"))) {
            closeContextMenu(ev);
        };
    });
};

//
const evt: [any, any] = [ hideOnClick, {} ];
const ctx: string = "ui-modal[type=\"contextmenu\"]";

//
export const closeContextMenu = (ev?)=>{
    const ctxMenu = (ev?.target?.matches?.(ctx) ? ev?.target : ev?.target?.closest?.(ctx)) ?? document.querySelector(ctx) as HTMLElement;
    if (ctxMenu && ctxMenu.dataset.hidden == null) { ctxMenu.dataset.hidden = ""; };

    //
    document.documentElement.removeEventListener("pointerdown", ...evt);
    document.documentElement.removeEventListener("contextmenu", ...evt);
    document.documentElement.removeEventListener("scroll", ...evt);
    document.documentElement.removeEventListener("click", ...evt);
};

//
export const openContextMenu = (event, toggle: boolean = false, content?: (ctxMenu: any, initiator: any, event?: any)=>void)=>{
    const initiator = event?.target;
    const ctxMenu   = document.querySelector(ctx) as any;

    //
    if (ctxMenu && (toggle && ctxMenu.dataset.hidden != null || !toggle)) {
        document.documentElement.addEventListener("pointerdown", ...evt);
        document.documentElement.addEventListener("contextmenu", ...evt);
        document.documentElement.addEventListener("scroll", ...evt);
        document.documentElement.addEventListener("click", ...evt);

        //
        delete ctxMenu.dataset.hidden;
        placeWithCursor(ctxMenu, event);
        ctxMenu.innerHTML = "";
        ctxMenu.initiator = initiator;
        ctxMenu.event = event;
        content?.(ctxMenu, initiator, event);
    } else
    if (ctxMenu && !ctxMenu.dataset.hidden) {
        closeContextMenu(event);
    }
};

//
export const makeCtxMenuItems = (ctxMenu?: any, initiator?: any, content?: any[])=>{
    content?.map?.((el: CTXMenuElement)=>{
        const li = document.createElement("ui-button-row");
        if (!li.dataset.highlightHover) { li.dataset.highlightHover = "1"; }
        li.style.blockSize = "2.5rem";

        //
        li.addEventListener("click", (e)=>{
            el.callback?.(initiator, ctxMenu?.event);
        });

        //
        if (el.icon) {
            el.icon.remove?.();
            el.icon.style.setProperty("grid-column", "icon");
            li.append(el.icon);
        };
        li.insertAdjacentHTML("beforeend", `<span style="grid-column: content;">${el.content||""}</span>`);

        //
        ctxMenu?.append?.(li);
    });
};
