

export const taskManage = (self, taskManager) => {
    //
    taskManager.on("focus", ({task, index})=>{
        //const hash = (self.dataset.id || self.taskId).trim?.()?.replace?.("#","")?.trim?.();
        //const isInFocus = (hash == task.id.trim?.()?.replace?.("#","")?.trim?.());
        //self.focused = isInFocus || location.hash == ("#"+hash);
        self?.updateState?.();
    });

    //
    taskManager.on("activate", ({task, index})=>{
        ///const hash = (self.dataset.id || self.taskId).trim?.()?.replace?.("#","")?.trim?.();
        //const isInFocus = (hash == task.id.trim?.()?.replace?.("#","")?.trim?.());
        //if (isInFocus) {
            //self.active  = true;
        //}
        //self.focused = (taskManager.getOnFocus()?.id == ("#"+hash)) || location.hash == ("#"+hash);
        self?.updateState?.();
    });

    //
    taskManager.on("deactivate", ({task, index})=>{
        //const hash = (self.dataset.id || self.taskId).trim?.()?.replace?.("#","")?.trim?.();
        //const isInFocus = (hash == task.id.trim?.()?.replace?.("#","")?.trim?.());
        //if (isInFocus) {
            //self.active  = false;
            //self.focused = false;
        //} else {
            //self.focused = (taskManager.getOnFocus()?.id == ("#"+hash)) || location.hash == ("#"+hash);
        //}
        self?.updateState?.();
    });
}

//
export const onTasking = (self, taskManager)=>{
    taskManager.on("focus", ({task, index})=>{
        const isInFocus = (self.querySelector(".ui-content")?.id || self.id || (location.hash ? self.querySelector(location.hash) : null)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.id.trim?.()?.replace?.("#","")?.trim?.();
        if (isInFocus) { delete self.dataset.hidden; };
        self?.fixZLayer?.();
    });

    //
    taskManager.on("activate", ({task, index})=>{
        const isInFocus = (self.querySelector(".ui-content")?.id || self.id || (location.hash ? self.querySelector(location.hash) : null)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.id.trim?.()?.replace?.("#","")?.trim?.();
        if (isInFocus) { delete self.dataset.hidden; };
        self?.fixZLayer?.();
    });

    //
    taskManager.on("deactivate", ({task, index})=>{
        const isInFocus = (self.querySelector(".ui-content")?.id || self.id || (location.hash ? self.querySelector(location.hash) : null)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.id.trim?.()?.replace?.("#","")?.trim?.();
        if (isInFocus) { self.dataset.hidden = ""; };
        self?.fixZLayer?.();
    });
}
