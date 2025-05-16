import initLong from "./longtext/LongText";
import initFocus from "./focustext/FocusText";

//
export const initializeLT = (ROOT = document.documentElement)=>{ initLong(ROOT); initFocus(ROOT); }
export default initializeLT;

//
export * from "./shared/Gesture";
export * from "./shared/Selection";
export * from "./shared/Gesture";
export * from "./shared/GridDragging";
export * from "./shared/Scrollbar";
export * from "./focustext/FocusText";
export * from "./longtext/LongText";
