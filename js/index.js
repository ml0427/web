var app = angular.module("app", [ 'eAlert', 'ui.bootstrap' ]);

app.controller('controller', function($scope, eAlert, $modal) {

	console.log(">>>controller");
	$modal.open({
		templateUrl : 'pagination/common/eAlert.html',
		controller : 'eAlertController',
		size : 'sm',
	});
});

app.controller('eAlertController', function($scope, $modalInstance) {
	
	console.log(">>>>>>eAlertController");

	$scope.confirm = function() {
		$modalInstance.dismiss();
	};
});





//https://embed.plnkr.co/plunk/XZOXbZ   < modal範例