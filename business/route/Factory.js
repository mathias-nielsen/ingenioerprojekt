(function(){
  'use strict';

  angular
    .module('mainApp.business')
    .factory('BusinessRouteFactory',businessRouteFactory);

  //Dependency injection
  businessRouteFactory.$inject = ['$window','$timeout','$filter','mapRouteFactory','GoogleApiService','DataService'];


  function businessRouteFactory($window,$timeout,$filter,mapRouteFactory,GoogleApiService,DataService){
    //Fields
    var ApiService = GoogleApiService;
    var map;
    var placesService;
    var directionsService;
    var travelMode	= ApiService.getTravelMode('DRIVING');
    var unitSystem = ApiService.getUnitSystem('METRIC');
    var businessInfo = DataService.getBusinessInfo();
    var directionsDisplay;


    var IMG_A_URL = DataService.IMG_A_URL;
    var IMG_B_URL = DataService.IMG_B_URL;

    //Interface
    var service = {
        //Fields
        map: map,
        placesService: placesService,
        businessInfo: businessInfo,
        directionsService: directionsService,
        travelMode: travelMode,
        unitSystem: unitSystem,

        //Functions
        setupAutoComplete: setupAutoComplete,
        init: init,
        setMarker: setMarker,
        removeMarkers : removeMarkers,
        removeAddress : removeAddress,
        startRoute: startRoute,
        initDirectionsDisplay: initDirectionsDisplay,
        findMarkerById : findMarkerById,
        clearRoute : clearRoute,
        isHeightCleared : isHeightCleared,
        validateRoute : validateRoute,
        getDirectionsDisplay : getDirectionsDisplay,
        createPolylineFromLegs : createPolylineFromLegs
    };
    return service;


    //Function implementations
    function init(mapParam){
      map = mapParam;
      placesService = ApiService.getPlacesService(map);
      directionsService = ApiService.getDirectionsService();
      initDirectionsDisplay();
    }

    function setupAutoComplete(input,tag){
      var autocomplete_options = DataService.getAutoCompleteOptions();
      var autocomplete = ApiService.getAutoComplete(input, autocomplete_options);
      autocomplete.bindTo('bounds',map);

      autocomplete
        .addListener(
          'place_changed',
          (function() {
            console.log("place changed",tag);
            var place = autocomplete.getPlace();

            if (!place.geometry) {
                $window.alert("Den indtastede adresse kunne ikke findes");
								return;
						}

            if(tag === "from"){
              businessInfo.from.place = place;
              setMarker(businessInfo.from.place.geometry.location,tag);
            } else if (tag === "to"){
              businessInfo.to.place = place;
              setMarker(businessInfo.to.place.geometry.location,tag);
            }
            //Start route
            if(businessInfo.from.place && businessInfo.to.place){
              this.startRoute(businessInfo.from.place.place_id,businessInfo.to.place.place_id);
            }

          }).bind(this)
        );
    };

    function startRoute(fromPlaceId,toPlaceId){
      console.log("Starting route function");
      var routeParams = DataService.getRouteParams(fromPlaceId,toPlaceId,travelMode,unitSystem);

      console.log("id's",fromPlaceId,toPlaceId);

      DataService.requestRoute(directionsService,routeParams, function(response,status){
        console.log('response: ', response);

        if(status === ApiService.getDirectionsStatus('OK')){
          dataLayer.push({
            'event': 'create-route',
            'gtm.element': routeParams,
            'origin' : businessInfo.from.place.formatted_address,
            'destination' : businessInfo.to.place.formatted_address
          });

          directionsDisplay.setMap(map);

          businessInfo.route.response = response;

          removeMarkers();
          directionsDisplay.setDirections(response);
          businessInfo.route.index = 0;

        } else {
          $window.alert("Der kunne ikke findes en rute.");
        }

      }); //requestRoute

    }; //startRoute function

    function setMarker(location,tag) {

        map.setCenter(location);
        map.setZoom(17);

        var marker = ApiService.getMarker(map,ApiService.getAnchorPoint(0,-38));
        marker.setIcon((DataService.getIconProperties(tag)));

        marker.setPosition(location);
        marker.setVisible(true);

        if(tag === "from"){
          if(businessInfo.from.marker) businessInfo.from.marker.setVisible(false);
          businessInfo.from.marker = marker;
        } else if(tag === "to"){
          if(businessInfo.to.marker) businessInfo.to.marker.setVisible(false);
          businessInfo.to.marker = marker;
        }

    };

    function initDirectionsDisplay(){
      if(directionsDisplay != null){
        //google.maps.event.clearListeners(directionsDisplay, 'directions_changed');
        directionsDisplay.setMap(null);
        directionsDisplay = null;
      } //Nulstil

      directionsDisplay = ApiService.getDirectionsRenderer(DataService.getRendererOptions(DataService.getPolylineOptions(map,'dirDis')));
      directionsDisplay.setMap(map);


    }; // initDirectionsDisplay

    function findMarkerById(markers,id){
      var substring = 'ID: ' + id;
      console.log('substring',substring);
      for(var i = 0; i < markers.length ; i++){
        var search = markers[i].description;

        if(search.includes(substring)){
          return markers[i];
        }
      } // For loop
    }; //findMarkerById

    function validateRoute(markers,truckHeight,validateRouteIndex,roadSide){
      var isTrouble;

      if(markers === undefined) {
        console.log('error in validateRoute markers is undefined');
        return;
      }

      var legs = directionsDisplay.getDirections().routes[validateRouteIndex].legs;
      var currentRoute = createPolylineFromLegs(legs);

      if(Array.isArray(markers)){
        //Filter alle non-trouble marks away
        var troubleBridges = markers.filter(mark => isMarkCausingProblems(currentRoute,mark,truckHeight,roadSide));
        isTrouble = troubleBridges.length > 0;
        algorithmImpl(isTrouble,validateRouteIndex,markers,truckHeight);

      } else { //Check route for 1 mark
        isTrouble = isMarkCausingProblems(currentRoute,markers,truckHeight,roadSide);
        algorithmImpl(isTrouble,validateRouteIndex,markers,truckHeight);
      }
    }; //validateRoute

    function algorithmImpl(isTrouble,validateRouteIndex,markers,truckHeight){
      if(isTrouble){
        if(validateRouteIndex == 0){
          $window.alert('Problemer med frihøjder på ruten, finder en ny rute');
        }

        businessInfo.route.index = calcNewRouteIndex(validateRouteIndex);
        if(typeof businessInfo.route.index === 'string'){
          $window.alert(businessInfo.route.index);
          return;
        }
        validateRoute(markers,truckHeight,businessInfo.route.index);
      } else {
        var succesString = 'Problemfri rute fundet';
        console.log('array',DataService.getAdvancedBridges());
        if(DataService.getAdvancedBridges().length > 0){
          succesString += '\n Særligt vær opmærksom på følgende broer og spor:';
          for(var i = 0; i < DataService.getAdvancedBridges().length; i++){
            succesString += '\n Bro ID: '+ DataService.getAdvancedBridges()[i].featureId +' - Spor: '+DataService.getAdvancedBridges()[i].road;
          }

        }

        $window.alert(succesString);
        console.log('Route index used: ',validateRouteIndex);
        directionsDisplay.setRouteIndex(validateRouteIndex);
      }
    }; //algorithmImpl

    function clearRoute() {
      if(directionsDisplay != null) {
        directionsDisplay.setMap(null);
      }
    }; //clearRoute

    function removeMarkers(tag){
      if(tag === undefined){
        if(businessInfo.from.marker) businessInfo.from.marker.setVisible(false);
        if(businessInfo.to.marker) businessInfo.to.marker.setVisible(false);
      } else if (tag == 'from') {
        businessInfo.from.marker.setVisible(false);
      } else if (tag == 'to') {
        businessInfo.to.marker.setVisible(false);
      }
    };

    function removeAddress(tag) {
      if(tag === undefined){
        businessInfo.from = {};
        businessInfo.to = {};
      } else if(tag == 'from') {
        businessInfo.from = {};
      } else if(tag == 'to') {
        businessInfo.to = {};
      }

    }; // removeAddress

    function getDirectionsDisplay() {
      return directionsDisplay;
    }

    //Helpers
    function createPolylineFromLegs(legs){
      //Copied from:
      //https://stackoverflow.com/questions/16180104/get-a-polyline-from-google-maps-directions-v3

      var polyline = ApiService.getPolyline(DataService.getPolylineOptions('newLine'));
      var bounds = ApiService.getLatLngBounds();

      for (var i=0;i<legs.length;i++) {
        var steps = legs[i].steps;
        for (var j=0;j<steps.length;j++) {
          var nextSegment = steps[j].path;
          for (var k=0;k<nextSegment.length;k++) {
            polyline.getPath().push(nextSegment[k]);
            bounds.extend(nextSegment[k]);
          }
        }
      }
      return polyline;
    }; //createPolylineFromLegs

    function isHeightCleared(bridgeHeight, truckHeight){
      return bridgeHeight > truckHeight;
    }; // isHeightCleared

    function calcNewRouteIndex(routeIndex){
      var length = businessInfo.route.response.routes.length;
      var toReturn;
      if(routeIndex == length-1){
        toReturn = 'Kunne ikke finde alternativ rute';
      } else if (length > 1 && routeIndex+1 <= length){
        toReturn = routeIndex + 1;
      } else  {
        toReturn = 'Kunne ikke finde alternativ rute';
      }
      console.log('toReturn',toReturn);
      return toReturn;
    }; //newRouteIndex

    function isMarkCausingProblems(route,mark,truckHeight,roadSide) {

      if(mark.feature_properties.clearance){ //simple clearance
        console.log('mark',mark);
        var bridgeHeight = mark.feature_properties.clearance;
        if(bridgeHeight < truckHeight) { //problems with height
          return ApiService.isContainingLocation(mark.getPosition(),route);
        } else { //No problem with height
          return false;
        }
      } else { //advanced clerance
        if(ApiService.isContainingLocation(mark.getPosition(),route)){
          for( var road in mark.feature_properties[roadSide] ){
            var bridgeHeight = mark.feature_properties[roadSide][road];
            if(bridgeHeight > truckHeight){
              DataService.addAdvancedBridge(mark.featureId,road);
              return false;
            }
          }
          return true;
        } else {
          return false;
        }
      }
    }; //isMarkCausingProblems
  };//businessRouteFactory function
})();//Closure
