import { Console } from "@nsnanocat/util";

export default function modifyPegasusQueryContext(queryContext, Settings) {
    Console.log("☑️ modify PegasusQueryContext");
    const Locale = queryContext.locale;
    const [Language, CountryCode] = Locale?.split("_") ?? [];
    Console.info(`Locale: ${Locale}`, `Language: ${Language}`, `CountryCode: ${CountryCode}`);
    switch (Settings.CountryCode) {
        // biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
        case "AUTO":
            Settings.CountryCode = CountryCode;
        default:
            queryContext.countryCode = Settings.CountryCode;
            
            break;
    };
    switch (Settings.Region) {
        case "AUTO":
            break;
        default:
            queryContext.region = Settings.CountryCode;
            break;
    };
    switch (Settings.SiriLocale) {
        case "AUTO":
            break;
        default:
            queryContext.siriLocale = Settings.SiriLocale;
            break;
    };
    switch (Settings.SiriResponseLanguageVariant) {
        case "AUTO":
            break;
        default:
            queryContext.siriResponseLanguageVariant = Settings.SiriResponseLanguageVariant;
            break;
    };
    if (queryContext?.skuRegion === "CH") queryContext.skuRegion = "LL";
    Console.log("✅ modify PegasusQueryContext");
    return queryContext;
};
