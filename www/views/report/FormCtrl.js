angular.module('starter')
    .controller('FormCtrl', function ($scope, $ionicPlatform, $cordovaFile,
                                      $cordovaCamera, $cordovaFileTransfer,
                                      $ionicPopup, $http, $stateParams,
                                      $cordovaNetwork, $cordovaDialogs) {
        $ionicPlatform.ready(function () {
            $scope.photo = [];
            $scope.image;
            $scope.data = {};
            if ($stateParams.lat != undefined) {

                $http.get('http://nominatim.openstreetmap.org/reverse?format=json&lat=' + $stateParams.lat + '&lon=' + $stateParams.lng + '&zoom=18&addressdetails=1')
                    .success(function (response) {
                        $scope.stories = angular.fromJson(response.address);
                        $scope.data.address = $scope.stories.road;
                        $scope.data.address += ' , ';
                        $scope.data.address += $scope.stories.city_district;
                        $scope.data.address += ' , ';
                        $scope.data.address += $scope.stories.county;
                        $scope.data.address += ' , ';
                        $scope.data.address += $scope.stories.postcode;
                        $scope.data.address += ' , ';
                        $scope.data.address += $scope.stories.country;
                    });

                $scope.data.coordenadas = $stateParams.lat + ',' + $stateParams.lng;

            }

            $scope.takePhoto = function () {
                var options = {
                    quality: 50,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    correctOrientation: true,
                    saveToPhotoAlbum: true,
                    targetWidth: 500,
                };
                $cordovaCamera.getPicture(options).then(function (imageFullPath) {
                    $scope.image = imageFullPath;
                    if ($scope.photo.length <= 3) {
                        $scope.photo.push('<img id="imageFile" src="' + imageFullPath + '" width="160px" height="auto"/>');
                    }


                }, function (error) {
                    console.warn("PICTURE ERROR: " + angular.toJson(error));
                });
            };
            $scope.submit = function () {

                $http({
                    method: 'get',
                    url: 'http://192.168.2.102:8080/prevcrime/webservice/report',
                    params: $scope.data
                }).then(function successCallback(response) {
                    if (response.data.status != 'FAIL') {
                        var id = response.data.event;
                        uploadFile($scope.image, response.data.event);

                    } else {
                        $cordovaDialogs.alert('Erro ao reportar', 'Ocorrência', 'OK')
                            .then(function () {
                            });
                    }

                }, function errorCallback(response) {
                    $cordovaDialogs.alert(response.data.message, 'Erro ao Reportar', 'OK')
                        .then(function () {
                        });
                });

            };

            function uploadFile(imageFullPath, id) {
                console.warn(imageFullPath);
                var options = {
                    fileKey: "image",
                    fileName: imageFullPath.substr(imageFullPath.lastIndexOf('/') + 1),
                    chunkedMode: false,
                    mimeType: "image/jpg"
                };

                $cordovaFileTransfer.upload("http://192.168.2.102:8080/prevcrime/webservice/image/" + id, imageFullPath, options)
                    .then(function (result) {
                        $cordovaDialogs.alert('Foi reportado com sucesso a sua ocorrência', 'Ocorrência', 'OK')
                            .then(function () {
                                deleteTemporaryImageFile(imageFullPath, options.fileName);
                            });

                        $scope.clean();
                        $scope.goTo("map");
                    }, function (error) {

                        $cordovaDialogs.alert('Foi encontrado um erro ao enviar imagem', 'Fotogafia', 'OK')
                            .then(function () {
                            });
                    });
            }

            function deleteTemporaryImageFile(filePath, FileName) {
                var path = filePath.substring(0, filePath.lastIndexOf("/") + 1);
                $cordovaFile.removeFile(path, FileName)
                    .then(function (success) {
                    }, function (error) {
                    });
            };

            $("#categoria").change(function () {

                var categorie = $('#categoria').find(":selected").val();
                console.log('alteracao categoria' + categorie);
                var acessibilidade = {
                    1: 'Estado dos arruamentos',
                    2: 'Estado dos passeios'
                };

                var ambiente = {
                    3: 'Lixo disperso',
                    4: 'Degradação habitaçional',
                    5: 'Degradação das áreas públicas comuns',
                    6: 'Sinais de Vandalismo/Vandalismo'
                };

                var vigilancia = {
                    7: 'Camaras de Vigilância',
                    8: 'Patrulhamento',
                    9: 'Transeuntes',
                    10: 'Residentes/Moradores'
                };

                var espaco = {
                    11: 'Delimitação de passagens pedonais',
                    12: 'Areas/ Espaços de confinamento',
                    13: 'Becos sem saída'
                };

                var visibilidade = {
                    14: 'Iluminacao',
                    15: 'Barreiras Fisicas',
                    16: 'Esquinas cegas',
                    17: 'Locais cegos',
                    18: 'Distribuicao de luminacao'
                };
                switch (categorie) {
                    case '1':
                        addElementsSubcategorie(acessibilidade);
                        break;
                    case '2':
                        addElementsSubcategorie(ambiente);
                        break;
                    case '3':
                        addElementsSubcategorie(vigilancia);
                        break;
                    case '4':
                        addElementsSubcategorie(espaco);
                        break;
                    case '5':
                        addElementsSubcategorie(visibilidade);
                        break;
                }
            });

            function addElementsSubcategorie(categorie) {

                $('#subcategoria')
                    .find('option')
                    .remove()
                    .end();

                $.each(categorie, function (key, value) {
                    $('#subcategoria ')
                        .append($('<option>', {value: key})
                            .text(value));
                    $('#subcategoria option:last-child').attr("selected", true);

                });
            };

        });
    });
