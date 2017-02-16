// Faraday Penetration Test IDE
// Copyright (C) 2016  Infobyte LLC (http://www.infobytesec.com/)
// See the file 'doc/LICENSE' for the license information
const DEMO_MODE = false;

angular.module('faradayApp')
    .controller('statusReportVisCtrl',
                    ['$scope', '$filter', '$routeParams',
                    '$location', '$uibModal', '$cookies', '$q', '$window', 'BASEURL',
                    'SEVERITIES', 'EASEOFRESOLUTION', 'hostsManager',
                    'vulnsManager', 'workspacesFact', 'csvService', 'uiGridConstants',
                    function($scope, $filter, $routeParams,
                        $location, $uibModal, $cookies, $q, $window, BASEURL,
                        SEVERITIES, EASEOFRESOLUTION, hostsManager,
                        vulnsManager, workspacesFact, csvService, uiGridConstants) {

        const DISPLAY_TARGET = 'Target'
        const DISPLAY_HOST = 'Host'

        $scope.vulns = {}
        $scope.severities = ['unclassified','info','low','med','high','critical'];
        $scope.severitiesDisplay = {unclassified: true, info: true, low: true, med: true, high: true, critical: true};
        $scope.severitiesColors = {unclassified: '#CCCCCC', info: '#B3E6FF', low: '#2ecc71', med: '#f1c40f', high: '#e74c3c', critical: '#000000'};

        $scope.radarChartLabels = $scope.severities;
        $scope.pieChartLabels = $scope.severities;
        $scope.pieChartColors = ['#CCCCCC','#B3E6FF','#2ecc71','#f1c40f','#e74c3c','#000000'];
        $scope.chartDisplay = DISPLAY_HOST;

        init = function() {
            // load all workspaces
            workspacesFact.list().then(function(wss) {
                $scope.workspaces = wss;
            });

            // current workspace
            $scope.workspace = $routeParams.wsId;

            loadVulns();
        }  

        loadVulns = function() {
            if (DEMO_MODE) {
                console.warn("Loading demo vulnerabilities");
                $scope.vulns.data = [{"hostnames":["example.org"],"target":"10.54.29.88","severity":"unclassified"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"unclassified"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"unclassified"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"unclassified"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"info"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"info"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"info"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"info"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"info"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"info"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"low"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"low"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"low"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"low"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"low"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"low"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"low"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"low"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"low"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"low"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"low"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"low"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"med"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"high"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"high"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"high"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"high"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"high"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"high"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"high"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"high"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"high"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"high"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"high"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"high"},{"hostnames":["example.org"],"target":"10.54.29.88","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"unclassified"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"unclassified"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"unclassified"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"unclassified"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"unclassified"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"unclassified"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"unclassified"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"info"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"info"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"info"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"info"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"info"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"low"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"low"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"low"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"low"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"high"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["foo.bar.com"],"target":"10.209.75.32","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"info"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"low"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"low"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"low"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"low"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"low"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"low"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"low"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"low"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"low"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"med"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"med"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"med"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"med"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"med"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"med"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"med"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"med"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"med"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"med"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"med"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"med"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"high"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["notawebsite.io"],"target":"192.168.84.59","severity":"critical"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"unclassified"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"info"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"low"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"low"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"low"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"low"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"low"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"low"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"low"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"med"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"med"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"high"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"high"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"high"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"high"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"high"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"high"},{"hostnames":["mywebapp.com.ar"],"target":"172.16.49.121","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"unclassified"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"info"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"info"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"info"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"info"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"info"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"info"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"info"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"info"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"info"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"low"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"low"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"low"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"low"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"low"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"low"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"low"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"low"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"low"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"low"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"low"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"med"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"high"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"critical"},{"hostnames":["mymovies.tv"],"target":"192.168.1.22","severity":"critical"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"unclassified"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"unclassified"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"unclassified"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"unclassified"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"unclassified"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"info"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"info"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"info"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"info"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"info"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"info"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"info"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"info"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"info"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"info"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"info"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"info"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"info"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"low"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"low"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"low"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"low"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"low"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"low"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"low"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"med"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"med"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"med"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"med"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"med"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"med"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"high"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"high"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"high"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"high"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"high"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"high"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"high"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"high"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"high"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"high"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"high"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"high"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"critical"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"critical"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"critical"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"critical"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"critical"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"critical"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"critical"},{"hostnames":["simpleurl.edu.es"],"target":"10.66.16.14","severity":"critical"}];
                $scope.vulns.count = $scope.vulns.data.length;
                updateChartsData();
            } else {
                // load all vulnerabilities
                vulnsManager.getVulns($scope.workspace,
                                      null,
                                      null,
                                      null,
                                      null,
                                      null)
                .then(function(response) {
                    $scope.vulns.data = response.vulnerabilities;
                    $scope.vulns.count = response.count;
                    if ($scope.vulns.count > 0) {
                        updateChartsData();
                    }
                });
            }
        };

        
        updateChartsData = function() {
            $scope.radarChartSeries = []
            $scope.radarChartData = []
            $scope.pieChartData = {}
            switch($scope.chartDisplay) {
                case DISPLAY_TARGET:
                    let targets = {}
                    $scope.vulns.data.forEach(vuln => {
                        if (!targets[vuln.target]) {
                            targets[vuln.target] = new Array($scope.severities.length).fill(0);
                        }
                        targets[vuln.target][$scope.severities.indexOf(vuln.severity)]++;
                    });
                    Object.keys(targets).forEach(key => {
                        $scope.radarChartSeries.push(key);
                        $scope.radarChartData.push(targets[key]);
                        $scope.pieChartData[key] = targets[key];
                    })
                    break;
                case DISPLAY_HOST:
                    let hosts = {};
                    $scope.vulns.data.forEach(vuln => {
                        if (Array.isArray(vuln.hostnames)) {
                            vuln.hostnames.forEach(host => {
                                if (!hosts[host]) {
                                    hosts[host] = new Array($scope.severities.length).fill(0);
                                }
                                hosts[host][$scope.severities.indexOf(vuln.severity)]++;
                            })
                        }
                    });
                    Object.keys(hosts).forEach(key => {
                        $scope.radarChartSeries.push(key);
                        $scope.radarChartData.push(hosts[key]);
                        $scope.pieChartData[key] = hosts[key];
                    })
                    break;
                default:
                    throw "Display not implemented"
            }
        }

        $scope.switchToTargetDisplay = function() {
            $scope.chartDisplay = DISPLAY_TARGET;
            updateChartsData();
        }

        $scope.switchToHostDisplay = function() {
            $scope.chartDisplay = DISPLAY_HOST;
            updateChartsData();
        }

        init();
    }]);
