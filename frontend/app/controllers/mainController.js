/**
 * Created by a1400223 on 20.9.2016.
 */

app.controller('MainController', ['$scope', 'ChatWindow', '$timeout', '$log', '$interval','$http', function($scope, ChatWindow, $timeout, $log, $interval, $http) {
    ChatWindow.success(function(data) {
        $scope.data = data;
        $scope.qid = 0;
        $scope.options = "";
        $scope.hide=false;

        //if lause ajetaa, jos on olemassa "sessionId" niminen sessio. sessio luodaan metodilla: sessionStorage.setItem("nimi", "arvo");

        if(sessionStorage.getItem("sessionId")!=null){
            //Tarkistetaan löytyykö sessiota
            var currentQuestion = 3;
            $log.info(currentQuestion);
            $http.get('/question/' + currentQuestion).
            success(function(data){
                $scope.question = data.question;
                $scope.options = data.answers;
                $log.info(data);
            }).error(function(err) {
                $log.info("Tapahtui virhe");
            })
        }
        else{
            //Alla oleva funktio toimii mutta ei palauta mitään, koska backend ei ole täysin toiminnassa

            /*$http.get('/create-session').
            success(function(data){
                $log.info("t1" + data);
            }).error(function(data) {
                $log.info("t2" + data);
            })*/
            $scope.question = $scope.data.question;
            $scope.options = $scope.data.answers;
        }

        $log.info($scope.data);

        var questionSpell = function(x){
            $scope.num = 1;
            $scope.que=x;
            var spell = function(){
                $scope.question = $scope.que.substring(0,$scope.num);
                $scope.num++;
            }
            $interval(spell, 30, $scope.que.length);
        }


        $scope.answerFunction = function(qid){
            $scope.hide = true;
            $timeout(function() {
                $http.get('/question/' + qid).
                success(function(data){
                    questionSpell(data.question);
                    $scope.options = data.answers;
                    $log.info(data);
                }).error(function(err) {
                    $log.info("Tapahtui virhe");
                })
                $scope.hide = false;
            }, 400);
        };

    });
}]);