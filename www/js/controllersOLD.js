var ContentSyncApp = angular.module('starter.controllers', [])

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

ContentSyncApp.controller('ContentSyncCtrl', function($scope, $ionicLoading) {
    
    console.log("Content Sync");
    
    $ionicLoading.show({
        template: 'Loading...'
    });
    
    
    
    //$scope.getPageData = function(page) {
    //    var promise = PageData.getPageDataAsync('people');
   //     promise.then (
    //        function(payload) { 
    //            $scope.pageData = payload.data;
    //        },
    //        function(errorPayload) {
     //           $log.error('failure loading page', errorPayload);
     //       });
    //};
    
    
    
    
    requestFileSystem(LocalFileSystem.PERSISTENT, 0, successRequestFileSystem, failRequestFileSystem);
    var extractCount = 0;
    var fileObject;
    
    //Generic error handler
    function errorHandler(e) {
        console.log("*** ERROR ***");
        console.log("Error: "+e);
    }
    
    function successRequestFileSystem(fs) {
        console.error("[successRequestFileSystem] Local file system...");
        
        fsRoot = fs.root;
        zip.workerScriptsPath = globalData.glworkerScriptsPath;
        
        console.error("[successRequestFileSystem] zip.workerScriptsPath "+zip.workerScriptsPath);
        console.error("[successRequestFileSystem] zipUrl "+globalData.glzipUrl);
        
        var reader = new zip.HttpReader(globalData.glzipUrl);
        zip.createReader(reader, extractZip, failCreateReader);
        
    }

    function failRequestFileSystem() {
        console.error("Couldn't access the local file system");
    }    
    
    function failCreateReader() {
        console.warn("[failCreateReadercccc] Cannot retrieve ZIP file from URL \nWill try to access earlier version of file.");
        openFile();
    }
    
    function extractZip(reader) {
        console.error("[extractZip] extractZip");
        reader.getEntries(function (entries) {
            
            entries.forEach(function (entry) {
                console.log("1 entries.forEach " + entry.filename);
                if (!entry.directory) {
                    console.log("2 entries.forEach " + entry.filename);                    
                    
                    extractFile(entry);
                } else {
                    console.log("Ignored entry " + entry.filename);
                }
            },errorHandler);
            
        });
    }
    
    function extractFile(entry) {
        extractCount++;
        createPath(entry.filename);
        
        fsRoot.getFile(entry.filename, { create: true }, gotFileEntry, fail);
        
        function gotFileEntry(fileEntry) {
            console.log("gotFileEntry ");
            
            fileEntry.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(e) {
                    console.log("Text is: "+this.result);
                    document.querySelector("#textArea").innerHTML = this.result;
                }

                reader.readAsText(file);
            });
            
            $ionicLoading.hide();
            
            fileObject = fileEntry;
            saveFileContent();
        }
        
        function saveFileContent() {
            console.log("saveFileContent ");
            fileObject.createWriter(gotFileWriter, fail);
        }
        
        function gotFileWriter(writer) {
            console.log("gotFileWriter ");
            writer.write("TEST");
            console.log("gotFileWriter write ");
            writer.onwriteend = function(evt) {
                console.log("gotFileWriter onwriteend ");
                var reader = new FileReader();
                reader.readAsText(fileObject);
            };
        }

        function fail(error) {
            console.log("*** FAIL ***: "+error.code);
        }
        
        
        
        
        //fsRoot.getFile(entry.filename, { create: true }, successCreateFile, failCreateFile);
        
        function successCreateFile(file) {
            file.createWriter(function (fileWriter) {
                console.log("Extracting fileeeeeeeeeeee " + entry.filename);
                console.log("TESTS");
                console.log("globalData: "+globalData.glzipUrl);
                var zipWriter = new zip.TextWriter();
                console.log("   extractCount "+extractCount);
                
                
                
                //var zipWriter = new zip.FileWriter(file, zip.getMimeType(entry.filename));
                
                entry.getData(new zip.FileWriter(file), function (text) {
                    console.log("successWroteFile "+text);
                    //fileWriter.write(text); // comment if using zip.FileWriter
                    //successWroteFile();
                }, function(err) {
                    console.log("Sorry, but unable to read this as a CBR file.");
                    console.log("Get data error: "+err.code);
                });
                
            },errorHandler);
        }
        
        function successWroteFile() {
            if (--extractCount <= 0) {
                openFile();
            }
        }
        
        function failCreateFile() {
            console.error("Couldn't create file " + entry.filename);
        }
        
    }
    
    function createPath(filename) {
        console.log("createPath " + filename);
        var parentDirectories = filename.split("/");
        console.log("createPath parentDirectories " + parentDirectories);
        for (var i = 0, l = parentDirectories.length - 1; i < l; ++i) {
            (function () { // Create a closure for the path variable to be correct when logging it
                var path = parentDirectories.slice(0, i+1).join("/");
                fsRoot.getDirectory(path, { create: true, exclusive: true }, function () {
                    console.log("Created directory " + path);
                });
            })();
        }
    }
    
    function openFile() {
        console.log("openFile ");
        var openRootFile = globalData.glopenRootFile;
        var file = fsRoot.toNativeURL() + openRootFile; //content/geometrixx-media/en/entertainment.app.html
        console.log("fsRoot.fullPath " + fsRoot.fullPath);
        console.log("fileSystem.root.name " + fsRoot.name);
        console.log("Redirecting to file " + file);
        
        $("iframe").attr("src", file);
        
    }
    
    
})

ContentSyncApp.controller('PlaylistCtrl', function($scope, $stateParams) {
    
});