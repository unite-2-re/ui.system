
// @ts-nocheck

//
const setElementContent = (selector, value)=>{
    document.querySelectorAll(selector).forEach((element)=>{
        if (element) { element.innerHTML = value; }
    });
}

//
const setElementIcon = (selector, value)=>{
    document.querySelectorAll(selector).forEach((element)=>{
        if (element) { element.setAttribute("data-icon", value); }
    });
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
    setInterval(updateTime, 500);
    document.addEventListener("DOMContentLoaded", updateTime);
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
        const signal = navigator.onLine ? (navigator?.connection?.effectiveType || "4g") : "offline";
        setElementIcon(".ui-network", signalIcons[signal]);
    }
    navigator.connection?.addEventListener("change", changeSignal);

    //
    changeSignal();
    setInterval(changeSignal, 1000);
});

//
const runBatteryStatus = (async()=>{
    const batteryStatus = navigator.getBattery?.();
    const batteryIcons = new Map([
        [0, "battery-warning"],
        [25, "battery"],
        [50, " battery-low"],
        [75, "battery-medium"],
        [100, "battery-full"],
    ]);

    //
    const byLevel = (lv = 1.0)=>{
        return batteryIcons.get(Math.ceil(lv / 0.25) * 25);
    }

    //
    const changeBatteryStatus = ()=>{
        let battery = "battery-charging";
        batteryStatus?.then?.((btr)=>{
            if (btr.charging)
                { battery = "battery-charging"; }  else
                { battery = byLevel(btr.level); };
                setElementIcon(".ui-battery", battery);
        })?.catch?.(console.warn.bind(console));
        if (!batteryStatus) {
            setElementIcon(".ui-battery", battery);
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
export const initialize = ()=>{
    runBatteryStatus();
    runSignalStatus();
    runTimeStatus();
}

//
export default initialize;
