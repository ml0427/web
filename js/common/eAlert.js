(function() {
	var module = angular.module("eAlert", []);

	module.factory('eAlert', function($modal) {
		return {
			alert : function(message, onFinish) {
				$modal.open({
					templateUrl : '../../pagination/common/eAlert.html',
					controller : 'eAlertController',
					size : 'sm',
					resolve : {
						message : function() {
							return message
						}
					}
				}).result.then(function() {
					if (onFinish) {
						onFinish();
					}
				}, function() {
					if (onFinish) {
						onFinish();
					}
				});
			}
		};
	});

	module.controller('eAlertController', function($scope, $modalInstance, message) {

		console.log(">>>eAlertController");

		$scope.message = message;

		$scope.confirm = function() {
			$modalInstance.dismiss();
		};
	});
})();