import { Console, Lodash as _ } from "@nsnanocat/util";
import database from "../function/database.mjs";
import setENV from "../function/setENV.mjs";
/***************** Processing *****************/
export async function Response($request, $response) {
	// 解构URL
	const url = new URL($request.url);
	Console.info(`url: ${url.toJSON()}`);
	// 获取连接参数
	const PATHs = url.pathname.split("/").filter(Boolean);
	Console.info(`PATHs: ${PATHs}`);
	// 解析格式
	const FORMAT = ($response.headers?.["Content-Type"] ?? $response.headers?.["content-type"])?.split(";")?.[0];
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
	const { Settings, Caches, Configs } = setENV("iRingo", PLATFORM, database);
	Console.logLevel = Settings.LogLevel;
	// 创建空数据
	let body = {};
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
			body = JSON.parse($response.body ?? "{}");
			// 主机判断
			switch (url.hostname) {
				case "api.smoot.apple.com":
				case "api.smoot.apple.cn":
					// 路径判断
					switch (url.pathname) {
						case "/bag": {
							// 配置
							body.enabled = Settings.Enabled;
							body.feedback_enabled = false;
							/*
							if (body?.enabled_domains) {
								body.enabled_domains = [...new Set([...(body?.enabled_domains ?? []), ...Settings.Domains])];
								Console.info("领域列表", `enabled_domains: ${JSON.stringify(body.enabled_domains)}`);
							}
							if (body?.scene_aware_lookup_enabled_domains) {
								body.scene_aware_lookup_enabled_domains = [...new Set([...(body?.scene_aware_lookup_enabled_domains ?? []), ...Settings.Domains])];
								Console.info("领域列表", `scene_aware_lookup_enabled_domains: ${JSON.stringify(body.scene_aware_lookup_enabled_domains)}`);
							}
							body.min_query_len = 3;
							*/
							const Overrides = body?.overrides;
							if (Overrides)
								[...new Set([...Object.keys(Overrides), ...Settings.Functions])].forEach(func => {
									Console.info("覆盖列表", `Function: ${func}`);
									//_.set(Overrides, `${func}.enabled`, true);
									//_.set(Overrides, `${func}.feedback_enabled`, true);
									switch (func) {
										case "encryptedvisualsearch":
											if (Settings.Functions.includes("encryptedvisualsearch")) {
												_.set(Overrides, "encryptedvisualsearch.enabled", true);
												_.set(Overrides, "encryptedvisualsearch.search_url", "https://gateway-oblivious.apple.com/encryptedvisualsearch");
												_.set(Overrides, "encryptedvisualsearch.supported_usecases", ["VISUAL_LOOKUP_LANDMARK", "VISUAL_LOOKUP_STOREFRONT", "ENCRYPTED_PQA_GEO", "ENCRYPTED_GENMOJI"]);
											}
											_.set(Overrides, "encryptedvisualsearch.feedback_enabled", false);
											_.set(Overrides, "encryptedvisualsearch.experiments_custom_feedback_enabled", false);
											break;
										case "flightutilities":
											if (Settings.Functions.includes("flightutilities")) {
												_.set(Overrides, "flightutilities.enabled", true);
												_.set(Overrides, "flightutilities.flight_url", "https://api2.smoot.apple.com/flight");
												_.set(Overrides, "flightutilities.fallback_flight_url", "https://api2.smoot.apple.com/flight");
												delete body.flight_url;
												delete body.fallback_flight_url;
											}
											_.set(Overrides, "flightutilities.feedback_enabled", false);
											_.set(Overrides, "flightutilities.experiments_custom_feedback_enabled", false);
											//_.set(Overrides, "flightutilities.flight_url",  "https:\/\/api-glb-aps1b.smoot.apple.com\/flight");
											//_.set(Overrides, "flightutilities.fallback_flight_url", "https:\/\/api-glb-apse1c.smoot.apple.com\/flight");
											break;
										case "lookup":
											if (Settings.Functions.includes("lookup")) _.set(Overrides, "lookup.enabled", true);
											_.set(Overrides, "lookup.feedback_enabled", false);
											_.set(Overrides, "lookup.experiments_custom_feedback_enabled", false);
											//_.set(Overrides, "lookup.min_query_len", 2);
											//_.set(Overrides, "lookup.search_render_timeout", 2000);
											break;
										case "mail":
											if (Settings.Functions.includes("mail")) _.set(Overrides, "mail.enabled", true);
											_.set(Overrides, "mail.feedback_enabled", false);
											_.set(Overrides, "mail.experiments_custom_feedback_enabled", false);
											break;
										case "messages":
											if (Settings.Functions.includes("messages")) _.set(Overrides, "messages.enabled", true);
											_.set(Overrides, "messages.feedback_enabled", false);
											_.set(Overrides, "messages.experiments_custom_feedback_enabled", false);
											break;
										case "news":
											if (Settings.Functions.includes("news")) _.set(Overrides, "news.enabled", true);
											_.set(Overrides, "news.feedback_enabled", false);
											_.set(Overrides, "news.experiments_custom_feedback_enabled", false);
											break;
										case "safari":
											if (Settings.Functions.includes("safari")) _.set(Overrides, "safari.enabled", true);
											_.set(Overrides, "safari.feedback_enabled", false);
											_.set(Overrides, "safari.experiments_custom_feedback_enabled", false);
											break;
										case "siri":
											if (Settings.Functions.includes("siri")) {
												_.set(Overrides, "siri.enabled", true);
												_.set(Overrides, "siri.search_url", "https://guzzoni.smoot.apple.com/search");
												body.sam_search_url = "https://api-siri-prod.apple.com";
											}
											_.set(Overrides, "siri.feedback_enabled", false);
											_.set(Overrides, "siri.experiments_custom_feedback_enabled", false);
											break;
										case "spotlight":
											if (Settings.Functions.includes("spotlight")) _.set(Overrides, "spotlight.enabled", true);
											_.set(Overrides, "spotlight.feedback_enabled", false);
											//_.set(Overrides, "spotlight.use_twolayer_ranking", true);
											_.set(Overrides, "spotlight.experiments_custom_feedback_enabled", false);
											//_.set(Overrides, "spotlight.min_query_len", 2);
											//_.set(Overrides, "spotlight.collect_scores", true);
											//_.set(Overrides, "spotlight.collect_anonymous_metadata", true);
											break;
										case "visualintelligence":
											if (Settings.Functions.includes("visualintelligence")) _.set(Overrides, "visualintelligence.enabled", true);
											_.set(Overrides, "visualintelligence.feedback_enabled", false);
											_.set(Overrides, "visualintelligence.experiments_custom_feedback_enabled", false);
											//_.set(Overrides, "visualintelligence.enabled_domains", [...new Set([...(Overrides.visualIntelligence?.enabled_domains ?? []), ...Configs.VisualIntelligence.EnableDomains])]);
											//_.set(Overrides, "visualintelligence.supported_domains", [...new Set([...(Overrides.visualIntelligence?.supported_domains ?? []), ...Configs.VisualIntelligence.SupportedDomains])]);
											break;
									}
								});
							// Safari Smart History
							body.safari_smart_history_enabled = Settings.SafariSmartHistory;
							body.smart_history_feature_feedback_enabled = false;
							break;
						}
					}
					break;
				case "fbs.smoot.apple.com":
					break;
				case "cdn.smoot.apple.com":
					break;
				default: // 其他主机
					// 路径判断
					switch (url.pathname) {
						case "/warm":
						case "/render":
						case "/flight": // 航班
							break;
						case "/search": // 搜索
							break;
						case "/card": // 卡片
							break;
					}
					break;
			}
			$response.body = JSON.stringify(body);
			break;
		case "application/protobuf":
		case "application/x-protobuf":
		case "application/vnd.google.protobuf":
		case "application/grpc":
		case "application/grpc+proto":
		case "application/octet-stream": {
			let rawBody = $response.bodyBytes ? new Uint8Array($response.bodyBytes) : ($response.body ?? new Uint8Array());
			$response.body = rawBody;
			break;
		}
	}
	return $response;
}
