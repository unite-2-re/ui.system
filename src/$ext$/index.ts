import initLong  from "./ts/LongText";
import initFocus from "./ts/FocusText";

//
export const initializeLT = (ROOT = document.documentElement)=>{ initLong(ROOT); initFocus(ROOT); }
export default initializeLT;

//
import "./ts/ScrollBox";
export * from "./shared/Gesture";
export * from "./shared/Selection";
export * from "./shared/Gesture";
export * from "./shared/GridDragging";
export * from "./shared/Scrollbar";
export * from "./shared/Input";
export * from "./ts/ScrollBox";
export * from "./ts/OrientBox";
export * from "./ts/FocusText";
export * from "./ts/LongText";
