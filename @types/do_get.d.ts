/**
 * doGetで渡されるイベントオブジェクトの定義
 */
interface GetEvent {
  queryString: string,
  parameters: any,
  parameter: {
    operation: string,
    token: string,
    reportId?: string,
    reportDocumentId?: string,
    refresh_token?: string
    state?: string,
    mws_auth_token?: string,
    selling_partner_id?: string,
    spapi_oauth_code?: string,
    start_date_diff?: number,
    //type?: SPAPI.ReportType,
  },
  contentLength: number,
}

