(function(){
  'use strict';

  angular
    .module('mainApp.business')
    .factory('GoogleApiService',ApiService);

  ApiService.$inject = [];

  function ApiService(){

    var service = {

      //Functions
      getTravelMode : getTravelMode,
      getUnitSystem : getUnitSystem,
      getPlacesService : getPlacesService,
      getDirectionsService : getDirectionsService,
      getAutoComplete : getAutoComplete,
      getMarker : getMarker,
      getAnchorPoint : getAnchorPoint,
      getDirectionsStatus : getDirectionsStatus,
      getDirectionsRenderer : getDirectionsRenderer,
      getLatLngBounds : getLatLngBounds,
      getPolyline : getPolyline,
      isContainingLocation : isContainingLocation,
      getInfoWindow : getInfoWindow

    }
    return service;

    //Function implementations
    function getTravelMode(mode) {
      console.log('Getting TravelMode');

      if(mode === 'DRIVING'){
        return google.maps.TravelMode.DRIVING;

      } else if (mode === undefined){
        console.log('Mode is undefined, returning standard: DRIVING');
        return google.maps.TravelMode.DRIVING;
      }
    }; //getTravelMode

    function getUnitSystem(mode) {
      console.log('Getting UnitSystem');

      if(mode === 'METRIC'){
        return google.maps.UnitSystem.METRIC;

      } else if (mode === undefined){
        console.log('Mode is undefined, returning standard: METRIC');
        return google.maps.UnitSystem.METRIC;
      }
    }; //getUnitSystem

    function getPlacesService(map) {
      console.log('Getting PlacesService');

      return new google.maps.places.PlacesService(map);
    }; //getPlacesService

    function getDirectionsService() {
      console.log('Getting DirectionsService');

      return new google.maps.DirectionsService;
    }; //getDirectionsService

    function getAutoComplete(input, options) {
      console.log('Getting AutoComplete');

      if(input && options) {
        return new google.maps.places.Autocomplete(input, options);
      } else {
        console.log('Error : Missing parameters');
      }
    }; //getAutoComplete

    function getMarker(map, anchorPoint){
      console.log('Getting Marker');

      return new google.maps.Marker({
          map : map,
          anchorPoint : anchorPoint
      });
    };

    function getAnchorPoint(x, y){
      console.log('Getting AnchorPoint');

      return new google.maps.Point(x, y);
    }; //getAnchorPoint

    function getDirectionsStatus(mode) {
      console.log('Getting DirectionsStatus');

      if (mode === 'OK'){
        return google.maps.DirectionsStatus.OK;
      } else if(mode === undefined) {
        return google.maps.DirectionsStatus.UNKNOWN_ERROR;
      }

    }; //getDirectionsStatus

    function getDirectionsRenderer(rendererOptions) {
      return new google.maps.DirectionsRenderer(rendererOptions);
    }; // getDirectionsRenderer

    function getLatLngBounds(){
      return new google.maps.LatLngBounds();
    }; //getNewBounds

    function getPolyline(polylineOptions){
      return new google.maps.Polyline(polylineOptions);
    }; //getPolyline

    function isContainingLocation(point,geometry){
      return google.maps.geometry.poly.isLocationOnEdge(point,geometry,10e-5);
    }; //isContainingLocation

    function getInfoWindow(){
      return new google.maps.InfoWindow();
    }


  };  //ApiService Function
})(); //Closure
