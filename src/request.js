import { $app, Console, done, Lodash as _ } from "@nsnanocat/util";
import database from "./function/database.mjs";
import setENV from "./function/setENV.mjs";
// 构造回复数据
// biome-ignore lint/style/useConst: <explanation>
let $response = undefined;
/***************** Processing *****************/
// 解构URL
const url = new URL($request.url);
Console.info(`url: ${url.toJSON()}`);
// 获取连接参数
const PATHs = url.pathname.split("/").filter(Boolean);
Console.info(`PATHs: ${PATHs}`);
// 解析格式
const FORMAT = ($request.headers?.["Content-Type"] ?? $request.headers?.["content-type"])?.split(";")?.[0];
Console.info(`FORMAT: ${FORMAT}`);
const PLATFORM = [];
switch (url.hostname) {
	case "api.smoot.apple.cn":
	case "api.smoot.apple.com":
	case "api2.smoot.apple.com":
	default:
		PLATFORM.push("Spotlight");
		break;
	case "guzzoni.smoot.apple.com":
	case "api-siri.smoot.apple.com":
		PLATFORM.push("Siri");
		break;
}
Console.info(`PLATFORM: ${PLATFORM}`);
(async () => {
	const { Settings, Caches, Configs } = setENV("iRingo", PLATFORM, database);
	Console.logLevel = Settings.LogLevel;
	// 创建空数据
	let Locale, Language, CountryCode;
	// biome-ignore lint/style/useConst: <explanation>
	let body = {};
	// 方法判断
	switch ($request.method) {
		case "POST":
		case "PUT":
		case "PATCH":
		// biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
		case "DELETE":
			// 格式判断
			switch (FORMAT) {
				case undefined: // 视为无body
					break;
				case "application/x-www-form-urlencoded":
				case "text/plain":
				default:
					break;
				case "application/x-mpegURL":
				case "application/x-mpegurl":
				case "application/vnd.apple.mpegurl":
				case "audio/mpegurl":
					break;
				case "text/xml":
				case "text/html":
				case "text/plist":
				case "application/xml":
				case "application/plist":
				case "application/x-plist":
					break;
				case "text/vtt":
				case "application/vtt":
					break;
				case "text/json":
				case "application/json":
					break;
				case "application/protobuf":
				case "application/x-protobuf":
				case "application/vnd.google.protobuf":
				case "application/grpc":
				case "application/grpc+proto":
				case "applecation/octet-stream": {
					// 路径判断
					switch (url.pathname) {
						case "/apple.parsec.siri.v2alpha.SiriSearch/SiriSearch": {
							// Siri搜索
							break;
						}
						case "/apple.parsec.spotlight.v1alpha.ZkwSuggestService/Suggest": {
							// 新闻建议
							break;
						}
					}
					break;
				}
			}
		//break; // 不中断，继续处理URL
		case "GET":
		case "HEAD":
		case "OPTIONS":
		default:
			Locale = Locale ?? url.searchParams.get("locale");
			[Language, CountryCode] = Locale?.split("_") ?? [];
			Console.info(`Locale: ${Locale}`, `Language: ${Language}`, `CountryCode: ${CountryCode}`);
			switch (Settings.CountryCode) {
				case "AUTO":
					Settings.CountryCode = CountryCode;
					break;
				default:
					if (url.searchParams.has("cc")) url.searchParams.set("cc", Settings.CountryCode);
					break;
			}
			// 主机判断
			switch (url.hostname) {
				case "api.smoot.apple.cn":
				case "api.smoot.apple.com":
				case "api2.smoot.apple.com":
				case "api-siri.smoot.apple.com":
				default: {
					// 其他主机
					const q = url.searchParams.get("q");
					// 路径判断
					switch (url.pathname) {
						case "/bag": // 配置
							break;
						case "/search": // 搜索
							switch (url.searchParams.get("qtype")) {
								case "zkw": // 处理"新闻"小组件
									switch (Settings.CountryCode) {
										case "CN":
										case "HK":
										case "MO":
										case "TW":
										case "SG":
											url.searchParams.set("locale", `${Language}_SG`);
											break;
										case "US":
										case "CA":
										case "UK":
										case "AU":
											// 不做修正
											break;
										default:
											url.searchParams.set("locale", `${Language}_US`);
											break;
									}
									break;
								default: // 其他搜索
									if (q?.startsWith?.("%E5%A4%A9%E6%B0%94%20")) {
										// 处理"天气"搜索，搜索词"天气 "开头
										Console.debug("'天气 '开头");
										url.searchParams.set("q", q.replace(/%E5%A4%A9%E6%B0%94/, "weather")); // "天气"替换为"weather"
										if (/^weather%20.*%E5%B8%82$/.test(q)) url.searchParams.set("q", q.replace(/$/, "%E5%B8%82"));
									} else if (q?.endsWith?.("%20%E5%A4%A9%E6%B0%94")) {
										// 处理"天气"搜索，搜索词" 天气"结尾
										Console.debug("' 天气'结尾");
										url.searchParams.set("q", q.replace(/%E5%A4%A9%E6%B0%94/, "weather")); // "天气"替换为"weather"
										if (/.*%E5%B8%82%20weather$/.test(q)) url.searchParams.set("q", q.replace(/%20weather$/, "%E5%B8%82%20weather"));
									}
									break;
							}
							break;
						case "/card": // 卡片
							switch (url.searchParams.get("include")) {
								case "tv":
								case "movies": {
									url.searchParams.set("card_locale", `${Language}_${Settings.CountryCode}`);
									const storefront = url.searchParams.get("storefront")?.match(/[\d]{6}/g);
									switch (
										storefront //StoreFront ID, from App Store Region
									) {
										case "143463": // HK
											url.searchParams.set("q", q.replace(/%2F[a-z]{2}-[A-Z]{2}/, "%2Fzh-HK"));
											break;
										case "143464": // SG
											url.searchParams.set("q", q.replace(/%2F[a-z]{2}-[A-Z]{2}/, "%2Fzh-SG"));
											break;
										case "143465": // CN
											url.searchParams.set("q", q.replace(/%2F[a-z]{2}-[A-Z]{2}/, "%2Fzh-HK"));
											break;
										case "143470": // TW
											url.searchParams.set("q", q.replace(/%2F[a-z]{2}-[A-Z]{2}/, "%2Fzh-TW"));
											break;
									}
									break;
								}
								case "apps":
								case "music":
									url.searchParams.set("card_locale", `${Language}_${Settings.CountryCode}`);
									break;
								case "dictionary":
									switch (Language) {
										case "zh-Hans":
										case "zh-Hant":
											url.searchParams.set("card_locale", `en_${Settings.CountryCode}`);
											break;
									}
									break;
								default:
									url.searchParams.set("card_locale", `${Language}_${Settings.CountryCode}`);
									break;
							}
							break;
						case "/warm":
							break;
						case "/render":
							break;
						case "/flight": // 航班
							break;
					}
					break;
				}
				case "guzzoni.smoot.apple.com":
					break;
				case "fbs.smoot.apple.com":
					break;
				case "cdn.smoot.apple.com":
					break;
			}
			break;
		case "CONNECT":
		case "TRACE":
			break;
	}
	$request.url = url.toString();
	Console.debug(`$request.url: ${$request.url}`);
})()
	.catch(e => Console.error(e))
	.finally(() => {
		switch (typeof $response) {
			case "object": // 有构造回复数据，返回构造的回复数据
				//Console.debug("finally", `echo $response: ${JSON.stringify($response, null, 2)}`);
				if ($response.headers?.["Content-Encoding"]) $response.headers["Content-Encoding"] = "identity";
				if ($response.headers?.["content-encoding"]) $response.headers["content-encoding"] = "identity";
				switch ($app) {
					default:
						done({ response: $response });
						break;
					case "Quantumult X":
						if (!$response.status) $response.status = "HTTP/1.1 200 OK";
						delete $response.headers?.["Content-Length"];
						delete $response.headers?.["content-length"];
						delete $response.headers?.["Transfer-Encoding"];
						done($response);
						break;
				}
				break;
			case "undefined": // 无构造回复数据，发送修改的请求数据
				//Console.debug("finally", `$request: ${JSON.stringify($request, null, 2)}`);
				done($request);
				break;
			default:
				Console.error(`不合法的 $response 类型: ${typeof $response}`);
				break;
		}
	});
