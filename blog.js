var blogIndexApp = angular.module('blogIndexApp', ['ngRoute', 'ngSanitize']);
blogIndexApp.config(['$routeProvider','$httpProvider', '$locationProvider',
  function($routeProvider, $httpProvider, $locationProvider) {
    $httpProvider.defaults.withCredentials = true;
    $routeProvider.
      when('/main', {
		templateUrl: 'main.html',
		controller: 'blogIndexController'
	}).
      when('/blogDetail/:blogUrl/:blogId', {
		templateUrl: 'blog_detail.html',
		controller: 'blogIndexController'
      }).
      otherwise({
		redirectTo: '/main'
      });
}]);

blogIndexApp.controller('blogIndexController',["$scope","$http", "$window","$routeParams", "$sce","appConfig", "selectedBlog", "$location",function($scope, $http, $window, $routeParams, $sce, appConfig, selectedBlog, $location){
  $scope.blogList = {}
  $scope.selectedPage = 0;

  $scope.getUrl = function(title) {
        return title.replace(/\s/g, '-').toLowerCase();
  }
  $scope.getBlogList = function(pageIndex) {
        $http.get(appConfig.STATIC_URL + "?page=" + pageIndex + "&&size=10").success(function(response) {
            $scope.authorList = response.authors
            $scope.blogList = response.blogs
            $scope.blogList.content.forEach(function(blog) {
                blog.url = $scope.getUrl(blog.blogTitle);
            });
            $scope.blogList.totalPages = 10
            $scope.pagesArr = Array.from(Array($scope.blogList.totalPages), () => 0);
            // for (var i = 0; i < $scope.blogList.totalPages; i++) {
            //     $scope.pagesArr.push(0);
            // }
        }).error(function(e) {
            console.log(e)
        });
    }
  $scope.setAuthor = function(authorIds){
    var names = $scope.authorList.filter(author => authorIds.indexOf(author.id) != -1).map(author => author.name);
    return names;
  }

  $scope.subscribe = function(email) {
	var params = { 'email': email }
	$http.post(appConfig.STATIC_URL + "subscribe", params).success(function(response) {
	    console.log("done");
	}).error(function(response) {
	    console.log("error");
	})
  }

    $scope.getPrev = function() {
        $scope.selectedPage -= 1
        $scope.getBlogList($scope.selectedPage);
    }
    $scope.getNext = function() {
        $scope.selectedPage += 1
        $scope.getBlogList($scope.selectedPage);
    }
    $scope.getSelectedPage = function(index) {
        $scope.selectedPage = index
        $scope.getBlogList($scope.selectedPage)
    }
    $scope.showHideSubscribe = function() {
        var element = document.getElementById('subscribeDiv');
        element.classList.toggle('closed');
    }

    $scope.readMoreBlog = function() {
        var id = $routeParams.blogId
        $http.get(appConfig.STATIC_URL + "blog/" + id).success(function(response) {
            $scope.blogDetail = response
            $scope.tags = $scope.blogDetail.tags
            $scope.relatedStories = $scope.blogDetail.relatedStories
            $scope.blogDetail.blogText = marked($scope.blogDetail.blogText);
        }).error(function(e) {
            console.log(e)
        });
    }
}]);

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false, // if false -> allow plain old HTML ;)
    smartLists: true,
    smartypants: false,
    highlight: function(code, lang) {
        if (lang) {
            return hljs.highlight(lang, code).value;
        } else {
            return hljs.highlightAuto(code).value;
        }
    }
});

blogIndexApp.constant('appConfig', {
    'STATIC_URL': 'http://35.154.87.133:9000/'
});
blogIndexApp.factory("selectedBlog", function() {
    var currentBlog = {}
    return {
        set: setData,
        get: getData
    }

    function setData(data) {
        currentBlog = data
    };

    function getData() {
        return currentBlog;
    };
});
