app.factory('ChatWindow', ['$http', function($http) {
    return $http.get('../app/services/appService.json')
        .success(function(data) {
            return data;
        })
        .error(function(err) {
            return err;
        });
}]);