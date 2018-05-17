(function(){
  'use strict';

    angular
      .module('mainApp.business')
      .directive('toolTip',tooltipFunction);

    function tooltipFunction(){
      return {
        restrict : 'E',
        templateUrl : 'js/components/business/tooltip/index.html',
        controller : 'TooltipController',
        controllerAs : 'tooltipCtrl'
      };
    };

})();
