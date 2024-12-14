/* @vite-ignore */ // @ts-ignore
import AxGesture, {pointerMap} from "/externals/lib/interact.js";

// @ts-ignore
import { getBoundingOrientRect } from "/externals/lib/agate.js";

//
const ROOT = document.documentElement;
export const runTooltip = async ()=>{
    const timer = Symbol("@disappear");
    const fixTooltip = (ev, initiator?: HTMLElement)=>{
        const e = ev?.detail ?? ev;
        const tooltip = document.querySelector("ui-tooltip") as HTMLElement;
        initiator ??= e?.target;

        //
        if (tooltip && (initiator as HTMLElement)?.dataset?.tooltip) {
            const box = getBoundingOrientRect(initiator);

            //
            if (box && box?.width < 240) {
                tooltip.style.setProperty("--hover-x", ((box?.left + box?.right) * 0.5 || tooltip.style.getPropertyValue("--hover-x") || 0) as unknown as string, "");
            } else {
                tooltip.style.setProperty("--hover-x", (pointerMap?.get?.(ev.pointerId)?.current?.[0] || e?.orient[0] || tooltip.style.getPropertyValue("--hover-x") || 0) as unknown as string, "");

                //
                requestIdleCallback(()=>{
                    tooltip.style.setProperty("--hover-x", (pointerMap?.get?.(ev.pointerId)?.current?.[0] || e?.orient[0] || tooltip.style.getPropertyValue("--hover-x") || 0) as unknown as string, "");
                });
            }

            //
            if (box && box?.height < 60) {
                tooltip.style.setProperty("--hover-y", (box?.top || tooltip.style.getPropertyValue("--hover-y") || 0) as unknown as string, "");
            } else {
                tooltip.style.setProperty("--hover-y", (pointerMap?.get?.(ev.pointerId)?.current?.[1] || e?.orient[1] || tooltip.style.getPropertyValue("--hover-y") || 0) as unknown as string, "");

                //
                requestIdleCallback(()=>{
                    tooltip.style.setProperty("--hover-y", (pointerMap?.get?.(ev.pointerId)?.current?.[1] || e?.orient[1] || tooltip.style.getPropertyValue("--hover-y") || 0) as unknown as string, "");
                });
            }
        }
    }

    //
    ROOT.addEventListener("ag-pointerover", fixTooltip);
    ROOT.addEventListener("ag-pointerdown", fixTooltip);
    const controller = new AxGesture(ROOT);
    controller.longHover({
        selector: "*[data-tooltip]",
        holdTime: 500
    }, (ev)=>{
        const e = ev?.detail ?? ev;
        const initiator = e.target.matches("*[data-tooltip]") ? e.target : e.target.closest("*[data-tooltip]");
        const tooltip: HTMLElement | null = document.querySelector("ui-tooltip");
        if (tooltip && initiator) {
            {
                if (tooltip[timer]) clearTimeout(tooltip[timer]);
                tooltip.dataset.hidden = "";
                tooltip[timer] = null;
            }

            //
            tooltip.innerHTML = initiator.dataset.tooltip;
            fixTooltip(e, initiator);
            delete tooltip.dataset.hidden;
            tooltip[timer] = setTimeout(()=>{
                tooltip.dataset.hidden = "";
            }, 1000);
        }
    });

    //
    const hideTooltip = (ev)=>{
        const e = ev?.detail ?? ev;
        requestIdleCallback(()=>{
            const tooltip: HTMLElement | null = document.querySelector("ui-tooltip");
            if (tooltip) {
                if (tooltip[timer]) clearTimeout(tooltip[timer]);
                tooltip[timer] = null;

                //
                if (e?.type == "ag-pointerout" || e?.type == "ag-pointermove") {
                    tooltip[timer] = setTimeout(()=>{ tooltip.dataset.hidden = ""; }, 100);
                } else {
                    tooltip.dataset.hidden = "";
                }
            }
        });
    }

    //
    ROOT.addEventListener("ag-click", hideTooltip);
    ROOT.addEventListener("ag-pointerup", hideTooltip);
    ROOT.addEventListener("ag-pointerdown", hideTooltip);
    ROOT.addEventListener("ag-contextmenu", hideTooltip);
    ROOT.addEventListener("ag-pointerout", (ev)=>{
        if ((ev?.target as HTMLElement)?.dataset?.tooltip) {
            hideTooltip(ev);
        }
    });
};

//
export default runTooltip;
