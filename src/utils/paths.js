import path from "path";
export const dataPath = (file) => path.join(process.cwd(), "data", file);