// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var ContentSyncApp = angular.module('starter', ['ionic', 'directory.services', 'starter.controllers']);

ContentSyncApp.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        
        if(window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        
        window.globalData = {};
        globalData.glzipUrl = "http://192.168.1.228:4503/content/app-content.zip"; //publish312.adobedemo.com //192.168.1.228:4503
        globalData.glworkerScriptsPath = "/js/";
        globalData.glopenRootFolder = "/content/tourism-australia/tourism-australia/en/explore/national/"; // /content/tourism-australia/tourism-australia/en/explore/national /content/geometrixx-media/en/entertainment
        globalData.glopenRootFile = "people-dps.app.html"; // behind-the-scenes-with-the-big-heist.app.html people-dps.app.html
        
        // Load default settings and variables
        //$localstorage.set('zipUrl', 'http://localhost:4503/content/app-content.zip');
        
        /*$localStorage.$default({
            openFile: "index.html",           // Path of the file in the ZIP archive to redirect the browser to when the extraction is done
            ignoredFiles: /(?:^|\/)(?:\.|__)/,    // RegEx capturing files of the ZIP archive to ignore (filenames starting with "." or "__")
            workerScriptsPath: "js/",                  // Path to deflate.js and inflate.js
            selectorIframe: "iframe",
            selectorRefresh: ".refresh",
            refreshActiveClass: "active",
            'settings': {
                zipUrl: "http://localhost:4503/content/app-content.zip", //publish312.adobedemo.com //localhost:4503
				openFile: "content/geometrixx-media/en/entertainment.app.html"
            }
        });*/
        
    });
})

ContentSyncApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })

    .state('app.search', {
        url: "/search",
        views: {
            'menuContent' :{
                templateUrl: "templates/search.html"
            }
        }
    })

    .state('app.homepage', {
        url: "/homepage",
        views: {
            'menuContent' :{
                templateUrl: "templates/homepage.html",
                controller: 'HomepageCtrl'
            }
        }
    })

    .state('app.map', {
        url: "/map",
        views: {
            'menuContent' :{
                templateUrl: "templates/map.html",
                controller: 'MapCtrl'
            }
        }
    })

    .state('app.contentsync', {
        url: "/contentsync",
        views: {
            'menuContent' :{
                templateUrl: "templates/contentsync.html",
                controller: 'ContentSyncCtrl'
            }
        }
    })

    .state('app.articlelist', {
        url: "/articlelist",
        views: {
            'menuContent' :{
                templateUrl: "templates/articlelist.html",
                controller: 'ArticleListCtrl'
            }
        }
    })

    .state('app.beacons', {
        url: "/beacons",
        views: {
            'menuContent' :{
                templateUrl: "templates/beacons.html",
                controller: 'BeaconsCtrl'
            }
        }
    })

    .state('app.browse', {
        url: "/browse",
        views: {
            'menuContent' :{
                templateUrl: "templates/browse.html"
            }
        }
    })
    
    .state('app.playlists', {
        url: "/playlists",
        views: {
            'menuContent' :{
                templateUrl: "templates/playlists.html",
                controller: 'PlaylistsCtrl'
            }
        }
    })

    .state('app.single', {
        url: "/playlists/:playlistId",
        views: {
            'menuContent' :{
                templateUrl: "templates/playlist.html",
                controller: 'PlaylistCtrl'
            }
        }
    });
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/homepage');
});