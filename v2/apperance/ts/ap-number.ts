// Type: contained

export const makeSpin = (weak?: WeakRef<any>, root?: any)=>{
    //
    requestIdleCallback(()=>{
        //
        root?.querySelector?.(".ui-step-up")?.addEventListener?.("click", (ev)=>{
            const btn   = ev?.target;
            const self  = weak?.deref?.() as (HTMLElement | undefined);
            const input = self?.querySelector?.("input") as (HTMLInputElement | undefined);
            input?.stepUp?.();
            input?.dispatchEvent?.(new Event('change', {bubbles: true, cancelable: true}));
        });

        //
        root?.querySelector?.(".ui-step-down")?.addEventListener?.("click", (ev)=>{
            const btn  = ev?.target;
            const self = weak?.deref?.() as (HTMLElement | undefined);
            const input = self?.querySelector?.("input") as (HTMLInputElement | undefined);
            input?.stepDown?.();
            input?.dispatchEvent?.(new Event('change', {bubbles: true, cancelable: true}));
        });
    });
}
