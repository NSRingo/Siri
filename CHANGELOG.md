### 🛠️ Bug Fixes
  * 修复 `$argument` 和 `$persistentStore` 载入顺序颠倒的问题
    * 正确顺序为先读取 `$argument` 再读取 `$persistentStore (BoxJs)`
    * 即，有相同键名时，`$persistentStore (BoxJs)` 的值会覆盖 `$argument` 的值

### ‼️ Breaking Changes
  * 从脚本中移除了 `@nsnanocat/url` polyfill
    * 由于 `@nsnanocat/url` 已经被移除，所以 `⭕ Siri` 项目已完全不再支持 `🚀 ShadowRocket`

### 🔣 Dependencies
  * 升级了 `@nsnanocat/util`
    * `util` 由 `submodule` 更改为 `package`
    * `$platform` 改为 `$app`
    * 使用了全新的 `Console` polyfill

### 🔄 Other Changes
  * 打包器由 `rollup` 更改为 `rspack`
