/// <reference types="lit" />
//export * from '/externals/vendor/lit-core.min.js';

// you won't able to exclude that
// internal package mode (will or chunk or built-in)
// @ts-ignore
export * from "lit";

// @ts-ignore
export { unsafeStatic, withStatic } from "lit/static-html.js";

// @ts-ignore
export * from "lit/decorators.js";
