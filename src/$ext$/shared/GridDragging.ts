import AxGesture from "./Gesture";
import { setProperty } from "./Utils";

// shifting - reactive basis
export const ROOT = document.documentElement;
export const bindInteraction = async (newItem: any, pArgs: any)=>{

    // @ts-ignore
    const { grabForDrag, redirectCell, reflectCell, getBoundingOrientRect, agWrapEvent, orientOf, convertOrientPxToCX, doAnimate } = await Promise.try(importCdn, ["/externals/dom.js"]);

    // @ts-ignore
    const { ref, subscribe } = await Promise.try(importCdn, ["/externals/object.js"]);

    // @ts-ignore
    const { E } = await Promise.try(importCdn, ["/externals/blue.js"]);

    //
    await new Promise((r)=>requestAnimationFrame(r)); reflectCell(newItem, pArgs, true);
    const {item, list, items} = pArgs, layout = [pArgs?.layout?.columns || pArgs?.layout?.[0] || 4, pArgs?.layout?.rows || pArgs?.layout?.[1] || 8];
    const beh = (axis="x")=>([val, set, old], [signal, prop, wel])=>doAnimate(wel?.deref?.(), val, axis, true)?.then?.(()=>set());

    //
    const gesture = new AxGesture(newItem);
    const dragging = [ ref(0), ref(0) ];
    const currentCell = [ ref(item?.cell?.[0] || 0, beh("x")), ref(item?.cell?.[1] || 0, beh("y")) ];

    //
    E(newItem, { style: { "--cell-x": currentCell[0], "--cell-y": currentCell[1], "--drag-x": dragging[0], "--drag-y": dragging[1] } });
    subscribe([currentCell[0], "value"], (val)=> item.cell[0] = val);
    subscribe([currentCell[1], "value"], (val)=> item.cell[1] = val);

    //
    gesture?.longPress?.({
        handler: "*",
        anyPointer: true,
        mouseImmediate: true,
        minHoldTime: 60 * 3600,
        maxHoldTime: 100
    }, agWrapEvent((evc)=>{
        const ev = evc?.detail || evc;
        if (!newItem.dataset.dragging)
        {
            const n_coord: [number, number] = (ev.orient ? [...ev.orient] : [ev?.clientX || 0, ev?.clientY || 0]) as [number, number];
            if (ev?.pointerId >= 0) {
                ev?.capture?.(newItem);
                if (!ev?.capture) {
                    (newItem as HTMLElement)?.setPointerCapture?.(ev?.pointerId);
                }
            }

            //
            const shifting = agWrapEvent((evc_l: any)=>{
                const ev_l = evc_l?.detail || evc_l;
                if (ev_l?.pointerId == ev?.pointerId) {
                    const coord: [number, number] = (ev_l.orient ? [...ev_l.orient] : [ev_l?.clientX || 0, ev_l?.clientY || 0]) as [number, number];
                    const shift: [number, number] = [coord[0] - n_coord[0], coord[1] - n_coord[1]];
                    if (Math.hypot(...shift) > 10) {
                        ROOT.removeEventListener("pointermove", shifting);
                        grabForDrag(newItem, ev_l, {
                            result: dragging,
                            shifting: [0, 0]
                        });
                    }
                }
            });

            //
            const releasePointer = agWrapEvent((evc_l)=>{
                const ev_l = evc_l?.detail || evc_l;
                if (ev_l?.pointerId == ev?.pointerId) {
                    unbind(ev_l);
                    ev_l?.release?.();
                }
            });

            //
            const unbind = agWrapEvent((evc_l)=>{
                const ev_l = evc_l?.detail || evc_l;
                if (ev_l?.pointerId == ev?.pointerId) {
                    ROOT.removeEventListener("pointermove", shifting);
                    ROOT.removeEventListener("pointercancel", releasePointer);
                    ROOT.removeEventListener("pointerup", releasePointer);
                }
            });

            //
            ROOT.addEventListener("pointermove", shifting);
            ROOT.addEventListener("pointercancel", releasePointer);
            ROOT.addEventListener("pointerup", releasePointer);
        }
    }));

    //
    newItem.addEventListener("m-dragstart", (ev)=>{
        const gridSystem = newItem?.parentElement;
        const cbox = getBoundingOrientRect(newItem) || newItem?.getBoundingClientRect?.();
        const pbox = getBoundingOrientRect(gridSystem) || gridSystem?.getBoundingClientRect?.();
        const rel : [number, number] = [(cbox.left + cbox.right)/2 - pbox.left, (cbox.top + cbox.bottom)/2 - pbox.top];

        //
        layout[0] = parseInt(gridSystem.style.getPropertyValue("--layout-c")) || layout[0];
        layout[1] = parseInt(gridSystem.style.getPropertyValue("--layout-r")) || layout[1];

        //
        const args = {item, list, items, layout, size: [gridSystem?.clientWidth, gridSystem?.clientHeight]};
        const CXa  = convertOrientPxToCX(rel, args, orientOf(gridSystem));
        const cell = redirectCell([Math.floor(CXa[0]), Math.floor(CXa[1])], args);

        //
        if (ev?.detail?.holding?.modified != null) { ev.detail.holding.modified[0] = dragging[0].value = 0; } else { dragging[0].value = 0; };
        if (ev?.detail?.holding?.modified != null) { ev.detail.holding.modified[1] = dragging[1].value = 0; } else { dragging[1].value = 0; };

        //
        if (currentCell[0].value != cell[0]) { setProperty(newItem, "--p-cell-x", currentCell[0].value = cell[0]); };
        if (currentCell[1].value != cell[1]) { setProperty(newItem, "--p-cell-y", currentCell[1].value = cell[1]); };

        //
        newItem.dataset.dragging = "";
    });

    //
    newItem.addEventListener("m-dragend", async (ev)=>{
        // TOOD: detect another grid system
        const gridSystem = newItem?.parentElement;
        const cbox = getBoundingOrientRect(newItem) || newItem?.getBoundingClientRect?.();
        const pbox = getBoundingOrientRect?.(gridSystem) || gridSystem?.getBoundingClientRect?.();
        const rel : [number, number] = [(cbox.left + cbox.right)/2 - pbox.left, (cbox.top + cbox.bottom)/2 - pbox.top];

        //
        layout[0] = parseInt(gridSystem.style.getPropertyValue("--layout-c")) || layout[0];
        layout[1] = parseInt(gridSystem.style.getPropertyValue("--layout-r")) || layout[1];

        //
        const args = {item, list, items, layout, size: [gridSystem?.clientWidth, gridSystem?.clientHeight]};
        const CXa  = convertOrientPxToCX(rel, args, orientOf(gridSystem));
        const clamped = [Math.floor(CXa[0]), Math.floor(CXa[1])];

        //
        clamped[0] = Math.max(Math.min(clamped[0], layout[0]-1), 0);
        clamped[1] = Math.max(Math.min(clamped[1], layout[1]-1), 0);

        //
        const cell = redirectCell(clamped, args);
        currentCell[0].value = cell[0];
        currentCell[1].value = cell[0];
    });

    //
    return currentCell;
}
