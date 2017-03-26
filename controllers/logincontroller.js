﻿eAssessorApp.controller('logincontroller', function ($scope, commonservice, menuservice, $rootScope, $location,
    $cookieStore, authenticationservice, subjectservice, $sce) {
    var user = $cookieStore.get('globals');
    if (typeof (user) != 'undefined') {
        $rootScope.loglabel = 'Sign Out';
    }
    else {
        $rootScope.loglabel = 'Sign In';

        lockslinks();
    }
    $scope.isdefault = true;

    $scope.logprocess = function (loglabel) {
        if (loglabel == 'Sign In') {
            $scope.isaboutlogin = true;
            $scope.isdefault = false;

            $location.path('/login');
        }
        else if (loglabel == 'Sign Out') {
            authenticationservice.clearcredentials();
            $rootScope.loglabel = 'Sign In';
            $scope.isaboutlogin = false;
            $scope.isdefault = true;

            lockslinks();


            $location.path('/');
        }

    }
    function lockslinks() {
        $rootScope.registration = { "pointer-events": "none", "cursor": "default" };
        $rootScope.admin = { "pointer-events": "none", "cursor": "default" };
        $rootScope.parent = { "pointer-events": "none", "cursor": "default" };
        $rootScope.teacher = { "pointer-events": "none", "cursor": "default" };
        $rootScope.student = { "pointer-events": "none", "cursor": "default" };
        $rootScope.assessment = { "pointer-events": "none", "cursor": "default" };
    }

    $scope.logincategories = menuservice.logincategory().map(function (item) {
        //use logic here to sort by most clicked by users first.
        //  item = $sce.trustAsHtml(item)
        return item;
    });
    $scope.homemenus = menuservice.homemenus().map(function (item) {
        //use logic here to sort by most clicked by users first.
      //  item = $sce.trustAsHtml(item)
        return item;
    });
    
    $scope.categories = commonservice.categories();
    $scope.login = function login() {
        $scope.dataLoading = true;
        $scope.isschool = false;
        authenticationservice.login($scope.category, $scope.identity, $scope.password).then(function (response) {
            if (response.success) {
                authenticationservice.setcredentials($scope.identity, $scope.password);
                $scope.dataLoading = false;
                switch ($scope.category) {
                    case 'school':
                        $rootScope.registration = { "visibility": "visible" };
                        $cookieStore.put('category', $scope.category);
                        $location.path('/schoolclientstudent');
                        $scope.isschool = true;
                        break;
                    case 'admin':
                        $rootScope.registration = { "visibility": "visible" };
                        $rootScope.admin = { "visibility": "visible" };
                        $rootScope.parent = { "visibility": "visible" };
                        $rootScope.teacher = { "visibility": "visible" };
                        $rootScope.student = { "visibility": "visible" };
                        $rootScope.assessment = { "visibility": "visible" };
                        $cookieStore.put('category', $scope.category);
                        $location.path('/admin_main');
                        $scope.isschool = false;
                        break;
                    case 'teacher':
                        $rootScope.teacher = { "visibility": "visible" };
                        $cookieStore.put('category', $scope.category);
                        $location.path('/teacherstudentregistration');
                        $scope.isschool = false;
                        break;
                    case 'student':
                        $rootScope.student = { "visibility": "visible" };
                        $cookieStore.put('category', $scope.category);
                        $location.path('/studentreport');
                        $scope.isschool = false;
                        break;
                }
                $rootScope.loglabel = 'Sign Out';
            } else {
                $scope.message = response.message;
                $scope.dataLoading = false;
            }
        });


    };


    $scope.loadsubjects = function (sel) {
        switch (sel) {
            case "0":
                $scope.heading = "GCE O/L";
                subjectservice.getSubjects('O', 'AO', 'O').then(function (response) {
                    $scope.subjects = response.data;
                });
                break;
            case "1":
                $scope.heading = "GCE A/L";
                subjectservice.getSubjects('A', 'AO', 'A').then(function (response) {
                    $scope.subjects = response.data;
                });
                break;
            default:

        }

    }

    $scope.getsubjectdefinition = function (subject) {
        var htmlcode = '';
        $scope.subjectdefinition = '';
        $scope.selectedsubject = subject;

        switch (subject) {
            case "Additional Mathematics":
                htmlcode = "<p>GCSE Additional Mathematics takes the study of Mathematics " +
                     "beyond the content of GCSE Higher Tier. It introduces some of the mechanics and" +
                     " statistics topics that students encounter in GCE Mathematics and " +
                     "acts as a ‘stepping stone’ between GCSE and GCE. It can also be of benefit " +
                     "to students who are studying (or intending to study) " +
                     "the following subjects at both GCSE and GCE levels: " + "</p>"
                 + "<ul><li>Biology</li><li>Business Studies</li><li>Economics</li><li>Geography</li></ul>"
                  + "<a href=" + "http://www.rewardinglearning.org.uk/microsites/mathematics/additional/" + " style='padding-left:3px'>source</a>";

                $scope.subjectdefinition = $sce.trustAsHtml(htmlcode);

                break;
            case "Art and Design":
                htmlcode = "<p>GCSE Art and Design provides students with a wide range of creative," +
               "exciting and stimulating opportunities to explore their interests in ways that are both" +
                "personally relevant and developmental in nature.</p>" +
                "<p>This two unit specification enables students to develop their ability to actively engage" +
                "in the processes of Art and Design – to build creative skills through learning" +
                "and doing, to develop imaginative and intuitive ways of working and develop knowledge and " +
                "understanding of media, materials and technologies in historical and contemporary contexts," +
                "societies and cultures.</p>"
                + "<p>Assessment is by Unit 1: Portfolio of Work (Controlled Assessment) 60 per cent and Unit 2: Externally Set Task 40 per cent.</p>"
                + "<p>It is a strong foundation for further progression to Art and Design related courses such as A-level Art and Design and enhanced vocational and career pathways.</p>"
                + "<a href=" + "http://www.aqa.org.uk/subjects/art-and-design/gcse/art-and-design-4200" + " style='padding-left:3px'>source</a>";


                $scope.subjectdefinition = $sce.trustAsHtml(htmlcode);
                break;
            default:
        }
    }

});