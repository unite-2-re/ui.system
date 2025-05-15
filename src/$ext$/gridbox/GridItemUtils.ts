import type { GridArgsType, GridItemType } from "./Types";

//
const roundNearest = (number, N = 1)=>(Math.round(number * N) / N);
const get = (items, id)=>{
    if (typeof items?.get == "function") { const item = items?.get?.(id); if (item) { return item; }; }; // only for maps
    return Array.from(items?.values?.()||items||[])?.find?.((item: any)=>(item?.id == id || item == id));
}

//
export const redirectCell = ($preCell: [number, number], gridArgs: GridArgsType, orient: number = 0): [number, number] => {
    const preCell: [number, number] = [...$preCell]; // make non-conflict copy
    const list = Array.from(gridArgs?.list||[]);
    const icons: GridItemType[] = list?.length > 0 ? (list?.map((id) => get(gridArgs?.items, id)).filter((m) => !!m)) : Array.from(gridArgs?.items?.values());
    const item = gridArgs?.item || {};

    //
    const checkBusy = (cell): boolean => {
        return icons
            .filter((e: GridItemType) => (!(e == item || e?.id == item?.id) && (e?.pointerId == null || e?.pointerId < 0)))
            .some((one) => ((one?.cell?.[0]||0) == (cell[0]||0) && (one?.cell?.[1]||0) == (cell[1]||0)));
    };

    //
    if (!checkBusy(preCell)) {
        return [...preCell];
    }

    //
    const layout  = [...gridArgs?.layout];
    const columns = layout[0] || 4;
    const rows    = layout[1] || 8;

    //
    const variants: [number, number][] = [
        [preCell[0] + 1, preCell[1]] as [number, number],
        [preCell[0] - 1, preCell[1]] as [number, number],
        [preCell[0], preCell[1] + 1] as [number, number],
        [preCell[0], preCell[1] - 1] as [number, number],
    ].filter((v) => {
        return v[0] >= 0 && v[0] < columns && v[1] >= 0 && v[1] < rows;
    }) || [];

    //
    const suitable = variants.find((v) => !checkBusy(v));
    if (suitable) {
        return [...suitable];//makeReactive([...suitable]);
    }

    //
    let exceed = 0;
    let busy = true;
    let comp = [...preCell];
    while (busy && exceed++ < columns * rows) {
        //
        if (!(busy = checkBusy(comp))) {
            return [...comp] as [number, number];
        }

        //
        comp[0]++;
        if (comp[0] >= columns) {
            comp[0] = 0; comp[1]++;
            if (comp[1] >= rows) { comp[1] = 0; }
        }
    }

    //
    return [...preCell];
};



/* LAST GENERATION... */

//
export const convertOrientPxToCX = ($orientPx: [number, number], gridArgs: GridArgsType, orient: number = 0): [number, number] => {
    const boxInPx = [...gridArgs.size];
    const orientPx: [number, number] = [...$orientPx];
    const layout = [...gridArgs.layout];
    if (orient%2) { boxInPx.reverse(); };

    //
    const gridPxToCX = [layout[0] / boxInPx[0], layout[1] / boxInPx[1]];
    return [orientPx[0] * gridPxToCX[0], orientPx[1] * gridPxToCX[1]]
}

// should be relative from grid-box (not absolute or fixed position)
export const floorInOrientPx = ($orientPx: [number, number], gridArgs: GridArgsType, orient: number = 0) => {
    const orientPx: [number, number] = [...$orientPx];
    const boxInPx = [...gridArgs.size];
    const layout = [...gridArgs.layout];
    if (orient%2) { boxInPx.reverse(); };

    //
    const inBox = [boxInPx[0] / layout[0], boxInPx[1] / layout[1]];
    return [roundNearest(orientPx[0], inBox[0]), roundNearest(orientPx[1], inBox[1])];
};

//
export const floorInCX = ($CX: [number, number], gridArgs: GridArgsType): [number, number] => {
    const layout = gridArgs.layout;
    return [
        Math.min(Math.max(roundNearest($CX[0]), 0), layout[0]-1),
        Math.min(Math.max(roundNearest($CX[1]), 0), layout[1]-1)
    ];
};
