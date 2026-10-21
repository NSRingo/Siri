import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

for (const product of ["Search", "Spotlight"]) {
    const directory = new URL(`../template/${product}/`, import.meta.url);
    for (const name of readdirSync(directory).filter(name => name.endsWith(".handlebars"))) {
        test(`${product}/${name}: bag only matches api.com and api.cn, other api2 routes remain`, () => {
            const template = readFileSync(new URL(name, directory), "utf8");
            const patterns = template.match(/\^https\?:[^,\s]+/g);
            const bags = patterns.filter(pattern => pattern.includes("\\/bag"));
            assert.equal(bags.length, 2);
            for (const pattern of bags) {
                const rule = new RegExp(pattern);
                for (const host of ["api.smoot.apple.com", "api.smoot.apple.cn"]) {
                    assert.equal(rule.test(`https://${host}/bag?cc=SG`), true, `${pattern}: ${host}`);
                }
                for (const host of ["api2.smoot.apple.com", "api2.smoot.apple.cn", "api.smoot.apple.com.cn", "api2.smoot.apple.com.cn"]) {
                    assert.equal(rule.test(`https://${host}/bag?cc=SG`), false, `${pattern}: ${host}`);
                }
            }
            for (const pattern of patterns.filter(pattern => !pattern.includes("\\/bag"))) {
                const path = pattern.match(/\\\/(search|card|flight)/)[1];
                const rule = new RegExp(pattern);
                assert.equal(rule.test(`https://api2.smoot.apple.com/${path}`), true, pattern);
                assert.equal(rule.test(`https://api2.smoot.apple.com.cn/${path}`), false, pattern);
            }
            assert.doesNotMatch(template, /api\.smoot\.apple\.com\.cn/);
        });
    }
}
