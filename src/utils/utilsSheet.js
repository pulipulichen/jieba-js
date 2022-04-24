import XLSX from 'xlsx'

export default {
  s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++)
      view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
  },
  aoa_to_sheet (data) {
    let ws = XLSX.utils.aoa_to_sheet(data)
    ws['!cols'] = []
    ws['!rows'] = []
    ws['!fullref'] = ws['!ref']
    return ws
  },
}