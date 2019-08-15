
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

window.onload = function(){
    if(localStorage.menuAssets !== '' || localStorage.menuRoom !== '' || localStorage.menuLocation !== ''){
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

        makeCall("../../ams_apis/slimTest/index.php/getCurrentAssets",'#btnTransfer','#currentAssetsTable', 10);
        // makeCall("../../ams_apis/slimTest/index.php/getOutAssets",'#btnApprove','#inAssetsTable', 3);
        // makeCall("../../ams_apis/slimTest/index.php/getInAssets",'#btnCancel','#outAssetsTable', 3);

    }

    function makeCall(url,actionBtn,table_dom, length) {

        $.ajax({
            url: url,
            type: "POST",
            dataType: 'json',
            data: '{"v_assetNo" :"' + assetNo + '","v_room" : "' + room + '","v_location" : "' + location + '","v_description" : "' + description + '","asset_class":"' + localStorage.filter + '"}',
            success: function (data) {
                console.log("=====================================================data==================================================");
                console.log(data);
                $('#loader').hide();
                var table = null;
                var rowIds = [];
                if (data.rows > 0) {

                    var str = '{"data" : [';
                    for (var k = 0; k < data.rows; k++) {
                        if(data.data[k].ASSET_TRANSACTION_STATUS == "Pending"){
                            console.log(data.data[k].ASSET_ID);
                            rowIds.push(data.data[k].ASSET_ID);
                        };
                        if ((data.rows - 1) == k) {
                            str += '["' + data.data[k].ASSET_ID + '","' +
                                data.data[k].ASSET_ID + '","' +
                                data.data[k].ASSET_ROOM_NO + '","' +
                                data.data[k].ASSET_LOCATION_AREA + '","' +
                                data.data[k].ASSET_DESCRIPTION + '","' +
                                updateLetterToIcon(data.data[k].ASSET_IS_SUB) + '"]';
                        } else {
                            str += '["' + data.data[k].ASSET_ID + '","' +
                                data.data[k].ASSET_ID + '","' +
                                data.data[k].ASSET_ROOM_NO + '","' +
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

                    table = createTable(table_dom, str.data, length,rowIds);

                    $(actionBtn).fadeIn(500);
                    // table.clear().draw();


                }
                else {
                    // current += '<tr id="nodata" class="text-center"><th scope="row" colspan="6"><h1 class="text-muted">No data</h1></th></tr>';
                    $('#searchView').fadeIn(500);
                    console.log(data.data);

                    table = createTable(table_dom, data.data);

                }

                $(table_dom +' tbody').on('click', 'input[type="checkbox"]', function () {
                    var data = table.row($(this).parents('tr')).data();

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

    function createTable(tableID, tableData, length,rowIds) {
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
                    },
                     render: function (data, type, row, meta) {
                    var checkbox = $("<input/>", {
                        "type": "checkbox"
                    });
                    
                    checkbox.prop("value", data);
                    return checkbox.prop("outerHTML")
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
            fnCreatedRow: function( nRow, aData, iDataIndex ) {
                $(nRow).attr('id', aData[0]);
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

        var table_len = (table.columns('#asset-id').data()[0]).length;

        if(rowIds.length>0){

            for(var t=0;t<table_len;t++){
                console.log("=========================================================================for loop=========================================================================");
                $('#'+rowIds[t]).css({
                    'background-color': '#948d8d7d',
                    'pointer-events': 'none',
                    'cursor': 'not-allowed',
                    'color': '#4e4d4d',
                    'transition': '500ms'
                });
            }

        }
    
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

function populate_tran_dropdown(){
    // get room_no
    getItems('../../ams_apis/slimTest/index.php/room_no', 'search_transfer_roomno', 'scroll_transfer_room', 'menu_transfer_Room', 'empty_transfer_Room');
    // get location
    getItems('../../ams_apis/slimTest/index.php/location', 'search_transfer_location', 'scroll_tarnsfer_Location', 'menu_transfer_Location', 'empty_transfer_Location');
}

populate_dropdown();


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



function transfrAssets(id){

    localStorage.menuRoom = '';
    localStorage.menuAssets = '';
    localStorage.menuLocation = '';


    var rows_selected = $(id+" input:checkbox:checked").val().join(',');

    console.log(rows_selected);

    populate_tran_dropdown();
    document.getElementById('overlay-transfer').style.display = "block";
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
        localStorage.menuRoom = '';
        localStorage.menuAssets = '';
        localStorage.menuLocation = '';
        populate_dropdown();
        populate_tran_dropdown();
        $(input).val("");
        $(btnDafualtId).text(text);
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