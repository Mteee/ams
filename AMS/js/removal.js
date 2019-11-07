/*!
 * AME SYSADMIN Library JS
 * website
 * Copyright AME SOFTWARE DEVELOPMENT TEAM (Talent & Melusi)
 * Released under the AME license
 * Date: 2019-07-29
 */
//Clear Local Storage

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
    localStorage.building = '';
    localStorage.level = '';
    localStorage.area = '';
    localStorage.room_no = '';
    localStorage.sub_location = '';
    localStorage.asset_primary_id = '';
    open("../index.html", '_self')
    window.location.replace("../index.html");
    window.close();
}

clearLocalStorageFilters();

//check for filter in local storage
if (localStorage.backupFilter == undefined || localStorage.backupFilter == "undefined") {
    localStorage.backupFilter = localStorage.filter;
} else {
    localStorage.filter = localStorage.backupFilter;
}

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


$('#searchView').fadeIn(500);

var user_class = localStorage.filter;

$('.user-class option').text(user_class);

var decom_asset = [];

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
            console.log(data);
            document.getElementById('viewAssets').innerHTML = data[0].table;
            document.getElementById('subItemCount').innerText = data[0].items;
        },
        error: function (err) {
            console.log(err);
            console.log("error");

        }
    });
}

var table_data = { currentAssetsTable: [] }

function search() {

    var building = document.getElementById('search_removal_building').value,
        level = document.getElementById('search_removal_level').value,
        area = document.getElementById('search_removal_area').value,
        room_no = document.getElementById('search_removal_room').value;
    description = document.getElementById('view_description').value;
    sub_location = document.getElementById('search_removal_sublocaction').value;
    asset_primary_id = document.getElementById('search_removal_assetNo').value;

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
            url: "../../ams_apis/slimTest/index.php/getAll_Assets_with_Cert_no",
            type: "POST",
            dataType: 'json',
            data: '{"building" :"' + building + '","level" : "' + level + '","area" : "' + area + '","room_no" : "' + room_no + '","description" : "' + description + '","asset_sub_location" : "' + sub_location + '","asset_no" : "' + asset_primary_id + '","asset_class":"' + localStorage.filter + '"}',
            success: function (data) {
                $('#loader').fadeOut(500);

                console.log("======================data===============================");
                // console.log(data);
                var table = null;
                console.log("================test===============================");
                // console.log(data);
                // console.log(data.data.ASSET_IS_SUB);


                if (data.rows > 0) {

                    var str = '{"data" : [';
                    for (var k = 0; k < data.rows; k++) {
                        // console.log(data.data[k].ASSET_IS_SUB);
                        // if ((data.rows - 1) == k) {

                        //     if(data.data[k].ASSET_CLASS == "IT EQUIPMENT"){
                        //         str += '["' + data.data[k].ASSET_SUB_LOCATION + '","';
                        //         str +=    data.data[k].ASSET_SUB_LOCATION + '","';
                        //     }else{
                        //         str += '["' + data.data[k].ASSET_ID + '","';
                        //         str +=    data.data[k].ASSET_ID + '","';
                        //     }

                        //     str +=    data.data[k].ASSET_ROOM_NO + '","';
                        //     str +=    data.data[k].ASSET_AREA + '","';
                        //     str +=    replaceAll("\"", "`", data.data[k].ASSET_DESCRIPTION) + '","';
                        //     str +=    updateLetterToIcon(data.data[k].ASSET_IS_SUB) + '"]';
                        // } else {

                        //     if(data.data[k].ASSET_CLASS == "IT EQUIPMENT"){
                        //         str += '["' + data.data[k].ASSET_SUB_LOCATION + '","';
                        //         str +=    data.data[k].ASSET_SUB_LOCATION + '","';
                        //     }else{
                        //         str += '["' + data.data[k].ASSET_ID + '","';
                        //         str +=    data.data[k].ASSET_ID + '","';
                        //     }

                        //     str +=    data.data[k].ASSET_ROOM_NO + '","';
                        //     str +=    data.data[k].ASSET_AREA + '","';
                        //     str +=    replaceAll("\"", "`", data.data[k].ASSET_DESCRIPTION) + '","';
                        //     str +=    updateLetterToIcon(data.data[k].ASSET_IS_SUB) + '"],';
                        // }
                        if ((data.rows - 1) == k) {

                            str += '["' + data.data[k].ASSET_ID + '","';
                            str += data.data[k].ASSET_ID + '","';
                            str += data.data[k].ASSET_SUB_LOCATION + '","';
                            str += data.data[k].ASSET_ROOM_NO + '","';
                            str += data.data[k].ASSET_AREA + '","';
                            str += replaceAll("\"", "`", data.data[k].ASSET_DESCRIPTION) + '","';
                            str += updateLetterToIcon(data.data[k].ASSET_IS_SUB) + '"]';
                        } else {

                            str += '["' + data.data[k].ASSET_ID + '","';
                            str += data.data[k].ASSET_ID + '","';
                            str += data.data[k].ASSET_SUB_LOCATION + '","';
                            str += data.data[k].ASSET_ROOM_NO + '","';
                            str += data.data[k].ASSET_AREA + '","';
                            str += replaceAll("\"", "`", data.data[k].ASSET_DESCRIPTION) + '","';
                            str += updateLetterToIcon(data.data[k].ASSET_IS_SUB) + '"],';
                        }
                    }

                    str += ']}'

                    console.log("Replace all");
                    console.log(str);

                    str = replaceAll("\n", "", str);
                    // str = replaceAll("'", "^", str);

                    console.log(str);

                    str = (JSON.parse(str));
                    // console.log(str.data);

                    table_data["currentAssetsTable"] = createTable("#currentAssetsTable", str.data);

                    // table.clear().draw();


                }
                else {
                    // current += '<tr id="nodata" class="text-center"><th scope="row" colspan="6"><h1 class="text-muted">No data</h1></th></tr>';
                    // $('#searchView').fadeIn(500);
                    // console.log(data.data);

                    table_data["currentAssetsTable"] = createTable("#currentAssetsTable", data.data);

                }

                $('#currentAssetsTable tbody,#currentAssetsTable thead').on('click', 'input[type="checkbox"]', function () {
                    var data = table_data["currentAssetsTable"].row($(this).parents('tr')).data();
                    setTimeout(function () {
                        console.log(checkboxSelectedLength());
                        if (checkboxSelectedLength() > 0) {
                            $('#DecomAssets').fadeIn(500);
                        } else {
                            $('#DecomAssets').fadeOut(500);
                        }
                    }, 500);
            
                    checkId(data[0], this);

                    // if (res != " ") {
                    //     console.log("not empty");
                    //     $("#currentAssetsTable tbody input[type='checkbox']").prop("checked", false);
                    // }
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

                    var data = table_data["currentAssetsTable"].row($(this).parents('tr')).data();
                    console.log(data[0]);
                    viewAsset(data[0]);
                });
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

function checkId(asset_id, check_this) {
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/check_id",
        method: "post",
        data: '{"asset_id":"' + asset_id + '"}',
        dataType: "json",
        'async': false,
        success: function (data) {
            console.log(data.data[0]);
            var errors = [];

            console.log("data" + data.data[0].IS_PRIMARY + " / " + data.data[0].IS_SUB + " / " + data.data[0].IS_LINKED);

            results = "found";
            if (data.data[0].IS_PRIMARY != null) {
                errors.push("Asset is a primary and has sub assets");
            }
            if (data.data[0].IS_SUB != null) {
                errors.push("Asset is a sub and is linked to a primary");
            }
            if (data.data[0].IS_LINKED != null) {
                errors.push("Assets is linked to a sub location");
            }
            // $('#commAssets').fadeOut(500);
            // swal.fire({
            //     title: "Success",
            //     text: data.data,
            //     type: 'success',
            //     showCloseButton: true,
            //     closeButtonColor: '#3DB3D7',
            //     allowOutsideClick: true,
            // })
            // $('#loaderComm').hide();
            // if (data.rows > 0) {
            //     document.getElementById("assetTbody").innerHTML = data.data;
            //     cert_no.data = data.certificate_number;
            //     $("movItemCount").text(data.rows);
            // }

            if (errors.length > 0) {

                $(check_this).prop("checked", false);

                var listOfErros = "<div class='text-center' style='position: sticky;margin: 0 auto; width:260px;'><ol style='text-align:left !important; font-weight:bolder;'>";
                for (var i = 0; i < errors.length; i++)
                    listOfErros += "<li class='text-danger'>" + errors[i] + "</li>";


                listOfErros += "</ol></div>";
                sweetAlertMessage(listOfErros);

            }
            else {
                var found = false, index = 0;
                for (var i = 0; i < decom_asset.length; i++) {
                    if (decom_asset[i] === asset_id) {
                        found = true;
                        index = i;
                        break;
                    }
                }
                if (found) {
                    decom_asset.splice(index, 1);
                }
                else {
                    decom_asset.push(asset_id);
                }
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
};

function sweetAlertMessage(message) {
    swal.fire({
        title: "ASSET LINKED",
        html: message,
        type: 'error',
        showCloseButton: true,
        closeButtonColor: '#3DB3D7',
        allowOutsideClick: true,
    }).then((result) => {
        if (result.value) {
            // $('#currentAssetsTable tbody,#currentAssetsTable thead').on('click', 'input[type="checkbox"]').pro
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
}

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
        fnCreatedRow: function (nTd, nRow, aData, iDataIndex) {

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

        var rowsSelected = decom_asset;

        viewDecomAsset(rowsSelected);
        // Remove added elements
        $('input[name="id\[\]"]', form).remove();

        e.preventDefault();

    });


    return table;
}

function viewDecomAsset(assets) {
    // console.log($('#assetBody'));

    if (assets.length == 0) {
        swal.fire({
            title: "Error",
            text: "Nothing Selected",
            type: 'error',
            showCloseButton: true,
            closeButtonColor: '#3DB3D7',
            allowOutsideClick: true,
        })
        $('#loaderComm').hide();
        if (data.rows > 0) {
            document.getElementById("assetTbody").innerHTML = data.data;
            cert_no.data = data.certificate_number;
            $("movItemCount").text(data.rows);
        }
    }
    else {
        var currentItem = "";
        document.getElementById('overlay-decomAsset').style.display = "block";

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
        var cert_no = { data: "" };

        $.ajax({
            // url: "assets.json",
            url: "../../ams_apis/slimTest/index.php/get_Asset_status_decom",
            method: "post",
            data: '{"assert_primary_id" : "' + send_assets + '"}',
            dataType: "json",
            success: function (data) {
                console.log(data);
                $('#loaderDeComm').hide();
                if (data.rows > 0) {
                    document.getElementById("assetTbody").innerHTML = data.data;
                    cert_no.data = data.certificate_number;
                    $("#movItemCount").text(data.rows);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
        console.log(decom_asset);
        var conc_assets = "";
        for (var i = 0; i < decom_asset.length; i++) {
            if (i != decom_asset.length - 1) {
                conc_assets += decom_asset[i] + "^";
            } else {
                conc_assets += decom_asset[i];
            }
        }

        console.log(conc_assets);

        $("#confirmDecomm").off().on("click", function () {
            confirmDecomm(conc_assets, cert_no.data);
        });
    }
}

function confirmDecomm(assets_ids, certificate_no) {


    var comments = $("#comments option:selected").text();
    console.log('{"assets" : "' + assets_ids + '","cert" : "' + certificate_no + '","comments" : "' + comments + '","username":"' + localStorage.username + '","asset_class":"' + localStorage.filter + '"}');


    $.ajax({
        url: "../../ams_apis/slimTest/index.php/decomm_asset",
        method: "post",
        data: '{"username":"' + localStorage.username + '","asset_class":"' + localStorage.filter + '","assets":"' + assets_ids + '","cert":"' + certificate_no + '","comments":"' + comments + '"}',
        dataType: "json",
        success: function (data) {
            if (data.rows == 1) {
                closeAsset('overlay-decomAsset');
                search();
                $('#DecomAssets').fadeOut(500);
                swal.fire({
                    title: "Success",
                    text: data.data,
                    type: 'success',
                    showCloseButton: true,
                    closeButtonColor: '#3DB3D7',
                    allowOutsideClick: true,
                })

                if (data.rows > 0) {
                    // document.getElementById("assetTbody").innerHTML = data.data;
                    // cert_no.data = data.certificate_number;
                    // $("movItemCount").text(data.rows);
                }
            }
            else if (data.rows == 0) {
                closeAsset('overlay-decomAsset');
                $('#DecomAssets').fadeOut(500);
                swal.fire({
                    title: "Error",
                    text: data.data,
                    type: 'error',
                    showCloseButton: true,
                    closeButtonColor: '#3DB3D7',
                    allowOutsideClick: true,
                })
            }
        },
        error: function (err) {
            console.log(err);
            closeAsset('overlay-decomAsset');
            swal.fire({
                title: "Unexpected Error #45404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za)",
                type: 'error',
                showCloseButton: true,
                closeButtonColor: '#3DB3D7',
                allowOutsideClick: true,
            })
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
        case "y":
            results = "<p class='text-success'><strong>YES</strong></p>";
            break;
        case "n":
            results = "<p class='text-danger'><strong>NO</strong></p>";
            break;
    }

    return results;
}//close updateLetterToIcon function

// Building
$('#menu_removal_building').on('click', '.dropdown-item', function () {
    $('#building_removal_filter').text($(this)[0].value);
    localStorage.building = $(this)[0].value;
    populate_dropdown();
    $("#building_removal_filter").dropdown('toggle');
    $('#search_removal_building').val($(this)[0].value);
});

// level
$('#menu_removal_level').on('click', '.dropdown-item', function () {
    $('#level_removal_filter').text($(this)[0].value);
    localStorage.level = $(this)[0].value;
    populate_dropdown();
    $("#level_removal_filter").dropdown('toggle');
    $('#search_removal_level').val($(this)[0].value);
});

// area
$('#meun_removal_area').on('click', '.dropdown-item', function () {
    $('#area_removal_filter').text($(this)[0].value);
    localStorage.area = $(this)[0].value;
    populate_dropdown();
    $("#area_removal_filter").dropdown('toggle');
    $('#search_removal_area').val($(this)[0].value);
});

// room
$('#menu_removal_room').on('click', '.dropdown-item', function () {
    $('#room_removal_filter').text($(this)[0].value);
    localStorage.room_no = $(this)[0].value;
    populate_dropdown();
    $("#room_removal_filter").dropdown('toggle');
    $('#search_removal_room').val($(this)[0].value);
});
// sub location
$('#menu_removal_sublocaction').on('click', '.dropdown-item', function () {
    $('#subloacation_removal_filter').text($(this)[0].value);
    localStorage.sub_location = $(this)[0].value;
    populate_dropdown();
    $("#subloacation_removal_filter").dropdown('toggle');
    $('#search_removal_sublocaction').val($(this)[0].value);
});

// aasset Id
$('#menu_removal_assetNo').on('click', '.dropdown-item', function () {
    $('#assetNo_removal_filter').text($(this)[0].value);
    localStorage.asset_primary_id = $(this)[0].value;
    populate_dropdown();
    $("#assetNo_removal_filter").dropdown('toggle');
    $('#search_removal_assetNo').val($(this)[0].value);
});

function populate_dropdown() {

    //asset No
    getItems('../../ams_apis/slimTest/index.php/asset_id_removal', 'search_removal_assetNo', 'scroll_removal_assetNo', 'menu_removal_assetNo', 'empty_removal_assetNo');
    //sub location
    getItems('../../ams_apis/slimTest/index.php/asset_sub_location_removal', 'search_removal_sublocaction', 'scroll_removal_sublocaction', 'menu_removal_sublocaction', 'empty_removal_sublocaction');
    // get room
    getItems('../../ams_apis/slimTest/index.php/asset_room_no_removal', 'search_removal_room', 'scroll_removal_room', 'menu_removal_room', 'empty_removal_room');
    // get area
    getItems('../../ams_apis/slimTest/index.php/asset_area_removal', 'search_removal_area', 'scroll_removal_area', 'meun_removal_area', 'empty_removal_area');
    // get level
    getItems('../../ams_apis/slimTest/index.php/asset_level_removal', 'search_removal_level', 'scroll_removal_level', 'menu_removal_level', 'empty_removal_level');
    // get building
    getItems('../../ams_apis/slimTest/index.php/building_removal', 'search_removal_building', 'scroll_removal_building', 'menu_removal_building', 'empty_removal_building');

}

populate_dropdown();

var allArr = {
    search_removal_room: [],
    search_removal_area: [],
    search_removal_level: [],
    search_removal_building: [],
    search_removal_sublocation: [],
    search_removal_assetNo: []
};



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



// console.log("allArr");
// console.log(allArr);
// console.log("allArr");

function getItems(url, id, scrollArea, menuid) {

    console.log('{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","sub_location":"' + localStorage.sub_location + '","asset_no":"' + localStorage.asset_primary_id + '","asset_class":"' + localStorage.filter + '"}');

    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        data: '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","sub_location":"' + localStorage.sub_location + '","asset_no":"' + localStorage.asset_primary_id + '","asset_class":"' + localStorage.filter + '"}',
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
    search_removal_room: [],
    search_removal_area: [],
    search_removal_level: [],
    search_removal_building: [],
    search_removal_sublocation: [],
    search_removal_assetNo: []
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

    document.getElementById(searchValue).onkeypress = function (e) {

        console.log(e.keyCode);
        if (e.keyCode == 13) {
            e.preventDefault();
            search();
        }
    }

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
        $('#building_removal_filter').text($(this)[0].value);
        // localStorage.menuId
        localStorage.building = '';
        localStorage.area = '';
        localStorage.level = '';
        localStorage.room_no = '';
        localStorage.sub_location = '';
        localStorage.asset_primary_id = '';
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

        if (input == "#search_removal_building") {
            document.getElementById('menu_removal_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_removal_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_removal_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_removal_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_removal_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_removal_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            populate_dropdown();

            $(input).val("");
            $(btnDafualtId).text(text);

            $('#search_removal_building').val("");
            $('#building_removal_filter').text("BUILDING");
            $('#search_removal_level').val("");
            $('#level_removal_filter').text("LEVEL");
            $('#search_removal_area').val("");
            $('#area_removal_filter').text("AREA");
            $('#search_removal_room').val("");
            $('#room_removal_filter').text("ROOM");
            $('#search_removal_sublocation').val("");
            $('#sublocation_removal_filter').text("SUB LOCATION");
            $('#search_removal_assetNo').val("");
            $('#assetNo_removal_filter').text("ASSET NO");


        } else if (input == "#search_removal_level") {

            document.getElementById('menu_removal_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_removal_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_removal_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_removal_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_removal_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';
            populate_dropdown();

            $(input).val("");
            $(btnDafualtId).text(text);

            $('#search_removal_level').val("");
            $('#level_removal_filter').text("LEVEL");
            $('#search_removal_area').val("");
            $('#area_removal_filter').text("AREA");
            $('#search_removal_room').val("");
            $('#room_removal_filter').text("ROOM");
            $('#search_removal_sublocation').val("");
            $('#sublocation_removal_filter').text("SUB LOCATION");
            $('#search_removal_assetNo').val("");
            $('#assetNo_removal_filter').text("ASSET NO");

        } else if (input == "#search_removal_area") {

            document.getElementById('meun_removal_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_removal_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_removal_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_removal_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            populate_dropdown();

            $('#search_removal_area').val("");
            $('#area_removal_filter').text("AREA");
            $('#search_removal_room').val("");
            $('#room_removal_filter').text("ROOM");
            $('#search_removal_sublocation').val("");
            $('#sublocation_removal_filter').text("SUB LOCATION");
            $('#search_removal_assetNo').val("");
            $('#assetNo_removal_filter').text("ASSET NO");

        } else if (input == "#search_removal_room") {

            document.getElementById('menu_removal_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_removal_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_removal_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            populate_dropdown();

            $('#search_removal_room').val("");
            $('#room_removal_filter').text("ROOM");
            $('#search_removal_sublocation').val("");
            $('#sublocation_removal_filter').text("SUB LOCATION");
            $('#search_removal_assetNo').val("");
            $('#assetNo_removal_filter').text("ASSET NO");

        } else if (input == "#search_removal_sublocaction") {

            document.getElementById('menu_removal_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_removal_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';

            populate_dropdown();

            $('#search_removal_sublocation').val("");
            $('#sublocation_removal_filter').text("SUB LOCATION");
            $('#search_removal_assetNo').val("");
            $('#assetNo_removal_filter').text("ASSET NO");


        } else if (input == "#search_removal_assetNo") {

            document.getElementById('menu_removal_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.asset_primary_id = '';

            populate_dropdown();

            $('#search_removal_assetNo').val("");
            $('#assetNo_removal_filter').text("ASSET NO");

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

        document.getElementById('menu_removal_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
        document.getElementById('menu_removal_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
        document.getElementById('meun_removal_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
        document.getElementById('menu_removal_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
        document.getElementById('menu_removal_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
        document.getElementById('menu_removal_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

        if (filter == "IT EQUIPMENT") {
            console.log("show");
            $('.filter_sub').show();
        } else {
            console.log("hide");
            $('.filter_sub').hide();
        }

        clearLocalStorageFilters();
        populate_dropdown();

        //clear btn text
        resetBtn('#building_removal_filter', "BUILDING");
        resetBtn('#level_removal_filter', "LEVEL");
        resetBtn('#area_removal_filter', "AREA");
        resetBtn('#room_removal_filter', "ROOM");
        resetBtn('#subloacation_removal_filter', "SUB LOCATION");
        resetBtn('#assetNo_removal_filter', "ASSET NO");

    });

} else {
    $('#class-options').append(new Option(localStorage.filter, "user_class"));
    $('#class-options').css({ "-moz-appearance": "none" });
    $('#class-options').prop('disabled', true);
}

function resetBtn(resetId, resetTxt) {
    $(resetId).text(resetTxt);
}

function resetInput(resetId, resetTxt) {
    $(resetId).val(resetTxt);
}

function clearLocalStorageFilters() {
    localStorage.building = '';
    localStorage.level = '';
    localStorage.area = '';
    localStorage.room_no = '';
    localStorage.sub_location = '';
    localStorage.asset_primary_id = '';

    $('#search_removal_building').val("");
    $('#search_removal_level').val("");
    $('#search_removal_area').val("");
    $('#search_removal_room').val("");
    $('#search_removal_sublocation').val("");
    $('#search_removal_assetNo').val("");

}

function cleaAllFilters() {

    clearLocalStorageFilters();

    populate_dropdown();

    $('#building_removal_filter').text("BUILDING");
    $('#level_removal_filter').text("LEVEL");
    $('#area_removal_filter').text("AREA");
    $('#room_removal_filter').text("ROOM");
    $('#sublocation_removal_filter').text("SUB LOCATION");
    $('#assetNo_removal_filter').text("ASSET NO");

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

function viewCommAssets(assets) {
    var currentItem = "";
    document.getElementById('overlay-decomAsset').style.display = "block";
    // console.log($('#assetBody'));
    document.getElementById('movItemCount').innerHTML = assets.length;


    console.log(assets);

    var assets_arr = assets;
    var send_assets = "";
    for (var i = 0; i < decom_asset.length; i++) {
        if (i == decom_asset.length - 1) {
            send_assets += "\'" + decom_asset[i] + "\'";
        } else {
            send_assets += "\'" + decom_asset[i] + "\',";
        }

    }

    console.log(send_assets);
    var cert_no = { data: "" };

    $.ajax({
        // url: "assets.json",
        url: "../../ams_apis/slimTest/index.php/generate_Cert_no",
        method: "post",
        data: '{"assert_primary_id" : "' + send_assets + '"}',
        dataType: "json",
        success: function (data) {
            console.log(data);
            $('#loaderComm').hide();
            if (data.rows > 0) {
                document.getElementById("assetTbody").innerHTML = data.data;
                cert_no.data = data.certificate_number;
                $("#movItemCount").text(data.rows);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });

    var conc_assets = "";
    for (var i = 0; i < assets_arr.length; i++) {
        if (i != assets_arr.length - 1) {
            conc_assets += assets_arr[i] + "^";
        } else {
            conc_assets += assets_arr[i];
        }

    }

    // $("#confirmComm").off().on("click", function () {
    //     confirmComm(conc_assets, cert_no.data);
    // });
}