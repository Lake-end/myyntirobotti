/**
 * Created by a1400223 on 20.9.2016.
 */

app.controller('MainController', ['$scope', 'ChatWindow', function($scope, ChatWindow) {
    ChatWindow.success(function(data) {
        $scope.chatData = data;
        $scope.qid = 0;
        $scope.answerFunction = function(id){
            $scope.qid = id;
        }

    });
}]);