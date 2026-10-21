import { Console, Lodash as _ } from "@nsnanocat/util";
import gRPC from "@nsnanocat/grpc";
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
			//body = M3U8.parse($response.body);
			//Console.debug(`body: ${JSON.stringify(body)}`);
			//$response.body = M3U8.stringify(body);
			break;
		case "text/xml":
		case "text/html":
		case "text/plist":
		case "application/xml":
		case "application/plist":
		case "application/x-plist":
			//body = XML.parse($response.body);
			//Console.debug(`body: ${JSON.stringify(body)}`);
			break;
		case "text/vtt":
		case "application/vtt":
			//body = VTT.parse($response.body);
			//Console.debug(`body: ${JSON.stringify(body)}`);
			//$response.body = VTT.stringify(body);
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
							//body.search_url = body?.search_url || "https:\/\/api-glb-apne1c.smoot.apple.com\/search";
							//body.feedback_url = body?.feedback_url || "https:\/\/fbs.smoot.apple.com\/fb";
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
										case "cameravisualsearch":
											if (Settings.Functions.includes("cameravisualsearch")) {
												_.set(Overrides, "cameravisualsearch.enabled", true);
												_.set(Overrides, ["cameravisualsearch", "supported_domains", "camera-live"], [...new Set([...(Overrides.cameravisualsearch?.supported_domains?.["camera-live"] ?? []), ...Configs.CameraVisualSearch.SupportedDomains["camera-live"]])]);
												_.set(Overrides, ["cameravisualsearch", "supported_domains", "screenshot-automatic"], [...new Set([...(Overrides.cameravisualsearch?.supported_domains?.["screenshot-automatic"] ?? []), ...Configs.CameraVisualSearch.SupportedDomains["screenshot-automatic"]])]);
											}
											_.set(Overrides, "cameravisualsearch.feedback_enabled", false);
											_.set(Overrides, "cameravisualsearch.experiments_custom_feedback_enabled", false);
											break;
										case "encryptedvisualsearch":
											if (Settings.Functions.includes("encryptedvisualsearch")) {
												_.set(Overrides, "encryptedvisualsearch.enabled", true);
												if (Settings.EncryptedVisualSearchURL) _.set(Overrides, "encryptedvisualsearch.search_url", Settings.EncryptedVisualSearchURL);
												_.set(Overrides, "encryptedvisualsearch.supported_usecases", Settings.EncryptedVisualSearchSupportedUsecases);
											}
											_.set(Overrides, "encryptedvisualsearch.feedback_enabled", false);
											_.set(Overrides, "encryptedvisualsearch.experiments_custom_feedback_enabled", false);
											break;
										case "flightutilities":
											if (Settings.Functions.includes("flightutilities")) {
												_.set(Overrides, "flightutilities.enabled", true);
												_.set(Overrides, "flightutilities.flight_url", Configs.FlightUtilities.FlightURL);
												_.set(Overrides, "flightutilities.fallback_flight_url", Configs.FlightUtilities.FallbackFlightURL);
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
											if (Settings.Functions.includes("messages")) {
												_.set(Overrides, "messages.enabled", true);
												if (typeof Settings.MessagesMinQueryLen === "number") _.set(Overrides, "messages.min_query_len", Settings.MessagesMinQueryLen);
												if (typeof Settings.MessagesSearchRenderTimeout === "number") _.set(Overrides, "messages.search_render_timeout", Settings.MessagesSearchRenderTimeout);
											}
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
												if (Settings.SiriSearchURL) _.set(Overrides, "siri.search_url", Settings.SiriSearchURL);
												if (Settings.SiriSAMSearchURL) body.sam_search_url = Settings.SiriSAMSearchURL;
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
											if (Settings.Functions.includes("visualintelligence")) {
												_.set(Overrides, "visualintelligence.enabled", true);
												_.set(Overrides, "visualintelligence.supported_domains", [...new Set([...(Overrides.visualintelligence?.supported_domains ?? []), ...Configs.VisualIntelligence.SupportedDomains])]);
											}
											_.set(Overrides, "visualintelligence.feedback_enabled", false);
											_.set(Overrides, "visualintelligence.experiments_custom_feedback_enabled", false);
											//_.set(Overrides, "visualintelligence.enabled_domains", [...new Set([...(Overrides.visualintelligence?.enabled_domains ?? []), ...Configs.VisualIntelligence.EnableDomains])]);
											break;
									}
								});
							// Safari Smart History
							body.safari_smart_history_enabled = Settings.SafariSmartHistory;
							body.smart_history_feature_feedback_enabled = false;
							/*
							if (body?.mescal_enabled) {
								body.mescal_enabled = true;
								body.mescal_version = 200;
								body.mescal_cert_url = "https://init.itunes.apple.com/WebObjects/MZInit.woa/wa/signSapSetupCert";
								body.mescal_setup_url = "https://play.itunes.apple.com/WebObjects/MZPlay.woa/wa/signSapSetup";
							}
							let smart_search_v2 = body?.smart_search_v2_parameters;
							if (smart_search_v2) {
								smart_search_v2.smart_history_score_v2_enabled = true;
								smart_search_v2.smart_history_score_v2_enable_count = true;
							};
							body.session_experiment_metadata_enabled = true;
							//body.sample_features = true;
							//body.use_ledbelly = true;
							*/
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
			//Console.debug(`$response.body: ${JSON.stringify($response.body)}`);
			let rawBody = $response.bodyBytes ? new Uint8Array($response.bodyBytes) : ($response.body ?? new Uint8Array());
			//Console.debug(`isBuffer? ${ArrayBuffer.isView(rawBody)}: ${JSON.stringify(rawBody)}`);
			switch (FORMAT) {
				case "application/protobuf":
				case "application/x-protobuf":
				case "application/vnd.google.protobuf":
					break;
				case "application/grpc":
				case "application/grpc+proto":
					rawBody = gRPC.decode(rawBody);
					// 解析链接并处理protobuf数据
					// 主机判断
					switch (url.hostname) {
						case "guzzoni.smoot.apple.com":
							// 路径判断
							switch (url.pathname) {
								case "/apple.parsec.siri.v2alpha.SiriSearch/SiriSearch": // Siri搜索
									/******************  initialization start  *******************/
									/******************  initialization finish  *******************/
									break;
							}
							break;
						default:
							// 路径判断
							switch (url.pathname) {
								case "/apple.parsec.spotlight.v1alpha.ZkwSuggestService/Suggest": // 新闻建议
									/******************  initialization start  *******************/
									/******************  initialization finish  *******************/
									break;
							}
							break;
					}
					rawBody = gRPC.encode(rawBody);
					break;
			}
			// 写入二进制数据
			$response.body = rawBody;
			break;
		}
	}
	return $response;
}
