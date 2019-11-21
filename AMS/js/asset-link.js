// reset 
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

function clearBothLocalStorage() {
    clearLocalStorrageSubAssets();
    clearLocalStorrageSubLocation();
}

clearLocalStorrageSubAssets();
clearLocalStorrageSubLocation();

function clearLocalStorrageSubLocation() {
    localStorage.building = '';
    localStorage.area = '';
    localStorage.level = '';
    localStorage.room_no = '';
    localStorage.sub_location = '';
}

function clearLocalStorrageSubAssets() {
    localStorage.building_assets = '';
    localStorage.area_assets = '';
    localStorage.level_assets = '';
    localStorage.room_no_assets = '';
    localStorage.asset_no = '';
}

const $menu = $('#menu-list');

$(document).mouseup(e => {
    if (!$menu.is(e.target) // if the target of the click isn't the container...
        && $menu.has(e.target).length === 0) // ... nor a descendant of the container
    {
        $('#menu-list').fadeOut(500);
    }
});

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
        sub_location_filters();
        assets_filters();
    }
}


// populate filters
var user_class = localStorage.getItem("filter");

var tableArr = {
    subLocationTable: [],
    subAssetsTable: []
};

sub_location_filters();
assets_filters();

function closeAsset(overlay_id) {
    document.getElementById(overlay_id).style.display = "none";
}

var asset_link = {
    al_no: null,
    selected_assets: null
}

var dataInfo = "";

function search() {

    var building = document.getElementById('search_link_location').value,
        level = document.getElementById('search_prim_level').value,
        area = document.getElementById('search_prim_area').value,
        room_no = document.getElementById('search_prim_room').value;
    description = document.getElementById('prim_description').value;
    sub_location = document.getElementById('search_prim_sublocation').value;

    var results = (building + " - " + level + " - " + area + " - " + room_no + " - " + description + " - " + sub_location);

    localStorage.building = building;
    localStorage.level = level;
    localStorage.area = area;
    localStorage.room_no = room_no;
    localStorage.sub_location = sub_location;


    console.log(results);
    if (" -  -  -  -  - " == results) {
        resetToSubLocation();
        swal.fire({
            title: "Error",
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

        console.log('{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","description":"' + description + '"}');

        if (building !== '') {
            $('#dropdown_link_location').text(building);
        }
        if (level !== '') {
            $('#dropdown_prim_level').text(level);
        }
        if (area !== '') {
            $('#dropdown_prim_area').text(area);
        }
        if (room_no !== '') {
            $('#dropdown_prim_room').text(room_no);
        }
        if (sub_location !== '') {
            $('#dropdown_prim_sublocation').text(sub_location);
        }

        $('#primSearchView').hide();
        $('#loader').fadeIn(500);

        $.ajax({
            url: '../../ams_apis/slimTest/index.php/sub_location',
            method: 'POST',
            dataType: 'JSON',
            data: '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","description":"' + description + '","sub_location":"' + sub_location + '"}',
            success: function (data) {
                var table = null;
                $('#loader').fadeOut(500);

                if (data.rows > 0) {

                    var str = '{"data" : [';
                    for (var k = 0; k < data.rows; k++) {
                        if ((data.rows - 1) == k) {
                            str += '["' + data.data[k].AL_NO + '","' +
                                data.data[k].AL_NO + '","' +
                                data.data[k].ASSET_ROOM_NO + '","' +
                                data.data[k].HD_ASSET_LOCATION + '","' +
                                data.data[k].HD_ASSET_DESC + '","' +
                                updateLetterToIcon(data.data[k].HAS_PRI) + '","' +
                                updateLetterToIcon(data.data[k].HAS_SUB) + '"]';
                        } else {
                            str += '["' + data.data[k].AL_NO + '","' +
                                data.data[k].AL_NO + '","' +
                                data.data[k].ASSET_ROOM_NO + '","' +
                                data.data[k].HD_ASSET_LOCATION + '","' +
                                data.data[k].HD_ASSET_DESC + '","' +
                                updateLetterToIcon(data.data[k].HAS_PRI) + '","' +
                                updateLetterToIcon(data.data[k].HAS_SUB) + '"],';
                        }
                    }
                    str += ']}'

                    str = replaceAll("\r\n", "", str);

                    str = (JSON.parse(str));
                    table_dom = "#subLocationTable";

                    table = createTable("#subLocationTable", str.data);
                    $(" #subLocationTable .sorting_disabled input").prop("disabled", true); //Disable
                    $(" #subLocationTable .sorting_disabled input").css({ "cursor": "none" });

                    var _table_id = table_dom.replace("#", "");
                    tableArr[_table_id] = table;

                    $('#subLocationTable tbody').on('click', 'input[type="checkbox"]', function () {

                        dataInfo = tableArr["subLocationTable"].row($(this).parents('tr')).data();

                        if ($(this).prop("checked") == true) {
                            $('#subLocationTable tbody input[type=checkbox]').prop("checked", false);
                            $(this).prop("checked", true);
                            asset_link.al_no = dataInfo[0];
                        } else {
                            asset_link.al_no = null;
                        }


                    });

                    $('#subLocationTable tbody').on('click', 'button', function () {
                        var data = tableArr["subLocationTable"].row($(this).parents('tr')).data();
                        viewAsset(data[0]);
                    });
                }
                else {
                    $('#searchView').fadeIn(500);
                    table = createTable("#subLocationTable", data.data);
                    $(" #subLocationTable .sorting_disabled input").prop("disabled", true); //Disable
                    $(" #subLocationTable .sorting_disabled input").css({ "cursor": "none" });
                }
            },
            error: function (error) {
                swal.fire({
                    title: "Unexpected Error #42404",
                    text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'sub_location'",
                    type: "error",
                    showCloseButton: true,
                    confirmButtonColor: "#C12E2A",
                    allowOutsideClick: true,
                });
            }
        });

    }
}


function clearSublocation() {
    localStorage.building = '';
    localStorage.area = '';
    localStorage.level = '';
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
    //description
    $('#prim_description').val("");

}

//updating y to icons
function updateLetterToIcon(letter) {
    var results = "";
    switch (letter) {
        case "y":
            results = "<p class='text-success'><strong>YES</strong></p>";
            break;
        case "n":
            results = "<p class='text-danger'><strong>NO</strong></p>";
            break;
    }

    return results;
}//close updateLetterToIcon function


function unlinkPrimary(){
    swal.fire({
        title: "You can not unlink primary",
        text: "You need to unlink all to do so",
        type: "error",
        showCloseButton: true,
        confirmButtonColor: "#C12E2A",
        allowOutsideClick: true,
    });

}


function viewAsset(assetId) {
    var currentItem = "";
    document.getElementById('overlay-asset').style.display = "block";
    $('#assetBody')['0'].innerHTML = assetId;

    $.ajax({
        url: "../../ams_apis/slimTest/index.php/singleAsset_al_no",
        method: "POST",
        dataType: "JSON",
        data: '{"al_no" :"' + assetId + '"}',
        success: function (data) {



            document.getElementById('viewAssets').innerHTML = data[0].table;
            document.getElementById('subItemCount').innerText = data[0].items;

            if (data[0].items > 0) {
                $('#unlink_all').fadeIn(500);
                $('#unlink_all').off().on('click', function () {
                    unlinkAll(assetId);
                });
            } else {
                $('#unlink_all').hide();
            }
        },
        error: function (err) {
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'singleAsset_al_no'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,
            });

        }
    });
}

function unlinkAll(assetId) {
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/unlink_all_subs",
        method: "POST",
        dataType: "JSON",
        data: '{"asset_primary_id" :"' + assetId + '","username":"' + localStorage.username + '"}',
        success: function (data) {
            console.log(data);
            if (data.data == "UNLINKING ALL SUBS WAS SUCCESSFUL") {
                closeAsset('overlay-asset');
                search();
                swal.fire({
                    title: "unlinked Successfully",
                    text: data.data,
                    type: "success",
                    showCloseButton: true,
                    allowOutsideClick: true,

                }).then(function (result) {
                    if (result.value) {

                    } else if (
                        result.dismiss === Swal.DismissReason.cancel
                    ) {

                    }
                })

            }
        },
        error: function (err) {
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'unlink_all_subs'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,
            });

        }
    });
}


function resetToAssets() {
    //building
    $('#dropdown_sub_location').text("BUILDING");
    //level
    $('#sub_level_dropdown').text("LEVEL");
    //Area
    $('#area_dropdown').text("AREA");
    //room_no
    $('#dropdown_room_sub').text("ROOM");
    //asset number
    $('#dropdown_asset_no_sub').text("ASSET NUMBER");
}

function resetToSubLocation() {
    //building
    $('#dropdown_link_location').text("BUILDING");
    //level
    $('#dropdown_prim_level').text("LEVEL");
    //Area
    $('#dropdown_prim_area').text("AREA");
    //room_no
    $('#dropdown_prim_room').text("ROOM");
    //asset number
    $('#dropdown_prim_sublocation').text("SUB LOCATION");
}

function searchasset() {
    var building = document.getElementById('search_sub_location').value,
        level = document.getElementById('search_level').value,
        area = document.getElementById('search_area').value,
        room_no = document.getElementById('search_room_sub').value;
    description = document.getElementById('sub_description').value;
    asset_no = document.getElementById('search_asset_no_sub').value;

    localStorage.building_assets = building;
    localStorage.area_assets = area;
    localStorage.level_assets = level;
    localStorage.room_no_assets = room_no;
    localStorage.asset_no = asset_no;

    var results = (building + " - " + level + " - " + area + " - " + room_no + " - " + description + " - " + asset_no);

    if (" -  -  -  -  - " == results) {
        resetToAssets();
        swal.fire({
            title: "Error",
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
    else {

        if (building !== '') {
            $('#dropdown_sub_location').text(building);
        }
        if (level !== '') {
            $('#sub_level_dropdown').text(level);
        }
        if (area !== '') {
            $('#area_dropdown').text(area);
        }
        if (room_no !== '') {
            $('#dropdown_room_sub').text(room_no);
        }
        if (asset_no !== '') {
            $('#dropdown_asset_no_sub').text(asset_no);
        }

        $('#subAssetsSearch').hide();
        $('#AssetsLoader').fadeIn(500);

        $.ajax({
            url: '../../ams_apis/slimTest/index.php/assets_not_linked',
            method: 'POST',
            dataType: 'JSON',
            data: '{"building":"' + localStorage.building_assets + '","level":"' + localStorage.level_assets + '","area":"' + localStorage.area_assets + '","room_no":"' + localStorage.room_no_assets + '","description":"' + description + '","asset_primary_id":"' + asset_no + '","asset_class":"' + localStorage.filter + '"}',
            success: function (data) {
                var table = null;
                $('#AssetsLoader').fadeOut(500);

                if (data.rows > 0) {

                    var str = '{"data" : [';
                    for (var k = 0; k < data.rows; k++) {
                        if ((data.rows - 1) == k) {
                            str += '["' + data.data[k].ASSET_ID + '|' + data.data[k].ASSET_DESCRIPTION + '","' +
                                data.data[k].ASSET_ID + '","' +
                                data.data[k].ASSET_ROOM_NO + '","' +
                                data.data[k].ASSET_AREA_NAME + '","' +
                                data.data[k].ASSET_DESCRIPTION + '"]';
                        } else {
                            str += '["' + data.data[k].ASSET_ID + '|' + data.data[k].ASSET_DESCRIPTION + '","' +
                                data.data[k].ASSET_ID + '","' +
                                data.data[k].ASSET_ROOM_NO + '","' +
                                data.data[k].ASSET_AREA_NAME + '","' +
                                data.data[k].ASSET_DESCRIPTION + '"],';
                        }
                    }
                    str += ']}'

                    str = replaceAll("\r\n", "", str);
                    str = replaceAll("\\", "|", str);

                    str = (JSON.parse(str));

                    table_dom = "#subAssetsTable";

                    table = createTable("#subAssetsTable", str.data);
                    $("#subAssetsTable .sorting_disabled input").prop("disabled", true); //Disable
                    $("#subLocationTable .sorting_disabled input").css({ "cursor": "none" });

                    var _table_id = table_dom.replace("#", "");
                    tableArr[_table_id] = table;

                    $('#subAssetsTable tbody').on('click', 'input[type="checkbox"]', function () {
                        setTimeout(function () {
                            if (checkboxSelectedLength('#subAssetsTable') > 0) {
                                $("#linkBtn").fadeIn(500);
                            } else {
                                $("#linkBtn").fadeOut(500);
                            }
                        }, 500);
                    });
                }
                else {
                    $('#searchView').fadeIn(500);
                    table = createTable("#subAssetsTable", data.data);
                    $("#subAssetsTable .sorting_disabled input").prop("disabled", true); //Disable
                    $("#subAssetsTable .sorting_disabled input:hover").css({ "cursor": "auto" });

                }
            },
            error: function (error) {
                swal.fire({
                    title: "Unexpected Error #42404",
                    text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'assets_not_linked'",
                    type: "error",
                    showCloseButton: true,
                    confirmButtonColor: "#C12E2A",
                    allowOutsideClick: true,
                });            }
        });

    }
}

function checkboxSelectedLength(id) {
    var lengthh = $(id + " input:checkbox:checked").length;
    return lengthh;
}

var allArr = {
    search_link_location: [],
    search_prim_level: [],
    search_prim_area: [],
    search_prim_room: [],
    search_prim_sublocation: [],

    search_sub_location: [],
    search_level: [],
    search_area: [],
    search_room_sub: [],
    search_asset_no_sub: []
};


function sub_location_filters() {
    /*Sub Location Filters*/
    getItems('../../ams_apis/slimTest/index.php/building_sub', 'search_link_location', 'scroll_link_Location', 'menu_link_location', 'empty_link_location');
    getItems('../../ams_apis/slimTest/index.php/asset_level_new_sub', 'search_prim_level', 'scrol_prim_level', 'menu_prim_level', 'empty_prim_level');
    getItems('../../ams_apis/slimTest/index.php/asset_area_sub', 'search_prim_area', 'scrol_prim_area', 'menu_prim_area', 'empty_prim_area');
    getItems('../../ams_apis/slimTest/index.php/asset_room_no_sub', 'search_prim_room', 'scrol_prim_room', 'menu_prim_room', 'empty_prim_room');
    getItems('../../ams_apis/slimTest/index.php/asset_link_al_no', 'search_prim_sublocation', 'scrol_prim_sublocation', 'menu_prim_sublocation', 'empty_prim_sublocation');
}
function assets_filters() {
    /**Assets*/
    getAssetsFilter('../../ams_apis/slimTest/index.php/building_assets', 'search_sub_location', 'scroll_sub_location', 'meun_sub_location', 'empty_sub_location');
    getAssetsFilter('../../ams_apis/slimTest/index.php/asset_level_new_assets', 'search_level', 'scroll_sub_level', 'menu_level', 'empty_level');
    getAssetsFilter('../../ams_apis/slimTest/index.php/asset_area_assets', 'search_area', 'scroll_area', 'menu_area', 'empty_area');
    getAssetsFilter('../../ams_apis/slimTest/index.php/asset_room_no_assets', 'search_room_sub', 'scrol_room_sub', 'menu_room_sub', 'empty_room_sub');
    getAssetsFilter('../../ams_apis/slimTest/index.php/asset_primary_id_view', 'search_asset_no_sub', 'scrol_asset_no_sub', 'menu_asset_no_sub', 'empty_asset_no_sub');
}

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
                },
                "className": "dt-center"
            },
            {
                "targets": -2,
                "orderable": false
            }, {
                'targets': -1,
                "render": function (data, type, row, meta) {
                    if (tableID == "#subLocationTable") {
                        return "<button type='button' class='btn btn-primary'><span class='fa fa-eye'></span></button>";
                    } else {
                        return data
                    }
                }
            }
        ],
        fnCreatedRow: function (nTd, nRow, aData, iDataIndex) {
            $(nRow).attr('id', aData[0]);
        }
    });

    return table;
}

function getItems(url, id, scrollArea, menuid) {


    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        data: '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","sub_location":"' + localStorage.sub_location + '"}',
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
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : #'"+id+"'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,
            });
        }
    })
}

function getAssetsFilter(url, id, scrollArea, menuid) {

    console.log('{"building":"' + localStorage.building_assets + '","level":"' + localStorage.level_assets + '","area":"' + localStorage.area_assets + '","room_no":"' + localStorage.room_no_assets + '","asset_primary_id":"' + localStorage.asset_no + '","asset_class":"' + localStorage.filter + '"}');

    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        data: '{"building":"' + localStorage.building_assets + '","level":"' + localStorage.level_assets + '","area":"' + localStorage.area_assets + '","room_no":"' + localStorage.room_no_assets + '","asset_primary_id":"' + localStorage.asset_no + '","asset_class":"' + localStorage.filter + '"}',
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
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : #'"+id+"'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,
            });
        }
    })
}


function clearSubfilters() {

    localStorage.building_assets = '';
    localStorage.area_assets = '';
    localStorage.level_assets = '';
    localStorage.room_no_assets = '';
    localStorage.sub_location = '';
    localStorage.asset_no = '';


    assets_filters();

    //building
    $('#search_sub_location').val("");
    $('#dropdown_sub_location').text("BUILDING");
    //level
    $('#search_level').val("");
    $('#sub_level_dropdown').text("LEVEL");
    //Area
    $('#search_area').val("");
    $('#area_dropdown').text("AREA");
    //room_no
    $('#search_room_sub').val("");
    $('#dropdown_room_sub').text("ROOM");
    //sub_location
    $('#search_prim_sublocation').val("");
    $('#dropdown_prim_sublocation').text("SUB LOCATION");
    //asset_id
    $('#search_asset_no_sub').val("");
    $('#dropdown_asset_no_sub').text("ASSET NUMBER");
    //description
    $('#sub_description').val("");

}

var count = 0;

var clusterize = {
    search_link_location: [],
    search_prim_level: [],
    search_prim_area: [],
    search_prim_room: []
};

function getSelectedAssets(assets) {
    var currentItem = "";
    // console.log($('#assetBody'));
    var assets_arr = assets;
    var send_assets = "";
    for (var i = 0; i < assets_arr.length; i++) {
        if (i == assets_arr.length - 1) {
            send_assets += "\'" + assets_arr[i] + "\'";
        } else {
            send_assets += "\'" + assets_arr[i] + "\',";
        }

    }
}

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

//=============================================================================================================set text on click====================================================================
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
// sublocation
$('#menu_prim_sublocation').on('click', '.dropdown-item', function () {
    $('#dropdown_prim_sublocation').text($(this)[0].value);
    localStorage.sub_location = $(this)[0].value;
    $('#clearAllFilters').prop('disabled', false);
    sub_location_filters();
    $("#dropdown_prim_sublocation").dropdown('toggle');
    $('#search_prim_sublocation').val($(this)[0].value);
});

// =======================================================================End Sub location menu onclick===========================================================

// =======================================================================Assets===========================================================

// Building
$('#meun_sub_location').on('click', '.dropdown-item', function () {
    $('#dropdown_sub_location').text($(this)[0].value);
    localStorage.building_assets = $(this)[0].value;
    $('#clearAllFilters').prop('disabled', false);
    assets_filters();
    $("#dropdown_sub_location").dropdown('toggle');
    $('#search_sub_location').val($(this)[0].value);
});

// level
$('#menu_level').on('click', '.dropdown-item', function () {
    $('#sub_level_dropdown').text($(this)[0].value);
    localStorage.level_assets = $(this)[0].value;
    $('#clearAllFilters').prop('disabled', false);
    assets_filters();
    $("#sub_level_dropdown").dropdown('toggle');
    $('#search_level').val($(this)[0].value);
});

// area
$('#menu_area').on('click', '.dropdown-item', function () {
    $('#area_dropdown').text($(this)[0].value);
    localStorage.area_assets = $(this)[0].value;
    $('#clearAllFilters').prop('disabled', false);
    assets_filters();
    $("#area_dropdown").dropdown('toggle');
    $('#search_area').val($(this)[0].value);
});

// room
$('#menu_room_sub').on('click', '.dropdown-item', function () {
    $('#dropdown_room_sub').text($(this)[0].value);
    localStorage.room_no_assets = $(this)[0].value;
    $('#clearAllFilters').prop('disabled', false);
    assets_filters();
    $("#dropdown_room_sub").dropdown('toggle');
    $('#search_room_sub').val($(this)[0].value);
});
// asset_no
$('#menu_asset_no_sub').on('click', '.dropdown-item', function () {
    $('#dropdown_asset_no_sub').text($(this)[0].value);
    localStorage.asset_no = $(this)[0].value;
    $('#clearAllFilters').prop('disabled', false);
    assets_filters();
    $("#dropdown_asset_no_sub").dropdown('toggle');
    $('#search_asset_no_sub').val($(this)[0].value);
});


// end assets menu  onclick 

//Department Dropdown Check
if (localStorage.dropdownFilter == "ALL EQUIPMENT") {

    // $('#class-options').append(new Option("ALL EQUIPMENT", "all_equip"));
    // $('#class-options').append(new Option("FACILITIES MANAGEMENT", "fac_equip"));

    // if (localStorage.filter == "IT EQUIPMENT" || localStorage.role == "ADMIN")
        $('#class-options').append(new Option("IT EQUIPMENT", "it_equip"));

    // $('#class-options').append(new Option("MEDICAL EQUIPMENT", "med_equip"));
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
    // $('#class-options').append(new Option(localStorage.filter, "user_class"));
    $('#class-options').append(new Option("IT EQUIPMENT", "user_class"));
    $('#class-options').css({ "-moz-appearance": "none" });
    $('#class-options').prop('disabled', 'disabled');
}


//function clear button
function clearData(input, btnDafualtId, text, emptyId) {
    var value = $(input).val();

    if (value.length > 0) {

        $(emptyId).css("display", "none");


        if (input == "#search_link_location") {

            document.getElementById('menu_link_location').innerHTML = '<div id="location_link_Loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_level').innerHTML = '<div id="prim_level_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_area').innerHTML = '<div id="prim_area_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_room').innerHTML = '<div id="prim_Room_load" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_sublocation').innerHTML = '<div id="prim_Room_load" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';

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
            //sub_location
            $('#search_prim_sublocation').val("");
            $('#dropdown_prim_sublocation').text("SUB LOCATION");


        } else if (input == "#search_prim_level") {
            document.getElementById('menu_prim_level').innerHTML = '<div id="prim_level_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_area').innerHTML = '<div id="prim_area_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_room').innerHTML = '<div id="prim_Room_load" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_sublocation').innerHTML = '<div id="prim_Room_load" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';

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
            //sub_location
            $('#search_prim_sublocation').val("");
            $('#dropdown_prim_sublocation').text("SUB LOCATION");

        } else if (input == "#search_prim_area") {
            document.getElementById('menu_prim_area').innerHTML = '<div id="prim_area_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_room').innerHTML = '<div id="prim_Room_load" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_sublocation').innerHTML = '<div id="prim_Room_load" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';

            sub_location_filters();

            //Area
            $('#search_prim_area').val("");
            $('#dropdown_prim_area').text("AREA");
            //room_no
            $('#search_prim_room').val("");
            $('#dropdown_prim_room').text("ROOM");
            //sub_location
            $('#search_prim_sublocation').val("");
            $('#dropdown_prim_sublocation').text("SUB LOCATION");
        }
        else if (input == "#search_prim_room") {
            document.getElementById('menu_prim_room').innerHTML = '<div id="prim_Room_load" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_prim_sublocation').innerHTML = '<div id="prim_Room_load" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.room_no = '';
            localStorage.sub_location = '';
            sub_location_filters();

            //room_no
            $('#search_prim_room').val("");
            $('#dropdown_prim_room').text("ROOM");
            //sub_location
            $('#search_prim_sublocation').val("");
            $('#dropdown_prim_sublocation').text("SUB LOCATION");
        }

        else if (input == "#search_prim_sublocation") {
            document.getElementById('menu_prim_sublocation').innerHTML = '<div id="prim_Room_load" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.sub_location = '';
            sub_location_filters();

            //sub_location
            $('#search_prim_sublocation').val("");
            $('#dropdown_prim_sublocation').text("SUB LOCATION");
        }

        //asset table
        else if (input == "#search_sub_location") {

            document.getElementById('meun_sub_location').innerHTML = '<div id="sub_location_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_level').innerHTML = '<div id="levelLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_area').innerHTML = '<div id="menu_area_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_room_sub').innerHTML = '<div id="sub_room_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_asset_no_sub').innerHTML = '<div id="sub_room_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.building_assets = '';
            localStorage.level_assets = '';
            localStorage.area_assets = '';
            localStorage.room_no_assets = '';
            localStorage.asset_no = '';

            assets_filters();

            //building
            $('#search_sub_location').val("");
            $('#dropdown_sub_location').text("BUILDING");
            //level
            $('#search_level').val("");
            $('#sub_level_dropdown').text("LEVEL");
            //Area
            $('#search_area').val("");
            $('#area_dropdown').text("AREA");
            //room_no
            $('#search_room_sub').val("");
            $('#dropdown_room_sub').text("ROOM");
            //asset sub
            $('#search_asset_no_sub').val("");
            $('#dropdown_asset_no_sub').text("ASSET NUMBER");
            //description
            $('#sub_description').val("");

        }
        else if (input == "#search_level") {
            document.getElementById('menu_level').innerHTML = '<div id="levelLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_area').innerHTML = '<div id="menu_area_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_room_sub').innerHTML = '<div id="sub_room_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_asset_no_sub').innerHTML = '<div id="sub_room_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.level_assets = '';
            localStorage.area_assets = '';
            localStorage.room_no_assets = '';
            localStorage.asset_no = '';

            assets_filters();

            //level
            $('#search_level').val("");
            $('#sub_level_dropdown').text("LEVEL");
            //Area
            $('#search_area').val("");
            $('#area_dropdown').text("AREA");
            //room_no
            $('#search_room_sub').val("");
            $('#dropdown_room_sub').text("ROOM");
            //asset sub
            $('#search_asset_no_sub').val("");
            $('#dropdown_asset_no_sub').text("ASSET NUMBER");
            //description
            $('#sub_description').val("");
        }
        else if (input == "#search_area") {
            document.getElementById('menu_area').innerHTML = '<div id="menu_area_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_room_sub').innerHTML = '<div id="sub_room_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_asset_no_sub').innerHTML = '<div id="sub_room_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.area_assets = '';
            localStorage.room_no_assets = '';
            localStorage.asset_no = '';

            assets_filters();

            //Area
            $('#search_area').val("");
            $('#area_dropdown').text("AREA");
            //room_no
            $('#search_room_sub').val("");
            $('#dropdown_room_sub').text("ROOM");
            //asset sub
            $('#search_asset_no_sub').val("");
            $('#dropdown_asset_no_sub').text("ASSET NUMBER");
            //description
            $('#sub_description').val("");
        }
        else if ("#search_room_sub") {

            document.getElementById('menu_asset_no_sub').innerHTML = '<div id="sub_room_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_room_sub').innerHTML = '<div id="sub_room_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.room_no_assets = '';
            localStorage.asset_no = '';

            assets_filters();
            //asset sub
            $('#search_asset_no_sub').val("");
            $('#dropdown_asset_no_sub').text("ASSET NUMBER");
            //room
            $('#search_room_sub').val("");
            $('#dropdown_room_sub').text("ROOM");
            //description
            $('#sub_description').val("");

        }
        else if ("#search_asset_no_sub") {

            document.getElementById('menu_asset_no_sub').innerHTML = '<div id="sub_room_loader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.asset_no = '';

            assets_filters();
            //asset sub
            $('#search_asset_no_sub').val("");
            $('#dropdown_asset_no_sub').text("ASSET NUMBER");
            //description
            $('#sub_description').val("");

        }
    }
}

function linkAssets(id) {

    if (asset_link.al_no == null) {
        swal.fire({
            title: "Error",
            text: "Sub Location is required",
            type: "error",
            allowOutsideClick: true,

        }).then(function (result) {
            if (result.value) {

            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {

            }
        });

    } else {

        var newArr = [];
        var rows_selected = tableArr["subAssetsTable"].column(0).checkboxes.selected();
        for (var i = 0; i < rows_selected.length; i++) {
            newArr.push(rows_selected[i]);
        }

        var arrAPI = [];

        $.ajax({
            url: '../../ams_apis/slimTest/index.php/getAssets_al_no',
            method: 'POST',
            data: '{"al_no":"' + asset_link.al_no + '"}',
            dataType: 'JSON',
            success: function (data) {
                
                if (data.data == "Error") {
                    data.data = [];
                }
                for (var i = 0; i < data.data.length; i++) {
                    newArr.push((data.data[i])["A_A"]);
                }

                var arr = [];
                var values = [];

                for (var i = 0; i < newArr.length; i++) {
                    var value = newArr[i].split("|");
                    values.push(newArr[i].split("|"));
                    arr.push(value[0]);
                }

                asset_link.selected_assets = createAssetDelimeter(arr);

                var assets_selected = "<select id='primary_asset_id' class='form-control dropdown' required>";
                assets_selected += "<option value='0' selected disabled>Select Primary Asset Id</option>";
                for (var i = 0; i < arr.length; i++) {
                    assets_selected += "<option value='" + (values[i])[0] + "' >" + (values[i])[0] + " - " + (values[i])[1] + "</option>"
                }
                assets_selected += "</select>";
                showDropdown(assets_selected);

            },
            error: function (error) {
                swal.fire({
                    title: "Unexpected Error #42404",
                    text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'getAssets_al_no'",
                    type: "error",
                    showCloseButton: true,
                    confirmButtonColor: "#C12E2A",
                    allowOutsideClick: true,
                });
            }


        });
    }

    function showDropdown(assets_selected) {
        swal.fire({
            title: "assign a primary asset",
            html: assets_selected,
            allowOutsideClick: false,
            confirmButtonColor: "#419641",
            showCancelButton: true,
            cancelButtonColor: "#C12E2A",
            closeOnConfirm: false,
            showCloseButton: true,
            showLoaderOnConfirm: true,
            cancelButtonText: "Cancel!"

        }).then(function (result) {
            if (result.value) {
                var e = document.getElementById("primary_asset_id"),
                    p_id = e.options[e.selectedIndex].value;
                if (p_id == 0) {
                    showToast(assets_selected)
                } else {
                    confirmLink(p_id);
                }
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {

            }
        })
    }
}

function confirmLink() {
    var e = document.getElementById("primary_asset_id");
    var p_id = e.options[e.selectedIndex].value;
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/link_assets",
        method: "POST",
        data: '{"al_no":"' + asset_link.al_no + '","assetIds" : "' + asset_link.selected_assets + '","primary_asset_id" : "' + p_id + '","username":"' + localStorage.username + '"}',
        dataType: "JSON",
        success: function (data) {
            if (data.data == "LINK WAS SUCCESSFUL") {
                searchasset()
                search();

                swal.fire({
                    title: "Assignment Success",
                    text: data.data,
                    type: "success",
                    showCloseButton: true,
                    allowOutsideClick: true,

                }).then(function (result) {
                    if (result.value) {

                    } else if (
                        result.dismiss === Swal.DismissReason.cancel
                    ) {

                    }
                })

            }
            else if (data.data == "LINK WAS NOT SUCCESSFUL") {
                searchasset()
                search();
                swal.fire({
                    title: "Assignment Failed",
                    text: data.data,
                    showCloseButton: true,
                    type: "error",
                    allowOutsideClick: true,

                }).then(function (result) {
                    if (result.value) {

                    } else if (
                        result.dismiss === Swal.DismissReason.cancel
                    ) {

                    }
                })
            }
            asset_link = {
                al_no: null,
                selected_assets: null
            }
        },
        error: function (errr) {
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'link_assets'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,
            });
        }
    });
}


function unlinkSub(assetId) {

    var building = document.getElementById('search_sub_location').value,
        level = document.getElementById('search_level').value,
        area = document.getElementById('search_area').value,
        room_no = document.getElementById('search_room_sub').value;
    description = document.getElementById('sub_description').value;


    var results = (building + " - " + level + " - " + area + " - " + room_no + " - " + description);

    $.ajax({
        url: "../../ams_apis/slimTest/index.php/unlink_assets",
        method: "POST",
        dataType: "JSON",
        data: '{"assetid" :"' + assetId + '","username" :"' + localStorage.username + '"}',
        success: function (data) {

            if (data.data == "UNLINK WAS SUCCESSFUL") {
                if (" -  -  -  - " !== results) {
                    searchasset();
                }

                closeAsset('overlay-asset');
                search();
                swal.fire({
                    title: "Unlink Success",
                    text: data.data,
                    type: "success",
                    allowOutsideClick: true,

                }).then(function (result) {
                    if (result.value) {

                    } else if (
                        result.dismiss === Swal.DismissReason.cancel
                    ) {

                    }
                })

            } else {
                searchasset()
                search();
                swal.fire({
                    title: "Unlink Failed",
                    text: data.data,
                    type: "error",
                    allowOutsideClick: true,

                }).then(function (result) {
                    if (result.value) {

                    } else if (
                        result.dismiss === Swal.DismissReason.cancel
                    ) {

                    }
                })
            }
        },
        error: function (err) {
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'unlink_assets'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,
            });
        }
    });
}


var onSearch = function (btn_id,table, searchValue, emptyId) {

    var getId = searchValue;

    var found = false;

    var rows = allArr[searchValue];

    document.getElementById(searchValue).onkeypress = function (e) {
        var value = searchValue.value;

        if (e.keyCode == 13 && table == "searchWith") {
            e.preventDefault();

            if (value.length>0) {
                setValueBtn(btn_id, value);
                search();
            }
        }

        if (e.keyCode == 13 && table == "subSearch") {
            e.preventDefault();
            if (value.length>0) {
                setValueBtn(btn_id, value);
                searchasset();
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
        var resObj = checkFilter(getId);
        $('#dropdown_location').text($(this)[0].value);
        $('#' + resObj.btnId).text(resObj.btnContent);

        if (table == "searchWith") {
            clearLocalStorrageSubLocation();
            sub_location_filters();
        }

        if (table == "subSearch") {
            clearLocalStorrageSubAssets();
            assets_filters();
        }
    }

    if (found) {
        $(emptyId).css("display", "none");
    } else {
        $(emptyId).css("display", "block");
    }

    clusterize[getId].update(filterRows(rows));
}

var onSearch_new = function (table, searchValue) {
    document.getElementById(searchValue).onkeypress = function (e) {

        if (e.keyCode == 13 && table == "searchWith") {
            e.preventDefault();
            search();
        }

        if (e.keyCode == 13 && table == "subSearch") {
            e.preventDefault();
            searchasset();
        }

    }
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