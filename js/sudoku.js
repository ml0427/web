var app = angular.module("app", []);

app.controller('controller', function ($scope) {

	/**
	 * 數獨大小，預設=9
	 */
	$scope.sudokuSize = 9;

	/**
	 * 難度 (1~3)難度 1:困難 2:中等 3:簡單
	 */
	$scope.degree = function (degree) {
		var diggingHolesNumber = 40;
		switch (degree) {
			case 1:
				diggingHolesNumber = 60;
				break;
			case 2:
				diggingHolesNumber = 50;
				break;
			case 3:
				diggingHolesNumber = 40;
				break;
			default:
				diggingHolesNumber = 40;
		}
		return diggingHolesNumber;
	};

	/**
	 * 挖洞
	 */
	$scope.diggingHoles = function () {
		$scope.randomNbLs = new Set();

		while ($scope.randomNbLs.size < $scope.degree()) {
			var randomX = Math.floor(Math.random() * (9));
			var randomY = Math.floor(Math.random() * (9));
			$scope.randomNbLs.add('' + randomX + randomY);
		}
		$scope.randomNbLs.forEach(function (randomNb) {
			$scope.sudokuLs[randomNb.substring(0, 1)][randomNb.substring(1)].answerSudokuLs = '';
			$scope.sudokuLs[randomNb.substring(0, 1)][randomNb.substring(1)].isImport = true;
		});
	}

	/**
	 * ALL陣列 ( 預選字：preselectedStr, 計算用：sudokuLs, 答案：answerSudokuLs, 已使用：usedSudokuLs, 歷程：courseSudokuLs)
	 */
	$scope.initSudokuLs = function () {
		var sudokuLs = [];
		for (i = 0; i < $scope.sudokuSize; i++) {
			sudokuLs[i] = [];
			for (j = 0; j < $scope.sudokuSize; j++) {
				sudokuLs[i][j] = {
					// 計算用
					sudokuLs: "123456789",
					// 答案
					answerSudokuLs: null,
					// 已使用
					usedSudokuLs: null,
					// 歷程
					courseSudokuLs: null,
					// 可修改狀態
					isImport: false
				};
			}
		}
		return sudokuLs;
	};

	/**
	 * ALL陣列 ( 計算用：sudokuLs, 答案：answerSudokuLs, 已使用：usedSudokuLs, 歷程：courseSudokuLs)
	 */
	$scope.sudokuLs = $scope.initSudokuLs();
	console.log($scope.sudokuLs);

	/**
	 * Error check。 若此到最後有任一候選字為"空"，或此位置全部都選擇過，則<<復原處理>>
	 */
	$scope.checkIsError = function (y, x) {
		for (j = y; j < $scope.sudokuSize; j++) {
			for (i = x; i < $scope.sudokuSize; i++) {
				if (!$scope.sudokuLs[j][i].sudokuLs) {
					return "";
				}
			}
		}
		var a = $scope.sudokuLs[y][x].usedSudokuLs;
		var b = $scope.sudokuLs[y][x].sudokuLs;
		if ($scope.sudokuLs[y][x].usedSudokuLs != null) {
			a.split("").forEach(function (str) {
				if (b.includes(str)) {
					b = b.replace((str), "");
				}
			});
		}
		if ($scope.sudokuLs[y][x].sudokuLs === null || "" === b) {
			$scope.sudokuLs[y][x].usedSudokuLs = null;
			return "";
		} else {
			return b;
		}
	};

	/**
	 * 紀錄已使用的候選字
	 */
	$scope.usedSudokuLs = function (y, x, nb) {
		if ($scope.sudokuLs[y][x].usedSudokuLs === null) {
			$scope.sudokuLs[y][x].usedSudokuLs = nb;
		} else {
			if ($scope.sudokuLs[y][x].usedSudokuLs.indexOf(nb) < 0) {
				$scope.sudokuLs[y][x].usedSudokuLs = $scope.sudokuLs[y][x].usedSudokuLs + nb;
			}
		}
		// 記錄歷程
		if ($scope.sudokuLs[y][x].courseSudokuLs == null) {
			$scope.sudokuLs[y][x].courseSudokuLs = nb;
		} else {
			$scope.sudokuLs[y][x].courseSudokuLs += nb;
		}

	}

	/**
	 * 紀錄答案
	 */
	$scope.answerSudokuLs = function (y, x, nb) {

		$scope.sudokuLs[y][x].answerSudokuLs = nb;
	}

	/**
	 * XYZ復原
	 */
	$scope.allRecovery = function (y, x) {

		$scope.xRecovery(y, x, $scope.sudokuLs[y][x].answerSudokuLs);
		$scope.yRecovery(y, x, $scope.sudokuLs[y][x].answerSudokuLs);
		$scope.zRecovery(y, x, $scope.sudokuLs[y][x].answerSudokuLs);
		$scope.sudokuLs[y][x].answerSudokuLs = null;
	}

	/**
	 * 十字確認
	 */
	$scope.isValueByCrossCheck = function (y, x, nb) {

		// 水平確認
		for (var j = 0; j < $scope.sudokuSize; j++) {
			if (nb === $scope.sudokuLs[y][j].answerSudokuLs) {
				return true;
			}
		}
		// 垂直確認
		for (var i = 0; i < $scope.sudokuSize; i++) {
			if (nb === $scope.sudokuLs[i][x].answerSudokuLs) {
				return true;
			}
		}
		return false;
	}

	/**
	 * X軸復原
	 */
	$scope.xRecovery = function (y, x, nb) {

		var isSame = false;
		for (var j = 0; j < $scope.sudokuSize; j++) {
			for (var i = 0; i < $scope.sudokuSize; i++) {
				// 指定目前位置
				if (nb === $scope.sudokuLs[i][j].answerSudokuLs) {
					isSame = true;
					break;
				} else if (!$scope.sudokuLs[i][j].answerSudokuLs) {
					break;
				}
			}
			if (!isSame) {
				$scope.sudokuLs[y][j].sudokuLs += nb;
			}
			isSame = false;
		}
	}

	/**
	 * Y軸復原
	 */
	$scope.yRecovery = function (y, x, nb) {

		for (var i = y; i < $scope.sudokuSize; i++) {
			$scope.sudokuLs[i][x].sudokuLs = $scope.sudokuLs[i][x].sudokuLs + nb;
		}
	}

	/**
	 * Z區復原
	 */
	$scope.zRecovery = function (y, x, nb) {

		var xStart, xEnd, yEnd;
		if (x <= 2) {
			xStart = 0;
			xEnd = 2;
		} else if (x <= 5) {
			xStart = 3;
			xEnd = 5;
		} else {
			xStart = 6;
			xEnd = 8;
		}
		if (y <= 2) {
			yEnd = 2;
		} else if (y <= 5) {
			yEnd = 5;
		} else {
			yEnd = 8;
		}
		// Z區檢查時不包含已檢查的 X軸和Y軸
		for (var i = y + 1; i <= yEnd; i++) {
			for (var j = xStart; j <= xEnd; j++) {
				if (j != x) {
					if (!$scope.isValueByCrossCheck(i, j, nb)) {
						$scope.sudokuLs[i][j].sudokuLs = $scope.sudokuLs[i][j].sudokuLs + nb;
					}
				}
			}
		}
	}

	/**
	 * 刪除XYZ的『候選字』
	 */
	$scope.allRemove = function (y, x, nb) {

		$scope.xRemove(y, x, nb);
		$scope.yRemove(y, x, nb);
		$scope.zRemove(y, x, nb);
	}

	/**
	 * X軸刪除『候選字』
	 */
	$scope.xRemove = function (y, x, nb) {

		for (var j = 0; j < $scope.sudokuSize; j++) {
			$scope.sudokuLs[y][j].sudokuLs = $scope.sudokuLs[y][j].sudokuLs.replace(nb, "");
		}
	}

	/**
	 * Y軸刪除『候選字』
	 */
	$scope.yRemove = function (y, x, nb) {

		for (var i = 0; i < $scope.sudokuSize; i++) {
			$scope.sudokuLs[i][x].sudokuLs = $scope.sudokuLs[i][x].sudokuLs.replace(nb, "");
		}
	}

	/**
	 * Z區刪除『候選字』
	 */
	$scope.zRemove = function (y, x, nb) {
		var xStart, xEnd, yStart, yEnd;
		if (x <= 2) {
			xStart = 0;
			xEnd = 2;
		} else if (x <= 5) {
			xStart = 3;
			xEnd = 5;
		} else {
			xStart = 6;
			xEnd = 8;
		}

		if (y <= 2) {
			yStart = 0;
			yEnd = 2;
		} else if (y <= 5) {
			yStart = 3;
			yEnd = 5;
		} else {
			yStart = 6;
			yEnd = 8;
		}
		for (var i = yStart; i <= yEnd; i++) {
			for (var j = xStart; j <= xEnd; j++) {
				$scope.sudokuLs[i][j].sudokuLs = $scope.sudokuLs[i][j].sudokuLs.replace(nb, "");
			}
		}
	}

	/**
	 * 創建歷程紀錄
	 */
	$scope.printCreationHistoryRecord = function () {

		var str = ("~~~~~~~~~~~創建歷程紀錄~~~~~~~~~~~~~\n");
		for (var i = 0; i < $scope.sudokuSize; i++) {
			for (var j = 0; j < $scope.sudokuSize; j++) {
				if (j == 2 || j == 5) {
					str += ("(" + $scope.sudokuLs[i][j].courseSudokuLs + ")" + " | ");
				} else {
					str += ("(" + $scope.sudokuLs[i][j].courseSudokuLs + ")");
				}
			}
			str += ("\n");
			if (i == 2 || i == 5) {
				str += ("-------------------------------\n");
			}
		}
		console.log(str);
	}

	/**
	 * 印出結果
	 */
	$scope.printSudokuAllLs = function () {

		$scope.printSudokuAllLs(0, 0);
	}

	/**
	 * 印出結果
	 */
	$scope.printSudokuAllLs = function (stopTime, startTime) {

		var str3 = "~~~~~~~~~~~~答案~~~~~~~~~~~~\n";
		for (var i = 0; i < $scope.sudokuSize; i++) {
			for (var j = 0; j < $scope.sudokuSize; j++) {
				if (j === 2 || j === 5) {
					str3 += ($scope.sudokuLs[i][j].answerSudokuLs + "|");
				} else {
					str3 += ($scope.sudokuLs[i][j].answerSudokuLs);
				}
			}
			str3 += '\n';
			if (i == 2 || i == 5) {
				str3 += "-----------\n";
			}
		}

		if (stopTime && startTime) {
			var useTime = (stopTime - startTime) + "";
			console.log("\n用時：" + useTime + "毫秒");
		}
		console.log(str3);
		// var str1 = ("~~~~~~~~~~~~預選字用~~~~~~~~~~~~\n");
		// for (var i = 0; i < $scope.sudokuSize; i++) {
		// for (var j = 0; j < $scope.sudokuSize; j++) {
		// if (j == 2 || j == 5) {
		// str1 += ($scope.sudokuLs[i][j].sudokuLs + "[]");
		// } else {
		// str1 += ($scope.sudokuLs[i][j].sudokuLs + "|");
		// }
		// }
		// str1 += '\n';
		// if (i == 2 || i == 5) {
		// str1 += "---------------\n";
		// }
		// }
		// console.log(str1);

		// var str2 = ("~~~~~~~~~~~已使用~~~~~~~~~~~~~\n");
		// for (var i = 0; i < $scope.sudokuSize; i++) {
		// for (var j = 0; j < $scope.sudokuSize; j++) {
		// if (j == 2 || j == 5) {
		// str2 += ("(" + $scope.sudokuLs[i][j].usedSudokuLs + ")" + "[]");
		// } else {
		// str2 += ("(" + $scope.sudokuLs[i][j].usedSudokuLs + ")");
		// }
		// }
		// str2 += '\n';
		// if (i == 2 || i == 5) {
		// str2 += "---------------\n";
		// }
		// }
		// console.log(str2);
	}

	/**
	 * 製作數獨地圖
	 */
	$scope.createSudoku = function () {

		for (var j = 0; j < $scope.sudokuSize; j++) {
			for (var i = 0; i < $scope.sudokuSize; i++) {

				// 執行太久就重新執行 (不知道為何，在JAVA上就沒遇過這個問題，竟然可以跑道上萬行去...)
				if ($scope.sudokuLs[j][i].courseSudokuLs && $scope.sudokuLs[j][i].courseSudokuLs.length > 200) {
					$scope.sudokuLs = $scope.initSudokuLs();
					i = 0;
					j = 0;
				}
				// console.log('座標 >>> ', j + 1, i + 1);
				// 可選數字
				var optional = $scope.checkIsError(j, i);
				if ("" === optional) {
					// console.log("<<< 復原處理 >>>");
					if (i > 0) {
						i--;
					} else {
						j--;
						i = $scope.sudokuSize - 1;
					}
					$scope.allRecovery(j, i);
					i--;

					// $scope.printSudokuAllLs();
					// console.log("<<< 復原處理 END >>>");
				} else {
					// 選擇數字
					var randomNb = Math.random() * optional.length;
					var nb = optional.substring(randomNb, randomNb + 1);
					// 紀錄已使用
					$scope.usedSudokuLs(j, i, nb);
					// 目前答案
					$scope.answerSudokuLs(j, i, nb);
					// 刪除XYZ的『候選字』
					$scope.allRemove(j, i, nb);
					// $scope.printSudokuAllLs();
				}
			}
		}

	}
	var start = new Date().getTime();
	$scope.createSudoku();
	var end = new Date().getTime();

	$scope.printSudokuAllLs(end, start);

	// 歷史紀錄
	// $scope.printCreationHistoryRecord();

	// 挖洞
	$scope.diggingHoles();

	$scope.ip = function (rowIndex, columnIndex) {
		console.log(rowIndex, columnIndex);
	}
});
