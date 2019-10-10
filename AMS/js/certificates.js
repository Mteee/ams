clearLocalStorageFilters();
populate_filters();
checkClass();
setUsername();
checkFilter();

window.onload = function () {
    if (localStorage.building !== '' || localStorage.level !== '' || localStorage.area !== '' || localStorage.room_no !== '' || localStorage.certificate_number !== '' || localStorage.sub_location !== '') {
        localStorage.building = '';
        localStorage.level = '';
        localStorage.area = '';
        localStorage.room_no = '';
        localStorage.sub_location = '';
        localStorage.certificate_number = '';
        populate_filters();
    }
}

function viewAsset(cert_no) {
    var currentItem = "";
    document.getElementById('overlay-comm').style.display = "block";
    // console.log($('#assetBody'));
    // $('#assetBody')['0'].innerHTML = cert_no;

    console.log("eye-icon");
    console.log('{"cert_no" :"' + cert_no + '"}');

    $.ajax({
        url: "../../ams_apis//slimTest/index.php/getAsset_for_CertNO",
        method: "POST",
        dataType: "JSON",
        data: '{"cert_no" :"' + cert_no + '"}',
        success: function (data) {
            // console.log("success");
            document.getElementById("assetTbody").innerHTML = data.data;
            $("#movItemCount").text(data.rows);
            $("#loaderComm").hide();
        },
        error: function (err) {
            console.log(err);
            // console.log("error");

        }
    });
}



function checkClass() {
    if (localStorage.filter == "ALL EQUIPMENT") {
        console.log(localStorage.filter);
        $('#class-options').append(new Option("FACILITIES MANAGEMENT", "fac_equip"));
        $('#class-options').append(new Option("IT EQUIPMENT", "it_equip"));
        $('#class-options').append(new Option("MEDICAL EQUIPMENT", "med_equip"));
        $('#class-options').prop('disabled', false);

        $('#class-options').on('change', function () {
            var filter = $("#class-options option:selected").text();
            localStorage.filter = filter;
            clearLocalStorageFilters();
            populate_filters();

            if (filter == "IT EQUIPMENT") {
                $('.filter_sub').show();
            } else {
                $('.filter_sub').hide();
            }

            //clear btn text
            resetBtn('#building_certificates_filter', "BUILDING");
            resetBtn('#level_certificates_filter', "LEVEL");
            resetBtn('#area_certificates_filter', "AREA");
            resetBtn('#room_certificates_filter', "ROOM");
            resetBtn('#sublocaction_certificates_filter', "SUB LOCATION");
            resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");

        });

    } else {
        $('#class-options').append(new Option(localStorage.filter, "user_class"));
        $('#class-options').css({ "-moz-appearance": "none" });
        $('#class-options').prop('disabled', 'disabled');
    }
}

function setUsername() {
    $('#username').text(localStorage.username);
}

function checkFilter() {
    if (localStorage.backupFilter == undefined || localStorage.backupFilter == "undefined") {
        localStorage.backupFilter = localStorage.filter;
    } else {
        localStorage.filter = localStorage.backupFilter;
    }
}

function populate_filters() {
    // building 
    getFilters('../../ams_apis/slimTest/index.php/building_cert', 'search_certificates_building', 'scroll_certificates_building', 'menu_certificates_building', 'empty_certificates_building');
    // level
    getFilters('../../ams_apis/slimTest/index.php/level_cert', 'search_certificates_level', 'scroll_certificates_level', 'menu_certificates_level', 'empty_certificates_level');
    //Area
    getFilters('../../ams_apis/slimTest/index.php/area_cert', 'search_certificates_area', 'scroll_certificates_area', 'meun_certificates_area', 'empty_certificates_area');
    //Room
    getFilters('../../ams_apis/slimTest/index.php/room_no_cert', 'search_certificates_room', 'scroll_certificates_room', 'menu_certificates_room', 'empty_certificates_room');
    //sub location
    getFilters('../../ams_apis/slimTest/index.php/sub_location_cert', 'search_certificates_sublocaction', 'scroll_certificates_sublocaction', 'menu_certificates_sublocaction', 'empty_certificates_sublocaction');
    //certifiacte number 
    getFilters('../../ams_apis/slimTest/index.php/cert_no_cert', 'search_certificates_certNo', 'scroll_certificates_certNo', 'menu_certificates_certNo', 'empty_certificates_certNo');
}

var allArr = {
    search_certificates_building: [],
    search_certificates_level: [],
    search_certificates_area: [],
    search_certificates_room: [],
    search_certificates_sublocaction: [],
    search_certificates_certNo: []
};

function getFilters(url, id, scrollArea, menuid) {

    console.log('{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","sub_location":"' + localStorage.sub_location + '","certificate_number":"' + localStorage.certificate_number + '","asset_class":"' + localStorage.filter + '"}');

    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        data: '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","sub_location":"' + localStorage.sub_location + '","cert_no":"' + localStorage.certificate_number + '","asset_class":"' + localStorage.filter + '"}',
        success: function (data) {
            console.log(data);
            var rows = [];
            var searchValue = document.getElementById(id);

            for (var i = 0; i < data.rows; i++) {
                rows.push({
                    values: [data.data[i]],
                    markup: '<input type="button" style="border-bottom:1px solid #ecebeb" class="dropdown-item form-control" type="button" value="' + data.data[i] + '"/>',
                    active: true
                });
            }

            allArr[id] = rows;

            filterItems(rows, id, scrollArea, menuid);

        },
        error: function (data_err) {
            console.log(data_err);
            console.log("Error");
            console.log(localStorage.filter);
        }
    });

}

var clusterize = {
    search_certificates_building: [],
    search_certificates_level: [],
    search_certificates_area: [],
    search_certificates_room: [],
    search_certificates_sublocaction: [],
    search_certificates_certNo: []
};
var count = 0;

var filterRows = function (rows) {
    var results = [];
    for (var i = 0, ii = rows.length; i < ii; i++) {
        if (rows[i].active) results.push(rows[i].markup)
    }

    return results;
}

function filterItems(rows, value, scrollArea, menuid) {
    clusterize[value] = (new Clusterize({
        rows: filterRows(rows),
        scrollId: scrollArea,
        contentId: menuid
    }));
}

function clearLocalStorageFilters() {

    localStorage.building = '';
    localStorage.level = '';
    localStorage.area = '';
    localStorage.room_no = '';
    localStorage.sub_location = '';
    localStorage.certificate_number = '';

    $('#search_certificates_building').val("");
    $('#search_certificates_level').val("");
    $('#search_certificates_area').val("");
    $('#search_certificates_room').val("");
    $('#search_certificates_sublocaction').val("");
    $('#search_certificates_certNo').val("");
}

var table_data = { currentAssetsTable: [] };

function search() {

    var building = document.getElementById('search_certificates_building').value,
        level = document.getElementById('search_certificates_level').value,
        area = document.getElementById('search_certificates_area').value,
        room_no = document.getElementById('search_certificates_room').value;
    sub_location = document.getElementById('search_certificates_sublocaction').value;
    certificate_number = document.getElementById('search_certificates_certNo').value;
    description = document.getElementById('certificates_description').value;



    var results = (building + " - " + level + " - " + area + " - " + room_no + " - " + description + " - " + sub_location + " - " + certificate_number);
    var current = "";
    // console.log(results);
    if (" -  -  -  -  -  - " == results) {
        swal.fire({
            title: "Oooops!",
            text: 'please select at least one filter',
            type: 'error',
            showCloseButton: true,
            closeButtonColor: '#3DB3D7',
            animation: false,
            customClass: {
                popup: 'animated tada'
            },
            allowOutsideClick: true,
        })
    } else {

        $('#searchView').hide();
        $('#loader').fadeIn(500);
        document.getElementById('current').innerHTML = "";

        console.log('{"building" :"' + building + '","level" : "' + level + '","area" : "' + area + '","room_no" : "' + room_no + '","description" : "' + description + '","asset_sub_location":"' + sub_location + '","certificate_number":"' + certificate_number + '","asset_class":"' + localStorage.filter + '"}');

        $.ajax({
            url: "../../ams_apis/slimTest/index.php/getCerts",
            type: "POST",
            dataType: 'json',
            data: '{"building" :"' + building + '","level" : "' + level + '","area" : "' + area + '","room_no" : "' + room_no + '","description" : "' + description + '","sub_location":"' + sub_location + '","cert_no":"' + certificate_number + '","asset_class":"' + localStorage.filter + '"}',
            success: function (data) {
                $('#loader').fadeOut(500);

                console.log("======================data===============================");
                console.log(data);
                var table = null;
                console.log("================test===============================");
                // console.log(data);
                // console.log(data.data.ASSET_CERTIFICATE_STATUS);


                if (data.rows > 0) {

                    var str = '{"data" : [';
                    for (var k = 0; k < data.rows; k++) {
                        console.log(data.data[k].ASSET_CERTIFICATE_STATUS);
                        if ((data.rows - 1) == k) {
                            str += '["' + data.data[k].ASSET_CERT_NO + '","';
                            str += data.data[k].ASSET_CERT_NO + '","';
                            str += data.data[k].ASSET_CLASS + '","';
                            str += checkType(data.data[k].ASSET_CERTIFICATE_TYPE) + '","';
                            str += data.data[k].ASSET_CERTIFICATE_CREATION_DATE + '","';
                            str += isSpecified(data.data[k].ASSET_CERTIFICATE_PRINT_DATE) + '","';
                            str += updateLetterToIcon(data.data[k].ASSET_CERTIFICATE_STATUS) + '"]';
                        } else {

                            str += '["' + data.data[k].ASSET_CERT_NO + '","';
                            str += data.data[k].ASSET_CERT_NO + '","';

                            str += data.data[k].ASSET_CLASS + '","';
                            str += checkType(data.data[k].ASSET_CERTIFICATE_TYPE) + '","';
                            str += data.data[k].ASSET_CERTIFICATE_CREATION_DATE + '","';
                            str += isSpecified(data.data[k].ASSET_CERTIFICATE_PRINT_DATE) + '","';
                            str += updateLetterToIcon(data.data[k].ASSET_CERTIFICATE_STATUS) + '"],';
                        }
                    }

                    str += ']}';

                    console.log(str);

                    str = replaceAll("\n", "", str);
                    // str = replaceAll("'", "^", str);

                    console.log(str);

                    str = (JSON.parse(str));
                    // console.log(str.data);

                    table_data["currentAssetsTable"] = createTable("#currentAssetsTable", str.data);
                    $(" #currentAssetsTable .sorting_disabled input").prop("disabled", true); //Disable
                    $(" #currentAssetsTable .sorting_disabled input").css({ "display": "none" });

                    // table.clear().draw();


                }
                else {
                    // current += '<tr id="nodata" class="text-center"><th scope="row" colspan="6"><h1 class="text-muted">No data</h1></th></tr>';
                    // $('#searchView').fadeIn(500);
                    // console.log(data.data);

                    table_data["currentAssetsTable"] = createTable("#currentAssetsTable", data.data);

                }

                $('#currentAssetsTable tbody,#currentAssetsTable thead').on('click', 'input[type="checkbox"]', function () {
                    // var data = table.row($(this).parents('tr')).data();
                    // setTimeout(function () {
                    //     console.log(checkboxSelectedLength());
                    //     if (checkboxSelectedLength() > 0) {
                    //         $('#printCert').fadeIn(500);
                    //     } else {
                    //         $('#printCert').fadeIn(500);
                    //     }
                    // }, 500);


                    if ($(this).prop("checked") == true) {
                        $('#currentAssetsTable tbody input[type=checkbox]').prop("checked", false);
                        $(this).prop("checked", true);
                        console.log("test1");
                        $('#printCert').fadeIn(500);

                        // asset_link.al_no = dataInfo[0];
                    } else {
                        $('#printCert').fadeOut(500);


                        // $('#printCert').slideToggle('fast');

                        // asset_link.al_no = null;
                    }


                    // if(data == null || data == undefined){
                    //     data = (localStorage.b).split(',');
                    // console.log("---------------localStorage---------------");
                    // console.log(data);
                    // console.log("---------------data---------------");
                    // }else{
                    //     localStorage.b = data;
                    //     console.log("---------------Default---------------");
                    //     console.log(data);
                    //     console.log("---------------data---------------");
                    // }

                    // alert(data[0] + "'s salary is: " + data[4]);
                });

                $('#currentAssetsTable tbody').on('click', 'button', function () {

                    var data = table_data["currentAssetsTable"].row($(this).parents('tr')).data();
                    console.log(data);
                    viewAsset(data[0]);
                });
                // $('#printAssetsView').fadeIn(500);

            },
            error: function (err) {
                console.log(err)
                $('#searchView').fadeIn(500);
                $('#loader').hide();
                alert('Ooops');
            }
        });
    }
}


function resetBtn(resetId, resetTxt) {
    $(resetId).text(resetTxt);
}

function checkType(val) {
    var return_type = "";
    switch (val) {
        case "COMM":
            return_type = "<p class='text-success'><strong>ADDITION</strong></p>"
            break;
        case " - 1":
            return_type = "<p class='text-info'><strong>UNASSIGNED</strong></p>"
            break;
        case "DISPOSED - 0":
            return_type = "<p class='text-danger'><strong>REMOVAL/SCRAP</strong></p>"
            break;
        case "":
            break;
    }

    return return_type;
}

function clearAllFilters() {

    clearLocalStorageFilters();

    populate_filters();

    //clear btn text
    resetBtn('#building_certificates_filter', "BUILDING");
    resetBtn('#level_certificates_filter', "LEVEL");
    resetBtn('#area_certificates_filter', "AREA");
    resetBtn('#room_certificates_filter', "ROOM");
    resetBtn('#sublocaction_certificates_filter', "SUB LOCATION");
    resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");

    //description
    $('#certificates_description').val("");

}

function closeApp(){
    swal.fire({
        title: "Exit Application",
        text: "Are you sure you want to exit?",
        type: "question",
        showCloseButton: true,
        confirmButtonColor: "#C12E2A",
        allowOutsideClick: true,
        animation: false,
        customClass: {
            popup: 'animated tada'
        }

    }).then(function (result) {
        if (result.value) {
            closeMe();
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {

        }
    })
}

function closeMe() {
    // reset 
    localStorage.building = '';
    localStorage.area = '';
    localStorage.level = '';
    localStorage.room_no = '';
    localStorage.sub_location = '';

    open("../index.html", '_self')
    window.location.replace("../index.html");
    window.close();
}



function clearData(input, btnDafualtId, text) {
    // var inputData = document.getElementById(input).(val);
    var value = $(input).val();

    if (value.length > 0) {

        if (input == "#search_certificates_building") {
            document.getElementById('menu_certificates_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_certificates_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_certificates_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_certificates_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_certificates_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_certificates_certNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            resetBtn('#building_certificates_filter', "BUILDING");
            resetBtn('#level_certificates_filter', "LEVEL");
            resetBtn('#area_certificates_filter', "AREA");
            resetBtn('#room_certificates_filter', "ROOM");
            resetBtn('#sublocaction_certificates_filter', "SUB LOCATION");
            resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");

            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.certificate_number = '';

            $('#search_certificates_building').val("");
            $('#search_certificates_level').val("");
            $('#search_certificates_area').val("");
            $('#search_certificates_room').val("");
            $('#search_certificates_sublocaction').val("");
            $('#search_certificates_certNo').val("");

            populate_filters();


        } else if (input == "#search_certificates_level") {

            document.getElementById('menu_certificates_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_certificates_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_certificates_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_certificates_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_certificates_certNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            resetBtn('#level_certificates_filter', "LEVEL");
            resetBtn('#area_certificates_filter', "AREA");
            resetBtn('#room_certificates_filter', "ROOM");
            resetBtn('#sublocaction_certificates_filter', "SUB LOCATION");
            resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");

            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.certificate_number = '';

            $('#search_certificates_level').val("");
            $('#search_certificates_area').val("");
            $('#search_certificates_room').val("");
            $('#search_certificates_sublocaction').val("");
            $('#search_certificates_certNo').val("");

            populate_filters();

        } else if (input == "#search_certificates_area") {

            document.getElementById('meun_certificates_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_certificates_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_certificates_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_certificates_certNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            resetBtn('#area_certificates_filter', "AREA");
            resetBtn('#room_certificates_filter', "ROOM");
            resetBtn('#sublocaction_certificates_filter', "SUB LOCATION");
            resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");

            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.certificate_number = '';

            $('#search_certificates_area').val("");
            $('#search_certificates_room').val("");
            $('#search_certificates_sublocaction').val("");
            $('#search_certificates_certNo').val("");

            populate_filters();

        }
        else if (input == "#search_certificates_room") {

            document.getElementById('menu_certificates_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_certificates_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_certificates_certNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            resetBtn('#room_certificates_filter', "ROOM");
            resetBtn('#sublocaction_certificates_filter', "SUB LOCATION");
            resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");

            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.certificate_number = '';

            $('#search_certificates_room').val("");
            $('#search_certificates_sublocaction').val("");
            $('#search_certificates_certNo').val("");

            populate_filters();

        }
        else if (input == "#search_certificates_sublocaction") {

            document.getElementById('menu_certificates_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_certificates_certNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            resetBtn('#sublocaction_certificates_filter', "SUB LOCATION");
            resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");

            localStorage.sub_location = '';
            localStorage.certificate_number = '';

            $('#search_certificates_sublocaction').val("");
            $('#search_certificates_certNo').val("");

            populate_filters();

        }
        else if (input == "#search_certificates_certNo") {

            document.getElementById('menu_certificates_certNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");

            localStorage.certificate_number = '';

            $('#search_certificates_certNo').val("");

            populate_filters();

        }
        // else if (input == "#search_new_room") {

        //     document.getElementById('menu_new_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

        //     getRoom();

        //     $('#search_new_room').val("");
        //     $('#room_new_filter').text("ROOM");

        // }


        // if (btnDafualtId == "#dropdown_approve_room") {
        //     populate_room();
        //     $(input).val("");
        //     $(btnDafualtId).text(text);
        // }
    }
}


var onSearch = function (searchValue, emptyId) {

    var getId = searchValue;

    var found = false;
    // console.log(localStorage.getItem("rows"));

    // var rows = JSON.parse(localStorage.getItem(searchValue));
    var rows = allArr[searchValue];

    document.getElementById(searchValue).onkeypress = function (e) {
        console.log(e.keyCode);
        if (e.keyCode == 13) {
            e.preventDefault();
            search();
        }
    }

    searchValue = document.getElementById(searchValue);

    for (var i = 0; i < rows.length; i++) {

        var suitable = false;

        // console.log(rows[i].values[0].toString().indexOf(searchasset.value) + 1);

        if (rows[i].values[0].toString().indexOf((searchValue.value).toUpperCase()) + 1) {
            suitable = true;
            found = true;
        }

        rows[i].active = suitable;
    }


    if (searchValue.value.length == 0) {
        var resObj = checkBackspace(getId);
        populate_filters();
        $('#' + resObj.btnId).text(resObj.btnContent);
    }

    if (found) {
        $(emptyId).css("display", "none");
    } else {
        $(emptyId).css("display", "block");
    }

    // console.log(clusterize[getId]);

    clusterize[getId].update(filterRows(rows));
}

function isSpecified(value) {
    if (value == null) {
        return "NEVER";
    }
    return value;
}

function checkBackspace(key) {
    var res = {};

    switch (key) {
        case "search_certificates_building":
            res = { "btnId": "search_certificates_building", "btnContent": "BUILDING" };

            //clear btn text
            resetBtn('#building_certificates_filter', "BUILDING");
            resetBtn('#level_certificates_filter', "LEVEL");
            resetBtn('#area_certificates_filter', "AREA");
            resetBtn('#room_certificates_filter', "ROOM");
            resetBtn('#sublocaction_certificates_filter', "SUB LOCATION");
            resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");

            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.certificate_number = '';

            $('#search_certificates_building').val("");
            $('#search_certificates_level').val("");
            $('#search_certificates_area').val("");
            $('#search_certificates_room').val("");
            $('#search_certificates_sublocaction').val("");
            $('#search_certificates_certNo').val("");

            break;
        case "search_certificates_level":
            res = { "btnId": "level_certificates_filter", "btnContent": "LEVEL" };

            //clear btn text
            resetBtn('#level_certificates_filter', "LEVEL");
            resetBtn('#area_certificates_filter', "AREA");
            resetBtn('#room_certificates_filter', "ROOM");
            resetBtn('#sublocaction_certificates_filter', "SUB LOCATION");
            resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");

            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.certificate_number = '';

            $('#search_certificates_level').val("");
            $('#search_certificates_area').val("");
            $('#search_certificates_room').val("");
            $('#search_certificates_sublocaction').val("");
            $('#search_certificates_certNo').val("");
            break;
        case "search_certificates_area":
            res = { "btnId": "area_certificates_filter", "btnContent": "AREA" };

            //clear btn text
            resetBtn('#area_certificates_filter', "AREA");
            resetBtn('#room_certificates_filter', "ROOM");
            resetBtn('#sublocaction_certificates_filter', "SUB LOCATION");
            resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");

            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.certificate_number = '';

            $('#search_certificates_area').val("");
            $('#search_certificates_room').val("");
            $('#search_certificates_sublocaction').val("");
            $('#search_certificates_certNo').val("");
            break;
        case "search_certificates_room":
            res = { "btnId": "room_certificates_filter", "btnContent": "ROOM" };

            //clear btn text
            resetBtn('#room_certificates_filter', "ROOM");
            resetBtn('#sublocaction_certificates_filter', "SUB LOCATION");
            resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");

            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.certificate_number = '';

            $('#search_certificates_room').val("");
            $('#search_certificates_sublocaction').val("");
            $('#search_certificates_certNo').val("");
            break;
        case "search_certificates_sublocaction":
            res = { "btnId": "sublocaction_certificates_filter", "btnContent": "SUB LOCATION" };

            //clear btn text
            resetBtn('#sublocaction_certificates_filter', "SUB LOCATION");
            resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");

            localStorage.sub_location = '';
            localStorage.certificate_number = '';

            $('#search_certificates_sublocaction').val("");
            $('#search_certificates_certNo').val("");
            break;
        case "search_certificates_certNo":
            res = { "btnId": "certNo_certificates_filter", "btnContent": "CERTIFICATE NUMBER" };

            //clear btn text
            resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");

            localStorage.certificate_number = '';

            $('#search_certificates_certNo').val("");
            break;
        default:
            res = { "btnId": "not found", "btnContent": "not found" };
            break;
    }

    return res;
}


// Building
$('#menu_certificates_building').on('click', '.dropdown-item', function () {
    $('#building_certificates_filter').text($(this)[0].value);
    localStorage.building = $(this)[0].value;
    populate_filters();
    $("#building_certificates_filter").dropdown('toggle');
    $('#search_certificates_building').val($(this)[0].value);
});

// level
$('#menu_certificates_level').on('click', '.dropdown-item', function () {
    $('#level_certificates_filter').text($(this)[0].value);
    localStorage.level = $(this)[0].value;
    populate_filters();
    $("#level_certificates_filter").dropdown('toggle');
    $('#search_certificates_level').val($(this)[0].value);
});

// area
$('#meun_certificates_area').on('click', '.dropdown-item', function () {
    $('#area_certificates_filter').text($(this)[0].value);
    localStorage.area = $(this)[0].value;
    populate_filters();
    $("#area_certificates_filter").dropdown('toggle');
    $('#search_certificates_area').val($(this)[0].value);
});

// room
$('#menu_certificates_room').on('click', '.dropdown-item', function () {
    $('#room_certificates_filter').text($(this)[0].value);
    localStorage.room_no = $(this)[0].value;
    populate_filters();
    $("#room_certificates_filter").dropdown('toggle');
    $('#search_certificates_room').val($(this)[0].value);
});

// sub_location
$('#menu_certificates_sublocaction').on('click', '.dropdown-item', function () {
    $('#sublocaction_certificates_filter').text($(this)[0].value);
    localStorage.sub_location = $(this)[0].value;
    populate_filters();
    $("#sublocaction_certificates_filter").dropdown('toggle');
    $('#search_certificates_sublocaction').val($(this)[0].value);
});

// asset_no
$('#menu_certificates_certNo').on('click', '.dropdown-item', function () {
    $('#certNo_certificates_filter').text($(this)[0].value);
    localStorage.certificate_number = $(this)[0].value;
    populate_filters();
    $("#certNo_certificates_filter").dropdown('toggle');
    $('#search_certificates_certNo').val($(this)[0].value);
});

//updating y to icons
function updateLetterToIcon(letter) {
    var results = "";

    switch (letter) {
        case "1":
            results = "<p class='text-success'><strong>ACTIVE</strong></p>";
            break;
        case "0":
            results = "<p class='text-danger'><strong>INACTIVE</strong></p>";
            break;
    }

    return results;
}//close updateLetterToIcon function


function createTable(tableID, tableData) {
    var table = $(tableID).DataTable({
        "paging": true,
        "processing": true,
        "searching": false,
        // "ordering": true,
        "ordering": false,
        "serverSide": true,
        "destroy": true,
        ajax: function (data, callback, settings) {
            var out = [];
            // console.log("=======================");
            // console.log(data);
            // console.log("=======================");
            for (var i = data.start, ien = data.start + data.length; i < ien; i++) {
                if (tableData[i] == undefined) {
                    break;
                } else {
                    out.push(tableData[i]);

                }

            }

            // console.log("=========out=========");
            // console.log(out);
            // console.log("========out==========");
            setTimeout(function () {
                callback({
                    draw: data.draw,
                    data: out,
                    recordsTotal: tableData.length,
                    recordsFiltered: tableData.length
                });
            }, 50);
        },
        "columnDefs": [
            // {
            //     "targets": 0,
            //     "data": tableData,
            //     "orderable": false,
            //     "defaultContent": "<input class='checkitem' type='checkbox' value=''/>"
            // },
            {
                'targets': 0,
                'checkboxes': {
                    'selectRow': true,
                    'value': tableData[0]
                }
            },
            {
                "targets": -1,
                "data": null,
                "orderable": false,
                "defaultContent": "<button type='button' class='btn btn-primary'><span class='fa fa-eye'></span></button>"
            },
            {
                "className": "dt-center",
                "targets": [-2, 0]
            },
            {
                "targets": -2,
                "orderable": false
            }
        ], 'select': {
            'style': 'multi'
        },
        fnCreatedRow: function (nTd, nRow, aData, iDataIndex) {

            $(nRow).attr('id', aData[0]);
            // console.log($(nTd).children()[0].children);
        }
    });

    $('#frm-example').on('submit', function (e) {

        console.log("click");
        // Prevent actual form submission
        e.preventDefault();
        var rows_selected = table.column(0).checkboxes.selected();

        var form = $('#frm-example');

        // Iterate over all selected checkboxes
        $.each(rows_selected, function (index, rowId) {
            // Create a hidden element 
            $(form).append(
                $('<input>')
                    .attr('type', 'hidden')
                    .attr('name', 'id[]')
                    .val(rowId)
            );
        });

        var rowsSelected = rows_selected.join(",").split(",");

        // viewCommAssets(rowsSelected);
        // Remove added elements
        $('input[name="id\[\]"]', form).remove();

        // e.preventDefault();

    });


    return table;
}

function replaceAll(find, replace, str) {
    while (str.indexOf(find) > -1) {
        str = str.replace(find, replace);
    }
    return str;
}


function closeAsset(id) {
    document.getElementById(id).style.display = "none"
}

function checkboxSelectedLength() {
    var lengthh = $(":checkbox:checked").length;
    return lengthh;
}

var onSearch_new = function (searchValue) {
    document.getElementById(searchValue).onkeypress = function (e) {

        console.log(e.keyCode);
        if (e.keyCode == 13) {
            e.preventDefault();
            search();
        }
    }
}