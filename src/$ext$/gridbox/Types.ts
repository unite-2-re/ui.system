//
export interface GridItemType {
    cell?: [number, number];
    pointerId?: number;
    id: string;
};

//
export interface GridArgsType {
    item: GridItemType;
    list: Set<string> | string[];
    items: Map<string, GridItemType>|Set<GridItemType>|GridItemType[];
    layout: [number, number];
    size: [number, number];
};

//
export interface GridStateType {
    lists: Set<string> | string[];
    items: Map<string, GridItemType>|Set<GridItemType>|GridItemType[];
    layout: [number, number];
};
