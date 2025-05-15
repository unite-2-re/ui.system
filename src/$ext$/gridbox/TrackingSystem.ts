//
import { setProperty } from "./Properties";
//import type { GridArgsType, GridItemType } from "./Types";

// @ts-ignore /* @vite-ignore */
import {importCdn} from "/externals/modules/cdnImport.mjs";
export {importCdn};

//
export const inflectInGrid = async (gridSystem)=>{
    // @ts-ignore
    const {observeContentBox} = await Promise.try(importCdn, ["/externals/lib/dom.js"]);
    const size = [0, 0], layout = [4, 8];

    //
    observeContentBox(gridSystem, (boxSize)=>{
        size[0] = boxSize.inlineSize;
        size[1] = boxSize.blockSize;
    });

    //
    setProperty(gridSystem, "--layout-c", layout[0] = parseInt(gridSystem.style.getPropertyValue("--layout-c") || "0") || layout[0] || 4);
    setProperty(gridSystem, "--layout-r", layout[1] = parseInt(gridSystem.style.getPropertyValue("--layout-r") || "0") || layout[1] || 8);

    //
    /*const bindInternal = async (newItem, item)=>{
        //await bindInteraction(newItem, {item, list: null, items, layout, size});
        newItem?.dispatchEvent?.(new CustomEvent("u2-item-added", {
            detail: {item},
            bubbles: true,
            cancelable: true
        }));
        return newItem;
    }*/

    //
    //const elements: HTMLElement[] = [];

    //
/*
    subscribe(items, (item, index, old)=>{
        if (item && item?.id) {
            const newItem = createItem(item, gridSystem);
            const id = item?.id; newItem.dataset.id = id;
            if (!newItem.classList.contains('u2-grid-item')) {
                newItem.classList.add('u2-grid-item');
            }

            //
            setProperty(gridSystem, "--layout-c", layout[0] = parseInt(gridSystem?.style?.getPropertyValue("--layout-c") || "0") || layout[0] || 4);
            setProperty(gridSystem, "--layout-r", layout[1] = parseInt(gridSystem?.style?.getPropertyValue("--layout-r") || "0") || layout[1] || 8);

            //
            if (!gridSystem?.contains?.(newItem)) {
                gridSystem?.appendChild?.(newItem);
                bindInternal(newItem, item);
                subscribe(item, (state, property)=>{
                    const args = {item, list: null, items, layout, size};
                    if (item && !item?.cell) { item.cell = makeObjectAssignable(makeReactive([0, 0])); };
                    if (item && args) { const nc = redirectCell(item?.cell, args); if (nc[0] != item.cell[0] || nc[1] != item.cell[1]) { item.cell = nc; } };
                    if (property == "cell") { subscribe(state, (v,p)=>setProperty(newItem, ["--cell-x","--cell-y"][parseInt(p)], v)); }
                });
            }

            //
            if (elements.indexOf(newItem) < 0) { elements.push(newItem); };
        } else {
            const oldItem = gridSystem.querySelector(`.u2-grid-item[data-id=\"${old?.id}\"]`);
            if (oldItem) {
                //
                const idx = elements.indexOf(oldItem);
                if (idx >= 0) { elements.splice(idx, 1); };

                //
                oldItem?.dispatchEvent?.(new CustomEvent("u2-item-removed", {
                    detail: {item},
                    bubbles: true,
                    cancelable: true
                }));
                oldItem.remove();
            }
        }
    });
*/

    //
    //return elements;
}
