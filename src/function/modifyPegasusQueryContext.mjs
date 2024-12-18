import { Console } from "@nsnanocat/util";

export default function modifyPegasusQueryContext(queryContext, Settings) {
	Console.log("☑️ modify PegasusQueryContext");
	const Locale = queryContext.locale;
	const [Language, CountryCode] = Locale?.split("_") ?? [];
	Console.info(`Locale: ${Locale}`, `Language: ${Language}`, `CountryCode: ${CountryCode}`);
	switch (Settings.CountryCode) {
		case "OFF":
		case undefined:
			break;
		case "AUTO":
			queryContext.CountryCode = CountryCode;
			break;
		default:
			queryContext.countryCode = Settings.CountryCode;
			break;
	}
	switch (Settings.Region) {
		case "OFF":
		case undefined:
			break;
		case "AUTO":
			queryContext.region = CountryCode;
			break;
		default:
			queryContext.region = Settings.Region;
			break;
	}
	switch (Settings.SiriLocale) {
		case "OFF":
		case undefined:
			break;
		case "AUTO":
			queryContext.siriLocale = `${Language?.split("-")[0]}_${CountryCode}`;
			break;
		default:
			queryContext.siriLocale = Settings.SiriLocale;
			break;
	}
	switch (Settings.SiriResponseLanguageVariant) {
		case "OFF":
		case undefined:
			break;
		case "AUTO":
			queryContext.siriResponseLanguageVariant = Locale;
			break;
		default:
			queryContext.siriResponseLanguageVariant = Settings.SiriResponseLanguageVariant;
			break;
	}
	if (queryContext?.skuRegion === "CH") queryContext.skuRegion = "LL";
	Console.log("✅ modify PegasusQueryContext");
	return queryContext;
}
