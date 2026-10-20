import { defineConfig } from "@iringo/arguments-builder";
import { spotlight, spotlightOutput, storage, logLevel } from "./arguments-builder.full.config";

export default defineConfig({
    output: spotlightOutput,
    args: [...spotlight, ...storage, ...logLevel],
});
