//
import UILucideIcon from "../decor/icon/index";
import { makeCtxMenuItems, openContextMenu } from "./fn-contextmenu";

// test only!
export const openDropMenu = (ev)=>{
    ev?.preventDefault?.();
    ev?.stopPropagation?.();

    //
    const self = this as unknown as HTMLElement;
    const dropMenuEl = Array.from(self?.querySelectorAll?.("ui-menuitem"));
    const dropMenu = dropMenuEl.map((el: any)=>{
        const dub = el?.cloneNode?.(true);
        dub?.querySelectorAll?.("input")?.forEach?.((el)=>el?.remove?.());
        const icon = dub?.querySelector?.("ui-icon");
        const input = el?.querySelector?.("input") ?? el;
        return {
            icon: icon?.cloneNode?.(true) || new UILucideIcon({icon: icon?.icon || el?.icon || el?.dataset?.icon, padding: ""}),
            content: dub?.innerHTML,
            callback() {
                input?.click?.();
                self.setAttribute("value", this.value = input?.value);
            }
        }
    });

    //
    openContextMenu?.(ev, true, (menu, initiator)=>makeCtxMenuItems(menu, initiator, dropMenu));
};
