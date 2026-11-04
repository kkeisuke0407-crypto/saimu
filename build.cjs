// 借金スッキリnavi（https://saimu.navolio.net/）の生成スクリプト。
// 部品はすべて「薬剤師転職 比較・ランキング型」パーツ集（yk-*）。parts.css は正本の写しで直接直さない。
// 本文・事実は vpscomparehub.com/money/（tekito: src/pages/money/index.astro）の掲載文をそのまま使う。
// 使い方：node build.cjs → index.html / operator / privacy / ranking を作り直す（生成物を直接直さない）
const fs = require("fs");
const path = require("path");
const OUT = __dirname;

const SITE = "借金スッキリnavi";
const ORIGIN = "https://saimu.navolio.net";
const TITLE = "債務整理に強い相談先おすすめ3選｜無料相談・費用・全国対応で比較";
const DESC = "債務整理の相談先を相談料・費用・全国対応・分割払い・家族や職場への配慮で比較。任意整理・個人再生・自己破産の違いや選び方、督促が止まる仕組みもわかりやすく整理しました。";
const UPDATED = "2026年11月";          // 実際に見直した月
const UPDATED_ISO = "2026-11-04";
const GA4 = "G-2YLF06DC0E";
const AW = "AW-18129603657";

/* アフィリエイトリンク（差し替えはここだけ） */
const firms = [
  {
    key: "hibari", rank: 1, type: "弁護士法人", name: "弁護士法人ひばり法律事務所", short: "ひばり法律事務所",
    rk: "0100l3sc00orwh",
    catch: "任意整理から自己破産まで幅広く対応", badge: "初めての相談に",
    fee: "無料", area: "全国対応", methods: "任意整理 / 個人再生 / 自己破産 / 過払い金",
    points: ["債務整理の全手続きに対応していて相談しやすい", "全国対応・相談料は無料", "分割払いの相談OK・家族への連絡方法も配慮"],
    feeCheck: "着手金・報酬の内訳を相談時に確認しましょう",
    forWho: "初めて相談する人・どの手続きが合うか迷っている人",
    caution: "具体的な費用は借入状況により異なるため、相談時に必ず確認を",
    bannerAlt: "弁護士法人ひばり法律事務所",
  },
  {
    key: "lotus", rank: 2, type: "弁護士法人", name: "弁護士法人東京ロータス法律事務所", short: "東京ロータス法律事務所",
    rk: "0100jqb500orwh",
    catch: "債務整理全般に対応・相談しやすさが魅力", badge: "費用を抑えたい人に",
    fee: "無料", area: "全国対応", methods: "任意整理を中心に債務整理全般",
    points: ["任意整理を中心に債務整理全般へ対応", "全国対応・何度でも相談しやすい体制", "郵送物への配慮など家族にバレにくい工夫"],
    feeCheck: "分割払いの可否・総額の目安を相談時に確認しましょう",
    forWho: "費用を抑えて相談したい人",
    caution: "対応可否・費用は事案により異なるため要確認",
    bannerAlt: "弁護士法人東京ロータス法律事務所[債務整理]",
  },
  {
    key: "earth", rank: 3, type: "司法書士法人", name: "アース司法書士事務所", short: "アース司法書士事務所",
    rk: "0100p36600orwh",
    catch: "任意整理・過払い金に強い・費用がわかりやすい", badge: "任意整理を中心に相談したい人に",
    fee: "無料", area: "全国対応 ※", methods: "任意整理 / 過払い金請求",
    points: ["任意整理・過払い金に対応", "LINE相談OK・全国対応で来所不要も可", "1社あたりの費用がわかりやすい"],
    feeCheck: "1社あたりの費用・成功報酬の有無を確認しましょう",
    forWho: "任意整理を中心に相談したい人・費用を重視する人",
    caution: "司法書士が代理できるのは1社あたり140万円以下の案件です（自己破産・個人再生は申立ての代理ができません）",
    bannerAlt: "アース司法書士事務所",
  },
];
const cc = (f) => `https://h.accesstrade.net/sp/cc?rk=${f.rk}`;
const rr = (f) => `https://h.accesstrade.net/sp/rr?rk=${f.rk}`;
const byName = Object.fromEntries(firms.map((f) => [f.name, f]));

const compareRows = {
  "相談料": ["無料", "無料", "無料"],
  "着手金": ["相談時に確認", "相談時に確認", "相談時に確認"],
  "減額報酬": ["相談時に確認", "相談時に確認", "相談時に確認"],
  "対応手続き": ["任意整理/個人再生/自己破産", "任意整理中心", "任意整理/過払い金"],
  "全国対応": ["対応", "対応", "対応 ※"],
  "分割払い": ["相談可", "要相談", "相談可"],
  "土日・夜間": ["要予約", "要予約", "平日中心"],
  "家族/職場への配慮": ["連絡方法を相談可", "郵送物に配慮あり", "要相談"],
  "向いている人": ["初めて相談する人", "費用を抑えたい人", "任意整理中心の人"],
};

const situations = [
  { situation: "はじめて相談する・どの手続きが合うか迷う", firm: "弁護士法人ひばり法律事務所" },
  { situation: "個人再生・自己破産まで視野に入れたい", firm: "弁護士法人ひばり法律事務所" },
  { situation: "とにかく費用を抑えて相談したい", firm: "弁護士法人東京ロータス法律事務所" },
  { situation: "家族や職場に知られず進めたい", firm: "弁護士法人東京ロータス法律事務所" },
  { situation: "任意整理・過払い金を中心に相談したい", firm: "アース司法書士事務所" },
];

const proCompare = [
  { label: "代理できる範囲", lawyer: "金額の制限なし・全手続きに対応", shoshi: "1社あたり140万円以下の任意整理・過払い金など" },
  { label: "個人再生・自己破産の申立代理", lawyer: "対応できる", shoshi: "申立ての代理はできない" },
  { label: "向いている人", lawyer: "借入額が大きい・複雑な事案", shoshi: "借入額が小さめ・費用を重視したい人" },
];

const pains = [
  "毎月の返済で、生活費がほとんど残らない",
  "貸金業者からの督促や電話が止まらず落ち着かない",
  "複数の会社から借りていて、総額が把握できていない",
  "リボ払いの残高がなかなか減らない",
  "家族や職場に知られず、こっそり相談したい",
  "相談したいけれど、費用が払えるか不安",
];

const solvable = [
  { title: "毎月の返済がきつい", desc: "将来利息のカットや返済計画の見直しを相談できます" },
  { title: "督促・取り立てが怖い", desc: "受任通知が届くと、原則として直接の督促は止まります" },
  { title: "複数社からの借入", desc: "借入全体を整理し、返済を一本化できる場合があります" },
  { title: "リボ・将来利息を減らしたい", desc: "条件によっては利息や総返済額を抑えられます" },
  { title: "過払い金が気になる", desc: "過去の取引内容によっては返還を請求できる場合があります" },
  { title: "家族に知られたくない", desc: "連絡方法や郵送物への配慮を相談できる事務所もあります" },
];

const debtTypes = [
  { name: "任意整理", tag: "もっとも利用しやすい", summary: "貸金業者と直接交渉し、将来利息のカットなどで返済しやすくする方法。", merit: "財産を手放さずに済みやすく、手続きが比較的かんたん。家族に知られにくい。", demerit: "元本そのものは原則として減らない。信用情報に一定期間登録される。" },
  { name: "個人再生", tag: "住宅を残したい人向け", summary: "裁判所を通じて借金を大きく圧縮し、原則3〜5年で返済していく方法。", merit: "住宅ローン特則を使えば、家を残せる可能性がある。借金を大幅に減らせる場合がある。", demerit: "手続きが複雑で、官報に掲載される。信用情報に一定期間登録される。" },
  { name: "自己破産", tag: "返済が難しい人向け", summary: "裁判所に申し立て、免責が認められると返済義務が免除される方法。", merit: "返済義務が原則なくなり、生活の立て直しを図りやすい。", demerit: "一定以上の財産は処分対象になる。一部資格の制限・官報掲載・信用情報への登録がある。" },
];

const chooseChecks = [
  { title: "費用が明確か", desc: "相談料・着手金・報酬・分割払いの可否を、契約前にはっきり説明してくれるか" },
  { title: "債務整理の対応範囲", desc: "任意整理だけか、個人再生・自己破産まで対応できるか。借入額や状況に合うか" },
  { title: "説明が丁寧か", desc: "メリットだけでなく、デメリットやリスクまで説明してくれるか" },
  { title: "連絡方法・秘密への配慮", desc: "家族や職場に知られにくいよう、連絡方法や郵送物を相談できるか" },
  { title: "相談のしやすさ", desc: "無料相談・全国対応・予約のしやすさなど、続けて相談しやすいか" },
];

const faqs = [
  { q: "家族に知られずに相談できる？", a: "弁護士・司法書士には守秘義務があり、本人の同意なく家族へ連絡することはありません。郵送物や電話の方法を相談できる事務所もあります。ただし状況によっては完全に知られないとは限らないため、心配な点は相談時に確認しましょう。" },
  { q: "職場に借金がバレる？", a: "任意整理では、原則として職場に連絡が行くことはありません。手続きの種類や状況により異なる場合があるため、不安な点は相談時に確認してください。" },
  { q: "相談したら督促は止まる？", a: "依頼して受任通知が各債権者に送られると、貸金業法により、貸金業者からの直接の督促や取り立ては原則として止まります。止まるタイミングや対象は事務所に確認しましょう。" },
  { q: "費用が払えなくても相談できる？", a: "相談料が無料の事務所が多く、費用の分割払いに対応している場合もあります。収入などの条件を満たせば、法テラス（日本司法支援センター）の費用立替制度を利用できることもあります。支払い方法は相談時に確認しましょう。" },
  { q: "ブラックリストに載る？", a: "債務整理を行うと、信用情報機関に事故情報として一定期間登録され、その間は新たな借入やクレジットカードの作成が難しくなります。登録される期間は手続きや機関により異なります。" },
  { q: "司法書士と弁護士は何が違う？", a: "認定司法書士が代理できるのは1社あたり140万円以下の案件で、費用を抑えやすい一方、自己破産・個人再生の申立て代理はできません。弁護士は金額の制限がなく、すべての手続きや訴訟に対応できます。借入額や状況に応じて選びましょう。" },
  { q: "相談だけで契約しなくてもいい？", a: "相談だけで依頼しないことも可能です。費用や方針を聞いて比較したうえで、納得できる相談先を選んでください。" },
  { q: "複数の事務所に無料相談してもいい？", a: "問題ありません。相談料が無料であれば、複数に相談して費用や対応方針を比べたうえで依頼先を決められます。" },
];

const LEGAL = [
  "※本ページはPR・広告を含みます。掲載は提携に基づくものです。掲載順は当サイトの基準によるもので、品質や優劣を保証するものではありません。",
  "※本ページは法律相談・法的助言ではなく、一般的な情報提供を目的としています。",
  "※相談料・費用・対応可否・対応エリア・分割払いの可否などは変更される場合があります。最新かつ正確な内容は、必ず各事務所に直接ご確認ください。",
  "※債務整理を行うと信用情報に一定期間登録されるなどの影響があります。手続きの効果やリスクは個別の状況により異なります。",
];

/* ---------- 部品（yk-*）の組み立て ---------- */
const CATCH = "相談料0円・まずは話を聞くだけでもOK";
const out = (f, label, cls = "yk-btn") => `<a class="${cls}" href="${cc(f)}" rel="sponsored nofollow" referrerpolicy="no-referrer-when-downgrade" data-cta="${f.key}" onclick="return gtagSendEvent(this.href)">${label}</a>`;
const banner = (f, lazy = true) => `<a href="${cc(f)}" rel="sponsored nofollow" referrerpolicy="no-referrer-when-downgrade" data-cta="${f.key}-banner" onclick="return gtagSendEvent(this.href)"><img src="${rr(f)}" alt="${f.bannerAlt}" width="300" height="250"${lazy ? ' loading="lazy"' : ""}></a>`;
const medal = (r) => `<span class="yk-medal${r > 1 ? ` yk-medal--${r}` : ""}">${r}</span>`;

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
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/parts.css">
<link rel="stylesheet" href="/site.css">
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
${gtagHead}
</head>`;

const footer = `<footer class="yk-footer"><ul><li><a href="/operator/">運営者情報</a></li><li><a href="/ranking/">掲載順の基準（ランキング調査概要）</a></li><li><a href="/privacy/">プライバシーポリシー</a></li></ul><small>© 2026 ${SITE}</small></footer>`;

/* ---------- トップページ ---------- */
const best3 = `<section class="yk-best3"><h2 class="yk-best3__ttl"><em>債務整理</em>に強い相談先<em>BEST3</em></h2>
<ol class="yk-best3__list">
${firms.map((f) => `  <li class="yk-best3__item"><span class="yk-best3__crown">${f.rank}</span><p class="yk-best3__text"><b>${f.short}</b><br><span class="yk-red">${f.badge}</span><br><span class="yk-mark">${f.catch}</span></p><p class="yk-catch">相談料0円</p>${out(f, "無料相談", "yk-btn yk-btn--sm")}</li>`).join("\n")}
</ol></section>`;

const finder = `<form class="yk-finder" action="#ranking" id="finder"><p class="yk-finder__ttl">あなたの状況なら、<br><em>どこを見る？</em></p>
  <label class="yk-finder__row">今の状況<select name="s">
${situations.map((s, i) => `    <option value="${byName[s.firm].key}"${i === 0 ? " selected" : ""}>${s.situation}</option>`).join("\n")}
  </select></label>
  <button class="yk-finder__submit" type="submit">見ておきたい相談先を表示</button>
  <p class="yk-small" style="margin:.8em 0 0">迷ったときの目安です。最終判断は無料相談で確認しましょう。</p>
  <ul class="yk-chips">${situations.map((s) => `<li>${s.situation} → ${byName[s.firm].short}</li>`).join("")}</ul>
</form>`;

const firmCell = (f) => `<span class="yk-cmp__rank">${f.rank}</span><a class="yk-cmp__name" href="#firm-${f.key}">${f.short}</a><span class="yk-small" style="display:block">${f.type}</span>`;
const cmpTab = (cols) => `<table class="yk-cmp"><colgroup><col class="c1"><col class="c2"><col><col class="c4"></colgroup>
        <tr><th>事務所</th>${cols.map((c) => `<th>${c}</th>`).join("")}</tr>
${firms.map((f, i) => `        <tr${i === 0 ? ' class="is-pick"' : ""}><td>${firmCell(f)}</td>${cols.map((c) => `<td>${compareRows[c][i]}</td>`).join("")}</tr>`).join("\n")}
      </table>`;
const compare = `<div class="yk-tabs">
  <input type="radio" name="cmp1" id="cmp1-1" checked><input type="radio" name="cmp1" id="cmp1-2"><input type="radio" name="cmp1" id="cmp1-3">
  <div class="yk-tabs__labels"><label for="cmp1-1">総合</label><label for="cmp1-2">費用・支払い</label><label for="cmp1-3">対応・配慮</label></div>
  <div class="yk-tabs__panels">
    <div><table class="yk-cmp"><colgroup><col class="c1"><col class="c2"><col><col class="c4"></colgroup>
        <tr><th>事務所</th><th>相談料</th><th>対応手続き・向いている人</th><th>無料相談</th></tr>
${firms.map((f, i) => `        <tr${i === 0 ? ' class="is-pick"' : ""}><td>${firmCell(f)}</td><td>${compareRows["相談料"][i]}<br><span class="yk-pink">${compareRows["全国対応"][i] === "対応" ? "全国対応" : "全国対応 ※"}</span></td><td class="is-left">${compareRows["対応手続き"][i]}<ul class="yk-chips"><li class="is-pink">${compareRows["向いている人"][i]}</li></ul></td><td><p class="yk-catch">無料</p>${out(f, "確認", "yk-btn yk-btn--sm")}</td></tr>`).join("\n")}
      </table></div>
    <div>${cmpTab(["着手金", "減額報酬", "分割払い"])}</div>
    <div>${cmpTab(["全国対応", "土日・夜間", "家族/職場への配慮"])}</div>
  </div>
</div>
<p class="yk-small">※アース司法書士事務所：司法書士が代理できるのは1社あたり140万円以下の案件です（自己破産・個人再生は申立ての代理ができません）。費用・対応可否は事案により異なるため、相談時に確認してください。</p>`;

const rankBlock = (f) => `<div class="yk-rankarea" id="firm-${f.key}"><h3 class="yk-rankhead">${medal(f.rank)}${f.name}</h3><p class="yk-rankcatch">${f.catch}<br><span class="yk-small" style="color:inherit">${f.badge}</span></p>
<div class="yk-tabs">
  <input type="radio" name="rk${f.rank}" id="rk${f.rank}-1" checked><input type="radio" name="rk${f.rank}" id="rk${f.rank}-2"><input type="radio" name="rk${f.rank}" id="rk${f.rank}-3">
  <div class="yk-tabs__labels"><label for="rk${f.rank}-1">イチオシ<br>ポイント</label><label for="rk${f.rank}-2">基本情報</label><label for="rk${f.rank}-3">確認<br>ポイント</label></div>
  <div class="yk-tabs__panels" style="background:#fff;padding:10px">
    <div><p class="site-banner">${banner(f)}</p><p class="yk-catch">${CATCH}</p>${out(f, "この相談先の<br>無料相談を確認する")}
      <div class="yk-features"><p class="yk-features__ttl">特徴</p><ul>
${f.points.map((p) => `        <li><span>${p}</span></li>`).join("\n")}
        <li><span class="yk-red">${f.caution}</span></li>
      </ul></div></div>
    <div><table class="yk-info"><tr><th>相談料</th><th>対応エリア</th></tr><tr><td>${f.fee}</td><td>${f.area}</td></tr><tr><th colspan="2">対応手続き</th></tr><tr><td colspan="2">${f.methods}</td></tr><tr><th colspan="2">向いている人</th></tr><tr><td class="is-left" colspan="2">${f.forWho}</td></tr></table></div>
    <div><div class="yk-listbox"><p class="yk-listbox__ttl">相談前に確認しておきたいこと</p><ul><li>${f.feeCheck}</li><li>${f.caution}</li></ul></div></div>
  </div>
</div>
<div class="yk-editor"><p class="yk-editor__ttl">編集部の<em>おすすめ</em>ポイント</p><div class="yk-editor__body"><p><span class="yk-mark">${f.forWho}</span>に向いている相談先です。${f.points[0]}。</p></div></div>
<p class="yk-catch">${CATCH}</p>${out(f, "この相談先の無料相談を確認する")}
</div>`;

const matrix = `<div class="yk-matrix">
  <span class="yk-matrix__ax yk-matrix__ax--t">借入額 大きい</span><span class="yk-matrix__ax yk-matrix__ax--b">1社140万円以下</span><span class="yk-matrix__ax yk-matrix__ax--l">任意整理 中心</span><span class="yk-matrix__ax yk-matrix__ax--r">再生・破産まで</span>
  <div class="yk-matrix__item is-pick" style="--x:72%;--y:24%"><b class="site-mxname">ひばり（弁護士）</b><ul><li>✔ 任意整理/個人再生/自己破産</li><li>✔ 弁護士は金額の制限なし</li></ul></div>
  <span class="yk-matrix__item site-mxtext" style="--x:30%;--y:30%">東京ロータス（弁護士）</span>
  <span class="yk-matrix__item site-mxtext" style="--x:30%;--y:76%">アース（司法書士）</span>
</div>
<p class="yk-small">※配置は、各事務所の対応手続き（当サイト掲載時点の公開情報）と、弁護士・認定司法書士が代理できる範囲（制度）による目安です。</p>`;

const LD = [
  { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: `${ORIGIN}/` }, { "@type": "ListItem", position: 2, name: "債務整理に強い相談先おすすめ3選", item: `${ORIGIN}/` }] },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  { "@context": "https://schema.org", "@type": "Article", headline: TITLE, description: DESC, mainEntityOfPage: `${ORIGIN}/`, dateModified: UPDATED_ISO, author: { "@type": "Organization", name: `${SITE} 編集部` }, publisher: { "@type": "Organization", name: SITE } },
];

const index = `${head({ title: TITLE, desc: DESC, url: `${ORIGIN}/`, ld: LD })}
<body>
<div class="yk-body site-wrap">

<nav class="yk-crumb"><a href="/">${SITE}</a><span>債務整理の相談先比較</span></nav>

<header class="yk-hero">
  <div><p class="yk-hero__year">${UPDATED}更新</p>
  <h1 class="yk-hero__ttl"><em>債務整理</em>に強い<br>相談先<br>おすすめ3選</h1>
  <p class="yk-small site-hero-sub">無料相談・費用・全国対応・分割払い・家族や職場への配慮を比較</p></div>
  <figure class="mt-img yk-hero__img site-hero-img"><img src="/images/hero-person.webp" alt="スーツ姿で微笑む女性（イメージ）" width="450" height="623" fetchpriority="high"><figcaption class="mt-img__note">※写真はイメージです</figcaption></figure>
  <ul class="yk-hero__badges"><li><span>相談料<b>0円</b></span></li><li><span>全国<b>対応</b></span></li><li><span>秘密<b>厳守</b></span></li></ul>
</header>

<p class="yk-pr"><b>PR</b><span>アフィリエイトサイトのため、${firms.map((f) => f.name).join("・")}のプロモーションを含みます。</span></p>

${best3}

<div class="yk-order"><p class="yk-order__ttl">このページの内容</p><ol>
  <li><span>比較</span><a href="#compare">おすすめ3選と比較表</a></li>
  <li><span>詳細</span><a href="#ranking">各社の強み・確認ポイント</a></li>
  <li><span>違い</span><a href="#types">手続きと依頼先（弁護士・司法書士）の違い</a></li>
  <li><span>選び方</span><a href="#choose">失敗しない選び方・口コミの見方</a></li>
  <li><span>FAQ</span><a href="#faq">よくある不安・公的な相談窓口</a></li>
</ol></div>

<h2 class="yk-sec-ttl">こんな<em>不安</em>はありませんか？</h2>
<div class="yk-listbox"><p class="yk-listbox__ttl">1つでも当てはまるなら、早めの相談で選択肢が残りやすくなります</p><ul>
${pains.map((p) => `  <li>${p}</li>`).join("\n")}
</ul></div>
<p>借金の悩みは、早く相談するほど取れる手段が多くなります。<br><span class="yk-mark">まずは無料相談で、今できることを確認しましょう。</span></p>

${finder}

<h2 class="yk-sec-ttl" id="compare">まずは<em>3社</em>をまとめて比較</h2>
<p class="yk-small" style="text-align:center">相談料・対応手続き・配慮の有無で見比べてみましょう</p>
${compare}
<p class="yk-catch">3社の詳細を見て相談先を選ぶ</p><a class="yk-btn yk-btn--sub" href="#ranking">各社の詳細を見る</a>

<h2 class="yk-sec-ttl" id="ranking">債務整理に強い<em>相談先</em>おすすめ3選</h2>
<p class="yk-small" style="text-align:center">無料相談・費用・対応範囲・秘密配慮で選びました（<a href="/ranking/">掲載順の基準</a>）</p>
${firms.map(rankBlock).join("\n\n")}

<h2 class="yk-sec-ttl">債務整理で<em>相談できる</em>主な悩み</h2>
<div class="yk-features"><p class="yk-features__ttl">あなたの状況に近いものから相談を始めましょう</p><ul>
${solvable.map((s) => `  <li><span><b>${s.title}</b><br>${s.desc}</span></li>`).join("\n")}
</ul></div>
<p class="yk-catch">${CATCH}</p><a class="yk-btn" href="#ranking">自分に合う相談先を探す</a>

<h2 class="yk-sec-ttl" id="types">任意整理・個人再生・<em>自己破産</em>の違い</h2>
<p>返済を続けられるか・住宅を残したいか・借入額で適した方法は異なります。</p>
<p class="yk-hint">横にスクロールできます</p>
<div class="yk-hscroll">
${debtTypes.map((t) => `  <div class="yk-jobcard"><h3 class="yk-jobcard__ttl">${t.name}</h3><ul class="yk-tags yk-tags--green"><li>${t.tag}</li></ul><table class="yk-kv"><tr><th>概要</th><td>${t.summary}</td></tr><tr><th>メリット</th><td>${t.merit}</td></tr><tr><th>注意点</th><td><span class="yk-red">${t.demerit}</span></td></tr></table><p class="yk-catch">${CATCH}</p><a class="yk-btn yk-btn--sm" href="#ranking">どの手続きが合うか相談する</a></div>`).join("\n")}
</div>

<h2 class="yk-sec-ttl" id="lawyer-vs">弁護士と<em>司法書士</em>の違い</h2>
<p>借入額や手続きによって、依頼できる範囲が異なります。</p>
<table class="yk-info"><tr><th>項目</th><th>弁護士</th><th>認定司法書士</th></tr>
${proCompare.map((r) => `<tr><td class="is-left"><b>${r.label}</b></td><td class="is-left">${r.lawyer}</td><td class="is-left">${r.shoshi}</td></tr>`).join("\n")}
</table>
<p class="yk-small">※認定司法書士が代理できるのは1社あたり140万円以下の案件です。借入額や手続きに応じて、どちらが適しているかは相談時に確認しましょう。</p>
${matrix}

<h2 class="yk-sec-ttl" id="choose">失敗しない<em>相談先</em>の選び方</h2>
<p>料金や口コミだけでなく、次の5つを確認しましょう。</p>
<div class="yk-order"><p class="yk-order__ttl">確認したい5つのこと</p><ol>
${chooseChecks.map((c, i) => `  <li><span>確認${i + 1}</span><a href="#choose-${i + 1}">${c.title}</a></li>`).join("\n")}
</ol></div>
${chooseChecks.map((c, i) => `<h3 class="yk-numh" id="choose-${i + 1}"><span>確認${i + 1}</span>${c.title}</h3>\n<p>${c.desc}</p>`).join("\n")}

<h2 class="yk-sec-ttl">口コミを見るときの<em>注意点</em></h2>
<div class="yk-listbox"><p class="yk-listbox__ttl">口コミはあくまで参考。最終判断は無料相談で</p><ul>
  <li>インターネット上の口コミや評判は、感じ方に個人差があり、状況によって結果も異なります。<b>「必ず減額できた」「絶対バレない」といった断定的な口コミは鵜呑みにしない</b>ようにしましょう。</li>
  <li>大切なのは、実際に無料相談で<b>費用の説明・対応範囲・デメリットの説明</b>を自分の目で確認すること。気になる事務所が複数あれば、相談して比べたうえで依頼先を選ぶのがおすすめです。</li>
</ul></div>

<h2 class="yk-sec-ttl" id="faq">相談前に<em>よくある不安</em></h2>
${faqs.map((f, i) => `<h3 class="yk-numh"><span>質問${i + 1}</span>${f.q}</h3>\n<p>${f.a}</p>`).join("\n")}

<h2 class="yk-sec-ttl" id="public">公的な<em>相談窓口</em>・参考情報</h2>
<p>民間の事務所以外にも、公的な相談先があります。</p>
<div class="yk-features"><p class="yk-features__ttl">費用が心配な場合は法テラスも選択肢</p><ul><li><span>収入などの条件を満たせば、法テラス（日本司法支援センター）の無料法律相談や、弁護士・司法書士費用の立替制度を利用できる場合があります。利用には資力要件や審査があり、原則として予約制です。最新の条件は公式サイトでご確認ください。</span></li></ul></div>
<div class="yk-listbox"><p class="yk-listbox__ttl">参考情報</p><ul>
  <li><a href="https://www.houterasu.or.jp/site/soudan-tatekae/seirihiyou.html" target="_blank" rel="noopener nofollow">法テラス｜債務整理の費用の目安</a></li>
  <li><a href="https://www.fsa.go.jp/soudan/" target="_blank" rel="noopener nofollow">金融庁｜多重債務についての相談窓口</a></li>
</ul></div>

<section class="yk-pickup"><h2 class="yk-pickup__ttl"><small>迷ったらまずは</small><br>相談先は、<br><em>比較</em>してから決めましょう。</h2>
<p class="site-pickup-lead">債務整理は、費用・対応範囲・相談方法が事務所によって異なります。まずは無料相談できる候補を比較し、納得できる相談先を選びましょう。</p>
<ul class="yk-pickup__list">
${firms.slice(0, 2).map((f) => `  <li class="yk-pickup__item"><p class="yk-pickup__name">${f.short}</p><p class="site-banner site-banner--pick">${banner(f)}</p><p class="yk-pickup__text">${f.badge}。${f.catch}。</p><p class="yk-catch">相談料0円</p>${out(f, "無料相談を確認", "yk-btn yk-btn--sm")}</li>`).join("\n")}
</ul></section>
<p class="yk-catch">3社をまとめて見る</p><a class="yk-btn yk-btn--sub" href="#compare">無料相談できる事務所を比較する</a>

<div class="site-legal">
${LEGAL.map((l) => `<p class="yk-small">${l}</p>`).join("\n")}
<p class="yk-small">本サイトは債務整理の相談先を比較するための情報サイトです。掲載情報は各事務所の公開情報をもとに作成しています。</p>
</div>

${footer}
</div>
<script>
document.getElementById('finder').addEventListener('submit', function (e) {
  e.preventDefault();
  location.hash = 'firm-' + this.s.value;
});
</script>
</body>
</html>
`;

/* ---------- 下層ページ（同じ部品で） ---------- */
const sub = (slug, ttl, body) => `${head({ title: `${ttl}｜${SITE}`, desc: `${SITE}の${ttl}です。`, url: `${ORIGIN}/${slug}/`, noindex: true })}
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

const operator = sub("operator", "運営者情報", `<table class="yk-info"><tr><th>運営者</th><td class="is-left">${SITE} 編集部</td></tr><tr><th>お問い合わせ</th><td class="is-left"><a href="mailto:securewebtech6676@gmail.com">securewebtech6676@gmail.com</a></td></tr><tr><th>事業内容</th><td class="is-left">Webメディア運営<br>オンライン広告企画・運用代行</td></tr><tr><th>URL</th><td class="is-left">${ORIGIN}/</td></tr></table>
<div class="yk-listbox"><p class="yk-listbox__ttl">広告掲載について</p><ul><li>当サイトは提携企業様のサービスを紹介するにあたり、広告契約に基づき掲載を行っております。</li><li>本サイトは法律相談・法的助言ではなく、一般的な情報提供を目的としています。</li><li>掲載情報は各事務所の公開情報をもとに作成しています。最新かつ正確な内容は、必ず各事務所に直接ご確認ください。</li></ul></div>`);

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

const ranking = sub("ranking", "掲載順の基準（ランキング調査概要）", `<p>トップページの「おすすめ3選」は、次の観点で当サイトが比較し、掲載順を決めています。掲載は提携に基づくものです。掲載順は当サイトの基準によるもので、品質や優劣を保証するものではありません。</p>
<div class="yk-order"><p class="yk-order__ttl">比較した観点</p><ol><li><span>観点1</span>無料相談の有無</li><li><span>観点2</span>費用（相談料・着手金・報酬・分割払い）の説明</li><li><span>観点3</span>対応範囲（任意整理・個人再生・自己破産・過払い金、対応エリア）</li><li><span>観点4</span>家族や職場への配慮（連絡方法・郵送物）</li></ol></div>
<div class="yk-listbox"><p class="yk-listbox__ttl">掲載にあたって</p><ul><li>点数・星・総合評価は付けていません。</li><li>情報は各事務所の公開情報をもとに作成しています（最終確認：${UPDATED}）。</li><li>相談料・費用・対応可否・対応エリア・分割払いの可否などは変更される場合があります。最新かつ正確な内容は、必ず各事務所に直接ご確認ください。</li></ul></div>`);

const write = (rel, s) => { const p = path.join(OUT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
write("index.html", index);
write("operator/index.html", operator);
write("privacy/index.html", privacy);
write("ranking/index.html", ranking);
write("CNAME", "saimu.navolio.net\n");
write(".nojekyll", "");
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n`);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${ORIGIN}/</loc><lastmod>${UPDATED_ISO}</lastmod></url></urlset>\n`);
console.log("built");
