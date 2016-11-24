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
        $scope.form = false;
        $scope.formData = {};
        $scope.link = false;

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

                if(data.id==1000){
                    $scope.form = true;
                    $scope.question = findLink(data.question);
                }
                else{
                    $scope.question = findLink(data.question);
                    $scope.form = false;
                    $scope.options = data.answers;
                    $scope.id=$scope.data.id;
                }

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

        $scope.formSubmit = function(){

            $scope.formData.session_id = JSON.parse(sessionStorage.getItem("sessionId")).id;

            $http.post('/send-contact-request/', $scope.formData).success(function (data) {
                $log.info(data);
            }).error(function (err) {
                $log.info("Tapahtui virhe");
            })

            $scope.answerFunction(1,1001);
        }

        $scope.answerFunction = function(qid, aid){
            var answer = JSON.stringify({session_id:JSON.parse(sessionStorage.getItem("sessionId")).id, question_id:$scope.id, answer_id:aid, link_clicked:$scope.link});
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
                        if(data.id==1000){
                            $scope.form = true;
                            questionSpell(findLink(data.question));
                        }
                        else{
                            questionSpell(findLink(data.question));
                            $scope.form = false;
                            $scope.options = data.answers;
                            $log.info(data);
                        }
                    }).error(function (err) {
                        $log.info("Tapahtui virhe");
                    })
                    $scope.hide = false;
                }, 400);
        $scope.link = false;
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
                   $http.get('/create-session').

                  success(function(data){
                      sessionStorage.setItem("sessionId", JSON.stringify(data));
                      $log.info(JSON.parse(sessionStorage.getItem("sessionId")));
                  }).error(function(data) {
                      $log.info("t2" + data);
                  })
                  $scope.form = false;
                  $scope.id=$scope.data.id;
                  $scope.question = findLink($scope.data.question);
                  $scope.options = $scope.data.answers;
        };

        var linkClicked = function(value){
        $scope.link = true;
        var stringValue = value.toString();
            $window.open(stringValue, '_blank');
        };

         var findLink = function(question) {
                $scope.end;
                $scope.begin;
                $scope.test;
                $scope.http = question.search("http");
                $scope.www = question.search("www");

                if($scope.http > -1){
                    return linkTypes(question, $scope.http);
                }
                else if($scope.www > -1){
                    return linkTypes(question, $scope.www);
                }
                else{
                    return fileFormats(question);
                }
                }

                var linkTypes = function(question, linkType){
                    var begin = linkType;
                    var linkPart;
                    var end;
                    var found = false;
                    var returnValue;

                    for(var x = begin; x <= question.length; x++){
                        if(question.substring(x, x+1) == " "){
                            linkPart = question.substring(begin, x);
                            if(linkPart.substring(0,2) == 'www')
                                linkPart = "http://" + linkPart;
                            found = true;
                            if(begin == 0){
                                returnValue = "<a ng-click='linkClicked('" + linkPart + "');' target='_blank' href=''>" + linkPart + "</a>" + question.substring(x);
                            }
                            else{
                                returnValue = question.substring(0, begin) + "<a ng-click='linkClicked(" + linkPart + ");' target='_blank' href='" + linkPart + "'>" + linkPart + "</a>" + question.substring(x);
                            }
                            break;
                        }
                    }
                    if(found == false){
                        linkPart = question.substring(begin);
                        if(linkPart.substring(0,3) == 'www'){
                            linkPart = "http://" + linkPart;
                        }
                        returnValue = question.substring(0, begin) + "<a ng-click='linkClicked('" + linkPart + "');'target='_blank' href=''>" + linkPart + "</a>";
                    }
                    return returnValue;
                }

                var fileFormats = function(question){
                    var end;
                    var type;
                    var returnValue;
                    var linkPart;
                    var found = false;

                    if(question.search(".pdf") > -1){
                        end = question.search(".pdf") + 4;
                    }
                    else if(question.search(".html") > -1) {
                        end = question.search(".html") + 5;
                    }
                    else if(question.search(".jpg") > -1){
                        end = question.search(".jgp") + 4;
                    }
                    else if(question.search(".png") > -1){
                        end = question.search(".png") + 4;
                    }
                    else {
                        return question;
                    }

                    for(var x = end; x > 0; x--){
                        if(question.substring(x, x+1) == ' '){
                            linkPart = question.substring(x+1, end);
                            found = true;
                            returnValue = question.substring(0, x+1) + "<a ng-click='linkClicked('http://" + linkPart + "');' target='_blank' href=''>" + linkPart + "</a>" + question.substring(end);
                            break;
                        }
                    }
                    if(found == false){
                        returnValue = "<a ng-click='linkClicked('http://" + linkPart + "');' target='_blank' href=''>" + question.substring(0, end) + "</a>" + question.substring(end);
                    }
                    return returnValue;
                }
    });
}]);