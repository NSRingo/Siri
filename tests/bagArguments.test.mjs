import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { ArgumentsBuilder } from "@iringo/arguments-builder";
import { loadConfigFile } from "@iringo/utils";

const cwd = fileURLToPath(new URL("..", import.meta.url));
const devOnly = ["MessagesMinQueryLen", "MessagesSearchRenderTimeout", "SiriSAMSearchURL"];

for (const product of ["Search", "Spotlight"]) {
    for (const variant of ["dev", "release", "full"]) {
        test(`${product} ${variant}: advanced bag settings only appear in dev arguments and BoxJs`, async () => {
            const { config } = await loadConfigFile({ cwd, configPath: `arguments-builder.${product}.${variant}.config.ts` });
            const builder = new ArgumentsBuilder(config);
            const boxjs = builder.buildBoxJsSettings("@iRingo.Spotlight.Settings");
            const surge = builder.buildSurgeArguments();
            const loon = builder.buildLoonArguments();
            const functions = boxjs.find(setting => setting.id.endsWith(".Functions"));
            assert.equal(functions.type, "checkboxes");
            assert.ok(functions.items.some(item => item.key === "cameravisualsearch"));
            assert.ok(functions.val.includes("cameravisualsearch"));
            for (const key of devOnly) {
                assert.equal(config.args.some(arg => arg.key === key), variant === "dev");
                assert.equal(boxjs.some(setting => setting.id === `@iRingo.Spotlight.Settings.${key}`), variant === "dev");
                assert.equal(surge.scriptParams.includes(`${key}=`), variant === "dev");
                assert.equal(loon.scriptParams.includes(`{${key}}`), variant === "dev");
            }
            if (variant === "dev") {
                for (const key of devOnly.slice(0, 2)) {
                    const setting = boxjs.find(setting => setting.id.endsWith(`.${key}`));
                    assert.equal(setting.val, "");
                    assert.equal(setting.type, "text");
                    assert.ok(surge.argumentsText.includes(`${key}:""`));
                }
                const sam = boxjs.find(setting => setting.id.endsWith(".SiriSAMSearchURL"));
                assert.equal(sam.type, "text");
                assert.equal(sam.val, "https://api-siri-prod.apple.com");
            }
            for (const key of ["SiriSearchURL", "EncryptedVisualSearchURL"]) {
                assert.equal(boxjs.find(setting => setting.id.endsWith(`.${key}`)).type, "text");
            }
        });
    }
}
