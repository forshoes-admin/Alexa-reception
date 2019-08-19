function myFunction() {
    attendanceSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('出欠シート');
    kanaSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('読み仮名');
    var attendanceValues = attendanceSheet.getDataRange().getValues();
    var kanaValues = kanaSheet.getDataRange().getValues();

    for (var a = attendanceValues.length - 1; a > 0; a--) {
        var aReceiptNum = attendanceValues[a][1];
        for (var k = kanaValues.length - 1; k > 0; k--) {
            var kReceiptNum = kanaValues[k][0];
            var kana = kanaValues[k][2]
            if (aReceiptNum === kReceiptNum) {
                Logger.log("番号:%s", kReceiptNum);
                Logger.log("読み仮名:%s", kana);
                var rng = attendanceSheet.getRange(a + 1, 4);
                rng.activate();
                rng.setValue(kana);
                break;
            }
        }
    }
    return;
}
