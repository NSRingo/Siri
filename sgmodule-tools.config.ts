import { defineConfig } from "@iringo/sgmoudle-tools";
import { ArgumentsBuilder } from "@iringo/arguments-builder";
import argConfig from "./arguments-builder.dev.config";

const args = new ArgumentsBuilder(argConfig);
const { scriptParams } = args.buildSurgeArguments();

export default defineConfig({
    module: {
        script: [
            {
                name: "⭕ Siri.Search.request",
                type: "http-request",
                scriptPath: "./dist/request.dev.bundle.js",
                pattern: "^https?:\\/\\/(api-siri|api2|api-.+)\\.smoot\\.apple\\.com\\/search",
                engine: "webview",
                argument: scriptParams,
            },
            {
                name: "⭕ Siri.SiriSearch.request",
                type: "http-request",
                scriptPath: "./dist/request.dev.bundle.js",
                pattern: "^https?:\\/\\/(guzzoni|api2|api-.+)\\.smoot\\.apple\\.com\\/apple\\.parsec\\.siri\\.v2alpha\\.SiriSearch\\/SiriSearch",
                engine: "webview",
                requiresBody: true,
                binaryBodyMode: true,
                argument: scriptParams,
            },
            {
                name: "🔍 Safari.SafariSearch.request",
                type: "http-request",
                scriptPath: "./dist/request.dev.bundle.js",
                pattern: "^https?:\\/\\/api-safari(-.+)?\\.smoot\\.apple\\.com\\/apple\\.parsec\\.safari\\.v1alpha\\.SafariSearch\\/SafariSearch",
                engine: "webview",
                requiresBody: true,
                binaryBodyMode: true,
                argument: scriptParams,
            },
            {
                name: "🔍 Lookup.LookupSearch.request",
                type: "http-request",
                scriptPath: "./dist/request.dev.bundle.js",
                pattern: "^https?:\\/\\/api-lookup(-.+)?\\.smoot\\.apple\\.com\\/apple\\.parsec\\.lookup\\.v1alpha\\.LookupSearch\\/LookupSearch",
                engine: "webview",
                requiresBody: true,
                binaryBodyMode: true,
                argument: scriptParams,
            },
            {
                name: "🔍 Visualsearch.VisualSearch.request",
                type: "http-request",
                scriptPath: "./dist/request.dev.bundle.js",
                pattern: "^https?:\\/\\/(api2|api-.+)\\.smoot\\.apple\\.com\\/apple\\.parsec\\.visualsearch\\.v2\\.VisualSearch\\/VisualSearch",
                engine: "webview",
                requiresBody: true,
                binaryBodyMode: true,
                argument: scriptParams,
            },
            {
                name: "🔍 ResponseFramework.Engagement.EngagementSearch.request",
                type: "http-request",
                scriptPath: "./dist/request.dev.bundle.js",
                pattern: "^https?:\\/\\/(api-.+)\\.smoot\\.apple\\.com\\/apple\\.parsec\\.responseframework\\.engagement\\.v1alpha\\.EngagementSearch\\/EngagementSearch",
                engine: "webview",
                requiresBody: true,
                binaryBodyMode: true,
                argument: scriptParams,
            },
            {
                name: "🔍 Spotlight.ZkwSuggestService.request",
                type: "http-request",
                scriptPath: "./dist/request.dev.bundle.js",
                pattern: "^https?:\\/\\/(api-.+)\\.smoot\\.apple\\.com\\/apple\\.parsec\\.spotlight\\.v1alpha\\.ZkwSuggestService\\/Suggest",
                engine: "webview",
                requiresBody: true,
                binaryBodyMode: true,
                argument: scriptParams,
            },
        ],
        mitm: {
            hostname: ["guzzoni.smoot.apple.com", "api2.smoot.apple.com", "api-*.smoot.apple.com"],
        },
    },
});
