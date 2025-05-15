// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";
export {importCdn};

// @ts-ignore
import styles from "./LongText.scss?inline&compress";

//
export { styles };

//
export const MOC = (element: HTMLElement | null, selector: string): boolean => {
    return (!!element?.matches?.(selector) || !!element?.closest?.(selector));
};

//
export const MOCElement = (element: HTMLElement | null, selector: string): HTMLElement | null => {
    return ((!!element?.matches?.(selector) ? element : null) || element?.closest?.(selector)) as HTMLElement | null;
};

//
export const setProperty = (target, name, value, importance = "")=>{
    if ("attributeStyleMap" in target) {
        const raw = target.attributeStyleMap.get(name);
        const prop = raw?.[0] ?? raw?.value;
        if (parseFloat(prop) != value && prop != value || prop == null) {
            //if (raw?.[0] != null) { raw[0] = value; } else
            if (raw?.value != null) { raw.value = value; } else
            { target.attributeStyleMap.set(name, value); };
        }
    } else {
        const prop = target?.style?.getPropertyValue?.(name);
        if (parseFloat(prop) != value && prop != value || prop == null) {
            target?.style?.setProperty?.(name, value, importance);
        }
    }
}

//
export const doButtonAction = (button, input: HTMLInputElement)=>{
    //
    if (button.matches(".u2-copy") && input?.matches?.("input") && (input?.selectionStart != input?.selectionEnd)) {
        navigator.clipboard.writeText(input.value.substring(input.selectionStart || 0, input.selectionEnd || input.selectionStart || 0));
    }

    //
    if (button.matches(".u2-paste") && input?.selectionStart != null) {
        navigator.clipboard.readText().then(
            (clipText) => {
                const oldStart = input?.selectionStart || 0;
                const paste = (input?.value?.substring(0, input?.selectionStart || 0) || "") + (clipText || "") + (input?.value?.substring?.(input?.selectionEnd || 0) || "");
                if (input) { input.value = paste; };

                //
                input?.setSelectionRange(
                    oldStart + (clipText?.length||0),
                    oldStart + (clipText?.length||0)
                );

                //
                input?.dispatchEvent(new Event("input", {
                    bubbles: true,
                    cancelable: true,
                }))
            },
        );
    }
}



//
export const holdFocus = (input)=>{
    let pointerId = -1;
    input?.addEventListener?.("pointerdown", (ev)=>{
        if (pointerId < 0) {
            input?.setPointerCapture?.(pointerId = ev?.pointerId);
        }
    });

    input?.addEventListener?.("blur", (ev)=>{
        if (pointerId >= 0) {
            input?.focus?.();
        }
    });

    document?.addEventListener?.("pointerup", (ev)=>{
        if (pointerId == ev?.pointerId) {
            input?.releasePointerCapture?.(pointerId);
            pointerId = -1;
        }
    });

    document?.addEventListener?.("pointercancel", (ev)=>{
        if (pointerId == ev?.pointerId) {
            input?.releasePointerCapture?.(pointerId);
            pointerId = -1;
        }
    });
}


//
export const makeInput = (host?: HTMLElement, ROOT = document.documentElement)=>{
    if (!host) return;

    //
    const input = host?.querySelector?.("input");
    holdFocus(input);

    //
    const weak  = new WeakRef(host);
    const scp   = [0, 0];
    const scp_w = new WeakRef(scp);
    const enforceFocus = (ev)=>{
        const scrollable = weak?.deref?.();
        const element = ev?.target as HTMLElement;
        if (element?.matches?.("input[type=\"text\"], ui-longtext, ui-focustext") && (scrollable?.contains(element) || element?.contains?.(scrollable as Node))) {
            const input: HTMLInputElement | null = (element?.matches("input") ? element : element?.querySelector?.("input[type=\"text\"]")) as HTMLInputElement;
            if (input) {
                if (ev.type == "click" || ev.pointerType == "touch") {
                    ev?.preventDefault?.();
                    ev?.stopPropagation?.();
                }
                if (document.activeElement != input && ev.type == "click") {
                    input?.focus?.();
                }
            }
        }
    };

    //
    ROOT?.addEventListener?.("click", enforceFocus);
    ROOT?.addEventListener?.("select", enforceFocus);
    ROOT?.addEventListener?.("selectionchange", enforceFocus);
    ROOT?.addEventListener?.("selectstart", enforceFocus);

    //
    {
        const bar = host?.shadowRoot?.querySelector?.(".u2-scroll-box");
        const box = host?.shadowRoot?.querySelector?.(".u2-input-box") as HTMLElement;
        const scr_w = new WeakRef(box);
        const scrollPos = scp;

        //
        if (scrollPos) {
            scrollPos[0] = box?.scrollLeft || 0;
            scrollPos[1] = box?.scrollTop  || 0;
        }

        //
        document.addEventListener("wheel", (ev)=>{
            const scrollable = scr_w?.deref?.();
            if (scrollable?.matches?.(":where(:hover, :active)")) {
                ev.preventDefault();
                ev.stopPropagation();
                {   //
                    scrollable?.scrollBy?.({
                        left: ((ev?.deltaY || 0)+(ev?.deltaX || 0)), top: 0,
                        behavior: "smooth"
                    });
                }
            }
        }, {passive: false});

        //
        Promise.try(importCdn, ["/externals/core/interact.js"])?.then?.(({ScrollBar})=>{
            new ScrollBar({
                content: box,
                holder: host,
                scrollbar: bar
            }, 0);
        });
    }

    //
    let selection = false;
    const whenCancel = (ev)=>{
        //const box = weak?.deref?.()?.shadowRoot?.querySelector?.(".u2-input-box") as HTMLElement;
        //const scrollPos = scp_w?.deref?.();
        /*if (selection) { box.scrollTo({
            left: scrollPos?.[0] || 0,
            top : scrollPos?.[1] || 0,
            behavior: "instant"
        }); };*/
        selection = false;
    }

    //
    ROOT?.addEventListener?.("pointerup", whenCancel, {capture: true, passive: true});
    ROOT?.addEventListener?.("pointercancel", whenCancel, {capture: true, passive: true});
    ROOT?.addEventListener?.("selectionchange", ()=>{
        const box = weak?.deref?.()?.querySelector(".u2-input-box") as HTMLElement;
        const scrollPos = scp_w?.deref?.();
        if (scrollPos) {
            scrollPos[0] = box?.scrollLeft || 0;
            scrollPos[1] = box?.scrollTop  || 0;
        }
        if (input?.selectionStart != input?.selectionEnd) {
            //selection = true;
        }
    }, {capture: true, passive: true});

    //
    const preventScroll = ()=>{
        const box = weak?.deref?.()?.shadowRoot?.querySelector(".u2-input-box") as HTMLElement;
        const scrollPos = [box.scrollLeft, box.scrollTop];
        /*if (selection) { box.scrollTo({
            left: scrollPos[0],
            top: scrollPos[1],
            behavior: "instant"
        }); };*/
    }

    //
    const toFocus = ()=>{
        if (document.activeElement != input) {
            input?.focus?.();
        }
    };

    //
    const preventDrag = (ev)=>{
        ev.preventDefault();
        if (ev.dataTransfer) {
            ev.dataTransfer.dropEffect = "none";
        }
    }

    {   //
        const box = host?.shadowRoot?.querySelector?.(".u2-input-box") as HTMLElement;
        box?.addEventListener?.("scroll"   , preventScroll, {capture: true, passive: true});
        box?.addEventListener?.("scrollend", preventScroll, {capture: true, passive: true});
        box?.addEventListener?.("dragstart", preventDrag);
        box?.addEventListener?.("focus", toFocus);
        host?.addEventListener?.("dragstart", preventDrag);
        host?.addEventListener?.("focus", toFocus);
        input?.addEventListener?.("dragstart", preventDrag);
    }
}
