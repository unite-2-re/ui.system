// @ts-ignore /* @vite-ignore */
import { BLitElement, H } from "/externals/modules/blue.js";
export class ThemedElement extends BLitElement() {
    constructor() {super();}
    render = ()=>H("<slot/>");
    protected onInitialize() {
        super.onInitialize?.();
        this.loadThemeLibrary?.();
        return this;
    }
}
export default ThemedElement;
