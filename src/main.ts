/**
 * bbs_template v0.1
 */

/** スクリプト実行用メニューの追加 */
function onOpen() {
  const menu = [
    // { name: '⚙️ 各種設定', functionName: 'settingMenu' },
    { name: '👀 プレビュー', functionName: 'beginPreview' },
    null,
    { name: '🗒 プロパティ情報', functionName: 'putProp' },
    { name: '🗑 全初期化', functionName: 'beginInit'}  
  ];
  SpreadsheetApp.getActiveSpreadsheet().addMenu('メニュー', menu);
}

function beginPreview() {
  const temp = HtmlService
    .createTemplateFromFile('html/index');
  temp.prop = JSON.stringify({ is_admin: true });
  const html = temp
    .evaluate()
    .setWidth(1200)
    .setHeight(1200)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  SpreadsheetApp.getUi().showModalDialog(html, ' ');
}

/** 設定画面を表示する */
function doGet(e: GetEvent) {
  const temp = HtmlService
    .createTemplateFromFile('html/index');
  // プロパティ情報をセット
  const is_admin = Object.keys(e.parameter).includes('admin');
  temp.prop = JSON.stringify({ is_admin });
  const html = temp.evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return html;
}

/** DBから全データを取得 */
function getTalk() {
  return TalkTable.getInstance().hashes.filter((h) => h.id !== '');
}

/** DBにデータを追加 */
function addTalk(hash: { body: string }) {
  putLog(['AddTalk', JSON.stringify(hash)]);
  const tbl = TalkTable.getInstance();
  const [h] = tbl.hashes.filter((h) => h.id !== '').slice(-1);
  const new_hash: iHash = {
    id: h ? (parseInt(h.id) + 1).toString() : '1',
    time: Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd HH:mm:ss'),
    ...hash,
  };
  tbl.appendRecords([new_hash]);
  return new_hash;
}

/** DBからデータを削除 */
function deleteTalk(hash: { id: string }) {
  putLog(['DeleteTalk', JSON.stringify(hash)]);
  const tbl = TalkTable.getInstance();
  const new_hashes = tbl.hashes.filter((h) => h.id !== hash.id);
  tbl.resetTable(new_hashes);
  return new_hashes;
}

