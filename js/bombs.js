var app = angular.module('myApp', []);

// 實現右鍵單擊功能
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
	// 確認更新用
	console.log("13:00");

	// --------------------------------------------------------------------------------------------
	// Cookie練習區
	// $.removeCookie('aaa');

	$scope.jsCookieLs = $.cookie();

	$scope.$watch('jsCookieLs', function(newValue, oldValue) {
		$scope.cookieLs = [];
		angular.forEach($scope.jsCookieLs, function(value, key) {
			$scope.cookieLs.push({
				key : key,
				chooseDifficulty : value.split(",")[0].substring(17),
				gameTime : Number(value.split(",")[1].substring(9))
			});
		});
	});

	// 要將alert改掉。 TODO

	// 存入cookies (務必不要使用chrome，chrome不會儲存本地cookies)
	$scope.setCookie = function(cookieKey, gameTime, chooseDifficulty) {
		var day = new Date();
		console.log(day);
		var cookieVelue = 'chooseDifficulty=' + chooseDifficulty + ',' + 'gameTime=' + gameTime.toFixed(2);
		$.cookie(cookieKey + ',' + day.getTime(), cookieVelue, {
			'expires' : 365
		});
		$scope.jsCookieLs = $.cookie();
	};

	$scope.removeCookie = function() {
		angular.forEach($scope.cookieLs, function(b) {
			$.removeCookie(b.key);
		});
		$scope.jsCookieLs = $.cookie();
	};

	// --------------------------------------------------------------------------------------------
	// 踩地雷邏輯
	var myCountTime;
	$scope.gameStart = function(chooseDifficulty) {
		// 時間清除
		$timeout.cancel(myCountTime);
		// 地圖初始化
		$scope.arrayLsLs = [];
		// 參數初始化
		$scope.parameter = {
			gameTime : 0,
			bombAllNb : 0,
			remainBombNb : 0,
			x : 0,
			y : 0
		};
		// 計時
		myCountTime = $timeout($scope.countTime, 10);
		// 難度設定
		$scope.difficulty(chooseDifficulty);
		// 製造地圖
		$scope.createMap($scope.parameter);
		// 製作炸彈
		$scope.randomBombsMap($scope.parameter);
		// 計算炸彈數量
		$scope.countNumberOfBombs($scope.parameter);

		console.log("開始計時");
	};

	// 難度
	$scope.difficulty = function(chooseDifficulty) {
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
			$scope.parameter.x = $scope.userIn.x;
			$scope.parameter.y = $scope.userIn.y;
			$scope.parameter.bombAllNb = $scope.userIn.bombAllNb;
			$scope.parameter.remainBombNb = $scope.userIn.bombAllNb;
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
		if (chooseDifficulty)
			console.log("選擇" + $('#chooseDifficulty option[value=' + $scope.chooseDifficulty + ']').html() + "難度", "地圖大小為" + $scope.parameter.x * $scope.parameter.y, "炸彈數量為" + $scope.parameter.bombAllNb);
	};

	// 計時器
	$scope.countTime = function() {
		$scope.parameter.gameTime = $scope.parameter.gameTime + 0.01;
		myCountTime = $timeout($scope.countTime, 10);
		// console.log($scope.parameter.gameTime + "秒");
	};

	// 製造地圖
	$scope.createMap = function(parameter) {
		console.log("製造地圖");
		for (i = 0; i < parameter.y; i++) {
			$scope.arrayLsLs[i] = [];
			for (j = 0; j < parameter.x; j++) {
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
	};

	// 製作炸彈地圖
	$scope.randomBombsMap = function(parameter) {
		console.log("製作炸彈地圖");
		var x = parameter.x;
		var y = parameter.y;
		var bombAllNb = parameter.bombAllNb;
		if (bombAllNb > x * y) {
			alert("炸彈數量超過地圖拉");
		} else {
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
	};

	// 計算週圍炸彈數字
	$scope.countNumberOfBombs = function(parameter) {
		console.log("計算週圍炸彈數字");
		var x = parameter.x;
		var y = parameter.y;
		// 計算炸彈週圍數字
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
		console.log("計算週圍炸彈數字結束");
	};

	// 檢查地圖&&開圖
	$scope.statusCheck = function() {
		console.log("檢查地圖&&開圖");
		do {
			var isChecking = false;
			$scope.allOpen = true;
			for (var i = 0; i < $scope.arrayLsLs.length; i++) {
				for (var j = 0; j < $scope.arrayLsLs[i].length; j++) {
					// 如果已開且是炸彈，則死亡
					if ($scope.arrayLsLs[i][j].open && $scope.arrayLsLs[i][j].isbomb) {
						$scope.die();
					}
					// 如果狀態未開，而且裡面不是炸彈的話，遊戲尚未結束
					if (!$scope.arrayLsLs[i][j].open && !$scope.arrayLsLs[i][j].isbomb && $scope.allOpen) {
						$scope.allOpen = false;
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
		} while (isChecking);
		// 成功解地圖
		if ($scope.allOpen)
			$scope.goodGame();
		console.log("檢查地圖結束");
	};

	// 成功完成遊戲
	$scope.goodGame = function() {
		$scope.test = true;
		$timeout.cancel(myCountTime);
		alert("花了" + $scope.parameter.gameTime.toFixed(2) + "秒，賽道的拉");
	};

	// 死亡
	$scope.die = function() {
		// 地圖全開
		for (var i = 0; i < $scope.arrayLsLs.length; i++) {
			for (var j = 0; j < $scope.arrayLsLs[0].length; j++) {
				$scope.arrayLsLs[i][j].banner = false;
				$scope.arrayLsLs[i][j].open = true;
			}
		}
		$timeout.cancel(myCountTime);
		alert("you are die");
	};

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
	};

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
			$scope.statusCheck();
		}
	};

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
			// 開到地雷
			if ($scope.arrayLsLs[y][x].open && $scope.arrayLsLs[y][x].isbomb) {
				$scope.die();
			} else {
				$scope.statusCheck();
			}
		}
		console.log("按了左鍵", "位置", x, y);
	};

});
