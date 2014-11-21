var ContentSyncApp = angular.module('directory.services', [])

ContentSyncApp.factory('PageDataService', function($q, $timeout, $http) {
    
    var getMessages = function(callback) {
        $timeout(function() {
            callback(['<br/><br/>Hello', 'world!']);
        }, 2000);
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
        
        console.log("[getSectionPageData] STARTING: ");
        
        var fsRoot = null;
        var folderName = globalData.glfolderName;
        var testFileArticle = globalData.testFileArticle + globalData.fileArticleExt;        

        requestFileSystem(LocalFileSystem.PERSISTENT, 0, successRequestFileSystem, failRequestFileSystem);
        function successRequestFileSystem(fs) {
            fsRoot = fs.root;
            
            var path = fsRoot+"/"+folderName+globalData.glopenRootFolder;
            
            fsRoot.getDirectory(folderName +globalData.glopenRootFolder, { create: false }, function (folder) {
                
                folder.getFile(testFileArticle, {create: false}, function (fileEntry) {
                    
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
        
        getNewsStories : getNewsStories
        
    }
    
});