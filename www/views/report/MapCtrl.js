angular.module('starter')
    .controller('MapCtrl', function ($scope, $ionicPlatform, $state) {
        $ionicPlatform.ready(function () {
            var map = L.map('map', {
                center: [41.194292, -8.643424],
                minZoom: 5,
                zoom: 18
            });
            L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
                subdomains: ['otile4']
            }).addTo(map);

            map.addControl( new L.Control.Gps({autoActive:true}) );//inizialize control

            map.locate({setView: true, maxZoom: 20});
            map.on('dblclick', onMapClick);
            $scope.reloadRoute = function () {
                L.marker().update(map);
            };

            function onMapClick(e) {
                window.location = "#/form/" + e.latlng.lat + '/' + e.latlng.lng;
            }

            $scope.reloadRoute = function () {
                map.locate({setView: true, maxZoom: 20});
            };
        });
    });
