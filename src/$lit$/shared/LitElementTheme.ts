/// <reference types="lit" />
import { BLitElement, defineElement } from "/externals/lib/blue.js";

//@defineElement("")
export class ThemedElement extends BLitElement() {
    constructor() {super();}
    protected onInitialize() {
        super.onInitialize?.();
        this.loadThemeLibrary?.();
        return this;
    }
}

//
export default ThemedElement;
