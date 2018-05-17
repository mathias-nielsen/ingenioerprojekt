(function(){
  'use strict';

    angular
      .module('mainApp.business')
      .directive('clearanceId',clearanceId);

    function clearanceId() {
      return {
        restrict : 'E',
        templateUrl : 'js/components/business/id/id-entrance.html'
      };
    };
})();
