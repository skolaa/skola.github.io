var blogIndexApp = angular.module('blogIndexApp', ['ngRoute', 'ngSanitize']);
blogIndexApp.config(['$routeProvider','$httpProvider',
  function($routeProvider,$httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $routeProvider.
      when('/main', {
		templateUrl: '/public/main.html',
		controller: 'blogIndexController'
	}).
      when('/blogDetail/:blogId', {
		templateUrl: '/public/blog_detail.html',
		controller: 'blogIndexController'
      }).
      otherwise({
		redirectTo: '/main'
      });
}]);
blogIndexApp.controller('blogIndexController',["$scope","$http", "$window","$routeParams", "$sce",function($scope, $http, $window, $routeParams, $sce){
  $scope.blogList = {}
  $scope.profileColorArr  = ["#4ECDC4", "#FF6B6B", "#FE4365", "#033649", "#83AF9B",
   "#ECD078", "#C02942", "#53777A", "#556270", "#C7F464",
  "#490A3D", "#BD1550", "#E6AC27"]
  $scope.getBlogList = function(){
    $http.get("http://35.154.87.133:9000/?page=0&&size=10").success(function(response){
      $scope.authorList = response.authors
      $scope.blogList = response.blogs
    }).error(function(e){
      console.log(e)
    });
  }
  $scope.setAuthor = function(authorIds){
    var names = $scope.authorList.filter(author => authorIds.indexOf(author.id) != -1).map(author => author.name);
    return names;
  }
  $scope.readMoreBlog = function(){
    var blogId = $routeParams.blogId;
    $http.get("http://35.154.87.133:9000/blog/"+blogId).success(function(response){
      $scope.blogDetail = response
      $scope.blogDetail.blogText = marked($scope.blogDetail.blogText);
    }).error(function(e){
      console.log(e)
    });
  }
}
]);

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false, // if false -> allow plain old HTML ;)
    smartLists: true,
    smartypants: false,
    highlight: function (code, lang) {
      if (lang) {
        return hljs.highlight(lang, code).value;
      } else {
        return hljs.highlightAuto(code).value;
      }
    }
  });
