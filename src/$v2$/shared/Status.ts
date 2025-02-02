
const throttleMap = new Map<string, any>();

//
requestIdleCallback(async ()=>{
    while (true) {
        throttleMap.forEach((cb)=>cb?.());
        await new Promise((r)=>requestIdleCallback(r));
    }
}, {timeout: 1000});

//
const roots: any[] = [];

//
const setElementContent = (selector, value)=>{
    throttleMap.set(selector, ()=>
        roots.forEach((root)=>root.querySelectorAll(selector).forEach((element)=>{
            if (element.innerHTML != value) { element.innerHTML = value; };
        }))
    );
}

//
const setElementIcon = (selector, value)=>{
    throttleMap.set(selector, ()=>roots.forEach((root)=>root.querySelectorAll(selector).forEach((element)=>{
        if (element?.getAttribute?.("icon") != value) { element?.setAttribute?.("icon", value); };
    })));
}

//
const setIdleInterval = (cb, timeout, ...args)=>{
    requestIdleCallback(async ()=>{
        while (true) {
            cb?.(...args);
            await new Promise((r)=>setTimeout(r, timeout));
            await new Promise((r)=>requestIdleCallback(r));
        }
    }, {timeout: 1000});
}

//
export const runTimeStatus = (async()=>{
    //
    const updateTime = ()=>{
        const date = new Date();
        const timeMinutes = `${date.getMinutes()}`.padStart(2,"0");
        const timeHours = `${date.getHours()}`.padStart(2,"0");

        //
        setElementContent(".ui-time-minute", timeMinutes);
        setElementContent(".ui-time-hour", timeHours);
    }

    //
    updateTime();
    setIdleInterval(updateTime, 15000);
    document.addEventListener("DOMContentLoaded", updateTime, { once: true });
});

//
export const runSignalStatus = (async()=>{
    //
    const signalIcons = {
        "offline": "wifi-off",
        "4g": "wifi",
        "3g": "wifi-high",
        "2g": "wifi-low",
        "slow-2g": "wifi-zero"
    }

    //
    const changeSignal = ()=>{
        // @ts-ignore
        const signal = navigator.onLine ? (navigator?.connection?.effectiveType || "4g") : "offline";
        setElementIcon(".ui-network", signalIcons[signal]);
    }

    // @ts-ignore
    navigator.connection?.addEventListener("change", changeSignal);

    //
    changeSignal();
    setIdleInterval(changeSignal, 1000);
});

//
const runBatteryStatus = (async()=>{
    // @ts-ignore
    const batteryStatus = navigator.getBattery?.();
    const batteryIcons = new Map([
        [0, "battery-warning"],
        [25, "battery"],
        [50, "battery-low"],
        [75, "battery-medium"],
        [100, "battery-full"],
    ]);

    //
    const byLevel = (lv = 1.0)=>(batteryIcons.get(Math.max(Math.min(Math.round(lv * 4) * 25, 100), 0))||"battery");
    const changeBatteryStatus = ()=>{
        let battery = "battery-charging";
        if (!batteryStatus) {
            setElementIcon(".ui-battery", battery);
        } else {
            batteryStatus?.then?.((btr)=>{
                if (btr.charging)
                    { battery = "battery-charging"; } else // @ts-ignore
                    { battery = byLevel(btr.level)||"battery"; };
                    setElementIcon(".ui-battery", battery);
            })?.catch?.(console.warn.bind(console));
        }
    }

    //
    changeBatteryStatus();
    setIdleInterval(changeBatteryStatus, 1000);

    //
    batteryStatus?.then?.((btr)=>{
        btr.addEventListener("chargingchange", changeBatteryStatus);
        btr.addEventListener("levelchange", changeBatteryStatus);
        changeBatteryStatus();
    });
});

//
let initialized = false;
export const initStatus = ()=>{
    if (!initialized) {
        initialized = true;
        runBatteryStatus();
        runSignalStatus();
        runTimeStatus();
    };
}

//
export const connect = (receiver = document)=>{
    if (!initialized) initStatus();
    roots.push(receiver);
}

//
export default initStatus;
