import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { gzipSync, gunzipSync } from "node:zlib";
import { MessageType } from "@protobuf-ts/runtime";

const queryContext = new MessageType("PegasusQueryContext", [
    { no: 2, name: "countryCode", kind: "scalar", T: 9 },
    { no: 3, name: "locale", kind: "scalar", T: 9 },
    { no: 9, name: "skuRegion", kind: "scalar", opt: true, T: 9 },
    { no: 26, name: "siriLocale", kind: "scalar", opt: true, T: 9 },
    { no: 27, name: "region", kind: "scalar", opt: true, T: 9 },
    { no: 31, name: "siriResponseLanguageVariant", kind: "scalar", opt: true, T: 9 },
]);
const siriRequest = new MessageType("SiriPegasusRequest", [{ no: 2, name: "queryContext", kind: "message", T: () => queryContext }]);

async function replay(kind, variant, request, { app = "Loon", argument, response, storage } = {}) {
    const source = readFileSync(new URL(`../dist/${kind}${variant}.bundle.js`, import.meta.url), "utf8");
    const logs = [];
    const result = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Script did not call $done")), 5000);
        const context = {
            $request: structuredClone(request),
            $argument: argument,
            $script: { startTime: Date.now() },
            $done: value => { clearTimeout(timer); resolve(value); },
            $utils: { ungzip: value => new Uint8Array(gunzipSync(value)) },
            $persistentStore: { read: key => key === "iRingo" && storage ? JSON.stringify(storage) : null },
            console: Object.fromEntries(["log", "info", "warn", "error", "debug"].map(name => [name, (...values) => logs.push(values.join(" "))])),
            URL, TextEncoder, TextDecoder, setTimeout, clearTimeout, atob, btoa,
        };
        if (app !== "Quantumult X") context.$loon = "contract-test";
        else {
            context.$task = {};
            context.$prefs = { valueForKey: () => null };
        }
        if (response) context.$response = structuredClone(response);
        try { vm.runInNewContext(source, context, { timeout: 5000, displayErrors: false }); }
        catch (error) { clearTimeout(timer); reject(new Error(error.message)); }
    });
    assert.doesNotMatch(logs.join("\n"), /❌/);
    return result;
}

for (const variant of ["", ".dev"]) {
    test(`${variant || "release"}: CN bag host continues through country handling`, async () => {
        const result = await replay("request", variant, {
            url: "https://api.smoot.apple.cn/search?cc=CN&locale=zh-Hans_TW&qtype=card",
            method: "GET", headers: { "X-Preserved": "yes" },
        });
        const url = new URL(result.url);
        assert.equal(url.hostname, "api.smoot.apple.cn");
        assert.equal(url.searchParams.get("cc"), "SG");
        assert.equal(url.searchParams.get("card_locale"), "zh-Hans_SG");
        assert.deepEqual(result.headers, { "X-Preserved": "yes" });
    });

    for (const storageMode of ["PersistentStore", "Argument", "database"]) {
        test(`${variant || "release"}: util Storage=${storageMode} priority and bag field preservation`, async () => {
            const input = {
                enabled: false, feedback_enabled: true, min_query_len: 7,
                enabled_domains: ["server"], supported_domains: ["SERVER"],
                safari_smart_history_enabled: false, smart_history_feature_feedback_enabled: true,
                overrides: {
                    lookup: { enabled: false, feedback_enabled: true, experiments_custom_feedback_enabled: true },
                    safari: { enabled: false, feedback_enabled: true, experiments_custom_feedback_enabled: true },
                },
            };
            const result = await replay("response", variant, {
                url: "https://api.smoot.apple.com/bag", method: "GET", headers: {},
            }, {
                argument: `Storage=${storageMode}&Enabled=true&Functions=lookup&SafariSmartHistory=true`,
                storage: { Spotlight: { Settings: { Enabled: false, Functions: ["safari"], SafariSmartHistory: false } } },
                response: { status: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) },
            });
            const body = JSON.parse(result.body);
            assert.equal(body.enabled, storageMode !== "PersistentStore");
            assert.equal(body.safari_smart_history_enabled, storageMode !== "PersistentStore");
            assert.equal(body.feedback_enabled, false);
            assert.equal(body.smart_history_feature_feedback_enabled, false);
            assert.equal(body.min_query_len, input.min_query_len);
            assert.deepEqual(body.enabled_domains, input.enabled_domains);
            assert.deepEqual(body.supported_domains, input.supported_domains);
            for (const name of ["lookup", "safari"]) {
                assert.equal(body.overrides[name].feedback_enabled, false);
                assert.equal(body.overrides[name].experiments_custom_feedback_enabled, false);
            }
            assert.equal(body.overrides.lookup.enabled, storageMode !== "PersistentStore");
            assert.equal(body.overrides.safari.enabled, storageMode !== "Argument");
        });
    }

    for (const app of ["Loon", "Loon bodyBytes", "Quantumult X"]) {
        for (const gzip of [false, true]) {
            test(`${variant || "release"}: ${app} ${gzip ? "gzip" : "identity"} gRPC request survives dependency migration`, async () => {
                const payload = siriRequest.toBinary(siriRequest.create({ queryContext: { locale: "zh-Hans_CN", countryCode: "CN", skuRegion: "CH" } }));
                const encoded = gzip ? gzipSync(payload) : payload;
                const frame = new Uint8Array(5 + encoded.length);
                frame[0] = gzip ? 1 : 0;
                new DataView(frame.buffer).setUint32(1, encoded.length);
                frame.set(encoded, 5);
                const request = {
                    url: "https://guzzoni.smoot.apple.com/apple.parsec.siri.v2alpha.SiriSearch/SiriSearch",
                    method: "POST", headers: { "Content-Type": "application/grpc+proto" },
                };
                if (app !== "Loon") request.bodyBytes = frame.buffer;
                else request.body = frame;
                const result = await replay("request", variant, request, { app, argument: "CountryCode=US&SiriLocale=en_US&Region=US" });
                const output = new Uint8Array(app === "Quantumult X" ? result.bodyBytes : result.body);
                assert.equal(output[0], 0);
                assert.equal(new DataView(output.buffer).getUint32(1), output.length - 5);
                const decoded = siriRequest.fromBinary(output.slice(5)).queryContext;
                assert.equal(decoded.countryCode, "US");
                assert.equal(decoded.locale, "zh-Hans_CN");
                assert.equal(decoded.siriLocale, "en_US");
                assert.equal(decoded.region, "US");
                assert.equal(decoded.skuRegion, "LL");
            });
        }
    }
}
