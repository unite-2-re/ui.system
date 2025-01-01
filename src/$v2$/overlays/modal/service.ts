//
const ROOT = document.documentElement;
const HIDE = (ev: any)=>{
    if (!(ev?.target?.matches?.("ui-modal, ui-button, ui-taskbar") || ev?.target?.closest?.("ui-modal, ui-button, ui-taskbar"))) {
        ROOT.querySelectorAll("ui-modal:not([type]), ui-modal[type=\"popup\"]")?.forEach?.((el: any)=>{
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
