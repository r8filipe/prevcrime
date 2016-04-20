angular.module('starter')
    .controller('FormCtrl', function ($scope, $ionicPlatform, $cordovaFile,
                                      $cordovaCamera, $cordovaFileTransfer,
                                      $ionicPopup, $http, $stateParams,
                                      $cordovaNetwork, $cordovaDialogs) {
        $ionicPlatform.ready(function () {
            $scope.photo = [];
            $scope.image = [];
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

                    if ($scope.photo.length <= 3) {
                        $scope.image.push(imageFullPath);
                        $scope.photo.push('<img id="imageFile" src="' + imageFullPath + '" width="160px" height="auto"/>');
                    }


                }, function (error) {
                    console.warn("PICTURE ERROR: " + angular.toJson(error));
                });
            };
            $scope.submit = function () {

                if ($scope.data.event == 0 || $scope.data.length <= 4 || $scope.photo.length == 0) {
                    $cordovaDialogs.alert('Campos não preenchidos', 'Formulário', 'OK')
                        .then(function () {
                            return;
                        });

                } else {
                    $http({
                        method: 'get',
                        url: 'http://prevcrimeapp.ufp.pt/webservice/report',
                        params: $scope.data
                    }).then(function successCallback(response) {
                        if (response.data.status != 'FAIL') {
                            var id = response.data.event;

                            //uploadFile($scope.image, response.data.event);
                            angular.forEach($scope.image, function (value) {
                                uploadFile(value, response.data.event);
                            });
                            $cordovaDialogs.alert('Foi reportado com sucesso a sua ocorrência', 'Ocorrência', 'OK')
                                .then(function () {
                                    window.location = "#/map/";
                                });

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
                }
            };

            function uploadFile(imageFullPath, id) {
                console.warn(imageFullPath);
                var options = {
                    fileKey: "image",
                    fileName: imageFullPath.substr(imageFullPath.lastIndexOf('/') + 1),
                    chunkedMode: false,
                    mimeType: "image/jpg"
                };

                $cordovaFileTransfer.upload("http://prevcrimeapp.ufp.pt/webservice/image/" + id, imageFullPath, options)
                    .then(function (result) {
                        deleteTemporaryImageFile(imageFullPath, options.fileName);

                    }, function (error) {

                        $cordovaDialogs.alert("Erro ao enviar imagem", 'Fotogafia', 'OK')
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
                $('#subcategoria ')
                    .append($('<option>', {value: 0})
                        .text(''));

                $.each(categorie, function (key, value) {
                    $('#subcategoria ')
                        .append($('<option>', {value: key})
                            .text(value));
                    //$('#subcategoria option:first-child').attr("selected", true);
                });

            };

        });
    });
