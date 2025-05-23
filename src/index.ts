// this will be whole UI bundle...
// later, design core will be excluded from main distribution
// may be, some UI components will be dedicated from that project

//
export * from "@service/functional/fn-contextmenu";
export * from "@service/functional/fn-dropmenu";
export * from "@service/functional/fn-modal";
export * from "@service/layout/ps-draggable";
export * from "@service/layout/ps-anchor";
export * from "@service/tasks/manager";
export * from "@service/tasks/opening";
export * from "@service/tasks/binding";
export * from "@blit/index";
export * from "@scss/index";
export * from "@ext/index";

//
import init2 from "@ext/index";
import init from "@scss/index";
export default (ROOT = document.documentElement)=>{ init2(ROOT), init(ROOT); };
