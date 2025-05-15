//
import AxGesture from "../shared/Gesture";
import { grabForDrag, setProperty } from "/externals/modules/dom.ts";

// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";
export {importCdn};

//
const ROOT = document.documentElement;

//
export const reflectCell = async (newItem: any, pArgs: any, withAnimate = false)=>{
    // @ts-ignore
    const { getBoundingOrientRect, agWrapEvent, orientOf, redirectCell, convertOrientPxToCX } = await Promise.try(importCdn, ["/externals/core/agate.js"]);
    // @ts-ignore
    const {subscribe, makeObjectAssignable, makeReactive } = await Promise.try(importCdn, ["/externals/lib/object.js"]);

    //
    const layout = [pArgs?.layout?.columns || pArgs?.layout?.[0] || 4, pArgs?.layout?.rows || pArgs?.layout?.[1] || 8];
    const {item, list, items} = pArgs;

    //
    await new Promise((r)=>requestAnimationFrame(r));
    subscribe?.(item, (state, property)=>{
        const gridSystem = newItem?.parentElement;
        layout[0] = parseInt(gridSystem.style.getPropertyValue("--layout-c")) || layout[0];
        layout[1] = parseInt(gridSystem.style.getPropertyValue("--layout-r")) || layout[1];

        //
        const pbox = getBoundingOrientRect(gridSystem) || gridSystem?.getBoundingClientRect?.();
        const args = {item, list, items, layout, size: [gridSystem?.clientWidth, gridSystem?.clientHeight]};
        if (item && !item?.cell) { item.cell = makeObjectAssignable(makeReactive([0, 0])); };
        if (item && args) { const nc = redirectCell(item?.cell, args); if (nc[0] != item?.cell?.[0] || nc[1] != item?.cell?.[1]) { item.cell = nc; } };
        if (property == "cell") { subscribe(state, (v,p)=>{
            doAnimate(newItem, redirectCell(item?.cell, args), withAnimate);
        }); }
    });
}

//
export const animationSequence = (DragCoord = [0, 0], CellStart: any = null, CellEnd: any = null) => {
    return [{
        "--drag-x": DragCoord?.[0] || 0,
        "--drag-y": DragCoord?.[1] || 0,
        "--grid-c": CellStart?.[0] != null ? (CellStart?.[0]+1) : "var(--fp-cell-x)",
        "--grid-r": CellStart?.[1] != null ? (CellStart?.[1]+1) : "var(--fp-cell-y)",
    }, // starting...
    {
        "--drag-x": 0,
        "--drag-y": 0,
        "--grid-c": CellEnd?.[0] != null ? (CellEnd?.[0]+1) : "var(--fc-cell-x)",
        "--grid-r": CellEnd?.[1] != null ? (CellEnd?.[1]+1) : "var(--fc-cell-y)",
    }];
};

//
export const doAnimate = async (newItem, cell, animate = false)=>{
    setProperty(newItem, "--cell-x", cell[0]);
    setProperty(newItem, "--cell-y", cell[1]);

    //
    const animation = animate && !matchMedia("(prefers-reduced-motion: reduce)")?.matches ? newItem.animate(animationSequence([
        parseInt(newItem.style.getPropertyValue("--drag-x")),
        parseInt(newItem.style.getPropertyValue("--drag-y"))
    ], [
        parseInt(newItem.style.getPropertyValue("--p-cell-x")),
        parseInt(newItem.style.getPropertyValue("--p-cell-y"))
    ], cell), {
        fill: "both",
        duration: 150,
        easing: "linear"
    }) : null;

    //
    let shifted = false;
    const onShift: [any, any] = [(ev)=>{
        if (!shifted) {
            shifted = true;
            //animation?.commitStyles?.();
            animation?.cancel?.();
        }

        //
        newItem?.removeEventListener?.("m-dragstart", ...onShift);
    }, {once: true}];

    // not fact, but for animation
    newItem?.addEventListener?.("m-dragstart", ...onShift);
    //await new Promise((r)=>requestAnimationFrame(r));
    await animation?.finished?.catch?.(console.warn.bind(console));
    delete newItem.dataset.dragging;

    //
    if (!shifted) {
        // commit dragging result
        onShift?.[0]?.();
        setProperty(newItem, "--p-cell-x", cell[0]);
        setProperty(newItem, "--p-cell-y", cell[1]);
        setProperty(newItem, "--drag-x", 0);
        setProperty(newItem, "--drag-y", 0);
    }
}

//
export const bindInteraction = async (newItem: any, pArgs: any)=>{

    // @ts-ignore
    const { getBoundingOrientRect, agWrapEvent, orientOf, redirectCell, convertOrientPxToCX } = await Promise.try(importCdn, ["/externals/core/agate.js"]);

    //
    const {item, list, items} = pArgs;
    const layout = [pArgs?.layout?.columns || pArgs?.layout?.[0] || 4, pArgs?.layout?.rows || pArgs?.layout?.[1] || 8];

    //
    await new Promise((r)=>requestAnimationFrame(r));
    reflectCell(newItem, pArgs, true);

    //
    const gesture = new AxGesture(newItem);
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
                            propertyName: "drag",
                            shifting: [
                                parseFloat(newItem?.style?.getPropertyValue("--drag-x")) || 0,
                                parseFloat(newItem?.style?.getPropertyValue("--drag-y")) || 0
                            ],
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
        const prev = [item.cell[0], item.cell[1]];
        const cell = redirectCell([Math.floor(CXa[0]), Math.floor(CXa[1])], args);

        //
        if (prev[0] != cell[0] || prev[1] != cell[1]) {
            if (ev?.detail?.holding?.modified != null) {
                setProperty(newItem, "--drag-x", ev.detail.holding.modified[0] = 0);
                setProperty(newItem, "--drag-y", ev.detail.holding.modified[1] = 0);
            } else {
                setProperty(newItem, "--drag-x", 0);
                setProperty(newItem, "--drag-y", 0);
            }
            item.cell = cell;
            setProperty(newItem, "--p-cell-x", item.cell[0]);
            setProperty(newItem, "--p-cell-y", item.cell[1]);
        }

        //
        newItem.dataset.dragging = "";
    });

    //
    newItem.addEventListener("m-dragend", async (ev)=>{
        // TOOD: detect another grid system
        const gridSystem = newItem?.parentElement;

        //
        const cbox = getBoundingOrientRect(newItem) || newItem?.getBoundingClientRect?.();
        const pbox = getBoundingOrientRect?.(gridSystem) || gridSystem?.getBoundingClientRect?.();
        const rel : [number, number] = [(cbox.left + cbox.right)/2 - pbox.left, (cbox.top + cbox.bottom)/2 - pbox.top];

        //
        layout[0] = parseInt(gridSystem.style.getPropertyValue("--layout-c")) || layout[0];
        layout[1] = parseInt(gridSystem.style.getPropertyValue("--layout-r")) || layout[1];

        //
        const args = {item, list, items, layout, size: [gridSystem?.clientWidth, gridSystem?.clientHeight]};
        const CXa  = convertOrientPxToCX(rel, args, orientOf(gridSystem));

        //
        const clamped = [Math.floor(CXa[0]), Math.floor(CXa[1])];
        clamped[0] = Math.max(Math.min(clamped[0], layout[0]-1), 0);
        clamped[1] = Math.max(Math.min(clamped[1], layout[1]-1), 0);
        item.cell = redirectCell(clamped, args)
        //doAnimate(newItem, );

        //
        //await doAnimate(newItem, item.cell = redirectCell(clamped, args));
    });
}

//
export const getSpan = (el, ax)=>{
    const prop = el.style.getPropertyValue(["--ox-c-span", "--ox-r-span"][ax]);
    const factor = ((parseFloat(prop || "1") || 1) - 1);
    return Math.min(Math.max(factor-1, 0), 1);
}
