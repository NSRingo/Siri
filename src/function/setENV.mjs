import { Console, getStorage, Lodash as _ } from "@nsnanocat/util";

/**
 * Set Environment Variables
 * @author VirgilClyne
 * @param {String} name - Persistent Store Key
 * @param {Array} platforms - Platform Names
 * @param {Object} database - Default DataBase
 * @return {Object} { Settings, Caches, Configs }
 */
export default function setENV(name, platforms, database) {
	Console.log("☑️ Set Environment Variables");
	const { Settings, Caches, Configs } = getStorage(name, platforms, database);
	/***************** Settings *****************/
	switch (platforms.toString()) {
		case "Siri":
			break;
		case "Spotlight":
			if (!Array.isArray(Settings?.Domains)) _.set(Settings, "Domains", Settings?.Domains ? [Settings.Domains.toString()] : []);
			if (!Array.isArray(Settings?.Functions)) _.set(Settings, "Functions", Settings?.Functions ? [Settings.Functions.toString()] : []);
			break;
	}
	Console.info(`typeof Settings: ${typeof Settings}`, `Settings: ${JSON.stringify(Settings, null, 2)}`);
	/***************** Caches *****************/
	//Console.log(`typeof Caches: ${typeof Caches}`, `Caches: ${JSON.stringify(Caches)}`);
	/***************** Configs *****************/
	//Configs.Storefront = new Map(Configs.Storefront);
	if (Configs.Locale) Configs.Locale = new Map(Configs.Locale);
	if (Configs.i18n) for (const type in Configs.i18n) Configs.i18n[type] = new Map(Configs.i18n[type]);
	Console.log("✅ Set Environment Variables");
	return { Settings, Caches, Configs };
}
