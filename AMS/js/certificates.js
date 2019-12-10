clearLocalStorageFilters();
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


    $.ajax({
        url: "../../ams_apis/slimTest/index.php/getAsset_for_CertNO",
        method: "POST",
        dataType: "JSON",
        data: '{"cert_no" :"' + cert_no + '"}',
        success: function (data) {
            document.getElementById("assetTbody").innerHTML = data.data;
            $("#movItemCount").text(data.rows);
            $("#loaderComm").hide();
        },
        error: function (err) {
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'getAsset_for_CertNO'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,
            });

        }
    });
}


if (localStorage.filter == "ALL EQUIPMENT") {

    localStorage.filter = "FACILITIES MANAGEMENT";

    populate_filters();

    $('#class-options').append(new Option("FACILITIES MANAGEMENT", "fac_equip"));

    if (localStorage.filter == "IT EQUIPMENT" || localStorage.role == "ADMIN") {
        $('#class-options').append(new Option("IT EQUIPMENT", "it_equip"));
    }

    $('#class-options').append(new Option("MEDICAL EQUIPMENT", "med_equip"));
    $('#class-options').prop('disabled', false);

    $('#class-options').on('change', function () {
        var filter = $("#class-options option:selected").text();
        toogleSub(filter);
        localStorage.filter = filter;
        //clear btn text

        //clear btn text
        resetBtn('#building_certificates_filter', "BUILDING");
        resetBtn('#level_certificates_filter', "LEVEL");
        resetBtn('#area_certificates_filter', "AREA");
        resetBtn('#room_certificates_filter', "ROOM");
        resetBtn('#sublocaction_certificates_filter', "SUB LOCATION");
        resetBtn('#certNo_certificates_filter', "CERTIFICATE NUMBER");
        //clear search inputs and local storage

        clearLocalStorageFilters();
        populate_filters();


        $('#currentAssetsTable').DataTable().clear().destroy();
        $('#searchView').show();
        $('#printCert').hide();

    });

} else {
    populate_filters();
    toogleSub(localStorage.filter);
    $('#class-options').append(new Option(localStorage.filter, "user_class"));
    $('#class-options').css({ "-moz-appearance": "none" });
    $('#class-options').prop('disabled', 'disabled');
}


function toogleSub(filter) {
    if (filter == "IT EQUIPMENT") {
        $('.filter_sub').show();
        $('#transfer_type').show();
    } else {
        $('.filter_sub').hide();
        $('#transfer_type').hide();
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

    var jsonData = '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","sub_location":"' + localStorage.sub_location + '","cert_no":"' + localStorage.certificate_number + '","asset_class":"' + localStorage.filter + '"}';

    console.log(jsonData);

    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        data: jsonData,
        success: function (data) {
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
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : #'" + id + "'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,
            });
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
    console.log(results);
    var current = "";
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

        var jsonData = '{"building" :"' + building + '","level" : "' + level + '","area" : "' + area + '","room_no" : "' + room_no + '","description" : "' + description + '","sub_location":"' + sub_location + '","cert_no":"' + certificate_number + '","asset_class":"' + localStorage.filter + '"}';

        console.log(jsonData)

        $.ajax({
            url: "../../ams_apis/slimTest/index.php/getCerts",
            type: "POST",
            dataType: 'json',
            data: jsonData,
            success: function (data) {
                $('#loader').fadeOut(500);

                var table = null;

                if (data.rows > 0) {

                    str = (JSON.parse(data.data));

                    table_data["currentAssetsTable"] = createTable("#currentAssetsTable", str.data);
                    $(" #currentAssetsTable .sorting_disabled input").prop("disabled", true); //Disable
                    $(" #currentAssetsTable .sorting_disabled input").css({ "display": "none" });


                }
                else {

                    table_data["currentAssetsTable"] = createTable("#currentAssetsTable", data.data);

                }

                $('#currentAssetsTable tbody,#currentAssetsTable thead').on('click', 'input[type="checkbox"]', function () {

                    if ($(this).prop("checked") == true) {
                        $('#currentAssetsTable tbody input[type=checkbox]').prop("checked", false);
                        $(this).prop("checked", true);
                        $('#printCert').fadeIn(500);

                    } else {
                        $('#printCert').fadeOut(500);
                    }

                });

                $('#currentAssetsTable tbody').on('click', 'button', function () {

                    var data = table_data["currentAssetsTable"].row($(this).parents('tr')).data();
                    viewAsset(data[0]);
                });

            },
            error: function (err) {
                $('#searchView').fadeIn(500);
                $('#loader').hide();
                swal.fire({
                    title: "Unexpected Error #42404",
                    text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'getCerts'",
                    type: "error",
                    showCloseButton: true,
                    confirmButtonColor: "#C12E2A",
                    allowOutsideClick: true,
                });
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
            return_type = "<p class='text-info'><strong>ADDITION</strong></p>"
            break;
        case "DISPOSED - 0":
            return_type = "<p class='text-danger'><strong>REMOVAL/SCRAP</strong></p>"
            break;
        case "DECOMM":
            return_type = "<p class='text-success'><strong>REMOVAL/SCRAP</strong></p>"
            break;
    }

    return return_type;
}

function checkTypeForCert(val) {
    var return_type = "";
    switch (val) {
        case "COMM":
            return_type = "ADDITION"
            break;
        case " - 1":
            return_type = "ADDITION"
            break;
        case "DISPOSED - 0":
            return_type = "REMOVAL/SCRAP"
            break;
        case "DECOMM":
            return_type = "REMOVAL/SCRAP"
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

function closeApp() {
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
    localStorage.clear();
    open("../index.html", '_self')
    window.location.replace("../index.html");
    window.close();
}



function clearData(input, btnDafualtId, text) {
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
    }
}


var onSearch = function (btn_id, searchValue, emptyId) {

    var getId = searchValue;

    var found = false;
    var rows = allArr[searchValue];

    document.getElementById(searchValue).onkeypress = function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();


            var value = searchValue.value;

            if (value.length > 0) {

                setValueBtn(btn_id, value);
                search();

            }
        }
    }

    searchValue = document.getElementById(searchValue);

    for (var i = 0; i < rows.length; i++) {

        var suitable = false;

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

    clusterize[getId].update(filterRows(rows));
}


function setValueBtn(id, value) {
    $('#' + id).text(value);
}
function setValueInput(id, value) {
    $('#' + id).val(value);
}

function setValueInputBtn(id_1, id_2, value) {
    setValueBtn(id_1, value);
    setValueInput(id_2, value);
}


function isSpecified(value) {
    if (value == null || value == undefined) {
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
        "ordering": false,
        "serverSide": true,
        "destroy": true,
        ajax: function (data, callback, settings) {
            var out = [];
            for (var i = data.start, ien = data.start + data.length; i < ien; i++) {
                if (tableData[i] == undefined) {
                    break;
                } else {
                    out.push(tableData[i]);

                }

            }

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
        }
    });

    $('#frm-example').off().on('submit', function (e) {

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
        console.log("AJAX");
        $.ajax({
            url: '../../ams_apis/slimTest/index.php/assetCert_print',
            method: 'post',
            data: '{"cert":"' + rows_selected[rows_selected.length - 1] + '"}',
            dataType: "JSON",
            success: function (data) {
                console.log("data");
                console.log(data);
                var assets = "";
                for (var i = 0; i < data.rows; i++) {
                    assets += "<tr>" +
                        "<td>" + data.data[i].ASSET_MODEL + "</td>" +
                        "<td>" + data.data[i].ASSET_DESCRIPTION + "</td>" +
                        "<td>" + data.data[i].ASSET_ID + "</td>" +
                        "<td>" + data.data[i].ASSET_PRIMARY_ID + "</td>" +
                        "<td>" + data.data[i].ASSET_CLASSIFICATION + "</td>" +
                        "<td>" + data.data[i].ASSET_ROOM_NO + "</td>" +
                        "<td>" + data.data[i].HD_ASSET_LOCATION + "</td>" +
                        "<td>" + data.data[i].ASSET_PURCHASE_DT.substr(0, 10) + "</td>" +
                        "<td>" + checkDesposal(data.data[i].ASSET_DISPOSAL_DT) + "</td>" +
                        "</tr>"
                }

                document.getElementById('cert_no_field').innerHTML = data.data[0].ASSET_CERTIFICATE_NO;
                document.getElementById('creation_date_field').innerHTML = data.data[0].ASSET_CERTIFICATE_CREATION_DATE;
                document.getElementById('equip_cart').innerHTML = data.data[0].ASSET_CLASS;
                document.getElementById('trans_type').innerHTML = checkTypeForCert(data.data[0].ASSET_CERTIFICATE_TYPE);

                document.getElementById('boq').value = (data.data[0].ASSET_BOQ_REFERENCE);
                document.getElementById('invoce_number').value = (data.data[0].ASSET_SP_INV_NO);
                document.getElementById('asset_reference').value = (data.data[0].ASSET_REFERENCE);

                document.getElementById('subItemCount').innerHTML = data.rows;
                document.getElementById('cert_assets_selected').innerHTML = assets;
                document.getElementById('overlay-printView').style.display = "block";
            },
            error: function (error) {
                console.log(error);
            }
        });
        // Remove added elements
        $('input[name="id\[\]"]', form).remove();

        // e.preventDefault();

    });


    return table;
}

function checkDesposal(value) {
    if (value == null || value == undefined) {
        value = "N/A";
    } else {
        value = value.substr(0, 10);
    }

    return value;
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

        if (e.keyCode == 13) {
            e.preventDefault();
            search();
        }
    }
}