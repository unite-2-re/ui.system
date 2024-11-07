export const makeSelection = (boxElement, selector = "*")=>{
    const state = { pointerId: -1, start: [0, 0] };
    const selectionBox = document.createElement("div");

    //
    const selected = new Set<HTMLElement>([]);
    /*const observer = new IntersectionObserver((entries)=>{
        entries.forEach((entry)=>{
            if (entry.isIntersecting && entry.target.matches(selector)) {
                selected.add(entry.target as HTMLElement);
            } else {
                selected.delete(entry.target as HTMLElement);
            }
        });
    }, {
        root: selectionBox,
        threshold: 0.25
    });*/

    //
    const overlap = (r1, r2) => {
        var quickCheck = (r1.left <= r2.left + r2.width &&
                r2.left <= r1.left + r1.width &&
                r1.top <= r2.top + r2.height &&
                r2.top <= r1.top + r1.height)
        if (quickCheck) return true;
        var x_overlap = Math.max(0, Math.min(r1.left + r1.width , r2.left + r2.width ) - Math.max(r1.left, r2.left));
        var y_overlap = Math.max(0, Math.min(r1.top  + r1.height, r2.top  + r2.height) - Math.max(r1.top , r2.top));
        var overlapArea = x_overlap * y_overlap;
        return overlapArea > 0;//overlapArea == 0;
    }

    //
    (async ()=>{
        while (true) {
            if (state.pointerId >= 0) {
                const elements = boxElement.querySelectorAll(selector);
                const s_box = selectionBox.getBoundingClientRect();

                elements.forEach((el)=>{
                    const box = el.getBoundingClientRect();
                    if (overlap(box, s_box)) { selected.add(el); } else { selected.delete(el); };
                });
            }

            //
            await new Promise((rs)=>requestAnimationFrame(rs));
        }
    })();

    //
    selectionBox.classList.add("ui-selection-box");
    selectionBox.dataset.alpha     = "0.1";
    selectionBox.dataset.chroma    = "0.6";
    selectionBox.dataset.highlight = "8";

    //
    boxElement.style.userSelect = "none";

    //
    const $style$ = selectionBox.style;
    $style$.setProperty("position", "fixed", "");
    $style$.setProperty("display", "none", "");
    $style$.setProperty("inset-inline-start", "0", "");
    $style$.setProperty("inset-inline-end", "auto", "");
    $style$.setProperty("inset-block-start", "0", "");
    $style$.setProperty("inset-block-end", "auto", "");
    $style$.setProperty("inline-size", "0", "");
    $style$.setProperty("block-size", "0", "");
    $style$.setProperty("overflow", "hidden", "");
    $style$.setProperty("z-index", "9999", "");
    $style$.setProperty("box-sizing", "border-box", "");
    $style$.setProperty("pointer-events", "none", "");

    //
    boxElement.appendChild(selectionBox);
    boxElement.addEventListener("pointerdown", (ev)=>{
        if (state.pointerId < 0 && ev.target == boxElement) {
            ev.stopPropagation();
            ev.preventDefault();

            //
            state.pointerId = ev.pointerId;
            state.start = [ev.clientX, ev.clientY];
            //boxElement.querySelectorAll(selector).forEach((el)=>observer.observe(el));

            //
            const ofp = selectionBox.offsetParent;
            const box = ofp?.getBoundingClientRect();

            //
            const $style$ = selectionBox.style;
            $style$.setProperty("inset-inline-start", `${state.start[0] - (box?.left||0)}px`, "");
            $style$.setProperty("inset-block-start", `${state.start[1] - (box?.top ||0)}px`, "");
            $style$.setProperty("display", "block", "");

            //
            ev?.target?.setPointerCapture?.(ev.pointerId);
        }
    });

    //
    document.documentElement.addEventListener("pointermove", (ev)=>{
        if (state.pointerId == ev.pointerId) {
            const $style$ = selectionBox.style;
            const ofp = selectionBox.offsetParent;
            const box = ofp?.getBoundingClientRect();

            //
            document.body.style.cursor = "crosshair";

            //
            $style$.setProperty("inset-inline-start", `${state.start[0] + Math.min(ev.clientX - state.start[0], 0) - (box?.left||0)}px`, "");
            $style$.setProperty("inset-block-start", `${state.start[1] + Math.min(ev.clientY - state.start[1], 0) - (box?.top ||0)}px`, "");
            $style$.setProperty("inline-size", `${Math.abs(ev.clientX - state.start[0])}px`, "");
            $style$.setProperty("block-size", `${Math.abs(ev.clientY - state.start[1])}px`, "");
            $style$.setProperty("display", "block", "");

            //
            selected.values()?.forEach?.((el: HTMLElement)=>{
                el?.dispatchEvent?.(new CustomEvent("ui-selection", {
                    detail: { selected: [...selected] },
                    bubbles: true,
                    cancelable: true
                }));
            });
            selected.clear();
        }
    });

    //
    const stopSelection = (ev)=>{
        if (state.pointerId == ev.pointerId) {
            state.pointerId = -1;

            //
            const $style$ = selectionBox.style;
            $style$.setProperty("display", "none", "");
            $style$.setProperty("inset-inline-start", "0", "");
            $style$.setProperty("inset-inline-end", "auto", "");
            $style$.setProperty("inset-block-start", "0", "");
            $style$.setProperty("inset-block-end", "auto", "");
            $style$.setProperty("inline-size", "0", "");
            $style$.setProperty("block-size", "0", "");

            //
            document.body.style.removeProperty("cursor");

            //
            ev?.target?.releasePointerCapture?.(ev.pointerId);
            //observer?.disconnect?.();

            //
            selected.values()?.forEach?.((el: HTMLElement)=>{
                el?.dispatchEvent?.(new CustomEvent("ui-selected", {
                    detail: { selected: [...selected] },
                    bubbles: true,
                    cancelable: true
                }));
            });
            selected.clear();
        }
    };

    //
    document.documentElement.addEventListener("pointerup", stopSelection);
    document.documentElement.addEventListener("pointercancel", stopSelection);
}
