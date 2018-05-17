(function(){
  'use strict';

  angular
    .module('mainApp.business')
    .controller('TooltipController',tooltipController);

  function tooltipController(){
    //VM capture
    var self = this;

    self.tooltip = "Tooltip goes here";
  }; //RouteController
})(); // Closure
