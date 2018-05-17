(function(){
  'use strict';

  angular
    .module('mainApp.business')
    .controller('InspectController',inspectController);

  inspectController.$inject = ['GoogleApiService','InspectFactory','DataService','utilFactory']

  function inspectController(GoogleApiService,InspectFactory,DataService,utilFactory){

    var vm = this;
    vm.map;
    vm.ctx;
    vm.canvasValues = DataService.getCanvasValues();
    vm.advancedBridgeInfo = DataService.getAdvancedBridgeInformation();

    vm.bridgeValues = {
      height: {
        inner: 4.57,
        outer: 4.77
      }
    };

    vm.ApiService = GoogleApiService;
    vm.buttonText = 'Test';
    vm.isSwitch = false;

    //functions
    vm.draw = draw;
    vm.inspectBridge = inspectBridge;


    //functions implementations

    /**
    @deprecated
    function draw(innerColor,outerColor){


      console.log('Draw called',vm.switch);
      vm.canvasValues.context  = InspectFactory.getCanvas().getContext("2d");
      if(vm.isSwitch){
        InspectFactory.drawBridgeHeight(
            vm.canvasValues.bridge.innerRoad,
            vm.canvasValues.bridge.top,
            vm.canvasValues.bridge.bottom,
            innerColor,
            vm.canvasValues.context
        );

        InspectFactory.drawBridgeHeight(
            vm.canvasValues.bridge.outerRoad,
            vm.canvasValues.bridge.top,
            vm.canvasValues.bridge.bottom,
            outerColor,
            vm.canvasValues.context
        );
        vm.buttonText = 'Clear';
      } else {
        InspectFactory.clearCanvas(vm.canvasValues.context,vm.canvasValues.height,vm.canvasValues.width);
        vm.buttonText = 'Test';
      }
    };
    */

    /**
    @deprecated
    function inspectBridge(){
      vm.isSwitch = !vm.isSwitch;
      var height = utilFactory.getType("truckheight") / 100;
      console.log('height',height);
      var innerColor = (vm.bridgeValues.height.inner > height) ? 'green' : 'red';
      var outerColor = (vm.bridgeValues.height.outer > height) ? 'green' : 'red';
      vm.draw(innerColor,outerColor);
    }; //inspectBridge
    */


    function inspectBridge(){
      vm.isSwitch = !vm.isSwitch;
      var height = utilFactory.getType("truckheight") / 100;
      vm.canvasValues.context  = InspectFactory.getCanvas().getContext("2d");

      if(vm.isSwitch){
        for(var road in vm.advancedBridgeInfo['vejside2']){
          var color = (vm.advancedBridgeInfo['vejside2'][road] > height) ? '#00ff00' : 'red';
          vm.draw(color,road);
        }
        vm.buttonText = 'Clear';
      } else {
        InspectFactory.clearCanvas(vm.canvasValues.context,vm.canvasValues.height,vm.canvasValues.width);
        vm.buttonText = 'Test';
      }


    }; //inspectBridge2

    function draw(color,road){
      InspectFactory.drawBridgeHeight(
          vm.canvasValues.bridge[road],
          vm.canvasValues.bridge.top,
          vm.canvasValues.bridge.bottom,
          color,
          vm.canvasValues.context
      );
    }; //draw2


  }; //InspectController
})(); // Closure
