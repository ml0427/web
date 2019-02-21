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
				console.log("i", i);
				var randomX = Math.floor(Math.random() * x);
				var randomY = Math.floor(Math.random() * y);

				console.log("亂數", randomX, randomY);
				console.log("位置", $scope.arrayLsLs[randomX][randomY]);
				if ($scope.arrayLsLs[randomX][randomY].count === "x") {
					i--;
				} else {
					$scope.arrayLsLs[randomX][randomY].count = "x";
				}
			}
		}
		console.log("製作炸彈結束");
	}

	$scope.test = function(x, y) {
		console.log("位置", x, y);
	}
});