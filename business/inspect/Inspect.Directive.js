(function(){
  'use strict';

    angular
      .module('mainApp.business')
      .directive('inspectElement',inspectElement);

    function inspectElement(){
      return {
        restrict : 'E',
        templateUrl : 'js/components/business/inspect/index.html',
        controller : 'InspectController',
        controllerAs : 'inspectCtrl'
      };
    };

})();
