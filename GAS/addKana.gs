/** 番号（ID）と氏名のみの受付シート（シート名は任意で、1番目のシート）と、
 *  番号（ID）と読み仮名を記入したシート（シート名「読み仮名」）を用意し、
 *  番号（ID）が一致したら受付シートに読み仮名を転記します。
 *  読み仮名がないと、特殊な読み方をする人名をAlexaが正しく読み取れないため、
 *  参加者のみの受付シートに、不参加者を含む全社員（全ユーザー）のシートから読み仮名を転記する使い方を
 *  想定しています。
 *  列番号（attendanceValuesやkanaValuesの2個目のインデックス）は適宜変更して使います。
*/
function myFunction() {
    var attendanceSheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var kanaSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('読み仮名');
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
