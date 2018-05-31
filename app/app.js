'use strict';

var app=angular.module("app", []);

app.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
      var valuetxtarr="";
      var n = htmlCode.indexOf("<ul>");
      if (n>=0) {
        valuetxtarr = htmlCode.replace(/\n/g,"");
      }else{
        valuetxtarr = htmlCode.replace(/\n/g,"<br>");
      }
      
    return $sce.trustAsHtml(valuetxtarr);
  }
}]);

