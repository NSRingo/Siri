import assert from "node:assert/strict";
import test from "node:test";
import HonoWorkerAdapter from "../src/class/HonoWorkerAdapter.mjs";

for (const host of ["api-smoot.nanocat.cloud", "api-smoot.pages.dev", "api-smoot.nanocat.workers.dev", "dev.api-smoot.nanocat.cloud", "dev.api-smoot.pages.dev"]) {
    test(`${host} routes Search and Spotlight endpoints to Apple`, () => {
        for (const path of ["bag", "search", "card", "flight", "warm", "render"]) {
            for (const prefix of ["", "api.smoot.apple.com/"]) {
                const rest = `${prefix}${path}`;
                const url = HonoWorkerAdapter.routeRewrite(new URL(`https://${host}/${rest}?cc=CN&locale=zh-Hans_CN`), rest);
                assert.equal(url.toString(), `https://api.smoot.apple.com/${path}?cc=CN&locale=zh-Hans_CN`);
            }
        }
    });
}

test("per-request query and header arguments reach settings as parsed objects", () => {
    for (const enabled of ["false", "true"]) {
        const queryRequest = HonoWorkerAdapter.buildArgument({
            url: `https://api.smoot.apple.com/bag?cc=US&Enabled=${enabled}&SafariSmartHistory=${enabled}`,
            headers: {},
        });
        assert.deepEqual(globalThis.$argument, { cc: "US", Enabled: enabled, SafariSmartHistory: enabled });
        assert.equal(queryRequest.url, "https://api.smoot.apple.com/bag?cc=US");

        const headerRequest = HonoWorkerAdapter.buildArgument({
            url: "https://api.smoot.apple.com/bag?cc=US",
            headers: { $argument: `Enabled=${enabled}&SafariSmartHistory=${enabled}` },
        });
        assert.deepEqual(globalThis.$argument, { Enabled: enabled, SafariSmartHistory: enabled });
        assert.equal(headerRequest.headers.$argument, undefined);
    }
});
