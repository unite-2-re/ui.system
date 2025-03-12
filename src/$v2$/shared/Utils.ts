export const setAttributesIfNull = (element, attrs = {})=>{
    return Array.from(Object.entries(attrs)).map(([name, value])=>{
        element.setAttribute(element.getAttribute(name) ?? value);
    });
}

export const setAttributes = (element, attrs = {})=>{
    return Array.from(Object.entries(attrs)).map(([name, value])=>{
        element.setAttribute(value ?? element.getAttribute(name));
    });
}
