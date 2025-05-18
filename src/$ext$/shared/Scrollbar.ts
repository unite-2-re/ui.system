// @ts-ignore /* @vite-ignore */
import { importCdn } from "/externals/modules/cdnImport.mjs";
import { borderBoxHeight, borderBoxWidth, doBorderObserve, UUIDv4 } from "./Utils";

// @ts-ignore /* @vite-ignore */
const { setProperty, zoomOf } = await Promise.try(importCdn, ["/externals/modules/dom.js"]);
const axisConfig = [
    {
        name: "x", tName: "inline",
        cssScrollProperty: ["--scroll-left", "calc(var(--percent-x, 0) * max(calc(var(--scroll-size, 1) - var(--content-size, 1)), 0))"] as [string, string],
        cssPercentProperty: "--percent-x",
        //getValue: () => content.scrollLeft
    },
    {
        name: "y", tName: "block",
        cssScrollProperty: ["--scroll-top", "calc(var(--percent-y, 0) * max(calc(var(--scroll-size, 1) - var(--content-size, 1)), 0))"] as [string, string],
        cssPercentProperty: "--percent-y",
        //getValue: () => content.scrollTop
    }
];

//
export interface ScrollBarStatus {
    pointerId: number;
    scroll: number;
    delta: number;
    point: number;
};

//
const effectProperty = {
    delay: 0,
    fill: "both",
    easing: "linear",
    rangeStart: "cover 0%",
    rangeEnd: "cover 100%",
    duration: 1
};

//
const makeTimeline = (source, axis: number)=>{
    const curr = { currTime: 0, changed: true };

    //
    source.addEventListener("scroll", (ev)=>{ // borderBoxWidth и borderBoxHeight происходит из ResizeObserver
        const tg = ev.target;
        curr.currTime = tg[["scrollLeft", "scrollTop"][axis]] / Math.max((tg[["scrollWidth", "scrollHeight"][axis]] || 1) - (tg[[borderBoxWidth, borderBoxHeight][axis]] || 1), 1);
        curr.changed  = true;
    });

    // возвращаем объект, который изменчив
    return curr;
}

//
const animateByTimeline = async (source: HTMLElement, properties = {}, timeline: any = null)=>{
    const target = new WeakRef(source);
    if (!source) return;
    while(true) {
        if (!target?.deref?.()) break;
        if (timeline?.changed) {
            Object.entries(properties).forEach(([name, $v])=>{
                const values = $v as [any, any];
                const linear = (values[0] * (1 - timeline.currTime) + values[1] * timeline.currTime);
                setProperty(target?.deref?.(), name, linear);
            });
            timeline.changed = false;
        }
        await new Promise((r)=>requestAnimationFrame(r));
    }
};

//
const stepped = (count = 100)=>{
    return Array.from({ length: count }, (_, i) => i / count).concat([1]);
}

//
export class ScrollBar {
    scrollbar: HTMLDivElement;
    holder: HTMLElement;
    status: ScrollBarStatus;
    content: HTMLDivElement;
    uuid: string = "";
    uuid2: string = "";
    uuid3: string = "";

    //
    constructor({holder, scrollbar, content}, axis = 0) {
        this.scrollbar = scrollbar;
        this.holder    = holder;
        this.content   = content;
        this.uuid      = UUIDv4();
        this.uuid2     = UUIDv4();
        this.uuid3     = UUIDv4();
        this.status    = {
            delta: 0,
            scroll: 0,
            pointerId: -1,
            point: 0
        };

        //
        setProperty(this.scrollbar, "visibility", "collapse");
        setProperty(this.scrollbar?.querySelector?.("*"), "pointer-events", "none");

        //
        const currAxis = axisConfig[axis];
        const bar = this.scrollbar; // элемент скроллбара
        const source = this.content; // просто для уменьшения

        //
        bar?.style?.setProperty(...currAxis.cssScrollProperty, "");

        // @ts-ignore
        const native = typeof ScrollTimeline != "undefined", // @ts-ignore
              timeline: any = native ? new ScrollTimeline({ source, axis: currAxis.tName }) : makeTimeline(source, axis);

        //
        const properties = { [currAxis.cssPercentProperty]: native ? stepped(100) : [0,1] };
        if (native) {
            // @ts-ignore
            bar?.animate(properties, { ...effectProperty, timeline });
        } else {
            animateByTimeline(bar, properties, timeline);
        }



        //
        const status_w = new WeakRef(this.status);
        const weak     = new WeakRef(this);
        const computeScroll = (ev: any | null = null) => {
            const self = weak?.deref?.();
            if (self) {
                const sizePercent = Math.max(Math.min(
                    (self.content?.[[borderBoxWidth, borderBoxHeight][axis]] || 1) /
                    (self.content?.[["scrollWidth", "scrollHeight"][axis]] || 1),
                    1
                ), 0);

                //
                setProperty(self.scrollbar, "--scroll-coef", sizePercent);
                setProperty(self.scrollbar, "--scroll-size", (self?.content?.[["scrollWidth", "scrollHeight"][axis]] || 1));

                //
                const pt = sizePercent >= 0.99;
                setProperty(self.scrollbar, "visibility", pt ? "collapse" : "visible", "important");
                setProperty(self.scrollbar?.querySelector?.("*"), "pointer-events", pt ? "none" : "auto", "important");

                //
                const className = "has-scroll-" + ["x", "y"][axis];
                if (!pt && !self.holder.classList.contains(className)) { self.holder.classList.add(className); } else
                if ( pt &&  self.holder.classList.contains(className)) { self.holder.classList.remove(className); };
            }
        };

        //
        const computeScrollPosition = ()=>{
            const self   = weak?.deref?.();
            const status = status_w?.deref?.();

            //
            if (status && status?.pointerId >= 0) {
                status.scroll += (status.point - status.delta) * ((self?.content?.[["scrollWidth", "scrollHeight"][axis]] || 0) / (self?.content?.[[borderBoxWidth, borderBoxHeight][axis]] || 1));
                status.delta   = status.point;

                //
                const realShift = status.scroll - self?.content?.[["scrollLeft", "scrollTop"][axis]];;

                //
                if (Math.abs(realShift) >= 0.001) {
                    self?.content?.scrollBy?.({
                        [["left", "top"][axis]]: realShift,
                        behavior: "instant",
                    });
                }
            }
        }

        //
        const moveScroll = (evc) => {
            const ev     = evc?.detail || evc;
            const self   = weak?.deref?.();
            const status = status_w?.deref?.();
            if (self && status && status?.pointerId == ev.pointerId) {
                evc?.stopPropagation?.();
                evc?.preventDefault?.();
                status.point = ev?.orient?.[axis] ?? (ev[["clientX", "clientY"][axis]] / zoomOf(self?.holder));
            }
        }

        //
        const stopScroll = (evc) => {
            const ev     = evc?.detail || evc;
            const status = status_w?.deref?.();
            const self   = weak?.deref?.();
            if (status && status?.pointerId == ev.pointerId) {
                evc?.stopPropagation?.();
                evc?.preventDefault?.();

                //
                status.scroll = self?.content?.[["scrollLeft", "scrollTop"][axis]] || 0;
                status.pointerId = -1;

                // @ts-ignore
                ev.target?.releasePointerCapture?.(ev.pointerId);

                //
                this.holder.removeEventListener("pointermove", moveScroll);
                this.holder.removeEventListener("pointerup", stopScroll);
                this.holder.removeEventListener("pointercancel", stopScroll);
            }
        };

        //
        this.scrollbar
            ?.querySelector?.(".thumb")
            ?.addEventListener?.("pointerdown", (evc: any) => {
                const ev     = evc?.detail || evc;
                const status = status_w?.deref?.();
                const self   = weak?.deref?.();

                //
                if (self && status && status?.pointerId < 0) {
                    evc?.stopPropagation?.();
                    evc?.preventDefault?.();
                    ev?.target?.setPointerCapture?.(ev.pointerId);

                    //
                    status.pointerId = ev.pointerId || 0;
                    status.delta  = ev?.orient?.[axis] || ev[["clientX", "clientY"][axis]] / zoomOf(self?.holder);
                    status.point  = status.delta;
                    status.scroll = self?.content?.[["scrollLeft", "scrollTop"][axis]];

                    //
                    this.holder.addEventListener("pointermove", moveScroll);
                    this.holder.addEventListener("pointerup", stopScroll);
                    this.holder.addEventListener("pointercancel", stopScroll);

                    //
                    (async ()=>{
                        while(status && status?.pointerId >= 0) {
                            computeScrollPosition();
                            await new Promise((r)=>requestAnimationFrame(r));
                        }
                    })();
                }
            });

        //
        this.holder.addEventListener("u2-hidden", computeScroll);
        this.holder.addEventListener("u2-appear", computeScroll);
        this.holder.addEventListener("input", computeScroll);
        this.holder.addEventListener("change", computeScroll);

        // inputs support also needed...
        if (this.holder?.["@target"] || this.holder) {
            // @ts-ignore
            Promise.try(importCdn, ["/externals/modules/dom.js"])?.then?.(({observeBySelector})=>{
                observeBySelector?.(this.holder, "*", computeScroll);
            });

            //
            requestIdleCallback(computeScroll, {timeout: 100});
            requestAnimationFrame(computeScroll);
            doBorderObserve(this.content, (box) => {
                const self = weak?.deref?.();
                if (self) {
                    setProperty(self.scrollbar, "--content-size", self.content[[borderBoxWidth, borderBoxHeight][axis]] = box[["inlineSize", "blockSize"][axis]]);
                    computeScroll();
                }
            });
        }
    }
}
