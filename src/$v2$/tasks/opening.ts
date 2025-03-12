export const onInteration = (ev, DOC = document.documentElement)=>{
    if (ev?.target?.matches("[data-popup]")) {
        const popup = document.querySelector("ui-modal[type=\"popup\"][data-name=\"" + ev?.target?.dataset?.popup + "\"]") as any;
        popup?.showPopup?.(ev?.target?.matches(".ui-anchor") ? ev?.target : ev?.target?.closest(".ui-anchor"))
        DOC.querySelectorAll("ui-modal[type=\"popup\"]")?.forEach?.((el: any)=>{ if (el != popup) { el.dataset.hidden = ""; }; });
    } else {
        DOC.querySelectorAll("ui-modal[type=\"popup\"]")?.forEach?.((el: any)=>{ el.dataset.hidden = ""; });
    }

    // TODO: native action registry support
    if (ev?.target?.matches("[data-action=\"fullscreen\"]")) {
        if (!document.fullscreenElement) {
            document.documentElement?.requestFullscreen?.({
                navigationUI: "hide", screen
            })?.catch?.(console.warn.bind(console));
        } else
        if (document.exitFullscreen) {
            document?.exitFullscreen?.();
        }
    }
};
