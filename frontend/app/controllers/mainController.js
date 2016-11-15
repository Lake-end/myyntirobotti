/**

 * Created by a1400223 on 20.9.2016.

 */

app.controller('MainController', ['$scope', 'ChatWindow', '$timeout', '$log', '$interval','$http', function($scope, ChatWindow, $timeout, $log, $interval, $http) {
    ChatWindow.success(function(data) {
        $scope.data = data;
        $scope.qid = 0;
        $scope.options = "";
        $scope.hide=false;
        $scope.id=0;

        //if lause ajetaa, jos on olemassa "sessionId" niminen sessio. sessio luodaan metodilla: sessionStorage.setItem("nimi", "arvo");
        if(sessionStorage.getItem("sessionId")!=null){
            $log.info("sessio löytyy");
            //Tarkistetaan löytyykö sessiota
            var id = JSON.parse(sessionStorage.getItem("sessionId")).id;
            $http.get('/get-session/' + id).
            success(function(data){
                //Haetaan kysymys, johon käyttäjä jäi
                $http.get('/question/' + data.current_question).
                success(function(data){
                $scope.alku = data.question.search("http");
                // Jos linkistä löytyy 'http', laitetaan <a href='...'>...</a>
                if($scope.alku > -1){
                    if(data.question.search(".fi") == -1){
                        $scope.loppu = data.question.search(".com") + 4;
                    } else if(data.question.search(".com") == -1){
                        $scope.loppu = data.question.search(".fi") + 3;
                    }
                    $scope.testi = data.question;
                    $scope.question = $scope.testi.substring(0, $scope.alku) + "<a href='" + $scope.testi.substring($scope.alku, $scope.loppu) + "'>" + $scope.testi.substring($scope.alku, $scope.loppu) + "</a>" + $scope.testi.substring($scope.loppu);
                    }
                    // Jos ei löydy 'http', kysymys kirjoitetaan normaalisti
                     else{
                    $scope.question = data.question;
                    }
                    $scope.options = data.answers;
                    $scope.id=$scope.data.id;
                }).error(function(err) {
                    $log.info("Tapahtui virhe");
                })
                $log.info(data);
            }).error(function(err) {
                $log.info("Tapahtui virhe");
            })
        }
        else{
            //Alla oleva funktio luo uuden session ja tallentaa sen sessionStorageen

            $http.get('/create-session').
            success(function(data){
                sessionStorage.setItem("sessionId", JSON.stringify(data));
                $log.info(JSON.parse(sessionStorage.getItem("sessionId")));
            }).error(function(data) {
                $log.info("t2" + data);
            })
            $scope.id=$scope.data.id;
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

        $scope.answerFunction = function(qid, aid){
            var answer = JSON.stringify({session_id:JSON.parse(sessionStorage.getItem("sessionId")).id, question_id:$scope.id, answer_id:aid});
            $log.info(answer);
            $http.post('/save-answer/', answer).success(function (data) {
                $log.info(data);
            }).error(function (err) {
                $log.info("Tapahtui virhe");
            })

                $scope.hide = true;
                $timeout(function () {
                    $http.get('/question/' + qid).success(function (data) {
                        $scope.id = data.id;
                        $scope.alku = data.question.search("http");
                        if($scope.alku > -1){
                        $log.info("alku: " + $scope.alku);
                            if(data.question.search(".fi") == -1){
                                $scope.loppu = data.question.search(".com") + 4;
                            } else if(data.question.search(".com") == -1){
                                $scope.loppu = data.question.search(".fi") + 3;
                            }
                            $scope.testi = data.question;
                            $scope.question = $scope.testi.substring(0, $scope.alku) + "<a href='" + $scope.testi.substring($scope.alku, $scope.loppu) + "'>" + $scope.testi.substring($scope.alku, $scope.loppu) + "</a>" + $scope.testi.substring($scope.loppu);
                        questionSpell($scope.question);
                        } else {
                        questionSpell(data.question);
                        }
                        $scope.options = data.answers;
                        $log.info(data);
                    }).error(function (err) {
                        $log.info("Tapahtui virhe");
                    })
                    $scope.hide = false;
                }, 400);
        };

        $scope.clearSession = function() {
                var id = JSON.parse(sessionStorage.getItem("sessionId")).id;
                    sessionStorage.clear();
                   $http.get('/delete-session/' + id).
                   success(function(data) {
                   $log.info(data);
                   }).error(function(err) {
                        $log.info("Tapahtui virhe");
                   })
        };
    });
}]);