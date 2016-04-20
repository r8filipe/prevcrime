angular.module('starter')
    .controller('MapCtrl', function ($scope, $ionicPlatform, $state) {
        $ionicPlatform.ready(function () {
            var map = L.map('map', {
                center: [41.194292, -8.643424],
                minZoom: 0,
                zoom: 18
            });
            L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
                subdomains: ['otile4']
            }).addTo(map);

            map.locate({setView: true, maxZoom: 20});


            function onLocationFound(e) {
                var radius = e.accuracy / 2;
                L.marker(e.latlng).addTo(map);
                L.circle(e.latlng, radius).addTo(map);
            }

            map.on('locationfound', onLocationFound);

            function onLocationError(e) {
                alert(e.message);
            }

            L.marker().update(map);
            map.on('locationerror', onLocationError);
            map.on('dblclick', onMapClick);
            //L.marker([41.194292, -8.643424]).addTo(map);
            $scope.reloadRoute = function () {
                L.marker().update(map);
            };

            function onMapClick(e) {
                window.location = "#/form/" + e.latlng.lat + '/' + e.latlng.lng;
            }
        });
    });
