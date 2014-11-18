var DownloadApp = function() {
    console.log("[DownloadApp.CALLED9999999999999]");
}

DownloadApp.prototype = {
    load: function(uri, folderName, fileName, progress, success, fail) {
        var that = this;
        that.progress = progress;
        that.success = success;
        that.fail = fail;
        var filePath = "";

        console.log("[DownloadApp.load]");

        that.getFilesystem(
                function(fileSystem) {
                    console.log("[DownloadApp.load] GotFS");
                    that.getFolder(fileSystem, folderName, function(folder) {
                        filePath = folder.toURL() + "/" + fileName;
                        that.transferFile(uri, filePath, progress, success, fail);
                    }, function(error) {
                        console.log("[DownloadApp.load] Failed to get folder: " + error.code);
                        typeof that.fail === 'function' && that.fail(error);
                    });
                },
                function(error) {
                    console.log("[DownloadApp.load] Failed to get filesystem: " + error.code);
                    typeof that.fail === 'function' && that.fail(error);
                }
        );
    },

    getFilesystem:function (success, fail) {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, fail);
    },

    getFolder: function (fileSystem, folderName, success, fail) {
        fileSystem.root.getDirectory(folderName, {create: true, exclusive: false}, success, fail)
    },

    transferFile: function (uri, filePath, progress, success, fail) {
        var that = this;
        that.progress = progress;
        that.success = success;
        that.fail = fail;

        var transfer = new FileTransfer();
        transfer.onprogress = function(progressEvent) {
            if (progressEvent.lengthComputable) {
                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                typeof that.progress === 'function' && that.progress(perc); // progression on scale 0..100 (percentage) as number
            } else {
            }
        };

        transfer.download(
            uri,
            filePath,
            function(entry) {
                console.log("File saved to: " + entry.toURL());
                typeof that.success === 'function' && that.success(entry);
            },
            function(error) {
                console.log("An error has occurred: Code = " + error.code);
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("download error code " + error.code);
                typeof that.fail === 'function' && that.fail(error);
            }
        );
    },

    getSectionPages: function(folderName, fileName, success, fail) {
        var that = this;
        that.success = success;
        that.fail = fail;

        that.getFilesystem(
            function(fileSystem) {

                console.log("[getSectionPages] section files: "+fileSystem+folderName+globalData.glopenRootFolder+"people-dps.infinity.json");

                that.getFolder(fileSystem, folderName +globalData.glopenRootFolder, function (folder) {

                    console.log("[getSectionPages] SUCCESS ");

                    folder.getFile("people-dps.infinity.json", {create: false}, function (fileEntry) {

                        var localPath = fileEntry.fullPath;
                        var localUrl = fileEntry.toURL();
                        
                        console.log("[getSectionPages] localPath "+localPath);
                        console.log("[getSectionPages] localUrl "+localUrl);

                        $http.get(localUrl).success(
                            function(data) {
                                
                                var pageChildren = {};

                                for(var name in data){
                                    console.log("[getSectionPages] looping: ");
                                    if(data[name]['jcr:content']){
                                        pageChildren['title'] = data[name]['jcr:content']['jcr:title'];
                                        console.log("[getSectionPages] pageChildren: "+data[name]['jcr:content']['jcr:title']);

                                        var pageTitle = data[name]['jcr:content']['jcr:title'];
                                        //$scope.sectionPages.push({
                                        //    title: pageTitle
                                        //});

                                    }
                                }
                                
                                console.log("[localUrl] 4565465454454565: "+pageChildren);
                                
                                //return pageChildren;

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

    },

    unzip: function(folderName, fileName, success, fail) {
        var that = this;
        that.success = success;
        that.fail = fail;

        zip.unzip("cdvfile://localhost/persistent/" + folderName + "/" + fileName,
                  "cdvfile://localhost/persistent/" + folderName,
            function(code) {
                console.log("result: " + code);
                that.getFilesystem(
                    function(fileSystem) {

                        console.log("gotFS: fileSystem + folderName +: "+ fileSystem + folderName + globalData.glopenRootFolder);

                        that.getFolder(fileSystem, folderName + globalData.glopenRootFolder, function (folder) {
                            folder.getFile(globalData.glopenRootFile, {create: false}, function (fileEntry) {
                                fileEntry.file(function(file) {
                                    var reader = new FileReader();
                                    reader.onloadend = function (evt) {
                                        console.log("Read as text");
                                        console.log(evt.target.result);
                                        document.getElementById("txtPlace").innerHTML = evt.target.result;
                                        typeof that.success === ' function && that.success();'
                                    };
                                    reader.readAsText(file);
                                }, function(error) {
                                    console.log("Failed to get file");
                                    typeof that.fail === 'function' && that.fail(error);
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
                        console.log("failed to get filesystem: " + error.code);
                        typeof that.fail === 'function' && that.fail(error);
                    }
                );
            }
        );
    }
}