/** シート変換オプション */
type ExportOption = {
  gid: string,
  format: 'pdf' | 'csv' | 'tsv' | 'xlsx' | 'zip',
  size?: 'A3' | 'A4' | 'A5' | 'B4' | 'B5' | 'letter' | 'tabloid' | 'legal' | 'statement' | 'executive' | 'folio',
  scale?: '1' | '2' | '3' | '4', // 1= Normal 100% / 2= Fit to width / 3= Fit to height / 4= Fit to Page
  pageorder?: '1' | '2', // 1= Down, then over / 2= Over, then down
  portrait?: 'true' | 'false',
  // fitw?: 'true' | 'false',  // fit window or actual size
  // fith?: 'true' | 'false',  // fit window or actual size
  gridlines?: 'true' | 'false',
  printtitle?: 'true' | 'false',
  printnotes?: 'true' | 'false',
  fzr?: 'true' | 'false', // repeat row headers
  fzc?: 'true' | 'false',
  r1?: string, // first row to print: 0-indexed
  r2?: string, // last row to print: 1-indexed
  c1?: string, // first col to print: 0-indexed
  c2?: string, // last col to print: 1-indexed
  sheetnames?: 'true' | 'false',
  attachment?: 'true' | 'false',
  top_margin?: string, // cm
  bottom_margin?: string, // cm
  left_margin?: string, // cm
  right_margin?: string, // cm
  horizontal_alignment?: 'LEFT' | 'CENTER' | 'RIGHT',
  vertical_alignment?: 'TOP' | 'MIDDLE' | 'BOTTOM',
}


