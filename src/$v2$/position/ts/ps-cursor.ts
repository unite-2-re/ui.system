export const placeWithCursor = (ctxMenu?: any, ev?: any)=>{
    ctxMenu.style.setProperty("--client-x", (ev?.orient?.[0] ?? ev?.clientX) || 0);
    ctxMenu.style.setProperty("--client-y", (ev?.orient?.[1] ?? ev?.clientY) || 0);
    ctxMenu.style.setProperty("--page-x", ev?.pageX || 0);
    ctxMenu.style.setProperty("--page-y", ev?.pageY || 0);
};
