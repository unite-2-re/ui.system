//
type FX = ((a: any)=>any);

//
export const blurTask = (taskManager?, trigger: boolean = false) => {
    const isMobile = matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches;
    const taskbar = isMobile ? document.querySelector("ui-taskbar:not([data-hidden])") : null;
    const modal = (document.querySelector("ui-modal[type=\"contextmenu\"]:not([data-hidden])") ?? document.querySelector("ui-modal:not([data-hidden]):where(:has(:focus), :focus)") ?? document.querySelector("ui-modal:not([data-hidden])") ?? taskbar) as HTMLElement;

    //
    if (document.activeElement?.matches?.("input")) {
        (document.activeElement as any)?.blur?.();
        return true;
    } else

    //
    if (modal) {
        modal.dataset.hidden = "";
        return true;
    } else

    // general case
    if (taskManager) {
        const task = taskManager?.getOnFocus?.();
        const id   = task?.taskId;
        if (id && id != "#") {
            const frame = document.querySelector("ui-frame:has("+id+")");
            if (frame) {
                taskManager.deactivate(id, trigger ?? false);
                frame?.addEventListener?.("u2-hidden", ()=>{
                    frame?.dispatchEvent?.(new CustomEvent("u2-close", {
                        bubbles: true,
                        cancelable: true,
                        detail: {
                            taskId: id
                        }
                    }));
                }, {once: true});
            } else { taskManager.removeTask(id); };
            return true;
        }
    }

    //
    return false;
}

//
export class TaskManager {
    #tasks: any[] = [];
    #events = new Map<string, FX[]>([]);
    #initialHistoryCount = 0;
    #ignoreForward = false;

    //
    constructor(tasks: any[] = []) {
        this.#tasks  = tasks || [];
        this.#events = new Map<string, FX[]>([]);
        this.#initialHistoryCount = history?.length;

        //
        addEventListener("hashchange", (ev)=>{
            this.focus(location.hash, true);
        });

        //
        if (location.hash) {
            history?.pushState?.("", "", location.hash || "#");
            this.focus(location.hash, true);
        } else {
            history?.pushState?.("", "", "");
        }

        // prevent behaviour once...
        addEventListener("popstate", (ev)=>{
            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();

            // hide taskbar before back
            if (this.#ignoreForward) {
                this.#ignoreForward = false;
            } else
            if (blurTask(this)) {
                this.#ignoreForward = true;
                history?.forward?.();
            }
        });

        //
        this?.on?.("activate", ()=>{
            document.querySelectorAll("ui-modal")?.forEach?.((el)=>{ (el as HTMLElement).dataset.hidden = ""; });
        });

        //
        this?.on?.("focus", ()=>{
            document.querySelectorAll("ui-modal")?.forEach?.((el)=>{ (el as HTMLElement).dataset.hidden = ""; });
        });
    }

    //
    trigger(name, ev = {}) {
        {
            const events: FX[] = this.#events.get(name) || [];
            events.forEach((cb)=>cb(ev));
        };
        {
            const events: FX[] = this.#events.get("*") || [];
            events.forEach((cb)=>cb(ev));
        };
        return this;
    }

    //
    on(name, cb) {
        const events: FX[] = this.#events.get(name) || [];
        events.push(cb);
        this.#events.set(name, events);
        return this;
    }

    //
    get(taskId: string) {
        if (!taskId) return null;
        const index = this.tasks.findIndex((t)=>(typeof t.taskId == "string" && t.taskId == taskId));
        if (index >= 0) {
            return this.tasks[index];
        }
        return null;
    }

    //
    get tasks() {
        return this.#tasks;
    }

    //
    getTasks() {
        return this.#tasks;
    }

    //
    getOnFocus(includeHash = true) {
        return (this.#tasks.findLast((t)=>t.active) ?? (includeHash ? this.get(location.hash) : null));
    }

    //
    isActive(taskId: string) {
        if (!taskId) return false;
        return !!this.#tasks.find((t)=>(typeof t.taskId == "string" && t.taskId == taskId))?.active;
    }

    //
    inFocus(taskId: string) {
        if (!taskId) return false;
        const task = this.#tasks.findLast((t)=>t.active); if (!task) return false;
        if (task?.taskId == taskId) { return true; };
        return false;
    }

    //
    focus(taskId: string, force = false) {
        if (!taskId) return this;

        //
        //const previous = this.getOnFocus(false);
        //if (previous?.taskId == taskId && !force) return this;

        //
        const last  = this.tasks.findLastIndex((t)=>t.active);
        const index = this.tasks.findIndex((t)=>(typeof t.taskId == "string" && t.taskId == taskId));
        const task  = this.tasks[index];

        //
        if (index >= 0) {
            if (!task.active) this.activate(taskId);
            if (index < last) {
                // @ts-ignore
                if (this.tasks.silentForwardByIndex) {
                    // @ts-ignore
                    this.tasks.silentForwardByIndex(index);
                } else {
                    this.tasks.splice(index, 1);
                    this.tasks.push(task);
                }
            }

            //
            this.trigger("focus", {task, self: this, oldIndex: index, index: (this.tasks.length-1)});
            if (location.hash != taskId) history.replaceState("", "", taskId || location.hash);
        }

        //
        return this;
    }

    //
    historyBack(taskId: string) {
        if (!taskId) return this;

        //
        this.#ignoreForward = true;
        history?.back?.();

        //
        const lastFocus = this.getOnFocus(false)?.taskId || "";
        if (location?.hash?.trim?.() != lastFocus) {
            this.#ignoreForward = true;
            history?.replaceState?.("", "", lastFocus);
        }

        //
        return this;
    }

    //
    deactivate(taskId: string, trigger = true) {
        if (!taskId) return this;
        const index = this.tasks.findIndex((t)=>((typeof t.taskId == "string") && t.taskId == taskId));
        if (index >= 0) {
            const task = this.tasks[index];
            if (task?.active) {
                task.active = false;
                this.trigger("deactivate", {task, self: this, index});
            };
        }
        return this;
    }

    //
    activate(taskId: string) {
        if (!taskId) return this;
        const index = this.tasks.findIndex((t)=>((typeof t.taskId == "string") && t.taskId == taskId));
        if (index >= 0) {
            const task = this.tasks[index];
            if (!task?.active) {
                task.active = true;
                this.trigger("activate", {task, self: this, index});
                if (taskId && history.length <= this.#initialHistoryCount) {
                    history.pushState("", "", location.hash);
                }
            }
        }
        return this;
    }

    //
    addTasks(tasks: any = []) {
        for (const task of (tasks?.value ?? tasks)) {
            this.addTask(task || {}, false);
        }
        return this;
    }

    //
    addTask(task, doFocus = true) {
        if (!task || (typeof task != "object")) return this;

        //
        const index = this.tasks.findIndex((t)=>((typeof t.taskId == "string") && t.taskId == task.taskId || task == t));
        const last  = this.tasks.length;

        //
        if (index < 0) {
            task.order = last;
            this.tasks.push(task);
            this.trigger("addTask", {task, self: this, index: last});
        } else {
            const exist = this.tasks[index];
            if (exist != task) { Object.assign(exist, task); }
        }

        //
        if (doFocus) {
            this.focus(task?.taskId); this.#ignoreForward = true;
            history.pushState("", "", task?.taskId || location?.hash);
        }

        //
        return this;
    }

    //
    removeTask(tp: any) {
        if (!tp) return this;
        const index = this.tasks.findIndex((t)=>((typeof t.taskId == "string") && t.taskId == (typeof tp == "string" ? tp : tp.taskId) || tp == t));
        if (index >= 0) {
            const task = this.tasks[index];
            this.tasks.splice(index, 1);
            this.trigger("removeTask", {task, self: this, index: -1, oldIndex: index});
            if (task.taskId && typeof task.taskId == "string") this.historyBack(task.taskId);
        }
        return this;
    }
}

//
let taskManager: TaskManager|null = null;
export const initTaskManager = (tasks: any[] = []): TaskManager =>{
    //const wasInit = taskManager == null;
    return (taskManager ??= new TaskManager(tasks));
}

//
export default initTaskManager;
