import { defineConfig } from "@iringo/arguments-builder";
import { spotlight, storage, logLevel } from "./arguments-builder.full.config";

export default defineConfig({
    output: {
        surge: {
            path: "./dist/iRingo.Search.dev.sgmodule",
            template: "./template/Search/surge.dev.handlebars",
        },
        loon: {
            path: "./dist/iRingo.Search.dev.plugin",
            template: "./template/Search/loon.dev.handlebars",
        },
        customItems: [
            {
                path: "./dist/iRingo.Search.dev.snippet",
                template: "./template/Search/quantumultx.dev.handlebars",
            },
            {
                path: "./dist/iRingo.Search.dev.stoverride",
                template: "./template/Search/stash.dev.handlebars",
            },
        ],
        boxjsSettings: {
            path: "./dist/iRingo.Search.dev.boxjs.json",
            scope: "@iRingo.Spotlight.Settings",
        },
    },
    args: [...spotlight, ...storage, ...logLevel],
});
