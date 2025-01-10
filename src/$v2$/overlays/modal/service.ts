//
const ROOT = document.documentElement;
const HIDE = (ev: any)=>{
    const SELECTOR = "ui-modal, ui-button, ui-taskbar, ui-statusbar, button, label, input, ui-longtext, ui-focustext, ui-row-select, ui-row-button, .adl-modal, .u2-input, .ui-input";
    if (!(ev?.target?.matches?.(SELECTOR) || ev?.target?.closest?.(SELECTOR) || document.activeElement?.matches?.("input"))) {
        ROOT.querySelectorAll("ui-modal[type=\"contextmenu\"]:not([data-hidden]), ui-modal[type=\"popup\"]:not([data-hidden])")?.forEach?.((el: any)=>{
            el.dataset.hidden = "";
        });
    }
}

//
ROOT.addEventListener("click", HIDE);
//ROOT.addEventListener("scroll", HIDE);
//ROOT.addEventListener("pointerdown", HIDE);

// TODO! activate modal model
export const activateModal = ()=>{}
export default activateModal;
