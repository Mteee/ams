/*!
 * AME SYSADMIN Library JS
 * website
 * Copyright AME SOFTWARE DEVELOPMENT TEAM (Talent & Melusi)
 * Released under the AME license
 * Date: 2019-07-29
 */

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

clearLocalStorageFilters();

if (localStorage.backupFilter == undefined) {
    window.close();
}

//refreshh local storage on load
window.onload = function () {
    if (localStorage.building !== '' || localStorage.level !== '' || localStorage.area !== '' || localStorage.room_no !== '') {
        localStorage.building = '';
        localStorage.level = '';
        localStorage.area = '';
        localStorage.room_no = '';
        localStorage.sub_location = '';
        localStorage.asset_primary_id = '';
        populate_dropdown();
    }
}

//check for filter in local storage || all asset users
if (localStorage.backupFilter == undefined || localStorage.backupFilter == "undefined") {
    localStorage.backupFilter = localStorage.filter;
} else {
    localStorage.filter = localStorage.backupFilter;
}

// window.onload = function () {
//     console.log('here');

//     if (localStorage.building != '' || localStorage.level != '' || localStorage.area != '') {
//         console.log('here');
//         localStorage.building = '';
//         localStorage.area = '';
//         localStorage.level = '';
//         // populate_dropdown();
//     }
// }

$('#searchView').fadeIn(500);

var user_class = localStorage.getItem("filter");

$('.user-class option').text(user_class);

// console.log(user_class);

function closeAsset(overlay_id) {
    document.getElementById(overlay_id).style.display = "none";
}

function viewAsset(assetId) {
    var currentItem = "";
    document.getElementById('overlay-asset').style.display = "block";
    // console.log($('#assetBody'));
    $('#assetBody')['0'].innerHTML = assetId;

    console.log("eye-icon");
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
        },
        error: function (err) {
            console.log(err);
            // console.log("error");

        }
    });
}

var tableArr = {
    currentAssetsTable: [],
    inAssetsTable: [],
    outAssetsTable: []
};


function search() {

    var building = document.getElementById('search_move_building').value,
        level = document.getElementById('search_move_level').value,
        area = document.getElementById('search_move_area').value,
        room_no = document.getElementById('search_move_room').value;
    description = document.getElementById('move_description').value;
    sub_location = document.getElementById('search_move_sublocaction').value;
    asset_primary_id = document.getElementById('search_move_assetNo').value;

    var results = (building + " - " + level + " - " + area + " - " + room_no + " - " + description + " - " + sub_location + " - " + asset_primary_id);
    var current = "";

    if (" -  -  -  -  -  - " == results) {
        // alert("Please enter alteast one filter");
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
        $('#outSearch').hide();
        $('#inSearch').hide();
        $('#loader').fadeIn(500);
        document.getElementById('current').innerHTML = "";

        makeCall("../../ams_apis/slimTest/index.php/getCurrentAssets", '#btnTransfer', '#currentAssetsTable', 10);

        makeCall("../../ams_apis/slimTest/index.php/getOutAssets", '#btnCancel', '#outAssetsTable', 4);

        makeCall("../../ams_apis/slimTest/index.php/getInAssets", '#btnApprove', '#inAssetsTable', 4);

    }


    function makeCall(url, actionBtn, table_dom, length) {

        console.log('{"building" :"' + building + '","level" : "' + level + '","area" : "' + area + '","room_no" : "' + room_no + '","sub_location" : "' + sub_location + '","asset_primary_id" : "' + asset_primary_id + '","description" : "' + description + '","asset_class":"' + localStorage.filter + '"}');

        $.ajax({
            url: url,
            type: "POST",
            dataType: 'json',
            data: '{"building" :"' + building + '","level" : "' + level + '","area" : "' + area + '","room_no" : "' + room_no + '","sub_location" : "' + sub_location + '","asset_primary_id" : "' + asset_primary_id + '","description" : "' + description + '","asset_class":"' + localStorage.filter + '"}',
            success: function (data) {
                $('#searchView').hide();
                $('#loader').hide();
                var table = null;
                var rowIds = [];
                var ASSET_ROOM_NO = "";
                var ASSET_SUB_LOCATION = "";
                console.log("dfbgbdgbfgbfdb");
                console.log(table_dom);
                console.log("dfbfgbdfbdfbdfb");
                console.log(data);
                console.log("dfbfgbdfbdfbdfb");

                if (data.rows > 0) {
                    localStorage.table_len = data.rows;


                    var str = '{"data" : [';
                    for (var k = 0; k < data.rows; k++) {

                        if (data.data[k].ASSET_TRANSACTION_STATUS == "PENDING" || data.data[k].ASSET_TRANSACTION_STATUS == "PENDING-TEMP") {
                            // console.log(data.data[k].ASSET_PRIMARY_ID);
                            rowIds.push(data.data[k].ASSET_ID);

                        }
                        ;

                        data.data[k].ASSET_DESCRIPTION = replaceAll("\"", "`", data.data[k].ASSET_DESCRIPTION);
                        data.data[k].ASSET_DESCRIPTION = replaceAll("\'", "`", data.data[k].ASSET_DESCRIPTION);
                        data.data[k].ASSET_DESCRIPTION = replaceAll("\\", "`", data.data[k].ASSET_DESCRIPTION);

                        if ((data.rows - 1) == k) {

                            str += '["' + data.data[k].ASSET_ID + '","';
                            str += data.data[k].ASSET_ID + '","';
                            str += isSpecified(data.data[k].ASSET_SUB_LOCATION) + '","';
                            str += isSpecified(data.data[k].ASSET_ROOM_NO) + '","';
                            str += data.data[k].ASSET_AREA + '","';
                            str += data.data[k].ASSET_DESCRIPTION + '","';
                            str += data.data[k].ASSET_STATUS + '","';
                            str += updateLetterToIcon(data.data[k].ASSET_HAS_SUB_ASSETS) + '"]';

                        } else {

                            str += '["' + data.data[k].ASSET_ID + '","';
                            str += data.data[k].ASSET_ID + '","';
                            str += isSpecified(data.data[k].ASSET_SUB_LOCATION) + '","';
                            str += isSpecified(data.data[k].ASSET_ROOM_NO) + '","';
                            str += data.data[k].ASSET_AREA + '","';
                            str += data.data[k].ASSET_DESCRIPTION + '","';
                            str += data.data[k].ASSET_STATUS + '","';
                            str += updateLetterToIcon(data.data[k].ASSET_HAS_SUB_ASSETS) + '"],';

                        }
                    }
                    str += ']}'
                    str = replaceAll("\n", "", str);
                    str = replaceAll("\r", "", str);
                    str = (JSON.parse(str));


                    // console.log(table_dom);

                    table = createTable(table_dom, str.data, length, rowIds);

                    var _table_id = table_dom.replace("#", "");
                    tableArr[_table_id] = table;


                    $(table_dom + ' tbody, ' + table_dom + ' thead').on('click', 'input[type="checkbox"]', function () {
                        // var data = table.row($(this).parents('tr')).data();
                        setTimeout(function () {
                            // console.log(checkboxSelectedLength());
                            if (checkboxSelectedLength() > 0) {
                                $(actionBtn).fadeIn(500);
                                // console.log("Test");
                            } else {
                                // console.log("Else Test");
                                $(actionBtn).fadeOut(500);
                            }
                        }, 500);
                    });

                } else {

                    console.log(data.data);

                    table = createTable(table_dom, data.data);
                    $('th.dt-checkboxes-select-all input').remove();

                }


                $(table_dom + ' tbody').on('click', 'button', function () {

                    var data = tableArr[replaceAll("#", "", table_dom)].row($(this).parents('tr')).data();

                    viewAsset(data[0]);

                });
                $('#loader').hide();

            },
            error: function (err) {
                console.log(err)
                $('#searchView').fadeIn(500);
                $('#loader').hide();
                alert('Ooops');
            }
        });
    }

    function checkboxSelectedLength() {
        var lengthh = $(":checkbox:checked").length;
        return lengthh;
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

            case "Y":
                results = "<p class='text-success'><strong>YES</strong></p>";
                break;
            case "N":
                results = "<p class='text-danger'><strong>NO</strong></p>";
                break;
        }

        return results;
    }//close updateLetterToIcon function

    // function createTable(tableID, tableData, length,rowIds) {

    //         var table = $(tableID).DataTable({
    //             "data": tableData,
    //             "searching": false,
    //             "ordering": true,
    //             "destroy": true,
    //             "pageLength": length,
    //             "columnDefs": [{
    //                 "targets": 0,
    //                 "data": null,
    //                 "defaultContent": "<input type='checkbox'/>"
    //             }, {
    //                 "targets": -1,
    //                 "data": null,
    //                 "defaultContent": "<button type='button' class='btn btn-primary'><span class='fa fa-eye'></span></button>"
    //             },
    //             {
    //                 "className": "dt-center",
    //                 "targets": -2
    //             },
    //             {
    //                 "targets": [-1, -2, 0],
    //                 "orderable": false
    //             }
    //             ],
    //             fnCreatedRow: function( nRow, aData, iDataIndex ) {
    //                 $(nRow).attr('id', aData[0]);
    //             }
    //         });

    //     return table;
    // }

    function createTable(tableID, tableData, length, rowIds) {

        var table = $(tableID).DataTable({
            // "data": tableData,
            "paging": true,
            "processing": true,
            "searching": false,
            "responsive": true,
            "ordering": false,
            "pageLength": length,
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
                    "orderable": false,
                    'checkboxes': {
                        'selectRow': true
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
                    "orderable": false,
                    "targets": [-2, 0]
                },
                {
                    "targets": -2,
                    "orderable": false
                }
            ],
            'select': {
                'style': 'multi'
            },
            fnCreatedRow: function (nRow, aData, iDataIndex) {
                if (tableID == '#currentAssetsTable') {
                    for (var t = 0; t < rowIds.length; t++) {
                        if (rowIds[t] == aData[0]) {
                            $(nRow).css({
                                'background-color': '#948d8d7d',
                                'pointer-events': 'none',
                                'cursor': 'not-allowed',
                                'color': '#4e4d4d',
                                'transition': '500ms'
                            });
                        }
                    }
                }
            }
        });


        // Handle form submission event 
        $('#frm-example').on('submit', function (e) {
            // Prevent actual form submission
            e.preventDefault();
            var rows_selected = table.column(0).checkboxes.selected();
            if (rows_selected.length < 1) {
                alert("Please select items to print");

            } else {
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

                // FOR DEMONSTRATION ONLY
                // The code below is not needed in production

                // Output form data to a console     
                // console.log((rows_selected.join(",")).split(","));

                // Output form data to a console     
                // console.log($(form).serialize());

                // Remove added elements
                $('input[name="id\[\]"]', form).remove();

                e.preventDefault();
            }

        });

        // console.log(tableArr[tableID].data().count());
        // var table_len = (table.columns('#asset-id').data()[0]).length;
        // var table_len = table.rows(0).data().length;

        // if ( ! tableArr["currentAssets"].data().count() ) {
        //     alert( 'Empty table' );
        // }


        return table;
    }
}

function isSpecified(value) {
    if (value == null) {
        return "NOT SPECIFIED";
    }
    return value;
}

function populate_dropdown() {

    // get primary asset
    getItems('../../ams_apis/slimTest/index.php/asset_primary_view', 'search_move_assetNo', 'scroll_move_assetNo', 'menu_move_assetNo', 'empty_move_assetNo');
    // get sub location
    getItems('../../ams_apis/slimTest/index.php/asset_sub_location_move', 'search_move_sublocaction', 'scroll_move_sublocaction', 'menu_move_sublocaction', 'empty_move_sublocaction');
    // get room
    getItems('../../ams_apis/slimTest/index.php/asset_room_no_view', 'search_move_room', 'scroll_move_room', 'menu_move_room', 'empty_move_room');
    // get area
    getItems('../../ams_apis/slimTest/index.php/asset_area_view', 'search_move_area', 'scroll_move_area', 'meun_move_area', 'empty_move_area');
    // get level
    getItems('../../ams_apis/slimTest/index.php/asset_level_new_view', 'search_move_level', 'scroll_move_level', 'menu_move_level', 'empty_move_level');
    // get building
    getItems('../../ams_apis/slimTest/index.php/building_view', 'search_move_building', 'scroll_move_building', 'menu_move_building', 'empty_move_building');

}

function populate_tran_dropdown() {
    // get building
    getItems('../../ams_apis/slimTest/index.php/building_view_transfer', 'search_transfer_building', 'scroll_transfer_building', 'menu_transfer_building', 'empty_transfer_building');
    // get level
    getItems('../../ams_apis/slimTest/index.php/asset_level_new_transfer', 'search_transfer_level', 'scroll_transfer_level', 'menu_transfer_level', 'empty_transfer_level');
    // get location
    getItems('../../ams_apis/slimTest/index.php/location_area_transfer', 'search_transfer_location', 'scroll_tarnsfer_Location', 'menu_transfer_Location', 'empty_transfer_Location');
    // get room_no
    getItems('../../ams_apis/slimTest/index.php/room_no_transfer', 'search_transfer_roomno', 'scroll_transfer_room', 'menu_transfer_Room', 'empty_transfer_Room');
    // get sub
    getItems('../../ams_apis/slimTest/index.php/asset_sub_location_transfer', 'search_transfer_sub', 'scroll_transfer_sub', 'menu_transfer_sub', 'empty_transfer_sub');
}

populate_dropdown();


// populate room no
function populate_room() {
    getItems('../../ams_apis/slimTest/index.php/room_no_transfer', 'search_approve_roomno', 'scroll_approve_room', 'menu_approve_Room', 'empty_approve_Room');
    getItems('../../ams_apis/slimTest/index.php/asset_sub_location_transfer', 'search_approve_sub', 'scroll_approve_sub', 'menu_approve_sub', 'empty_approve_sub');
}


var allArr = {
    search_move_building: [],
    search_move_level: [],
    search_move_area: [],
    search_move_room: [],
    search_move_sublocaction: [],
    search_move_assetNo: []
};

// console.log("allArr");
// console.log(allArr);
// console.log("allArr");

function getItems(url, id, scrollArea, menuid, empty_view) {

    console.log('{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","asset_class":"' + localStorage.filter + '","sub_location": "' + localStorage.sub_location + '","asset_primary_id": "' + localStorage.asset_primary_id + '"}');
    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        data: '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","asset_class":"' + localStorage.filter + '","sub_location": "' + localStorage.sub_location + '","asset_primary_id": "' + localStorage.asset_primary_id + '"}',
        success: function (data) {

            if ($("#search_transfer_roomno").val() !== "") {

                if (id == "search_transfer_building") {
                    $("#building_transfer_filter").text(data.data[0])
                    $("#search_transfer_building").val(data.data[0])
                }
                if (id == "search_transfer_level") {
                    $("#level_transfer_filter").text(data.data[0])
                    $("#search_transfer_level").val(data.data[0])
                }
                if (id == "search_transfer_location") {
                    $("#dropdown_transfer_location").text(data.data[0])
                    $("#search_transfer_location").val(data.data[0])
                }

            }

            console.log("======================data.data===========================");
            console.log(data.data);
            var rows = [];
            var searchValue = document.getElementById(id);
            // console.log("=============searchValue================");
            // console.log(searchValue);
            // console.log("=============searchValue=================");

            if (data.rows > 0) {

                for (var i = 0; i < data.rows; i++) {
                    rows.push({
                        values: [data.data[i]],
                        markup: '<input type="button" style="border-bottom:1px solid #ecebeb" class="dropdown-item form-control" type="button" value="' + data.data[i] + '"/>',
                        active: true
                    });
                }

                allArr[id] = rows;

                filterItems(rows, id, scrollArea, menuid);
            } else {
                filterItems(rows, id, scrollArea, menuid);
                $('#' + empty_view).show();
            }


            // localStorage.setItem(id, JSON.stringify(rows));
            // Storage.prototype._setItem(id,rows);


            // // console.log(data.data);
            // // buildDropDown('menuAssets', data.data, '#emptyAssets');
            // // let contents = []
            // // for(var i=0;i<data.rows;i++){

            // //     contents.push('<input type="button" class="dropdown-item form-control" type="button" value="' + data.data[i] + '"/>')

            // //     $('#menuAssets').append(contents.join(""))

            // //     //Hide the row that shows no items were found
            // //     $('#emptyAssets').hide()
            // // }
            // console.log('done');
            // // buildDropDown('#menuAssets',data.data);

        },
        error: function (data_err) {
            console.log("Error");
            console.log(data_err);
            console.log(localStorage.filter);
        }
    })
}

var clusterize = {
    search_move_building: [],
    search_move_level: [],
    search_move_area: [],
    search_move_room: [],
    search_move_sublocaction: [],
    search_move_assetNo: []
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
        case "search_move_building":
            res = { "btnId": "building_move_filter", "btnContent": "BUILDING" };

            resetBtn('#building_move_filter', "BUILDING");
            resetBtn('#level_move_filter', "LEVEL");
            resetBtn('#area_move_filter', "AREA");
            resetBtn('#room_move_filter', "ROOM");
            resetBtn('#sublocaction_move_filter', "SUB LOCATION");
            resetBtn('#assetNo_move_filter', "ASSET NO");

            document.getElementById('menu_move_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_move_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            $('#search_move_building').val("");
            $('#search_move_level').val("");
            $('#search_move_area').val("");
            $('#search_move_room').val("");
            $('#search_move_sublocaction').val("");
            $('#search_move_assetNo').val("");

            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';
            break;

        case "search_move_level":
            res = { "btnId": "level_move_filter", "btnContent": "LEVEL" };

            resetBtn('#level_move_filter', "LEVEL");
            resetBtn('#area_move_filter', "AREA");
            resetBtn('#room_move_filter', "ROOM");
            resetBtn('#sublocaction_move_filter', "SUB LOCATION");
            resetBtn('#assetNo_move_filter', "ASSET NO");

            document.getElementById('menu_move_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_move_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            $('#search_move_level').val("");
            $('#search_move_area').val("");
            $('#search_move_room').val("");
            $('#search_move_sublocaction').val("");
            $('#search_move_assetNo').val("");

            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';
            break;
        case "search_move_area":
            res = { "btnId": "area_move_filter", "btnContent": "AREA" };

            resetBtn('#area_move_filter', "AREA");
            resetBtn('#room_move_filter', "ROOM");
            resetBtn('#sublocaction_move_filter', "SUB LOCATION");
            resetBtn('#assetNo_move_filter', "ASSET NO");

            document.getElementById('meun_move_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            $('#search_move_area').val("");
            $('#search_move_room').val("");
            $('#search_move_sublocaction').val("");
            $('#search_move_assetNo').val("");

            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            break;

        case "search_move_room":
            res = { "btnId": "room_move_filter", "btnContent": "ROOM" };

            resetBtn('#room_move_filter', "ROOM");
            resetBtn('#sublocaction_move_filter', "SUB LOCATION");
            resetBtn('#assetNo_move_filter', "ASSET NO");

            document.getElementById('menu_move_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            $('#search_move_room').val("");
            $('#search_move_sublocaction').val("");
            $('#search_move_assetNo').val("");

            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';
            break;

        case "search_move_sublocaction":
            res = { "btnId": "sublocaction_move_filter", "btnContent": "SUB LOCATION" };

            resetBtn('#sublocaction_move_filter', "SUB LOCATION");
            resetBtn('#assetNo_move_filter', "ASSET NO");

            document.getElementById('menu_move_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            $('#search_move_sublocaction').val("");
            $('#search_move_assetNo').val("");

            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';
            break;
        case "search_move_assetNo":
            res = { "btnId": "assetNo_move_filter", "btnContent": "ASSET NO" };

            resetBtn('#assetNo_move_filter', "ASSET NO");

            document.getElementById('menu_move_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            $('#search_move_assetNo').val("");

            localStorage.asset_primary_id = '';
            break;
        default:
            res = { "btnId": "not found", "btnContent": "not found" };
            break;
    }

    return res;
}

function getSelectedItems(id) {

    var rows_selected = tableArr[id].column(0).checkboxes.selected();

    // var data = table.row($("<input type='checkbox' value='' class='dt-checkboxes'>").parents('tr')).data();

    // console.log(rows_selected);
    // var rows_selected = $(id+" input:checkbox:checked").val()
    var rowsSelected = rows_selected.join(",").split(",");

    document.getElementById('movItemCount').innerHTML = rowsSelected.length;

    var assetValues = createAssetDelimeter(rowsSelected);
    var assetQuoteDel = createQuoteDelimeter(rowsSelected);

    if (id == "outAssetsTable") {


        // document.getElementById('overlay-alert-message').style.display = "none";
        // document.getElementById('overlay-alert-message').style.display = "block";
        // document.getElementById('alert_header').innerHTML = "Assets Cancel";
        // document.getElementById('alert-message-body').innerHTML = '<span style="font-weight: bold;color:red;">Are you sure you want to cancel?</span>';
        // document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="continueCancel(\'' + assetValues + '\')" style="width:100px">YES</button> <button class="btn btn-danger" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">Cancel</button>';

        swal.fire({
            title: "Are you sure you want to cancel this asset?",
            type: "question",
            showCancelButton: true,
            confirmButtonColor: "#419641",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            cancelButtonColor: "#C12E2A",
            closeOnConfirm: false,
            closeOnCancel: false,
            showCloseButton: true,
            allowOutsideClick: false,
        }).then((result) => {
            if (result.value) {
                continueCancel(assetValues);
                // showDropdown(assets_selected);
                // continuee( assetValues, input_building, input_level, input_area, input_Room, input_sub, input_radio_checked)
                // continuee(assetValues,input_building,input_level,input_area,input_Room,input_sub,input_radio_checked);

            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                // confirmLink("SKIP");
                // console.log("no ALC");
                // console.log("here2");
            }
        });

    } else if (id == "inAssetsTable") {

        $('#search_approve_roomno').val("");
        $('#dropdown_approve_room').text("ROOM");
        $('#search_approve_sub').val("");
        $('#dropdown_approve_sub').text("SUB LOCATION");


        document.getElementById('approveItemCount').innerHTML = rowsSelected.length;
        var comma_del = "";
        for (var i = 0; i < rowsSelected.length; i++) {
            if (i == rowsSelected.length - 1) {
                comma_del += "\'" + rowsSelected[i] + "\'";
            } else {
                comma_del += "\'" + rowsSelected[i] + "\',";
            }

        }

        if (localStorage.filter == "IT EQUIPMENT") {
            $('#approve_sub_location').show();
        } else {
            $('#approve_sub_location').hide();
        }

        // console.log(comma_del);
        checkNullRoom(comma_del, assetValues);

        // get_selected_room

        $("#confirmApprove").off().on('click', function (e) {
            e.preventDefault();

            var input_Room = $("#dropdown_approve_room").text();
            var input_sub = $("#dropdown_approve_sub").text();

            if (localStorage.filter == "IT EQUIPMENT") {
                if (input_Room.indexOf("ROOM") > -1) {
                    // alert("Please select room");
                    document.getElementById('overlay-alert-message').style.display = "block";
                    document.getElementById('alert_header').innerHTML = "Assets Approve";
                    document.getElementById('alert-message-body').innerHTML = '<span style="font-weight: bold;">Please select room</span>';
                    document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">OK</button>';

                } else if (input_Room.indexOf("SUB LOCATION") > -1) {
                    // alert("Please select room");
                    document.getElementById('overlay-alert-message').style.display = "block";
                    document.getElementById('alert_header').innerHTML = "Assets Approve";
                    document.getElementById('alert-message-body').innerHTML = '<span style="font-weight: bold;">Please select SUB LOCATION</span>';
                    document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">OK</button>';

                } else {
                    // console.log(assetValues);
                    approveAssets(assetValues, input_Room, input_sub);
                }
            } else {
                if (input_Room.indexOf("ROOM") > -1) {
                    // alert("Please select room");
                    document.getElementById('overlay-alert-message').style.display = "block";
                    document.getElementById('alert_header').innerHTML = "Assets Approve";
                    document.getElementById('alert-message-body').innerHTML = '<span style="font-weight: bold;">Please select room</span>';
                    document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">OK</button>';

                } else {
                    // console.log(assetValues);
                    approveAssets(assetValues, input_Room, input_Room);
                }
            }

        });
    } else {

        if (localStorage.filter == "IT EQUIPMENT") {
            $('.filter_sub_transfer').show();
        } else {
            $('.filter_sub_transfer').hide();
        }

        console.log(assetValues)
        //check for temp status
        $.ajax({
            url: "../../ams_apis/slimTest/index.php/check_status",
            method: "POST",
            data: '{"check_ids":"' + assetValues + '"}',
            dataType: "json",
            success: function (data) {

                var foundErrror = [
                    false,   // 0 ROOM
                    false,   // 1 STATUS - C
                    false    // 2 STATUS - CT
                ];

                console.log(data);

                var arrErr = [
                    "<li>You've selected assets that cannot be moved as one unit!\nNot allowed to select more than 1</li>",      // DIFF
                    "<li>You've selected selected multiple assets and the room and sub location do not match</li>"              // n
                ]

                if (data.data[0].status_res == "C") {
                    foundErrror[1] = true;
                }
                if (data.data[0].status_res == "CT") {
                    foundErrror[2] = true;
                }
                if (data.data[0].status_res == "DIFF") {
                    foundErrror[1] = false;
                    foundErrror[2] = false;
                }
                if (data.data[0].room_res == "n") {

                    foundErrror[0] = false;
                }
                if (data.data[0].room_res == "y") {
                    foundErrror[0] = true;
                }

                if (foundErrror[0] && foundErrror[1]) {
                    showDialogTransferDialog(assetValues, rowsSelected);            // y | C    
                } else if (foundErrror[0] && foundErrror[2]) {
                    showRevertDialog(assetQuoteDel, assetValues);                   // y | CT
                } else if (foundErrror[0] && (!foundErrror[1] && !foundErrror[2])) {
                    showErrorAlrert(arrErr[0]);                                     // y / diff
                } else if (!foundErrror[0] && (!foundErrror[1] && !foundErrror[2])) {
                    showErrorAlrert(arrErr[0] + arrErr[1]);                           // N / diff
                } else if (!foundErrror[0] && foundErrror[1]) {
                    showErrorAlrert(arrErr[0]);                                     // N / C
                } else if (!foundErrror[0] && foundErrror[2]) {
                    showErrorAlrert(arrErr[0]);                                     // N / CT
                } else {
                    showDialogTransferDialog(assetValues, rowsSelected);
                }

            },
            error: function (error) {
                console.log(error);
            }
        });

    }
}

function showErrorAlrert(error) {
    swal.fire({
        title: "Error Message",
        html: "<ol>" + error + "</ol>",
        type: "error",
        confirmButtonColor: "#419641",
        closeOnCancel: true,
        allowOutsideClick: true,
    });
}

function showDialogTransferDialog(rowsSelected, raw_assets) {

    //location
    $('#building_transfer_filter').text("BUILDING");
    $('#search_transfer_building').val("");
    $('#level_transfer_filter').text("LEVEL");
    $('#search_transfer_level').val("");
    $('#dropdown_transfer_location').text("AREA");
    $('#search_transfer_location').val("");
    //room
    $('#dropdown_transfer_room').text("ROOM");
    $('#search_transfer_roomno').val("");
    $('#dropdown_transfer_sub').text("SUB LOCATION");
    $('#search_transfer_sub').val("");


    $('input:radio[name="transferType"]').filter('[value="SKIP"]').attr('checked', true);
    $('input:radio[name="transferType"]').filter('[value="TEMP"]').attr('checked', false);

    console.log(rowsSelected);
    getSelectedAssets(raw_assets);
    localStorage.level = '';
    localStorage.building = '';
    localStorage.room_no = '';
    localStorage.area = '';
    localStorage.sub_location = '';
    localStorage.asset_primary_id = '';

    populate_tran_dropdown();

    document.getElementById('overlay-transfer').style.display = "block";

    $("#confirmTransfer").off().on('click', function (e) {
        e.preventDefault();
        var input_building = $("#building_transfer_filter").text();
        var input_level = $("#level_transfer_filter").text();
        var input_area = $("#dropdown_transfer_location").text();
        var input_Room = $("#dropdown_transfer_room").text();
        var input_sub = $("#dropdown_transfer_sub").text();
        var input_radio_checked = $("#transfer_type input[type='radio']:checked")[0].value;

        if (input_building.indexOf("BUILDING") > -1) {
            // alert("Location is required");
            // document.getElementById('overlay-alert-message').style.display = "none";
            // document.getElementById('overlay-alert-message').style.display = "block";
            // document.getElementById('alert_header').innerHTML = "Assets Transfer";
            // document.getElementById('alert-message-body').innerHTML = '<span style="font-weight: bold;color:red;">Building is required</span>';
            // document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">OK</button>';

            swal.fire({
                title: "Building is required",
                type: "error",
                confirmButtonColor: "#419641",
                closeOnCancel: true,
                allowOutsideClick: true,
            })

        } else if (input_level.indexOf("LEVEL") > -1) {
            // alert("Location is required");
            // document.getElementById('overlay-alert-message').style.display = "none";
            // document.getElementById('overlay-alert-message').style.display = "block";
            // document.getElementById('alert_header').innerHTML = "Assets Transfer";
            // document.getElementById('alert-message-body').innerHTML = '<span style="font-weight: bold;color:red;">Level is required</span>';
            // document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">OK</button>';

            swal.fire({
                title: "Level is required",
                type: "error",
                confirmButtonColor: "#419641",
                closeOnCancel: true,
                allowOutsideClick: true,
            })
        } else if (input_area.indexOf("AREA") > -1) {
            // alert("Location is required");
            // document.getElementById('overlay-alert-message').style.display = "none";
            // document.getElementById('overlay-alert-message').style.display = "block";
            // document.getElementById('alert_header').innerHTML = "Assets Transfer";
            // document.getElementById('alert-message-body').innerHTML = '<span style="font-weight: bold;color:red;">Area is required</span>';
            // document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">OK</button>';

            swal.fire({
                title: "Area is required",
                type: "error",
                confirmButtonColor: "#419641",
                closeOnCancel: true,
                allowOutsideClick: true,
            })
        } else {

            if (localStorage.filter == "IT EQUIPMENT") {

                if (input_Room.indexOf("ROOM") > -1) {
                    swal.fire({
                        title: "Please select room to continue with the tranfer",
                        type: "error",
                        confirmButtonColor: "#419641",
                        allowOutsideClick: true,
                    });

                } else if (input_radio_checked == "TEMP") {
                    input_sub = '';
                    continuee(rowsSelected, input_building, input_level, input_area, input_Room, input_sub, input_radio_checked);
                } else {
                    if (input_sub.indexOf("SUB LOCATION") > -1) {
                        input_sub = '';
                        // alert("room empty it");
                        console.log(rowsSelected + "," + input_building + "," + input_level + "," + input_area + "," + input_Room + "," + "Test IT" + "," + input_radio_checked);


                        swal.fire({
                            title: "Sub Location is required",
                            type: "question",
                            showCancelButton: true,
                            confirmButtonColor: "#419641",
                            confirmButtonText: "Yes",
                            cancelButtonText: "No",
                            cancelButtonColor: "#C12E2A",
                            closeOnConfirm: false,
                            closeOnCancel: false,
                            showCloseButton: true,
                            allowOutsideClick: false,
                        }).then((result) => {
                            if (result.value) {
                                // showDropdown(assets_selected);
                                continuee(rowsSelected, input_building, input_level, input_area, input_Room, input_sub, input_radio_checked);

                            } else if (
                                /* Read more about handling dismissals below */
                                result.dismiss === Swal.DismissReason.cancel
                            ) {
                                // confirmLink("SKIP");
                                // console.log("no ALC");
                                // console.log("here2");
                            }
                        });
                    } else {
                        // confirmAssets(assetValues,input_building,input_level, input_area, input_Room,input_sub,input_radio_checked);
                        confirmAssets(rowsSelected, input_building, input_level, input_area, input_Room, input_sub, input_radio_checked);

                        console.log(rowsSelected + "," + input_building + "," + input_level + "," + input_area + "," + input_Room + "," + "Test IT" + "," + input_radio_checked);
                    }


                }

            } else {

                if (input_Room.indexOf("ROOM") > -1) {
                    input_Room = '';
                    // alert("room empty not it");
                    // console.log(assetValues+","+input_building+","+input_level+","+ input_area+","+ input_Room+","+"Test IT"+","+input_radio_checked);
                    // console.log('<button class="btn btn-success" onclick="continuee(' + assetValues + ',' + input_location + ',' + input_Room + ')" style="width:100px">YES</button> <button class="btn btn-danger" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">Cancel</button>');
                    // document.getElementById('overlay-alert-message').style.display = "none";
                    // document.getElementById('overlay-alert-message').style.display = "block";
                    // document.getElementById('alert_header').innerHTML = "Assets Transfer";
                    // document.getElementById('alert-message-body').innerHTML = '<span style="font-weight: bold;color:red;">Are you sure you want to continue without selecting the room?</span>';
                    // document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="continuee(\'' + assetValues + '\',\'' + input_building + '\',\'' + input_level + '\',\'' + input_area + '\',\'' + input_Room + '\',\'' + input_Room + '\',\'' + input_radio_checked + '\')" style="width:100px">YES</button> <button class="btn btn-danger" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">Cancel</button>';

                    swal.fire({
                        title: "Are you sure you want to continue without selecting the room?",
                        type: "question",
                        showCancelButton: true,
                        confirmButtonColor: "#419641",
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                        cancelButtonColor: "#C12E2A",
                        closeOnConfirm: false,
                        closeOnCancel: false,
                        showCloseButton: true,
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.value) {
                            // showDropdown(assets_selected);
                            // continuee(assetValues,input_building,input_level,input_area,input_Room,input_Room,input_radio_checked);
                            confirmAssets(rowsSelected, input_building, input_level, input_area, input_Room, input_Room, "SKIP");

                        } else if (
                            /* Read more about handling dismissals below */
                            result.dismiss === Swal.DismissReason.cancel
                        ) {
                            // confirmLink("SKIP");
                            // console.log("no ALC");
                            // console.log("here2");
                        }
                    });

                } else {
                    confirmAssets(rowsSelected, input_building, input_level, input_area, input_Room, input_Room, "SKIP");
                    console.log(rowsSelected + "," + input_building + "," + input_level + "," + input_area + "," + input_Room + "," + input_Room + "," + "SKIP");
                }
            }
        }
    });

}

function showRevertDialog(assetQuoteDel, assetCapDel) {

    $.ajax({
        url: "../../ams_apis/slimTest/index.php/get_oldRoom",
        method: "POST",
        data: '{"temp_ids":"' + assetQuoteDel + '"}',
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data.rows > 0) {
                document.getElementById('mov-temp-ItemCount').innerHTML = data.rows;
                $('#loaderTempTrans').fadeOut(500);
                document.getElementById("assetTbodyTempTransfer").innerHTML = data.data;
                $('#overlay-temp-transfer').show();
            }

        },
        error: function (error) {
            console.log(error);
        }
    });

    $("#confirmTempTransfer").off().on('click', function (e) {
        e.preventDefault();
        var input_building = "";
        input_level = "";
        input_level = "";
        input_area = "";
        input_Room = "";
        input_Room = "";
        input_radio_checked = "CTEMP";
        confirmAssets(assetCapDel, input_building, input_level, input_area, input_Room, input_Room, input_radio_checked);
    });

}

function continueCancel(assetValues) {
    cancelAssets(assetValues);
    search();
}

function continuee(assetValues, input_building, input_level, input_location, input_Room, input_sub, type) {
    confirmAssets(assetValues, input_building, input_level, input_location, input_Room, input_sub, type);
}

function checkNullRoom(assetvalues, asset_values_cap_del) {

    console.log("check null room");
    console.log('{"asset_id":"' + assetvalues + '"}');
    $.ajax({
        url: '../../ams_apis/slimTest/index.php/checkRoom',
        method: 'POST',
        data: '{"asset_id":"' + assetvalues + '"}',
        dataType: 'JSON',
        success: function (data) {
            console.log(data);
            if (data.rows > 0) {
                console.log("here");
                document.getElementById('dropdown_approve_building').innerHTML = data.data[0].ASSET_BUILDING_NEW;
                document.getElementById('dropdown_approve_level').innerHTML = data.data[0].ASSET_LEVEL_NEW;
                document.getElementById('dropdown_approve_area').innerHTML = data.data[0].ASSET_LOCATION_AREA_NEW;

                localStorage.building = data.data[0].ASSET_BUILDING_NEW;
                localStorage.level = data.data[0].ASSET_LEVEL_NEW;
                localStorage.area = data.data[0].ASSET_LOCATION_AREA_NEW;

                populate_room();
                var current = "";
                if (data.rows > 0) {
                    for (var i = 0; i < data.rows; i++) {
                        current += "<tr><td>" + data.data[i].ASSET_PRIMARY_ID + "</td><td>" + data.data[i].ASSET_ROOM_NO_OLD + "</td></tr>";
                    }
                }
                $('#loaderApprove').fadeOut(500);
                document.getElementById('assetTbodyApprove').innerHTML = current;

                document.getElementById('overlay-approve').style.display = "block";

            } else {
                approveAssets(asset_values_cap_del, "", "");
            }

        },
        error: function (dataErr) {
            console.log(dataErr);
            console.log(assetvalues);
        }
    })

}

function cancelAssets(selectedItems) {

    console.log("cancel assets");
    console.log('{"username":"' + localStorage.username + '","asset_id":"' + selectedItems + '"}');

    $.ajax({
        url: '../../ams_apis/slimTest/index.php/cancelTransfer',
        method: 'POST',
        data: '{"username":"' + localStorage.username + '","asset_id":"' + selectedItems + '"}',
        dataType: 'JSON',
        success: function (data) {

            // console.log(data);
            // document.getElementById('overlay-alert-message').style.display = "none";
            // document.getElementById('overlay-alert-message').style.display = "block";
            // document.getElementById('alert_header').innerHTML = "Assets Cancel";
            // document.getElementById('alert-message-body').innerHTML = ' <img src="../img/success.gif" alt="success" style="width: 51px;margin: 8px 11px;"><br /><span style="color:green;font-weight: bold;">' + data.data + '</span>';
            // document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">OK</button>';
            if (data.rows == 1) {
                swal.fire({
                    title: "Assets Cancelled",
                    type: "success",
                    text: data.data,
                    closeOnCancel: true,
                    allowOutsideClick: true,
                })

                $('#btnCancel').fadeOut(500);
            } else if ((data.rows == 0)) {
                swal.fire({
                    title: "Assets Cancelled",
                    text: data.data,
                    type: "error",
                    closeOnCancel: true,
                    allowOutsideClick: true,
                })

                $('#btnCancel').fadeOut(500);
            }


        },
        error: function (dataErr) {
            console.log(dataErr);
        }
    })
}

function approveAssets(assetValues, room, sub) {
    console.log("Approve Assets")
    console.log('{"username":"' + localStorage.username + '","assetIds":"' + assetValues + '","location":"' + localStorage.area + '","room":"' + room + '","sub_location":"' + sub + '"}');
    $.ajax({
        url: '../../ams_apis/slimTest/index.php/approveAsset',
        dataType: 'JSON',
        method: 'POST',
        data: '{"username":"' + localStorage.username + '","assetIds":"' + assetValues + '","location":"' + localStorage.area + '","room":"' + room + '","sub_location":"' + sub + '"}',
        success: function (data) {
            // alert();
            if (data.rows == 1) {
                swal.fire({
                    title: "Assets Approve",
                    text: data.data,
                    type: "success",
                })

                search();
            } else if (data.rows == 0) {
                swal.fire({
                    title: "Assets Approve",
                    text: data.data,
                    type: "error",
                })
            }
            document.getElementById('overlay-approve').style.display = "none";
            $('#btnApprove').fadeOut(500);
        },
        error: function (dataErr) {
            console.log(dataErr);
        }
    });
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

function createQuoteDelimeter(qoute_del_arr) {
    var send_assets = "";
    for (var i = 0; i < qoute_del_arr.length; i++) {
        if (i == qoute_del_arr.length - 1) {
            send_assets += "\'" + qoute_del_arr[i] + "\'";
        } else {
            send_assets += "\'" + qoute_del_arr[i] + "\',";
        }

    }
    return send_assets;
}

function confirmAssets(assetIds, building, level, area, room, sub, type) {

    console.log("confirm transfer assets");
    console.log('{"username":"' + localStorage.username + '","assetIds":"' + assetIds + '","building":"' + building + '","level":"' + level + '","area":"' + area + '","room":"' + room + '","sub_location":"' + sub + '","type":"' + type + '"}');
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/confirmTransfer",
        data: '{"username":"' + localStorage.username + '","assetIds":"' + assetIds + '","building":"' + building + '","level":"' + level + '","area":"' + area + '","room":"' + room + '","sub_location":"' + sub + '","type":"' + type + '"}',
        method: "POST",
        dataType: "JSON",
        success: function (data) {
            console.log("data=============");
            console.log(data);
            if (data.rows == 1) {
                swal.fire({
                    title: "Assets Transfer",
                    text: data.data,
                    type: 'success',
                    showCloseButton: true,
                    closeButtonColor: '#3DB3D7',
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.value) {
                        closeAsset('overlay-alert-message');
                        closeAsset('overlay-temp-transfer');
                    }
                });
                localStorage.room_no = room;
                search();

            } else if (data.rows == 0) {
                swal.fire({
                    title: "Assets Transfer",
                    text: data.data,
                    type: 'error',
                    showCloseButton: true,
                    closeButtonColor: '#3DB3D7',
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.value) {
                        closeAsset('overlay-alert-message');
                        closeAsset('overlay-temp-transfer');

                    }
                })
            }


            // document.getElementById('overlay-alert-message').style.display = "none";
            // document.getElementById('overlay-alert-message').style.display = "block";
            // document.getElementById('alert_header').innerHTML = "Assets Transfer";
            // document.getElementById('alert-message-body').innerHTML = ' <img src="../img/success.gif" alt="success" style="width: 51px;margin: 8px 11px;"><br /><span style="color:green;font-weight: bold;">' + data.data + '</span>';
            // document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">OK</button>';

            // alert();

            document.getElementById('overlay-transfer').style.display = "none";
            $('#btnTransfer').fadeOut(500);
        },
        error: function (dataErr) {
            console.log("failed");
            console.log('{"username":"' + localStorage.username + '","assetIds":"' + assetIds + '","location":"' + location + '","room":"' + room + '"}');
            console.log(dataErr);
        }
    });

}

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
    $('#loaderTrans').fadeIn(500);

    console.log("Pending popup transfer");
    console.log('{"primary_asset_id" : "' + send_assets + '"}');

    $.ajax({
        url: "../../ams_apis/slimTest/index.php/pendingTransfer",
        method: "post",
        data: '{"primary_asset_id" : "' + send_assets + '"}',
        dataType: "json",
        success: function (data) {
            $('#loaderTrans').fadeOut(500);
            // console.log("===============================data===============================");
            // console.log(data);
            // console.log("===============================/////data/////===============================");
            var current = "";
            if (data.rows > 0) {
                for (var i = 0; i < data.rows; i++) {
                    current += "<tr><td>" + data.data[i].ASSET_PRIMARY_ID + "</td><td>" + data.data[i].ASSET_ROOM_NO + "</td></tr>";
                }
            }
            document.getElementById('assetTbodyTransfer').innerHTML = current;
            // console.log(current);
            // var html_view = "";
            // var p_count = 0;
            // var count = 0;
            // if (data.rows > 0) {
            //     for (var i = 0; i < data.rows; i++) {
            //         // var primary_info = "";
            //         // var primary_id = data.data[i].asset.primary[0];
            //         // var len_primary = "";
            //         // var sub_info = "";
            //         // var th_primary = "<tr style='background: #717171;;color:#ffffff;'>";
            //         // if (data.data[i].ASSET_ID == data.data[i].ASSET_PRIMARY_ID) {
            //         //     p_count++;
            //         //     count = 0;

            //         //     if (data.data[i].ASSET_IS_SUB == "YES") {
            //         //         th_primary += "<td><span class='toggle-btn' onclick=\"toggle_subs('.sub" + p_count + "')\"> + </span></td>";
            //         //     } else {
            //         //         th_primary += "<td> - </td>";
            //         //     }


            //         //     th_primary += "<td>" + data.data[i].ASSET_LOCATION_AREA + "</td><td>" + data.data[i].ASSET_ROOM_NO + "</td><td>" + data.data[i].ASSET_ID + "</td><td>" + data.data[i].ASSET_DESCRIPTION + "</td></tr>";
            //         //     html_view += th_primary;
            //         // } else {
            //         //     sub_info += "<tr class='sub" + p_count + "'><td>" + (count) + "</td>";

            //         //     sub_info += "<td colspan='2'><td>" + data.data[i].ASSET_ID + "</td><td>" + data.data[i].ASSET_DESCRIPTION + "</td></tr>";
            //         //     html_view += sub_info;
            //         // }
            //         // count++;
            //     }
            //     document.getElementById('tbodyPrint').innerHTML = html_view;
            // }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

var onSearch = function (btn_id, searchValue, emptyId) {

    var getId = searchValue;

    console.log(searchValue);

    var found = false;
    console.log(allArr[searchValue]);
    //handle enter
    document.getElementById(searchValue).onkeypress = function (e) {

        console.log(e.keyCode);
        if (e.keyCode == 13) {
            e.preventDefault();
            console.log("================================searchValue==============================");
            console.log(searchValue);

            var value = searchValue.value;

            if (value != "" || value != null || value != '' || value != ' ' || value != " ") {

                setValueBtn(btn_id, value);
                search();

            }

        }
    }


    // var rows = JSON.parse(localStorage.getItem(searchValue));
    console.log(allArr);

    var rows = allArr[searchValue];


    searchValue = document.getElementById(searchValue);

    console.log(searchValue.value);
    for (var i = 0; i < rows.length; i++) {

        var suitable = false;

        // console.log("rows[i].values[0]");
        // console.log(rows[i].values[0]);

        if (rows[i].values[0].indexOf((searchValue.value).toUpperCase()) + 1) {
            suitable = true;
            found = true;
        }

        rows[i].active = suitable;
    }

    if (searchValue.value.length == 0) {
        var resObj = checkFilter(getId);
        $('#' + resObj.btnId).text(resObj.btnContent);
        populate_room();
        populate_dropdown();
    }

    if (found) {
        $(emptyId).css("display", "none");
    } else {
        $(emptyId).css("display", "block");
    }

    // console.log(clusterize[getId]);

    clusterize[getId].update(filterRows(rows));
}

// searchasset.onkeyup = onSearch(this);
// buildDropDown('#menuRoom',names);
// buildDropDown('#menuLocation',names);

function replaceAll(find, replace, str) {
    while (str.indexOf(find) > -1) {
        str = str.replace(find, replace);
    }
    return str;
}

function clearData(input, btnDafualtId, text) {
    // var inputData = document.getElementById(input).(val);
    var value = $(input).val();

    if (value.length > 0) {

        if (input == "#search_move_building") {
            document.getElementById('menu_move_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_move_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            populate_dropdown();

            $(input).val("");
            $(btnDafualtId).text(text);

            $('#search_move_building').val("");
            $('#building_move_filter').text("BUILDING");
            $('#search_move_level').val("");
            $('#level_move_filter').text("LEVEL");
            $('#search_move_area').val("");
            $('#area_move_filter').text("AREA");
            $('#search_move_room').val("");
            $('#room_move_filter').text("ROOM");
            $('#search_move_sublocaction').val("");
            $('#sublocaction_move_filter').text("SUB LOCATION");
            $('#search_move_assetNo').val("");
            $('#assetNo_move_filter').text("ASSET NO");


        } else if (input == "#search_move_level") {

            document.getElementById('menu_move_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_move_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            populate_dropdown();

            $(input).val("");
            $(btnDafualtId).text(text);

            $('#search_move_level').val("");
            $('#level_move_filter').text("LEVEL");
            $('#search_move_area').val("");
            $('#area_move_filter').text("AREA");
            $('#search_move_room').val("");
            $('#room_move_filter').text("ROOM");
            $('#search_move_sublocaction').val("");
            $('#sublocaction_move_filter').text("SUB LOCATION");
            $('#search_move_assetNo').val("");
            $('#assetNo_move_filter').text("ASSET NO");

        } else if (input == "#search_move_area") {

            document.getElementById('meun_move_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            populate_dropdown();

            $('#search_move_area').val("");
            $('#area_move_filter').text("AREA");
            $('#search_move_room').val("");
            $('#room_move_filter').text("ROOM");
            $('#search_move_sublocaction').val("");
            $('#sublocaction_move_filter').text("SUB LOCATION");
            $('#search_move_assetNo').val("");
            $('#assetNo_move_filter').text("ASSET NO");

        } else if (input == "#search_move_room") {

            document.getElementById('menu_move_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            populate_dropdown();

            $('#search_move_room').val("");
            $('#room_move_filter').text("ROOM");
            $('#search_move_sublocaction').val("");
            $('#sublocaction_move_filter').text("SUB LOCATION");
            $('#search_move_assetNo').val("");
            $('#assetNo_move_filter').text("ASSET NO");

        } else if (input == "#search_move_sublocaction") {

            document.getElementById('menu_move_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_move_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            populate_dropdown();

            $('#search_move_sublocaction').val("");
            $('#sublocaction_move_filter').text("SUB LOCATION");
            $('#search_move_assetNo').val("");
            $('#assetNo_move_filter').text("ASSET NO");

        } else if (input == "#search_move_assetNo") {

            document.getElementById('menu_move_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.asset_primary_id = '';

            populate_dropdown();

            $('#search_move_assetNo').val("");
            $('#assetNo_move_filter').text("ASSET NO");

        }

        //popup tansfer dialog
        if (input == "#search_transfer_building") {
            //loaders
            document.getElementById('menu_transfer_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_transfer_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('empty_transfer_Location').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_transfer_Room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            //local storage
            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';

            //repopulate
            populate_tran_dropdown();

            //input
            $('#search_transfer_building').val("");
            $('#search_transfer_level').val("");
            $('#search_transfer_location').val("");
            $('#search_transfer_roomno').val("");
            //btn
            $('#building_transfer_filter').text("BUILDING");
            $('#level_transfer_filter').text("LEVEL");
            $('#dropdown_transfer_location').text("AREA");
            $('#dropdown_transfer_room').text("ROOM");
        } else if (input == "#search_transfer_level") {
            document.getElementById('menu_transfer_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('empty_transfer_Location').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_transfer_Room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            //local storage
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';

            //repopulate
            populate_tran_dropdown();

            //input
            $('#search_transfer_level').val("");
            $('#search_transfer_location').val("");
            $('#search_transfer_roomno').val("");

            //btn
            $('#level_transfer_filter').text("LEVEL");
            $('#dropdown_transfer_location').text("AREA");
            $('#dropdown_transfer_room').text("ROOM");

        } else if (input == "#search_transfer_location") {
            document.getElementById('empty_transfer_Location').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_transfer_Room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            //local storage
            localStorage.area = '';
            localStorage.room_no = '';

            //repopulate
            populate_tran_dropdown();

            //input
            $('#search_transfer_location').val("");
            $('#search_transfer_roomno').val("");

            //btn
            $('#dropdown_transfer_location').text("AREA");
            $('#dropdown_transfer_room').text("ROOM");

        } else if (input == "#search_transfer_roomno") {
            document.getElementById('menu_transfer_Room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            //local storage
            localStorage.room_no = '';

            //repopulate
            populate_tran_dropdown();

            //input
            $('#search_transfer_roomno').val("");

            //btn
            $('#dropdown_transfer_room').text("ROOM");

        } else if (input == "#search_transfer_sub") {
            document.getElementById('menu_transfer_sub').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            //local storage
            localStorage.sub_location = '';

            //repopulate
            populate_tran_dropdown();

            //input
            $('#search_transfer_sub').val("");

            //btn
            $('#dropdown_transfer_sub').text("SUB  LOCATION");

        } else if (input == "#search_approve_roomno") {
            document.getElementById('menu_approve_Room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            populate_room();
            $(input).val("");
            $(btnDafualtId).text(text);
            $('#dropdown_approve_sub').val("");
            $('#dropdown_approve_sub').text("SUB LOCATION");
        } else if (input == "#search_approve_sub") {
            document.getElementById('menu_approve_sub').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            localStorage.sub_location = '';
            populate_room();
            $(input).val("");
            $(btnDafualtId).text(text);

        }

    }
}

//If the user clicks on any item, set the title of the button as the text of the item
$('#menu_move_building').on('click', '.dropdown-item', function () {
    $('#building_move_filter').text($(this)[0].value);
    localStorage.building = $(this)[0].value;
    populate_dropdown();
    $("#building_move_filter").dropdown('toggle');
    $('#search_move_building').val($(this)[0].value);
})
$('#menu_move_level').on('click', '.dropdown-item', function () {
    $('#level_move_filter').text($(this)[0].value);
    localStorage.level = $(this)[0].value;
    populate_dropdown();
    $("#level_move_filter").dropdown('toggle');
    $('#search_move_level').val($(this)[0].value);
})
$('#meun_move_area').on('click', '.dropdown-item', function () {
    $('#area_move_filter').text($(this)[0].value);
    localStorage.area = $(this)[0].value;
    populate_dropdown();
    $("#area_move_filter").dropdown('toggle');
    $('#search_move_area').val($(this)[0].value);
})

$('#menu_move_room').on('click', '.dropdown-item', function () {
    $('#room_move_filter').text($(this)[0].value);
    localStorage.room_no = $(this)[0].value;
    populate_dropdown();
    $("#room_move_filter").dropdown('toggle');
    $('#search_move_room').val($(this)[0].value);
})

$('#menu_move_sublocaction').on('click', '.dropdown-item', function () {
    $('#sublocaction_move_filter').text($(this)[0].value);
    localStorage.sub_location = $(this)[0].value;
    populate_dropdown();
    $("#sublocaction_move_filter").dropdown('toggle');
    $('#search_move_sublocaction').val($(this)[0].value);
})

$('#menu_move_assetNo').on('click', '.dropdown-item', function () {
    $('#assetNo_move_filter').text($(this)[0].value);
    localStorage.asset_primary_id = $(this)[0].value;
    populate_dropdown();
    $("#assetNo_move_filter").dropdown('toggle');
    $('#search_move_assetNo').val($(this)[0].value);
})


//Transfer Overlay View
$('#menu_transfer_building').on('click', '.dropdown-item', function () {
    $('#building_transfer_filter').text($(this)[0].value);
    localStorage.building = $(this)[0].value;
    populate_tran_dropdown();
    $("#building_transfer_filter").dropdown('toggle');
    $('#search_transfer_building').val($(this)[0].value);
})

$('#menu_transfer_level').on('click', '.dropdown-item', function () {
    $('#level_transfer_filter').text($(this)[0].value);
    localStorage.level = $(this)[0].value;
    populate_tran_dropdown();
    $("#level_transfer_filter").dropdown('toggle');
    $('#search_transfer_level').val($(this)[0].value);
})

$('#menu_transfer_Location').on('click', '.dropdown-item', function () {
    $('#dropdown_transfer_location').text($(this)[0].value);
    localStorage.area = $(this)[0].value;
    populate_tran_dropdown();
    $("#dropdown_transfer_location").dropdown('toggle');
    $('#search_transfer_location').val($(this)[0].value);
})

$('#menu_transfer_Room').on('click', '.dropdown-item', function () {
    $('#dropdown_transfer_room').text($(this)[0].value);
    localStorage.room_no = $(this)[0].value;
    populate_tran_dropdown();
    $("#dropdown_transfer_room").dropdown('toggle');
    $('#search_transfer_roomno').val($(this)[0].value);
})

$('#menu_transfer_sub').on('click', '.dropdown-item', function () {
    $('#dropdown_transfer_sub').text($(this)[0].value);
    localStorage.sub_location = $(this)[0].value;
    populate_tran_dropdown();
    $("#dropdown_transfer_sub").dropdown('toggle');
    $('#search_transfer_sub').val($(this)[0].value);
})


//Approve

$('#menu_approve_Room').on('click', '.dropdown-item', function () {
    $('#dropdown_approve_room').text($(this)[0].value);
    localStorage.room = $(this)[0].value;
    populate_room();
    $("#dropdown_approve_room").dropdown('toggle');
    $('#search_approve_roomno').val($(this)[0].value);
})

$('#menu_approve_sub').on('click', '.dropdown-item', function () {
    $('#dropdown_approve_sub').text($(this)[0].value);
    localStorage.sub_location = $(this)[0].value;
    populate_room();
    $("#dropdown_approve_sub").dropdown('toggle');
    $('#search_approve_sub').val($(this)[0].value);
})

// dropdown hangler

if (localStorage.filter == "ALL EQUIPMENT") {


    // $('#class-options').append(new Option("ALL EQUIPMENT", "all_equip"));
    $('#class-options').append(new Option("FACILITIES MANAGEMENT", "fac_equip"));
    if (localStorage.filter == "IT EQUIPMENT" || localStorage.role == "ADMIN")
        $('#class-options').append(new Option("IT EQUIPMENT", "it_equip"));

    $('#class-options').append(new Option("MEDICAL EQUIPMENT", "med_equip"));
    $('#class-options').prop('disabled', false);

    $('#class-options').on('change', function () {
        var filter = $("#class-options option:selected").text();
        toogleSub(filter);
        localStorage.filter = filter;
        //clear btn text
        resetBtn();
        //clear search inputs and local storage
        clearLocalStorageFilters();
        //populate filters
        populate_dropdown();
        $('#currentAssetsTable').DataTable().clear().destroy();
        $('#outAssetsTable').DataTable().clear().destroy();
        $('#inAssetsTable').DataTable().clear().destroy();
        $('#searchView').show();
        $('#inSearch').show();
        $('#outSearch').show();
        // $('#loader').hide();
        // $('#searchView').hide();
        // document.getElementById('current').innerHTML = '<div id="searchView" class="search_start">'+
        //                                             '<p style="margin-top:200px">Please search your asset using the search above'+
        //                                             '</p>'+
        //                                             '<img width="200" src="../img/loupe.png" alt="Search">'+
        //                                         '</div>';

    });

} else {
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

function resetInput(resetId, resetTxt) {
    $(resetId).val(resetTxt);
}

// end dropdown handler

/*-------   Zoom handler -------*/
var width = screen.width;
var height = screen.height;
if ((width > 700) && (height < 700) || (width < 1400) && (height < 900)) {
    toggleZoomScreen("80%");
} else {
    toggleZoomScreen("100%");
}

function toggleZoomScreen(value) {
    document.body.style.zoom = value;
}

/*------   Zoom handler -----*/

function clearFunction() {

    clearLocalStorageFilters()
    populate_dropdown();

    $('#searchlocation').val("");
    $('#dropdown_location').text("AREA");
    $('#searchroomno').val("");
    $('#dropdown_room').text("ROOM");
    $('#searchasset').val("");
    $('#dropdown_assets').text("ASSET NO...");
    $('#clearAllFilters').prop('disabled', true);

}

// close application

// function closeApp() {

//     document.getElementById('overlay-alert-message').style.display = "none";
//     document.getElementById('overlay-alert-message').style.display = "block";
//     document.getElementById('alert_header').innerHTML = "Close Application";
//     document.getElementById('alert-message-body').innerHTML = '<div class="text-center" style="margin-top:-12px;"><img src="../img/fail.png" width=100><br><p class="text-danger text-muted text-lg">Are you sure you want to close the Assets Management System?</p>';
//     document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeMe()" style="width:100px">YES</button> <button class="btn btn-danger" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">Cancel</button>';

// }

// function closeMe()
// {
//     localStorage.clear();
//     open(location, '_self') 
//     window.close();
// }

function clearLocalStorageFilters() {
    localStorage.building = '';
    localStorage.level = '';
    localStorage.area = '';
    localStorage.room_no = '';
    localStorage.sub_location = '';
    localStorage.asset_primary_id = '';

    $('#search_move_building').val("");
    $('#search_move_level').val("");
    $('#search_move_area').val("");
    $('#search_move_room').val("");
    $('#search_move_sublocaction').val("");
    $('#search_move_assetNo').val("");


}


function resetBtn() {
    $('#building_move_filter').text("BUILDING");
    $('#level_move_filter').text("LEVEL");
    $('#area_move_filter').text("AREA");
    $('#room_move_filter').text("ROOM");
    $('#sublocaction_move_filter').text("SUB LOCATION");
    $('#assetNo_move_filter').text("ASSET NO");
}

//clear all filters
function cleaAllFilters() {

    clearLocalStorageFilters();

    populate_dropdown();

    $('#building_move_filter').text("BUILDING");
    $('#level_move_filter').text("LEVEL");
    $('#area_move_filter').text("AREA");
    $('#room_move_filter').text("ROOM");
    $('#sublocaction_move_filter').text("SUB LOCATION");
    $('#assetNo_move_filter').text("ASSET NO");

    //description
    $('#move_description').val("");


}

var onSearch_new = function (searchValue) {
    document.getElementById(searchValue).onkeypress = function (e) {
        console.log(e.keyCode);
        if (e.keyCode == 13) {
            e.preventDefault();
            setValueInputBtn(id, searchValue)
            search();
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

