# wp-gamingpc-longtail-jura

ロングテールキーワードから「ジュラ」文体の記事を大量生成し、WordPressへ自動投稿するシステムです。

## 🎮 特徴

- **ジュラ文体自動生成**: コーパス学習による一貫した文体の記事生成
- **WordPress自動投稿**: REST API v2対応（下書き・予約投稿対応）
- **画像自動取得**: Unsplash APIによるアイキャッチ画像の自動取得
- **複数入力ソース**: CSVファイルまたはNotion APIからのキーワード読み込み
- **品質保証**: 記事の自動検証とレート制限対応
- **統計管理**: SQLiteによる投稿ログの管理

## 🚀 クイックスタート

### 1. 環境設定

```bash
# リポジトリをクローン
git clone <repository-url>
cd wp-gamingpc-longtail-jura

# 依存関係をインストール
pnpm install

# 環境変数を設定
cp env.example .env
# .envファイルを編集してAPIキーを設定
```

### 2. 環境変数の設定

`.env`ファイルに以下の設定を追加：

```env
# OpenAI API設定
OPENAI_API_KEY=your_openai_api_key_here

# WordPress設定
WORDPRESS_URL=https://your-wordpress-site.com
WORDPRESS_USERNAME=your_username
WORDPRESS_PASSWORD=your_application_password

# Unsplash API設定
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

# Notion API設定（オプション）
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

### 3. サンプルCSVファイルの作成

```bash
pnpm start init
```

### 4. 接続テスト

```bash
pnpm start test
```

### 5. 記事生成開始

```bash
# CSVファイルから記事生成
pnpm start start ./data/keywords.csv

# または対話的に実行
pnpm start start
```

## 📁 プロジェクト構造

```
wp-gamingpc-longtail-jura/
├── packages/
│   ├── core/          # コア機能
│   │   ├── src/
│   │   │   ├── services/     # APIサービス
│   │   │   ├── utils/        # ユーティリティ
│   │   │   ├── generators/   # 記事生成
│   │   │   └── types/        # 型定義
│   │   └── tests/            # テスト
│   └── cli/           # CLIツール
├── corpus/
│   └── jura/          # ジュラ文体コーパス
├── data/              # データファイル
└── docs/              # ドキュメント
```

## 🛠️ 使用方法

### CLIコマンド

```bash
# 記事生成開始
pnpm start start [input] [options]

# オプション
-n, --notion          Notionデータベースから読み込み
-c, --csv             CSVファイルから読み込み
-d, --dry-run         実際の投稿は行わず、生成のみ実行
-s, --schedule <date> 予約投稿日時 (YYYY-MM-DD HH:mm)

# 接続テスト
pnpm start test

# サンプルCSV作成
pnpm start init
```

### CSVファイル形式

```csv
keyword,overview,tone_hint,cta
"RTX4090 電源容量","初心者でも失敗しない電源選びを解説","安心感＋オタク深掘り","/best-psu/"
"ゲーミングPC 冷却性能","CPU・GPUの温度管理を徹底解説","技術的詳細＋実用性重視","/cooling-guide/"
```

### Notionデータベース構造

以下のプロパティを持つデータベースが必要です：

- `keyword` (title): キーワード
- `overview` (rich_text): 記事概要
- `tone_hint` (rich_text): トーンヒント
- `cta` (rich_text): CTAリンク

## 🎨 ジュラ文体について

ジュラ文体は以下の特徴を持ちます：

- **一人称**: 「ぼく（ジュラ）」を使用
- **ゲーム比喩**: 3回以上のゲーム関連の比喩を使用
- **結論先行**: 重要な結論を先に述べる
- **親しみやすさ**: 初心者にも分かりやすい説明
- **技術的詳細**: 専門的な内容も含む

## 🔧 開発

### 依存関係

- Node.js 20+
- pnpm
- TypeScript

### 開発コマンド

```bash
# ビルド
pnpm build

# テスト実行
pnpm test

# リント
pnpm lint

# フォーマット
pnpm format

# 開発モード
pnpm dev
```

### テスト

```bash
# 全テスト実行
pnpm test

# カバレッジ付きテスト
pnpm test --coverage

# 特定のテストファイル
pnpm test llm-service.test.ts
```

## 📊 統計情報

システムは以下の統計情報を提供します：

- 総投稿数
- 生成済み記事数
- 投稿成功数
- 投稿失敗数

## 🔗 API設定

### WordPress REST API

WordPressサイトでREST APIを有効にし、アプリケーションパスワードを作成してください。

### Unsplash API

[Unsplash Developers](https://unsplash.com/developers)でアプリケーションを登録し、アクセスキーを取得してください。

### Notion API

[Notion Developers](https://developers.notion.com/)でインテグレーションを作成し、データベースにアクセス権限を付与してください。

## 🚨 注意事項

- OpenAI APIの利用料金が発生します
- レート制限に注意してください
- 生成された記事は必ず確認してから公開してください
- 著作権に注意してください

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。

## 📞 サポート

問題が発生した場合は、GitHubのイシューを作成してください。 