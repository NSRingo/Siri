import { defineConfig } from "@iringo/arguments-builder";

type Arg = {
    key: string;
    type: "string" | "number" | "boolean" | "array";
    boxJsType?: "number" | "boolean" | "text" | "slider" | "textarea" | "radios" | "checkboxes" | "colorpicker" | "selects" | "modalSelects" | undefined;
    name?: string | undefined;
    description?: string | undefined;
    // biome-ignore lint/suspicious/noExplicitAny: Copy from upstream `@iringo/arguments-builder`
    defaultValue?: any;
    options?:
        | {
              key: string;
              label?: string | undefined;
          }[]
        | undefined;
    placeholder?: string | undefined;
    exclude?: ("surge" | "loon" | "boxjs" | "dts")[] | undefined;
};

export const output = {
    surge: {
        path: "./dist/iRingo.Siri.sgmodule",
        template: "./template/Siri/surge.handlebars",
        transformEgern: {
            enable: true,
            path: "./dist/iRingo.Siri.yaml",
        },
    },
    loon: {
        path: "./dist/iRingo.Siri.lpx",
        template: "./template/Siri/loon.handlebars",
    },
    customItems: [
        {
            path: "./dist/iRingo.Siri.snippet",
            template: "./template/Siri/quantumultx.handlebars",
        },
        {
            path: "./dist/iRingo.Siri.stoverride",
            template: "./template/Siri/stash.handlebars",
        },
    ],
    dts: {
        isExported: true,
        path: "./src/types.d.ts",
    },
    boxjsSettings: {
        path: "./template/Siri/boxjs.settings.json",
        scope: "@iRingo.Siri.Settings",
    },
};

export const searchOutput = {
    surge: {
        path: "./dist/iRingo.Search.sgmodule",
        template: "./template/Search/surge.handlebars",
        transformEgern: {
            enable: true,
            path: "./dist/iRingo.Search.yaml",
        },
    },
    loon: {
        path: "./dist/iRingo.Search.lpx",
        template: "./template/Search/loon.handlebars",
    },
    customItems: [
        {
            path: "./dist/iRingo.Search.snippet",
            template: "./template/Search/quantumultx.handlebars",
        },
        {
            path: "./dist/iRingo.Search.stoverride",
            template: "./template/Search/stash.handlebars",
        },
    ],
    dts: {
        isExported: true,
        path: "./src/types.Spotlight.d.ts",
    },
    boxjsSettings: {
        path: "./template/Search/boxjs.settings.json",
        scope: "@iRingo.Spotlight.Settings",
    },
};

export const spotlightOutput = {
    surge: {
        path: "./dist/iRingo.Spotlight.sgmodule",
        template: "./template/Spotlight/surge.handlebars",
    },
    loon: {
        path: "./dist/iRingo.Spotlight.lpx",
        template: "./template/Spotlight/loon.handlebars",
    },
    customItems: [
        {
            path: "./dist/iRingo.Spotlight.stoverride",
            template: "./template/Spotlight/stash.handlebars",
        },
    ],
    dts: {
        isExported: true,
        path: "./src/types.Spotlight.d.ts",
    },
    boxjsSettings: {
        path: "./template/Spotlight/boxjs.settings.json",
        scope: "@iRingo.Spotlight.Settings",
    },
};

export const siri: Arg[] = [
    {
        key: "CountryCode",
        name: "国家或地区代码",
        type: "string",
        defaultValue: "US",
        description: "不同国家或地区提供的内容或有差别，此选项同时会影响分配给您不同地区的 Siri 服务器。",
        options: [
            {
                key: "OFF",
                label: "🔴 关闭（不修改）",
            },
            {
                key: "AUTO",
                label: "🇺🇳 自动（跟随系统地区设置）",
            },
            {
                key: "CN",
                label: "🇨🇳 中国大陆",
            },
            {
                key: "HK",
                label: "🇭🇰 中国香港",
            },
            {
                key: "TW",
                label: "🇹🇼 中国台湾",
            },
            {
                key: "SG",
                label: "🇸🇬 新加坡",
            },
            {
                key: "US",
                label: "🇺🇸 美国",
            },
            {
                key: "JP",
                label: "🇯🇵 日本",
            },
            {
                key: "AU",
                label: "🇦🇺 澳大利亚",
            },
            {
                key: "GB",
                label: "🇬🇧 英国",
            },
            {
                key: "KR",
                label: "🇰🇷 韩国",
            },
            {
                key: "CA",
                label: "🇨🇦 加拿大",
            },
            {
                key: "IE",
                label: "🇮🇪 爱尔兰",
            },
        ],
    },
    {
        key: "SiriLocale",
        name: "Siri 区域",
        type: "string",
        defaultValue: "zh_CN",
        description: "忽略系统中“Siri”的“语言”设置，强制采用这里的设置。",
        options: [
            {
                key: "OFF",
                label: "🔴 关闭（不修改）",
            },
            {
                key: "AUTO",
                label: "🇺🇳 自动 (跟随“Siri”的“语言”设置)",
            },
            {
                key: "zh_CN",
                label: "🇨🇳 中文 (普通话 - 中国大陆)",
            },
            {
                key: "zh_TW",
                label: "🇹🇼 中文 (普通话 - 台湾)",
            },
            {
                key: "yue_CN",
                label: "🇨🇳 中文 (粤语 - 中国大陆)",
            },
            {
                key: "zh_HK",
                label: "🇭🇰 中文 (粤语 - 香港)",
            },
            {
                key: "ja_JP",
                label: "🇯🇵 日语",
            },
            {
                key: "en_CA",
                label: "🇨🇦 英语 (加拿大)",
            },
            {
                key: "en_SG",
                label: "🇸🇬 英语 (新加坡)",
            },
            {
                key: "en_AU",
                label: "🇦🇺 英语 (澳大利亚)",
            },
            {
                key: "en_IE",
                label: "🇮🇪 英语 (爱尔兰)",
            },
            {
                key: "en_US",
                label: "🇺🇸 英语 (美国)",
            },
            {
                key: "en_GB",
                label: "🇬🇧 英语 (英国)",
            },
            {
                key: "ko_KR",
                label: "🇰🇷 韩语",
            },
        ],
    },
    {
        key: "Region",
        name: "区域",
        type: "string",
        defaultValue: "OFF",
        description: "作用未知，待测试。",
        options: [
            {
                key: "OFF",
                label: "🔴 关闭（不修改）",
            },
            {
                key: "AUTO",
                label: "🇺🇳 自动（跟随系统地区设置）",
            },
            {
                key: "CN",
                label: "🇨🇳 中国大陆",
            },
            {
                key: "HK",
                label: "🇭🇰 中国香港",
            },
            {
                key: "TW",
                label: "🇹🇼 中国台湾",
            },
            {
                key: "SG",
                label: "🇸🇬 新加坡",
            },
            {
                key: "US",
                label: "🇺🇸 美国",
            },
            {
                key: "JP",
                label: "🇯🇵 日本",
            },
            {
                key: "AU",
                label: "🇦🇺 澳大利亚",
            },
            {
                key: "GB",
                label: "🇬🇧 英国",
            },
            {
                key: "KR",
                label: "🇰🇷 韩国",
            },
            {
                key: "CA",
                label: "🇨🇦 加拿大",
            },
            {
                key: "IE",
                label: "🇮🇪 爱尔兰",
            },
        ],
    },
    {
        key: "SiriResponseLanguageVariant",
        name: "Siri 响应语言修改",
        type: "string",
        defaultValue: "zh_CN",
        description: "自定义 Siri 回复时使用的语言。",
        options: [
            {
                key: "OFF",
                label: "🔴 关闭（不修改）",
            },
            {
                key: "AUTO",
                label: "🇺🇳 自动 (跟随“Siri”的“语言”设置)",
            },
            {
                key: "zh_CN",
                label: "🇨🇳 中文 (普通话 - 中国大陆)",
            },
            {
                key: "zh_TW",
                label: "🇹🇼 中文 (普通话 - 台湾)",
            },
            {
                key: "yue_CN",
                label: "🇨🇳 中文 (粤语 - 中国大陆)",
            },
            {
                key: "zh_HK",
                label: "🇭🇰 中文 (粤语 - 香港)",
            },
            {
                key: "ja_JP",
                label: "🇯🇵 日语",
            },
            {
                key: "en_CA",
                label: "🇨🇦 英语 (加拿大)",
            },
            {
                key: "en_SG",
                label: "🇸🇬 英语 (新加坡)",
            },
            {
                key: "en_AU",
                label: "🇦🇺 英语 (澳大利亚)",
            },
            {
                key: "en_IE",
                label: "🇮🇪 英语 (爱尔兰)",
            },
            {
                key: "en_US",
                label: "🇺🇸 英语 (美国)",
            },
            {
                key: "en_GB",
                label: "🇬🇧 英语 (英国)",
            },
            {
                key: "ko_KR",
                label: "🇰🇷 韩语",
            },
        ],
    },
];

export const spotlight: Arg[] = [
    {
        key: "Enabled",
        name: "启用 Siri 建议",
        type: "boolean",
        defaultValue: true,
        description: "是否启用「Siri 建议」功能。",
    },
    {
        key: "CountryCode",
        name: "国家或地区代码",
        type: "string",
        defaultValue: "SG",
        description: "不同国家或地区提供的内容或有差别，此选项同时会影响分配给您不同地区的 Siri 服务器。",
        options: [
            {
                key: "AUTO",
                label: "🇺🇳 自动（跟随系统地区设置）",
            },
            {
                key: "CN",
                label: "🇨🇳 中国大陆",
            },
            {
                key: "HK",
                label: "🇭🇰 中国香港",
            },
            {
                key: "TW",
                label: "🇹🇼 中国台湾",
            },
            {
                key: "SG",
                label: "🇸🇬 新加坡",
            },
            {
                key: "US",
                label: "🇺🇸 美国",
            },
            {
                key: "JP",
                label: "🇯🇵 日本",
            },
            {
                key: "AU",
                label: "🇦🇺 澳大利亚",
            },
            {
                key: "GB",
                label: "🇬🇧 英国",
            },
            {
                key: "KR",
                label: "🇰🇷 韩国",
            },
            {
                key: "CA",
                label: "🇨🇦 加拿大",
            },
            {
                key: "IE",
                label: "🇮🇪 爱尔兰",
            },
        ],
    },
    {
        key: "Domains",
        name: "搜索领域",
        type: "array",
        defaultValue: ["web", "itunes", "app_store", "movies", "restaurants", "maps"],
        description: "启用搜索的领域，领域数据由国家或地区设置决定，此选项仅开启搜索的领域，不代表设置的地区一定有相应的数据和服务。",
        options: [
            {
                key: "web",
                label: "网页",
            },
            {
                key: "itunes",
                label: "iTunes",
            },
            {
                key: "app_store",
                label: "App Store",
            },
            {
                key: "movies",
                label: "电影",
            },
            {
                key: "restaurants",
                label: "餐厅",
            },
            {
                key: "maps",
                label: "地图",
            },
        ],
    },
    {
        key: "Functions",
        name: "功能",
        type: "array",
        defaultValue: ["flightutilities", "lookup", "mail", "messages", "news", "safari", "siri", "spotlight", "visualintelligence"],
        description: "启用的「Siri 建议」功能，未选的功能不代表关闭，仅代表还原到该地区默认设置状态。",
        options: [
            {
                key: "flightutilities",
                label: "航班工具",
            },
            {
                key: "lookup",
                label: "查询",
            },
            {
                key: "mail",
                label: "邮件",
            },
            {
                key: "messages",
                label: "信息",
            },
            {
                key: "news",
                label: "新闻",
            },
            {
                key: "safari",
                label: "Safari浏览器",
            },
            {
                key: "siri",
                label: "Siri",
            },
            {
                key: "spotlight",
                label: "聚焦搜索",
            },
            {
                key: "visualintelligence",
                label: "视觉智能",
            },
        ],
    },
    {
        key: "SafariSmartHistory",
        name: "Safari 智能历史记录",
        type: "boolean",
        defaultValue: true,
        description: "是否在 Safari 浏览器中启用基于历史记录的Siri建议功能，启用后将在Safari浏览器起始页推荐基于时间地点跨设备等的相关浏览记录。",
    },
];

export const storage: Arg[] = [
    {
        key: "Storage",
        name: "[储存] 配置类型",
        defaultValue: "PersistentStore",
        type: "string",
        exclude: ["boxjs"],
        options: [
            { key: "Argument", label: "优先使用 $argument，其次使用 PersistentStore (BoxJs)，最后使用 database.mjs 的默认配置" },
            { key: "PersistentStore", label: "优先使用来自 BoxJs 等，由 $persistentStore 提供的配置，其次使用 $argument，最后使用 database.mjs 的默认配置" },
            { key: "database", label: "只使用由作者的 database.mjs 文件提供的默认配置，其他任何自定义配置不再起作用" },
        ],
        description: "默认使用 PersistentStore，配置优先级为 database -> $argument -> PersistentStore (BoxJs)；选择 Argument 时为 database -> PersistentStore (BoxJs) -> $argument。",
    },
];

export const logLevel: Arg[] = [
    {
        key: "LogLevel",
        name: "[调试] 日志等级",
        type: "string",
        defaultValue: "WARN",
        description: "选择脚本日志的输出等级，低于所选等级的日志将全部输出。",
        options: [
            {
                key: "OFF",
                label: "🔴 关闭",
            },
            {
                key: "ERROR",
                label: "❌ 错误",
            },
            {
                key: "WARN",
                label: "⚠️ 警告",
            },
            {
                key: "INFO",
                label: "ℹ️ 信息",
            },
            {
                key: "DEBUG",
                label: "🅱️ 调试",
            },
            {
                key: "ALL",
                label: "全部",
            },
        ],
    },
];

export default defineConfig({
    output,
    args: [...siri, ...storage, ...logLevel],
});
