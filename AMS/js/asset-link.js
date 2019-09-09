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

window.onload = function () {
    if (localStorage.building !== '' || localStorage.level !== '' || localStorage.area !== '' || localStorage.room_no !== '') {
        localStorage.building = '';
        localStorage.area = '';
        localStorage.level = '';
        localStorage.room_no = '';
        sub_location_filters();
    }
}


// populate filters
var user_class = localStorage.getItem("filter");

var tableArr = {
    search_link_location: [],
    search_link_room: []
};


var allArr = {
    primAssetsTable: [],
    subAssetsTable: []
};

sub_location_filters();
// assets_filters();

function closeAsset(overlay_id) {
    document.getElementById(overlay_id).style.display = "none";
}

function searchLocation() {

    var building = document.getElementById('search_link_location').value,
        level = document.getElementById('search_level').value,
        area = document.getElementById('search_prim_level').value,
        room_no = document.getElementById('search_prim_room').value;

    var results = (building + " - " + level + " - " + area + " - " + room_no);

    if (" -  -  - " == results) {
        document.getElementById('overlay-alert-message').style.display = "none";
        document.getElementById('overlay-alert-message').style.display = "block";
        document.getElementById('alert_header').innerHTML = "Assets Linking";
        document.getElementById('alert-message-body').innerHTML = '<div class="text-center"><img src="../img/fail.png" width=60 /></div><br><span class="text-muted">please select at least one filter</span>';
        document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">OK</button>';

    } else {
        console.log('{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '"}');

        $('#primSearchView').hide();
        $('#loader').fadeIn(500);

        $.ajax({
            url: '../../ams_apis/slimTest/index.php/sub_location',
            method: 'POST',
            dataType: 'JSON',
            data: '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '"}',
            success: function (data) {
                var table = null;
                console.log(data);
                $('#loader').fadeOut(500);

                if (data.rows > 0) {

                    var str = '{"data" : [';
                    for (var k = 0; k < data.rows; k++) {
                        if ((data.rows - 1) == k) {
                            str += '["' + data.data[k].AL_NO + '","' +
                                data.data[k].AL_NO + '","' +
                                data.data[k].ASSET_ROOM_NO + '","' +
                                data.data[k].HD_ASSET_LOCATION + '","' +
                                data.data[k].HD_ASSET_DESC + '"]';
                        } else {
                            str += '["' + data.data[k].AL_NO + '","' +
                                data.data[k].AL_NO + '","' +
                                data.data[k].ASSET_ROOM_NO + '","' +
                                data.data[k].HD_ASSET_LOCATION + '","' +
                                data.data[k].HD_ASSET_DESC + '"],';
                        }
                    }
                    str += ']}'

                    str = replaceAll("\r\n", "", str);

                    str = (JSON.parse(str));
                    // console.log(str.data);

                    table = createTable("#subLocationTable", str.data);



                    // table.clear().draw();


                }
                else {
                    // current += '<tr id="nodata" class="text-center"><th scope="row" colspan="6"><h1 class="text-muted">No data</h1></th></tr>';
                    $('#searchView').fadeIn(500);
                    // console.log(data.data);

                    table = createTable("#currentAssetsTable", data.data);

                }
            },
            error: function (error) {
                console.log(error);
            }
        });

    }
}

function sub_location_filters() {
    /*Sub Location Filters*/
    getItems('../../ams_apis/slimTest/index.php/building', 'search_link_location', 'scroll_link_Location', 'menu_link_location', 'empty_link_location');
    getItems('../../ams_apis/slimTest/index.php/asset_level_new', 'search_prim_level', 'scrol_prim_level', 'menu_prim_level', 'empty_prim_level');
    getItems('../../ams_apis/slimTest/index.php/asset_area', 'search_prim_area', 'scrol_prim_area', 'menu_prim_area', 'empty_prim_area');
    getItems('../../ams_apis/slimTest/index.php/asset_room_no', 'search_prim_room', 'scrol_prim_room', 'menu_prim_room', 'empty_prim_room');
}
function assets_filters() {
    /**Assets*/
    getItems('../../ams_apis/slimTest/index.php/new_filter', 'search_sub_location', 'scroll_sub_location', 'meun_sub_location', 'empty_sub_location');
    getItems('../../ams_apis/slimTest/index.php/new_filter', 'search_level', 'scroll_sub_level', 'menu_level', 'empty_level');
    getItems('../../ams_apis/slimTest/index.php/new_filter', 'search_area', 'scroll_area', 'menu_area', 'empty_area');
    getItems('../../ams_apis/slimTest/index.php/new_filter', 'search_prim_room', 'scrol_prim_room', 'menu_room_sub', 'empty_room_sub');
}

function createTable(tableID, tableData) {
    var table = $(tableID).DataTable({
        // "data": tableData,
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
                "className": "dt-center",
                "targets": 0
            },
            {
                "targets": -2,
                "orderable": false
            }
        ],
        "select": {
            style: 'single'
        },
        fnCreatedRow: function (nTd, nRow, aData, iDataIndex) {

            $(nRow).attr('id', aData[0]);
            // console.log($(nTd).children()[0].children);
        }
    });

    $(tableID + ' tbody').on('click', 'input[type=checkbox]', function () {
        console.log($(this).prop("checked"));
        if ($(this).prop("checked") == true) {
            $('input[type=checkbox]').prop("checked", false);
            $(this).prop("checked", true);
            console.log("test1");
        }
    });

    // $('#frm-example').on('submit', function (e) {
    //     // Prevent actual form submission
    //     e.preventDefault();
    //     var rows_selected = table.column(0).checkboxes.selected();

    //     var form = $('#frm-example');

    //     // Iterate over all selected checkboxes
    //     // $.each(rows_selected, function (index, rowId) {
    //     //     // Create a hidden element 
    //     //     $(form).append(
    //     //         $('<input>')
    //     //             .attr('type', 'hidden')
    //     //             .attr('name', 'id[]')
    //     //             .val(rowId)
    //     //     );
    //     // }); 

    //     var rowsSelected = rows_selected.join(",").split(",");

    //     viewPrintAssets(rowsSelected);
    //     // Remove added elements
    //     $('input[name="id\[\]"]', form).remove();

    //     e.preventDefault();

    // });


    return table;
}

function getItems(url, id, scrollArea, menuid) {

    console.log('{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '"}');

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
    search_prim_level: [],
    search_prim_area: [],
    search_prim_room: []
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


//set text on click
// Building
$('#menu_link_location').on('click', '.dropdown-item', function () {
    $('#dropdown_link_location').text($(this)[0].value);
    localStorage.building = $(this)[0].value;
    $('#clearAllFilters').prop('disabled', false);
    sub_location_filters();
    $("#dropdown_link_location").dropdown('toggle');
    $('#search_link_location').val($(this)[0].value);
});

// level
$('#menu_prim_level').on('click', '.dropdown-item', function () {
    $('#dropdown_prim_level').text($(this)[0].value);
    localStorage.level = $(this)[0].value;
    $('#clearAllFilters').prop('disabled', false);
    sub_location_filters();
    $("#dropdown_prim_level").dropdown('toggle');
    $('#search_prim_level').val($(this)[0].value);
});

// area
$('#menu_prim_area').on('click', '.dropdown-item', function () {
    $('#dropdown_prim_area').text($(this)[0].value);
    localStorage.area = $(this)[0].value;
    $('#clearAllFilters').prop('disabled', false);
    sub_location_filters();
    $("#dropdown_prim_area").dropdown('toggle');
    $('#search_prim_area').val($(this)[0].value);
});

// room
$('#menu_prim_room').on('click', '.dropdown-item', function () {
    $('#dropdown_prim_room').text($(this)[0].value);
    localStorage.room_no = $(this)[0].value;
    $('#clearAllFilters').prop('disabled', false);
    sub_location_filters();
    $("#dropdown_prim_room").dropdown('toggle');
    $('#search_prim_room').val($(this)[0].value);
});

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


//function clear button
function clearData(input, btnDafualtId, text) {
    // var inputData = document.getElementById(input).(val);
    var value = $(input).val();

    if (value.length > 0) {

        if (input == "#search_link_location") {

            document.getElementById('menu_link_location').innerHTML = '<div id="location_link_Loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_level').innerHTML = '<div id="prim_level_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_area').innerHTML = '<div id="prim_area_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_room').innerHTML = '<div id="prim_Room_load" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            sub_location_filters();

            //building
            $('#search_link_location').val("");
            $('#dropdown_link_location').text("BUILDING");
            //level
            $('#search_prim_level').val("");
            $('#dropdown_prim_level').text("LEVEL");
            //Area
            $('#search_prim_area').val("");
            $('#dropdown_prim_area').text("AREA");
            //room_no
            $('#search_prim_room').val("");
            $('#dropdown_prim_room').text("ROOM");


        } else if (input == "#search_prim_level") {
            document.getElementById('menu_prim_level').innerHTML = '<div id="prim_level_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_area').innerHTML = '<div id="prim_area_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_room').innerHTML = '<div id="prim_Room_load" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            sub_location_filters();

            //level
            $('#search_prim_level').val("");
            $('#dropdown_prim_level').text("LEVEL");
            //Area
            $('#search_prim_area').val("");
            $('#dropdown_prim_area').text("AREA");
            //room_no
            $('#search_prim_room').val("");
            $('#dropdown_prim_room').text("ROOM");

        } else if (input == "#search_prim_area") {
            document.getElementById('menu_prim_area').innerHTML = '<div id="prim_area_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_room').innerHTML = '<div id="prim_Room_load" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.area = '';
            localStorage.room_no = '';
            sub_location_filters();

            //Area
            $('#search_prim_area').val("");
            $('#dropdown_prim_area').text("AREA");
            //room_no
            $('#search_prim_room').val("");
            $('#dropdown_prim_room').text("ROOM");
        }
        else if (input == "#search_prim_room") {
            document.getElementById('menu_prim_room').innerHTML = '<div id="prim_Room_load" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            localStorage.room_no = '';
            sub_location_filters();

            //room_no
            $('#search_prim_room').val("");
            $('#dropdown_prim_room').text("ROOM");
        }


        // if (btnDafualtId == "#dropdown_approve_room") {
        //     populate_room();
        //     $(input).val("");
        //     $(btnDafualtId).text(text);
        // }
    }
}