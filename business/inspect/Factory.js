(function(){
  'use strict';

  angular
    .module('mainApp.business')
    .factory('InspectFactory',inspectFactory);

  inspectFactory.$inject = ['GoogleApiService','DataService','$compile','$rootScope'];

  function inspectFactory(GoogleApiService,DataService,$compile,$rootScope) {

    var map;
    var orignal_center;
    var ApiService = GoogleApiService;
    var marker;
    //Hulgårdsvej 128:
    //var LAT = 55.7033359;
    //var LNG = 12.520862500000021;

    //Jyllingevej:
    var LAT = 55.691879;
    var LNG = 12.434265;

    var location = {lat: LAT, lng: LNG};

    var img;
    var canvas;

    var service = {
      //Fields

      //functions
      init: init,
      focus: focus,
      reset: reset,
      getImg: getImg,
      getCanvas: getCanvas,
      drawBridgeHeight: drawBridgeHeight,
      clearCanvas: clearCanvas

    };
    return service;

    //function implementations:
    function init(mapParam){
      map = mapParam;
      marker = ApiService.getMarker(map,ApiService.getAnchorPoint(0,-38));
      marker.setPosition(location);
      marker.setVisible(false);
      orignal_center = map.center;

      setupInfoWindow();

    }; //init

    function focus(){
      marker.setVisible(true);
      map.setCenter(location);
      map.setZoom(17);


    }

    function reset(){
      marker.setVisible(false);
      map.setCenter(orignal_center);
      map.setZoom(7);
    }

    /*deprecated
    *
    function setupDraw(){
      var button = document.getElementById("inspect_bridge_button");
      button.addEventListener('click',function(){
        console.log('HI THERE :D');
      });
    };
      */

    function setupInfoWindow(){
      var infoWindow = ApiService.getInfoWindow();
      var content = '<inspect-element></inspect-element>';
      var compiled = $compile(content)($rootScope);

      marker.addListener('click', function() {
        $rootScope.$apply();
        infoWindow.setContent(compiled[0]);
        infoWindow.setOptions({maxWidth:400});
        infoWindow.open(map, marker);

        img = document.getElementById("highway_bridge");
        canvas = document.getElementById("highway_canvas");
        canvas.style.position = "absolute";
        canvas.style.left = img.offsetLeft + "px";
        canvas.style.top = img.offsetTop + "px";

      });



    }; //setupInfoWindow

    function getImg(){
      return img;
    };

    function getCanvas(){
      return canvas;
    };

    function drawBridgeHeight(roadOffset,top,bottom,color,ctx){
      ctx.beginPath();
      ctx.moveTo(roadOffset,top);
      ctx.lineTo(roadOffset,bottom);
      ctx.lineWidth = 5;
      ctx.strokeStyle = color;
      ctx.stroke();
    }; //drawBridgeHeight

    function clearCanvas(ctx,height,width){
      ctx.clearRect(0, 0, width, height);
    };



  }; //InspectFactory
})();
