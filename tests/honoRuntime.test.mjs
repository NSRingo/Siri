import assert from "node:assert/strict";
import test from "node:test";

globalThis.Cloudflare = {};
const { default: app } = await import("../src/Hono.js");

test("concurrent bag requests retain their own URL and Messages settings through the upstream fetch", { timeout: 5000 }, async () => {
    const nativeFetch = globalThis.fetch;
    const pending = [];
    let ready;
    const allArrived = new Promise(resolve => { ready = resolve; });
    globalThis.fetch = url => new Promise(resolve => {
        pending.push({ url: String(url), resolve });
        if (pending.length === 3) ready();
    });
    try {
        const settings = [
            {},
            { SiriSearchURL: "https://custom.example/siri", SiriSAMSearchURL: "https://custom.example/sam", EncryptedVisualSearchURL: "https://custom.example/encrypted", EncryptedVisualSearchSupportedUsecases: "ENCRYPTED_GENMOJI", "MessagesMinQueryLen": "1", "MessagesSearchRenderTimeout": "200" },
            { SiriSearchURL: "", SiriSAMSearchURL: "", EncryptedVisualSearchURL: "", EncryptedVisualSearchSupportedUsecases: "", "MessagesMinQueryLen": "", "MessagesSearchRenderTimeout": "" },
        ];
        const responses = settings.map((args, index) => app.fetch(new Request(`https://${index === 1 ? "api-smoot.pages.dev" : "api-smoot.nanocat.cloud"}/bag?${new URLSearchParams({ cc: "CN", ...args })}`)));
        await allArrived;
        for (const request of pending.toReversed()) {
            assert.equal(new URL(request.url).searchParams.get("cc"), "SG");
            request.resolve(new Response(JSON.stringify({ overrides: {} }), { status: 200, headers: { "Content-Type": "application/json" } }));
        }
        const bodies = await Promise.all(responses.map(async response => (await response).json()));
        assert.equal(Object.hasOwn(bodies[0].overrides.siri, "search_url"), false);
        assert.equal(Object.hasOwn(bodies[0].overrides.encryptedvisualsearch, "search_url"), false);
        assert.equal(Object.hasOwn(bodies[0], "sam_search_url"), false);
        assert.equal(bodies[0].overrides.encryptedvisualsearch.supported_usecases.length, 4);
        assert.equal(bodies[1].overrides.siri.search_url, settings[1].SiriSearchURL);
        assert.equal(bodies[1].sam_search_url, settings[1].SiriSAMSearchURL);
        assert.equal(bodies[1].overrides.encryptedvisualsearch.search_url, settings[1].EncryptedVisualSearchURL);
        assert.deepEqual(bodies[1].overrides.encryptedvisualsearch.supported_usecases, ["ENCRYPTED_GENMOJI"]);
        assert.equal(Object.hasOwn(bodies[2].overrides.siri, "search_url"), false);
        assert.equal(Object.hasOwn(bodies[2], "sam_search_url"), false);
        assert.equal(Object.hasOwn(bodies[2].overrides.encryptedvisualsearch, "search_url"), false);
        assert.deepEqual(bodies[2].overrides.encryptedvisualsearch.supported_usecases, []);
        for (const body of [bodies[0], bodies[2]]) {
            assert.equal(Object.hasOwn(body.overrides.messages, "min_query_len"), false);
            assert.equal(Object.hasOwn(body.overrides.messages, "search_render_timeout"), false);
        }
        assert.equal(bodies[1].overrides.messages.min_query_len, 1);
        assert.equal(bodies[1].overrides.messages.search_render_timeout, 200);
    } finally {
        globalThis.fetch = nativeFetch;
    }
});
