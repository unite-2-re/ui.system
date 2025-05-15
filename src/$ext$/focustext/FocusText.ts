//
import { doButtonAction, makeInput, MOC, styles, importCdn } from "../../../../longtext.wcomp/src/$core$/Utils";
import { computeCaretPositionFromClient, measureInputInFocus, measureText } from "../../$service$/Measure";

// @ts-ignore
const { zoomOf } = await Promise.try(importCdn, ["/externals/core/agate.js"]);

// @ts-ignore
import html from "./FocusText.html?raw";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
export class UIFocusTextElement extends HTMLElement {
    //#input?: HTMLInputElement | null;
    #focus?: HTMLInputElement | null;
    #selectionRange?: [number, number] | null = null;

    //
    get #input(): HTMLInputElement|null { return this.querySelector("input"); };
    #themeStyle?: HTMLStyleElement;
    #initialized: boolean = false;
    constructor() { super(); }
    #initialize() {
        if (!this.#initialized) {
            this.#initialized = true;
            this.#focus = null;

            //
            const parser = new DOMParser();
            const dom = parser.parseFromString(html, "text/html");
            const shadowRoot = this.attachShadow({ mode: "open" });
            dom.querySelector("template")?.content?.childNodes.forEach(cp => {
                shadowRoot.appendChild(cp.cloneNode(true));
            });

            // @ts-ignore
            Promise.try(importCdn, ["/externals/core/theme.js"])?.then?.((module)=>{
                // @ts-ignore
                this.#themeStyle = module?.default?.(shadowRoot);
                if (this.#themeStyle) { shadowRoot?.appendChild?.(this.#themeStyle); }
            }).catch(console.warn.bind(console));

            //
            const style = document.createElement("style");
            style.innerHTML = `@import url("${preInit}");`;
            shadowRoot.appendChild(style);

            //
            this?.hideInput?.(true);
            this?.addEventListener?.("focusout", (ev)=>{
                requestAnimationFrame(()=>{
                    if (!(this.shadowRoot?.querySelector?.(":focus") || document.activeElement == this || document.activeElement == this.#input)) {
                        if (this.#input) this.#input.value = "";
                    }
                });
                if ((ev.target as HTMLInputElement)?.matches?.("input")) {
                    this.#selectionRange = [
                        Math.min((ev.target as HTMLInputElement)?.selectionStart || 0, (ev.target as HTMLInputElement)?.selectionEnd || 0),
                        Math.max((ev.target as HTMLInputElement)?.selectionStart || 0, (ev.target as HTMLInputElement)?.selectionEnd || 0)
                    ];
                    this.hideInput();
                }
            });

            //
            this?.addEventListener?.("change", (ev)=>{
                this.#adaptiveInline(ev);
                this.reflectInput(null, ev.type);
            });

            //
            this?.addEventListener?.("input", (ev)=>{
                this.#adaptiveInline(ev);
                this.reflectInput(null, ev.type);
            });

            //
            this?.shadowRoot?.addEventListener("click", (ev)=>{
                const button = ev.target as HTMLElement;
                if (button?.matches?.("button") && this?.shadowRoot?.contains?.(button)) {
                    ev.preventDefault();
                    ev.stopPropagation();

                    //
                    if (document.activeElement != this.#input) { this.restoreFocus(); };
                    if (ev.type == "click") { doButtonAction(button, (document.activeElement as HTMLInputElement) || this.#input); }
                }
            });

            //
            this.#adaptiveInline();
            makeInput(this);
        }
    }

    //
    #adaptiveInline(ev?) {
        const input = (ev?.target || this.#input) as HTMLInputElement;
        if (!CSS.supports("field-sizing", "content") && input?.matches?.("input")) {
            const measure = measureText(input?.value||"", input)?.width;
            input?.style?.setProperty("inline-size", measure != null ? ((measure||0) + "px") : (((input?.value||"")?.length || 0) + "ch"));
        }
    }

    //
    connectedCallback() {
        this.#initialize();
        this.#adaptiveInline();
        this.hideInput(true);
    }

    //
    reflectInput(where?: HTMLInputElement | null, type = "change") {
        if ((where ??= this.#focus) && where != this.#input) {
            const newVal = this.#input?.value ?? where.value;
            if (newVal != where.value) {
                where.value = newVal;
                where.dispatchEvent(new Event(type, { bubbles: true }));
            };
        }
    }

    //
    hideInput(forceHide = false) {
        if (forceHide && document.activeElement == this.#input) {
            // @ts-ignore
            navigator?.virtualKeyboard?.hide?.();
            this.#input?.blur?.();
        };

        //
        setTimeout(()=>{
            if (document.activeElement != this.#input) {
                const focus = this.#focus; this.#focus = null;
                //focus?.removeAttribute?.("disabled");
                focus?.dispatchEvent?.(new Event("change", {bubbles: true}));

                // @ts-ignore
                navigator?.virtualKeyboard?.hide?.();
                if (this.dataset.hidden == null) {
                    this.dataset.hidden = "";
                    if (this.#input && !focus) {
                        this.#input.value = "";
                    };
                };
                this.#selectionRange = null;
            }
        }, 100);
    }

    //
    makeSelect(range: [number, number], scrollTo = false) {
        if (range && Array.isArray(range)) { this.#input?.setSelectionRange?.(...range); };
        if (scrollTo && this.#input) {
            const sl  = measureInputInFocus(this.#input);
            const box = this?.shadowRoot?.querySelector(".u2-input-box");
            box?.scrollTo?.({
                left: (sl?.width ?? box?.scrollLeft ?? 0) - 64,
                top: box?.scrollTop ?? 0,
                behavior: "smooth"
            });
        }
    }

    //
    setVirtualFocus(where, onClick = false, pRange?: [number, number] | null) {
        //
        if (this.#focus) {
            //this.#focus?.removeAttribute?.("disabled");
            this.#focus = null;
        }

        //
        if (where != this.#input) { this.#focus = where; };
        const range: [number, number] = pRange ?? [this.#focus?.selectionStart ?? this.#input?.selectionStart ?? 0, this.#focus?.selectionEnd ?? this.#input?.selectionEnd ?? 0];

        //
        if (this.#input && where != this.#input && this.#focus?.parentNode) {
            delete this.dataset.hidden;
            requestIdleCallback(() => {
                if (document.activeElement != this.#input) { this.#input?.focus?.(); };

                //
                const oldValue = this.#input?.value || "";
                const newVal   = this.#focus?.value || "";
                if (this.#input && this.#focus) {
                    if (newVal !== oldValue) { this.#input.value = newVal; };
                    if ((oldValue != newVal || onClick) && this.#input != this.#focus) {
                        if (range) { this.makeSelect(range, onClick); };
                    }
                }
            }, {timeout: 100});
        }
    }

    //
    restoreFocus() {
        if (this.#focus && document.activeElement != this.#input && this.dataset.hidden == null) {
            //this.#input?.removeAttribute?.("disabled");
            this.#input?.focus?.();
            if (this.#selectionRange != null) {
                this.makeSelect(this.#selectionRange, true);
            }
        }
    }
}

//
export const makeFocusable = (ROOT = document.documentElement)=>{
    customElements.define("ui-focustext", UIFocusTextElement);

    // @ts-ignore
    navigator.permissions.query({ name: 'clipboard-write' })?.catch?.(console.warn.bind(console));

    // @ts-ignore
    navigator.permissions.query({ name: 'clipboard-read' })?.catch?.(console.warn.bind(console));

    //
    const enforceFocus = (ev)=>{
        let element = ev?.target as HTMLInputElement;
        if (MOC(element, "input[type=\"text\"], ui-focustext, ui-longtext")) {
            element = (element.matches("input[type=\"text\"]") ? element : element?.querySelector?.("input[type=\"text\"]")) ?? element;
        }

        //
        if (matchMedia("(hover: none) and (pointer: coarse)").matches)
        {
            const dedicated = (ROOT?.querySelector("ui-focustext") as UIFocusTextElement);
            const dInput = dedicated?.querySelector?.("input");
            if (!MOC(element, "ui-focustext, input, ui-longtext") && ev?.type == "click") {
                dInput?.blur?.();
            }

            //
            if (element?.matches?.("input[type=\"text\"]") && !MOC(element, "ui-focustext")) {

                //
                if (["click", "pointerdown", "focus", "focusin"].indexOf(ev?.type || "") >= 0) {
                    //
                    if (["click", "focus", "focusin"].indexOf(ev?.type || "") >= 0) {
                        const cps = computeCaretPositionFromClient(element, [ev?.clientX / zoomOf(), ev?.clientY / zoomOf()]);
                        const pRange: [number, number] | null = ((ev && ev?.type == "click" && dInput) ? [cps, cps] : null) as ([number, number] | null);
                        dedicated?.setVirtualFocus?.(element, ev.type == "click" || ev.type == "pointerdown", pRange);
                    }
                }

                //
                ev?.preventDefault?.();
                ev?.stopPropagation?.();
            }
        }
    };

    //
    ROOT?.addEventListener?.("click", enforceFocus);
    ROOT?.addEventListener?.("pointerdown", enforceFocus);
    ROOT?.addEventListener?.("select", enforceFocus);
    ROOT?.addEventListener?.("selectionchange", enforceFocus);
    ROOT?.addEventListener?.("selectstart", enforceFocus);
    ROOT?.addEventListener?.("focusin", (ev)=>{
        const input = ev?.target as HTMLElement;
        if (input?.matches("input[type=\"text\"]") && !input?.closest?.("ui-focustext") && input instanceof HTMLInputElement) {
            requestIdleCallback(() => {
                if (document.activeElement == input && input.matches("input")) { enforceFocus(ev); }
            }, {timeout: 100});
        }
    });
}

//
export default makeFocusable;
