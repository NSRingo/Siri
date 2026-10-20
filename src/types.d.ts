export interface Settings {
    /**
     * 国家或地区代码
     *
     * 不同国家或地区提供的内容或有差别，此选项同时会影响分配给您不同地区的 Siri 服务器。
     *
     * @remarks
     *
     * Possible values:
     * - `'OFF'` - 🔴 关闭（不修改）
     * - `'AUTO'` - 🇺🇳 自动（跟随系统地区设置）
     * - `'CN'` - 🇨🇳 中国大陆
     * - `'HK'` - 🇭🇰 中国香港
     * - `'TW'` - 🇹🇼 中国台湾
     * - `'SG'` - 🇸🇬 新加坡
     * - `'US'` - 🇺🇸 美国
     * - `'JP'` - 🇯🇵 日本
     * - `'AU'` - 🇦🇺 澳大利亚
     * - `'GB'` - 🇬🇧 英国
     * - `'KR'` - 🇰🇷 韩国
     * - `'CA'` - 🇨🇦 加拿大
     * - `'IE'` - 🇮🇪 爱尔兰
     *
     * @defaultValue "US"
     */
    CountryCode?: 'OFF' | 'AUTO' | 'CN' | 'HK' | 'TW' | 'SG' | 'US' | 'JP' | 'AU' | 'GB' | 'KR' | 'CA' | 'IE';
    /**
     * Siri 区域
     *
     * 忽略系统中“Siri”的“语言”设置，强制采用这里的设置。
     *
     * @remarks
     *
     * Possible values:
     * - `'OFF'` - 🔴 关闭（不修改）
     * - `'AUTO'` - 🇺🇳 自动 (跟随“Siri”的“语言”设置)
     * - `'zh_CN'` - 🇨🇳 中文 (普通话 - 中国大陆)
     * - `'zh_TW'` - 🇹🇼 中文 (普通话 - 台湾)
     * - `'yue_CN'` - 🇨🇳 中文 (粤语 - 中国大陆)
     * - `'zh_HK'` - 🇭🇰 中文 (粤语 - 香港)
     * - `'ja_JP'` - 🇯🇵 日语
     * - `'en_CA'` - 🇨🇦 英语 (加拿大)
     * - `'en_SG'` - 🇸🇬 英语 (新加坡)
     * - `'en_AU'` - 🇦🇺 英语 (澳大利亚)
     * - `'en_IE'` - 🇮🇪 英语 (爱尔兰)
     * - `'en_US'` - 🇺🇸 英语 (美国)
     * - `'en_GB'` - 🇬🇧 英语 (英国)
     * - `'ko_KR'` - 🇰🇷 韩语
     *
     * @defaultValue "zh_CN"
     */
    SiriLocale?: 'OFF' | 'AUTO' | 'zh_CN' | 'zh_TW' | 'yue_CN' | 'zh_HK' | 'ja_JP' | 'en_CA' | 'en_SG' | 'en_AU' | 'en_IE' | 'en_US' | 'en_GB' | 'ko_KR';
    /**
     * 区域
     *
     * 作用未知，待测试。
     *
     * @remarks
     *
     * Possible values:
     * - `'OFF'` - 🔴 关闭（不修改）
     * - `'AUTO'` - 🇺🇳 自动（跟随系统地区设置）
     * - `'CN'` - 🇨🇳 中国大陆
     * - `'HK'` - 🇭🇰 中国香港
     * - `'TW'` - 🇹🇼 中国台湾
     * - `'SG'` - 🇸🇬 新加坡
     * - `'US'` - 🇺🇸 美国
     * - `'JP'` - 🇯🇵 日本
     * - `'AU'` - 🇦🇺 澳大利亚
     * - `'GB'` - 🇬🇧 英国
     * - `'KR'` - 🇰🇷 韩国
     * - `'CA'` - 🇨🇦 加拿大
     * - `'IE'` - 🇮🇪 爱尔兰
     *
     * @defaultValue "OFF"
     */
    Region?: 'OFF' | 'AUTO' | 'CN' | 'HK' | 'TW' | 'SG' | 'US' | 'JP' | 'AU' | 'GB' | 'KR' | 'CA' | 'IE';
    /**
     * Siri 响应语言修改
     *
     * 自定义 Siri 回复时使用的语言。
     *
     * @remarks
     *
     * Possible values:
     * - `'OFF'` - 🔴 关闭（不修改）
     * - `'AUTO'` - 🇺🇳 自动 (跟随“Siri”的“语言”设置)
     * - `'zh_CN'` - 🇨🇳 中文 (普通话 - 中国大陆)
     * - `'zh_TW'` - 🇹🇼 中文 (普通话 - 台湾)
     * - `'yue_CN'` - 🇨🇳 中文 (粤语 - 中国大陆)
     * - `'zh_HK'` - 🇭🇰 中文 (粤语 - 香港)
     * - `'ja_JP'` - 🇯🇵 日语
     * - `'en_CA'` - 🇨🇦 英语 (加拿大)
     * - `'en_SG'` - 🇸🇬 英语 (新加坡)
     * - `'en_AU'` - 🇦🇺 英语 (澳大利亚)
     * - `'en_IE'` - 🇮🇪 英语 (爱尔兰)
     * - `'en_US'` - 🇺🇸 英语 (美国)
     * - `'en_GB'` - 🇬🇧 英语 (英国)
     * - `'ko_KR'` - 🇰🇷 韩语
     *
     * @defaultValue "zh_CN"
     */
    SiriResponseLanguageVariant?: 'OFF' | 'AUTO' | 'zh_CN' | 'zh_TW' | 'yue_CN' | 'zh_HK' | 'ja_JP' | 'en_CA' | 'en_SG' | 'en_AU' | 'en_IE' | 'en_US' | 'en_GB' | 'ko_KR';
    /**
     * [储存] 配置类型
     *
     * 默认使用 PersistentStore，配置优先级为 database -> $argument -> PersistentStore (BoxJs)；选择 Argument 时为 database -> PersistentStore (BoxJs) -> $argument。
     *
     * @remarks
     *
     * Possible values:
     * - `'Argument'` - 优先使用 $argument，其次使用 PersistentStore (BoxJs)，最后使用 database.mjs 的默认配置
     * - `'PersistentStore'` - 优先使用来自 BoxJs 等，由 $persistentStore 提供的配置，其次使用 $argument，最后使用 database.mjs 的默认配置
     * - `'database'` - 只使用由作者的 database.mjs 文件提供的默认配置，其他任何自定义配置不再起作用
     *
     * @defaultValue "PersistentStore"
     */
    Storage?: 'Argument' | 'PersistentStore' | 'database';
    /**
     * [调试] 日志等级
     *
     * 选择脚本日志的输出等级，低于所选等级的日志将全部输出。
     *
     * @remarks
     *
     * Possible values:
     * - `'OFF'` - 🔴 关闭
     * - `'ERROR'` - ❌ 错误
     * - `'WARN'` - ⚠️ 警告
     * - `'INFO'` - ℹ️ 信息
     * - `'DEBUG'` - 🅱️ 调试
     * - `'ALL'` - 全部
     *
     * @defaultValue "WARN"
     */
    LogLevel?: 'OFF' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'ALL';
}
