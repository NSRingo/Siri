import { defineConfig } from "@iringo/arguments-builder";
import { spotlight, searchOutput, storage, logLevel } from "./arguments-builder.full.config";

export default defineConfig({
    output: searchOutput,
    args: [...spotlight, ...storage, ...logLevel],
});
