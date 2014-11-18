'use strict';

var ContentSyncApp = angular.module('starter.controllers', []);

ContentSyncApp.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
    
})

ContentSyncApp.controller('PlaylistsCtrl', function($scope) {
    $scope.playlists = [
        { title: 'Reggae', id: 1 },
        { title: 'Chill', id: 2 },
        { title: 'Dubstep', id: 3 },
        { title: 'Indie', id: 4 },
        { title: 'Rap', id: 5 },
        { title: 'Cowbell', id: 6 }
    ];
})

ContentSyncApp.controller('MapCtrl', function($scope, $ionicLoading) {
    
    console.log("MapCtrl");
    
    $scope.infoText = "Mapping!";

    var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

    var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    navigator.geolocation.getCurrentPosition(function(pos) {
        map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        var myLocation = new google.maps.Marker({
            position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            map: map,
            title: "My Location"
        });
    });

    $scope.map = map;
    
})

ContentSyncApp.controller('BeaconsCtrl', function($scope, $ionicLoading) {
    
    $scope.beaconRegion = {
        id: 'RaspberryPi',
        uuid: '636F3F8F-6491-4BEE-95F7-D8CC64A863B5',
        major: 0,
        minor: 0	
    };
    
    var beaconRegions = [
        {id: 'page-feet', uuid:'A4950001-C5B1-4B44-B512-1370F02D74DE', major: 1, minor: 1},
        {id: 'page-shoulders', uuid:'A4950001-C5B1-4B44-B512-1370F02D74DE', major: 1, minor: 2},
        {id: 'page-face', uuid:'A4950001-C5B1-4B44-B512-1370F02D74DE', major: 1, minor: 3}
    ];
    
    console.log("BeaconsCtrl");
    
    startScanForBeacons();
    
    function startScanForBeacons() {
        
        console.log("startScanForBeacons");
        
        document.getElementById("statusPlace").innerHTML += "<br/>[successRequestFileSystem] Starting scan... ";

        //required in iOS 8+
        //cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
        cordova.plugins.locationManager.requestAlwaysAuthorization()
        
        console.log("5555555555555555555555");
        
        var logToDom = function (message) {
            var e = document.createElement('label');
            e.innerText = message;

            var br = document.createElement('br');
            var br2 = document.createElement('br');
            document.body.appendChild(e);
            document.body.appendChild(br);
            document.body.appendChild(br2);

            window.scrollTo(0, window.document.height);
        };

        var delegate = new cordova.plugins.locationManager.Delegate();
        
        delegate.didDetermineStateForRegion = function (pluginResult) {

            //logToDom('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
            document.getElementById("statusPlace").innerHTML += "<br/>[DOM] didDetermineStateForRegion: " + JSON.stringify(pluginResult);

            cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
        };
        
        delegate.didStartMonitoringForRegion = function (pluginResult) {
            console.log('didStartMonitoringForRegion:' + pluginResult);

            //logToDom('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
            document.getElementById("statusPlace").innerHTML += "<br/>didStartMonitoringForRegion:" + JSON.stringify(pluginResult);
        };
        
        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            logToDom('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
            document.getElementById("statusPlace").innerHTML += "<br/>[DOM] didRangeBeaconsInRegion: " + JSON.stringify(pluginResult);
        };
        
        var uuid = '636F3F8F-6491-4BEE-95F7-D8CC64A863B5';
        var identifier = 'RaspberryPi';
        var minor = 0;
        var major = 0;
        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

        cordova.plugins.locationManager.setDelegate(delegate);

        // required in iOS 8+
        cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
        // or cordova.plugins.locationManager.requestAlwaysAuthorization()

        cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
            .fail(console.error("[startRangingBeaconsInRegion] ERROR "))
            .done();	
    }
    
})


ContentSyncApp.controller('HomepageCtrl', function($scope, $ionicLoading) {
    
    console.log("HomepageCtrl");
    
    
    
})


ContentSyncApp.controller('ArticleListCtrl', function($scope, $ionicLoading, PageDataService) {
    
    console.log("ArticleListCtrl");
    
    var fileName = "app-content.zip";
    var folderName = "content";
    
    PageDataService.getMessages(function(messages) {
        $scope.messages = messages;
    });
    
    
    PageDataService.getSectionPageData(function(messages) {
        console.log("getSectionPageData");
        
        $scope.sectionPages = messages;
    });
    
    
})

ContentSyncApp.controller('ContentSyncCtrl', function($scope, $ionicLoading, $http, PageDataService) {
    
    console.log("Content Sync");
    
    $ionicLoading.show({
        template: 'Loading...'
    }); 
    
    $scope.sectionPages = [];
    
    var contenttoupdate = document.getElementById("contenttoupdate").innerHTML = "The Content";
    
    requestFileSystem(LocalFileSystem.PERSISTENT, 0, successRequestFileSystem, failRequestFileSystem);
    
    function successRequestFileSystem(fs) {
        
        document.getElementById("statusPlace").innerHTML += "<br/>[successRequestFileSystem] Local file system... ";
        
        var App = new DownloadApp();
        var uri = encodeURI(globalData.glzipUrl);
        var fileName = "app-content.zip";
        var folderName = "content";
        
        document.getElementById("statusPlace").innerHTML += "<br/>[successRequestFileSystem] Loading: " + globalData.glzipUrl;
        App.load(uri, folderName, fileName,
            /*progress*/function(percentage) { document.getElementById("statusPlace").innerHTML += "<br/>" + percentage + "%"; },
            /*success*/function(entry) { document.getElementById("statusPlace").innerHTML += "<br/>Zip saved to: " + entry.toURL(); },
            /*fail*/function() { document.getElementById("statusPlace").innerHTML += "<br/>Failed load zip: " + that.uri; }
        );
        
        document.getElementById("statusPlace").innerHTML += "<br/>Unzipping... ";
        App.unzip(folderName, fileName,
            /*success*/function() { alert("Unzipped and assigned"); },
            /*fail*/function(error) { alert("Unzip failed: " + error.code); }
        );
        
        document.getElementById("statusPlace").innerHTML += "<br/>Section Pages... ";
        PageDataService.getSectionPageData(function(messages) {
            console.log("getSectionPageData");

            //$scope.sectionPages = messages;
        });
        
    }
    
    function failRequestFileSystem(fs) {
        
        document.getElementById("statusPlace").innerHTML += "<br/>[failRequestFileSystem] FAIL... ";
        
    }
    
    console.log("Content Sync Ending");
    
    $ionicLoading.hide();
    
})

ContentSyncApp.controller('PlaylistCtrl', function($scope, $stateParams) {
    
});