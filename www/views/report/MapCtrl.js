angular.module('starter')
    .controller('MapCtrl', function ($scope, $ionicPlatform, $state) {
        $ionicPlatform.ready(function () {
            var map = L.map('map', {
                center: [41.194292, -8.643424],
                minZoom: 0,
                zoom: 16
            });
            map.setView([41.106389848835605, -7.042064666748047], 15); //ratlam
            L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
                subdomains: ['otile4']
            }).addTo(map);

            map.locate({setView: true, maxZoom: 20});

            var popup = L.popup();
            var marker = L.marker([51.5, -0.09]).addTo(map);

            function onMapClick(e) {
                popup
                    .setLatLng(e.latlng)
                    .openOn(map);
                window.location = "#/form/" + e.latlng.lat + '/' + e.latlng.lng;
            }

            map.on('dblclick', onMapClick);

            $scope.reloadRoute = function () {
                map.locate({setView: true, maxZoom: 20});
            };
        });
    });
