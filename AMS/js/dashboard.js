clearLocalStorageFilters();

$(function () {

    var start = moment().subtract(10, 'days');
    var end = moment();

    function cb(start, end) {

        localStorage.startDate = start.format('YYYY/MM/DD');
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

//check for filter in local storage
if (localStorage.backupFilter == undefined || localStorage.backupFilter == "undefined") {
    localStorage.backupFilter = localStorage.filter;
} else {
    localStorage.filter = localStorage.backupFilter;
}

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

        //clear btn text
        checkFilter("search_view_building");

        $('#currentAssetsTable').DataTable().clear().destroy();
        $("#searchView").show();
        $("#printAssets").hide();


    });

} else {
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


    var params = '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.asset_area + '","asset_area_name":"' + localStorage.asset_area_name + '","room_no":"' + localStorage.room_no + '","sub_location":"' + localStorage.sub_location + '","asset_primary_id":"' + localStorage.asset_primary_id + '","asset_class":"' + localStorage.filter + '"}';

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
            localStorage.asset_area_name = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

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
            localStorage.asset_area_name = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';
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
            localStorage.asset_area_name = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

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

            localStorage.asset_area_name = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

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
            localStorage.asset_primary_id = '';

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
            localStorage.asset_primary_id = '';

            populate_dropdown();

            $('#search_dashboard_sublocaction').val("");
            $('#sublocaction_dashboard_filter').text("SUB LOCATION");
            $('#search_dashboard_assetNo').val("");
            $('#assetNo_dashboard_filter').text("ASSET NO");


        } else if (input == "#search_dashboard_assetNo") {

            document.getElementById('menu_dashboard_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.asset_primary_id = '';

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
    localStorage.building = '';
    localStorage.level = '';
    localStorage.asset_area = '';
    localStorage.asset_area_name = '';
    localStorage.room_no = '';
    localStorage.sub_location = '';
    localStorage.asset_primary_id = '';

    $('#search_dashboard_building').val("");
    $('#search_dashboard_level').val("");
    $('#search_dashboard_area').val("");
    $('#search_dashboard_area_name').val("");
    $('#search_dashboard_room').val("");
    $('#search_dashboard_sublocaction').val("");
    $('#search_dashboard_assetNo').val("");
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
    localStorage.asset_area = $(this)[0].value;
    populate_dropdown();
    $("#area_dashboard_filter").dropdown('toggle');
    $('#search_dashboard_area').val($(this)[0].value);
});

// asset area name
$('#meun_dashboard_area_name').on('click', '.dropdown-item', function () {
    $('#area_name_dashboard_filter').text($(this)[0].value);
    console.log($(this)[0].value);
    localStorage.asset_area_name = $(this)[0].value;
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
    localStorage.asset_primary_id = $(this)[0].value;
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

    if (" -  -  -  -  -  -  - select date" == results) {
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
    }
    else{
        var jsonData = '{"building" :"' + building + '","level" :"' + level + '","area_name" :"' + area_name + '","area" :"' + area + '","room_no" :"' + room_no + '","sub_location" :"' + sub_location + '","assetNo" :"' + assetno + '","dateStart" :"' + localStorage.dateStart + '","dateEnd" :"' + localStorage.dateEnd + '","asset_class" :"' + localStorage.filter + '","role" :"' + localStorage.role + '","user" :"' + localStorage.username + '"}';

        console.log(jsonData);

    }



}