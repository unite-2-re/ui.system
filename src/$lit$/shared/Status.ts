
//
const setElementContent = (selector, value, root = document)=>{
    root.querySelectorAll(selector).forEach((element)=>element.innerHTML = value);
}

//
const setElementIcon = (selector, value, root = document)=>{
    root.querySelectorAll(selector).forEach((element)=>{
        if (element?.getAttribute?.("icon") != value) { element?.setAttribute?.("icon", value); };
    });
}

//
export const runTimeStatus = (async(root = document)=>{
    //
    const updateTime = ()=>{
        const date = new Date();
        const timeMinutes = `${date.getMinutes()}`.padStart(2,"0");
        const timeHours = `${date.getHours()}`.padStart(2,"0");

        //
        setElementContent(".ui-time-minute", timeMinutes, root);
        setElementContent(".ui-time-hour", timeHours, root);
    }

    //
    updateTime();
    setInterval(updateTime, 15000);
    document.addEventListener("DOMContentLoaded", updateTime, { once: true });
});

//
export const runSignalStatus = (async(root = document)=>{
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
        setElementIcon(".ui-network", signalIcons[signal], root);
    }

    // @ts-ignore
    navigator.connection?.addEventListener("change", changeSignal);

    //
    changeSignal();
    setInterval(changeSignal, 1000);
});

//
const runBatteryStatus = (async(root = document)=>{
    // @ts-ignore
    const batteryStatus = navigator.getBattery?.();
    const batteryIcons = new Map([
        [0, "battery-warning"],
        [25, "battery"],
        [50, " battery-low"],
        [75, "battery-medium"],
        [100, "battery-full"],
    ]);

    //
    const byLevel = (lv = 1.0)=>batteryIcons.get(Math.ceil(lv / 0.25) * 25);
    const changeBatteryStatus = ()=>{
        let battery = "battery-charging";
        batteryStatus?.then?.((btr)=>{
            if (btr.charging)
                { battery = "battery-charging"; } else // @ts-ignore
                { battery = byLevel(btr.level); };
                setElementIcon(".ui-battery", battery, root);
        })?.catch?.(console.warn.bind(console));
        if (!batteryStatus) {
            setElementIcon(".ui-battery", battery, root);
        }
    }

    //
    batteryStatus?.then?.((btr)=>{
        btr.addEventListener("chargingchange", changeBatteryStatus);
        btr.addEventListener("levelchange", changeBatteryStatus);
    });

    //
    changeBatteryStatus();
    setInterval(changeBatteryStatus, 1000);
});

//
export const initStatus = (root = document)=>{
    runBatteryStatus(root);
    runSignalStatus(root);
    runTimeStatus(root);
}

//
export default initStatus;
