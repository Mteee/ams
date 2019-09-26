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

window.onload = function(){
    if(localStorage.menuAssets !== '' || localStorage.menuRoom !== '' || localStorage.menuLocation !== ''){
        localStorage.building = '';
        localStorage.level = ''
        localStorage.area = ''
        localStorage.room_no = ''
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
    document.getElementById('overlay-asset').style.display = "block";
    // console.log($('#assetBody'));
    $('#assetBody')['0'].innerHTML = assetId;
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
            console.log("error");

        }
    });
}

function search() {

    var building = document.getElementById('search_view_building').value,
        level = document.getElementById('search_view_level').value,
        area = document.getElementById('search_view_area').value,
        room_no = document.getElementById('search_view_room').value;
        description = document.getElementById('view_description').value;

    var results = (building + " - " + level + " - " + area + " - " + room_no + " - " + description);
    var current = "";
    // console.log(results);
    if (" -  -  -  - " == results) {
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

        console.log('{"building" :"' + building + '","level" : "' + level + '","area" : "' + area + '","room_no" : "' + room_no + '","description" : "' + description + '","asset_class":"' + localStorage.filter + '"}');

        $.ajax({
            url: "../../ams_apis/slimTest/index.php/getAssets",
            type: "POST",
            dataType: 'json',
            data: '{"building" :"' + building + '","level" : "' + level + '","area" : "' + area + '","room_no" : "' + room_no + '","description" : "' + description + '","asset_class":"' + localStorage.filter + '"}',
            success: function (data) {
                console.log("======================data===============================");
                console.log(data);
                var table = null;
                console.log("================test===============================");
                // console.log(data);
                console.log(data.data.ASSET_IS_SUB);


                if (data.rows > 0) {

                    var str = '{"data" : [';
                    for (var k = 0; k < data.rows; k++) {
                        console.log(data.data[k].ASSET_IS_SUB);
                        if ((data.rows - 1) == k) {
                            str += '["' + data.data[k].ASSET_ID + '","' +
                                data.data[k].ASSET_ID + '","' +
                                data.data[k].ASSET_ROOM_NO + '","' +
                                data.data[k].ASSET_AREA + '","' +
                                data.data[k].ASSET_DESCRIPTION + '","' +
                                updateLetterToIcon(data.data[k].ASSET_IS_SUB) + '"]';
                        } else {
                            str += '["' + data.data[k].ASSET_ID + '","' +
                                data.data[k].ASSET_ID + '","' +
                                data.data[k].ASSET_ROOM_NO + '","' +
                                data.data[k].ASSET_AREA + '","' +
                                data.data[k].ASSET_DESCRIPTION + '","' +
                                updateLetterToIcon(data.data[k].ASSET_IS_SUB) + '"],';
                        }
                    }
                    str += ']}'

                    console.log("Replace all");
                    console.log(str);
                    
                    str = replaceAll("\n", "", str);
                    str = replaceAll("\"", "`", str);
                    // str = replaceAll("'", "^", str);
                    
                    console.log(str);

                    str = (JSON.parse(str));
                    // console.log(str.data);

                    table = createTable("#currentAssetsTable", str.data);

                    // table.clear().draw();


                }
                else {
                    // current += '<tr id="nodata" class="text-center"><th scope="row" colspan="6"><h1 class="text-muted">No data</h1></th></tr>';
                    // $('#searchView').fadeIn(500);
                    // console.log(data.data);

                    table = createTable("#currentAssetsTable", data.data);

                }

                $('#currentAssetsTable tbody,#currentAssetsTable thead').on('click', 'input[type="checkbox"]', function () {
                    // var data = table.row($(this).parents('tr')).data();
                    setTimeout(function () {
                        console.log(checkboxSelectedLength());
                        if (checkboxSelectedLength() > 0) {
                            $('#printAssets').fadeIn(500);
                        } else {
                            $('#printAssets').fadeOut(500);
                        }
                    }, 500);

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

                $('#currentAssetsTable tbody').on('click', 'button', function () {

                    var data = table.row($(this).parents('tr')).data();
                    if (data == null || data == undefined) {
                        data = (localStorage.tableDataSet).split(',');
                    } else {
                        localStorage.tableDataSet = data;
                    }
                    viewAsset(data[0]);
                });
                $('#loader').hide();
                // $('#printAssetsView').fadeIn(500);

            },
            error: function (err) {
                console.log(err)
                $('#searchView').fadeIn(500);
                $('#loader').hide();
                alert('Ooops');
            }
        });


        // $.ajax({
        //     url: "../../ams_apis/slimTest/index.php/getAssets",
        //     method: "POST",
        //     dataType: "JSON",
        //     success: function (data) {
        //         $('#loader').hide();
        //         // alert(results);
        //         console.log(data);
        //         if (data.rows > 0) {
        //             for (var i = 0; i < data.rows; i++) {
        //                 current += '<tr id="c_row' + data.data[i].ASSET_ID + '"><th scope="row" style="width: 10%;"><input id="check' + data.data[i].ASSET_ID + '" class="currentItems" type="checkbox" value="' + data.data[i].ASSET_ID + '" onclick="getNumberOfSelectedItems(currentSelectedItems,`#current .currentItems:checked`)"></th><td>' + data.data[i].ASSET_ID + '</td><td>' + data.data[i].ASSET_ROOM_NO + '</td><td>' + data.data[i].ASSET_AREA + '</td><td class="" style="width: 24%;">' + (data.data[i].ASSET_DESCRIPTION).substring(0, 20) + '...</td><td class="text-center" ><button class="btn btn-default" style="border-radius:50%;" onclick="viewAsset(`' + data.data[i].ASSET_ID + '`)"><span class="fa fa-eye item-view"></span></button></td></tr>';
        //             }
        //         } else {
        //             current += '<tr id="nodata" class="text-center"><th scope="row" colspan="6"><h1 class="text-muted">No data</h1></th></tr>';
        //             $('#searchView').fadeIn(500);
        //             console.log("here");
        //         }//close if
        //         // document.getElementById('currentItems').innerHTML = data.rows;
        //         document.getElementById('current').innerHTML = current;

        //         setTimeout(function () {
        //             // $('#searchView').fadeIn(500);
        //         }, 5000);
        //     },//close success function
        //     error: function (err) {
        //         console.log(err);
        //     }//close error function
        // });//close ajax function
    }
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
                    'value' : tableData[0]
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
        fnCreatedRow: function (nTd,nRow, aData, iDataIndex) {

            $(nRow).attr('id', aData[0]);
            // console.log($(nTd).children()[0].children);
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
    document.getElementById('overlay-printView').style.display = "block";
    // console.log($('#assetBody'));

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

    console.log(send_assets);

    $.ajax({
        // url: "assets.json",
        url: "../../ams_apis/slimTest/index.php/printView",
        method: "post",
        data: '{"asset_class":"","primary_asset_id" : "' + send_assets + '"}',
        dataType: "json",
        success: function (data) {
            console.log(data);
            var html_view = "";
            var p_count = 0;
            var count = 0;
            if (data.rows > 0) {
                for (var i = 0; i < data.rows; i++) {
                    // var primary_info = "";
                    // var primary_id = data.data[i].asset.primary[0];
                    // var len_primary = "";
                    var sub_info = "";
                    var th_primary = "<tr style='background:#222;color:#ffffff;'>";
                    if (data.data[i].ASSET_ID == data.data[i].ASSET_PRIMARY_ID) {
                        p_count++;
                        count = 0;

                        if (data.data[i].ASSET_IS_SUB == "y") {
                            th_primary += "<td class='text-center'><span class='toggle-btn' onclick=\"toggle_subs('.sub" + p_count + "')\"> + </span></td>";
                        } else {
                            th_primary += "<td class='text-center'> - </td>";
                        }

                        th_primary += "<td>" + data.data[i].ASSET_AREA + "</td><td>" + data.data[i].ASSET_ROOM_NO + "</td><td>" + data.data[i].ASSET_ID + "</td><td>" + data.data[i].ASSET_DESCRIPTION + "</td></tr>";
                        html_view += th_primary;
                    } else {
                        sub_info += "<tr class='sub" + p_count + "'><td>" + (count) + "</td>";

                        sub_info += "<td colspan='2'><td>" + data.data[i].ASSET_ID + "</td><td>" + data.data[i].ASSET_DESCRIPTION + "</td></tr>";
                        html_view += sub_info;
                    }
                    count++;
                }
                document.getElementById('tbodyPrint').innerHTML = html_view;
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function printData() {
    var divToPrint = document.getElementById("tablePrint");
    var htmlToPrint = '' +
        '<style type="text/css">' +
        'table th, table td {' +
        'border:1px solid #000;' +
        'padding:0.5em;' +
        'font-size:12pt;' +
        '}' +
        '</style>';
    htmlToPrint += divToPrint.outerHTML;
    newWin = window.open("");
    newWin.document.write(htmlToPrint);
    newWin.print();
    newWin.close();
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
// function printView() {

//     var id = $('.checkitem:checked').map(function () {
//         return $(this).val();
//     }).get().join(' ');

//     console.log(id);
// }


function checkboxSelectedLength() {
    var lengthh = $(":checkbox:checked").length;
    return lengthh;
}

//updating y to icons
function updateLetterToIcon(letter) {


    var results = "";

    switch (letter) {
        case "Y":
            results = "<p class='text-success'><strong>YES</strong></p>";
            break;
        case "N":
            results = "<p class='text-danger'><strong>NO</strong></p>";
            break;
    }

    return results;
}//close updateLetterToIcon function

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

function populate_dropdown() {

    // get room
    getItems('../../ams_apis/slimTest/index.php/asset_room_no_view', 'search_view_room', 'scroll_view_room', 'menu_view_room', 'empty_view_room');
    // get area
    getItems('../../ams_apis/slimTest/index.php/asset_area_view', 'search_view_area', 'scroll_view_area', 'meun_view_area', 'empty_view_area');
    // get level
    getItems('../../ams_apis/slimTest/index.php/asset_level_new_view', 'search_view_level', 'scroll_view_level', 'menu_view_level', 'empty_view_level');
    // get building
    getItems('../../ams_apis/slimTest/index.php/building_view', 'search_view_building', 'scroll_view_building', 'menu_view_building', 'empty_view_building');

}

populate_dropdown();

// onchanged menu

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

var allArr = {
    searchasset: [],
    searchroomno: [],
    searchlocation: []
};

// console.log("allArr");
// console.log(allArr);
// console.log("allArr");

function getItems(url, id, scrollArea, menuid) {

    console.log('{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","asset_class":"' + localStorage.filter + '"}');

    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        data: '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","asset_class":"' + localStorage.filter + '"}',
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
            console.log("Error");
            console.log(localStorage.filter);
        }
    });
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
        // localStorage.menuId
        localStorage.menuAssets = '';
        localStorage.menuLocation = '';
        localStorage.menuRoom = '';
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

// searchasset.onkeyup = onSearch(this);
// buildDropDown('#menuRoom',names);
// buildDropDown('#menuLocation',names);

function replaceAll(find, replace, str) {
    console.log(str.indexOf(find));
    while (str.indexOf(find) > -1) {
        str = str.replace(find, replace);
    }
    return str;
}

// function clearData(input, btnDafualtId, text) {
//     // var inputData = document.getElementById(input).(val);
//     document.getElementById('menuLocation').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
//     document.getElementById('menuRoom').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
//     document.getElementById('menuAssets').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
//     var value = $(input).val();
//     if (value.length > 0) {
//         localStorage.menuRoom = '';
//         localStorage.menuAssets = '';
//         localStorage.menuLocation = '';
//         populate_dropdown();
//         $(input).val("");
//         $(btnDafualtId).text(text);
//     }
// }


function clearData(input, btnDafualtId, text) {
    // var inputData = document.getElementById(input).(val);
    var value = $(input).val();

    if (value.length > 0) {

        if (input == "#search_view_building") {
            document.getElementById('menu_view_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_view_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            
        
            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';

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
            

        } else if (input == "#search_view_level") {

            document.getElementById('menu_view_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_view_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            populate_dropdown();

            $(input).val("");
            $(btnDafualtId).text(text);

            $('#search_view_level').val("");
            $('#level_view_filter').text("LEVEL");
            $('#search_view_area').val("");
            $('#area_view_filter').text("AREA");
            $('#search_view_room').val("");
            $('#room_view_filter').text("ROOM");

        } else if (input == "#search_view_area") {

            document.getElementById('meun_view_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_view_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.area = '';
            localStorage.room_no = '';

            populate_dropdown();
  
            $('#search_view_area').val("");
            $('#area_view_filter').text("AREA");
            $('#search_view_room').val("");
            $('#room_view_filter').text("ROOM");

        } else if (input == "#search_view_room") {

            document.getElementById('menu_view_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.room_no = '';

            populate_dropdown();

            $('#search_view_room').val("");
            $('#room_view_filter').text("ROOM");

        } 


        // if (btnDafualtId == "#dropdown_approve_room") {
        //     populate_room();
        //     $(input).val("");
        //     $(btnDafualtId).text(text);
        // }
    }
}

function resetBtn(resetId, resetTxt) {
    $(resetId).text(resetTxt);
}

function resetInput(resetId, resetTxt) {
    $(resetId).val(resetTxt);
}


// $('#clearAssets').on('click', function(){
//     console.log('searchValue');

//     if(searchValue.value.length > 0){
//         console.log('searchValue');
//         $(searchValue).text('');
//     }
// });

if (localStorage.filter == "ALL EQUIPMENT") {

    $('#class-options').append(new Option("ALL EQUIPMENT", "all_equip"));
    $('#class-options').append(new Option("FACILITIES MANAGEMENT", "fac_equip"));
    $('#class-options').append(new Option("IT EQUIPMENT", "it_equip"));
    $('#class-options').append(new Option("MEDICAL EQUIPMENT", "med_equip"));
    $('#class-options').prop('disabled', false);

    $('#class-options').on('change', function () {
        var filter = $("#class-options option:selected").text();
        localStorage.filter = filter;

        clearLocalStorageFilters();
        populate_dropdown();

        //clear btn text
        resetBtn('#building_view_filter', "BUILDING");
        resetBtn('#level_view_filter', "LEVEL");
        resetBtn('#area_view_filter', "AREA");
        resetBtn('#room_view_filter', "ROOM");
    
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

function clearLocalStorageFilters(){
    localStorage.building = '';
    localStorage.level = '';
    localStorage.area = '';
    localStorage.room_no = '';

    $('#search_view_building').val("");
    $('#search_view_level').val("");
    $('#search_view_area').val("");
    $('#search_view_room').val("");

}

function cleaAllFilters(){

    clearLocalStorageFilters();

    populate_dropdown();

    $('#building_view_filter').text("BUILDING");
    $('#level_view_filter').text("LEVEL");
    $('#area_view_filter').text("AREA");
    $('#room_view_filter').text("ROOM");
     
     //description
     $('#view_description').val("");


}