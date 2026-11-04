// 借金スッキリnavi（https://saimu.navolio.net/）の生成スクリプト。
// 部品は「薬剤師転職 比較・ランキング型」パーツ集（yk-*）。並びはパーツ集の「ページの流れ」どおり。
// parts.css は正本の写しで直接直さない。6社のデータ・採点は data.cjs、画像の出典は images/CREDITS.md。
// 使い方：node build.cjs（生成物の html を直接直さない）
const fs = require("fs");
const path = require("path");
const { CHECKED, AXES, firms, total, grade, stars } = require("./data.cjs");
const OUT = __dirname;

const SITE = "借金スッキリnavi";
const ORIGIN = "https://saimu.navolio.net";
const TITLE = "債務整理の相談先おすすめ6選｜無料相談・費用・受付時間を比較【2026年11月】";
const DESC = "債務整理の相談先6社を、相談料・任意整理の費用・対応手続き・受付時間・分割払い・家族への配慮の6項目で比較。各事務所の公式サイトの記載をもとに採点しました。";
const UPDATED = "2026年11月";
const UPDATED_ISO = "2026-11-04";
const GA4 = "G-2YLF06DC0E";
const AW = "AW-18129603657";

/* ---------- パーツの小物（パーツ集 build.cjs と同じ） ---------- */
const MARU_SVG = { 5: '<circle cx="12" cy="12" r="9.6"/><circle cx="12" cy="12" r="4.6"/>', 4: '<circle cx="12" cy="12" r="9.6"/>', 3: '<path d="M12 3.2 21.4 19.8H2.6Z"/>' };
const MARU_CHAR = { 5: "◎", 4: "○", 3: "△" };
const maru = (v) => `<span class="yk-maru"><svg class="yk-maru__svg" viewBox="0 0 24 24" aria-hidden="true">${MARU_SVG[v]}</svg><span class="yk-sr">${MARU_CHAR[v]}</span></span>`;
const RADAR_JS = `<script>
document.querySelectorAll('.yk-radar[data-labels]').forEach(function (el) {
  var L = el.dataset.labels.split(','), S = el.dataset.scores.split(',').map(Number), M = +(el.dataset.max || 5), n = L.length, cx = 160, cy = 150, R = 100;
  function p(i, r) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [(cx + r * Math.cos(a)).toFixed(1), (cy + r * Math.sin(a)).toFixed(1)]; }
  var s = '<svg viewBox="0 0 320 300" role="img" aria-label="' + (el.dataset.name || '') + 'の評価：' + L.map(function (l, i) { return l + ' ' + S[i]; }).join('、') + '">';
  for (var k = 1; k <= M; k++) s += '<polygon points="' + L.map(function (_, i) { return p(i, R * k / M).join(','); }).join(' ') + '" fill="none" stroke="#c9d3e3"/>';
  L.forEach(function (l, i) { var a = p(i, R), b = p(i, R + 24); s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + a[0] + '" y2="' + a[1] + '" stroke="#c9d3e3"/><text x="' + b[0] + '" y="' + b[1] + '" text-anchor="middle" dominant-baseline="middle" font-size="12" font-weight="700" fill="#444">' + l + '</text>'; });
  s += '<polygon points="' + S.map(function (v, i) { return p(i, R * v / M).join(','); }).join(' ') + '" fill="rgba(47,103,184,.18)" stroke="#2f67b8" stroke-width="2.5"/></svg>';
  el.innerHTML = s;
});
</script>`;

/* ---------- リンク・画像 ---------- */
const F = Object.fromEntries(firms.map((f) => [f.key, f]));
const href = (f) => (f.asp ? `https://h.accesstrade.net/sp/cc?rk=${f.asp}` : f.url);
const rel = (f) => (f.asp ? 'rel="sponsored nofollow" referrerpolicy="no-referrer-when-downgrade"' : 'rel="nofollow noopener"');
const cta = (f, label, cls = "yk-btn", place = "") => `<a class="${cls}" href="${href(f)}" ${rel(f)} data-cta="${f.key}${place ? "-" + place : ""}" onclick="return gtagSendEvent(this.href)">${label}</a>`;
const ctaLabel = () => "無料相談";
const logo = (f, alt = f.name) => `<img src="/images/logo/${f.key}.webp" alt="${alt}" width="${f.logoW}" height="${f.logoH}" loading="lazy">`;
const banner = (f) => `<a href="${href(f)}" ${rel(f)} data-cta="${f.key}-banner" onclick="return gtagSendEvent(this.href)"><img src="https://h.accesstrade.net/sp/rr?rk=${f.asp}" alt="${f.name}" width="300" height="250" loading="lazy"></a>`;
const shot = (f) => `<figure class="yk-shot"><img class="yk-shot__img" src="/images/official/${f.key}.webp" alt="${f.name}の公式サイトの画面" width="960" height="${f.key === "hibiki" ? 540 : 600}" loading="lazy"><figcaption>出典：${f.short}公式サイト</figcaption></figure>`;
const PHOTO = { kakei: [900, 1200, "書類の上に置かれた電卓"], house: [900, 600, "木の家の模型"], gavel: [900, 600, "木製のガベル"], coins: [900, 600, "瓶からこぼれた硬貨"], calc: [900, 600, "電卓とノートとペン"], phone: [900, 600, "スマートフォンを操作する手元"] };
const photo = (name, cls = "") => `<img${cls ? ` class="${cls}"` : ""} src="/images/photo/${name}.webp" alt="${PHOTO[name][2]}" width="${PHOTO[name][0]}" height="${PHOTO[name][1]}" loading="lazy">`;
const icon = (name, cls, alt = "") => `<img class="${cls}" src="/images/icon/${name}.svg" alt="${alt}" width="96" height="96" loading="lazy">`;
const pixel = (f) => (f.asp ? `<img class="site-px" src="https://h.accesstrade.net/sp/rr?rk=${f.asp}" width="1" height="1" alt="">` : "");
const CATCH = "相談料0円";
const medal = (r) => `<span class="yk-medal${r <= 3 ? (r > 1 ? ` yk-medal--${r}` : "") : " yk-medal--n"}">${r}</span>`;
const srcLabel = (u) => (u.startsWith("http") ? `<a href="${u}" rel="nofollow noopener" target="_blank">公式</a>` : u);

const gtagHead = `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4}');
gtag('config', '${AW}');
function gtagSendEvent(url) {
  var done = false;
  var go = function () { if (done) return; done = true; if (typeof url === 'string' && url !== '#') { window.location = url; } };
  gtag('event', 'money_cta', { 'event_callback': go, 'event_timeout': 2000 });
  setTimeout(go, 2200);
  return false;
}
</script>`;

const head = ({ title, desc, url, noindex = false, ld = [] }) => `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
${noindex ? '<meta name="robots" content="noindex">\n' : ""}<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ORIGIN}/images/ogp.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/parts.css">
<link rel="stylesheet" href="/site.css">
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
${gtagHead}
</head>`;

const LEGAL = [
  "※本ページはPR・広告を含みます。掲載順は6項目の採点の合計点の順です（<a href=\"/ranking/\">ランキング調査概要</a>）。品質や優劣を保証するものではありません。",
  "※本ページは法律相談・法的助言ではなく、一般的な情報提供を目的としています。",
  `※相談料・費用・受付時間・対応エリアなどは各事務所の公式サイトの記載（${CHECKED}確認）です。変更される場合があるため、必ず各事務所にご確認ください。`,
  "※債務整理を行うと信用情報に一定期間登録されるなどの影響があります。手続きの効果やリスクは個別の状況により異なります。",
];
const footer = `<div class="site-legal" id="public">${LEGAL.map((l) => `<p class="yk-small">${l}</p>`).join("")}<p class="yk-small">写真：Unsplash／アイコン：ICOOON MONO／ロゴ・公式画面：各事務所公式サイト（${CHECKED}撮影）</p></div>
<footer class="yk-footer"><ul><li><a href="/operator/">運営者情報</a></li><li><a href="/ranking/">ランキング調査概要</a></li><li><a href="/privacy/">プライバシーポリシー</a></li></ul><small>© 2026 ${SITE}</small></footer>`;

/* ================= トップページ（ページの流れ） ================= */
// A-1 FV（支給画像。帯の日付は日本時間の当月に自動更新、PRは画像の右上）
const fv = `<header class="yk-hero site-fv">
  <h1 class="yk-sr">債務整理の相談先 徹底比較6選（相談料0円・土日も受付・6項目で採点）</h1>
  <img class="site-fv__img" src="/images/fv.webp" alt="債務整理の相談先 徹底比較6選。相談料0円6社とも、土日も受付6社とも、比較6項目で採点" width="1672" height="941" fetchpriority="high">
  <p class="site-fv__date" aria-hidden="true"><time data-month>${UPDATED}</time>最新版</p>
  <p class="site-fv__pr"><b>PR</b></p>
</header>
`;

// A-2 ロゴの横流し
const logos = `<div class="yk-logos"><ul class="yk-logos__track">
${firms.map((f) => `  <li>${logo(f)}</li>`).join("\n")}
${firms.map((f) => `  <li>${logo(f, "")}</li>`).join("\n")}
</ul></div>`;

// A-3 PR
const pr = `<p class="yk-pr"><b>PR</b><span>アフィリエイトサイトのため、${firms.filter((f) => f.asp).map((f) => f.name).join("・")}等のプロモーションを含みます。</span></p>`;

// B-1 BEST3
const best3 = `<section class="yk-best3"><h2 class="yk-best3__ttl"><em>債務整理</em>に強い相談先<em>BEST3</em></h2>
<ol class="yk-best3__list">
${firms.slice(0, 3).map((f) => `  <li class="yk-best3__item"><span class="yk-best3__crown">${f.rank}</span><span class="yk-best3__logo">${logo(f)}</span><p class="yk-best3__text"><span class="yk-red">${f.best3card[0]}</span><br><span class="yk-mark">${f.best3card[1]}</span>。${f.best3card[2]}</p><p class="yk-best3__note">${f.note}</p><p class="yk-catch">${CATCH}</p>${cta(f, "無料相談", "yk-btn yk-btn--sm", "best3")}</li>`).join("\n")}
</ol></section>`;

// B-2 求人の例カード → 公式サイトに掲載された解決事例
const caseCards = firms.flatMap((f) => f.cases.map((c) => ({ f, c }))).slice(0, 5);
const top2 = `<h2 class="yk-sec-ttl" id="types">各社の<em>解決事例</em></h2>
<p class="yk-hint">横にスクロールできます</p>
<div class="yk-hscroll">
${caseCards.map(({ f, c }) => `  <div class="yk-jobcard"><h3 class="yk-jobcard__ttl">${c.ttl}</h3>${photo(c.img, "yk-jobcard__img site-jobimg")}<p class="yk-jobcard__pay"><b>${c.after.split("・")[0].split("＋")[0]}</b></p><table class="yk-kv"><tr><th>手続き</th><td>${c.proc}</td></tr><tr><th>相談前</th><td>${c.before}</td></tr><tr><th>結果</th><td><span class="yk-red">${c.after}</span></td></tr><tr><th>事務所</th><td>${f.short}</td></tr></table><ul class="yk-tags"><li>${f.type.split("（")[0]}</li><li>公式掲載</li></ul><p class="yk-small site-src">※結果は事案により異なります</p><p class="yk-catch">${CATCH}</p>${cta(f, "無料相談", "yk-btn yk-btn--sm", "case")}</div>`).join("\n")}
</div>`;

// 債務整理の基礎知識（事例と比較表の間。パーツ：detail-4 目次／detail-5 番号見出し／rank-8 表／detail-6 チェックの箱／image-2 本文画像／detail-7 ボタン）
const GENRE_ITEMS = ["借金は「今すぐ」相談したほうがいい理由", "債務整理は4種類。自分に合う方法", "1社140万円が分かれ目。弁護士と司法書士の違い", "失敗しない相談先の選び方5つ", "知っておきたいデメリット"];
const genre = `<h2 class="yk-sec-ttl" id="knowledge">相談先を選ぶ前に<br>知っておきたい<em>債務整理</em>のこと</h2>
<p>債務整理は、法律の手続きで借金の利息や元本を減らしたり、返済を免除してもらったりする方法です。<span class="yk-mark">どの事務所に頼むかで、使える手続きも費用も変わります。</span>比較表を見る前に、ここだけ押さえておきましょう。</p>
<div class="yk-order"><p class="yk-order__ttl">債務整理の基礎知識</p><ol>${GENRE_ITEMS.map((t, i) => `<li><span>知識${i + 1}</span><a href="#k${i + 1}">${t}</a></li>`).join("")}</ol></div>

<h3 class="yk-numh" id="k1"><span>知識1</span>${GENRE_ITEMS[0]}</h3>
<p>借金の悩みは、待っていても軽くなりません。<span class="yk-red">返済が遅れると遅延損害金が上乗せされ、一括での請求、裁判、給料の差し押さえへと進むこともあります。</span>反対に、弁護士や司法書士に依頼して<b>受任通知</b>が届けば、貸金業者は本人に直接取り立てられなくなり、その日から督促の電話や手紙が止まります。</p>
<div class="yk-listbox"><p class="yk-listbox__ttl">早く相談するほど得になること</p><ul><li>依頼したその日から、督促と返済がいったん止まる</li><li>延滞が長引く前なら、任意整理（利息カット）で返していける可能性が高い</li><li>完済した借金の過払い金は、原則として最後の取引から10年で請求できなくなる</li><li>相談料は今回の6社すべて0円。相談だけで依頼しなくてもいい</li></ul></div>

<h3 class="yk-numh" id="k2"><span>知識2</span>${GENRE_ITEMS[1]}</h3>
<figure class="mt-img">${photo("gavel")}<figcaption class="mt-img__note">写真：Unsplash</figcaption></figure>
<table class="yk-info"><tr><th>手続き</th><th>どうなる？</th></tr>
<tr><td><b>任意整理</b><small>いちばん多い</small></td><td class="is-left">貸金業者と交渉して将来の利息をカットし、残りを3〜5年で分割返済。裁判所を通さず、家族に知られにくい</td></tr>
<tr><td><b>個人再生</b><small>家を残したい</small></td><td class="is-left">裁判所を通して借金を大きく減らし、原則3〜5年で返済。住宅ローン特則で家を残せる可能性がある</td></tr>
<tr><td><b>自己破産</b><small>返済が難しい</small></td><td class="is-left">裁判所に認められると返済義務が原則なくなる。一定以上の財産は処分され、一部の資格に制限がある</td></tr>
<tr><td><b>過払い金請求</b><small>昔から借りている</small></td><td class="is-left">払いすぎた利息を取り戻す。返済中なら借金を減らせる場合も</td></tr></table>
<p>カードローンやリボ払いの返済が苦しい人の多くは、まず<span class="yk-mark">任意整理</span>で解決を目指します。どれが合うかは借入額・収入・持ち家の有無で決まるので、無料相談で決めてもらうのがいちばん早道です。</p>

<h3 class="yk-numh" id="k3"><span>知識3</span>${GENRE_ITEMS[2]}</h3>
<table class="yk-info"><tr><th>弁護士</th><th>認定司法書士</th></tr>
<tr><td class="is-left">借入額の上限なし。任意整理・個人再生・自己破産・過払い金をすべて代理できる</td><td class="is-left">代理できるのは<b>1社140万円以下</b>。個人再生・自己破産は書類作成のみ</td></tr>
<tr><td class="is-left">今回の6社では<b>東京ロータス・ひばり・響</b></td><td class="is-left">今回の6社では<b>はたの・アヴァンス・アース</b></td></tr></table>
<p><span class="yk-red">どの会社の借入も140万円以下で任意整理・過払い金なら、司法書士で十分です。</span>相談の受付時間が長く、出張もしてくれる<a href="#firm-hatano"><b>はたの</b></a>が使いやすいでしょう。1社でも140万円を超える借入がある、または自己破産・個人再生を考えているなら、最初から弁護士（<a href="#firm-lotus"><b>東京ロータス</b></a>・<a href="#firm-hibari"><b>ひばり</b></a>）に相談してください。</p>

<h3 class="yk-numh" id="k4"><span>知識4</span>${GENRE_ITEMS[3]}</h3>
<div class="yk-listbox"><p class="yk-listbox__ttl">相談先を選ぶときに確認すること</p><ul><li><b>借入額に合っているか</b>：1社140万円を超えるなら弁護士</li><li><b>費用は総額で比べる</b>：着手金だけでなく、報酬金・減額報酬・実費まで足して1社あたりいくらか</li><li><b>相談しやすいか</b>：夜や土日に電話できるか、LINE・Web・出張に対応しているか</li><li><b>家族や職場への配慮</b>：郵便物や連絡方法を相談できるか</li><li><b>実績を公開しているか</b>：相談・解決の件数を出しているか</li></ul></div>
<p>このサイトのランキングは、この5つを「受付時間・相談方法・初期費用・対応手続き・家族への配慮・実績」の6項目に分け、公式サイトの記載で採点して並べています。</p>

<h3 class="yk-numh" id="k5"><span>知識5</span>${GENRE_ITEMS[4]}</h3>
<div class="yk-listbox"><p class="yk-listbox__ttl">債務整理をすると起きること</p><ul><li>信用情報機関に一定期間（5〜7年程度）登録され、その間は新しいローンやクレジットカードが作りにくい</li><li>個人再生・自己破産では、官報に名前が載る</li><li>自己破産では一定以上の財産を手放し、手続き中は一部の資格の仕事に就けない</li><li>保証人がついている借金は、保証人に請求が行く</li></ul></div>
<p>デメリットはありますが、<span class="yk-mark">返せない借金を抱えたまま利息を払い続けるより、早く整理して生活を立て直すほうが負担は確実に軽くなります。</span>どの手続きなら影響を小さくできるかも、無料相談で教えてもらえます。</p>
<p class="yk-catch">迷ったらまずは1位のはたのへ</p>${cta(F.hatano, "無料相談", "yk-btn", "knowledge")}`;

// C-1 タブ切替の比較表（もっと見る付き）
const firmCell = (f) => `<span class="yk-cmp__rank">${f.rank}</span><span class="yk-cmp__logo">${logo(f, "")}</span><a class="yk-cmp__name" href="#firm-${f.key}">${f.short}</a><span class="yk-stars">${stars(total(f))}</span><span class="yk-grade">総合評価 <b>${grade(total(f))}</b></span>`;
const cmpRow = (f, cells) => `<tr${f.rank === 1 ? ' class="is-pick"' : ""}><td>${firmCell(f)}</td>${cells}</tr>`;
const METHOD = { hatano: "電話・Web・出張", lotus: "電話・メール", hibari: "電話・LINE・匿名フォーム", avance: "電話・女性専用・Web", hibiki: "電話・Web", earth: "電話・メール" };
const tab1 = (f) => cmpRow(f, `<td><b class="site-total">${total(f)}</b><span class="yk-small">/30点</span></td><td class="is-left"><b class="yk-red">${f.point}</b><ul class="yk-chips"><li class="is-pink">${f.type.split("（")[0]}</li></ul></td><td>${cta(f, "無料<br>相談", "yk-btn yk-btn--sm site-cmpbtn", "cmp")}</td>`);
const tab2 = (f) => cmpRow(f, `<td>${maru(f.scores.cost)}<span class="yk-small">${f.fees[0][1]}</span></td><td>${maru(f.scores.scope)}<span class="yk-small">${f.type.startsWith("弁護士") ? "4つの手続きを代理" : "1社140万円以下"}</span></td><td>${cta(f, "無料<br>相談", "yk-btn yk-btn--sm site-cmpbtn", "cmp2")}</td>`);
const tab3 = (f) => cmpRow(f, `<td>${maru(f.scores.hours)}<span class="yk-small">${f.info.hours}</span></td><td>${maru(f.scores.method)}<span class="yk-small">${METHOD[f.key]}</span></td><td>${maru(f.scores.family)}<span class="yk-small">${f.scores.family === 5 ? "郵便物などの配慮を明記" : f.scores.family === 4 ? "プライバシー厳守" : "記載なし"}</span></td>`);
const cmpTable = (head, rowFn, id) => `<div class="yk-fold"><input type="checkbox" id="${id}"><div class="yk-fold__body">
      <table class="yk-cmp"><colgroup><col class="c1"><col class="c2"><col><col class="c4"></colgroup>
        <tr><th>事務所</th>${head.map((h) => `<th>${h}</th>`).join("")}</tr>
${firms.map((f) => "        " + rowFn(f)).join("\n")}
      </table></div><label class="yk-fold__btn" for="${id}">もっと見る</label></div>`;
const compare = `<h2 class="yk-sec-ttl" id="compare"><em>6社</em>をまとめて比較</h2>
<div class="yk-tabs">
  <input type="radio" name="cmp1" id="cmp1-1" checked><input type="radio" name="cmp1" id="cmp1-2"><input type="radio" name="cmp1" id="cmp1-3">
  <div class="yk-tabs__labels"><label for="cmp1-1">総合</label><label for="cmp1-2">費用・範囲</label><label for="cmp1-3">相談しやすさ</label></div>
  <div class="yk-tabs__panels">
    <div>${cmpTable(["合計点", "ここが強い", "窓口"], tab1, "cmp1-more")}</div>
    <div>${cmpTable(["任意整理の費用", "対応手続き", "窓口"], tab2, "cmp2-more")}</div>
    <div>${cmpTable(["受付時間", "相談方法", "家族への配慮"], tab3, "cmp3-more")}</div>
  </div>
</div>`;

// C-2 2軸の早見表（横＝相談しやすさ：受付時間＋相談方法、縦＝バレにくさ・安心感：家族への配慮＋実績の公開）。点数から位置を決める
const mpos = (() => {
  const X = { 7: 18, 8: 34, 9: 50 }, Y = { 6: 86, 7: 74, 8: 64, 9: 48 }, used = {};
  return Object.fromEntries(firms.map((f) => {
    const sx = f.scores.hours + f.scores.method, sy = f.scores.family + f.scores.record;
    if (f.rank === 1) return [f.key, [70, 22]];
    let x = X[sx], y = Y[sy]; const k = x + "," + y; if (used[k]) x += used[k] % 2 ? -32 : 32; used[k] = (used[k] || 0) + 1;
    return [f.key, [x, y]];
  }));
})();
const matrix = `<h2 class="yk-sec-ttl" id="lawyer-vs">相談しやすさ×バレにくさは<br><em>はたの</em>が頭ひとつ抜けている</h2>
<div class="yk-matrix">
  <span class="yk-matrix__ax yk-matrix__ax--t">バレない対策・実績 ◎</span><span class="yk-matrix__ax yk-matrix__ax--b">配慮・実績の記載なし</span><span class="yk-matrix__ax yk-matrix__ax--l">相談 平日中心</span><span class="yk-matrix__ax yk-matrix__ax--r">毎日・夜も相談OK</span>
${firms.map((f) => f.rank === 1
    ? `  <div class="yk-matrix__item is-pick" style="--x:${mpos[f.key][0]}%;--y:${mpos[f.key][1]}%">${logo(f)}<ul><li>✔ 毎日9〜21時＋Web24時間</li><li>✔ 全国どこでも出張無料</li><li>✔ 郵便局留めで家族バレ対策</li><li>✔ 相談実績20万件以上</li></ul></div>`
    : `  <span class="yk-matrix__item" style="--x:${mpos[f.key][0]}%;--y:${mpos[f.key][1]}%">${logo(f)}</span>`).join("\n")}
</div>
<p class="yk-small">※横は「受付時間」「相談方法」、縦は「家族への配慮」「実績の公開」の採点の合計。</p>`;

// C-3 2社併用のすすめ
const combo = `<section class="yk-combo" id="choose"><h2 class="yk-combo__ttl">分かれ目は<em>140万円</em>！<br><em>はたの</em>×<em>東京ロータス</em>で<br>取りこぼしなし</h2>
${[["hatano", "どの会社も140万円以下なら、はたの", [["着手金0円・毎日21時まで電話OK", "相談料・着手金は無料。平日も土日祝も9時〜21時に受付、Webは24時間。"], ["郵便物を郵便局留めにできる", "携帯への連絡や郵便局留めで、家族や職場にバレない対応が可能とFAQに記載。"]]], ["lotus", "140万円超・自己破産・個人再生なら、東京ロータス", [["弁護士で着手金1件5,500円〜", "公式の料金表に記載（税込）。司法書士のような1社140万円の上限もない。"], ["相談は何度でも無料・土日祝も受付", "土日・祝日も10時〜19時に電話できる。"]]]].map(([k, head, pts]) => `  <div class="yk-combo__card"><p class="yk-combo__head">${head}</p><span class="yk-combo__logo">${logo(F[k])}</span><a class="yk-combo__link" href="#firm-${k}">${F[k].name}</a>
    <ul class="yk-combo__points">${pts.map(([b, t]) => `<li><b>${b}</b><br>${t}</li>`).join("")}</ul>
    <p class="yk-catch">${CATCH}</p>${cta(F[k], "無料相談", "yk-btn", "combo")}</div>`).join("\n")}
<p>どちらも相談は無料。<b>借入額が分からなければ両方に相談して、費用と方針を比べてから決めるのがいちばん確実です。</b></p>
</section>`;

// D ランキング
const radar = (f) => `<div class="yk-radar" data-name="${f.short}" data-labels="${AXES.map((a) => a.label).join(",")}" data-scores="${AXES.map((a) => f.scores[a.key]).join(",")}"></div>
<p class="yk-small yk-radar__note">※編集部の採点 ${total(f)}/30点</p>`;
const infoTable = (f) => `<table class="yk-info"><tr><th>相談料</th><th>対応エリア</th></tr><tr><td>無料</td><td>${f.info.area}</td></tr><tr><th>事務所の種類</th><th>受付時間</th></tr><tr><td>${f.type}</td><td class="is-left">${f.info.hours}</td></tr><tr><th colspan="2">対応手続き</th></tr><tr><td class="is-left" colspan="2">${f.info.procs}${f.info.place ? `<small>所在地：${f.info.place}</small>` : ""}</td></tr></table>`;
const jobex = (f) => f.cases.length
  ? `<p class="yk-hint">横にスクロールできます</p><div class="yk-hscroll">${f.cases.map((c, i) => `<div class="yk-jobex"><p class="yk-jobex__ttl">解決事例${i + 1}</p><ul class="yk-tags yk-tags--green"><li>${c.proc.split("（")[0]}</li><li>公式掲載</li></ul><table class="yk-kv"><tr><th>相談前</th><td>${c.before}</td></tr><tr><th>結果</th><td>${c.after}</td></tr></table><p class="yk-catch">${CATCH}</p>${cta(f, "無料相談", "yk-btn yk-btn--sm", "case")}<span class="yk-jobex__logo">${logo(f, "")}</span></div>`).join("")}</div>`
  : `<table class="yk-info"><tr><th>手続き</th><th>費用（税込・公式）</th></tr>${f.fees.map(([k, v]) => `<tr><td>${k}</td><td class="is-left">${v}</td></tr>`).join("")}</table>`;
const voice = (f) => (f.voices ? `<h4 class="yk-voice__ttl">${f.short}の口コミ</h4>
<ul class="yk-voice">${f.voices.map((v) => `<li><div class="yk-voice__who">${icon(v.face, "yk-voice__face")}${v.who}</div><p>${v.text}</p></li>`).join("")}</ul>
<p class="yk-small">※公式サイト掲載のコメントを要約。個人の感想です。</p>` : "");
const rankBlock = (f) => `<div class="yk-rankarea" id="firm-${f.key}"><h3 class="yk-rankhead">${medal(f.rank)}${f.name}</h3><p class="yk-rankcatch">${f.catch}</p>
<div class="yk-tabs">
  <input type="radio" name="rk${f.rank}" id="rk${f.rank}-1" checked><input type="radio" name="rk${f.rank}" id="rk${f.rank}-2"><input type="radio" name="rk${f.rank}" id="rk${f.rank}-3">
  <div class="yk-tabs__labels"><label for="rk${f.rank}-1">イチオシ<br>ポイント</label><label for="rk${f.rank}-2">基本情報</label><label for="rk${f.rank}-3">${f.cases.length ? "解決<br>事例" : "費用の<br>目安"}</label></div>
  <div class="yk-tabs__panels" style="background:#fff;padding:10px">
    <div>${shot(f)}<p class="yk-catch">${CATCH}</p>${cta(f, "無料相談", "yk-btn", "tab")}
      <div class="yk-features"><p class="yk-features__ttl">特徴</p><ul>${f.features.map(([t]) => `<li><span>${t}</span></li>`).join("")}</ul></div></div>
    <div>${radar(f)}${infoTable(f)}</div>
    <div>${jobex(f)}</div>
  </div>
</div>
<div class="yk-editor"><p class="yk-editor__ttl">編集部の<em>イチオシ</em>ポイント</p>${icon("editor", "yk-editor__chara", "編集部")}<div class="yk-editor__body"><p>${f.editor}</p>${f.choose ? `<p><b>こんな人に：</b>${f.choose.join("／")}</p><p>${f.other.map(([c, k]) => `${c}なら<a href="#firm-${k}"><b>${F[k].short}</b></a>へ。`).join("")}</p>` : ""}</div></div>
${voice(f)}
<div class="yk-btnpair">${f.page ? `<a class="yk-btn yk-btn--sub" href="/${f.key}/">詳細は<br>こちら</a>` : `<a class="yk-btn yk-btn--sub" href="#compare">比較表<br>に戻る</a>`}<div><p class="yk-catch">${CATCH}</p>${cta(f, "無料相談", "yk-btn", "pair")}</div></div>
</div>`;
const ranking = `<h2 class="yk-sec-ttl" id="ranking">債務整理の相談先<em>ランキング</em></h2>
<p class="yk-small" id="firms" style="text-align:center">受付時間・相談方法・初期費用・対応手続き・家族への配慮・実績の6項目で採点</p>
${firms.slice(0, 3).map(rankBlock).join("\n")}
<div class="yk-fold site-rankfold"><input type="checkbox" id="rank-more"><div class="yk-fold__body">
${firms.slice(3).map(rankBlock).join("\n")}
</div><label class="yk-fold__btn" for="rank-more">4位〜6位を見る</label></div>`;

// E-1 迷ったらまずは
const pickup = `<section class="yk-pickup" id="faq"><h2 class="yk-pickup__ttl"><small>迷ったらまずは</small><br>この<em>2社</em>に相談すれば安心！</h2>
<ul class="yk-pickup__list">
${["hatano", "lotus"].map((k) => `  <li class="yk-pickup__item"><p class="yk-pickup__name">${F[k].short}</p><img class="yk-pickup__img site-pickimg" src="/images/official/${k}.webp" alt="${F[k].name}の公式サイトの画面" width="960" height="600" loading="lazy"><p class="yk-pickup__text">${k === "hatano" ? "<b>140万円以下の任意整理</b>ならここ。着手金0円・毎日21時まで電話OK。" : "<b>140万円超・自己破産・個人再生</b>ならここ。弁護士で着手金5,500円〜。"}</p><p class="yk-catch">${CATCH}</p>${cta(F[k], "無料相談", "yk-btn yk-btn--sm", "pickup")}</li>`).join("\n")}
</ul></section>`;

// E-2 診断（ブラウザー内で判定）
const finder = `<form class="yk-finder" id="situations" action="#ranking"><p class="yk-finder__ttl">債務整理<br><em>相談先</em>診断</p>
  <label class="yk-finder__row">今の状況<select name="s"><option value="nini">毎月の返済を減らしたい</option><option value="kabarai">払いすぎた利息が気になる</option><option value="saisei">家を残して借金を減らしたい</option><option value="hasan">返済を続けるのが難しい</option></select></label>
  <label class="yk-finder__row">借入の額<select name="a"><option value="small">どの会社も140万円以下</option><option value="big">140万円を超える会社がある</option><option value="unknown">分からない</option></select></label>
  <fieldset><legend>当てはまるもの</legend><div class="yk-finder__checks"><label><input type="checkbox" name="text">電話より文字（LINE）で相談したい</label><label><input type="checkbox" name="cost">費用を抑えたい</label><label><input type="checkbox" name="weekend">夜・土日に相談したい</label><label><input type="checkbox" name="family">家族に知られたくない</label></div></fieldset>
  <button class="yk-finder__submit" type="submit">あなたの相談先を見る</button>
  <div class="site-finder-result" id="finder-result" aria-live="polite"></div>
</form>`;
const FINDER_DATA = Object.fromEntries(firms.slice(0, 3).map((f) => [f.key, { name: f.short, href: href(f) }]));
const FINDER_JS = `<script>
(function () {
  var D = ${JSON.stringify(FINDER_DATA)};
  var form = document.getElementById('situations'), out = document.getElementById('finder-result');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var s = form.s.value, a = form.a.value, lawyer = s === 'saisei' || s === 'hasan' || a === 'big', text = form.text.checked, r = [];
    if (lawyer) {
      r = text ? [['hibari', 'LINE・匿名フォームで文字から相談できる弁護士。' + (a === 'big' ? '140万円を超える借入' : '自己破産・個人再生') + 'も任せられます。'], ['lotus', '費用を抑えたいならこちら。弁護士で任意整理の着手金1件5,500円〜。']]
                 : [['lotus', (a === 'big' ? '1社140万円を超える借入' : '自己破産・個人再生') + 'は弁護士の出番。着手金1件5,500円〜、相談は何度でも無料。'], ['hibari', '電話が苦手ならこちら。LINE・匿名フォームで相談できる弁護士。']];
    } else {
      r = text ? [['hibari', 'LINE・匿名フォームで、今すぐ文字で相談を始められます。'], ['hatano', '電話できるなら、毎日21時まで受付・着手金0円のはたのも。']]
                 : [['hatano', '着手金0円・毎日21時まで電話OK・全国出張無料。' + (form.family.checked ? '郵便局留めなどで家族バレ対策も。' : '') + 'まずはここから。'], ['lotus', a === 'unknown' ? '1社でも140万円を超えていたら、弁護士の東京ロータスへ。' : (form.cost.checked ? '弁護士に安く任せたいならこちら。着手金1件5,500円〜。' : '弁護士にも話を聞きたいならこちら。相談は何度でも無料。')]];
    }
    out.innerHTML = '<p class="yk-listbox__ttl">あなたにおすすめの相談先</p>' + r.map(function (x, i) { var d = D[x[0]]; return '<p class="yk-numh"><span>' + (i ? 'こちらも' : 'おすすめ') + '</span>' + d.name + '</p><p>' + x[1] + '</p><div class="yk-btnpair"><a class="yk-btn yk-btn--sub" href="#firm-' + x[0] + '">詳しく<br>見る</a><div><p class="yk-catch">相談料0円</p><a class="yk-btn" href="' + d.href + '" rel="sponsored nofollow" referrerpolicy="no-referrer-when-downgrade" onclick="return gtagSendEvent(this.href)">無料相談</a></div></div>'; }).join('');
    out.scrollIntoView({ block: 'nearest' });
  });
})();
</script>`;

const MONTH_JS = `<script>
(function () { var t = document.querySelector('time[data-month]'); if (!t) return; var d = new Date(Date.now() + (new Date().getTimezoneOffset() + 540) * 60000); t.textContent = d.getFullYear() + '年' + (d.getMonth() + 1) + '月'; t.setAttribute('datetime', d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')); })();
</script>`;

const LD = [
  { "@context": "https://schema.org", "@type": "Article", headline: TITLE, description: DESC, mainEntityOfPage: `${ORIGIN}/`, dateModified: UPDATED_ISO, author: { "@type": "Organization", name: `${SITE} 編集部` }, publisher: { "@type": "Organization", name: SITE } },
];

const index = `${head({ title: TITLE, desc: DESC, url: `${ORIGIN}/`, ld: LD })}
<body>
<div class="yk-body site-wrap">
${fv}
${logos}
${best3}
${top2}
${genre}
${compare}
${matrix}
${combo}
${ranking}
${pickup}
${finder}
${footer}
</div>
${firms.map(pixel).join("")}
${RADAR_JS}
${FINDER_JS}
${MONTH_JS}
</body>
</html>
`;

/* ================= 個別ページ（パーツ集の個別ページの流れ） ================= */
const DETAIL = {
  hatano: {
    strengths: [
      ["相談料・着手金0円で始められる", "公式トップで相談料・着手金の無料を案内しています。任意整理の基本報酬は1社22,000円〜、減額報酬は11％（税込）。契約時に報酬の内訳書で説明すると料金ページに書かれています。", "https://hikari-hatano.com/houshu/"],
      ["毎日21時まで電話・全国どこでも出張無料", "電話は平日も土日祝も9:00〜21:00、Webは24時間受け付けています。全国出張の料金は無料で、事務所に行けない人も相談できます。", "https://hikari-hatano.com/houshu/"],
      ["家族や職場にバレない対応を具体的に説明", "FAQでは、携帯電話に連絡する・郵便物を郵便局留めにして自宅に届かないようにするなど、相談に応じてバレないように対応できると答えています。司法書士に依頼すれば債権者は本人に直接連絡できなくなるため、会社に連絡が行くこともないと説明しています。", "https://hikari-hatano.com/qa/"],
    ],
    forWho: ["平日の昼は電話しにくく、夜や土日に相談したい", "家族や職場に知られずに任意整理したい", "事務所に行けないので、出張で相談したい"],
    steps: [["無料相談（最短即日）", "メールか電話で相談する。専門の相談員が対応する"], ["解決方法の提案", "今の借金の状況を伝え、合う手続きの提案を受ける"], ["受任契約・受任通知で取り立てが止まる", "契約すると各金融会社に受任通知が送られ、取り立てがストップする"], ["預かり金の積立と和解交渉", "取り立てが止まっている間（約5〜6か月）に返済分を積み立て、事務所が和解交渉をする"]],
    faqSrc: "https://hikari-hatano.com/qa/",
    faq: [["家族に内緒で債務整理できる？", "可能です。家族が保証人・連帯保証人になっていない限り、家族に請求が行くことはありません。自己破産や個人再生では家族の収入の書類を求められることがあり、知られる可能性があります。"], ["会社にばれる？", "司法書士や弁護士に依頼すると、債権者は本人に直接連絡できなくなるため、会社に連絡が行くことはありません。"], ["催促は本当に止まる？", "依頼すると貸金業者に受任通知が送られ、取り立てができなくなるため催促は止まります。"]],
  },
  hibari: {
    strengths: [
      ["4つの手続きすべてを弁護士が代理", "任意整理・個人再生・自己破産・過払い請求を取扱業務として掲載しています。借入が1社140万円を超える場合や、裁判所の手続きが必要な場合も弁護士に任せられます。", "https://hibari-law.net/fee/"],
      ["家族に内緒で進められるかを具体的に説明", "FAQでは、任意整理なら依頼する債権者を選べるため、家族が保証人のものなどを外して内緒のまま進められる場合があると説明しています。一方で、自己破産・個人再生は全債権者が対象になり、家族の協力が必要な場合があることも書かれています。郵便物に事務所名を入れない対応も可能です。", "https://hibari-law.net/faq/"],
      ["費用は分割で支払える", "受任通知を送ると返済を一時的に止められ、和解交渉までの間に弁護士費用を分割で支払う流れがFAQに書かれています。", "https://hibari-law.net/faq/"],
    ],
    forWho: ["どの手続きが合うか分からず、まず弁護士に整理してほしい", "家族に知られずに進められるか確かめたい", "1社140万円を超える借入がある"],
    steps: [["無料相談を申し込む", "電話（平日10:00〜19:00）・メール・LINEで申し込む。土日も予約制で相談できる"], ["委任契約を結ぶ", "相談で方針と費用を確認してから依頼する"], ["受任通知で返済が一時止まる", "弁護士が債権者へ受任通知を送ると、債権者からの直接の連絡・取り立てがなくなる"], ["手続きと費用の分割払い", "和解交渉までの間に弁護士費用を分割で支払い、和解後に返済を始める"]],
    faqSrc: "https://hibari-law.net/faq/",
    faq: [["支払い日が迫っているがどうしたらいい？", "委任契約を結び、債権者へ受任通知を発送した後は、債権者への返済を一時的に止めることができます。"], ["裁判所から書類が届いた", "期日に出廷せず答弁書も出さないと、判決が下され給料などを差し押さえられる危険があります。和解して分割弁済することで差押えを避けられる場合もあるので、早急に相談してください。"], ["家族に内緒で手続きできる？", "任意整理は依頼する債権者を選べるため、内緒のまま進められる場合があります。自己破産・個人再生は全債権者が対象のため、借入に家族が関係していると内緒にはできません。"]],
  },
  lotus: {
    strengths: [
      ["任意整理の着手金が1件5,500円〜", "料金表で、任意整理は着手金1件5,500円〜、報酬金1件0円〜11,000円（税込）と公開しています。債務額・件数で変わるため、詳細は問い合わせで確認します。", "http://tokyo-lawtas.com/service.php"],
      ["相談は何度でも無料・土日祝も受付", "相談費用は何度でも無料。電話は土日・祝日も10時〜19時に受け付け、携帯電話からも通話料はかかりません。メールフォームからも申し込めます。", "http://tokyo-lawtas.com/service.php"],
      ["設立当初から債務整理に注力", "事務所設立当初から債務整理のご依頼に力を入れてきたと公式サイトで説明しています。相談事例として、248万円の債務が50万円に減り、毎月の返済が10万円から2万円になった例などを掲載しています。", "http://tokyo-lawtas.com/case.php"],
    ],
    forWho: ["任意整理の費用をできるだけ抑えたい", "平日は忙しく、土日祝に電話で相談したい", "何度か相談してから決めたい"],
    steps: [["電話かメールで相談を申し込む", "フリーダイヤルは土日祝も10時〜19時。メールフォームもある"], ["無料相談（何度でも無料）", "債務状況や借金を負った経緯を具体的に伝える"], ["依頼・手続き開始", "自己破産・個人再生などは来所が必要"], ["和解・返済", "和解後の返済方法を確認する"]],
    faqSrc: "http://tokyo-lawtas.com/service.php",
    faq: [["相談にお金はかかる？", "相談費用は何度でも無料です。電話代もかかりません。"], ["土日でも相談できる？", "土日・祝日も10時〜19時に電話で対応しています。"], ["事務所に行く必要はある？", "自己破産・個人再生などの場合は来所をお願いしている、と公式サイトに記載があります。"]],
  },
  earth: {
    strengths: [
      ["任意整理は1社11,000円〜", "基本報酬は取引中の会社で1社11,000円〜（税込）、完済分は1社0円です。別途、実費・交通費がかかります。", "https://www.earth-shiho.com/price.html"],
      ["減額報酬・オプション報酬なし", "「オプション費用や減額報酬は一切いただいておりません」と料金ページに記載しています。過払い金の報酬は訴訟なしで回収額の20％、訴訟ありで25％です。", "https://www.earth-shiho.com/price.html"],
      ["全国から相談できる", "相談可能エリアとして北海道から沖縄まで全都道府県を掲載しています。受任の際は必ず本人と面談します。", "https://www.earth-shiho.com/area/index.html"],
    ],
    forWho: ["借入はどの会社も140万円以下で、任意整理を考えている", "減額報酬のない分かりやすい料金で頼みたい", "完済した借入の過払い金を調べたい"],
    steps: [["無料相談を申し込む", "電話（平日9:30〜18:00）またはメール（24時間受付）。土曜・夜間は事前予約"], ["本人と面談", "受任の際は必ず本人と面談する"], ["ご契約", "公式サイトの「ご契約の流れ」で手順を確認できる"], ["任意整理・過払い請求の手続き", "受任すると取り立てが止まる、と公式サイトに記載"]],
    faqSrc: "https://www.earth-shiho.com/price.html",
    faq: [["司法書士に頼める範囲は？", "法律相談は司法書士法3条1項6号・8号に定められた事項に限られます。1社あたり140万円を超える案件や、個人再生・自己破産の申立ての代理はできません。"], ["減額報酬はかかる？", "減額報酬・オプション報酬は受け取らないと料金ページに記載されています。"], ["遠方でも相談できる？", "全国の相談可能エリアを掲載しています。受任の際は本人との面談が必要です。"]],
  },
};

const detailPage = (f) => {
  const d = DETAIL[f.key];
  const body = `<nav class="yk-crumb"><a href="/">TOP</a><span>${f.short}</span></nav>
<p class="yk-pr"><b>PR</b><span>本ページはプロモーションを含みます。</span></p>
<p class="yk-svchead__name">${f.name}</p><p class="yk-svchead__catch">${f.catch}</p>
<div class="yk-svchead__grid"><div class="yk-features"><p class="yk-features__ttl">特徴</p><ul>${f.features.slice(0, 3).map(([t]) => `<li><span>${t}</span></li>`).join("")}</ul></div><img class="yk-svchead__img" src="/images/official/${f.key}.webp" alt="${f.name}の公式サイトの画面" width="960" height="600"></div>
${infoTable(f)}
<p class="yk-catch">${CATCH}</p>${cta(f, "無料相談", "yk-btn", "detail-top")}

<h2 class="yk-sec-ttl">${f.short}の<em>強み</em></h2>
${shot(f)}
<div class="yk-order"><p class="yk-order__ttl">${f.short}の強み</p><ol>${d.strengths.map(([t], i) => `<li><span>強み${i + 1}</span><a href="#s${i + 1}">${t}</a></li>`).join("")}</ol></div>
${d.strengths.map(([t, x, s], i) => `<h3 class="yk-numh" id="s${i + 1}"><span>強み${i + 1}</span>${t}</h3>\n<p>${x}</p>`).join("\n")}
<p class="yk-catch">${CATCH}</p>${cta(f, "無料相談", "yk-btn", "detail-strength")}

<h2 class="yk-sec-ttl">こんな方に<em>おすすめ</em></h2>
<figure class="mt-img">${photo("calc")}<figcaption class="mt-img__note">写真：Unsplash</figcaption></figure>
<div class="yk-listbox"><p class="yk-listbox__ttl">${f.short}が向いている人</p><ul>${d.forWho.map((x) => `<li>${x}</li>`).join("")}</ul></div>

<h2 class="yk-sec-ttl">相談から<em>手続き</em>までの流れ</h2>
<div class="yk-order"><p class="yk-order__ttl">利用の流れ</p><ol>${d.steps.map(([t], i) => `<li><span>ステップ${i + 1}</span><a href="#step${i + 1}">${t}</a></li>`).join("")}</ol></div>
${d.steps.map(([t, x], i) => `<h3 class="yk-numh" id="step${i + 1}"><span>ステップ${i + 1}</span>${t}</h3>\n<p>${x}</p>`).join("\n")}
<figure class="mt-img">${photo("phone")}<figcaption class="mt-img__note">写真：Unsplash</figcaption></figure>
<p class="yk-catch">${CATCH}</p>${cta(f, "無料相談", "yk-btn", "detail-flow")}

<h2 class="yk-sec-ttl">${f.cases.length ? "公式サイトの<em>解決事例</em>" : "費用の<em>目安</em>"}</h2>
${jobex(f)}

<h2 class="yk-sec-ttl">よくある<em>質問</em></h2>
<div class="yk-order"><p class="yk-order__ttl">よくある質問</p><ol>${d.faq.map(([q], i) => `<li><span>質問${i + 1}</span><a href="#q${i + 1}">${q}</a></li>`).join("")}</ol></div>
${d.faq.map(([q, a], i) => `<h3 class="yk-numh" id="q${i + 1}"><span>質問${i + 1}</span>${q}</h3>\n<p>${a}</p>`).join("\n")}
<p class="yk-small">出典：<a href="${d.faqSrc}" rel="nofollow noopener" target="_blank">${f.short}公式サイト</a>の記載を要約（${CHECKED}確認）</p>
<p class="yk-catch">${CATCH}</p>${cta(f, "無料相談", "yk-btn", "detail-faq")}
<p class="site-back"><a class="yk-btn yk-btn--sub" href="/#ranking">6社のランキングに戻る</a></p>`;
  return `${head({ title: `${f.name}の費用・特徴｜${SITE}`, desc: `${f.name}の相談料・費用・受付時間・強みを公式サイトの記載をもとにまとめました。`, url: `${ORIGIN}/${f.key}/` })}
<body>
<div class="yk-body site-wrap">
${body}
${footer}
</div>
${pixel(f)}
</body>
</html>
`;
};

/* ================= 調査概要・運営者・プライバシー ================= */
const sub = (slug, ttl, body) => `${head({ title: `${ttl}｜${SITE}`, desc: `${SITE}の${ttl}です。`, url: `${ORIGIN}/${slug}/`, noindex: slug !== "ranking" })}
<body>
<div class="yk-body site-wrap">
<nav class="yk-crumb"><a href="/">TOP</a><span>${ttl}</span></nav>
<h1 class="yk-sec-ttl">${ttl}</h1>
${body}
${footer}
</div>
</body>
</html>
`;

const rankingPage = sub("ranking", "ランキング調査概要", `<div class="yk-order"><p class="yk-order__ttl">この調査について</p><ol><li><span>対象</span><a href="#target">比較した6社</a></li><li><span>順位</span><a href="#order">掲載順の決め方</a></li><li><span>採点</span><a href="#axes">6項目の採点基準</a></li><li><span>根拠</span><a href="#basis">各社の採点と根拠</a></li></ol></div>
<h2 class="yk-numh" id="target"><span>対象</span>比較した6社</h2>
<p>債務整理（任意整理・個人再生・自己破産・過払い金請求）の無料相談を受け付けている弁護士法人・司法書士事務所6社。各社の公式サイトを${CHECKED}に確認し、ロゴ・画面は同日に撮影しました。</p>
<h2 class="yk-numh" id="order"><span>順位</span>掲載順の決め方</h2>
<p>掲載順は、下の<b>6項目の合計点の順</b>です（6社とも点数が異なり、同点はありません）。当サイトは${firms.filter((f) => f.asp).length}社（${firms.filter((f) => f.asp).map((f) => f.short).join("・")}）と提携していますが、提携の有無で点数は変えていません。掲載順は品質や優劣を保証するものではありません。</p>
<h2 class="yk-numh" id="axes"><span>採点</span>6項目の採点基準</h2>
<p>各項目を公式サイトの記載だけで判定し、◎＝5点・○＝4点・△＝3点（30点満点）。星は1項目あたりの平均点（四捨五入）、総合評価は27点以上＝S、24点以上＝A、それ未満＝B。</p>
<table class="yk-info">${AXES.map((a) => `<tr><th>${a.label}</th><td class="is-left">${a.rule}</td></tr>`).join("")}</table>
<h2 class="yk-numh" id="basis"><span>根拠</span>各社の採点と根拠</h2>
${firms.map((f) => `<div class="yk-listbox"><p class="yk-listbox__ttl">${f.rank}位 ${f.name}（${total(f)}/30点・総合評価${grade(total(f))}）</p><ul>${AXES.map((a) => `<li>${a.label}：${MARU_CHAR[f.scores[a.key]]} ${f.basis[a.key][0]}（${srcLabel(f.basis[a.key][1])}）</li>`).join("")}</ul></div>`).join("\n")}
<p class="yk-small">ASP提供バナー：アクセストレードで提携先が提供している広告素材の表記です。</p>`);

const operator = sub("operator", "運営者情報", `<table class="yk-info"><tr><th>運営者</th><td class="is-left">${SITE} 編集部</td></tr><tr><th>お問い合わせ</th><td class="is-left"><a href="mailto:securewebtech6676@gmail.com">securewebtech6676@gmail.com</a></td></tr><tr><th>事業内容</th><td class="is-left">Webメディア運営<br>オンライン広告企画・運用代行</td></tr><tr><th>URL</th><td class="is-left">${ORIGIN}/</td></tr></table>
<div class="yk-listbox"><p class="yk-listbox__ttl">広告掲載について</p><ul><li>当サイトは提携企業様のサービスを紹介するにあたり、広告契約に基づき掲載を行っております。</li><li>本サイトは法律相談・法的助言ではなく、一般的な情報提供を目的としています。</li><li>掲載情報は各事務所の公式サイトの記載をもとに作成しています。最新かつ正確な内容は、必ず各事務所に直接ご確認ください。</li></ul></div>`);

const privacy = sub("privacy", "プライバシーポリシー", `<p>当サイトでは、個人情報の取り扱いに対し、利用者からの信頼を最も重要視しております。個人情報保護法および関連法令・ガイドラインを遵守し、以下の方針に基づいて管理を行います。</p>
<h2 class="yk-numh"><span>1</span>個人情報の取得と利用目的</h2>
<p>当サイトでは、ユーザーが閲覧・利用する際に以下の目的で情報を収集する場合があります。</p>
<div class="yk-listbox"><ul><li>アクセス状況の解析やサービス向上のため</li><li>お問い合わせ対応</li><li>ターゲティング広告配信や利便性向上</li></ul></div>
<p>サービスの申し込み等により提携先企業で取得された個人情報について、当サイトでは一切取得・管理を行っておりません。</p>
<h2 class="yk-numh"><span>2</span>個人情報の管理体制</h2>
<p>収集した情報は正確かつ安全に管理され、不正アクセス・改ざん・漏洩・紛失などを防止するためのセキュリティ対策を徹底しています。</p>
<h2 class="yk-numh"><span>3</span>個人情報の第三者提供</h2>
<p>以下の場合を除き、取得した個人情報を第三者に提供・開示することはありません。</p>
<div class="yk-listbox"><ul><li>本人の同意がある場合</li><li>法令に基づき開示が必要と判断される場合</li><li>業務委託先へ提供が必要な範囲</li></ul></div>
<h2 class="yk-numh"><span>4</span>クッキー（Cookie）の利用</h2>
<p>当サイトでは、サイト機能向上・アクセス解析（Google Analytics）・外部広告サービス（Yahoo、Google等）による広告最適化のためCookieを使用しています。ブラウザ設定で制限・無効化が可能ですが、一部機能が正常に動作しない場合があります。</p>
<h2 class="yk-numh"><span>5</span>アクセス解析</h2>
<p>当サイトではGoogle Analyticsを使用し、匿名でサイト利用状況を収集・分析しています。</p>
<h2 class="yk-numh"><span>6</span>法令遵守と見直し</h2>
<p>当サイトは個人情報保護に関する日本の法令を遵守し、必要に応じて本ポリシーを見直し・改善いたします。</p>`);

const write = (rel, s) => { const p = path.join(OUT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
write("index.html", index);
for (const f of firms.filter((x) => x.page)) write(`${f.key}/index.html`, detailPage(f));
write("ranking/index.html", rankingPage);
write("operator/index.html", operator);
write("privacy/index.html", privacy);
write("CNAME", "saimu.navolio.net\n");
write(".nojekyll", "");
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n`);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["", ...firms.filter((x) => x.page).map((x) => x.key + "/"), "ranking/"].map((p) => `<url><loc>${ORIGIN}/${p}</loc><lastmod>${UPDATED_ISO}</lastmod></url>`).join("")}</urlset>\n`);
console.log("built", firms.map((f) => `${f.rank}.${f.key}=${total(f)}${grade(total(f))}`).join(" "));
