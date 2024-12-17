import { Console } from "@nsnanocat/util";

export default function modifyPegasusQueryContext(queryContext, Settings) {
	Console.log("☑️ modify PegasusQueryContext");
	const Locale = queryContext.locale;
	const [Language, CountryCode] = Locale?.split("_") ?? [];
	Console.info(`Locale: ${Locale}`, `Language: ${Language}`, `CountryCode: ${CountryCode}`);
	switch (Settings.CountryCode) {
		case "AUTO":
			queryContext.CountryCode = CountryCode;
			break;
		default:
			queryContext.countryCode = Settings.CountryCode;
			break;
	}
	switch (Settings.Region) {
		case "AUTO":
			queryContext.region = CountryCode;
			break;
		default:
			queryContext.region = Settings.Region;
			break;
	}
	switch (Settings.SiriLocale) {
		case "AUTO":
			queryContext.siriLocale = Locale;
			break;
		default:
			queryContext.siriLocale = Settings.SiriLocale;
			break;
	}
	switch (Settings.SiriResponseLanguageVariant) {
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
