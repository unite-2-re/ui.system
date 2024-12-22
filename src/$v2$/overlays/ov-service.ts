//
document.documentElement.addEventListener("click", (ev: any)=>{
    if (!(ev?.target?.matches?.("ui-modal, ui-button") || ev?.target?.closest?.("ui-modal, ui-button"))) {
        document.documentElement.querySelectorAll("ui-modal")?.forEach?.((el: any)=>{
            el.dataset.hidden = "";
        });
    }
});
