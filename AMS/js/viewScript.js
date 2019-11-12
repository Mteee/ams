/*!
 * AME SYSADMIN Library JS
 * website
 * Copyright AME SOFTWARE DEVELOPMENT TEAM (Talent & Melusi)
 * Released under the AME license
 * Date: 2019-07-29
 */
//Clear Local Storage
clearLocalStorageFilters();

//check for filter in local storage
if (localStorage.backupFilter == undefined || localStorage.backupFilter == "undefined") {
    localStorage.backupFilter = localStorage.filter;
} else {
    localStorage.filter = localStorage.backupFilter;
}

window.onload = function () {
    if (localStorage.building !== '' || localStorage.level !== '' || localStorage.area !== '' || localStorage.room_no !== '') {
        clearLocalStorageFilters();
        populate_dropdown();
    }
}

$('#searchView').fadeIn(500);

var user_class = localStorage.getItem("filter");

$('.user-class option').text(user_class);

// console.log(user_class);

function closeAsset(id) {
    document.getElementById(id).style.display = "none"
}

function viewAsset(assetId) {
    var currentItem = "";
    // console.log($('#assetBody'));
    // $('#assetBody')['0'].innerHTML = assetId;
    console.log('{"primary_asset_id" :"' + assetId + '"}');

    $.ajax({
        url: "../../ams_apis/slimTest/index.php/singleAsset",
        method: "POST",
        dataType: "JSON",
        data: '{"primary_asset_id" :"' + assetId + '"}',
        success: function (data) {
            // console.log("success");
            document.getElementById('viewAssets').innerHTML = data[0].table;
            document.getElementById('subItemCount').innerText = data[0].items;
            document.getElementById('overlay-asset').style.display = "block";
        },
        error: function (err) {
            console.log(err);
            console.log("error");

            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za)",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,

            })

        }
    });
}

var table_data = { currentAssetsTable: [] }

function search() {

    var building = document.getElementById('search_view_building').value,
        level = document.getElementById('search_view_level').value,
        area = document.getElementById('search_view_area').value,
        room_no = document.getElementById('search_view_room').value;
    description = document.getElementById('view_description').value;
    sub_location = document.getElementById('search_view_sublocaction').value;
    asset_primary_id = document.getElementById('search_view_assetNo').value;

    var results = (building + " - " + level + " - " + area + " - " + room_no + " - " + description + " - " + sub_location + " - " + asset_primary_id);
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

        console.log('{"building" :"' + building + '","level" : "' + level + '","area" : "' + area + '","room_no" : "' + room_no + '","description" : "' + description + '","sub_location" : "' + sub_location + '","asset_primary_id" : "' + asset_primary_id + '","asset_class":"' + localStorage.filter + '"}');

        $.ajax({
            url: "../../ams_apis/slimTest/index.php/getAssets",
            type: "POST",
            dataType: 'json',
            data: '{"building" :"' + building + '","level" : "' + level + '","area" : "' + area + '","room_no" : "' + room_no + '","description" : "' + description + '","sub_location" : "' + sub_location + '","asset_primary_id" : "' + asset_primary_id + '","asset_class":"' + localStorage.filter + '"}',
            success: function (data) {
                $('#loader').fadeOut(500);

                console.log("======================data===============================");
                console.log(data);
                var table = null;
                console.log("================test===============================");
                // console.log(data);
                // console.log(data.data.ASSET_IS_SUB);


                if (data.rows > 0) {

                    var str = '{"data" : [';
                    for (var k = 0; k < data.rows; k++) {
                        if ((data.rows - 1) == k) {

                            str += '["' + data.data[k].ASSET_ID + '","';
                            str += data.data[k].ASSET_ID + '","';
                            str += data.data[k].ASSET_SUB_LOCATION + '","';
                            str += data.data[k].ASSET_ROOM_NO + '","';
                            str += data.data[k].ASSET_AREA + '","';
                            str += replaceAll("\"", "`", data.data[k].ASSET_DESCRIPTION) + '","';
                            str += updateLetterToIcon(data.data[k].ASSET_HAS_SUB_ASSETS) + '"]';
                        } else {

                            str += '["' + data.data[k].ASSET_ID + '","';
                            str += data.data[k].ASSET_ID + '","';
                            str += data.data[k].ASSET_SUB_LOCATION + '","';
                            str += data.data[k].ASSET_ROOM_NO + '","';
                            str += data.data[k].ASSET_AREA + '","';
                            str += replaceAll("\"", "`", data.data[k].ASSET_DESCRIPTION) + '","';
                            str += updateLetterToIcon(data.data[k].ASSET_HAS_SUB_ASSETS) + '"],';
                        }
                    }

                    str += ']}'

                    str = replaceAll("\n", "", str);
                    str = (JSON.parse(str));

                    table_data["currentAssetsTable"] = createTable("#currentAssetsTable", str.data);

                }
                else {

                    table_data["currentAssetsTable"] = createTable("#currentAssetsTable", data.data);

                }
                $('#printAssets').hide();
                $('#currentAssetsTable tbody,#currentAssetsTable thead').on('click', 'input[type="checkbox"]', function () {

                    setTimeout(function () {
                        console.log(checkboxSelectedLength());
                        if (checkboxSelectedLength() > 0) {
                            $('#printAssets').show(400);
                        } else {
                            $('#printAssets').hide(400);
                        }
                    }, 500);
                });

                $('#currentAssetsTable tbody').on('click', 'button[name="view"]', function () {
                    var data = table_data["currentAssetsTable"].row($(this).parents('tr')).data();
                    viewAsset(data[0]);
                });

                $('#currentAssetsTable tbody').on('click', 'button[name="edit"]', function () {
                    var data = table_data["currentAssetsTable"].row($(this).parents('tr')).data();
                    editView(data[0]);
                });

                // $('#printAssetsView').fadeIn(500);

            },
            error: function (err) {
                console.log(err)
                $('#searchView').fadeIn(500);
                $('#loader').hide();

                swal.fire({
                    title: "Unexpected Error #43200",
                    text: "An error has occured, please contact admin (amsdev@ialch.co.za)",
                    type: "error",
                    showCloseButton: true,
                    confirmButtonColor: "#C12E2A",
                    allowOutsideClick: true,

                })
            }
        });

    }
}

function editView(id) {
    $("#overlay-assets-edit").show();
    document.getElementById("asset_number").innerHTML = "<strong>" + id + "</strong>";

    $.ajax({
        url: '../../ams_apis/slimTest/index.php/edit_assets',
        method: 'POST',
        dataType: 'JSON',
        data: '{"asset_id":"' + id + '"}',
        success: function (data) {
            console.log(data[0].data);
            if (data[0].rows == 1) {
                $("#edit_loader").hide();
                document.getElementById("assets_body_edit").innerHTML = data[0].data;
            }
        }
    })
}

$("#update_assets").off().on('click',function(e){
    var asset_model = document.getElementById("").value,
        asset_service_date = document.getElementById("").value,
        asset_type
});

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
                "defaultContent": "<button type='button' name='view' class='btn btn-primary'><span class='fa fa-eye'></span></button>" +
                    " <button type='button' name='edit' class='btn btn-info'><span class='fa fa-edit'></span></button>"
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

    $('#frm-example').on('submit', function (e) {
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

        viewPrintAssets(rowsSelected);
        // Remove added elements
        $('input[name="id\[\]"]', form).remove();

        e.preventDefault();

    });


    return table;
}

function viewPrintAssets(assets) {

    var currentItem = "";

    console.log(assets);

    var assets_arr = assets;
    var send_assets = "";
    for (var i = 0; i < assets_arr.length; i++) {
        if (i == assets_arr.length - 1) {
            send_assets += "\'" + assets_arr[i] + "\'";
        } else {
            send_assets += "\'" + assets_arr[i] + "\',";
        }

    }

    $.ajax({
        // url: "assets.json",
        url: "../../ams_apis/slimTest/index.php/printView",
        method: "post",
        data: '{"asset_class":"","primary_asset_id" : "' + send_assets + '"}',
        dataType: "json",
        success: function (data) {
            var html_view = "";
            var p_count = 0;
            var count = 0;
            if (data.rows > 0) {
                for (var i = 0; i < data.rows; i++) {
                    var sub_info = "";
                    var th_primary = "<tr style='background:#222;color:#ffffff;'>";
                    if (data.data[i].ASSET_ID == data.data[i].ASSET_PRIMARY_ID) {
                        p_count++;
                        count = 0;
                        console.log(data.data[i].PRI_HAS_SUB);
                        if (data.data[i].PRI_HAS_SUB == "y") {
                            th_primary += "<td class='text-center'><span class='toggle-btn' onclick=\"toggle_subs('.sub" + p_count + "')\"> + </span></td>";
                        } else {
                            th_primary += "<td class='text-center'> - </td>";
                        }

                        th_primary += "<td>" + data.data[i].ASSET_AREA + "</td><td>" + data.data[i].ASSET_ROOM_NO + "</td><td>" + data.data[i].ASSET_ID + "</td><td>" + data.data[i].ASSET_DESCRIPTION + "</td></tr>";
                        html_view += th_primary;
                    } else {
                        sub_info += "<tr class='sub" + p_count + "'><td class='text-center'>" + (count) + "</td>";

                        sub_info += "<td colspan='2'><td>" + data.data[i].ASSET_ID + "</td><td>" + data.data[i].ASSET_DESCRIPTION + "</td></tr>";
                        html_view += sub_info;
                    }
                    count++;
                }

                document.getElementById('tbodyPrint').innerHTML = html_view;
                document.getElementById('overlay-printView').style.display = "block";
            }
            else {
                // swal.fire({
                //     title: "Nothing Selected",
                //     text: "Please select at least one item to print",
                //     type: "error",
                //     showCloseButton: true,
                //     confirmButtonColor: "#C12E2A",
                //     allowOutsideClick: true,

                // })
            }
        },
        error: function (err) {
            console.log(err);

            swal.fire({
                title: "Unexpected Error #44404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za)",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,

            })
        }
    });
}

function toggle_subs(sub_class) {
    $(sub_class).slideToggle('fast');
}

//table export
function doit(type, fn, dl) {
    var elt = document.getElementById(fn);
    var wb = XLSX.utils.table_to_book(elt, { sheet: fn });

    return dl ?
        XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
        XLSX.writeFile(wb, 'Assets Selected ' + fn + " ." + (type || 'xlsx') || ('test.' + (type || 'xlsx')));
}

function checkboxSelectedLength() {
    var lengthh = $(":checkbox:checked").length;
    return lengthh;
}

// Building
$('#menu_view_building').on('click', '.dropdown-item', function () {
    $('#building_view_filter').text($(this)[0].value);
    localStorage.building = $(this)[0].value;
    populate_dropdown();
    $("#building_view_filter").dropdown('toggle');
    $('#search_view_building').val($(this)[0].value);
});

// level
$('#menu_view_level').on('click', '.dropdown-item', function () {
    $('#level_view_filter').text($(this)[0].value);
    localStorage.level = $(this)[0].value;
    populate_dropdown();
    $("#level_view_filter").dropdown('toggle');
    $('#search_view_level').val($(this)[0].value);
});

// area
$('#meun_view_area').on('click', '.dropdown-item', function () {
    $('#area_view_filter').text($(this)[0].value);
    localStorage.area = $(this)[0].value;
    populate_dropdown();
    $("#area_view_filter").dropdown('toggle');
    $('#search_view_area').val($(this)[0].value);
});

// room
$('#menu_view_room').on('click', '.dropdown-item', function () {
    $('#room_view_filter').text($(this)[0].value);
    localStorage.room_no = $(this)[0].value;
    populate_dropdown();
    $("#room_view_filter").dropdown('toggle');
    $('#search_view_room').val($(this)[0].value);
});
// sub location
$('#menu_view_sublocaction').on('click', '.dropdown-item', function () {
    $('#sublocaction_view_filter').text($(this)[0].value);
    localStorage.sub_location = $(this)[0].value;
    populate_dropdown();
    $("#sublocaction_view_filter").dropdown('toggle');
    $('#search_view_sublocaction').val($(this)[0].value);
});

// aasset Id
$('#menu_view_assetNo').on('click', '.dropdown-item', function () {
    $('#assetNo_view_filter').text($(this)[0].value);
    localStorage.asset_primary_id = $(this)[0].value;
    populate_dropdown();
    $("#assetNo_view_filter").dropdown('toggle');
    $('#search_view_assetNo').val($(this)[0].value);
});

function populate_dropdown() {

    //asset No
    getItems('../../ams_apis/slimTest/index.php/asset_primary_view_v', 'search_view_assetNo', 'scroll_view_assetNo', 'menu_view_assetNo', 'empty_view_assetNo');
    //sub location
    getItems('../../ams_apis/slimTest/index.php/asset_sub_location_view_v', 'search_view_sublocaction', 'scroll_view_sublocaction', 'menu_view_sublocaction', 'empty_view_sublocaction');
    // get room
    getItems('../../ams_apis/slimTest/index.php/asset_room_no_view_v', 'search_view_room', 'scroll_view_room', 'menu_view_room', 'empty_view_room');
    // get area
    getItems('../../ams_apis/slimTest/index.php/asset_area_view_v', 'search_view_area', 'scroll_view_area', 'meun_view_area', 'empty_view_area');
    // get level
    getItems('../../ams_apis/slimTest/index.php/asset_level_new_view_v', 'search_view_level', 'scroll_view_level', 'menu_view_level', 'empty_view_level');
    // get building
    getItems('../../ams_apis/slimTest/index.php/building_view_v', 'search_view_building', 'scroll_view_building', 'menu_view_building', 'empty_view_building');

}

populate_dropdown();

var allArr = {
    search_view_room: [],
    search_view_area: [],
    search_view_level: [],
    search_view_building: [],
    search_view_sublocaction: [],
    search_view_assetNo: []
};

function onItemSelect(menuId) {

    $('#menuAssets').on('click', '.dropdown-item', function () {
        // $('#dropdown_assets').text()
        console.log($(this)[0].value);
    });

}

function setSearchValues(a, b, c) {
    // button
    $('#dropdown_assets').text(a);
    $('#dropdown_room').text(b);
    $('#dropdown_location').text(c);

    // input
    $('#searchasset').val(a);
    $('#searchroomno').val(b);
    $('#searchlocation').val(c);
}

function getItems(url, id, scrollArea, menuid) {

    console.log('{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","sub_location":"' + localStorage.sub_location + '","asset_primary_id":"' + localStorage.asset_primary_id + '","asset_class":"' + localStorage.filter + '"}');

    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        data: '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","sub_location":"' + localStorage.sub_location + '","asset_primary_id":"' + localStorage.asset_primary_id + '","asset_class":"' + localStorage.filter + '"}',
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

var clusterize = {
    search_view_room: [],
    search_view_area: [],
    search_view_level: [],
    search_view_building: [],
    search_view_sublocaction: [],
    search_view_assetNo: []
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

function checkFilter(key) {
    var res = {};

    switch (key) {
        case "search_view_building":
            res = { "btnId": "building_view_filter", "btnContent": "BUILDING" };

            document.getElementById('menu_view_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_view_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            $('#search_view_building').val("");
            $('#building_view_filter').text("BUILDING");
            $('#search_view_level').val("");
            $('#level_view_filter').text("LEVEL");
            $('#search_view_area').val("");
            $('#area_view_filter').text("AREA");
            $('#search_view_room').val("");
            $('#room_view_filter').text("ROOM");
            $('#search_view_sublocaction').val("");
            $('#sublocaction_view_filter').text("SUB LOCATION");
            $('#search_view_assetNo').val("");
            $('#assetNo_view_filter').text("ASSET NO");


            localStorage.building = '';
            localStorage.area = '';
            localStorage.level = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';
            break;
        case "search_view_level":
            res = { "btnId": "level_view_filter", "btnContent": "LEVEL" };

            document.getElementById('menu_view_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_view_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            $('#search_view_level').val("");
            $('#level_view_filter').text("LEVEL");
            $('#search_view_area').val("");
            $('#area_view_filter').text("AREA");
            $('#search_view_room').val("");
            $('#room_view_filter').text("ROOM");
            $('#search_view_sublocaction').val("");
            $('#sublocaction_view_filter').text("SUB LOCATION");
            $('#search_view_assetNo').val("");
            $('#assetNo_view_filter').text("ASSET NO");

            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            break;

        case "search_view_area":
            res = { "btnId": "area_view_filter", "btnContent": "AREA" };

            document.getElementById('meun_view_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            $('#search_view_area').val("");
            $('#area_view_filter').text("AREA");
            $('#search_view_room').val("");
            $('#room_view_filter').text("ROOM");
            $('#search_view_sublocaction').val("");
            $('#sublocaction_view_filter').text("SUB LOCATION");
            $('#search_view_assetNo').val("");
            $('#assetNo_view_filter').text("ASSET NO");

            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            break;

        case "search_view_room":
            res = { "btnId": "room_view_filter", "btnContent": "ROOM" };

            document.getElementById('menu_view_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            $('#search_view_room').val("");
            $('#room_view_filter').text("ROOM");
            $('#search_view_sublocaction').val("");
            $('#sublocaction_view_filter').text("SUB LOCATION");
            $('#search_view_assetNo').val("");
            $('#assetNo_view_filter').text("ASSET NO");

            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            break;

        case "search_view_sublocaction":
            res = { "btnId": "sublocaction_view_filter", "btnContent": "SUB LOCATION" };

            document.getElementById('menu_view_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            $('#search_view_sublocaction').val("");
            $('#sublocaction_view_filter').text("SUB LOCATION");
            $('#search_view_assetNo').val("");
            $('#assetNo_view_filter').text("ASSET NO");

            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            break;

        case "search_view_assetNo":
            res = { "btnId": "assetNo_view_filter", "btnContent": "ASSET NO" };

            document.getElementById('menu_view_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            $('#search_view_assetNo').val("");
            $('#assetNo_view_filter').text("ASSET NO");

            localStorage.asset_primary_id = '';

            break;

        default:
            res = { "btnId": "not found", "btnContent": "not found" };
            break;
    }

    return res;
}

var onSearch = function (btn_id, searchValue, emptyId) {

    var getId = searchValue;

    var found = false;
    // console.log(localStorage.getItem("rows"));

    // var rows = JSON.parse(localStorage.getItem(searchValue));
    var rows = allArr[searchValue];

    document.getElementById(searchValue).onkeypress = function (e) {

        console.log(e.keyCode);
        if (e.keyCode == 13) {
            e.preventDefault();
            var value = searchValue.value;

            if (value.length) {

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


function clearData(input, btnDafualtId, text) {
    // var inputData = document.getElementById(input).(val);
    var value = $(input).val();

    if (value.length > 0) {

        if (input == "#search_view_building") {

            document.getElementById('menu_view_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_view_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            populate_dropdown();

            $(input).val("");
            $(btnDafualtId).text(text);

            $('#search_view_building').val("");
            $('#building_view_filter').text("BUILDING");
            $('#search_view_level').val("");
            $('#level_view_filter').text("LEVEL");
            $('#search_view_area').val("");
            $('#area_view_filter').text("AREA");
            $('#search_view_room').val("");
            $('#room_view_filter').text("ROOM");
            $('#search_view_sublocaction').val("");
            $('#sublocaction_view_filter').text("SUB LOCATION");
            $('#search_view_assetNo').val("");
            $('#assetNo_view_filter').text("ASSET NO");


        } else if (input == "#search_view_level") {

            document.getElementById('menu_view_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_view_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';
            populate_dropdown();

            $(input).val("");
            $(btnDafualtId).text(text);

            $('#search_view_level').val("");
            $('#level_view_filter').text("LEVEL");
            $('#search_view_area').val("");
            $('#area_view_filter').text("AREA");
            $('#search_view_room').val("");
            $('#room_view_filter').text("ROOM");
            $('#search_view_sublocaction').val("");
            $('#sublocaction_view_filter').text("SUB LOCATION");
            $('#search_view_assetNo').val("");
            $('#assetNo_view_filter').text("ASSET NO");

        } else if (input == "#search_view_area") {

            document.getElementById('menu_view_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_view_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            populate_dropdown();

            $('#search_view_area').val("");
            $('#area_view_filter').text("AREA");
            $('#search_view_room').val("");
            $('#room_view_filter').text("ROOM");
            $('#search_view_sublocaction').val("");
            $('#sublocaction_view_filter').text("SUB LOCATION");
            $('#search_view_assetNo').val("");
            $('#assetNo_view_filter').text("ASSET NO");

        } else if (input == "#search_view_room") {

            document.getElementById('menu_view_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            populate_dropdown();

            $('#search_view_room').val("");
            $('#room_view_filter').text("ROOM");
            $('#search_view_sublocaction').val("");
            $('#sublocaction_view_filter').text("SUB LOCATION");
            $('#search_view_assetNo').val("");
            $('#assetNo_view_filter').text("ASSET NO");

        } else if (input == "#search_view_sublocaction") {

            document.getElementById('menu_view_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            populate_dropdown();

            $('#search_view_sublocaction').val("");
            $('#sublocaction_view_filter').text("SUB LOCATION");
            $('#search_view_assetNo').val("");
            $('#assetNo_view_filter').text("ASSET NO");


        } else if (input == "#search_view_assetNo") {

            document.getElementById('menu_view_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.asset_primary_id = '';

            populate_dropdown();

            $('#search_view_assetNo').val("");
            $('#assetNo_view_filter').text("ASSET NO");

        }

        // if (btnDafualtId == "#dropdown_approve_room") {
        //     populate_room();
        //     $(input).val("");
        //     $(btnDafualtId).text(text);
        // }
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

    });

} else {
    toogleSub(localStorage.filter);
    $('#class-options').append(new Option(localStorage.filter, "user_class"));
    $('#class-options').css({ "-moz-appearance": "none" });
    $('#class-options').prop('disabled', 'disabled');
}

function clearLocalStorageFilters() {
    localStorage.building = '';
    localStorage.level = '';
    localStorage.area = '';
    localStorage.room_no = '';
    localStorage.sub_location = '';
    localStorage.asset_primary_id = '';

    $('#search_view_building').val("");
    $('#search_view_level').val("");
    $('#search_view_area').val("");
    $('#search_view_room').val("");
    $('#search_view_sublocaction').val("");
    $('#search_view_assetNo').val("");
}

function cleaAllFilters() {

    clearLocalStorageFilters();
    populate_dropdown();

    $('#building_view_filter').text("BUILDING");
    $('#level_view_filter').text("LEVEL");
    $('#area_view_filter').text("AREA");
    $('#room_view_filter').text("ROOM");
    $('#sublocation_view_filter').text("SUB LOCATION");
    $('#assetNo_view_filter').text("ASSET NO");

    //description
    $('#view_description').val("");
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
