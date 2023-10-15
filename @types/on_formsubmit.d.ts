/**
 * フォームの質問
 */
type Question =
  'タイムスタンプ' |
  'メールアドレス' |
  'ニックネーム' |
  'プロフィールURL' |
  '備考欄';

/**
 * onFormSubmitで渡されるイベントオブジェクト定義
 */
interface FormSubmitEvent {
  authMode?: GoogleAppsScript.Script.AuthMode,
  namedValues: { [key in Question]: string[] },
  range?: { [key: string]: number },
  source?: object,
  triggerUid?: number,
  values: string[],
}

