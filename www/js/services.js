var ContentSyncApp = angular.module('directory.services', [])

ContentSyncApp.factory('PageDataService', function($q) {
    
    return {
        getPageContent: function(folderName, fileName, success, fail) {
            
            var that = this;
            that.success = success;
            that.fail = fail;
            
            var deferred = $q.defer();
            
            var someContent = 'DDDDDDDDDDDDD';            
            
            var PERSISTENT, TEMPORARY;
            if (typeof LocalFileSystem === 'undefined') {
                console.log("LocalFileSystem undefined: ");
                PERSISTENT = window.PERSISTENT;
                TEMPORARY = window.TEMPORARY;
            } else {
                console.log("LocalFileSystem FOUND!!!!!!!!!: ");
                PERSISTENT = LocalFileSystem.PERSISTENT ;
                TEMPORARY = LocalFileSystem.TEMPORARY;
            }
            
            window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
            if (navigator.webkitPersistentStorage) {
                console.log("[checkForFile] 22222222222222222222222222222 ");
                navigator.webkitPersistentStorage.requestQuota(1024*1024*280, function(grantSize) {
                    window.requestFileSystem(PERSISTENT, grantSize, checkForFile, onError);
                }, function(err) {
                    console.log(err.name+": "+err.message);
                })
            }
            else {
                console.log("[checkForFile] 11111111111111111111111111111111111111 ");
                requestFileSystem(LocalFileSystem.PERSISTENT, 0, checkForFile, onError);
            }
            
            var checkForFile = function(fileSystem) {
                
                someContent = 'TEST';
                console.log("getPageContent: "+folderName);
                console.log("getPageContent: "+fileName);
                console.log("getPageContent: "+someContent);
                
            }
            
            var onError = function(err) {
                console.error("[checkForFile] ERROR: "+err.name+": "+err.message);
            }
            
            
            /*
            
            
            
            
            
            
            var checkForFile = function(fileSystem) {
                
                someContent = 'TEST';
                console.log("getPageContent: "+folderName);
                console.log("getPageContent: "+fileName);
                console.log("getPageContent: "+someContent);
                
                that.getFilesystem(
                    function(fileSystem) {
                
                        console.log("[checkForFile] section files: "+fileSystem+folderName+globalData.glopenRootFolder+"people-dps.infinity.json");
                        
                        that.getFolder(fileSystem, folderName +globalData.glopenRootFolder, function (folder) {

                            console.log("[checkForFile] SUCCESS ");

                            folder.getFile("people-dps.infinity.json", {create: false}, function (fileEntry) {

                                var localPath = fileEntry.fullPath;
                                var localUrl = fileEntry.toURL();

                                $http.get(localUrl).success(
                                    function(data) {

                                        for(var name in data){
                                            console.log("[checkForFile] looping: ");
                                            if(data[name]['jcr:content']){
                                                var child = {};
                                                child['title'] = data[name]['jcr:content']['jcr:title'];
                                                console.log("[checkForFile] childPage: "+data[name]['jcr:content']['jcr:title']);

                                                var pageTitle = data[name]['jcr:content']['jcr:title'];
                                                $scope.sectionPages.push({
                                                    title: pageTitle
                                                });

                                            }
                                        }

                                    });

                            }, function (error) {
                                console.log("failed to get file: " + error.code);
                                typeof that.fail === 'function' && that.fail(error);
                            });

                        }, function (error) {
                            console.log("failed to get folder: " + error.code);
                            typeof that.fail === 'function' && that.fail(error);
                        });
                    }, function(error) {
                        console.log("[read] failed to get filesystem: " + error.code);
                        typeof that.fail === 'function' && that.fail(error);
                    }
                );


                deferred.resolve(someContent);
                return deferred.promise;

                
            }
            */
            
            
            deferred.resolve(someContent);
            return deferred.promise;
                
                
             
            
            
        }
    }
    
});