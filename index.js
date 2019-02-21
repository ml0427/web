var app = angular.module('myApp', []);

app.controller('controller', function($scope) {
	var x, y, arrayLsLs;

	$scope.$watchGroup([ 'test.x', 'test.y', 'test.bombAllNb' ], function(newValue, oldValue, scope) {
		var x = newValue[0];
		var y = newValue[1];
		var bombAllNb = newValue[2];
		// console.log(x, y);

		$scope.arrayLsLs = [];

		if (x && y) {
			// 製造地圖
			$scope.createMap(x, y);
			if (bombAllNb) {
				// 製作炸彈
				$scope.random(x, y, bombAllNb);
				// 計算炸彈數量
				$scope.countNumberOfBombs(x, y);
			}
		}
	});

	// 製造地圖
	$scope.createMap = function(x, y) {

		console.log("製造地圖");
		for (i = 0; i < x; i++) {
			$scope.arrayLsLs[i] = [];
			for (j = 0; j < y; j++) {
				$scope.arrayLsLs[i][j] = {
					x : i,
					y : j,
					bombNb : 0,
					count : "."
				};
			}
		}
		console.log("製造地圖結束");
	}

	// 製作炸彈
	$scope.random = function(x, y, bombAllNb) {

		if (bombAllNb > x * y) {
			alert("炸彈超過地圖拉");
		} else {
			console.log("製作炸彈");
			for (var i = 0; i < bombAllNb; i++) {
				var randomX = Math.floor(Math.random() * x);
				var randomY = Math.floor(Math.random() * y);

				// console.log("亂數", randomX, randomY);
				// console.log("位置", $scope.arrayLsLs[randomX][randomY]);
				if ($scope.arrayLsLs[randomX][randomY].count === "x") {
					i--;
				} else {
					$scope.arrayLsLs[randomX][randomY].count = "x";
					$scope.arrayLsLs[randomX][randomY].bombNb = "x";
				}
			}
		}
		console.log("製作炸彈結束");
	}

	// 計算炸彈數量
	$scope.countNumberOfBombs = function(x, y) {

		console.log("計算炸彈數量");
		// 計算+1本炸彈左右邊的數字
		for (var i = 0; i < x; i++) {
			for (var j = 0; j < y; j++) {
				// 找到*的位置
				if ($scope.arrayLsLs[i][j].count === "x") {
					// 如果不是在最上邊
					if (i != 0) {
						if ($scope.arrayLsLs[i - 1][j].count !== "x") {
							// 上+1
							$scope.arrayLsLs[i - 1][j].bombNb = $scope.arrayLsLs[i - 1][j].bombNb + 1;
						}
					}
					// 如果不是在最下邊
					if (i != $scope.arrayLsLs.length - 1) {
						if ($scope.arrayLsLs[i + 1][j].count !== "x") {
							// 下+1
							$scope.arrayLsLs[i + 1][j].bombNb = $scope.arrayLsLs[i + 1][j].bombNb + 1;
						}
					}
					// 如果不是在最右邊
					if (j != $scope.arrayLsLs[i].length - 1) {
						if ($scope.arrayLsLs[i][j + 1].count !== "x") {
							// 右+1
							$scope.arrayLsLs[i][j + 1].bombNb = $scope.arrayLsLs[i][j + 1].bombNb + 1;
						}
					}
					// 如果不是在最左邊
					if (j != 0) {
						if ($scope.arrayLsLs[i][j - 1].count !== "x") {
							// 左+1
							$scope.arrayLsLs[i][j - 1].bombNb = $scope.arrayLsLs[i][j - 1].bombNb + 1;
						}
					}
					// 如果不是在最右下
					if (i != $scope.arrayLsLs.length - 1 && j != $scope.arrayLsLs[i].length - 1) {
						if ($scope.arrayLsLs[i + 1][j + 1].count !== "x") {
							// 右下+1
							$scope.arrayLsLs[i + 1][j + 1].bombNb = $scope.arrayLsLs[i + 1][j + 1].bombNb + 1;
						}
					}
					// 如果不是在最左下
					if (i != $scope.arrayLsLs.length - 1 && j != 0) {
						if ($scope.arrayLsLs[i + 1][j - 1].count !== "x") {
							// 左下+1
							$scope.arrayLsLs[i + 1][j - 1].bombNb = $scope.arrayLsLs[i + 1][j - 1].bombNb + 1;
						}
					}
					// 如果不是在最右上
					if (i != 0 && j != $scope.arrayLsLs[i].length - 1) {
						if ($scope.arrayLsLs[i - 1][j + 1].count !== "x") {
							// 右上+1
							$scope.arrayLsLs[i - 1][j + 1].bombNb = $scope.arrayLsLs[i - 1][j + 1].bombNb + 1;
						}
					}
					// 如果不是在最左上
					if (i != 0 && j != 0) {
						if ($scope.arrayLsLs[i - 1][j - 1].count !== "x") {
							// 左上+1
							$scope.arrayLsLs[i - 1][j - 1].bombNb = $scope.arrayLsLs[i - 1][j - 1].bombNb + 1;
						}
					}
				}
			}
		}
		console.log("計算炸彈數量結束");
	}

	$scope.test = function(x, y) {
		console.log("位置", x, y);
	}
});