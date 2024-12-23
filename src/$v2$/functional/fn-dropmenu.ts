import { placeWithElement } from "../position/ts/ps-anchor.js";
import { closeContextMenu, openContextMenu } from "./fn-contextmenu";

//
export const openDropMenu = (button: any, ev?: any)=>{
    ev?.preventDefault?.();
    ev?.stopPropagation?.();

    //
    const items = Array.from(button?.querySelectorAll?.("ui-select-row, ui-button-row"));
    const cloned = items?.map?.((el: any)=>{
        const input: any = el?.querySelector?.("input") ?? el;
        const clone: any = el?.cloneNode?.(true);
        clone?.addEventListener?.("change", (ev)=>input?.click?.());
        clone?.addEventListener?.("click", (ev)=>closeContextMenu());
        return clone;
    });

    //
    openContextMenu?.(ev, true, (menu, initiator)=>{
        placeWithElement?.(menu, button);
        menu.append(...cloned);
    });
};
