import { defineConfig } from "@iringo/arguments-builder";
import { siri, output, storage, logLevel } from "./arguments-builder.full.config";

export default defineConfig({
    output: output,
    args: [...siri, ...storage, ...logLevel],
});
