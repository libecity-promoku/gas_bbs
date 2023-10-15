/**
 * プロパティ情報を表示
 */
function putProp() {
  // プロパティ一覧文字列の生成
  // const uuid = SETTING?.uuid || '';
  const props = { ...SCRIPT_PROP.getProperties() };
  const prop_str = Object.keys(props).sort()
    .map((key) =>
      `${key} : ${props[key].slice(0, 200)}`
    );

  const caches = { ...SCRIPT_CACHE.getAll(SETTING.cache_keys.map((key) => key)) };
  const cache_str = Object.keys(caches).sort()
    .map((key) =>
      `${key} : ${caches[key].slice(0, 200)}`
    );

  // ポップアップに表示
  const html = HtmlService
    .createHtmlOutput(`<pre>${[...prop_str, ...cache_str].join('\n')}</pre>`)
    .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(html, 'プロパティ情報');
}

/** 設定値・トリガの初期化 */
function beginInit() {
  // 確認ダイアログを表示
  const ui = SpreadsheetApp.getUi();
  const resp = ui.alert('初期化', '設定を全て初期化します', ui.ButtonSet.OK_CANCEL);

  if (resp !== ui.Button.OK)
    return;

  beginLoading('全初期化', 'initAll');
}

/** 設定値・トリガの初期化 */
function initAll() {
  putLog(['InitAll']);

  // 設定初期化
  SETTING.init();
  // トリガー削除
  ScriptApp.getProjectTriggers().forEach((t) => ScriptApp.deleteTrigger(t));

  return '初期化が完了しました';
}

/**
 * ログをセットする
 * @param {string[]} text 文字列
 * @param {boolean} force キャッシュの書き込みフラグ
 */
function putLog(texts: string[], force = true) {
  console.log(texts);
  const ss = SpreadsheetApp.getActive();
  const s = ss.getSheetByName('log');
  if (s) {
    const ts = Utilities.formatDate(new Date, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
    // 列数・文字数をカット
    const trimmed = texts.slice(0, 20).map((text) => text.slice(0, 2000));
    // ログ用キャッシュに格納
    const { logs } = SETTING;
    logs.push([ts, Session.getActiveUser().getEmail() || 'ー', ...trimmed]);
    SETTING.logs = logs;

    // 一定数を超えたら書き込み
    if (force || logs.length > 10)
      flushLog();

    // 最大値チェック
    const MAX_LOG_NUM = 30000;
    const l = lockSheet();
    if (l && s.getLastRow() > MAX_LOG_NUM) {
      const range = {
        sheetId: s.getSheetId(),
        dimension: 'ROWS',
        startIndex: 1,
        endIndex: MAX_LOG_NUM / 2
      };
      Sheets.Spreadsheets?.batchUpdate(
        { requests: [{ deleteDimension: { range } }] },
        ss.getId()
      );
    }
    unlockSheet(l);
  }
}

/** キャッシュされたログを書き出す */
function flushLog() {
  const l = lockSheet();
  const { logs } = SETTING;
  if (l && logs.length) {
    const ss = SpreadsheetApp.getActive();
    Sheets.Spreadsheets?.Values?.append(
      { values: logs },
      ss.getId(),
      'log!A:Z',
      { valueInputOption: 'USER_ENTERED' }
    );
    SETTING.logs = [];
  }
  unlockSheet(l);
}

/** 排他制御開始 */
function lockSheet() {
  /** 排他制御の最大トライ時間(msec) */
  // const LOCK_TIMEOUT = 50 * 1000;
  // const Lock = LockService.getDocumentLock();
  // Lock.waitLock(LOCK_TIMEOUT);
  return true;
}

/** 排他制御終了 */
function unlockSheet(l: any) {
  //if (l.hasLock()) {
  //  // スプレッドシートの状態を更新してからリリース
  //  SpreadsheetApp.flush();
  //  l.releaseLock();
  //}
}

/** 列番号をアルファベットに変換 */
function numeric2Colname(num: number) {
  /** アルファベット総数 */
  const RADIX = 26;
  /** Aの文字コード */
  const A = 'A'.charCodeAt(0);

  let n = num;
  let s = '';
  while (n >= 1) {
    n--;
    s = String.fromCharCode(A + (n % RADIX)) + s;
    n = Math.floor(n / RADIX);
  }
  return s;
}

/** アルファベットを列番号に変換 */
function colname2number(column_name: string) {
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const column_number = column_name.toUpperCase().split('').reduce((acc, c) => {
    acc = acc * 26 + base.indexOf(c) + 1;
    return acc;
  }, 0);
  return column_number;
}

/** ローディング画面の呼び出し*/
function beginLoading(title: string, callback: string) {
  putLog(['BeginLoading', callback]);

  // ローディング中に実行する関数をコールバックに指定
  SETTING.loading_callback = callback;

  const ui = SpreadsheetApp.getUi();
  const html = HtmlService
    .createTemplateFromFile('html/load')
    .evaluate()
    .setHeight(300);
  ui.showModalDialog(html, title);
}

/** ローディング画面からのコールバック用API */
function callBack(f: string) {
  // コールバックテーブル
  const callBackTable = {
    'initAll': () => initAll(),
  };
  const key = f as keyof typeof callBackTable;

  // リストにあるものだけ実行
  if (callBackTable[key])
    return callBackTable[key]();
  throw new Error('no callback');
}

/**
 * １次元配列を、指定した要素数で分割した２次元配列に変換
 * @param[in] {Array<T>} arr １次元配列
 * @param[in] {number} chunk 分割する要素数
 */
function bunch<T>(arr: Array<T>, chunk: number) {
  return [...Array(Math.ceil(arr.length / chunk))].map((_, i) =>
    arr.slice(i * chunk, (i + 1) * chunk)
  );
}

/**
 * １次元配列から重複を取り除いた新しい配列を作成する
 * @param[in] {Array<T>} arr １次元配列
 */
function unique<T>(arr: Array<T>) {
  return Array.from(new Set(arr));
}

/** オブジェクトからクエリパラメータ用の文字列を生成 */
function generateQueryString(query: { [key: string]: string }) {
  const query_param = Object.keys(query)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
    .join('&amp;');
  return query_param;
}

/**
 * 二次元のテーブルデータを見出しをキーとしたオブジェクト配列に変換する
 */
function namingCellValues(df: CellValue[][]) {
  const [head, ...values] = df;
  const records = (values as CellValue[][]).map((r) =>
    (head as CellValue[]).reduce((acc, value, i) => {
      acc[value.toString()] = r[i]?.toString() || '';
      return acc;
    }, {} as { [key: string]: string })
  );
  return records;
}

function showSideBarFromHTML(title: string, file: string) {
  const ui = SpreadsheetApp.getUi();
  const html = HtmlService
    .createTemplateFromFile(file)
    .evaluate()
    .setHeight(700)
    .setTitle(title);
  ui.showSidebar(html);
}

function hasTrigger(func: string) {
  return ScriptApp.getProjectTriggers().some((t) => t.getHandlerFunction() === func);
}

function deleteTrigger(func: string) {
  putLog(['DeleteTrigger', func]);
  return ScriptApp.getProjectTriggers().map((t) => (t.getHandlerFunction() === func) && (ScriptApp.deleteTrigger(t)));
}

function include(file: string) {
  return HtmlService.createHtmlOutputFromFile(file).getContent();
}

