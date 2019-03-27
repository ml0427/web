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
		// 計時
		myCountTime = $timeout($scope.countTime, 1000);
		// 難度設定
		$scope.difficulty($scope.parameter.x, $scope.parameter.y, $scope.parameter.bombAllNb, chooseDifficulty);
		// 製造地圖
		$scope.createMap($scope.parameter.x, $scope.parameter.y);
		// 製作炸彈
		$scope.randomBombsMap($scope.parameter.x, $scope.parameter.y, $scope.parameter.bombAllNb);
		// 計算炸彈數量
		$scope.countNumberOfBombs($scope.parameter.x, $scope.parameter.y);

		console.log("開始計時");
	}

	// 難度
	$scope.difficulty = function(x, y, bombAllNb, chooseDifficulty) {
		console.log("選擇難度");
		switch (chooseDifficulty) {
		case '1':
			$scope.parameter.x = 30;
			$scope.parameter.y = 16;
			$scope.parameter.bombAllNb = 99;
			$scope.parameter.remainBombNb = 99;
			break;
		case '2':
			$scope.parameter.x = 16;
			$scope.parameter.y = 16;
			$scope.parameter.bombAllNb = 40;
			$scope.parameter.remainBombNb = 40;
			break;
		case '3':
			$scope.parameter.x = 9;
			$scope.parameter.y = 9;
			$scope.parameter.bombAllNb = 10;
			$scope.parameter.remainBombNb = 10;
			break;
		case '4':
			$scope.parameter.x = x;
			$scope.parameter.y = y;
			$scope.parameter.bombAllNb = bombAllNb;
			$scope.parameter.remainBombNb = bombAllNb;
			break;
		default:
			$scope.chooseDifficulty = '';
			$scope.parameter.x = 0;
			$scope.parameter.y = 0;
			$scope.parameter.bombAllNb = 0;
			$scope.parameter.remainBombNb = 0;
			$scope.arrayLsLs = null;
			$timeout.cancel(myCountTime);
			break;
		}
		console.log("選擇" + $scope.chooseDifficultyName() + "難度", "地圖大小為" + $scope.parameter.x * $scope.parameter.y, "炸彈數量為" + $scope.parameter.bombAllNb);
	}

	$scope.chooseDifficultyName = function() {
		if ($scope.chooseDifficulty)
			return $('#chooseDifficulty option[value=' + $scope.chooseDifficulty + ']').html();
	};

	// 計時器
	$scope.countTime = function() {
		$scope.parameter.gameTime++;
		myCountTime = $timeout($scope.countTime, 1000);
		console.log($scope.parameter.gameTime + "秒");
	};

	// 製造地圖
	$scope.createMap = function(x, y) {
		console.log("製造地圖");
		for (i = 0; i < y; i++) {
			$scope.arrayLsLs[i] = [];
			for (j = 0; j < x; j++) {
				$scope.arrayLsLs[i][j] = {
					y : i,
					x : j,
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
			console.log("製作炸彈地圖");
			for (var i = 0; i < bombAllNb; i++) {
				var randomX = Math.floor(Math.random() * x);
				var randomY = Math.floor(Math.random() * y);
				if ($scope.arrayLsLs[randomY][randomX].isbomb == true) {
					i--;
				} else {
					$scope.arrayLsLs[randomY][randomX].isbomb = true;
					$scope.arrayLsLs[randomY][randomX].bombNb = "x";
				}
			}
		}
		console.log("製作炸彈地圖結束");
	}

	// 計算炸彈數量
	$scope.countNumberOfBombs = function(x, y) {
		console.log("計算炸彈數量");
		// 計算+1本炸彈左右邊的數字
		for (var i = 0; i < y; i++) {
			for (var j = 0; j < x; j++) {
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
	$scope.statusCheck = function(y, x) {
		console.log("檢查地圖");
		var isChecking = false;
		$scope.goodGame = true;
		for (var i = 0; i < $scope.arrayLsLs.length; i++) {
			for (var j = 0; j < $scope.arrayLsLs[i].length; j++) {
				// 如果狀態未開，而且裡面不是炸彈的話
				if (!$scope.arrayLsLs[i][j].open && !$scope.arrayLsLs[i][j].isbomb) {
					$scope.goodGame = false;
				}
				// 開到地雷
				if ($scope.arrayLsLs[i][j].open && $scope.arrayLsLs[i][j].isbomb) {
					$scope.goodGame = false;
					// 地圖全開
					for (var i = 0; i < $scope.arrayLsLs.length; i++) {
						for (var j = 0; j < $scope.arrayLsLs[0].length; j++) {
							$scope.arrayLsLs[i][j].banner = false;
							$scope.arrayLsLs[i][j].open = true;
						}
					}
					$timeout.cancel(myCountTime);
					alert("you are die");
					break;
					break;
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
			$scope.statusCheck(y, x);

		// 成功解地圖
		if ($scope.goodGame) {
			$timeout.cancel(myCountTime);
			alert("花了" + $scope.parameter.gameTime + "秒，賽道的拉");
		}
		console.log("檢查地圖結束");
	}

	// 計算炸彈剩餘數量
	$scope.countRemainBombNb = function(y, x) {
		if (!$scope.arrayLsLs[y][x].open) {
			if (!$scope.arrayLsLs[y][x].banner) {
				$scope.parameter.remainBombNb--;
			} else {
				$scope.parameter.remainBombNb++;
			}
			console.log("計算炸彈剩餘數量", $scope.parameter.remainBombNb);
		}
	}

	// 雙鍵功能
	$scope.leftAndRightClick = function(j, i) {
		console.log("計算旗幟數量");
		// 計算旗幟數量
		var bannerNB = 0;
		// 如果不是在最上邊
		if (i != 0 && $scope.arrayLsLs[i - 1][j].banner) {
			bannerNB++;
		}
		// 如果不是在最下邊
		if (i != $scope.arrayLsLs.length - 1 && $scope.arrayLsLs[i + 1][j].banner) {
			bannerNB++;
		}
		// 如果不是在最右邊
		if (j != $scope.arrayLsLs[i].length - 1 && $scope.arrayLsLs[i][j + 1].banner) {
			bannerNB++;
		}
		// 如果不是在最左邊
		if (j != 0 && $scope.arrayLsLs[i][j - 1].banner) {
			bannerNB++;
		}
		// 如果不是在最右下
		if (i != $scope.arrayLsLs.length - 1 && j != $scope.arrayLsLs[i].length - 1 && $scope.arrayLsLs[i + 1][j + 1].banner) {
			bannerNB++;
		}
		// 如果不是在最左下
		if (i != $scope.arrayLsLs.length - 1 && j != 0 && $scope.arrayLsLs[i + 1][j - 1].banner) {
			bannerNB++;
		}
		// 如果不是在最右上
		if (i != 0 && j != $scope.arrayLsLs[i].length - 1 && $scope.arrayLsLs[i - 1][j + 1].banner) {
			bannerNB++;
		}
		// 如果不是在最左上
		if (i != 0 && j != 0 && $scope.arrayLsLs[i - 1][j - 1].banner) {
			bannerNB++;
		}
		if (bannerNB == $scope.arrayLsLs[i][j].bombNb) {
			console.log("雙鍵功能");
			// 如果不是在最上邊
			if (i != 0) {
				if (!$scope.arrayLsLs[i - 1][j].banner && !$scope.arrayLsLs[i - 1][j].open) {
					$scope.arrayLsLs[i - 1][j].open = true;
				}
			}
			// 如果不是在最下邊
			if (i != $scope.arrayLsLs.length - 1) {
				if (!$scope.arrayLsLs[i + 1][j].banner && !$scope.arrayLsLs[i + 1][j].open) {
					$scope.arrayLsLs[i + 1][j].open = true;
				}
			}
			// 如果不是在最右邊
			if (j != $scope.arrayLsLs[i].length - 1) {
				if (!$scope.arrayLsLs[i][j + 1].banner && !$scope.arrayLsLs[i][j + 1].open) {
					$scope.arrayLsLs[i][j + 1].open = true;
				}
			}
			// 如果不是在最左邊
			if (j != 0) {
				if (!$scope.arrayLsLs[i][j - 1].banner && !$scope.arrayLsLs[i][j - 1].open) {
					$scope.arrayLsLs[i][j - 1].open = true;
				}
			}
			// 如果不是在最右下
			if (i != $scope.arrayLsLs.length - 1 && j != $scope.arrayLsLs[i].length - 1) {
				if (!$scope.arrayLsLs[i + 1][j + 1].banner && !$scope.arrayLsLs[i + 1][j + 1].open) {
					$scope.arrayLsLs[i + 1][j + 1].open = true;
				}
			}
			// 如果不是在最左下
			if (i != $scope.arrayLsLs.length - 1 && j != 0) {
				if (!$scope.arrayLsLs[i + 1][j - 1].banner && !$scope.arrayLsLs[i + 1][j - 1].open) {
					$scope.arrayLsLs[i + 1][j - 1].open = true;
				}
			}
			// 如果不是在最右上
			if (i != 0 && j != $scope.arrayLsLs[i].length - 1) {
				if (!$scope.arrayLsLs[i - 1][j + 1].banner && !$scope.arrayLsLs[i - 1][j + 1].open) {
					$scope.arrayLsLs[i - 1][j + 1].open = true;
				}
			}
			// 如果不是在最左上
			if (i != 0 && j != 0) {
				if (!$scope.arrayLsLs[i - 1][j - 1].banner && !$scope.arrayLsLs[i - 1][j - 1].open) {
					$scope.arrayLsLs[i - 1][j - 1].open = true;
				}
			}
			$scope.statusCheck(i, j);
		}
	}

	$scope.rightClick = function(y, x) {
		$scope.countRemainBombNb(y, x);
		if (!$scope.arrayLsLs[y][x].open) {
			$scope.arrayLsLs[y][x].banner = !$scope.arrayLsLs[y][x].banner;
		} else {
			// 替代雙鍵功能
			$scope.leftAndRightClick(x, y);
		}
		console.log("按了右鍵", "位置", x, y);
	};

	$scope.leftClick = function(y, x) {
		if (!$scope.arrayLsLs[y][x].banner) {
			$scope.arrayLsLs[y][x].open = true;
			$scope.statusCheck(y, x);
		}
		console.log("按了左鍵", "位置", x, y);
	}

});
