// @ts-ignore
const { fixedClientZoom, orientOf } = await Promise.try(importCdn, ["/externals/dom.js"]);

//
export interface InteractStatus { pointerId?: number; };

//
export const ROOT = document.documentElement;
export const setAttributesIfNull = (element, attrs = {})=>{
    return Array.from(Object.entries(attrs)).map(([name, value])=>{
        const old = element.getAttribute(name);
        if (value == null) {
            element.removeAttribute(name);
        } else {
            element.setAttribute(name, old == "" ? (value ?? old) : (old ?? value));
        }
    });
}

//
export const setAttributes = (element, attrs = {})=>{
    return Array.from(Object.entries(attrs)).map(([name, value])=>{
        if (value == null) {
            element.removeAttribute(name);
        } else {
            element.setAttribute(name, value ?? element.getAttribute(name));
        }
    });
}

//
export const setIdleInterval = (cb, timeout = 1000, ...args)=>{
    requestIdleCallback(async ()=>{
        if (!cb || (typeof cb != "function")) return;
        while (true) {
            // @ts-ignore
            await Promise.try(cb, ...args);
            await new Promise((r)=>setTimeout(r, timeout));
            await new Promise((r)=>requestIdleCallback(r, {timeout: 100}));
            await new Promise((r)=>requestAnimationFrame(r));
        }
    }, {timeout: 1000});
}

//
export const includeSelf = (target, selector)=>{ return (target.querySelector(selector) ?? (target.matches(selector) ? target : null)); }
export const MOC = (element: HTMLElement | null, selector: string): boolean => { return (!!element?.matches?.(selector) || !!element?.closest?.(selector)); };
export const MOCElement = (element: HTMLElement | null, selector: string): HTMLElement | null => { return ((!!element?.matches?.(selector) ? element : null) || element?.closest?.(selector)) as HTMLElement | null; };
export const setProperty = (target, name, value, importance = "")=>{
    if ("attributeStyleMap" in target) {
        const raw = target.attributeStyleMap.get(name);
        const prop = raw?.[0] ?? raw?.value;
        if (parseFloat(prop) != value && prop != value || prop == null) {
            //if (raw?.[0] != null) { raw[0] = value; } else
            if (raw?.value != null) { raw.value = value; } else
            { target.attributeStyleMap.set(name, value); };
        }
    } else {
        const prop = target?.style?.getPropertyValue?.(name);
        if (parseFloat(prop) != value && prop != value || prop == null) {
            target?.style?.setProperty?.(name, value, importance);
        }
    }
}

//
export const borderBoxWidth  = Symbol("@border-box-width") , borderBoxHeight  = Symbol("@border-box-height");
export const contentBoxWidth = Symbol("@content-box-width"), contentBoxHeight = Symbol("@content-box-height");
export const onBorderObserve  = new WeakMap<HTMLElement, ResizeObserver>();
export const onContentObserve = new WeakMap<HTMLElement, ResizeObserver>();

//
export const clamp = (min, val, max) => Math.max(min, Math.min(val, max));
export const bbw = (el, orient = null)=> ((orient??orientOf(el))%2 ? el[borderBoxHeight]  : el[borderBoxWidth]);
export const bbh = (el, orient = null)=> ((orient??orientOf(el))%2 ? el[borderBoxWidth]   : el[borderBoxHeight]);
export const cbw = (el, orient = null)=> ((orient??orientOf(el))%2 ? el[contentBoxHeight] : el[contentBoxWidth]);
export const cbh = (el, orient = null)=> ((orient??orientOf(el))%2 ? el[contentBoxWidth]  : el[contentBoxHeight]);

/*
const tpm = (callback: (p0: Function, p1: Function) => {}, timeout = 1000) => {
    return new Promise((resolve, reject) => {
        // Set up the timeout
        const timer = setTimeout(() => {
            reject(new Error(`Promise timed out after ${timeout} ms`));
        }, timeout);

        // Set up the real work
        callback(
            (value) => {
                clearTimeout(timer);
                resolve(value);
            },
            (error) => {
                clearTimeout(timer);
                reject(error);
            }
        );
    });
};*/

//
export const getPxValue = (element, name)=>{
    if ("computedStyleMap" in element) {
        const cm = element?.computedStyleMap();
        return cm.get(name)?.value || 0;
    } else
    if (element instanceof HTMLElement) {
        const cs = getComputedStyle(element, "");
        return (parseFloat(cs.getPropertyValue(name)?.replace?.("px", "")) || 0);
    }
    return 0;
}

//
export const doContentObserve = (element) => {
    if (!(element instanceof HTMLElement)) return;
    if (!onContentObserve.has(element)) {
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentBoxSize) {
                    const contentBoxSize = entry.contentBoxSize[0];
                    if (contentBoxSize) {
                        element[contentBoxWidth]  = (contentBoxSize.inlineSize + (getPxValue(element, "padding-left") + getPxValue(element, "padding-right" ))) * fixedClientZoom(element);
                        element[contentBoxHeight] = (contentBoxSize.blockSize  + (getPxValue(element, "padding-top")  + getPxValue(element, "padding-bottom"))) * fixedClientZoom(element);
                    }
                }
            }
        });

        //
        element[contentBoxWidth]  = (element.clientWidth ) * fixedClientZoom(element);
        element[contentBoxHeight] = (element.clientHeight) * fixedClientZoom(element);

        //
        onContentObserve.set(element, observer);
        observer.observe(element, {box: "content-box"});
    }
};

//
export const doBorderObserve = (element) => {
    if (!(element instanceof HTMLElement)) return;
    if (!onBorderObserve.has(element)) {
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.borderBoxSize) {
                    const borderBoxSize = entry.borderBoxSize[0];
                    if (borderBoxSize) {
                        element[borderBoxWidth]  = borderBoxSize.inlineSize * fixedClientZoom(element);
                        element[borderBoxHeight] = borderBoxSize.blockSize  * fixedClientZoom(element);
                    }
                }
            }
        });

        //
        element[borderBoxWidth]  = element.offsetWidth  * fixedClientZoom(element);
        element[borderBoxHeight] = element.offsetHeight * fixedClientZoom(element);

        //
        onBorderObserve.set(element, observer);
        observer.observe(element, {box: "border-box"});
    }
}

//
export const blockClickTrigger = (_: MouseEvent | PointerEvent | TouchEvent | null = null)=>{
    const blocker = (ev)=>{
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();

        //
        ROOT.removeEventListener("click", blocker, options);
        ROOT.removeEventListener("contextmenu", blocker, options);
    };

    //
    const options = { once: true, capture: true };
    ROOT.addEventListener("click", blocker, options);
    ROOT.addEventListener("contextmenu", blocker, options);

    //
    setTimeout(()=>{
        ROOT.removeEventListener("click", blocker, options);
        ROOT.removeEventListener("contextmenu", blocker, options);
    }, 100);
}
