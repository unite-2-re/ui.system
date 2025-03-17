

export const taskManage = (self, taskManager) => {
    //
    taskManager.on("focus", ({task, index})=>{
        //const hash = (self.dataset.id || self.taskId).trim?.()?.replace?.("#","")?.trim?.();
        //const isInFocus = (hash == task.taskId.trim?.()?.replace?.("#","")?.trim?.());
        //self.focused = isInFocus || location.hash == ("#"+hash);
        self?.updateState?.();
    });

    //
    taskManager.on("activate", ({task, index})=>{
        ///const hash = (self.dataset.id || self.taskId).trim?.()?.replace?.("#","")?.trim?.();
        //const isInFocus = (hash == task.taskId.trim?.()?.replace?.("#","")?.trim?.());
        //if (isInFocus) {
            //self.active  = true;
        //}
        //self.focused = (taskManager.getOnFocus()?.taskId == ("#"+hash)) || location.hash == ("#"+hash);
        self?.updateState?.();
    });

    //
    taskManager.on("deactivate", ({task, index})=>{
        //const hash = (self.dataset.id || self.taskId).trim?.()?.replace?.("#","")?.trim?.();
        //const isInFocus = (hash == task.taskId.trim?.()?.replace?.("#","")?.trim?.());
        //if (isInFocus) {
            //self.active  = false;
            //self.focused = false;
        //} else {
            //self.focused = (taskManager.getOnFocus()?.taskId == ("#"+hash)) || location.hash == ("#"+hash);
        //}
        self?.updateState?.();
    });
}

//
export const onTasking = (self, taskManager)=>{
    taskManager.on("focus", ({task, index})=>{
        const isInFocus = (self.querySelector(".ui-content")?.id || self.id || (location.hash ? self.querySelector(location.hash) : null)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.taskId.trim?.()?.replace?.("#","")?.trim?.();
        if (isInFocus) { delete self.dataset.hidden; };
        self?.fixZLayer?.();
    });

    //
    taskManager.on("activate", ({task, index})=>{
        const isInFocus = (self.querySelector(".ui-content")?.id || self.id || (location.hash ? self.querySelector(location.hash) : null)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.taskId.trim?.()?.replace?.("#","")?.trim?.();
        if (isInFocus) { delete self.dataset.hidden; };
        self?.fixZLayer?.();
    });

    //
    taskManager.on("deactivate", ({task, index})=>{
        const isInFocus = (self.querySelector(".ui-content")?.id || self.id || (location.hash ? self.querySelector(location.hash) : null)?.id || "")?.trim?.()?.replace?.("#","")?.trim?.() == task.taskId.trim?.()?.replace?.("#","")?.trim?.();
        if (isInFocus) { self.dataset.hidden = ""; };
        self?.fixZLayer?.();
    });
}

//
export const focusTask = (taskManager, target: HTMLElement, deActiveWhenFocus = false)=>{
    const hash = "#" + (target.dataset.id || (target.querySelector(".ui-content")?.id || target.id || (location.hash ? target.querySelector(location.hash) : null)?.id || "") || (target as any).taskId).trim?.()?.replace?.("#","")?.trim?.();
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
