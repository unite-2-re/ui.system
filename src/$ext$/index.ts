import initLong from "./ts/LongText";
import initFocus from "./ts/FocusText";

//
export const initializeLT = (ROOT = document.documentElement)=>{ initLong(ROOT); initFocus(ROOT); }
export default initializeLT;

//
export * from "./shared/Gesture";
export * from "./shared/Selection";
export * from "./shared/Gesture";
export * from "./shared/GridDragging";
export * from "./shared/Scrollbar";
export * from "./ts/FocusText";
export * from "./ts/LongText";
export * from "./ts/ScrollBox";
export * from "./ts/OrientBox";
