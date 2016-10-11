/**
 * Created by a1400223 on 20.9.2016.
 */

app.controller('MainController', ['$scope', 'ChatWindow', '$timeout', '$log', '$interval', function($scope, ChatWindow, $timeout, $log, $interval) {
    ChatWindow.success(function(data) {
        $scope.chatData = data;
        $scope.qid = 0;
        $scope.answers = [];
        $scope.alat = [];
        $scope.piilota=false;
        $scope.answerFunction = function(id, answer){
            $scope.qid = id;
            $scope.answers.push(answer);
        }
        $scope.kysymys = $scope.chatData.questions[0].question;
        for(var i = 0; i<$scope.chatData.questions[0].answers.length; i++){
            $scope.alat.push($scope.chatData.questions[0].answers[i]);
        }
        var kasvata = function(x){
            $scope.luku = 1;
            $scope.kys=x;
            var kasvu = function(){
                $scope.kysymys = $scope.kys.substring(0,$scope.luku);
                $scope.luku = $scope.luku + 1;
            }
            $interval(kasvu, 30, $scope.kys.length);
        }


        $scope.piilotus = function(qid){
            $scope.piilota = true;
            $timeout(function() {
                $scope.alat = [];
                for(var i = 0; i<$scope.chatData.questions.length; i++){
                    if($scope.chatData.questions[i].id==qid){
                        kasvata($scope.chatData.questions[i].question);
                        for(var j = 0; j<$scope.chatData.questions[i].answers.length; j++){
                            $scope.alat.push($scope.chatData.questions[i].answers[j]);
                        }

                    }
                }
                $scope.piilota = false;
            }, 400);
        };

    });
}]);