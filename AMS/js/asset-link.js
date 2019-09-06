function showNav() {
    $('#menu-list').slideToggle('fast');
}
document.getElementById('username').innerHTML = (replaceAll('"', '', localStorage.username)).toUpperCase();

// replace func
function replaceAll(find, replace, str) {
    while (str.indexOf(find) > -1) {
        str = str.replace(find, replace);
    }
    return str;
}

//reset
localStorage.building = '';
localStorage.level = '';
localStorage.area = '';
localStorage.room_no = '';

// populate filters
var user_class = localStorage.getItem("filter");

var tableArr = {
    search_link_location: [],
    search_link_room: []
};


var allArr = {
    primAssetsTable: [],
    searchroomno: []
};

sub_location_filters();
assets_filters();

function sub_location_filters() {
    /*Sub Location Filters*/
    getItems('../../ams_apis/slimTest/index.php/new_filter', 'search_link_location', 'scroll_link_Location', 'menu_link_location', 'empty_link_location');
    getItems('../../ams_apis/slimTest/index.php/new_filter', 'search_prim_level', 'scrol_prim_level', 'menu_prim_level', 'empty_prim_level');
    getItems('../../ams_apis/slimTest/index.php/new_filter', 'search_prim_area', 'scrol_prim_area', 'menu_prim_area', 'empty_prim_area');
    getItems('../../ams_apis/slimTest/index.php/new_filter', 'search_prim_room', 'scrol_prim_room', 'menu_prim_room', 'empty_prim_room');
}
function assets_filters() {
    /**Assets*/
    getItems('../../ams_apis/slimTest/index.php/new_filter', 'search_sub_location', 'scroll_sub_location', 'meun_sub_location', 'empty_sub_location');
    getItems('../../ams_apis/slimTest/index.php/new_filter', 'search_level', 'scroll_sub_level', 'menu_level', 'empty_level');
    getItems('../../ams_apis/slimTest/index.php/new_filter', 'search_area', 'scroll_area', 'menu_area', 'empty_area');
    getItems('../../ams_apis/slimTest/index.php/new_filter', 'search_prim_room', 'scrol_prim_room', 'menu_room_sub', 'empty_room_sub');
}

function getItems(url, id, scrollArea, menuid) {
    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        data: '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '"}',
        success: function (data) {
            console.log(data);
            var rows = [];
            var searchValue = document.getElementById(id);
            // console.log("=============searchValue================");
            // console.log(searchValue);
            // console.log("=============searchValue=================");
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
            console.log("Error");
            console.log(data_err);
        }
    })
}

var count = 0;

var clusterize = {
    search_link_location: [],
    search_link_room: []
};

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


function checkFilter(key) {
    var res = {};

    switch (key) {
        case "searchasset":
            res = { "btnId": "dropdown_assets", "btnContent": "ASSET NO..." };
            break;
        case "searchroomno":
            res = { "btnId": "dropdown_room", "btnContent": "ROOM NO..." };
            break;
        case "searchlocation":
            res = { "btnId": "dropdown_location", "btnContent": "LOCATION..." };
            break;
        default:
            res = { "btnId": "not found", "btnContent": "not found" };
            break;
    }

    return res;
}

function createAssetDelimeter(assets_arr) {
    var send_assets = "";
    for (var i = 0; i < assets_arr.length; i++) {
        if (i == assets_arr.length - 1) {
            send_assets += assets_arr[i];
        } else {
            send_assets += assets_arr[i] + "^";
        }
    }

    return send_assets;
}

// $('#menuRoom').on('click', '.dropdown-item', function () {
//     $('#dropdown_room').text($(this)[0].value);
//     localStorage.menuRoom = $(this)[0].value;
//     $('#clearAllFilters').prop('disabled', false);
//     populate_dropdown();
//     $("#dropdown_room").dropdown('toggle');
//     $('#searchroomno').val($(this)[0].value);
// });

// $('#menuLocation').on('click', '.dropdown-item', function () {
//     $('#dropdown_location').text($(this)[0].value);
//     localStorage.menuLocation = $(this)[0].value;
//     $('#clearAllFilters').prop('disabled', false);
//     populate_dropdown();
//     $("#dropdown_location").dropdown('toggle');
//     $('#searchlocation').val($(this)[0].value);
// });
//Department Dropdown Check
if (localStorage.filter == "ALL EQUIPMENT") {

    $('#class-options').append(new Option("ALL EQUIPMENT", "all_equip"));
    $('#class-options').append(new Option("FACILITIES MANAGEMENT", "fac_equip"));
    $('#class-options').append(new Option("IT EQUIPMENT", "it_equip"));
    $('#class-options').append(new Option("MEDICAL EQUIPMENT", "med_equip"));
    $('#class-options').prop('disabled', false);

    $('#class-options').on('change', function () {
        var filter = $("#class-options option:selected").text();
        localStorage.filter = filter;
        //clear btn text
        resetBtn('#dropdown_assets', 'ASSET NO...');
        resetBtn('#dropdown_room', 'ROOM...');
        resetBtn('#dropdown_location', 'LOCATION ...');

        //clear search inputs
        resetInput('#searchlocation', '');
        resetInput('#searchroomno', '');
        resetInput('#searchasset', '');

        localStorage.menuAssets = '';
        localStorage.menuLocation = '';
        localStorage.menuRoom = '';
        populate_dropdown();
    });

}
else {
    $('#class-options').append(new Option(localStorage.filter, "user_class"));
    $('#class-options').css({ "-moz-appearance": "none" });
    $('#class-options').prop('disabled', 'disabled');
}