# <img src="assets/icon.png" width="48" height="48" align="top" style="margin-right: 10px;"> Covate

[English](README.md) | [简体中文](README_zh-CN.md) | [繁體中文](README_zh-TW.md)

一個具備上下文感知能力的 **Model Context Protocol (MCP)** 伺服器，作為 AI 編程助手的「學習側邊欄」。它通過互動測驗幫助開發者**從 AI 生成的程式碼變更中學習**，並為智能體提供持久化的**專案級除錯記憶**。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![MCP Standard](https://img.shields.io/badge/MCP-Standard-green.svg)](https://modelcontextprotocol.io/)
[![Glama MCP](https://img.shields.io/badge/Glama-MCP%20Server-blue)](https://glama.ai/mcp/servers/@SunflowersLwtech/covate)
[![DeepWiki](https://img.shields.io/badge/DeepWiki-文檔-purple)](https://deepwiki.com/SunflowersLwtech/covate)

---

## 🌐 資源連結

| 資源 | 描述 |
|------|------|
| [**Glama MCP 市場**](https://glama.ai/mcp/servers/@SunflowersLwtech/covate) | 官方 MCP 伺服器列表，含安裝指南 |
| [**DeepWiki 文檔**](https://deepwiki.com/SunflowersLwtech/covate) | AI 生成的程式碼庫深度解析 |
| [**GitHub 倉庫**](https://github.com/SunflowersLwtech/covate) | 原始碼、Issue 和貢獻 |

---

## 🚀 為什麼使用它？

| 角色 | 收益 |
|------|------|
| **開發者** | 不要只接受 AI 的程式碼——要理解它。請求測驗來驗證你對邏輯、安全性或效能影響的理解。 |
| **AI 智能體** | 不再重複解決同一個 Bug。伺服器會靜默記錄除錯方案，並在遇到類似錯誤時自動檢索。 |

---

## 📦 可用工具

| 工具 | 類型 | 描述 |
|------|------|------|
| `learning_session` | 🎓 互動式 | 開啟 WebUI 測驗介面，基於最近的程式碼變更生成題目。**阻塞**直到使用者完成學習。 |
| `debug_search` | 🔍 靜默 RAG | 搜尋專案除錯歷史，查找相關的歷史解決方案。遇到錯誤時自動觸發。 |
| `debug_record` | 📝 靜默 | 將除錯經驗記錄到專案知識庫。修復 Bug 後自動觸發。 |
| `term_get` | 📚 參考 | 獲取程式設計術語和概念。追蹤已展示的術語以避免重複。 |

### 工具詳情

<details>
<summary><b>🎓 learning_session</b> - 互動學習卡片</summary>

**觸發條件**: 使用者顯式請求（例如：「考考我」、「測試我的理解」）

**參數**:
| 參數 | 類型 | 預設值 | 描述 |
|------|------|--------|------|
| `project_directory` | string | `"."` | 專案目錄路徑 |
| `summary` | string | — | Agent 操作的結構化摘要 |
| `reasoning` | object | null | 5-Why 推理（目標、觸發、機制、替代方案、風險） |
| `quizzes` | array | 自動生成 | 3 道測驗題，包含選項、答案、解釋 |
| `focus_areas` | array | `["logic"]` | 重點領域：logic、security、performance、architecture、syntax |
| `timeout` | int | 600 | 逾時時間（秒，60-7200） |

**回傳**: `{"status": "completed", "action": "HALT_GENERATION"}`

</details>

<details>
<summary><b>🔍 debug_search</b> - 搜尋除錯歷史</summary>

**觸發條件**: 遇到錯誤時自動呼叫（靜默，無 UI）

**參數**:
| 參數 | 類型 | 預設值 | 描述 |
|------|------|--------|------|
| `query` | string | — | 要搜尋的錯誤訊息或描述 |
| `project_directory` | string | `"."` | 專案目錄路徑 |
| `error_type` | string | null | 按錯誤類型過濾（如 ImportError） |
| `tags` | array | null | 按標籤過濾 |
| `limit` | int | 5 | 最大結果數（1-20） |

**回傳**: `{"results": [...], "count": N}`

</details>

<details>
<summary><b>📝 debug_record</b> - 記錄除錯經驗</summary>

**觸發條件**: 修復 Bug 後自動呼叫（靜默，背景執行）

**參數**:
| 參數 | 類型 | 預設值 | 描述 |
|------|------|--------|------|
| `context` | object | — | 錯誤上下文：`{error_type, error_message, file, line}` |
| `cause` | string | — | 根因分析 |
| `solution` | string | — | 有效的解決方案 |
| `project_directory` | string | `"."` | 專案目錄路徑 |
| `tags` | array | null | 分類標籤 |

**回傳**: `{"ok": true, "id": "..."}`

</details>

<details>
<summary><b>📚 term_get</b> - 獲取程式設計術語</summary>

**可用領域**: programming_basics、data_structures、algorithms、software_design、web_development、version_control、testing、security、databases、devops

**參數**:
| 參數 | 類型 | 預設值 | 描述 |
|------|------|--------|------|
| `project_directory` | string | `"."` | 專案目錄路徑 |
| `count` | int | 3 | 術語數量（1-5） |
| `domain` | string | null | 按領域過濾 |

**回傳**: `{"terms": [...], "count": N, "remaining": N}`

</details>

---

## 🛠️ 安裝

### 一鍵安裝（推薦）

<table>
<tr>
<th>平台</th>
<th>命令</th>
</tr>
<tr>
<td><b>macOS / Linux</b></td>
<td>

```bash
curl -fsSL https://raw.githubusercontent.com/SunflowersLwtech/covate/main/scripts/install.sh | bash
```

</td>
</tr>
<tr>
<td><b>Windows (PowerShell)</b></td>
<td>

```powershell
irm https://raw.githubusercontent.com/SunflowersLwtech/covate/main/scripts/install.ps1 | iex
```

</td>
</tr>
</table>

安裝腳本會：
1. **智能檢測**：如果檢測到已安裝，自動執行更新而非重新安裝
2. **環境檢測**：自動檢測 Python 環境（uv → conda → venv）
3. **克隆倉庫**：克隆到 `~/covate`（可自訂）
4. **安裝依賴**：建立虛擬環境並安裝所有依賴
5. **配置指引**：輸出配置 IDE 所需的確切命令

> **智能特性**：重複執行安裝命令是安全的！腳本會自動檢測已安裝的版本並執行更新。

### 手動安裝

<details>
<summary>點擊展開手動安裝步驟</summary>

**前置條件**: Python 3.11+ 或 [uv](https://docs.astral.sh/uv/)

```bash
# 1. 克隆倉庫
git clone https://github.com/SunflowersLwtech/covate.git
cd covate

# 2. 建立虛擬環境並安裝
# 使用 uv（推薦）
uv venv --python 3.11 covate
source covate/bin/activate          # macOS/Linux
# covate\Scripts\activate           # Windows
uv pip install -e '.[dev]'

# 或者使用標準 venv
python -m venv covate
source covate/bin/activate           # macOS/Linux
# covate\Scripts\activate            # Windows
pip install -e '.[dev]'
```

</details>

---

## IDE 配置

安裝後，配置你的 AI 編程 IDE 以使用此 MCP 服務器。

### Claude Code

**選項 1：CLI (推薦)**
```bash
# macOS / Linux
claude mcp add covate -- ~/covate/covate/bin/covate

# Windows
claude mcp add covate -- %USERPROFILE%\covate\covate\Scripts\covate.exe
```

**選項 2：配置文件**

添加到 `~/.claude.json`：
```json
{
  "mcpServers": {
    "covate": {
      "command": "~/covate/covate/bin/covate"
    }
  }
}
```

Windows 用戶：
```json
{
  "mcpServers": {
    "covate": {
      "command": "C:\\Users\\YourName\\covate\\covate\\Scripts\\covate.exe"
    }
  }
}
```

示例路徑：
- Unix (uv): `~/covate/covate/bin/covate`
- Windows (uv): `C:\\Users\\YourName\\covate\\covate\\Scripts\\covate.exe`
- Windows (conda): `C:\\Users\\YourName\\anaconda3\\envs\\covate\\Scripts\\covate.exe`

路徑說明（以 Unix 示例為例）：
- `~/covate` → 倉庫目錄
- `covate` → uv/venv 建立的虛擬環境目錄
- `bin/covate` → 可執行檔

### Cursor

添加到 Cursor MCP 設置 (Settings → MCP → Add Server)：

```json
{
  "covate": {
    "command": "~/covate/covate/bin/covate"
  }
}
```

Windows 用戶：
```json
{
  "covate": {
    "command": "C:\\Users\\YourName\\covate\\covate\\Scripts\\covate.exe"
  }
}
```

### Windsurf

添加到 `~/.codeium/windsurf/mcp_config.json`：

```json
{
  "mcpServers": {
    "covate": {
      "command": "~/covate/covate/bin/covate"
    }
  }
}
```

### 其他 IDE

對於任何兼容 MCP 的 IDE，使用這些設置：
- **Command:** `<install-path>/covate/bin/covate` (或 Windows 上的 `covate\Scripts\covate.exe`)
- **Transport:** stdio

**配置完成後，重啟你的 IDE。**

## 使用方法

### 可用工具

| 工具 | 觸發方式 | 面向對象 | 返回 |
|------|---------|-----|---------|
| `learning_session` | 用戶顯式請求 | **用戶** | `{status, action}` - 極簡 |
| `debug_search` | 自動 (出錯時) | **智能體** | 緊湊摘要 |
| `debug_record` | 自動 (修復後) | **智能體** | `{ok, id}` - 極簡 |

### 對於用戶：學習會話

對你的 AI 助手說：
- "Quiz me on this change" (針對這個變更考考我)
- "Test my understanding" (測試我的理解)
- "Help me learn about what you did" (幫我學習你做了什麼)

Agent 將創建一個互動學習卡片並**等待**直到你完成它。

> **注意**：測驗分數保存在本地供你自我追蹤，**不會**返回給 Agent - 以保持上下文乾淨。

### 對於 Agent：調試工具

調試工具在後台靜默工作：
- **先搜索**：遇到錯誤時，Agent 搜索過去的解決方案
- **後記錄**：修復錯誤時，Agent 記錄解決方案
- **漸進式披露**：返回緊湊的摘要，而不是完整記錄
- **快速查找**：使用倒排索引進行基於關鍵字的搜索

## 更新

### 一鍵遠端更新（推薦）

遠端更新腳本會自動檢測您的安裝位置，支援**任意路徑格式**（包括中文/非 ASCII 路徑）：

<table>
<tr>
<td><b>macOS / Linux</b></td>
<td>

```bash
curl -fsSL https://raw.githubusercontent.com/SunflowersLwtech/covate/main/scripts/update.sh | bash
```

</td>
</tr>
<tr>
<td><b>Windows (PowerShell)</b></td>
<td>

```powershell
irm https://raw.githubusercontent.com/SunflowersLwtech/covate/main/scripts/update.ps1 | iex
```

</td>
</tr>
</table>

更新腳本會：
1. **自動檢測**您的安裝位置（支援多個安裝）
2. **拉取**倉庫的最新程式碼
3. **強制重裝**依賴以確保版本同步
4. **驗證**安裝完整性並報告問題
5. 檢測 MCP 伺服器是否正在使用並提供清晰指引

> **為什麼使用遠端更新？**
> - ✅ 支援中文/非 ASCII 路徑，無需 `cd` 導航
> - ✅ 始終使用倉庫最新的更新邏輯
> - ✅ 即使忘記安裝位置也能自動檢測
> - ✅ 優雅處理多個安裝

### 本地更新（備選）

**macOS / Linux:**
```bash
~/covate/scripts/update.sh
```

**Windows (PowerShell):**
```powershell
~\covate\scripts\update.ps1
```

### 手動更新

<details>
<summary>點擊展開手動更新步驟</summary>

```bash
# 進入安裝目錄
cd ~/covate  # 或你的自訂安裝路徑

# 拉取最新程式碼
git pull origin main

# 更新依賴
# 使用 uv
source covate/bin/activate          # macOS/Linux
# covate\Scripts\activate           # Windows
uv pip install -e '.[dev]' --upgrade

# 或使用標準 venv
source covate/bin/activate           # macOS/Linux
# covate\Scripts\activate            # Windows
pip install -e '.[dev]' --upgrade
```

</details>

---

## 🖼️ 截圖

### 學習會話 WebUI

![WebUI 預覽](assets/webui-TW.png)

---

## 🔒 安全與隱私

| 方面 | 詳情 |
|------|------|
| **本地優先** | 所有資料存儲在專案內的 `.mcp-sidecar/` 目錄 |
| **無遙測** | 不向外部伺服器發送任何資料 |
| **完全掌控** | 隨時刪除 `.mcp-sidecar/` 即可重置所有資料 |

---

## 🔮 發展藍圖

我們正在建構一個與你共同成長的**個人化學習中心**。以下是即將推出的功能：

### 🔍 進階搜尋與索引 (v1.2)

| 功能 | 描述 |
|------|------|
| **SQLite FTS5** | 全文搜尋，支援中文、前綴匹配和布林查詢 |
| **BM25 排序** | 業界標準的相關性評分，提供更好的搜尋結果 |
| **語義搜尋** | 向量嵌入實現語義匹配（例如「權限錯誤」能匹配「permission denied」） |
| **跨專案搜尋** | 在你所有專案中搜尋除錯經驗 |

### 📱 行動端 App (v2.0)

| 功能 | 描述 |
|------|------|
| **學習歷史同步** | 在手機上存取你的測驗歷史和學習進度 |
| **間隔重複** | 基於遺忘曲線的智慧複習計畫 |
| **離線模式** | 隨時隨地學習，連網後自動同步 |
| **推播提醒** | 溫和提醒你複習正在遺忘的概念 |

### 🎯 個人化學習中心 (v2.5)

| 功能 | 描述 |
|------|------|
| **知識圖譜** | 視覺化展示你學過的概念及其關聯 |
| **弱點分析** | AI 識別你的薄弱環節並推薦針對性練習 |
| **學習連續性** | 遊戲化元素保持你的學習動力 |
| **團隊洞察** | （可選）與團隊分享匿名化的學習模式 |

### 🤖 AI 增強 (v3.0)

| 功能 | 描述 |
|------|------|
| **自適應測驗** | 根據你的表現自動調整題目難度 |
| **程式碼模式識別** | 從你自己程式碼庫中的模式學習 |
| **多語言支援** | 用你偏好的語言提供解釋 |
| **語音互動** | 「嘿 Claude，考考我昨天做了什麼」 |

> **想影響藍圖？** [提交 Issue](https://github.com/SunflowersLwtech/covate/issues) 或加入討論！

---

## 🔧 環境變數

| 變數 | 預設值 | 描述 |
|------|--------|------|
| `MCP_DEBUG` | `false` | 啟用除錯日誌（`true`、`1`、`yes`、`on`） |
| `MCP_TIMEOUT` | `120000` | MCP 伺服器啟動逾時時間（毫秒） |
| `MAX_MCP_OUTPUT_TOKENS` | `25000` | MCP 輸出的最大 token 數 |

---

## 🤝 貢獻

我們歡迎貢獻！請遵循以下步驟：

1. Fork 本倉庫
2. 建立特性分支：`git checkout -b feature/amazing-feature`
3. 安裝開發依賴：`uv pip install -e '.[dev]'`
4. 進行更改並執行測試：`pytest`
5. 提交 Pull Request

詳細指南請參閱 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 📬 聯繫方式

| 渠道 | 地址 |
|------|------|
| **郵箱** | sunflowers0607@outlook.com |
| **郵箱** | weiliu0607@gmail.com |
| **GitHub Issues** | [提交 Issue](https://github.com/SunflowersLwtech/covate/issues) |

---

## 📄 授權條款

本專案基於 [MIT License](LICENSE) 授權。

---

<p align="center">
  基於 <a href="https://github.com/jlowin/fastmcp">FastMCP</a> 建構 •
  <a href="https://modelcontextprotocol.io">MCP 標準</a> •
  <a href="https://glama.ai/mcp/servers/@SunflowersLwtech/covate">Glama MCP</a>
</p>
