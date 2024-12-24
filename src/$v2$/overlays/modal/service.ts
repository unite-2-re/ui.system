//
const ROOT = document.documentElement;
ROOT.addEventListener("click", (ev: any)=>{
    if (!(ev?.target?.matches?.("ui-modal, ui-button, ui-taskbar") || ev?.target?.closest?.("ui-modal, ui-button, ui-taskbar"))) {
        ROOT.querySelectorAll("ui-modal")?.forEach?.((el: any)=>{
            el.dataset.hidden = "";
        });
    }
});

// TODO! activate modal model
export const activateModal = ()=>{}
export default activateModal;
