# 借金スッキリnavi（saimu.navolio.net）

債務整理の相談先比較LP。公開先: https://saimu.navolio.net/

- 元ページ: https://vpscomparehub.com/money/（repo `tekito` の `src/pages/money/index.astro`）。本文・事実・ASPリンクはそのまま移植。
- 部品: 薬剤師転職 比較・ランキング型パーツ集（yk-*）。`parts.css` は hozon `LPパーツ集_薬剤師比較ランキング型/parts.css`（sha256 2ad43933…）の無改変コピー。`site.css` はページ枠だけ。
- 編集: `build.cjs` のデータを直して `node build.cjs`。`index.html`・`operator/`・`privacy/`・`ranking/` は生成物なので直接直さない。
- 計測: GA4 G-2YLF06DC0E / Google広告 AW-18129603657、ASPリンクのクリックで `money_cta` イベント。
