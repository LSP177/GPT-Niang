# 小克 · Claude 桌面版挂件

把 [GPT-Niang（GPT 娘）](https://github.com/T7moris/GPT-Niang) 1.3.4 的 Windows 挂件移植到 **Claude 桌面版**：
角色换成社区的 Claude 拟人「小克」，气泡里显示 Claude Code 的**今日账本**。

<img src="assets/xiaoke-bust.png" alt="橘发、手持书本的小克 Q 版半身" width="240">

> 非官方项目，与 Anthropic、OpenAI 无关。「Claude」是 Anthropic 的商标，这里仅用于说明它挂在哪个应用上。

## 能做什么

- **跟随 Claude 主窗口**：贴在 Claude 窗口里，随窗口移动；Claude 在后台时会被其他窗口一起盖住，最小化或关闭时隐藏，重新打开时自动回来。
- **点角色看今日账本**：
  - **今日**：今天在 Claude Code 里按 API 价折算的花费。进度条对比过去 7 天的日均（半满 = 日均，满 = 两倍），超过两倍时变红。
  - **缓存命中**：今天的提示词缓存（prompt caching）命中率，以及缓存帮你省下的钱。
  - 悬停气泡可以看各模型的花费和近 7 天合计。
- **点气泡看台词**：再点收起。台词可以在右键菜单里编辑。
- GPT 娘原有的交互全部保留：按压回弹和音效、靠边吸附并朝向窗口内侧、60%–250% 缩放、变色效果、桌面自由模式。

### 为什么不显示「每周额度」

Claude 没有公开的额度接口，只靠本地记录只能猜额度百分比，猜不准还不如直接去 Claude 设置里看。
所以小克只显示本地能**准确**算出的两个数：今日花费和缓存命中率。

### 数据从哪来

只读本机的 Claude Code 对话记录 `%USERPROFILE%\.claude\projects\**\*.jsonl`（包括 Claude 桌面版的 Code 标签页），
按 `assets/pricing.json` 的 API 价折算。**不联网、不读取账号或令牌**。
桌面版普通聊天的用量不在本地，不会被统计。

## 安装（Windows 10 / 11）

需要：Claude 桌面版、[Node.js](https://nodejs.org/) 20 或更新版本。

1. 在 [仓库首页](https://github.com/LSP177/GPT-Niang) 点 **Code → Download ZIP**，解压后把其中的 `claude-xiaoke` 文件夹放到准备长期保留的位置。
2. 双击 **`install.cmd`**。不需要管理员权限。
3. 打开 Claude 桌面版，小克会出现在窗口右下角。

安装会在「启动」文件夹放一个 `Claude Xiaoke.lnk`，登录后自动在后台等待 Claude 窗口出现。
偏好和缓存在 `%LOCALAPPDATA%\ClaudeXiaoke\state`。

**停用**：双击 `uninstall.cmd`，会关闭小克并移除启动项，保留程序文件和偏好。

想换角色图，见 [docs/character-art.md](docs/character-art.md)。

### 让 AI 帮你装

嫌麻烦的话，把下面这段发给能在你电脑上执行命令的 AI（例如 Claude 桌面版的 Code 标签页、Claude Code）：

> 从 https://github.com/LSP177/GPT-Niang 下载其中的 `claude-xiaoke` 文件夹，放到准备长期保留的位置（例如 `%LOCALAPPDATA%\Programs\ClaudeXiaoke`）。先检查 Node.js 20+ 和 Claude 桌面版是否已安装，再运行该文件夹里的 `install.cmd`（或 `powershell -NoProfile -STA -ExecutionPolicy Bypass -File Install.ps1`），告诉我结果。不需要管理员权限，不要修改系统设置。

安装前可以先让 AI 运行 `Install.ps1 -CheckOnly`，只检查环境、不做任何修改。

小克和 GPT 娘使用不同的数据目录、互斥锁和管道名，**可以同时安装、同时运行**。

## 和 GPT-Niang 的区别

| | GPT-Niang 1.3.4 | 小克 |
|---|---|---|
| 宿主窗口 | Codex 桌面版 | Claude 桌面版（识别规则见 `widget.ps1` 的 `ClaudeProcess`） |
| 气泡数据 | Codex 官方 5 小时 / 每周额度 | 本地估算：今日花费、缓存命中率 |
| 安装 | Codex 插件市场 + 计划任务 + 自动更新 | 启动文件夹快捷方式，无计划任务、无自动更新 |
| 角色 / 台词 / 配色 | 白发龙娘、紫色 | 小克、橘色 |
| macOS | 支持 | 暂不支持 |

主要改动在 `runtime/claude-usage.mjs`（新）、`widget.ps1`、`runtime/supervisor.ps1`、`runtime/watch.mjs` 和 `Install.ps1`。

## 致谢与许可

- 挂件本体：[T7moris/GPT-Niang](https://github.com/T7moris/GPT-Niang)，MIT，见 [LICENSE](LICENSE)。
- 花费估算与价格表：移植自 [Hatk3451/xiaoke-cc](https://github.com/Hatk3451/xiaoke-cc)，MIT，见 [LICENSE.xiaoke-cc](LICENSE.xiaoke-cc)。
- 台词：来自 xiaoke-cc，上游 [aklnaaw/dsh-xiaoke-widget](https://github.com/aklnaaw/dsh-xiaoke-widget) 与 [MeteorNOX/DeepSeek-Balance-Whale-Widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget)，MIT，见 [assets/quotes-LICENSE.txt](assets/quotes-LICENSE.txt)。
- 按压音效 `press.wav` / `release.wav` 来自 GPT-Niang。
- 角色图 `assets/xiaoke-bust.png`：改编自 **ZipZipPipe** 的 Claude 拟人「小克」三视图，**CC BY-NC-SA 4.0**（署名、不可商用、相同方式共享），见 [assets/CHARACTER-NOTICE.txt](assets/CHARACTER-NOTICE.txt)。图片不适用代码的 MIT 许可。
