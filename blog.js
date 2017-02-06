var blogIndexApp = angular.module('blogIndexApp', ['ngRoute']);
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
  var md = new Remarkable('full', {
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      true,         // autoconvert URL-like texts to links
    linkTarget:   '',           // set target to open link in
    typographer:  false,
    quotes: '“”‘’',
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (__) {}
      }

      try {
        return hljs.highlightAuto(str).value;
      } catch (__) {}

      return ''; // use external default escaping
    }
  });

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
      $scope.blogDetail.blogText = $sce.trustAsHtml($scope.blogDetail.blogText);
	     /*$('pre code').each(function(i, block) {
          hljs.highlightBlock(block);
        })*/
    }).error(function(e){
      console.log(e)
    });
  }
}]);
