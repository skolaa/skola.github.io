var blogIndexApp = angular.module('blogIndexApp', ['ngRoute']);
blogIndexApp.config(['$routeProvider','$httpProvider',
  function($routeProvider,$httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $routeProvider.
      when('/main', {
		templateUrl: 'main.html',
		controller: 'blogIndexController'
	}).
      when('/blogDetail/:blogId', {
		templateUrl: 'blog_detail.html',
		controller: 'blogIndexController'
      }).
      otherwise({
		redirectTo: '/main'
      });
}]);
blogIndexApp.controller('blogIndexController',["$scope","$http", "$window","$routeParams", "$sce",function($scope, $http, $window, $routeParams, $sce){
  $scope.blogList = {}
  $scope.authorName = []
  $scope.profileColorArr  = ["#4ECDC4", "#FF6B6B", "#FE4365", "#033649", "#83AF9B",
   "#ECD078", "#C02942", "#53777A", "#556270", "#C7F464",
  "#490A3D", "#BD1550", "#E6AC27"]
  $scope.getBlogList = function(){
    $http.get("http://35.154.87.133:9000/?page=0&&size=10").success(function(response){
      console.log(response)
      $scope.authorList = response.authors
      $scope.blogList = response.blogs
    }).error(function(e){
      console.log(e)
    });
  }
  $scope.setAuthor = function(authorIds){
    //  var authorIds = Array.prototype.slice.call(arguments);
      for(var id in authorIds)
        for(var author in $scope.authorList)
          if(authorIds[id]==$scope.authorList[author].id)
              $scope.authorName.push($scope.authorList[author].name)
  }
  $scope.readMoreBlog = function(){
    var blogId = $routeParams.blogId;
    $http.get("http://35.154.87.133:9000/blog/"+blogId).success(function(response){
      console.log(response)
      $scope.blogDetail = response
      $scope.blogDetail.blogText = $sce.trustAsHtml($scope.blogDetail.blogText)
       $('pre code').each(function(i, block) {
          hljs.highlightBlock(block);
        })
    }).error(function(e){
      console.log(e)
    });
  }
}]);
