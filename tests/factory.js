(function(){
  'use strict';

  describe('firstFactoryTest',function(){
    var routeFactory;
    var test;

    beforeEach(function(BusinessRouteFactory){
      routeFactory = BusinessRouteFactory;
      test = angular.module('mainApp.business').factory('BusinessRouteFactory');
    });


    it('inspectFactory should be defined',function(){
      expect(test).toBeDefined();
    });
  }); //describe
})();




/*
describe('example test', function() {
  it('should be true', function() {
    expect('foo').toBe('foo');
  });
});
*/
