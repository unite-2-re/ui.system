import { placeWithElement } from "../position/ts/ps-anchor.js";
import { closeContextMenu, openContextMenu } from "./fn-contextmenu";

//
export const openDropMenu = (button: any, ev?: any)=>{
    ev?.preventDefault?.();
    ev?.stopPropagation?.();

    //
    const items = Array.from(button?.querySelectorAll?.("ui-select-row, ui-button-row"));
    const cloned = items?.map?.((el: any)=>{
        const clone: any = el?.matches("ui-button-row") ? el?.cloneNode?.(true) : document?.createElement?.("ui-button-row");
        if (el?.matches("ui-select-row")) {
            clone?.append(...Array.from(el?.querySelectorAll?.("*:not(input)")).map((n:any)=>n.cloneNode(true)));
        }

        //
        clone?.style?.removeProperty("display");
        clone?.addEventListener?.("change", (ev)=>{
            const input: any = el?.matches?.("input") ? el : el?.querySelector?.("input");
            //input?.click?.();
            //input?.dispatchEvent?.(new Event("change", { bubbles: true }));
        });
        clone?.addEventListener?.("click", (ev)=>{
            const input: any = el?.matches?.("input") ? el : el?.querySelector?.("input");
            input?.click?.();
            //input?.dispatchEvent?.(new Event("change", { bubbles: true }));
            closeContextMenu();
        });
        return clone;
    });

    //
    openContextMenu?.(ev, true, (menu, initiator)=>{
        menu.append(...cloned);
        placeWithElement?.(menu, button);
    });
};
