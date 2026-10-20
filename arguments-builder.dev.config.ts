import { defineConfig } from "@iringo/arguments-builder";
import { siri, storage, logLevel } from "./arguments-builder.full.config";

export default defineConfig({
    output: {
        surge: {
            path: "./dist/iRingo.Siri.dev.sgmodule",
            template: "./template/Siri/surge.dev.handlebars",
        },
        loon: {
            path: "./dist/iRingo.Siri.dev.plugin",
            template: "./template/Siri/loon.dev.handlebars",
        },
        customItems: [
            {
                path: "./dist/iRingo.Siri.dev.snippet",
                template: "./template/Siri/quantumultx.dev.handlebars",
            },
            {
                path: "./dist/iRingo.Siri.dev.stoverride",
                template: "./template/Siri/stash.dev.handlebars",
            },
        ],
        boxjsSettings: {
            path: "./dist/iRingo.Siri.dev.boxjs.json",
            scope: "@iRingo.Siri.Settings",
        },
    },
    args: [...siri, ...storage, ...logLevel],
});
