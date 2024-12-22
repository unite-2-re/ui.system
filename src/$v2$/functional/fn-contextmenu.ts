//
interface CTXMenuElement {
    icon: HTMLElement;
    content: string;
    callback: Function;
};

//
export const hideOnClick = (ev?)=>{
    const t = ev.target as HTMLElement;
    const self = document.querySelector("ui-contextmenu") as HTMLElement;
    if (!((t?.closest("ui-contextmenu") == self) || (t == self)) || ev?.type == "click") {
        closeContextMenu(ev);
    };
}

//
const evt: [any, any] = [ hideOnClick, {} ];

//
export const closeContextMenu = (ev?)=>{
    const ctxMenu = document.querySelector("ui-contextmenu") as HTMLElement;
    if (ctxMenu) { ctxMenu.dataset.hidden = "true"; };

    //
    document.documentElement.removeEventListener("contextmenu", ...evt);
    document.documentElement.removeEventListener("click", ...evt);
}

//
export const openContextMenu = (event, toggle: boolean = false, content?: (ctxMenu: any, initiator: any)=>void)=>{
    const initiator = event?.target;
    const ctxMenu   = document.querySelector("ui-contextmenu") as any;

    //
    ctxMenu.initiator = initiator;

    //
    if (ctxMenu && (toggle && ctxMenu.dataset.hidden || !toggle)) {
        document.documentElement.addEventListener("contextmenu", ...evt);
        document.documentElement.addEventListener("click", ...evt);

        //
        ctxMenu.innerHTML = "";
        content?.(ctxMenu, initiator);
        delete ctxMenu.dataset.hidden;
    } else
    if (ctxMenu && toggle && !ctxMenu.dataset.hidden) {
        closeContextMenu(event);
    }
}

//
export const makeCtxMenuItems = (ctxMenu?: any, initiator?: any, content?: any[])=>{
    content?.map?.((el: CTXMenuElement)=>{
        const li = document.createElement("li");
        if (!li.dataset.highlightHover) { li.dataset.highlightHover = "1"; }

        //
        li.addEventListener("click", (e)=>{
            el.callback?.(initiator, {});
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