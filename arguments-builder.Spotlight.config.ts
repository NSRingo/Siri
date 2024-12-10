import { defineConfig } from "@iringo/arguments-builder";
export default defineConfig({
	output: {
		surge: {
			path: "./dist/iRingo.Spotlight.sgmodule",
			template: "./template/Spotlight/surge.handlebars",
		},
		loon: {
			path: "./dist/iRingo.Spotlight.plugin",
			template: "./template/Spotlight/loon.handlebars",
		},
		customItems: [
			{
				path: "./dist/iRingo.Spotlight.stoverride",
				template: "./template/Spotlight/stash.handlebars",
			},
		],
		dts: { isExported: true, path: "./src/types.d.ts" },
		boxjsSettings: {
			path: "./template/Spotlight/boxjs.settings.json",
			scope: "@iRingo.Spotlight.Settings",
		},
	},
	args: [
		{
			key: "CountryCode",
			name: "国家或地区代码",
			type: "string",
			defaultValue: "SG",
			description: "不同国家或地区提供的内容或有差别，此选项同时会影响分配给您不同地区的 Siri 服务器。",
			options: [
				{ key: "AUTO", label: "🇺🇳自动（跟随系统地区设置）" },
				{ key: "CN", label: "🇨🇳中国大陆" },
				{ key: "HK", label: "🇭🇰中国香港" },
				{ key: "TW", label: "🇹🇼中国台湾" },
				{ key: "SG", label: "🇸🇬新加坡" },
				{ key: "US", label: "🇺🇸美国" },
				{ key: "JP", label: "🇯🇵日本" },
				{ key: "AU", label: "🇦🇺澳大利亚" },
				{ key: "GB", label: "🇬🇧英国" },
				{ key: "KR", label: "🇰🇷韩国" },
				{ key: "CA", label: "🇨🇦加拿大" },
				{ key: "IE", label: "🇮🇪爱尔兰" },
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
		{
			key: "LogLevel",
			name: "[调试] 日志等级",
			type: "string",
			defaultValue: "WARN",
			description: "选择脚本日志的输出等级，低于所选等级的日志将全部输出。",
			options: [
				{ key: "OFF", label: "关闭" },
				{ key: "ERROR", label: "❌ 错误" },
				{ key: "WARN", label: "⚠️ 警告" },
				{ key: "INFO", label: "ℹ️ 信息" },
				{ key: "DEBUG", label: "🅱️ 调试" },
				{ key: "ALL", label: "全部" },
			],
		},
	],
});
