var app = angular.module("app", []);

app.controller('controller', function($scope) {

	/**
	 * 難度 1:困難 2:中等 3:簡單
	 */
	$scope.degree = 1;

	/**
	 * 數獨大小
	 */
	$scope.sudokuSize = 9;

	// /**
	// * 預選(可選)字
	// */
	// $scope.preselectedStr = "123456789";
	//
	// /**
	// * 陣列
	// */
	// $scope.sudokuLs = newSudokuLs();
	//
	// /**
	// * 答案陣列
	// */
	// $scope.answerSudokuLs = newSudokuLs();
	//
	// /**
	// * 目前已使用的陣列
	// */
	// $scope.usedSudokuLs = newSudokuLs();
	//
	// /**
	// * 歷史歷程陣列
	// */
	// $scope.courseSudokuLs = newSudokuLs();

	// /**
	// * 隨機挖洞
	// */
	// public void randomDiggingHoles() {
	//
	// int diggingHolesNumber = 40;
	// switch (DEGREE) {
	// case 1:
	// diggingHolesNumber = 60;
	// break;
	// case 2:
	// diggingHolesNumber = 50;
	// break;
	// }
	//
	// Set<Integer> randomNbLs = new HashSet<Integer>();
	// while (randomNbLs.size() < diggingHolesNumber) {
	// int randomX = (int) Math.floor(Math.random() * (9));
	// int randomY = (int) Math.floor(Math.random() * (9));
	// randomNbLs.add(10 * randomX + randomY);
	// }
	// randomNbLs.forEach(randomNb -> {
	// int x = randomNb / 10;
	// int y = randomNb % 10;
	// answerSudokuLs[y][x] = " ";
	// });
	// }

	/**
	 * ALL陣列 ( 預選字：preselectedStr, 計算用：sudokuLs, 答案：answerSudokuLs,
	 * 已使用：usedSudokuLs, 歷程：courseSudokuLs)
	 * 
	 * @return
	 */
	
	$scope.sudokuLs();

	$scope.sudokuLs = function() {
		var sudokuLs = [];
		for (i = 0; i < $scope.sudokuSize; i++) {
			sudokuLs[i] = [];
			for (j = 0; j < $scope.sudokuSize; j++) {
				sudokuLs[i][j] = {
					preselectedStr : "123456789",
					sudokuLs : "",
					answerSudokuLs : "",
					usedSudokuLs : "",
					courseSudokuLs : ""
				};
			}
		}
		console.log(sudokuLs);
		return sudokuLs;
	};

	// /**
	// * Error check。 若此到最後有任一候選字為"空"，或此位置全部都選擇過，則<<復原處理>>
	// *
	// * @param y
	// * @param x
	// * @return 可選數字
	// */
	// public String checkIsError(int y, int x) {
	//
	// for (int j = y; j < SUDOKU_SIZE; j++) {
	// for (int i = x; i < SUDOKU_SIZE; i++) {
	// if ("".equals(sudokuLs[j][i])) {
	// // System.out.println("發現有空的候選欄");
	// return "";
	// }
	// }
	// }
	// String a = usedSudokuLs[y][x];
	// // System.out.println("已選擇的數字：" + a);
	// String b = sudokuLs[y][x];
	// if (usedSudokuLs[y][x] != null) {
	// for (String str : a.split("")) {
	// if (b.contains(str)) {
	// b = b.replace((str), "");
	// }
	// }
	// }
	// // System.out.println("可選擇的數字：" + b);
	// if (sudokuLs[y][x] == null || "".equals(b)) {
	// // System.out.println("此選擇都不行");
	// usedSudokuLs[y][x] = null;
	// return "";
	// } else {
	// return b;
	// }
	// }
	//
	// /**
	// * 寫入『候選字』
	// */
	// public void writeSudokuLs() {
	//
	// for (int i = 0; i < SUDOKU_SIZE; i++) {
	// for (int j = 0; j < SUDOKU_SIZE; j++) {
	// sudokuLs[i][j] = PRESELECTED_STR;
	// }
	// }
	// }
	//
	// /**
	// * 紀錄已使用的候選字
	// *
	// * @param y
	// * @param x
	// * @param nb
	// */
	// public void usedSudokuLs(int y, int x, String nb) {
	//
	// if (usedSudokuLs[y][x] == null) {
	// usedSudokuLs[y][x] = nb;
	// } else {
	// if (usedSudokuLs[y][x].indexOf(nb) < 0) {
	// usedSudokuLs[y][x] = usedSudokuLs[y][x] + nb;
	// }
	// }
	//
	// // 記錄歷程
	// if (courseSudokuLs[y][x] == null) {
	// courseSudokuLs[y][x] = nb;
	// } else {
	// courseSudokuLs[y][x] = courseSudokuLs[y][x] + nb;
	// }
	// }
	//
	// /**
	// * 紀錄答案
	// *
	// * @param y
	// * @param x
	// * @param nb
	// */
	// public void answerSudokuLs(int y, int x, String nb) {
	//
	// answerSudokuLs[y][x] = nb;
	// }
	//
	// /**
	// * XYZ復原
	// *
	// * @param y
	// * @param x
	// * @param nb
	// */
	// public void allRecovery(int y, int x) {
	//
	// xRecovery(y, x, answerSudokuLs[y][x]);
	// yRecovery(y, x, answerSudokuLs[y][x]);
	// zRecovery(y, x, answerSudokuLs[y][x]);
	// answerSudokuLs[y][x] = null;
	// }
	//
	// /**
	// * 十字確認
	// *
	// * @param y
	// * @param x
	// * @param nb
	// * @return
	// */
	// public boolean isValueByCrossCheck(int y, int x, String nb) {
	//
	// // 水平確認
	// for (int j = 0; j < SUDOKU_SIZE; j++) {
	// if (nb.equals(answerSudokuLs[y][j])) {
	// return true;
	// }
	// }
	// // 垂直確認
	// for (int i = 0; i < SUDOKU_SIZE; i++) {
	// if (nb.equals(answerSudokuLs[i][x])) {
	// return true;
	// }
	// }
	// return false;
	// }
	//
	// /**
	// * X軸復原
	// *
	// * @param y
	// * @param x
	// * @param nb
	// */
	// public void xRecovery(int y, int x, String nb) {
	//
	// boolean isSame = false;
	// for (int j = 0; j < SUDOKU_SIZE; j++) {
	// for (int i = 0; i < SUDOKU_SIZE; i++) {
	// // 指定目前位置
	// if (nb.equals(answerSudokuLs[i][j])) {
	// isSame = true;
	// break;
	// } else if (answerSudokuLs[i][j] == null) {
	// break;
	// }
	// }
	// if (!isSame)
	// sudokuLs[y][j] = sudokuLs[y][j] + nb;
	// isSame = false;
	// }
	// }
	//
	// /**
	// * Y軸復原
	// *
	// * @param y
	// * @param x
	// * @param nb
	// */
	// public void yRecovery(int y, int x, String nb) {
	//
	// for (int i = y; i < SUDOKU_SIZE; i++) {
	// sudokuLs[i][x] = sudokuLs[i][x] + nb;
	// }
	// }
	//
	// /**
	// * Z區復原
	// *
	// * @param y
	// * @param x
	// * @param nb
	// */
	// public void zRecovery(int y, int x, String nb) {
	//
	// int xStart, xEnd, yEnd;
	// if (x <= 2) {
	// xStart = 0;
	// xEnd = 2;
	// } else if (x <= 5) {
	// xStart = 3;
	// xEnd = 5;
	// } else {
	// xStart = 6;
	// xEnd = 8;
	// }
	// if (y <= 2) {
	// yEnd = 2;
	// } else if (y <= 5) {
	// yEnd = 5;
	// } else {
	// yEnd = 8;
	// }
	// // Z區檢查時不包含已檢查的 X軸和Y軸
	// for (int i = y + 1; i <= yEnd; i++) {
	// for (int j = xStart; j <= xEnd; j++) {
	// if (j != x) {
	// if (!isValueByCrossCheck(i, j, nb)) {
	// sudokuLs[i][j] = sudokuLs[i][j] + nb;
	// }
	// }
	// }
	// }
	// }
	//
	// /**
	// * 刪除XYZ的『候選字』
	// *
	// * @param y
	// * @param x
	// * @param nb
	// */
	// public void allRemove(int y, int x, String nb) {
	//
	// xRemove(y, x, nb);
	// yRemove(y, x, nb);
	// zRemove(y, x, nb);
	// }
	//
	// /**
	// * X軸刪除『候選字』
	// *
	// * @param x
	// * @param y
	// * @param nb
	// */
	// public void xRemove(int y, int x, String nb) {
	//
	// for (int j = 0; j < SUDOKU_SIZE; j++) {
	// sudokuLs[y][j] = sudokuLs[y][j].replace(nb, "");
	// }
	// }
	//
	// /**
	// * Y軸刪除『候選字』
	// *
	// * @param y
	// * @param x
	// * @param nb
	// */
	// public void yRemove(int y, int x, String nb) {
	//
	// for (int i = 0; i < SUDOKU_SIZE; i++) {
	// sudokuLs[i][x] = sudokuLs[i][x].replace(nb, "");
	// }
	// }
	//
	// /**
	// * Z區刪除『候選字』
	// *
	// * @param y
	// * @param x
	// * @param nb
	// */
	// public void zRemove(int y, int x, String nb) {
	// int xStart, xEnd, yStart, yEnd;
	// if (x <= 2) {
	// xStart = 0;
	// xEnd = 2;
	// } else if (x <= 5) {
	// xStart = 3;
	// xEnd = 5;
	// } else {
	// xStart = 6;
	// xEnd = 8;
	// }
	//
	// if (y <= 2) {
	// yStart = 0;
	// yEnd = 2;
	// } else if (y <= 5) {
	// yStart = 3;
	// yEnd = 5;
	// } else {
	// yStart = 6;
	// yEnd = 8;
	// }
	// for (int i = yStart; i <= yEnd; i++) {
	// for (int j = xStart; j <= xEnd; j++) {
	// sudokuLs[i][j] = sudokuLs[i][j].replace(nb, "");
	// }
	// }
	// }
	//
	// /**
	// * 創建歷程紀錄
	// *
	// * @param StopTime
	// * @param StartTime
	// */
	// public void printCreationHistoryRecord() {
	//
	// System.out.println("~~~~~~~~~~~創建歷程紀錄~~~~~~~~~~~~~");
	// for (int i = 0; i < SUDOKU_SIZE; i++) {
	// for (int j = 0; j < SUDOKU_SIZE; j++) {
	// if (j == 2 || j == 5) {
	// System.out.print("(" + courseSudokuLs[i][j] + ")" + " | ");
	// } else {
	// System.out.print("(" + courseSudokuLs[i][j] + ")");
	// }
	// }
	// System.out.println();
	// if (i == 2 || i == 5) {
	// System.out.println("-------------------------------");
	// }
	// }
	// }
	//
	// /**
	// * 印出結果
	// */
	// public void printSudokuAllLs() {
	//
	// printSudokuAllLs(0, 0);
	// }
	//
	// /**
	// * 印出結果
	// */
	// public void printSudokuAllLs(long stopTime, long startTime) {
	//
	// // System.out.println("~~~~~~~~~~~~SUDOKU_SIZE~~~~~~~~~~~~");
	// // for (int i = 0; i < SUDOKU_SIZE; i++) {
	// // for (int j = 0; j < SUDOKU_SIZE; j++) {
	// // if (j == 2 || j == 5) {
	// // System.out.print(sudokuLs[i][j] + "[]");
	// // } else {
	// // System.out.print(sudokuLs[i][j] + "|");
	// // }
	// // }
	// // System.out.println();
	// // }
	// // System.out.println("~~~~~~~~~~~usedSudokuLs~~~~~~~~~~~~~");
	// // for (int i = 0; i < SUDOKU_SIZE; i++) {
	// // for (int j = 0; j < SUDOKU_SIZE; j++) {
	// // if (j == 2 || j == 5) {
	// // System.out.print("(" + usedSudokuLs[i][j] + ")" + "[]");
	// // } else {
	// // System.out.print("(" + usedSudokuLs[i][j] + ")");
	// // }
	// // }
	// // System.out.println();
	// // }
	// System.out.println("~~~~~~~~~~~~answerSudokuLs~~~~~~~~~~~~");
	// for (int i = 0; i < SUDOKU_SIZE; i++) {
	// for (int j = 0; j < SUDOKU_SIZE; j++) {
	// if (j == 2 || j == 5) {
	// System.out.print(answerSudokuLs[i][j] + "|");
	// } else {
	// System.out.print(answerSudokuLs[i][j]);
	// }
	// }
	// System.out.println();
	// if (i == 2 || i == 5) {
	// System.out.println("---------------");
	// }
	// }
	//
	// if (stopTime != 0 && startTime != 0) {
	// String useTime = (stopTime - startTime) + "";
	// System.out.println("\n用時：" + useTime + "毫秒");
	// }
	// }
});
