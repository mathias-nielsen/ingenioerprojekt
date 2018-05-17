(function(){
  'use strict';

  angular
    .module('mainApp.business')
    .factory('DataService',DataService);

  DataService.$inject = ['GoogleApiService','$timeout'];

  function DataService(GoogleApiService,$timeout){
    //Fields
    var ApiService = GoogleApiService;
    var IMG_A_URL = "https://mts.googleapis.com/maps/vt/icon/name=icons/spotlight/spotlight-waypoint-a.png&text=A&psize=16&font=fonts/Roboto-Regular.ttf&color=ff333333&ax=44&ay=48&scale=1";
	  var IMG_B_URL = "https://mts.googleapis.com/maps/vt/icon/name=icons/spotlight/spotlight-waypoint-b.png&text=B&psize=16&font=fonts/Roboto-Regular.ttf&color=ff333333&ax=44&ay=48&scale=1";
    var CLEARANCE_ID = 'layer_id_9A';
    var advancedBridges = [];


    var service = {
      getAutoCompleteOptions : getAutoCompleteOptions,
      getRouteParams : getRouteParams,
      getBusinessInfo : getBusinessInfo,
      getIconProperties : getIconProperties,
      getPolylineOptions : getPolylineOptions,
      getRendererOptions : getRendererOptions,
      requestRoute : requestRoute,
      getCanvasValues : getCanvasValues,
      getAdvancedBridgeInformation : getAdvancedBridgeInformation,
      addAdvancedBridge : addAdvancedBridge,
      getAdvancedBridges : getAdvancedBridges,

      IMG_A_URL : IMG_A_URL,
      IMG_B_URL : IMG_B_URL,
      CLEARANCE_ID : CLEARANCE_ID
    };

    return service;

    //Function implementations
    function getAutoCompleteOptions(){
      var toReturn = {
            types: ['geocode'],
            componentRestrictions: {country: "dk"}
      };
      return toReturn;
    };

    function getRouteParams(fromPlaceId,toPlaceId,travelMode,unitSystem){
      var toReturn = {
        origin : {'placeId' : fromPlaceId},
        destination : {'placeId' : toPlaceId},
        travelMode : travelMode,
        drivingOptions : {departureTime: new Date(Date.now())},
        provideRouteAlternatives: true,
        unitSystem : unitSystem
      };
      return toReturn;
    }

    function getBusinessInfo(){
      var toReturn = {
        from : {},
        to : {},
        route : {}
      };
      return toReturn;
    }

    function getIconProperties(tag){
      var imgUrl = (tag === "from" ? this.IMG_A_URL : this.IMG_B_URL);

      var toReturn = {
        url : imgUrl,
        origin : ApiService.getAnchorPoint(0,0)
      };
      return toReturn;
    }

    function getPolylineOptions(map,tag){

      if(tag === 'dirDis'){
        var toReturn = {
          map: map,
          strokeColor: "#40B4FC",
          strokeWeight: 4,
          strokeOpacity: 1
        };

      } else if(tag === 'newLine'){
        var toReturn = {
          path: [],
          strokeColor: '#40B4FC',
          strokeWeight: 3
        };

      }
      return toReturn;
    }; // getPolylineOptions

    function getRendererOptions(polylineOptions){
      var toReturn = {
        draggable: true,
        polylineOptions: polylineOptions
      };

      return toReturn;
    }; //getRendererOptions

    function requestRoute(directionsService,routeParams,callback){
      console.log('Requesting route');

      $timeout((function(){
        directionsService
          .route(
            routeParams,
            (function(response,status) {
              callback(response,status);
            }).bind(this)
          );
      }).bind(this),50);
    }; //requestRoute

    function getInfoWindowOptions(contentParam,anchorPoint){
      console.log('Getting InfoWindowOptions');
      var toReturn = {
        content : contentParam,
        //pixelOffset : ,
        position : anchorPoint,
        maxWidth : 400
      };
      return toReturn;
    };

    function getCanvasValues(){
      var toReturn = {
        height: 138,
        width: 327,
        bridge: {
          bottom: 38,
          top: 84,
          h: 295,
          m: 270,
          v: 240
        }
      };
      return toReturn;
    }

    function getAdvancedBridgeInformation(){
      var toReturn = {
        vejside1: {
          v : 4.53,
          m : 4.62,
          h : 4.7
        },
        vejside2: {
          h : 4.57,
          m : 4.67,
          v : 4.77
        }
      };
      return toReturn;
    }

    function addAdvancedBridge(featureId,road){
      advancedBridges.push({featureId,road});
    };

    function getAdvancedBridges(){
      return advancedBridges;
    }


  };  //DataService Function
})(); //Closure
