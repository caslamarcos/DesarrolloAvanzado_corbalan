import { promises as fs } from "fs";

export async function readJSON(path, fallback = []) {
  try {
    const raw = await fs.readFile(path, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    if (err.code === "ENOENT") return fallback;
    throw err;
  }
}

export async function writeJSON(path, data) {
  const tmp = `${path}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmp, path);
}