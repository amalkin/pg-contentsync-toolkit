var ContentSyncApp = angular.module('directory.services', [])

ContentSyncApp.factory('PageDataService', function($q, $timeout, $http) {
    
    var getMessages = function(callback) {
        $timeout(function() {
            callback(['<br/><br/>Hello', 'world!']);
        }, 2000);
    };
    
    var getScanBook = function(callback) {
        
        console.log("[getScanBook] STARTING: ");
        
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                setTimeout(function() {
                    
                    //var url = 'http://www.lookupbyisbn.com/Search/Book/' + result.text + '/1';                
                    //var bookinfo = "<a href='#' onclick=window.open('" + url + "','_blank')>Learn more about this book</a>";
                    //console.log("[ScanCtrl] bookinfo: "+bookinfo);
                    //document.getElementById('bookinfo').innerHTML += "<br/>"+bookinfo;
                    
                    var googleApiUrl = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + result.text;
    
                    //document.getElementById('bookinfo').innerHTML = "<br/><h3>Book</h3>";
                    
                    $http.get(googleApiUrl).success(
                        function(data) {
                            
                            var scanBook = [];
                            
                            for (var i = 0; i < data.items.length; i++) {
                                var item = data.items[i];
                                
                                scanBook.push({
                                    "title" : item.volumeInfo.title,
                                    "authors" : item.volumeInfo.authors,
                                    "description" : item.volumeInfo.description,
                                    "smallThumbnail" : item.volumeInfo.imageLinks.smallThumbnail,
                                    "previewLink" : item.volumeInfo.previewLink
                                });
                                
                            }
                
                            callback(scanBook);
                            
                        }
                    );
                    
                }, 0);
            },

            function (error) {
                alert("Scanning failed: " + error);
            }
        )
        
    };
    
    var getNewsStories = function(callback) {
        
        console.log("[getNewsStories] STARTING: ");
        
        //var newsUrl = globalData.glnewsApiUrl;
        //var newsType = globalData.glnewsApiType;
        //var newsTopic = globalData.glnewsApiTopic;
        
        var newsApiUrl = 'http://android.3sidedcube.com/bbcnews/?type=stories&topic=world';

        $http.get(newsApiUrl).success(
            function(data) {

                console.log("[getNewsStories: "+newsApiUrl);
                
                var newsStories = [];

                for (var i = 0; i < data.stories.length; i++) {
                    var item = data.stories[i];
                    
                    newsStories.push({
                        "link" : item.link,
                        "title" : item.title,
                        "description" : item.description,
                        "thumbnail" : item.thumbnail
                    });
                    
                }
                
                callback(newsStories);

            }
        );
        
    };
    
    var getSectionPageData = function(callback) {
        
        console.log("[getSectionPageData] STARTING: "+document.getElementById("foldername").value);
        
        var fsRoot = null;
        var folderName = globalData.glfolderName;
        var testFileArticle = globalData.testFileArticle;
        
        var searchFolder = document.getElementById("foldername").value;
        
        var searchF = ((searchFolder != "") ? searchFolder : testFileArticle) + globalData.fileArticleExt;
        searchF = searchF.replace(/\s+/g, '');
        console.log("[getSectionPageData] searchF: "+searchF);

        requestFileSystem(LocalFileSystem.PERSISTENT, 0, successRequestFileSystem, failRequestFileSystem);
        function successRequestFileSystem(fs) {
            fsRoot = fs.root;
            
            var path = fsRoot+"/"+folderName+globalData.glopenRootFolder;
            
            fsRoot.getDirectory(folderName +globalData.glopenRootFolder, { create: false }, function (folder) {
                
                folder.getFile(searchF, {create: false}, function (fileEntry) {
                    
                    var localUrl = fileEntry.toURL();
                    
                    $http.get(localUrl).success(
                        function(data) {
                            
                            var child = [];
                            for(var name in data){
                                
                                if(data[name]['jcr:content']){
                                    child.push({
                                        "id" : data[name]['jcr:content']['jcr:title'],
                                        "title" : data[name]['jcr:content']['jcr:title'],
                                        "description" : data[name]['jcr:content']['jcr:description']
                                    });
                                }
                            }

                            callback(child);
                            
                        }
                    );
                    
                }, function (error) {
                    console.log("failed to get file: " + error.code);
                });
                
            });            
            
        }
        
        function failRequestFileSystem() {
            console.error("Couldn't access the local file system");
        }
        
    };
    
    return {
        
        getMessages : getMessages,
        
        getSectionPageData : getSectionPageData,
        
        getNewsStories : getNewsStories,
        
        getScanBook : getScanBook
        
    }
    
});