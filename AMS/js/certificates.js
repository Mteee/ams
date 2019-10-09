
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
            resetBtn('#assetNo_certificates_filter', "CERTIFICATE NUMBER");

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
    getFilters('../../ams_apis/slimTest/index.php/certificate_number_cert', 'search_certificates_certNo', 'scroll_certificates_certNo', 'menu_certificates_certNo', 'empty_certificates_certNo');
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
        data: '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","sub_location":"' + localStorage.sub_location + '","certificate_number":"' + localStorage.certificate_number + '","asset_class":"' + localStorage.filter + '"}',
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

function resetBtn(resetId, resetTxt) {
    $(resetId).text(resetTxt);
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
    resetBtn('#assetNo_certificates_filter', "CERTIFICATE NUMBER");

    //description
    $('#certificates_description').val("");

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
            resetBtn('#assetNo_certificates_filter', "CERTIFICATE NUMBER");

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
            resetBtn('#assetNo_certificates_filter', "CERTIFICATE NUMBER");

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
            resetBtn('#assetNo_certificates_filter', "CERTIFICATE NUMBER");

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
            resetBtn('#assetNo_certificates_filter', "CERTIFICATE NUMBER");

            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.certificate_number = '';

            $('#search_certificates_room').val("");
            $('#search_certificates_sublocaction').val("");
            $('#search_certificates_certNo').val("");
            break;
        case "search_certificates_sublocaction":
            res = { "btnId": "sublocaction_addition_filter", "btnContent": "SUB LOCATION" };

            //clear btn text
            resetBtn('#sublocaction_certificates_filter', "SUB LOCATION");
            resetBtn('#assetNo_certificates_filter', "CERTIFICATE NUMBER");

            localStorage.sub_location = '';
            localStorage.certificate_number = '';

            $('#search_certificates_sublocaction').val("");
            $('#search_certificates_certNo').val("");
            break;
        case "search_certificates_certNo":
            res = { "btnId": "assetNo_certificates_filter", "btnContent": "CERTIFICATE NUMBER" };

             //clear btn text
             resetBtn('#assetNo_certificates_filter', "CERTIFICATE NUMBER");
 
             localStorage.certificate_number = '';
 
             $('#search_certificates_certNo').val("");
            break;
        default:
            res = { "btnId": "not found", "btnContent": "not found" };
            break;
    }

    return res;
}

