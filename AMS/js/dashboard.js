
clearLocalStorageFilters();
$(function () {

    var start = moment().subtract(10, 'days');
    var end = moment();

    function cb(start, end) {

        localStorage.dateStart = start.format('YYYY/MM/DD');
        localStorage.dateEnd = end.format('YYYY/MM/DD');

        $('#reportrange span').html(start.format('D MMMM, YYYY') + ' - ' + end.format('D MMMM, YYYY'));
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    $('#reportrange span').html("select date");
    // cb(start, end);
});

window.onload = function () {
    if (localStorage.building !== '' || localStorage.level !== '' || localStorage.area !== '' || localStorage.room_no !== '') {
        // clearLocalStorageFilters();
        // populate_dropdown();
    }
}

if (localStorage.filter == "ALL EQUIPMENT") {

    $('#class-options').append(new Option("ALL EQUIPMENT", "all_equip"));
    $('#class-options').append(new Option("FACILITIES MANAGEMENT", "fac_equip"));
    $('#class-options').append(new Option("IT EQUIPMENT", "it_equip"));
    $('#class-options').append(new Option("MEDICAL EQUIPMENT", "med_equip"));
    $('#class-options').prop('disabled', false);

    $('#class-options').unbind().on('change', function () {
        var filter = $("#class-options option:selected").text();
        localStorage.filter = filter;
        toogleSub(filter);

        clearLocalStorageFilters();
        populate_dropdown();
        search();

        $('#building_dashboard_filter').text("BUILDING");
        $('#level_dashboard_filter').text("LEVEL");
        $('#area_dashboard_filter').text("AREA");
        $('#area_name_dashboard_filter').text("AREA NAME");
        $('#room_dashboard_filter').text("ROOM");
        $('#sublocaction_dashboard_filter').text("SUB LOCATION");
        $('#assetNo_dashboard_filter').text("ASSET NO");
        $('#reportrange span').html("select date");

    });

} else {
    search();
    toogleSub(localStorage.filter);
    $('#class-options').append(new Option(localStorage.filter, "user_class"));
    $('#class-options').css({ "-moz-appearance": "none" });
    $('#class-options').prop('disabled', 'disabled');
}

populate_dropdown();

function populate_dropdown() {

    //asset No
    getItems('../../ams_apis/slimTest/index.php/asset_primary_dashboard_filters', 'search_dashboard_assetNo', 'scroll_dashboard_assetNo', 'menu_dashboard_assetNo', 'empty_dashboard_assetNo');
    //sub location
    getItems('../../ams_apis/slimTest/index.php/asset_sub_location_dashboard_filters', 'search_dashboard_sublocaction', 'scroll_dashboard_sublocaction', 'menu_dashboard_sublocaction', 'empty_dashboard_sublocaction');
    // get room
    getItems('../../ams_apis/slimTest/index.php/asset_room_no_dashboard_filters', 'search_dashboard_room', 'scroll_view_room', 'menu_dashboard_room', 'empty_dashboard_room');
    // get area
    getItems('../../ams_apis/slimTest/index.php/asset_area_dashboard_filters', 'search_dashboard_area', 'scroll_dashboard_area', 'meun_dashboard_area', 'empty_dashboard_area');
    // get area name
    getItems('../../ams_apis/slimTest/index.php/asset_area_name_dashboard_filters', 'search_dashboard_area_name', 'scroll_dashboard_area_name', 'meun_dashboard_area_name', 'empty_dashboard_area_name');
    // get level
    getItems('../../ams_apis/slimTest/index.php/asset_level_new_dashboard_filters', 'search_dashboard_level', 'scroll_dashboard_level', 'menu_dashboard_level', 'empty_dashboard_level');
    // get building
    getItems('../../ams_apis/slimTest/index.php/building_dashboard_filters', 'search_dashboard_building', 'scroll_dashboard_building', 'menu_dashboard_building', 'empty_dashboard_building');

}

var allArr = {
    search_dashboard_room: [],
    search_dashboard_area: [],
    search_dashboard_area_name: [],
    search_dashboard_level: [],
    search_dashboard_building: [],
    search_dashboard_sublocaction: [],
    search_dashboard_assetNo: []
};


var clusterize = {
    search_dashboard_assetNo: [],
    search_dashboard_sublocaction: [],
    search_dashboard_room: [],
    search_dashboard_area: [],
    search_dashboard_area_name: [],
    search_dashboard_level: [],
    search_dashboard_building: []
};

function getItems(url, id, scrollArea, menuid, empty_id) {

    var params = '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","asset_area_name":"' + localStorage.area_name + '","room_no":"' + localStorage.room_no + '","sub_location":"' + localStorage.sub_location + '","asset_primary_id":"' + localStorage.assetno + '","asset_class":"' + localStorage.filter + '"}';

    console.log("params");
    console.log(params);
    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        data: params,
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
            var id = id.split("_");
            id = id[id.length - 1];
            swal.fire({
                title: "Unexpected Error #45404-" + id,
                text: "An error has occured, please contact admin (amsdev@ialch.co.za)",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,

            })
        }
    });
}

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

function clearData(input, btnDafualtId, text) {
    // var inputData = document.getElementById(input).(val);
    var value = $(input).val();

    if (value.length > 0) {

        if (input == "#search_dashboard_building") {

            document.getElementById('menu_dashboard_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_dashboard_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_dashboard_area_name').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.area_name = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.assetno = '';

            populate_dropdown();

            $(input).val("");
            $(btnDafualtId).text(text);

            $('#search_dashboard_building').val("");
            $('#building_dashboard_filter').text("BUILDING");
            $('#search_dashboard_level').val("");
            $('#level_dashboard_filter').text("LEVEL");
            $('#search_dashboard_area').val("");
            $('#area_dashboard_filter').text("AREA");
            $('#search_dashboard_area_name').val("");
            $('#area_name_dashboard_filter').text("AREA NAME");
            $('#search_dashboard_room').val("");
            $('#room_dashboard_filter').text("ROOM");
            $('#search_dashboard_sublocaction').val("");
            $('#sublocaction_dashboard_filter').text("SUB LOCATION");
            $('#search_dashboard_assetNo').val("");
            $('#assetNo_dashboard_filter').text("ASSET NO");


        } else if (input == "#search_dashboard_level") {

            document.getElementById('menu_dashboard_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_dashboard_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_dashboard_area_name').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.level = '';
            localStorage.area = '';
            localStorage.area_name = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.assetno = '';
            populate_dropdown();

            $(input).val("");
            $(btnDafualtId).text(text);

            $('#search_dashboard_level').val("");
            $('#level_dashboard_filter').text("LEVEL");
            $('#search_dashboard_area').val("");
            $('#area_dashboard_filter').text("AREA");
            $('#search_dashboard_area_name').val("");
            $('#area_name_dashboard_filter').text("AREA NAME");
            $('#search_dashboard_room').val("");
            $('#room_dashboard_filter').text("ROOM");
            $('#search_dashboard_sublocaction').val("");
            $('#sublocaction_dashboard_filter').text("SUB LOCATION");
            $('#search_dashboard_assetNo').val("");
            $('#assetNo_dashboard_filter').text("ASSET NO");

        } else if (input == "#search_dashboard_area") {

            document.getElementById('meun_dashboard_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_dashboard_area_name').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.area = '';
            localStorage.area_name = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.assetno = '';

            populate_dropdown();

            $('#search_dashboard_area').val("");
            $('#area_dashboard_filter').text("AREA");
            $('#search_dashboard_area_name').val("");
            $('#area_name_dashboard_filter').text("AREA NAME");
            $('#search_dashboard_room').val("");
            $('#room_dashboard_filter').text("ROOM");
            $('#search_dashboard_sublocaction').val("");
            $('#sublocaction_dashboard_filter').text("SUB LOCATION");
            $('#search_dashboard_assetNo').val("");
            $('#assetNo_dashboard_filter').text("ASSET NO");

        } else if (input == "#search_dashboard_area_name") {

            document.getElementById('meun_dashboard_area_name').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.area_name = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.assetno = '';

            populate_dropdown();

            $('#search_dashboard_area_name').val("");
            $('#area_name_dashboard_filter').text("AREA NAME");
            $('#search_dashboard_room').val("");
            $('#room_dashboard_filter').text("ROOM");
            $('#search_dashboard_sublocaction').val("");
            $('#sublocaction_dashboard_filter').text("SUB LOCATION");
            $('#search_dashboard_assetNo').val("");
            $('#assetNo_dashboard_filter').text("ASSET NO");

        } else if (input == "#search_dashboard_room") {

            document.getElementById('menu_dashboard_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.assetno = '';

            populate_dropdown();

            $('#search_dashboard_room').val("");
            $('#room_dashboard_filter').text("ROOM");
            $('#search_dashboard_sublocaction').val("");
            $('#sublocaction_dashboard_filter').text("SUB LOCATION");
            $('#search_dashboard_assetNo').val("");
            $('#assetNo_dashboard_filter').text("ASSET NO");

        } else if (input == "#search_dashboard_sublocaction") {

            document.getElementById('menu_dashboard_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_dashboard_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.sub_location = '';
            localStorage.assetno = '';

            populate_dropdown();

            $('#search_dashboard_sublocaction').val("");
            $('#sublocaction_dashboard_filter').text("SUB LOCATION");
            $('#search_dashboard_assetNo').val("");
            $('#assetNo_dashboard_filter').text("ASSET NO");


        } else if (input == "#search_dashboard_assetNo") {

            document.getElementById('menu_dashboard_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.assetno = '';

            populate_dropdown();

            $('#search_dashboard_assetNo').val("");
            $('#assetNo_dashboard_filter').text("ASSET NO");

        }

        // if (btnDafualtId == "#dropdown_approve_room") {
        //     populate_room();
        //     $(input).val("");
        //     $(btnDafualtId).text(text);
        // }
    }
}


function clearLocalStorageFilters() {
    defaultFilter();

    $('#search_dashboard_building').val("");
    $('#search_dashboard_level').val("");
    $('#search_dashboard_area').val("");
    $('#search_dashboard_area_name').val("");
    $('#search_dashboard_room').val("");
    $('#search_dashboard_sublocaction').val("");
    $('#search_dashboard_assetNo').val("");

    $('#reportrange span').html("select date");
}

function cleaAllFilters() {

    clearLocalStorageFilters();
    populate_dropdown();
    $('#reportrange span').html("select date");

    $('#building_dashboard_filter').text("BUILDING");
    $('#level_dashboard_filter').text("LEVEL");
    $('#area_dashboard_filter').text("AREA");
    $('#area_name_dashboard_filter').text("AREA NAME");
    $('#room_dashboard_filter').text("ROOM");
    $('#sublocaction_dashboard_filter').text("SUB LOCATION");
    $('#assetNo_dashboard_filter').text("ASSET NO");

    $('#dashboard_description').val("");


}

// Building
$('#menu_dashboard_building').on('click', '.dropdown-item', function () {
    $('#building_dashboard_filter').text($(this)[0].value);
    localStorage.building = $(this)[0].value;
    populate_dropdown();
    $("#building_dashboard_filter").dropdown('toggle');
    $('#search_dashboard_building').val($(this)[0].value);
});

// level
$('#menu_dashboard_level').on('click', '.dropdown-item', function () {
    $('#level_dashboard_filter').text($(this)[0].value);
    localStorage.level = $(this)[0].value;
    populate_dropdown();
    $("#level_dashboard_filter").dropdown('toggle');
    $('#search_dashboard_level').val($(this)[0].value);
});

// asset area
$('#meun_dashboard_area').on('click', '.dropdown-item', function () {
    $('#area_dashboard_filter').text($(this)[0].value);
    console.log($(this)[0].value);
    localStorage.area = $(this)[0].value;
    populate_dropdown();
    $("#area_dashboard_filter").dropdown('toggle');
    $('#search_dashboard_area').val($(this)[0].value);
});

// asset area name
$('#meun_dashboard_area_name').on('click', '.dropdown-item', function () {
    $('#area_name_dashboard_filter').text($(this)[0].value);
    console.log($(this)[0].value);
    localStorage.area_name = $(this)[0].value;
    populate_dropdown();
    $("#area_name_dashboard_filter").dropdown('toggle');
    $('#search_dashboard_area_name').val($(this)[0].value);
});


// room
$('#menu_dashboard_room').on('click', '.dropdown-item', function () {
    $('#room_dashboard_filter').text($(this)[0].value);
    localStorage.room_no = $(this)[0].value;
    populate_dropdown();
    $("#room_dashboard_filter").dropdown('toggle');
    $('#search_dashboard_room').val($(this)[0].value);
});

// sub location
$('#menu_dashboard_sublocaction').on('click', '.dropdown-item', function () {
    $('#sublocaction_dashboard_filter').text($(this)[0].value);
    localStorage.sub_location = $(this)[0].value;
    populate_dropdown();
    $("#sublocaction_dashboard_filter").dropdown('toggle');
    $('#search_dashboard_sublocaction').val($(this)[0].value);
});

// aasset Id
$('#menu_dashboard_assetNo').on('click', '.dropdown-item', function () {
    $('#assetNo_dashboard_filter').text($(this)[0].value);
    localStorage.assetno = $(this)[0].value;
    populate_dropdown();
    $("#assetNo_dashboard_filter").dropdown('toggle');
    $('#search_dashboard_assetNo').val($(this)[0].value);
});

function search() {
    var building = document.getElementById('search_dashboard_building').value,
        level = document.getElementById('search_dashboard_level').value,
        area = document.getElementById('search_dashboard_area').value,
        asset_area_name = document.getElementById('search_dashboard_area_name').value,
        room_no = document.getElementById('search_dashboard_room').value,
        sub_location = document.getElementById('search_dashboard_sublocaction').value,
        asset_primary_id = document.getElementById('search_dashboard_assetNo').value,
        date_range = $('#reportrange span').text();

    var results = (building + " - " + level + " - " + area + " - " + asset_area_name + " - " + room_no + " - " + sub_location + " - " + asset_primary_id + " - " + date_range);

    // if (" -  -  -  -  -  -  - select date" == results) {
    //     swal.fire({
    //         title: "Oooops!",
    //         text: 'please select at least one filter',
    //         type: 'error',
    //         showCloseButton: true,
    //         closeButtonColor: '#3DB3D7',
    //         animation: false,
    //         customClass: {
    //             popup: 'animated tada'
    //         },
    //         allowOutsideClick: true,
    //     })
    // }
    // else{
    $("#loader-overlay").css("display", "block");

    localStorage.building = building;
    localStorage.level = level;
    localStorage.area_name = asset_area_name;
    localStorage.area = area;
    localStorage.room_no = room_no;
    localStorage.assetno = asset_primary_id;
    localStorage.sub_location = sub_location;
    var date_range = $('#reportrange span').text();
    var asset_description = document.getElementById('dashboard_description').value;


    if (date_range == 'select date') {
        localStorage.dateStart = '2005/01/01';
        localStorage.dateEnd = '9999/12/31';
    }

    var jsonData = '{"building" :"' + localStorage.building + '","level" :"' + localStorage.level + '","area_name" :"' + localStorage.area_name + '","area" :"' + localStorage.area + '","room_no" :"' + localStorage.room_no + '","sub_location" :"' + localStorage.sub_location + '","assetNo" :"' + localStorage.assetno + '","dateStart" :"' + localStorage.dateStart + '","dateEnd" :"' + localStorage.dateEnd + '","asset_class" :"' + localStorage.filter + '","role" :"' + localStorage.role + '","user" :"' + localStorage.username + '","asset_description":"' + asset_description + '"}';

    console.log("jsonData");
    // console.log(jsonData);

    $.ajax({
        url: "../../ams_apis/slimTest/index.php/getCounts",
        type: "POST",
        dataType: 'json',
        data: jsonData,
        success: function (data) {
            console.log(data);
            document.getElementById("activeAssetsCount").innerHTML = data.data[0].ACTIVE;
            document.getElementById("inactiveAssetsCount").innerHTML = data.data[0].INACTIVE;
            document.getElementById("pendingAssetsCount").innerHTML = data.data[0].PENDING;
            document.getElementById("movedAssetsCount").innerHTML = data.data[0].MOVED;
            document.getElementById("assetsWithNoCrtCount").innerHTML = data.data[0].assetsWithNoCert;
            document.getElementById("comCertCount").innerHTML = data.data[0].assetsWithCert;
            document.getElementById("decomCertCount").innerHTML = data.data[0].DECOM_ASSETS;
            document.getElementById("usersCount").innerHTML = data.data[0].USERS;

            $('.count').each(function () {
                $(this).prop('Counter', 0).animate({
                    Counter: $(this).text()
                }, {
                    duration: 4000,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(Math.ceil(now).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
                    }
                });
            });

            $("#loader-overlay").css("display", "none");
        },
        error: function (error) {
            console.log(error);
        }
    });

    // }
}

function doit(type, fn, dl) {
    var elt = document.getElementById(fn);
    var wb = XLSX.utils.table_to_book(elt, { sheet: fn });

    return dl ?
        XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
        XLSX.writeFile(wb, 'Assets Selected ' + fn + " ." + (type || 'xlsx') || ('test.' + (type || 'xlsx')));
}

var onSearch = function (btn_id, searchValue, emptyId) {

    var getId = searchValue;

    var found = false;

    var rows = allArr[searchValue];

    document.getElementById(searchValue).onkeypress = function (e) {

        console.log(e.keyCode);
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

        // console.log(rows[i].values[0].trim().toString().indexOf(searchValue.value) + 1);

        if (rows[i].values[0].trim().toString().indexOf((searchValue.value).toUpperCase()) + 1) {
            suitable = true;
            found = true;
        }

        rows[i].active = suitable;
    }

    if (searchValue.value.length == 0) {
        var resObj = checkFilter(getId);
        populate_dropdown();
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




var onSearch_new = function (searchValue) {
    document.getElementById(searchValue).onkeypress = function (e) {

        var value = $("#" + searchValue).val();

        if (e.keyCode == 13) {
            e.preventDefault();
            search();
            if (value.length > 1) {
            }
        }
    }
}

var view_columns = [
    "ASSET_CLASS",
    "ASSET_ID",
    "ASSET_PRIMARY_ID",
    "ASSET_DESCRIPTION",
    "ASSET_MODEL",
    "ASSET_CLASSIFICATION",
    "ASSET_TYPE",
    "ASSET_ROOM_NO",
    "ASSET_SUB_LOCATION",
    "ASSET_BUILDING",
    "ASSET_LEVEL",
    "ASSET_AREA",
    "ASSET_AREA_NAME",
    "ASSET_AREA_DETAIL",
    "HD_ASSET_LOCATION",
    "HD_ASSET_DEPT",
    "ASSET_SERIAL_NO",
    "ASSET_PURCHASE_DT",
    "ASSET_WARRANTY_DT",
    "ASSET_VENDOR_ID",
    "ASSET_VENDOR_NAME",
    "ASSET_USEFUL_LIFE",
    "ASSET_DISPOSAL_DT",
    "ASSET_SERVICE_DT",
    "ASSET_SERVICE_BY",
    "ASSET_SERVICE_DUE_DT",
    "ASSET_CERT_IND",
    "ASSET_CERT_NO",
    "ASSET_ADDED_BY",
    "ASSET_CREATE_DT",
    "ASSET_COMMENTS",
    "ASSET_STATUS",
    "ASSET_TRANSACTION_STATUS",
    "ASSET_IS_SUB",
    "ASSET_HAS_SUB_ASSETS",
    "ASSET_PRINT_DATE",
    "VIEW_ALL"
];

// check all 

$('#VIEW_ALL').change(function () {
    if (this.checked) {
        $('#v_columns input[type="checkbox"]').prop('checked', true);
    } else {
        $('#v_columns input[type="checkbox"]').prop('checked', false);
    }
});

function closeModal(modal) {
    $(modal).fadeOut(250);
}


function view_selected() {
    let rows_selected = $("#v_columns input[type=checkbox]:checked");
    let columns_selected = [];

    for (var i = 0; i < rows_selected.length; i++) {
        if (rows_selected[i].value != "ADMIN") {
            columns_selected.push(rows_selected[i].value);
        }
    }

    /**
     * Uncheck all checkboxes
     */


    var columns = createCommaDel(columns_selected);

    console.log(createCommaDel(columns_selected));
    if (rows_selected.length > 0) {
        
        if(rows_selected.length > 7 ){
            
          swal.fire({
            title: "<h1 style='font-size:16pt !important;font-weight:bolder !important'>ABOVE AVERAGE SELECT!</h1>",
            html: "<p style='font-size:13pt !important;'>Are you sure you want to select these columns, The process might take longer depending on the amount of data.</p>",
            type: "warning",
            showCloseButton: true,
            confirmButtonColor: "#5bc0de",
            allowOutsideClick: false,
            showCancelButton: true,
            cancelButtonColor:"#d9534f"

            }).then((results)=>{
              if(results.value){
                init_loader_view();
                getData(localStorage.api, columns);
              }else{

              }
            });
            
        }
        else{
            init_loader_view();
            getData(localStorage.api, columns);
        }
       
        // var footer = document.getElementById('modal-footer').innerHTML = "";
//        getData(localStorage.api, columns);

    } else {
        swal.fire({
            title: "No column selected",
            text: "no data available",
            type: "error",
            showCloseButton: true,
            confirmButtonColor: "#C12E2A",
            allowOutsideClick: true,

        })
    }
}

let createCommaDel = (array_values) => {
    let coma_del = "";
    for (let i = 0; i < array_values.length; i++) {
        if (i == array_values.length - 1) {
            coma_del += array_values[i];
        } else {
            coma_del += array_values[i] + ",";
        }

    }
    return coma_del;
}

function init_loader_view(){
    $("#overlay-assets-added").hide();
    $("#loader-overlay").css("display", "block");
    document.getElementById('modal-header').innerHTML = localStorage.header_text;
    $("#modal-header,#exportBtn").removeClass();
    $("#modal-header,#exportBtn").addClass(localStorage.bg_color);
    $("#modal-header").addClass("modals-header");
    $("#exportBtn").addClass("btn-lg");
}