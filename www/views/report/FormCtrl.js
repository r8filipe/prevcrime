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
                        $scope.data.rua = $scope.stories.road;
                        $scope.data.rua += ' , ';
                        $scope.data.rua += $scope.stories.city_district;
                        $scope.data.rua += ' , ';
                        $scope.data.rua += $scope.stories.county;
                        $scope.data.rua += ' , ';
                        $scope.data.rua += $scope.stories.postcode;
                        $scope.data.rua += ' , ';
                        $scope.data.rua += $scope.stories.country;
                    });

                $scope.data.coordenadas = $stateParams.lat + ',' + $stateParams.lng;

            }

            $scope.takePhoto = function () {
                var options = {
                    quality: 50,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    correctOrientation: true,
                    saveToPhotoAlbum: true
                };
                $cordovaCamera.getPicture(options).then(function (imageFullPath) {
                    $scope.image = imageFullPath;
                    if ($scope.photo.length <= 3) {
                        $scope.photo.push('<img id="imageFile" src="' + imageFullPath + '" width="160px" height="auto"/>');
                    }

                    //var image = document.getElementById('imageFile');
                    //var placehere = document.getElementById('placehere');
                    //image.src = imageFullPath;
                    //
                    //var keyEl = angular.element('<img id="imageFile" src="' + imageFullPath + '" width="160px" height="auto"/>');
                    //placehere.append(keyEl);
                    ////$compile(keyEl)(scope);

                }, function (error) {
                    console.warn("PICTURE ERROR: " + angular.toJson(error));
                });
            };
            $scope.submit = function () {

                //$http.get('http://192.168.2.101:8000/webservice/report', {params: $scope.data}).then(function (success) {
                //    uploadFile($scope.photo);
                //    console.log("Success: " + angular.toJson(success));
                //}, function (error) {
                //    console.warn("Error: " + angular.toJson(error));
                //});
                $http({
                    method: 'get',
                    url: 'http://192.168.2.102/webservice/report',
                    params: $scope.data
                }).then(function successCallback(response) {
                    if (response.data.state != 'FAIL') {
                        $cordovaDialogs.alert('Foi reportado com sucesso a sua ocorrência', 'Ocorrência', 'OK')
                            .then(function () {
                                //uploadFile(imageFullPath);
                                //uploadFile(imageFullPath, response.data.id);
                            });
                    }

                }, function errorCallback(response) {
                    $cordovaDialogs.alert(response, 'Erro ao Reportar', 'OK')
                        .then(function () {

                        });
                    console.warn("Error: " + angular.toJson(response));
                });

            };
            function uploadFile(imageFullPath) {
                var options = {
                    fileKey: "image",
                    fileName: imageFullPath.substr(imageFullPath.lastIndexOf('/') + 1),
                    chunkedMode: false,
                    mimeType: "image/jpg"
                };

                $cordovaFileTransfer.upload("'http://fvinha.ddns.net:8000/webservice/imageupload/", imageFullPath, options).then(function (result) {
                    console.log(result);
                    deleteTemporaryImageFile(imageFullPath, options.fileName);
                }, function (error) {
                    console.log(error);
                });
            }

            function deleteTemporaryImageFile(filePath, FileName) {
                var path = filePath.substring(0, filePath.lastIndexOf("/") + 1);
                $cordovaFile.removeFile(path, FileName)
                    .then(function (success) {
                        console.log("TEMPORARY FILE DELETED: " + angular.toJson(success));
                    }, function (error) {
                        console.warn("deleteTemporaryImageFile error: " + angular.toJson(error));
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
                    $('#subcategoria')
                        .append($('<option>', {value: key})
                            .text(value));
                });
            };

        });
    });
