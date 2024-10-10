import { $platform, URL, _, Storage, fetch, notification, log, logError, wait, done, getScript, runScript } from "./utils/utils.mjs";
import GRPC from "./utils/GRPC.mjs";
import database from "./function/database.mjs";
import setENV from "./function/setENV.mjs";
import modifyPegasusQueryContext from "./function/modifyPegasusQueryContext.mjs";
import { MESSAGE_TYPE, reflectionMergePartial, BinaryReader, WireType, UnknownFieldHandler, isJsonObject, typeofJsonValue, jsonWriteOptions, MessageType } from "@protobuf-ts/runtime";
import { SiriPegasusRequest } from "./proto/apple/parsec/siri/v2alpha/SiriPegasusRequest";
import { LookupSearchRequest } from "./proto/apple/parsec/lookup/v1alpha/LookupSearchRequest";
import { VisualSearchRequest } from "./proto/apple/parsec/visualsearch/v2/VisualSearchRequest";
import { PegasusQueryContext } from "./proto/apple/parsec/search/PegasusQueryContext";
// 构造回复数据
let $response = undefined;
/***************** Processing *****************/
// 解构URL
const url = new URL($request.url);
log(`⚠ url: ${url.toJSON()}`, "");
// 获取连接参数
const METHOD = $request.method, HOST = url.hostname, PATH = url.pathname, PATHs = url.pathname.split("/").filter(Boolean);
log(`⚠ METHOD: ${METHOD}, HOST: ${HOST}, PATH: ${PATH}`, "");
// 解析格式
const FORMAT = ($request.headers?.["Content-Type"] ?? $request.headers?.["content-type"])?.split(";")?.[0];
log(`⚠ FORMAT: ${FORMAT}`, "");
!(async () => {
	const { Settings, Caches, Configs } = setENV("iRingo", "Siri", database);
	log(`⚠ Settings.Switch: ${Settings?.Switch}`, "");
	switch (Settings.Switch) {
		case true:
		default:
			// 创建空数据
			let Locale, Language, CountryCode;
			let body = {};
			// 方法判断
			switch (METHOD) {
				case "POST":
				case "PUT":
				case "PATCH":
				case "DELETE":
					// 格式判断
					switch (FORMAT) {
						case undefined: // 视为无body
							break;
						case "application/x-www-form-urlencoded":
						case "text/plain":
						default:
							//log(`🚧 body: ${body}`, "");
							break;
						case "application/x-mpegURL":
						case "application/x-mpegurl":
						case "application/vnd.apple.mpegurl":
						case "audio/mpegurl":
							//body = M3U8.parse($request.body);
							//log(`🚧 body: ${JSON.stringify(body)}`, "");
							//$request.body = M3U8.stringify(body);
							break;
						case "text/xml":
						case "text/html":
						case "text/plist":
						case "application/xml":
						case "application/plist":
						case "application/x-plist":
							//body = XML.parse($request.body);
							//log(`🚧 body: ${JSON.stringify(body)}`, "");
							//$request.body = XML.stringify(body);
							break;
						case "text/vtt":
						case "application/vtt":
							//body = VTT.parse($request.body);
							//log(`🚧 body: ${JSON.stringify(body)}`, "");
							//$request.body = VTT.stringify(body);
							break;
						case "text/json":
						case "application/json":
							//body = JSON.parse($request.body ?? "{}");
							//log(`🚧 body: ${JSON.stringify(body)}`, "");
							//$request.body = JSON.stringify(body);
							break;
						case "application/protobuf":
						case "application/x-protobuf":
						case "application/vnd.google.protobuf":
						case "application/grpc":
						case "application/grpc+proto":
						case "applecation/octet-stream":
							//log(`🚧 $request.body: ${JSON.stringify($request.body)}`, "");
							let rawBody = ($platform === "Quantumult X") ? new Uint8Array($request.bodyBytes ?? []) : $request.body ?? new Uint8Array();
							//log(`🚧 isBuffer? ${ArrayBuffer.isView(rawBody)}: ${JSON.stringify(rawBody)}`, "");
							switch (FORMAT) {
								case "application/protobuf":
								case "application/x-protobuf":
								case "application/vnd.google.protobuf":
									break;
								case "application/grpc":
								case "application/grpc+proto":
									rawBody = GRPC.decode(rawBody);
									// 解析链接并处理protobuf数据
									// 主机判断
									switch (HOST) {
										case "guzzoni.smoot.apple.com":
										case "api-siri.smoot.apple.com":
										case "api2.smoot.apple.com":
										default:
											//$request.headers["content-type"] = "application/grpc+proto";
											if ($request.headers["user-agent"]?.includes("grpc-node-js")) $request.headers["user-agent"] = "PegasusKit/1 (iPhone14,3; iPhone OS 18.1 22B5054e) siri/1";
											// 路径判断
											switch (PATH) {
												case "/apple.parsec.siri.v2alpha.SiriSearch/SiriSearch": // Siri搜索
													body = SiriPegasusRequest.fromBinary(rawBody);
													log(`🚧 body: ${JSON.stringify(body)}`, "");
													body.queryContext = modifyPegasusQueryContext(body.queryContext, Settings);
													let fixLocation = true;
													const utterance = body?.queries?.[0]?.utterance ?? "";
													switch (true) {
														case utterance.includes("什么是") || utterance.includes("是什么") || utterance.includes(" what's ") || utterance.includes(" what is ") || utterance.includes(" what does ") || utterance.includes(" what do "):
														case utterance.includes("怎么样") || utterance.includes("怎样") || utterance.includes("如何") || utterance.includes(" how's ") || utterance.includes(" how is ") || utterance.includes(" how does ") || utterance.includes(" how do "):
														case utterance.includes("为什么") || utterance.includes(" why ") || utterance.includes(" why is ") || utterance.includes(" why does "):
														case utterance.includes("搜索") || utterance.includes(" search "):
														case utterance.includes(" mean ") || utterance.includes(" explain ") || utterance.includes(" look up ") || utterance.includes(" translate") || (utterance.includes(" in ") && !utterance.includes(" here")) || utterance.includes(" web ") || utterance.includes(" internet ") || utterance.includes(" define ") || utterance.includes(" wikipedia ") || utterance.includes("解释") || utterance.includes("翻译") || utterance.includes("怎么说") || utterance.includes("意思"):
															fixLocation = true;
															break;
														case utterance.includes("何时") || utterance.includes("几时") || utterance.includes(" when "):
														case utterance.includes("什么时") || utterance.includes("几点") || utterance.includes(" what time "):
														case utterance.includes("哪里") || utterance.includes("哪儿") || utterance.includes("何处") || utterance.includes(" where "):
														case utterance.includes("哪个") || utterance.includes("哪一个") || utterance.includes(" which "):
															fixLocation = false;
															break;
														case utterance.includes("气压") || utterance.includes(" air pressure ") || utterance.includes(" barometric pressure ") || utterance.includes(" atmospheric pressure ") || utterance.includes(" atmosphere pressure "):
														case utterance.includes("湿度") || utterance.includes(" humidity "):
														case utterance.includes("温度") || utterance.includes(" temperature "):
														case utterance.includes("风速") || utterance.includes(" wind speed "):
														case utterance.includes("风向") || utterance.includes(" wind direction "):
														case utterance.includes("空气质量") || utterance.includes(" air quality "):
														case utterance.includes("月相") || utterance.includes(" moon phase "):
														case utterance.includes("紫外线") || utterance.includes(" uv index ") || utterance.includes("ultraviolet index outside"):
														case utterance.includes("能见度") || utterance.includes(" visibility "):
														case utterance.includes("日出") || utterance.includes(" sunrise "):
														case utterance.includes("日落") || utterance.includes(" sunset "):
														case (utterance.includes("sun ") && (utterance.includes("rise") || utterance.includes("set") || utterance.includes("fall"))) || utterance.includes("sunrise") || utterance.includes("sunset"):
														case (utterance.includes("太阳") && (utterance.includes("升") || utterance.includes("落") || utterance.includes("下山"))) || utterance.includes("日出") || utterance.includes("日落"):
														case (utterance.includes(" is ") || utterance.includes(" it ")) && (utterance.includes("rain") || utterance.includes("shin") || utterance.includes("sunny") || utterance.includes("hot") || utterance.includes("cold") || utterance.includes("freeze") || utterance.includes("warm") || utterance.includes("wind") || utterance.includes("fog") || utterance.includes("haz") || utterance.includes("thunder") || utterance.includes("storm") || utterance.includes("lightn") || utterance.includes("snow") || utterance.includes("hail") || utterance.includes("clear") || utterance.includes("tornado") || utterance.includes("hurricane")):
														case (utterance.includes("有") || utterance.includes("会") || utterance.includes("吗")) && (utterance.includes("下雨") || utterance.includes("晒") || utterance.includes("晴") || utterance.includes("热") || utterance.includes("冷") || utterance.includes("暖") || utterance.includes("风") || utterance.includes("雾") || utterance.includes("霾") || utterance.includes("雷") || utterance.includes("风暴") || utterance.includes("电") || utterance.includes("雪") || utterance.includes("雹")):
														case utterance.includes(" precipitation ") || utterance.includes(" forecast ") || ((utterance.includes(" chance ") || utterance.includes(" possibilit")) && utterance.includes(" rain ")):
														case utterance.includes("降雪") || utterance.includes("降水") || utterance.includes("预报") || ((utterance.includes("概率") || utterance.includes("几率")) && (utterance.includes("降水") || utterance.includes("降雪"))):
															fixLocation = false;
															break;
														case utterance.includes("附近") || utterance.includes(" nearby "):
														case utterance.includes("周围") || utterance.includes(" around me ") || utterance.includes(" around here "):
														case utterance.includes("导航") || utterance.includes(" navigation to "):
														case utterance.includes("方向") || utterance.includes(" direction "):
														case utterance.includes("指引") || (utterance.includes(" direct ") && utterance.includes(" to ")):
														case utterance.includes("指引") || (utterance.includes(" guide ") && utterance.includes(" to ")):
														case utterance.includes("带我去") || (utterance.includes(" take ") && utterance.includes(" to ")):
														case utterance.includes("路线") || utterance.includes(" route "):
														case utterance.includes("路径") || utterance.includes(" path to "):
														case (utterance.includes("怎样") || utterance.includes("如何")) && (utterance.includes("到") || utterance.includes("去") || utterance.includes("抵达")):
														case utterance.includes(" how ") && (utterance.includes(" get ") || utterance.includes(" go ") || utterance.includes(" arrive ") || utterance.includes(" reach ")):
															fixLocation = false;
															break;
													};
													body?.queries?.[0]?.profileSlices.forEach((profileSlice, index) => {
														switch (profileSlice?.values?.[0]?.value?.typeUrl) {
															case "type.googleapis.com/apple.parsec.siri.v2alpha.AppInfo":
																/******************  initialization start  *******************/
																class ApplicationInfomationRequest$Type extends MessageType {
																	constructor() {
																		super("ApplicationInfomationRequest", [
																			{ no: 2, name: "bundleID", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
																			{ no: 4, name: "launchIntent", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
																		]);
																	}
																}
																const ApplicationInfomationRequest = new ApplicationInfomationRequest$Type();
																/******************  initialization finish  *******************/
																const AppInfo = ApplicationInfomationRequest.fromBinary(profileSlice?.values?.[0]?.value?.value);
																log(`🚧 AppInfo: ${JSON.stringify(AppInfo)}`, "");
																switch (AppInfo?.bundleID) {
																	case "com.apple.weather":
																	case "com.heweather.weatherapp":
																		fixLocation = false;
																		break;
																	case "com.apple.store.Jolly":
																		fixLocation = false;
																		break;
																	case "com.apple.Music":
																	case "com.apple.AppStore":
																		fixLocation = false;
																		break;
																	default:
																		break;
																};
																break;
															case "type.googleapis.com/apple.parsec.siri.v2alpha.SiriKitAppInfo":
																break;
															case "type.googleapis.com/apple.parsec.siri.v2alpha.AmpUserState":
																break;
															case "type.googleapis.com/apple.parsec.siri.v2alpha.AudioQueueStateInfo":
																break;
														};
													});
													if (fixLocation) delete body?.queryContext?.location;
													log(`🚧 body: ${JSON.stringify(body)}`, "");
													rawBody = SiriPegasusRequest.toBinary(body);
													break;
												case "/apple.parsec.lookup.v1alpha.LookupSearch/LookupSearch": // 查询搜索
													body = LookupSearchRequest.fromBinary(rawBody);
													log(`🚧 body: ${JSON.stringify(body)}`, "");
													body.queryContext = modifyPegasusQueryContext(body.queryContext, Settings);
													log(`🚧 body: ${JSON.stringify(body)}`, "");
													rawBody = LookupSearchRequest.toBinary(body);
													break;
												case "/apple.parsec.visualsearch.v2.VisualSearch/VisualSearch": { // 视觉搜索
													body = VisualSearchRequest.fromBinary(rawBody);
													log(`🚧 body: ${JSON.stringify(body)}`, "");
													body.queryContext = modifyPegasusQueryContext(body.queryContext, Settings);
													log(`🚧 body: ${JSON.stringify(body)}`, "");
													rawBody = VisualSearchRequest.toBinary(body);
													break;
												};
												case "/apple.parsec.responseframework.engagement.v1alpha.EngagementSearch/EngagementSearch": //
													/******************  initialization start  *******************/
													class EngagementRequest$Type extends MessageType {
														constructor() {
															super("EngagementRequest", [
																{ no: 1, name: "queryContext", kind: "message", T: () => PegasusQueryContext }
															]);
														}
													}
													const EngagementRequest = new EngagementRequest$Type();
													/******************  initialization finish  *******************/
													body = EngagementRequest.fromBinary(rawBody);
													log(`🚧 body: ${JSON.stringify(body)}`, "");
													body.queryContext = modifyPegasusQueryContext(body.queryContext, Settings);
													log(`🚧 body: ${JSON.stringify(body)}`, "");
													rawBody = EngagementRequest.toBinary(body);
													break;
												case "/apple.parsec.spotlight.v1alpha.ZkwSuggestService/Suggest": // 新闻建议
													/******************  initialization start  *******************/
													class ZkwSuggestRequest$Type extends MessageType {
														constructor() {
															super("ZkwSuggestRequest", [
																//{ no: 1, name: "queries", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Query },
																{ no: 2, name: "queryContext", kind: "message", T: () => PegasusQueryContext }
															]);
														}
													}
													const ZkwSuggestRequest = new ZkwSuggestRequest$Type();
													/******************  initialization finish  *******************/
													body = ZkwSuggestRequest.fromBinary(rawBody);
													log(`🚧 body: ${JSON.stringify(body)}`, "");
													body.queryContext = modifyPegasusQueryContext(body.queryContext, Settings);
													log(`🚧 body: ${JSON.stringify(body)}`, "");
													rawBody = ZkwSuggestRequest.toBinary(body);
													break;
											};
											break;
									};
									rawBody = GRPC.encode(rawBody);
									break;
							};
							// 写入二进制数据
							$request.body = rawBody;
							break;
					};
					//break; // 不中断，继续处理URL
				case "GET":
				case "HEAD":
				case "OPTIONS":
				default:
					Locale = Locale ?? url.searchParams.get("locale");
					[Language, CountryCode] = Locale?.split("_") ?? [];
					log(`🚧 Locale: ${Locale}, Language: ${Language}, CountryCode: ${CountryCode}`, "");
					switch (Settings.CountryCode) {
						case "AUTO":
							Settings.CountryCode = CountryCode;
							break;
						default:
							if (url.searchParams.has("cc")) url.searchParams.set("cc", Settings.CountryCode);
							break;
					};
					// 主机判断
					switch (HOST) {
						case "api.smoot.apple.cn":
						case "api.smoot.apple.com":
						case "api2.smoot.apple.com":
						case "api-siri.smoot.apple.com":
						default: // 其他主机
							let q = url.searchParams.get("q");
							// 路径判断
							switch (PATH) {
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
											};
											break;
										default: // 其他搜索
											if (q?.startsWith?.("%E5%A4%A9%E6%B0%94%20")) { // 处理"天气"搜索，搜索词"天气 "开头
												console.log("'天气 '开头");
												url.searchParams.set("q", q.replace(/%E5%A4%A9%E6%B0%94/, "weather")); // "天气"替换为"weather"
												if (/^weather%20.*%E5%B8%82$/.test(q)) url.searchParams.set("q", q.replace(/$/, "%E5%B8%82"));
											} else if (q?.endsWith?.("%20%E5%A4%A9%E6%B0%94")) {// 处理"天气"搜索，搜索词" 天气"结尾
												console.log("' 天气'结尾");
												url.searchParams.set("q", q.replace(/%E5%A4%A9%E6%B0%94/, "weather")); // "天气"替换为"weather"
												if (/.*%E5%B8%82%20weather$/.test(q)) url.searchParams.set("q", q.replace(/%20weather$/, "%E5%B8%82%20weather"));
											};
											break;
									};
									break;
								case "/card": // 卡片
									switch (url.searchParams.get("include")) {
										case "tv":
										case "movies":
											url.searchParams.set("card_locale", `${Language}_${Settings.CountryCode}`);
											const storefront = url.searchParams.get("storefront")?.match(/[\d]{6}/g);
											switch (storefront) { //StoreFront ID, from App Store Region
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
											};
											break;
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
											};
											break;
										default:
											url.searchParams.set("card_locale", `${Language}_${Settings.CountryCode}`);
											break;
									};
									break;
								case "/warm":
									break;
								case "/render":
									break;
								case "/flight": // 航班
									break;
							};
							break;
						case "guzzoni.smoot.apple.com":
							break;
						case "fbs.smoot.apple.com":
							break;
						case "cdn.smoot.apple.com":
							break;
					};
					break;
				case "CONNECT":
				case "TRACE":
					break;
			};
			$request.url = url.toString();
			log(`🚧 调试信息`, `$request.url: ${$request.url}`, "");
			break;
		case false:
			break;
	};
})()
	.catch((e) => logError(e))
	.finally(() => {
		switch ($response) {
			default: // 有构造回复数据，返回构造的回复数据
				//log(`🚧 finally`, `echo $response: ${JSON.stringify($response, null, 2)}`, "");
				if ($response.headers?.["Content-Encoding"]) $response.headers["Content-Encoding"] = "identity";
				if ($response.headers?.["content-encoding"]) $response.headers["content-encoding"] = "identity";
				switch ($platform) {
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
				};
				break;
			case undefined: // 无构造回复数据，发送修改的请求数据
				//log(`🚧 finally`, `$request: ${JSON.stringify($request, null, 2)}`, "");
				done($request);
				break;
		};
	})
