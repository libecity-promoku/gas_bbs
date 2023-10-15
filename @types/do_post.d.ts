/**
 * doPostで渡されるイベントオブジェクトの定義
 */
interface PostEvent {
  queryString: string,
  parameter: any,
  parameters: any,
  contentLength: number,
  postData: {
    length: number,
    type: string,
    contents: string,
    name: 'postData'
  },
}

