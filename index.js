var app = angular.module('myApp', []);

app.controller('controller', function($scope) {

	var cars = {
		0 : "Audi",
		1 : "BMW",
		2 : "Volvo"
	};

	$scope.firstName = "John";
	$scope.lastName = "Doe";
	var carname = "我的第一段 JavaScript";
	$scope.carname = carname;
});