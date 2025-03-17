export const onInteration = (ev, args = [], DOC = document.documentElement)=>{
    if (ev?.target?.matches("[data-popup]")) {
        (ev?.target?.getRootNode()?.host ?? ev?.target)?.dispatchEvent?.(new CustomEvent("u2-action", {
            bubbles: true,
            cancelable: true,
            detail: {
                type: "popup",
                name: ev?.target?.dataset?.popup,
                anchor: ev?.target?.matches(".ui-anchor") ? ev?.target : ev?.target?.closest(".ui-anchor"),
                initial: ev?.target
            }
        }));
    }

    //
    if (ev?.target?.matches("[data-action]")) {
        (ev?.target?.getRootNode()?.host ?? ev?.target)?.dispatchEvent?.(new CustomEvent("u2-action", {
            bubbles: true,
            cancelable: true,
            detail:{
                type: "action",
                name: ev?.target?.dataset?.action,
                anchor: ev?.target?.matches(".ui-anchor") ? ev?.target : ev?.target?.closest(".ui-anchor"),
                initial: ev?.target,
                args: ev?.target?.dataset?.action == "open-link" ? [ev?.target?.dataset?.href] : (args ?? []),
            }
        }));
    }
};
