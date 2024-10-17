export default function modifyPegasusQueryContext(queryContext, Settings) {
    console.log(`☑️ modify PegasusQueryContext`, "");
    const Locale = queryContext.locale;
    const [Language, CountryCode] = Locale?.split("_") ?? [];
    console.log(`🚧 Locale: ${Locale}, Language: ${Language}, CountryCode: ${CountryCode}`);
    switch (Settings.CountryCode) {
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
    console.log(`✅ modify PegasusQueryContext`, "");
    return queryContext;
};
