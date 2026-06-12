import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { Database } from "../models/Database";

const storePath = path.join(__dirname, "../data/db.json");

export const loadStore = (): Database => {
  const raw = readFileSync(storePath, "utf-8");
  return JSON.parse(raw) as Database;
};

export const persistStore = (store: Database): void => {
  writeFileSync(storePath, JSON.stringify(store, null, 2));
};
