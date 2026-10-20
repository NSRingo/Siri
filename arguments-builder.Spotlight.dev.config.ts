import { defineConfig } from "@iringo/arguments-builder";
import { spotlight, storage, logLevel } from "./arguments-builder.full.config";

export default defineConfig({
    output: {
        surge: {
            path: "./dist/iRingo.Spotlight.dev.sgmodule",
            template: "./template/Spotlight/surge.dev.handlebars",
        },
        loon: {
            path: "./dist/iRingo.Spotlight.dev.plugin",
            template: "./template/Spotlight/loon.dev.handlebars",
        },
        customItems: [
            {
                path: "./dist/iRingo.Spotlight.dev.stoverride",
                template: "./template/Spotlight/stash.dev.handlebars",
            },
        ],
        boxjsSettings: {
            path: "./dist/iRingo.Spotlight.dev.boxjs.json",
            scope: "@iRingo.Spotlight.Settings",
        },
    },
    args: [...spotlight, ...storage, ...logLevel],
});
