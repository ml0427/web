(function() {

	var app = angular.module('myApp', []);

	app.directive('ngRightClick', function($parse) {
		return function(scope, element, attrs) {
			var fn = $parse(attrs.ngRightClick);
			element.bind('contextmenu', function(event) {
				scope.$apply(function() {
					event.preventDefault();
					fn(scope, {
						$event : event
					});
				});
			});
		};
	});

	app.controller('controller', function($scope, $timeout) {
		var myCountTime;
		$scope.gameStart = function(x, y, bombAllNb, chooseDifficulty) {
			// console.log(x, y, bombAllNb);

			// 時間清除
			$timeout.cancel(myCountTime);
			// 地圖初始化
			$scope.arrayLsLs = [];
			// 參數初始化
			$scope.parameter = {
				gameTime : 0,
				bombAllNb : bombAllNb,
				remainBombNb : bombAllNb,
				x : x,
				y : y
			}

			// 難度設定
			$scope.difficulty($scope.parameter.x, $scope.parameter.y, $scope.parameter.bombAllNb, chooseDifficulty);
			// 計時
			myCountTime = $timeout($scope.countTime, 1000);
			// 製造地圖
			$scope.createMap($scope.parameter.x, $scope.parameter.y);
			// 製作炸彈
			$scope.randomBombsMap($scope.parameter.x, $scope.parameter.y, $scope.parameter.bombAllNb);
			// 計算炸彈數量
			$scope.countNumberOfBombs($scope.parameter.x, $scope.parameter.y);

		}

		// 難度
		$scope.difficulty = function(x, y, bombAllNb, chooseDifficulty) {

			// 初級：9 × 9，10顆地雷（Windows 2000或以後）
			// 中級：16 × 16，40顆地雷
			// 高級：30 × 16，99顆地雷
			console.log("難度選擇", chooseDifficulty);
			if (chooseDifficulty == 1) {
				$scope.parameter.x = 16;
				$scope.parameter.y = 30;
				$scope.parameter.bombAllNb = 99;
				$scope.parameter.remainBombNb = 99;
			}
			if (chooseDifficulty == 2) {
				$scope.parameter.x = 16;
				$scope.parameter.y = 16;
				$scope.parameter.bombAllNb = 40;
				$scope.parameter.remainBombNb = 40;
			}
			if (chooseDifficulty == 3) {
				$scope.parameter.x = 9;
				$scope.parameter.y = 9;
				$scope.parameter.bombAllNb = 10;
				$scope.parameter.remainBombNb = 10;
			}
			if (chooseDifficulty == 4) {
				$scope.parameter.x = x;
				$scope.parameter.y = y;
				$scope.parameter.bombAllNb = bombAllNb;
				$scope.parameter.remainBombNb = bombAllNb;
			}
			console.log("難度選擇結束", x, y, bombAllNb);
		}

		// 計時器
		$scope.countTime = function() {
			$scope.parameter.gameTime++;
			myCountTime = $timeout($scope.countTime, 1000);
			console.log($scope.parameter.gameTime + "秒");
		};

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
						open : false,
						banner : false,
						isbomb : false
					};
				}
			}
			console.log("製造地圖結束");
		}

		// 製作炸彈地圖
		$scope.randomBombsMap = function(x, y, bombAllNb) {

			if (bombAllNb > x * y) {
				alert("炸彈超過地圖拉");
			} else {
				console.log("製作炸彈");
				for (var i = 0; i < bombAllNb; i++) {
					var randomX = Math.floor(Math.random() * x);
					var randomY = Math.floor(Math.random() * y);
					if ($scope.arrayLsLs[randomX][randomY].isbomb == true) {
						i--;
					} else {
						$scope.arrayLsLs[randomX][randomY].isbomb = true;
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
					if ($scope.arrayLsLs[i][j].isbomb) {
						// 如果不是在最上邊
						if (i != 0) {
							if (!$scope.arrayLsLs[i - 1][j].isbomb) {
								// 上+1
								$scope.arrayLsLs[i - 1][j].bombNb = $scope.arrayLsLs[i - 1][j].bombNb + 1;
							}
						}
						// 如果不是在最下邊
						if (i != $scope.arrayLsLs.length - 1) {
							if (!$scope.arrayLsLs[i + 1][j].isbomb) {
								// 下+1
								$scope.arrayLsLs[i + 1][j].bombNb = $scope.arrayLsLs[i + 1][j].bombNb + 1;
							}
						}
						// 如果不是在最右邊
						if (j != $scope.arrayLsLs[i].length - 1) {
							if (!$scope.arrayLsLs[i][j + 1].isbomb) {
								// 右+1
								$scope.arrayLsLs[i][j + 1].bombNb = $scope.arrayLsLs[i][j + 1].bombNb + 1;
							}
						}
						// 如果不是在最左邊
						if (j != 0) {
							if (!$scope.arrayLsLs[i][j - 1].isbomb) {
								// 左+1
								$scope.arrayLsLs[i][j - 1].bombNb = $scope.arrayLsLs[i][j - 1].bombNb + 1;
							}
						}
						// 如果不是在最右下
						if (i != $scope.arrayLsLs.length - 1 && j != $scope.arrayLsLs[i].length - 1) {
							if (!$scope.arrayLsLs[i + 1][j + 1].isbomb) {
								// 右下+1
								$scope.arrayLsLs[i + 1][j + 1].bombNb = $scope.arrayLsLs[i + 1][j + 1].bombNb + 1;
							}
						}
						// 如果不是在最左下
						if (i != $scope.arrayLsLs.length - 1 && j != 0) {
							if (!$scope.arrayLsLs[i + 1][j - 1].isbomb) {
								// 左下+1
								$scope.arrayLsLs[i + 1][j - 1].bombNb = $scope.arrayLsLs[i + 1][j - 1].bombNb + 1;
							}
						}
						// 如果不是在最右上
						if (i != 0 && j != $scope.arrayLsLs[i].length - 1) {
							if (!$scope.arrayLsLs[i - 1][j + 1].isbomb) {
								// 右上+1
								$scope.arrayLsLs[i - 1][j + 1].bombNb = $scope.arrayLsLs[i - 1][j + 1].bombNb + 1;
							}
						}
						// 如果不是在最左上
						if (i != 0 && j != 0) {
							if (!$scope.arrayLsLs[i - 1][j - 1].isbomb) {
								// 左上+1
								$scope.arrayLsLs[i - 1][j - 1].bombNb = $scope.arrayLsLs[i - 1][j - 1].bombNb + 1;
							}
						}
					}
				}
			}
			console.log("計算炸彈數量結束");
		}

		// 檢查地圖
		$scope.statusCheck = function(x, y) {

			console.log("檢查地圖");
			var isChecking = false;
			$scope.goodGame = true;
			for (var i = 0; i < $scope.arrayLsLs.length; i++) {
				for (var j = 0; j < $scope.arrayLsLs[i].length; j++) {
					// 如果狀態未開，而且裡面不是炸彈的話
					if (!$scope.arrayLsLs[i][j].open && !$scope.arrayLsLs[i][j].isbomb) {
						$scope.goodGame = false;
					}
					// 找到使用者輸入的位置
					if ($scope.arrayLsLs[i][j].open && $scope.arrayLsLs[i][j].bombNb == 0) {

						// 如果不是在最上邊
						if (i != 0) {
							if (!$scope.arrayLsLs[i - 1][j].isbomb && !$scope.arrayLsLs[i - 1][j].open) {
								$scope.arrayLsLs[i - 1][j].open = true;
								isChecking = true;
							}
						}
						// 如果不是在最下邊
						if (i != $scope.arrayLsLs.length - 1) {
							if (!$scope.arrayLsLs[i + 1][j].isbomb && !$scope.arrayLsLs[i + 1][j].open) {
								// 下+1
								$scope.arrayLsLs[i + 1][j].open = true;
								isChecking = true;
							}
						}
						// 如果不是在最右邊
						if (j != $scope.arrayLsLs[i].length - 1) {
							if (!$scope.arrayLsLs[i][j + 1].isbomb && !$scope.arrayLsLs[i][j + 1].open) {
								// 右+1
								$scope.arrayLsLs[i][j + 1].open = true;
								isChecking = true;
							}
						}
						// 如果不是在最左邊
						if (j != 0) {
							if (!$scope.arrayLsLs[i][j - 1].isbomb && !$scope.arrayLsLs[i][j - 1].open) {
								// 左+1
								$scope.arrayLsLs[i][j - 1].open = true;
								isChecking = true;
							}
						}
						// 如果不是在最右下
						if (i != $scope.arrayLsLs.length - 1 && j != $scope.arrayLsLs[i].length - 1) {
							if (!$scope.arrayLsLs[i + 1][j + 1].isbomb && !$scope.arrayLsLs[i + 1][j + 1].open) {
								// 右下+1
								$scope.arrayLsLs[i + 1][j + 1].open = true;
								isChecking = true;
							}
						}
						// 如果不是在最左下
						if (i != $scope.arrayLsLs.length - 1 && j != 0) {
							if (!$scope.arrayLsLs[i + 1][j - 1].isbomb && !$scope.arrayLsLs[i + 1][j - 1].open) {
								// 左下+1
								$scope.arrayLsLs[i + 1][j - 1].open = true;
								isChecking = true;
							}
						}
						// 如果不是在最右上
						if (i != 0 && j != $scope.arrayLsLs[i].length - 1) {
							if (!$scope.arrayLsLs[i - 1][j + 1].isbomb && !$scope.arrayLsLs[i - 1][j + 1].open) {
								// 右上+1
								$scope.arrayLsLs[i - 1][j + 1].open = true;
								isChecking = true;
							}
						}
						// 如果不是在最左上
						if (i != 0 && j != 0) {
							if (!$scope.arrayLsLs[i - 1][j - 1].isbomb && !$scope.arrayLsLs[i - 1][j - 1].open) {
								// 左上+1
								$scope.arrayLsLs[i - 1][j - 1].open = true;
								isChecking = true;
							}
						}
					}
				}
			}
			if (isChecking)
				$scope.statusCheck(x, y);

			console.log("檢查地圖結束");
		}

		// 計算炸彈剩餘數量
		$scope.countRemainBombNb = function(x, y) {
			if (!$scope.arrayLsLs[x][y].open) {
				if (!$scope.arrayLsLs[x][y].banner) {
					$scope.parameter.remainBombNb--;
				} else {
					$scope.parameter.remainBombNb++;
				}
				console.log("計算炸彈剩餘數量", $scope.remainBombNb);
			}
		}

		$scope.rightClick = function(x, y) {
			$scope.countRemainBombNb(x, y);
			if (!$scope.arrayLsLs[x][y].open) {
				$scope.arrayLsLs[x][y].banner = !$scope.arrayLsLs[x][y].banner;
			}
			console.log("按了右鍵", "位置", x, y);
		};

		$scope.leftClick = function(x, y) {
			if (!$scope.arrayLsLs[x][y].banner) {
				$scope.arrayLsLs[x][y].open = true;
				if (!$scope.arrayLsLs[x][y].isbomb) {
					// 檢查地圖(開圖)
					$scope.statusCheck(x, y);
					if ($scope.goodGame) {
						$timeout.cancel(myCountTime);
						alert("花了" + $scope.parameter.gameTime + "秒，賽道的拉");
					}
				} else {
					for (var i = 0; i < $scope.arrayLsLs.length; i++) {
						for (var j = 0; j < $scope.arrayLsLs[0].length; j++) {
							$scope.arrayLsLs[i][j].banner = false;
							$scope.arrayLsLs[i][j].open = true;
						}
					}
					$timeout.cancel(myCountTime);
					alert("you are die");
				}
			}
			console.log("按了左鍵", "位置", x, y);
		}

	});
})();