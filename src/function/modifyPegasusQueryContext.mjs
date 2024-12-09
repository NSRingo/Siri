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
        //break;
        default:
            queryContext.countryCode = Settings.CountryCode;
            queryContext.region = Settings.CountryCode;
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
    //delete queryContext?.location;
    Console.log("✅ modify PegasusQueryContext");
    return queryContext;
};
