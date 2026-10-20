export interface Settings {
    /**
     * 启用 Siri 建议
     *
     * 是否启用「Siri 建议」功能。
     *
     * @defaultValue true
     */
    Enabled?: boolean;
    /**
     * 国家或地区代码
     *
     * 不同国家或地区提供的内容或有差别，此选项同时会影响分配给您不同地区的 Siri 服务器。
     *
     * @remarks
     *
     * Possible values:
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
     * @defaultValue "SG"
     */
    CountryCode?: 'AUTO' | 'CN' | 'HK' | 'TW' | 'SG' | 'US' | 'JP' | 'AU' | 'GB' | 'KR' | 'CA' | 'IE';
    /**
     * 搜索领域
     *
     * 启用搜索的领域，领域数据由国家或地区设置决定，此选项仅开启搜索的领域，不代表设置的地区一定有相应的数据和服务。
     *
     * @remarks
     *
     * Possible values:
     * - `'web'` - 网页
     * - `'itunes'` - iTunes
     * - `'app_store'` - App Store
     * - `'movies'` - 电影
     * - `'restaurants'` - 餐厅
     * - `'maps'` - 地图
     *
     * @defaultValue ["web","itunes","app_store","movies","restaurants","maps"]
     */
    Domains?: ('web' | 'itunes' | 'app_store' | 'movies' | 'restaurants' | 'maps')[];
    /**
     * 功能
     *
     * 启用的「Siri 建议」功能，未选的功能不代表关闭，仅代表还原到该地区默认设置状态。
     *
     * @remarks
     *
     * Possible values:
     * - `'flightutilities'` - 航班工具
     * - `'lookup'` - 查询
     * - `'mail'` - 邮件
     * - `'messages'` - 信息
     * - `'news'` - 新闻
     * - `'safari'` - Safari浏览器
     * - `'siri'` - Siri
     * - `'spotlight'` - 聚焦搜索
     * - `'visualintelligence'` - 视觉智能
     *
     * @defaultValue ["flightutilities","lookup","mail","messages","news","safari","siri","spotlight","visualintelligence"]
     */
    Functions?: ('flightutilities' | 'lookup' | 'mail' | 'messages' | 'news' | 'safari' | 'siri' | 'spotlight' | 'visualintelligence')[];
    /**
     * Safari 智能历史记录
     *
     * 是否在 Safari 浏览器中启用基于历史记录的Siri建议功能，启用后将在Safari浏览器起始页推荐基于时间地点跨设备等的相关浏览记录。
     *
     * @defaultValue true
     */
    SafariSmartHistory?: boolean;
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
