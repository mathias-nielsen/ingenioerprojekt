	//var self = this; //VM Capture

	//Fields
	$scope.BusinessRouteFactory = BusinessRouteFactory;
	this.idMethod;
	$scope.idMethods = ['alle','specifik','advanced'];
	this.specificId;
	$scope.buttonText = 'Test Inspicer Bro';
	$scope.testActive = false;

	var businessAddressFrom;
	var businessAddressTo;

	//Functions
	$scope.removeAddress = removeAddress;
	$scope.initBusinessRoute = initBusinessRoute;
	$scope.validateFunction = validateFunction;
	$scope.hideTextField = hideTextField;
	$scope.testInspectBridge = testInspectBridge;

	//############## Function implementations ##############
	function removeAddress(tag){
		console.log("removeAddress",tag);

		//clear HTML textareas
		if(tag === undefined){
				$scope.businessAddressFrom.value = "";
				$scope.businessAddressTo.value = "";
		} else if(tag == 'from') {
				$scope.businessAddressFrom.value = "";
		} else if(tag == 'to') {
				$scope.businessAddressTo.value = "";
		}

		$scope.BusinessRouteFactory.removeMarkers(tag);
		$scope.BusinessRouteFactory.removeAddress(tag);
		BusinessRouteFactory.clearRoute();

	};

	function initBusinessRoute(){
		BusinessRouteFactory.init($scope.vdtrafficmap);
		InspectFactory.init($scope.vdtrafficmap);

		$scope.businessAddressFrom =	document.getElementById("business-address-from");
		$scope.businessAddressTo =	document.getElementById("business-address-to");

		BusinessRouteFactory.setupAutoComplete($scope.businessAddressFrom,"from");
		BusinessRouteFactory.setupAutoComplete($scope.businessAddressTo,"to");
	};

	function validateFunction(){
		var truckHeight = utilFactory.getType("truckheight") / 100;
		var markers = $scope.markerClusterer.getMarkers(DataService.CLEARANCE_ID);
		//TODO: Reset saved advancedBridges

		//Case 1: Error: Ingen frihøjder
		if(markers.length < 1){
			$window.alert('Der blev ikke fundet nogle frihøjder');
		}

		//Case 2: Error: Specific valgt og ID undefined
		else if(this.idMethod == 'specifik' && this.specificId === undefined) {
			$window.alert('Indtast et ID');
		}

		//Case 3: Succes: specifik valgt og ID indtastet
		else if(this.idMethod == 'specifik' && this.specificId != undefined) {
			console.log('specificId',this.specificId);

			var mark = BusinessRouteFactory.findMarkerById(markers,this.specificId);
			BusinessRouteFactory.validateRoute(mark,truckHeight,0);
		}

		//Case 4: Succes: ALle valgt
		else if(this.idMethod == 'alle') {
			console.log('Alle valgt');
			BusinessRouteFactory.validateRoute(markers,truckHeight,0);
		}

		//Case 5: Advanced
		else if(this.idMethod == 'advanced'){
			var mark = BusinessRouteFactory.findMarkerById(markers,10048);
			mark.feature_properties = DataService.getAdvancedBridgeInformation();
			BusinessRouteFactory.validateRoute(mark,truckHeight,0,'vejside2');
		}

	}; //testFunction

	function hideTextField() {
		var toReturn = !(this.idMethod == 'specifik');
		return toReturn;
	}

	function testInspectBridge(){
		$scope.testActive = !$scope.testActive;
		if($scope.testActive){
			$scope.buttonText = 'Reset Inspicer Bro';
			InspectFactory.focus();
		} else {
			$scope.buttonText = 'Test Inspicer Bro';
			InspectFactory.reset();
		}

	}
