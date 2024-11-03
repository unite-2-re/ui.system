// this will be whole UI bundle...
// later, design core will be excluded from main distribution
// may be, some UI components will be dedicated from that project

export * from "./$lit$/index";
export * from "./$design$/index";
import init from "./$design$/index";
export default init;
