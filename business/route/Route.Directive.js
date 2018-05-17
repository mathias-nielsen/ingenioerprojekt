(function(){
  'use strict';

    angular
      .module('mainApp.business')
      .directive('businessRoute',directiveFunction);

    function directiveFunction() {
      return {
        restrict : 'E',
        templateUrl : 'js/components/business/route/index.html'
      };
    };
})();
