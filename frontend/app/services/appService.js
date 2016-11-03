app.factory('ChatWindow', ['$http', function($http) {
    return $http.get('/question/1').
    success(function(data){
        return data;
    }).error(function(err) {
        return err;
    })
}]);