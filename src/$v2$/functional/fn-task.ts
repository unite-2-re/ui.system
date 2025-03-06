/* // if global case
const tasks = this.taskManager.getTasks();
const winds: HTMLElement[] = tasks.map(({id}, index)=>{
    return document.querySelector("ui-frame:has("+id+"), ui-frame"+id+"");
});

//
Array.from(winds).filter((w)=>!!w).forEach((e: HTMLElement, I)=>{
    e.style.setProperty("--z-index", ""+I);
});*/

//
export const focusTask = (taskManager, target: HTMLElement, deActiveWhenFocus = false)=>{
    const hash = "#" + (target.dataset.id || (target.querySelector(".ui-content")?.id || target.id || target.querySelector(location.hash)?.id || "") || (target as any).taskId).trim?.()?.replace?.("#","")?.trim?.();
    if (taskManager?.inFocus?.(hash) && matchMedia("((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape))").matches && deActiveWhenFocus) {
        taskManager?.deactivate?.(hash);
    } else {
        taskManager?.focus?.(hash);
    }

    //
    const navbar = document.querySelector("ui-taskbar") as HTMLElement;
    if (matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches) {
        if (navbar) { navbar.dataset.hidden = ""; };
    }

    //
    requestIdleCallback(()=>navigator?.vibrate?.([10]));
}
