
/*!
 * AME SYSADMIN Library JS
 * website
 * Copyright AME SOFTWARE DEVELOPMENT TEAM (Talent & Melusi)
 * Released under the AME license
 * Date: 2019-07-29
 */

//check for filter in local storage || all asset users
if (localStorage.backupFilter == undefined || localStorage.backupFilter == "undefined") {
    localStorage.backupFilter = localStorage.filter;
} else {
    localStorage.filter = localStorage.backupFilter;
}

window.onload = function () {
    if (localStorage.menuAssets !== '' || localStorage.menuRoom !== '' || localStorage.menuLocation !== '') {
        localStorage.menuAssets = '';
        localStorage.menuLocation = ''
        localStorage.menuRoom = ''
        populate_dropdown();
    }
}

$('#searchView').fadeIn(500);

var user_class = localStorage.getItem("filter");

$('.user-class option').text(user_class);

console.log(user_class);

function closeAsset(overlay_id) {
    document.getElementById(overlay_id).style.display = "none";
}

function viewAsset(assetId) {
    var currentItem = "";
    document.getElementById('overlay-asset').style.display = "block";
    console.log($('#assetBody'));
    $('#assetBody')['0'].innerHTML = assetId;

    $.ajax({
        url: "../../ams_apis//slimTest/index.php/singleAsset",
        method: "POST",
        dataType: "JSON",
        data: '{"primary_asset_id" :"' + assetId + '"}',
        success: function (data) {
            console.log("success");
            document.getElementById('viewAssets').innerHTML = data[0].table;
            document.getElementById('subItemCount').innerText = data[0].items;
        },
        error: function (err) {
            console.log(err);
            console.log("error");

        }
    });
}

var tableArr = {
    currentAssetsTable: [],
    inAssetsTable: [],
    outAssetsTable: []
};


function search() {
    console.log('called');
    var assetNo = document.getElementById('searchasset').value,
        room = document.getElementById('searchroomno').value,
        location = document.getElementById('searchlocation').value,
        description = document.getElementById('description').value;

    var results = (assetNo + " - " + room + " - " + location + " - " + description);
    var current = "";

    if (" -  -  - " == results) {
        alert("Please enter alteast one filter");
    } else if (room == "" && location == "") {
        alert("Please enter room or location to assist filtering data");
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

        $.ajax({
            url: url,
            type: "POST",
            dataType: 'json',
            data: '{"v_assetNo" :"' + assetNo + '","v_room" : "' + room + '","v_location" : "' + location + '","v_description" : "' + description + '","asset_class":"' + localStorage.filter + '","username":"' + localStorage.username + '"}',
            success: function (data) {
                $('#searchView').hide();
                $('#loader').hide();
                var table = null;
                var rowIds = [];
                var ASSET_ROOM_NO = "";
                if (data.rows > 0) {
                    localStorage.table_len = data.rows;
                    console.log(data);
                    var str = '{"data" : [';
                    for (var k = 0; k < data.rows; k++) {

                        if (data.data[k].ASSET_ROOM_NO == null) {
                            ASSET_ROOM_NO = "NOT SPECIFIED";
                        } else {
                            ASSET_ROOM_NO = data.data[k].ASSET_ROOM_NO;
                        }
                        if (data.data[k].ASSET_TRANSACTION_STATUS == "Pending") {
                            console.log(data.data[k].ASSET_PRIMARY_ID);
                            rowIds.push(data.data[k].ASSET_PRIMARY_ID);

                        };
                        if ((data.rows - 1) == k) {
                            str += '["' + data.data[k].ASSET_PRIMARY_ID + '","' +
                                data.data[k].ASSET_PRIMARY_ID + '","' +
                                ASSET_ROOM_NO + '","' +
                                data.data[k].ASSET_LOCATION_AREA + '","' +
                                data.data[k].ASSET_DESCRIPTION + '","' +
                                updateLetterToIcon(data.data[k].ASSET_IS_SUB) + '"]';
                        } else {
                            str += '["' + data.data[k].ASSET_PRIMARY_ID + '","' +
                                data.data[k].ASSET_PRIMARY_ID + '","' +
                                ASSET_ROOM_NO + '","' +
                                data.data[k].ASSET_LOCATION_AREA + '","' +
                                data.data[k].ASSET_DESCRIPTION + '","' +
                                updateLetterToIcon(data.data[k].ASSET_IS_SUB) + '"],';
                        }
                    }
                    str += ']}'
                    str = replaceAll("\r\n", "", str);
                    str = (JSON.parse(str));
                    // console.log(str.data);


                    // console.log(table_dom);

                    table = createTable(table_dom, str.data, length, rowIds);

                    var _table_id = table_dom.replace("#", "");
                    tableArr[_table_id] = table;



                    $(table_dom + ' tbody, ' + table_dom + ' thead').on('click', 'input[type="checkbox"]', function () {
                        // var data = table.row($(this).parents('tr')).data();
                        setTimeout(function () {
                            console.log(checkboxSelectedLength());
                            if (checkboxSelectedLength() > 0) {
                                $(actionBtn).fadeIn(500);
                                // console.log("Test");
                            } else {
                                // console.log("Else Test");
                                $(actionBtn).fadeOut(500);
                            }
                        }, 500);
                    });


                    // table.clear().draw();


                }
                else {
                    // current += '<tr id="nodata" class="text-center"><th scope="row" colspan="6"><h1 class="text-muted">No data</h1></th></tr>';
                    // $('#searchView').fadeIn(500);
                    console.log(data.data);

                    table = createTable(table_dom, data.data);

                }

                $(table_dom + ' tbody').on('click', 'input[type="checkbox"]', function () {

                    // var data = table.row($(this).parents('tr')).data();

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

                $(table_dom + ' tbody').on('click', 'button', function () {

                    var data = table.row($(this).parents('tr')).data();
                    if (data == null || data == undefined) {
                        data = (localStorage.tableDataSet).split(',');
                    } else {
                        localStorage.tableDataSet = data;
                    }
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
        console.log(lengthh);
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
            // "ordering": true,
            "ordering": false,
            "pageLength": length,
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
                    "targets": [-2, 0]
                },
                {
                    "targets": -2,
                    "orderable": false
                }
            ], 'select': {
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
                console.log((rows_selected.join(",")).split(","));

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

function populate_dropdown() {

    // get assets
    getItems('../../ams_apis/slimTest/index.php/asset_no', 'searchasset', 'scrollAssets', 'menuAssets', 'emptyAsset');
    // get room_no
    getItems('../../ams_apis/slimTest/index.php/room_no', 'searchroomno', 'scrollRoom', 'menuRoom', 'emptyRoom');
    // get location
    getItems('../../ams_apis/slimTest/index.php/location', 'searchlocation', 'scrollLocation', 'menuLocation', 'emptyLocation');

}

function populate_tran_dropdown() {
    // get room_no
    getItems('../../ams_apis/slimTest/index.php/room_no', 'search_transfer_roomno', 'scroll_transfer_room', 'menu_transfer_Room', 'empty_transfer_Room');
    // get location
    getItems('../../ams_apis/slimTest/index.php/location', 'search_transfer_location', 'scroll_tarnsfer_Location', 'menu_transfer_Location', 'empty_transfer_Location');
}

populate_dropdown();


// populate room no
function populate_room() {
    getItems('../../ams_apis/slimTest/index.php/room_no', 'search_approve_roomno', 'scroll_approve_room', 'menu_approve_Room', 'empty_approve_Room');
}


var allArr = {
    searchasset: [],
    searchroomno: [],
    searchlocation: []
};

// console.log("allArr");
// console.log(allArr);
// console.log("allArr");

function getItems(url, id, scrollArea, menuid) {
    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        data: '{"asset_class":"' + localStorage.filter + '","asset_location":"' + localStorage.menuLocation + '","asset_room":"' + localStorage.menuRoom + '","asset_id":"' + localStorage.menuAssets + '"}',
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

            // localStorage.setItem(id, JSON.stringify(rows));
            // Storage.prototype._setItem(id,rows);


            filterItems(rows, id, scrollArea, menuid);
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
            console.log(data_err);
            console.log(localStorage.filter);
        }
    })
}

var clusterize = {
    searchasset: [],
    searchroomno: [],
    searchlocation: []
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



function getSelectedItems(id) {

    var rows_selected = tableArr[id].column(0).checkboxes.selected();

    // var data = table.row($("<input type='checkbox' value='' class='dt-checkboxes'>").parents('tr')).data();

    console.log(rows_selected);
    // var rows_selected = $(id+" input:checkbox:checked").val()
    var rowsSelected = rows_selected.join(",").split(",");

    document.getElementById('movItemCount').innerHTML = rowsSelected.length;

    populate_tran_dropdown();
    getSelectedAssets(rowsSelected);
    var assetValues = createAssetDelimeter(rowsSelected);

    if (id == "outAssetsTable") {
        document.getElementById('overlay-alert-message').style.display = "none";
        document.getElementById('overlay-alert-message').style.display = "block";
        document.getElementById('alert_header').innerHTML = "Assets Cancel";
        document.getElementById('alert-message-body').innerHTML = '<span style="font-weight: bold;color:red;">Are you sure you want to cancel?</span>';
        document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="continueCancel(\'' + assetValues + '\')" style="width:100px">YES</button> <button class="btn btn-danger" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">Cancel</button>';     
    }
    else if (id == "inAssetsTable") {
        document.getElementById('approveItemCount').innerHTML = rowsSelected.length;
        var comma_del = "";
        for (var i = 0; i < rowsSelected.length; i++) {
            if (i == rowsSelected.length - 1) {
                comma_del += "\'" + rowsSelected[i] + "\'";
            } else {
                comma_del += "\'" + rowsSelected[i] + "\',";
            }

        }

        console.log(comma_del);
        checkNullRoom(comma_del, assetValues);

        // get_selected_room


        $("#confirmApprove").click(function () {

            var input_Room = $("#dropdown_approve_room").text();

            if (input_Room.indexOf("ROOM...") > -1) {
                // alert("Please select room");
                document.getElementById('overlay-alert-message').style.display = "block";
                document.getElementById('alert_header').innerHTML = "Assets Approve";
                document.getElementById('alert-message-body').innerHTML = '<span style="font-weight: bold;">Please select room</span>';
                document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">OK</button>';

            } else {
                console.log(assetValues);
                approveAssets(assetValues, input_Room);

            }
        });



    }
    else {

        localStorage.menuRoom = '';
        localStorage.menuAssets = '';
        localStorage.menuLocation = '';

        populate_tran_dropdown();

        document.getElementById('overlay-transfer').style.display = "block";
        $("#confirmTransfer").click(function () {
            var input_location = $("#dropdown_transfer_location").text();
            var input_Room = $("#dropdown_transfer_room").text();


            if (input_location.indexOf("LOCATION...") > -1) {
                // alert("Location is required");
                document.getElementById('overlay-alert-message').style.display = "none";
                document.getElementById('overlay-alert-message').style.display = "block";
                document.getElementById('alert_header').innerHTML = "Assets Transfer";
                document.getElementById('alert-message-body').innerHTML = '<span style="font-weight: bold;color:red;">Location is required</span>';
                document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">OK</button>';
            }
            else {
                if (input_Room.indexOf("ROOM...") > -1) {
                    input_Room = '';
                    console.log('<button class="btn btn-success" onclick="continuee(' + assetValues + ',' + input_location + ',' + input_Room + ')" style="width:100px">YES</button> <button class="btn btn-danger" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">Cancel</button>');
                    document.getElementById('overlay-alert-message').style.display = "none";
                    document.getElementById('overlay-alert-message').style.display = "block";
                    document.getElementById('alert_header').innerHTML = "Assets Transfer";
                    document.getElementById('alert-message-body').innerHTML = '<span style="font-weight: bold;color:red;">Are you sure you want to continue without selecting the room?</span>';
                    document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="continuee(\'' + assetValues + '\',\'' + input_location + '\',\'' + input_Room + '\')" style="width:100px">YES</button> <button class="btn btn-danger" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">Cancel</button>';

                } else {
                    confirmAssets(assetValues, input_location, input_Room);
                }
            }
        });
    }

}

function continueCancel(assetValues) {
    cancelAssets(assetValues);
    search();
}

function continuee(assetValues, input_location, input_Room) {
   
    confirmAssets(assetValues, input_location, input_Room);
}

function checkNullRoom(assetvalues, asset_values_cap_del) {

    $.ajax({
        url: '../../ams_apis/slimTest/index.php/checkRoom',
        method: 'POST',
        data: '{"asset_id":"' + assetvalues + '"}',
        dataType: 'JSON',
        success: function (data) {
            console.log(data);
            if (data.rows > 0) {
                // console.log("here");
                document.getElementById('dropdown_approve_location').innerHTML = localStorage.menuLocation;
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

            }
            else {
                approveAssets(asset_values_cap_del, "");
            }

        },
        error: function (dataErr) {
            console.log(dataErr);
            console.log(assetvalues);
        }
    })

}

function cancelAssets(selectedItems) {

    $.ajax({
        url: '../../ams_apis/slimTest/index.php/cancelTransfer',
        method: 'POST',
        data: '{"username":"' + localStorage.username + '","asset_id":"' + selectedItems + '"}',
        dataType: 'JSON',
        success: function (data) {
            console.log(data);
            document.getElementById('overlay-alert-message').style.display = "none";
            document.getElementById('overlay-alert-message').style.display = "block";
            document.getElementById('alert_header').innerHTML = "Assets Cancel";
            document.getElementById('alert-message-body').innerHTML = ' <img src="../img/success.gif" alt="success" style="width: 51px;margin: 8px 11px;"><br /><span style="color:green;font-weight: bold;">' + data.data + '</span>';
            document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">OK</button>';

            console.log('{"username":"' + localStorage.username + '","asset_id":"' + selectedItems + '"}');

        },
        error: function (dataErr) {
            console.log(dataErr);
        }
    })
}

function approveAssets(assetValues, room) {
    $.ajax({
        url: '../../ams_apis/slimTest/index.php/approveAsset',
        dataType: 'JSON',
        method: 'POST',
        data: '{"username":"' + localStorage.username + '","assetIds":"' + assetValues + '","location":"' + localStorage.menuLocation + '","room":"' + room + '"}',
        success: function (data) {
            // alert();
            document.getElementById('overlay-alert-message').style.display = "none";
            document.getElementById('overlay-alert-message').style.display = "block";
            document.getElementById('alert_header').innerHTML = "Assets Approve";
            document.getElementById('alert-message-body').innerHTML = ' <img src="../img/success.gif" alt="success" style="width: 51px;margin: 8px 11px;"><br /><span style="color:green;font-weight: bold;">' + data.data + '</span>';
            document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">OK</button>';

            console.log(data);
            document.getElementById('overlay-approve').style.display = "none";
            search();
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

function confirmAssets(assetIds, location, room) {
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/confirmTransfer",
        data: '{"username":"' + localStorage.username + '","assetIds":"' + assetIds + '","location":"' + location + '","room":"' + room + '"}',
        method: "POST",
        dataType: "JSON",
        success: function (data) {
            console.log(data);
            document.getElementById('overlay-alert-message').style.display = "none";
            document.getElementById('overlay-alert-message').style.display = "block";
            document.getElementById('alert_header').innerHTML = "Assets Transfer";
            document.getElementById('alert-message-body').innerHTML = ' <img src="../img/success.gif" alt="success" style="width: 51px;margin: 8px 11px;"><br /><span style="color:green;font-weight: bold;">' + data.data + '</span>';
            document.getElementById('alert-footer').innerHTML = '<button class="btn btn-success" onclick="closeAsset(\'overlay-alert-message\')" style="width:100px">OK</button>';

            // alert();
            document.getElementById('overlay-transfer').style.display = "none";
            localStorage.menuRoom = room;
            search();
            $('#btnTransfer').fadeOut(500);
        },
        error: function (dataErr) {
            console.log('{"username":"' + localStorage.username + '","assetIds":"' + assetIds + '","location":"' + location + '","room":"' + room + '"}');
            console.log(dataErr);
        }

    })
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

    $.ajax({
        url: "../../ams_apis/slimTest/index.php/pendingTransfer",
        method: "post",
        data: '{"primary_asset_id" : "' + send_assets + '"}',
        dataType: "json",
        success: function (data) {
            $('#loaderTrans').fadeOut(500);
            console.log("===============================data===============================");
            console.log(data);
            console.log("===============================/////data/////===============================");
            var current = "";
            if (data.rows > 0) {
                for (var i = 0; i < data.rows; i++) {
                    current += "<tr><td>" + data.data[i].ASSET_PRIMARY_ID + "</td><td>" + data.data[i].ASSET_ROOM_NO + "</td></tr>";
                }
            }
            document.getElementById('assetTbodyTransfer').innerHTML = current;
            console.log(current);
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




var onSearch = function (searchValue, emptyId) {

    var getId = searchValue;

    var found = false;
    // console.log(localStorage.getItem("rows"));

    // var rows = JSON.parse(localStorage.getItem(searchValue));
    var rows = allArr[searchValue];

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
        var resObj = checkFilter(getId);
        $('#dropdown_location').text($(this)[0].value);
        ;
        $('#' + resObj.btnId).text(resObj.btnContent);
        populate_room();
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
        if (btnDafualtId == "#dropdown_approve_room") {
            populate_room();
            $(input).val("");
            $(btnDafualtId).text(text);

        }
        else {
            localStorage.menuRoom = '';
            localStorage.menuAssets = '';
            localStorage.menuLocation = '';
            populate_dropdown();
            populate_tran_dropdown();
            $(input).val("");
            $(btnDafualtId).text(text);
        }

    }
}







//If the user clicks on any item, set the title of the button as the text of the item
$('#menuAssets').on('click', '.dropdown-item', function () {
    $('#dropdown_assets').text($(this)[0].value);
    localStorage.menuAssets = $(this)[0].value;
    populate_dropdown();
    $("#dropdown_assets").dropdown('toggle');
    $('#searchasset').val($(this)[0].value);
})
$('#menuRoom').on('click', '.dropdown-item', function () {
    $('#dropdown_room').text($(this)[0].value);
    localStorage.menuRoom = $(this)[0].value;
    populate_dropdown();
    $("#dropdown_room").dropdown('toggle');
    $('#searchroomno').val($(this)[0].value);
})
$('#menuLocation').on('click', '.dropdown-item', function () {
    $('#dropdown_location').text($(this)[0].value);
    localStorage.menuLocation = $(this)[0].value;
    populate_dropdown();
    $("#dropdown_location").dropdown('toggle');
    $('#searchlocation').val($(this)[0].value);
})


//Transfer Overlay View

$('#menu_transfer_Room').on('click', '.dropdown-item', function () {
    $('#dropdown_transfer_room').text($(this)[0].value);
    localStorage.menuRoom = $(this)[0].value;
    populate_tran_dropdown();
    $("#dropdown_transfer_room").dropdown('toggle');
    $('#search_transfer_roomno').val($(this)[0].value);
})

$('#menu_transfer_Location').on('click', '.dropdown-item', function () {
    $('#dropdown_transfer_location').text($(this)[0].value);
    localStorage.menuLocation = $(this)[0].value;
    populate_tran_dropdown();
    $("#dropdown_transfer_location").dropdown('toggle');
    $('#search_transfer_location').val($(this)[0].value);
})

//Approve

$('#menu_approve_Room').on('click', '.dropdown-item', function () {
    $('#dropdown_approve_room').text($(this)[0].value);
    populate_room();
    $("#dropdown_approve_room").dropdown('toggle');
    $('#search_approve_roomno').val($(this)[0].value);
})


// dropdown hangler

if (localStorage.filter == "All EQUIPMENT") {

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
        populate_dropdown();
    });

} else {
    $('#class-options').append(new Option(localStorage.filter, "user_class"));
    $('#class-options').css({ "-moz-appearance": "none" });
    $('#class-options').prop('disabled', 'disabled');
}

function resetBtn(resetId, resetTxt) {
    $(resetId).text(resetTxt);
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