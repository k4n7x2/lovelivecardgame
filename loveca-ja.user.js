// ==UserScript==
// @name         Loveca 日本語化
// @namespace    https://github.com/k4n7x2/lovelivecardgame
// @version      0.1.0
// @description  loveca.lovelivefun.xyz のプレイヤー向けUIとカード表示を日本語化します。
// @match        https://loveca.lovelivefun.xyz/*
// @updateURL    https://raw.githubusercontent.com/k4n7x2/lovelivecardgame/main/loveca-ja.user.js
// @downloadURL  https://raw.githubusercontent.com/k4n7x2/lovelivecardgame/main/loveca-ja.user.js
// @run-at       document-start
// @grant        GM_registerMenuCommand
// ==/UserScript==

(() => {
  'use strict';

  const CARD_API = '/api/cards';
  const cardNames = new Map();
  const cardTexts = new Map();
  const skipTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'CODE', 'PRE']);
  const attrs = ['title', 'aria-label', 'placeholder'];

  const exact = new Map(Object.entries({
    '第一次玩？从这里开始': '初めて遊ぶ方はこちら',
    '完成换牌、登场、LIVE 判定与结算': 'マリガン、登場、LIVE判定、精算まで体験できます',
    '无需登录': 'ログイン不要',
    '需要登录': 'ログインが必要です',
    '开始对战': '対戦を始める',
    '真人匹配、房间对战与单人测试': '対人マッチング、ルーム対戦、ソロテスト',
    '构筑与管理卡组': 'デッキ構築・管理',
    '创建、导入卡组，检查是否符合构筑规则': 'デッキの作成・インポート・構築ルール確認',
    '房间观战': 'ルーム観戦',
    '输入房间号观看对局': 'ルーム番号を入力して対戦を観戦',
    '新手教程': '初心者チュートリアル',
    '最新商品': '最新商品',
    '公告': 'お知らせ',
    '维护': 'メンテナンス',
    '更新': 'アップデート',
    '维护中': 'メンテナンス中',
    '限制新开局': '新規対戦制限中',
    '返回房间': 'ルームへ戻る',
    '返回大厅': 'ロビーへ戻る',
    '开始本地对战': 'ローカル対戦を始める',
    '构筑本地卡组': 'ローカルデッキを構築',
    '去卡组管理': 'デッキ管理へ',
    '进入准备页': '対戦準備へ',
    '正在读取卡组': 'デッキを読み込み中',
    '暂时无法读取卡组': 'デッキを読み込めません',
    '重新读取': '再読み込み',
    '构筑卡组': 'デッキを構築',
    '公共牌桌': 'フリーマッチ',
    '赛季排位': 'ランクマッチ',
    '娱乐模式': 'カジュアル',
    '离线模式': 'オフラインモード',
    '选择对战方式': '対戦方式を選択',
    '选择己方卡组': '自分のデッキを選択',
    '确认并开始对局': '確認して対戦開始',
    '进入公共牌桌': 'フリーマッチへ',
    '进入联机房间': 'オンラインルームへ',
    '新卡组': '新しいデッキ',
    '请输入卡组名称': 'デッキ名を入力してください',
    '删除失败': '削除に失敗しました',
    '复制卡组失败': 'デッキのコピーに失敗しました',
    '分享链接已复制': '共有リンクをコピーしました',
    '请粘贴卡组文本': 'デッキテキストを貼り付けてください',
    '卡组文本格式错误': 'デッキテキストの形式が正しくありません',
    '请输入 DeckLog 卡组 ID 或 URL': 'DeckLogのデッキIDまたはURLを入力してください',
    '用户名或邮箱': 'ユーザー名またはメールアドレス',
    '输入你的用户名或邮箱': 'ユーザー名またはメールアドレスを入力',
    '密码': 'パスワード',
    '输入你的密码': 'パスワードを入力',
    '忘记密码？': 'パスワードを忘れた場合',
    '登录中...': 'ログイン中...',
    '登录': 'ログイン',
    '进入离线模式': 'オフラインモードへ',
    '立即注册': '新規登録',
    '创建账号': 'アカウント作成',
    '用户名': 'ユーザー名',
    '显示昵称': '表示名',
    '邮箱': 'メールアドレス',
    '确认密码': 'パスワード確認',
    '注册中...': '登録中...',
    '立即登录': 'ログイン',
    '账户': 'アカウント',
    '退出登录': 'ログアウト',
    '初始化中...': '初期化中...',
    '加载卡牌数据...': 'カードデータを読み込み中...',
    '重新加载': '再読み込み',
    '选择卡组': 'デッキを選択',
    '开始排位': 'ランクマッチ開始',
    '换牌阶段': 'マリガン',
    '轮到你换牌': 'あなたのマリガンです',
    '等待对手...': '相手を待っています...',
    '手牌为空': '手札がありません',
    '保留手牌': 'この手札で開始',
    '选择效果发动顺序': '効果の処理順を選択',
    '请选择下一个要处理的效果': '次に処理する効果を選択してください',
    '请选择要处理的卡牌': '処理するカードを選択してください',
    '选择效果': '効果を選択',
    '不发动': '発動しない',
    '按所选效果结算': '選択した効果を処理',
    '判定成功': 'LIVE成功',
    '判定失败': 'LIVE失敗',
    '等待 LIVE': 'LIVE待機中',
    '无法预览': 'プレビューできません',
    '无需求': '必要ハートなし',
    '需求不可见': '必要ハート非公開',
    '还差': 'あと',
    '公开给对手': '相手に公開',
    '公开': '公開',
    '从主卡组抽一张牌': 'メインデッキから1枚ドロー',
    '当前不能抽牌': '現在ドローできません',
    '抽 1 张': '1枚ドロー',
    '放回牌库顶': 'デッキトップへ戻す',
    '请求撤销': 'UNDOを申請',
    '撤销': 'UNDO',
    '卡牌效果': 'カード効果',
    '主要阶段': 'メインフェイズ',
    'LIVE 设置': 'LIVEセット',
    'LIVE 开始': 'LIVE開始',
    '本局获胜': '勝利',
    '本局结束': '対戦終了',
    '你已认输': '投了しました',
    '该卡牌没有效果描述。': 'このカードには効果テキストがありません。',
    '中文': '中国語',
    '日文': '日本語',
    '费用': 'コスト',
    '分数': 'スコア',
    '粉': '桃',
    '红': '赤',
    '绿': '緑',
    '蓝': '青',
    '无色': '無色'
  }));

  const terms = [
    ['主卡组', 'メインデッキ'], ['能量卡组', 'ENERGYデッキ'],
    ['成功 LIVE 区', '成功LIVEエリア'], ['LIVE 区', 'LIVEエリア'],
    ['成员区', 'メンバーエリア'], ['解决区', '解決領域'],
    ['休息室', '控え室'], ['手牌', '手札'], ['卡组', 'デッキ'],
    ['成员', 'メンバー'], ['能量', 'ENERGY'], ['应援', 'エール'],
    ['光棒心', 'ブレードハート'], ['登场', '登場'], ['起动', '起動'],
    ['先攻玩家', '先攻プレイヤー'], ['后攻玩家', '後攻プレイヤー'],
    ['后攻', '後攻'], ['对手', '相手'], ['玩家', 'プレイヤー'],
    ['回合', 'ターン'], ['阶段', 'フェイズ'], ['观战', '観戦'],
    ['联机', 'オンライン'], ['选择', '選択'], ['取消', 'キャンセル'],
    ['返回', '戻る'], ['删除', '削除'], ['复制', 'コピー'],
    ['分享', '共有'], ['导入', 'インポート'], ['加载', '読み込み'],
    ['开始', '開始'], ['结束', '終了'], ['失败', '失敗'],
    ['当前', '現在'], ['等待', '待機'], ['查看', '確認']
  ].sort((a, b) => b[0].length - a[0].length);

  const regex = [
    [/^你的手牌\s*\((\d+)\s*张\)$/u, 'あなたの手札（$1枚）'],
    [/^换\s*(\d+)\s*张$/u, '$1枚交換'],
    [/^已选\s*(\d+)\s*\/\s*(\d+)$/u, '選択済み $1 / $2'],
    [/^候选\s*(\d+)\s*张$/u, '候補 $1枚'],
    [/^房间\s+([A-Z0-9-]+)$/u, 'ルーム $1'],
    [/^玩家\s*(\d+)$/u, 'プレイヤー $1'],
    [/^回合\s*(\d+)$/u, 'ターン $1'],
    [/^抽\s*(\d+)\s*张卡$/u, '$1枚ドロー'],
    [/^加入\s*(\d+)\s*张手牌$/u, '$1枚を手札に加える'],
    [/^放置\s*(\d+)\s*张能量$/u, 'ENERGYを$1枚置く']
  ];

  function translateCore(text) {
    if (cardNames.has(text)) return cardNames.get(text);
    if (cardTexts.has(text)) return cardTexts.get(text);
    if (exact.has(text)) return exact.get(text);
    for (const rule of regex) if (rule[0].test(text)) return text.replace(rule[0], rule[1]);
    let out = text;
    for (const pair of terms) if (out.includes(pair[0])) out = out.split(pair[0]).join(pair[1]);
    return out;
  }

  function translateString(value) {
    if (!value || typeof value !== 'string') return value;
    const core = value.trim();
    if (!core) return value;
    const translated = translateCore(core);
    if (translated === core) return value;
    const lead = value.match(/^\s*/u)[0];
    const tail = value.match(/\s*$/u)[0];
    return lead + translated + tail;
  }

  function editable(el) {
    return el instanceof Element && el.matches('input, textarea, [contenteditable=""], [contenteditable="true"]');
  }

  function translateElement(el) {
    if (!(el instanceof Element) || editable(el)) return;
    for (const attr of attrs) {
      if (!el.hasAttribute(attr)) continue;
      const before = el.getAttribute(attr) || '';
      const after = translateString(before);
      if (before !== after) el.setAttribute(attr, after);
    }
  }

  function translateNode(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      const parent = root.parentElement;
      if (!parent || skipTags.has(parent.tagName) || editable(parent)) return;
      const after = translateString(root.nodeValue || '');
      if (after !== root.nodeValue) root.nodeValue = after;
      return;
    }
    if (!(root instanceof Element) && !(root instanceof Document) && !(root instanceof DocumentFragment)) return;
    if (root instanceof Element) translateElement(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (skipTags.has(node.tagName) || editable(node)) return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) translateNode(node);
      else translateElement(node);
    }
    normalizeCardRows(root instanceof DocumentFragment ? document : root);
  }

  function normalizeCardRows(root) {
    if (!root.querySelectorAll) return;
    for (const label of root.querySelectorAll('span')) {
      const text = (label.textContent || '').trim();
      if (text === '中文' || text === '中国語') {
        const row = label.parentElement;
        if (row && !row.dataset.lovecaJaHiddenCn) {
          row.dataset.lovecaJaHiddenCn = '1';
          row.style.display = 'none';
        }
      } else if (text === '日文') {
        label.textContent = '日本語';
      }
    }
  }

  let scheduled = false;
  const pending = new Set();
  function schedule(root) {
    pending.add(root || document);
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      const items = Array.from(pending);
      pending.clear();
      for (const item of items) translateNode(item);
    });
  }

  async function loadCards() {
    try {
      const response = await fetch(CARD_API, { credentials: 'include', cache: 'no-store' });
      if (!response.ok) return;
      const payload = await response.json();
      const cards = Array.isArray(payload) ? payload : (Array.isArray(payload && payload.data) ? payload.data : []);
      for (const card of cards) {
        const cnName = typeof card.name_cn === 'string' ? card.name_cn.trim() : '';
        const jpName = typeof card.name_jp === 'string' ? card.name_jp.trim() : '';
        const cnText = typeof card.card_text_cn === 'string' ? card.card_text_cn.trim() : '';
        const jpText = typeof card.card_text_jp === 'string' ? card.card_text_jp.trim() : '';
        if (cnName && jpName && cnName !== jpName) cardNames.set(cnName, jpName);
        if (cnText && jpText && cnText !== jpText) cardTexts.set(cnText, jpText);
      }
      schedule(document);
    } catch (error) {
      console.warn('[Loveca 日本語化] カードAPIの取得に失敗しました。UI翻訳のみ継続します。', error);
    }
  }

  function boot() {
    schedule(document);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') schedule(mutation.target);
        for (const node of mutation.addedNodes) schedule(node);
      }
    });
    observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
    loadCards();
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('日本語化を再適用', () => schedule(document));
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
