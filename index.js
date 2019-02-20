var app = angular.module('myApp', []);
app.controller('controller', function($scope) {
	var carName = "Michael";
	$scope.carName = carName;

	$scope.test = function() {
		console.log("yo~");
		$scope.carName = "yo~";
	}
});