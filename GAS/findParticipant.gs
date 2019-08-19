var exports = GASUnit.exports
var assert = GASUnit.assert

function findParticipant(sheet, ticketNumber) {
  var values = sheet.getDataRange().getValues();
  var iventName = sheet.getRange("F1").getValue();
  if (iventName) {
    iventName += "へ";
  }
  for (var i = values.length - 1; i > 0; i--) {
    var val = values[i][1];
    if (val == ticketNumber) {
      var rng = sheet.getRange(i + 1, 1);
      rng.activate();
      rng.setValue(true); // チェックボックスにチェックをつける
      rng = sheet.getRange(i + 1, 1, 1, 8);
      return values[i][3] + "さんの受付が完了しました。" + iventName + "ようこそ！";
    }
  }
  return "missing";
}


function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var res = ContentService.createTextOutput();
  var ticketNumber = e.parameter.ticketnumber;
  var retval = findParticipant(sheet, ticketNumber);

  res.setContent(retval);
  return res;
}



function spreadsheetTest() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('出欠シート');
  Logger.log("シート名：%s", sheet.getName());
}

