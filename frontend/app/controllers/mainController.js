/**

 * Created by a1400223 on 20.9.2016.

 */

app.controller('MainController', ['$scope', 'ChatWindow', '$timeout', '$log', '$interval','$http', '$compile', '$element', function($scope, ChatWindow, $timeout, $log, $interval, $http, $compile, $element) {
    ChatWindow.success(function(data) {
        $scope.data = data;
        $scope.qid = 0;
        $scope.options = "";
        $scope.hide=false;
        $scope.id=0;
        $scope.form = false;
        $scope.formData = {};
        $scope.link = false;
        $scope.lastq=false;
        var referrer = document.referrer;

        //if lause ajetaa, jos on olemassa "sessionId" niminen sessio. sessio luodaan metodilla: sessionStorage.setItem("nimi", "arvo");
        if(sessionStorage.getItem("sessionId")!=null){

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

                    else if(data.id==2000){
                        $scope.lastq = true;
                    }

                    else{
                        $scope.question = findLink(data.question);
                        $scope.form = false;
                        $scope.options = data.answers;
                        $scope.id=$scope.data.id;
                    }
                }).error(function(err) {
                    $log.info("virhe kysymyksen hakemisessa: " + data);
                })

                $log.info(data);

            }).error(function(err) {
                $log.info("virhe session hakemisessa: " + data);
            })
        }
        else{
            //Alla oleva funktio luo uuden session ja tallentaa sen sessionStorageen

            $http.get('/create-session').
            success(function(data){
                sessionStorage.setItem("sessionId", JSON.stringify(data));
                $log.info(JSON.parse(sessionStorage.getItem("sessionId")));
            }).error(function(data) {
                $log.info("virhe session luomisessa: " + data);
            })

            $scope.id=$scope.data.id;
            $scope.question = $scope.data.question;
            $scope.options = $scope.data.answers;
        }
        $log.info($scope.data);


        $scope.formSubmit = function(){

            $scope.formData.session_id = JSON.parse(sessionStorage.getItem("sessionId")).id;

            $http.post('/send-contact-request/', $scope.formData).success(function (data) {
                $log.info(data);
            }).error(function (err) {
                $log.info("virhe lomakkeen lähetyksessä: " + data);
            })

        }

        $scope.answerFunction = function(qid, aid){
            var url = window.location.pathname;
            $log.info(url);

            var answer = JSON.stringify({session_id:JSON.parse(sessionStorage.getItem("sessionId")).id, question_id:$scope.id, answer_id:aid, link_clicked:$scope.link, answer_url:url});
            $log.info(answer);

            $http.post('/save-answer/', answer).success(function (data) {
                $log.info("vastaus tallennettiin");
            }).error(function (err) {
                $log.info("virhe vastauksen tallentamisessa: " + data);
            })

            $scope.hide = true;
            $timeout(function () {

                $http.get('/question/' + qid).success(function (data) {

                    $scope.id = data.id;
                    $('#questionLink').attr('href', "");
                    $('#questionLink').text("");

                    if(data.id==1000){
                        $scope.form = true;
                        $scope.question = findLink(data.question);
                        $scope.options = data.answers;
                    }

                    else if(data.id==2000){
                        $scope.lastq = true;
                        $log.info("vika kyssäri")
                    }

                    else{
                        $scope.question = findLink(data.question);
                        $scope.form = false;
                        $scope.options = data.answers;
                        $log.info(data);
                    }
                }).error(function (err) {
                    $log.info("virhe seuraavan kysmyksen hakemisessa: " + data);
                })
            }, 400);
            $timeout(function () {
                $scope.hide = false;
            }, 500);
            $scope.link = false;
        };

        $scope.clearSession = function() {

            var id = JSON.parse(sessionStorage.getItem("sessionId")).id;
            sessionStorage.clear();

            $http.get('/delete-session/' + id).
            success(function(data) {
                $log.info("sessio tyhjennettiin " + data);
            }).error(function(err) {
                $log.info("virhe session poistamisessa: " + data);
            })

            $http.get('/create-session').
            success(function(data){
                sessionStorage.setItem("sessionId", JSON.stringify(data));
                $log.info(JSON.parse(sessionStorage.getItem("sessionId")));
            }).error(function(data) {
                $log.info("virhe session luomisessa" + data);
            })

            $scope.form = false;
            $scope.lastq = false;
            $scope.formData = {};
            $scope.id=$scope.data.id;
            $scope.question = findLink($scope.data.question);
            $scope.options = $scope.data.answers;
            $('#questionLink').attr('href', "");
            $('#questionLink').text("");
        };

        $scope.linkClicked = function(value){
            $log.info("link clicked");
            $scope.link = true;
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
                        returnValue = "<a id='link' ng-click='linkClicked(" + linkPart + ");' target='_blank' href='" + linkPart + "'>" + linkPart + "</a>" + question.substring(x);
                        $('#questionLink').attr('href', linkPart);
                        $('#questionLink').text(linkPart);
                        $log.info("Yeah");
                        returnValue = question.substring(0, begin);
                    }
                    else{
                        returnValue = question.substring(0, begin) + "<a id='link' ng-click='linkClicked(" + linkPart + ");' target='_blank' href='" + linkPart + "'>" + linkPart + "</a>" + question.substring(x);
                        $('#questionLink').attr('href', linkPart);
                        $('#questionLink').text(linkPart);
                        $log.info("Yeah");
                        returnValue = question.substring(0, begin);
                    }
                    break;
                }
            }
            if(found == false){
                linkPart = question.substring(begin);
                if(linkPart.substring(0,3) == 'www'){
                    linkPart = "http://" + linkPart;
                }
                $('#questionLink').attr('href', linkPart);
                $('#questionLink').text(linkPart);
                $log.info("Yeah");
                returnValue = question.substring(0, begin);
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
                    returnValue = question.substring(0, x+1) + "<a ng-click='linkClicked(" + linkPart + ");' target='_blank' href='http://" + linkPart + "'>" + linkPart + "</a>" + question.substring(end);
                    $('#questionLink').attr('href', linkPart);
                    $('#questionLink').text(linkPart);
                    $log.info("Yeah");
                    returnValue = question.substring(0, begin);
                    break;
                }
            }
            if(found == false){
                returnValue = "<a ng-click='linkClicked(" + linkPart + ");' target='_blank' href='http://" + question.substring(0, end) + "'>" + question.substring(0, end) + "</a>" + question.substring(end);
                $('#questionLink').attr('href', linkPart);
                $('#questionLink').text(linkPart);
                $log.info("Yeah");
                returnValue = question.substring(0, begin);
            }
            return returnValue;
        }
    });
}]);