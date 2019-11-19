clearLocalStorageFilters();

$('#searchView').fadeIn(500);

//check for filter in local storage
if (localStorage.backupFilter == undefined || localStorage.backupFilter == "undefined") {
    localStorage.backupFilter = localStorage.filter;
} else {
    localStorage.filter = localStorage.backupFilter;
}

window.onload = function () {
    if (localStorage.building !== '' || localStorage.level !== '' || localStorage.area !== '' || localStorage.room_no !== '') {
        localStorage.building = '';
        localStorage.level = ''
        localStorage.area = ''
        localStorage.room_no = ''
        localStorage.sub_location = ''
        localStorage.asset_no = ''
        populate_dropdown();
    }
}

populate_dropdown();

function addAsset() {

    var json_data = {
        asset_class: "",
        room: "",
        classification: "",
        purchase_date: "",
        waranty_date: "",
        service_date: "",
        service_due_date: "",
        serviced_by: "",
        assets: "",
        model: "",
        asset_type: "",
        cert: ""
    };

    var key = [
        "asset_class",
        "room",
        "classification",
        "purchase_date",
        "waranty_date",
        "service_date",
        "service_due_date",
        "serviced_by",
        "assets",
        "model",
        "asset_type",
        "cert"
    ]

    var values = (getValues());
    $('#loader-overlay').show();
    setTimeout(function(){
        $("#loader-overlay").hide();
        for (i = 0; i < key.length; i++) {
            json_data[key[i]] = values[i];
        }
        console.log(json_data);
        if(json_data.cert != ""){
            closeAsset("overlay-newAssetView");
            $("#overlay-comm-details").show();
        }else{
            
            sendValues(json_data);
        }
    },4000);

    

    $('#confirmCommAdd').off().on('click',function(){
        sendValues(json_data);
    });


}

function sendValues(json_data){
    var boq =  document.getElementById("boq").value,
    invoce_number =  document.getElementById("invoce_number").value,
    asset_reference = document.getElementById("asset_reference").value;

    var data = '{"v_asset_class": "' + json_data.asset_class + '", "v_assets":"' + json_data.assets + '", "v_asset_model":"' + json_data.model + '", "v_asset_type":"' + json_data.asset_type + '", "v_asset_classification" :"' + json_data.classification + '", "v_asset_room_no":"' + json_data.room + '", "v_asset_purchase_dt" :"' + json_data.purchase_date + '", "v_asset_warranty_dt" :"' + json_data.waranty_date + '", "v_asset_vendor_id" :"' + "" + '", "v_asset_vendor_name" :"' + "" + '", "v_asset_useful_life":"' + "" + '", "v_asset_service_dt":"' + json_data.service_date + '", "v_asset_service_due_dt":"' + json_data.service_due_date + '", "v_asset_service_by":"' + json_data.serviced_by + '", "v_asset_cert_ind":"' + "" + '", "v_asset_cert_no":"' + json_data.cert + '", "v_asset_added_by":"' + localStorage.username + '", "v_boq":"' + boq + '", "v_invoce_number":"' + invoce_number + '", "v_asset_reference":"' + asset_reference + '"}'
    $('#loader-overlay').show();
    confirmAssetCreate(data);
}

function confirmAssetCreate(data){
    $.ajax({
            url: "../../ams_apis/slimTest/index.php/add_assets",
            method: "POST",
            dataType: "JSON",
            data: data,
            success: function (data) {
                document.getElementById("add_asset_form").reset();
                document.getElementById('overlay-newAssetView').style.display = "none";
                document.getElementById('assetsAdd').innerHTML = data.tdata;
                setTimeout(function () {
                    $('#overlay-assets-added').show();
                    $('#loader-overlay').hide();

                }), 2000;

            },
            error: function (err) {
                swal.fire({
                    title: "Unexpected Error #42404",
                    text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'add_assets'",
                    type: "error",
                    showCloseButton: true,
                    confirmButtonColor: "#C12E2A",
                    allowOutsideClick: true,
                });
            }
        });
}

function getAssetsType() {

    $.ajax({
        url: "../../ams_apis/slimTest/index.php/getAssetsType",
        method: "POST",
        dataType: "JSON",
        success: function (data) {
            var types = '<option value="">Select Asset Type</option>';
            for (var i = 0; i < 10; i++) {
                types += '<option value="' + data.data[i].ASSET_TYPEID + '">' + data.data[i].ASSET_TYPE_DESC + '</option>';
            }
            document.getElementById('asset_type').innerHTML = types;
        },
        error: function (err) {
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'getAssetsType'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,
            });
        }
    });
}

function viewAsset(assetId) {
    var currentItem = "";
    document.getElementById('overlay-asset').style.display = "block";
    // $('#assetBody')['0'].innerHTML = assetId;
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/singleAsset",
        method: "POST",
        dataType: "JSON",
        data: '{"primary_asset_id" :"' + assetId + '"}',
        success: function (data) {
            document.getElementById('viewAssets').innerHTML = data[0].table;
            document.getElementById('subItemCount').innerText = data[0].items;
        },
        error: function (err) {
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'singleAsset'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,
            });
        }
    });
}

function getValues() {
    var inputValues = [];

    //basic (2 inputs && 1 select)
    var selects = $("#basic select").find("option:selected").text();
    var input_classification = $("#classification_wizard").val();
    var input_room = $("#room_new_filter").val();

    //date (2 dates)
    var input_date = $("#date input[type='date']");
    var dates = ["purchase_date", "waranty_date"];

    //service (2 dates & 1 input)
    var input_service = $("#service input[type='date']");
    var input_service_by = $("#service input[type='text']");
    var service = ["service_date", "service_due_date", "serviced_by"];

    //serial (2+ inputs)
    var input_serial = $("#asset_group input[type='text']");

    document.getElementById('assets_add_new').innerHTML = Math.floor((input_serial.length) / 4);
    var serial = ["asset_id", "asset_desc"];

    //model (1 inputs)
    var input_model = $("#model input");
    var input_asset_type = $("#asset_type").children("option:selected").val();
    var serial = ["model", "asset_type"];

    //commissioning
    var input_radio_checked = $("#commissioning input[type='radio']:checked");


    inputValues.push(selects);
    inputValues.push(input_room);
    inputValues.push(input_classification);
    // extractValues_inElements(input_basic, inputValues, "");
    extractValues_inElements(input_date, inputValues, "date");
    extractValues_inElements(input_service, inputValues, "date");
    inputValues.push(input_service_by[0].value);
    extractValues_inElements(input_serial, inputValues, "serial");
    inputValues.push(input_model[0].value);
    inputValues.push(input_asset_type);

    if (input_radio_checked[0].value == "YES") {
        //get certNumber using apis

        $.ajax({
            url: "../../ams_apis/slimTest/index.php/generate_certificate_number",
            method: "post",
            dataType: "json",
            success: function (data) {
                inputValues.push(data.certificate_number);
            },
            error: function (err) {
                inputValues.push("");
                swal.fire({
                    title: "Unexpected Error #42404",
                    text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'generate_certificate_number'",
                    type: "error",
                    showCloseButton: true,
                    confirmButtonColor: "#C12E2A",
                    allowOutsideClick: true,
                });

            }
        });
    } else {
        inputValues.push("");
    }
    return inputValues;
}

function extractValues_inElements(a, arr, key) {

    if (key == "serial") {
        var stringValue = "";
        for (i = 0; i < a.length; i++) {
            if (i == a.length - 3) {

                stringValue += a[i].value + "|" + a[++i].value + "|" + a[++i].value + "|" + a[++i].value
            } else {
                stringValue += a[i].value + "|" + a[++i].value + "|" + a[++i].value + "|" + a[++i].value + "^"
            }

        }
        arr.push(stringValue);
    }
    else if (key == "date") {
        for (i = 0; i < a.length; i++) {
            arr.push(getDatee(a[i].value));

        }

    } else {
        for (i = 0; i < a.length; i++) {
            arr.push(a[i].value);
        }
    }
}

function populate_dropdown() {
    // get asset_no
    getItems('../../ams_apis/slimTest/index.php/asset_id_addition', 'search_addition_assetNo', 'scroll_addition_assetNo', 'menu_addition_assetNo', 'empty_addition_assetNo');
    // get sub_location
    getItems('../../ams_apis/slimTest/index.php/asset_sub_location_addition', 'search_addition_sublocaction', 'scroll_addition_sublocaction', 'menu_addition_sublocaction', 'empty_addition_sublocaction');
    // get room
    getItems('../../ams_apis/slimTest/index.php/asset_room_no_addition', 'search_addition_room', 'scroll_addition_room', 'menu_addition_room', 'empty_addition_room');
    // get area
    getItems('../../ams_apis/slimTest/index.php/asset_area_addition', 'search_addition_area', 'scroll_addition_area', 'meun_addition_area', 'empty_addition_area');
    // get level
    getItems('../../ams_apis/slimTest/index.php/asset_level_new_addition', 'search_addition_level', 'scroll_addition_level', 'menu_addition_level', 'empty_addition_level');
    // get building
    getItems('../../ams_apis/slimTest/index.php/building_addition', 'search_addition_building', 'scroll_addition_building', 'menu_addition_building', 'empty_addition_building');

}

function getRoom() {
    getItems('../../ams_apis/slimTest/index.php/asset_room_no_addition', 'search_new_room', 'scroll_new_room', 'menu_new_room', 'empty_new_room');
}

var allArr = {
    search_addition_asset_no: [],
    search_addition_sub_location: [],
    search_addition_room: [],
    search_addition_area: [],
    search_addition_level: [],
    search_addition_building: []
};

function getItems(url, id, scrollArea, menuid) {


    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        data: '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","sub_location":"' + localStorage.sub_location + '","asset_no":"' + localStorage.asset_no + '","asset_class":"' + localStorage.filter + '"}',
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
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : #'" + id + "'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,

            });
        }
    });
}

var clusterize = {
    search_view_room: [],
    search_view_area: [],
    search_view_level: [],
    search_view_building: []
};

var tableArr = {
    currentAssetsTable: []
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

function add_new_asset() {
    getAssetsType();
    localStorage.filter = $("#asset_class option:selected").text();
    getRoom();
    document.getElementById('overlay-newAssetView').style.display = "block";
}

function closeAsset(id) {
    document.getElementById(id).style.display = "none"
}

function clearLocalStorageFilters() {
    localStorage.building = '';
    localStorage.level = '';
    localStorage.area = '';
    localStorage.room_no = '';
    localStorage.sub_location = '';
    localStorage.asset_no = '';

    $('#search_addition_building').val("");
    $('#search_addition_level').val("");
    $('#search_addition_area').val("");
    $('#search_addition_room').val("");
    $('#search_addition_sublocaction').val("");
    $('#search_addition_assetNo').val("");
}

function search() {

    var building = document.getElementById('search_addition_building').value,
        level = document.getElementById('search_addition_level').value,
        area = document.getElementById('search_addition_area').value,
        room_no = document.getElementById('search_addition_room').value;
    description = document.getElementById('addition_description').value;
    sub_location = document.getElementById('search_addition_sublocaction').value;
    asset_no = document.getElementById('search_addition_assetNo').value;

    var results = (building + " - " + level + " - " + area + " - " + room_no + " - " + description + " - " + sub_location + " - " + asset_no);
    var current = "";
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

        console.log(building + " - " + level + " - " + area + " - " + room_no + " - " + description + " - " + sub_location + " - " + asset_no);
        document.getElementById('current').innerHTML = "";
        $.ajax({
            url: "../../ams_apis/slimTest/index.php/getAll_Assets_withNo_Cert_no",
            type: "POST",
            dataType: 'json',
            data: '{"building" :"' + building + '","level" : "' + level + '","area" : "' + area + '","room_no" : "' + room_no + '","description" : "' + description + '","asset_sub_location":"' + localStorage.sub_location + '","asset_no":"' + localStorage.asset_no + '","asset_class":"' + localStorage.filter + '"}',
            success: function (data) {
                $('#loader').fadeOut(500);
                var table = null;

                if (data.rows > 0) {

                    var str = '{"data" : [';
                    for (var k = 0; k < data.rows; k++) {
                        if ((data.rows - 1) == k) {
                            str += '["' + data.data[k].ASSET_ID + '","';
                            str += data.data[k].ASSET_ID + '","';


                            str += data.data[k].ASSET_ROOM_NO + '","';
                            str += data.data[k].ASSET_SUB_LOCATION + '","';
                            str += data.data[k].ASSET_AREA + '","';
                            str += replaceAll("\"", "`", data.data[k].ASSET_DESCRIPTION) + '","';
                            str += updateLetterToIcon(data.data[k].ASSET_IS_SUB) + '"]';
                        } else {

                            str += '["' + data.data[k].ASSET_ID + '","';
                            str += data.data[k].ASSET_ID + '","';

                            str += data.data[k].ASSET_ROOM_NO + '","';
                            str += data.data[k].ASSET_SUB_LOCATION + '","';
                            str += data.data[k].ASSET_AREA + '","';
                            str += replaceAll("\"", "`", data.data[k].ASSET_DESCRIPTION) + '","';
                            str += updateLetterToIcon(data.data[k].ASSET_IS_SUB) + '"],';
                        }
                    }

                    str += ']}'
                    str = replaceAll("\n", "", str);
                    str = (JSON.parse(str));
                    console.log(str);
                    table = createTable("#currentAssetsTable", str.data);
                    tableArr['currentAssetsTable'] = table;
                }
                else {
                    table = createTable("#currentAssetsTable", data.data);
                }

                $('#currentAssetsTable tbody,#currentAssetsTable thead').on('click', 'input[type="checkbox"]', function () {
                    var data = table.row($(this).parents('tr')).data();
                    setTimeout(function () {
                        if (checkboxSelectedLength() > 0) {
                            $('#commAssets').fadeIn(500);
                        } else {
                            $('#commAssets').fadeOut(500);
                        }
                    }, 500);
                });

                $('#currentAssetsTable tbody').on('click', 'button', function () {
                    var data = tableArr['currentAssetsTable'].row($(this).parents('tr')).data();
                    viewAsset(data[0]);
                });

            },
            error: function (err) {
                $('#searchView').fadeIn(500);
                $('#loader').hide();
                swal.fire({
                    title: "Unexpected Error #42404",
                    text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'getAssetsType'",
                    type: "error",
                    showCloseButton: true,
                    confirmButtonColor: "#C12E2A",
                    allowOutsideClick: true,
                });
            }
        });
    }
}

function checkboxSelectedLength() {
    var lengthh = $(":checkbox:checked").length;
    return lengthh;
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

        viewCommAssets(rowsSelected);
        // Remove added elements
        $('input[name="id\[\]"]', form).remove();

        e.preventDefault();

    });


    return table;
}


function viewCommAssets(assets) {
    var currentItem = "";
    document.getElementById('overlay-comm').style.display = "block";
    document.getElementById('movItemCount').innerHTML = assets.length;

    var assets_arr = assets;
    var send_assets = "";
    for (var i = 0; i < assets_arr.length; i++) {
        if (i == assets_arr.length - 1) {
            send_assets += "\'" + assets_arr[i] + "\'";
        } else {
            send_assets += "\'" + assets_arr[i] + "\',";
        }

    }

    var cert_no = { data: "" };

    $.ajax({
        // url: "assets.json",
        url: "../../ams_apis/slimTest/index.php/generate_Cert_no",
        method: "post",
        data: '{"assert_primary_id" : "' + send_assets + '"}',
        dataType: "json",
        success: function (data) {
            $('#loaderComm').hide();
            if (data.rows > 0) {
                document.getElementById("assetTbody").innerHTML = data.data;
                cert_no.data = data.certificate_number;
                $("#movItemCount").text(data.rows);
            }
        },
        error: function (err) {
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'generate_Cert_no'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,
            });
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

    $("#confirmComm").off().on("click", function () {
        
        $.ajax({
            // url: "assets.json",
            url: "../../ams_apis/slimTest/index.php/generate_Cert_no",
            method: "post",
            data: '{"assert_primary_id" : "' + send_assets + '"}',
            dataType: "json",
            success: function (data) {
                $('#loaderComm').hide();
                if (data.rows > 0) {
                    confirmComm(conc_assets, data.certificate_number);
                }else{
                    swal.fire({
                        title: "Error Generating Certificate",
                        text: "Please try again later or contact admin (amsdev@ialch.co.za)",
                        type: "error",
                        showCloseButton: true,
                        confirmButtonColor: "#C12E2A",
                        allowOutsideClick: true,
                    });
                }
            },
            error: function (err) {
                swal.fire({
                    title: "Unexpected Error #42404",
                    text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'generate_Cert_no'",
                    type: "error",
                    showCloseButton: true,
                    confirmButtonColor: "#C12E2A",
                    allowOutsideClick: true,
                });
            }
        });
       
    });
}

function confirmComm(assets_ids, certificate_no) {

    var boq =  document.getElementById("boq_comm").value,
        invoce_number =  document.getElementById("invoce_number_comm").value,
        asset_reference = document.getElementById("asset_reference_comm").value;

    $.ajax({
        url: "../../ams_apis/slimTest/index.php/comm_asset",
        method: "post",
        data: '{"username":"' + localStorage.username + '","asset_class":"' + localStorage.filter + '","assets":"' + assets_ids + '","cert":"' + certificate_no + '","boq":"' + boq + '","invoce_number":"' + invoce_number + '","asset_reference":"' + asset_reference + '"}',
        dataType: "json",
        success: function (data) {
            closeAsset('overlay-comm');
            search();
            $('#commAssets').fadeOut(500);
            swal.fire({
                title: "Certificate Number : "+certificate_no,
                text: data.data,
                type: 'success',
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
        },
        error: function (err) {
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'comm_asset'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,
            });
        }
    });

}

function clearData(input, btnDafualtId, text) {
    var value = $(input).val();

    if (value.length > 0) {

        if (input == "#search_addition_building") {
            document.getElementById('menu_addition_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_addition_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_addition_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_addition_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_addition_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_addition_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';


            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_no = '';

            populate_dropdown();

            $(input).val("");
            $(btnDafualtId).text(text);

            $('#search_addition_building').val("");
            $('#building_addition_filter').text("BUILDING");
            $('#search_addition_level').val("");
            $('#level_addition_filter').text("LEVEL");
            $('#search_addition_area').val("");
            $('#area_addition_filter').text("AREA");
            $('#search_addition_room').val("");
            $('#room_addition_filter').text("ROOM");
            $('#search_addition_sublocaction').val("");
            $('#sublocaction_addition_filter').text("SUB LOCATION");
            $('#search_addition_assetNo').val("");
            $('#assetNo_addition_filter').text("ASSET NUMBER");


        } else if (input == "#search_addition_level") {

            document.getElementById('menu_addition_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_addition_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_addition_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_addition_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_addition_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_no = '';
            populate_dropdown();

            $(input).val("");
            $(btnDafualtId).text(text);

            $('#search_addition_level').val("");
            $('#level_addition_filter').text("LEVEL");
            $('#search_addition_area').val("");
            $('#area_addition_filter').text("AREA");
            $('#search_addition_room').val("");
            $('#room_addition_filter').text("ROOM");
            $('#search_addition_sublocaction').val("");
            $('#sublocaction_addition_filter').text("SUB LOCATION");
            $('#search_addition_assetNo').val("");
            $('#assetNo_addition_filter').text("ASSET NUMBER");

        } else if (input == "#search_addition_area") {

            document.getElementById('meun_addition_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_addition_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_addition_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_addition_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_no = '';

            populate_dropdown();

            $('#search_addition_area').val("");
            $('#area_addition_filter').text("AREA");
            $('#search_addition_room').val("");
            $('#room_addition_filter').text("ROOM");
            $('#search_addition_sublocaction').val("");
            $('#sublocaction_addition_filter').text("SUB LOCATION");
            $('#search_addition_assetNo').val("");
            $('#assetNo_addition_filter').text("ASSET NUMBER");

        }
        else if (input == "#search_addition_room") {

            document.getElementById('menu_addition_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_addition_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_addition_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_no = '';

            populate_dropdown();

            $('#search_addition_room').val("");
            $('#room_addition_filter').text("ROOM");
            $('#search_addition_sublocaction').val("");
            $('#sublocaction_addition_filter').text("SUB LOCATION");
            $('#search_addition_assetNo').val("");
            $('#assetNo_addition_filter').text("ASSET NUMBER");

        }
        else if (input == "#search_addition_sublocaction") {

            document.getElementById('menu_addition_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_addition_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.sub_location = '';
            localStorage.asset_no = '';

            populate_dropdown();

            $('#search_addition_sublocaction').val("");
            $('#sublocaction_addition_filter').text("SUB LOCATION");
            $('#search_addition_assetNo').val("");
            $('#assetNo_addition_filter').text("ASSET NUMBER");

        }
        else if (input == "#search_addition_assetNo") {

            document.getElementById('menu_addition_assetNo').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.asset_no = '';

            populate_dropdown();

            $('#search_addition_assetNo').val("");
            $('#assetNo_addition_filter').text("ASSET NUMBER");

        }
        else if (input == "#search_new_room") {
            document.getElementById('menu_new_room').innerHTML = '<div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            localStorage.room_no = "";
            getRoom();
            $('#search_new_room').val("");
            $('#room_new_filter').val("");

        }

    }
}

// Building
$('#menu_addition_building').on('click', '.dropdown-item', function () {
    $('#building_addition_filter').text($(this)[0].value);
    localStorage.building = $(this)[0].value;
    populate_dropdown();
    $("#building_addition_filter").dropdown('toggle');
    $('#search_addition_building').val($(this)[0].value);
});

// level
$('#menu_addition_level').on('click', '.dropdown-item', function () {
    $('#level_addition_filter').text($(this)[0].value);
    localStorage.level = $(this)[0].value;
    populate_dropdown();
    $("#level_addition_filter").dropdown('toggle');
    $('#search_addition_level').val($(this)[0].value);
});

// area
$('#meun_addition_area').on('click', '.dropdown-item', function () {
    $('#area_addition_filter').text($(this)[0].value);
    localStorage.area = $(this)[0].value;
    populate_dropdown();
    $("#area_addition_filter").dropdown('toggle');
    $('#search_addition_area').val($(this)[0].value);
});

// room
$('#menu_addition_room').on('click', '.dropdown-item', function () {
    $('#room_addition_filter').text($(this)[0].value);
    localStorage.room_no = $(this)[0].value;
    populate_dropdown();
    $("#room_addition_filter").dropdown('toggle');
    $('#search_addition_room').val($(this)[0].value);
});

// sub_location
$('#menu_addition_sublocaction').on('click', '.dropdown-item', function () {
    $('#sublocaction_addition_filter').text($(this)[0].value);
    localStorage.sub_location = $(this)[0].value;
    populate_dropdown();
    $("#sublocaction_addition_filter").dropdown('toggle');
    $('#search_addition_sublocaction').val($(this)[0].value);
});

// asset_no
$('#menu_addition_assetNo').on('click', '.dropdown-item', function () {
    $('#assetNo_addition_filter').text($(this)[0].value);
    localStorage.asset_no = $(this)[0].value;
    populate_dropdown();
    $("#assetNo_addition_filter").dropdown('toggle');
    $('#search_addition_assetNo').val($(this)[0].value);
});


// newly added room
$('#menu_new_room').on('click', '.dropdown-item', function () {
    $('#room_new_filter').val($(this)[0].value);
    localStorage.room_no = $(this)[0].value;
    $("#room_new_filter").removeClass("btn-outline-danger").addClass("btn-outline-info");
    $("#room_error").removeClass("has-error");
    getRoom();
    $("#room_new_filter").dropdown('toggle');
    $('#search_new_room').val($(this)[0].value);
});





if (localStorage.filter == "ALL EQUIPMENT") {
    localStorage.filter = "FACILITIES MANAGEMENT";
    $('#class-options').append(new Option("FACILITIES MANAGEMENT", "fac_equip"));

    if (localStorage.filter == "IT EQUIPMENT" || localStorage.role == "ADMIN")
        $('#class-options').append(new Option("IT EQUIPMENT", "it_equip"));

    $('#class-options').append(new Option("MEDICAL EQUIPMENT", "med_equip"));
    $('#class-options').prop('disabled', false);

    $('#class-options').on('change', function () {
        var filter = $("#class-options option:selected").text();
        localStorage.filter = filter;
        toogleSub(filter);

        clearLocalStorageFilters();
        populate_dropdown();
        //clear btn text
        checkFilter("search_addition_building");

    });

} else {
    toogleSub(localStorage.filter);
    $('#class-options').append(new Option(localStorage.filter, "user_class"));
    $('#class-options').css({ "-moz-appearance": "none" });
    $('#class-options').prop('disabled', 'disabled');
}

var defaultRooms = {
    "FACILITIES MANAGEMENT": "1B27-1",
    "MEDICAL EQUIPMENT": "1G11-1",
    "IT EQUIPMENT": "2H27-1"
};

$('#asset_class').on('change', function () {
    var selectedClass = $("#asset_class option:selected").text();
    var selectedClass = $("#asset_class option:selected").val();

    var selectDefaultRoom = "";
    if (selectedClass == "1") {
        selectDefaultRoom = defaultRooms["FACILITIES MANAGEMENT"];
    } else if (selectedClass == "2") {
        selectDefaultRoom = defaultRooms["IT EQUIPMENT"];
    } else {
        selectDefaultRoom = defaultRooms["MEDICAL EQUIPMENT"];
    }
    localStorage.filter = selectedClass

    $('#search_new_room').val(selectDefaultRoom);
    $('#room_new_filter').val(selectDefaultRoom);
});


$('#search_new_room').val(defaultRooms["FACILITIES MANAGEMENT"]);
$('#room_new_filter').val(defaultRooms["FACILITIES MANAGEMENT"]);


function clearLocalStorageFilters() {
    localStorage.building = '';
    localStorage.level = '';
    localStorage.area = '';
    localStorage.room_no = '';
    localStorage.sub_location = '';
    localStorage.asset_no = '';

    $('#search_addition_building').val("");
    $('#search_addition_level').val("");
    $('#search_addition_area').val("");
    $('#search_addition_room').val("");
    $('#search_addition_sublocaction').val("");
    $('#search_addition_assetNo').val("");

}

function cleaAllFilters() {

    clearLocalStorageFilters();

    populate_dropdown();

    //clear btn text
    resetBtn('#building_addition_filter', "BUILDING");
    resetBtn('#level_addition_filter', "LEVEL");
    resetBtn('#area_addition_filter', "AREA");
    resetBtn('#room_addition_filter', "ROOM");
    resetBtn('#sublocaction_addition_filter', "SUB LOCATION");
    resetBtn('#assetNo_addition_filter', "ASSET NUMBER");

    //description
    $('#view_description').val("");
}

var onSearch = function (btn_id, searchValue, emptyId) {

    var getId = searchValue;

    var found = false;

    var rows = allArr[searchValue];

    document.getElementById(searchValue).onkeypress = function (e) {

        console.log(e.keyCode);
        if (e.keyCode == 13) {
            e.preventDefault();

            var value = searchValue.value;

            if (value.length > 0) {

                setValueBtn(btn_id, value);
                search();

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
        if (emptyId == "#empty_new_room") {
            getRoom();
        } else {
            populate_dropdown();
        }
        $('#' + resObj.btnId).text(resObj.btnContent);
    }

    if (found) {
        $(emptyId).css("display", "none");
    } else {
        $(emptyId).css("display", "block");
    }

    clusterize[getId].update(filterRows(rows));
}

var onSearch_new = function (searchValue) {
    document.getElementById(searchValue).onkeypress = function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            search();
        }
    }
}

var count = 1;
var target = $("div#asset_group");
var n = function () {
    return $("div#asset_group")[0].children.length;
};

$('#asset_increment').on('click', function (e) {
    e.preventDefault();
    var outerElement = newAssetGroup();
    $(outerElement[0]).appendTo(target);
    document.getElementById(outerElement[1]).scrollIntoView();
});

function checkFilter(key) {
    var res = {};

    switch (key) {
        case "search_addition_building":
            res = { "btnId": "building_addition_filter", "btnContent": "BUILDING" };

            resetBtn('#building_addition_filter', "BUILDING");
            resetBtn('#level_addition_filter', "LEVEL");
            resetBtn('#area_addition_filter', "AREA");
            resetBtn('#room_addition_filter', "ROOM");
            resetBtn('#sublocaction_addition_filter', "SUB LOCATION");
            resetBtn('#assetNo_addition_filter', "ASSET NUMBER");

            $('#search_addition_building').val("");
            $('#search_addition_level').val("");
            $('#search_addition_area').val("");
            $('#search_addition_room').val("");
            $('#search_addition_sublocaction').val("");
            $('#search_addition_assetNo').val("");

            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';
            break;
        case "search_addition_level":
            res = { "btnId": "level_addition_filter", "btnContent": "LEVEL" };

            resetBtn('#level_addition_filter', "LEVEL");
            resetBtn('#area_addition_filter', "AREA");
            resetBtn('#room_addition_filter', "ROOM");
            resetBtn('#sublocaction_addition_filter', "SUB LOCATION");
            resetBtn('#assetNo_addition_filter', "ASSET NUMBER");

            $('#search_addition_level').val("");
            $('#search_addition_area').val("");
            $('#search_addition_room').val("");
            $('#search_addition_sublocaction').val("");
            $('#search_addition_assetNo').val("");

            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';
            break;
        case "search_addition_area":
            res = { "btnId": "area_addition_filter", "btnContent": "AREA" };

            resetBtn('#area_addition_filter', "AREA");
            resetBtn('#room_addition_filter', "ROOM");
            resetBtn('#sublocaction_addition_filter', "SUB LOCATION");
            resetBtn('#assetNo_addition_filter', "ASSET NUMBER");

            $('#search_addition_area').val("");
            $('#search_addition_room').val("");
            $('#search_addition_sublocaction').val("");
            $('#search_addition_assetNo').val("");

            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';
            break;
        case "search_addition_room":
            res = { "btnId": "room_addition_filter", "btnContent": "ROOM" };


            resetBtn('#room_addition_filter', "ROOM");
            resetBtn('#sublocaction_addition_filter', "SUB LOCATION");
            resetBtn('#assetNo_addition_filter', "ASSET NUMBER");

            $('#search_addition_room').val("");
            $('#search_addition_sublocaction').val("");
            $('#search_addition_assetNo').val("");

            localStorage.room_no = '';
            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';
            break;
        case "search_addition_sublocaction":
            res = { "btnId": "sublocaction_addition_filter", "btnContent": "SUB LOCATION" };

            resetBtn('#sublocaction_addition_filter', "SUB LOCATION");
            resetBtn('#assetNo_addition_filter', "ASSET NUMBER");

            $('#search_addition_sublocaction').val("");
            $('#search_addition_assetNo').val("");

            localStorage.sub_location = '';
            localStorage.asset_primary_id = '';
            break;
        case "search_addition_assetNo":
            res = { "btnId": "assetNo_addition_filter", "btnContent": "ASSET NUMBER" };

            resetBtn('#assetNo_addition_filter', "ASSET NUMBER");
            $('#search_addition_sublocaction').val("");

            localStorage.asset_primary_id = '';
            break;
        case "search_new_room":
            res = { "btnId": "not found", "btnContent": "not found" };
            localStorage.room_no = '';
            break;
        default:
            res = { "btnId": "not found", "btnContent": "not found" };
            break;
    }

    return res;
}

var newAssetGroup = function () {
    var desc_checked = "", room_check = "";

    if ($('#desc_check').prop("checked") === true) {
        desc_checked = $('#add_desc').val();
    }
    if ($('#room_check').prop("checked") === true) {
        room_check = $('#add_room').val();
    }


    var focus_div = "focus-input-" + n()
    var outerDiv = $("<div/>", {
        "class": "row table-bordered asset_group_style mt_group",
        id: focus_div
    });

    var col_sm_11 = $("<div/>", {
        "class": "col-sm-11"
    });

    var row_1 = $("<div/>", {
        "class": "row"
    });

    var row_2 = $("<div/>", {
        "class": "row"
    });

    var col_sm_5 = $("<div/>", {
        class: "col-sm-5"
    });

    var asset_number_group = $("<div/>", {
        "class": "form-group label-floating"
    });

    var asset_number_label = $("<label/>", {
        "class": "control-label",
        text: "Asset Number *"
    });

    var asset_number_input = $("<input/>", {
        "class": "form-control my_required",
        required: "required",
        name: "asset_number" + n(),
        id: "input_" + n(),
        type: "text"
    });

    var asset_number_group = $("<div/>", {
        "class": "form-group label-floating"
    });

    var col_sm_5_desc = $("<div/>", {
        class: "col-sm-6"
    });

    var desc_col_sm_10 = $("<div/>", {
        class: "col-sm-10 offset-1"
    });

    var floating_desc_label_group = $("<div/>", {
        class: "form-group label-floating"
    });

    var desc_floating_label = $("<label/>", {
        class: "control-label",
        text: "Asset description *"
    });

    var desc_input = $("<input/>", {
        class: "form-control my_required",
        name: "asset_description" + n(),
        required: "required",
        value: "" + desc_checked,
        type: "text"
    });

    var close_close_btn = $("<button/>", {
        class: "btn btn-danger pull-right",
        id: n(),
    })

    var glyph = $("<span/>", {
        "class": "fa fa-close"
    });

    var col_count = $("<div/>", {
        "class": "col-sm-1 my-auto"
    });

    count++;

    var p_count = $("<p/>", {
        "class": "text-center number-style",
        text: count
    });

    var col_sm_3 = $("<div/>", {
        "class": "col-sm-5 offset-1"
    });

    var form_group = $("<div/>", {
        "class": "form-group label-floating"
    });

    var serial_floating_label = $("<label/>", {
        class: "control-label",
        text: "Serial No. *"
    });

    var serial_no_input = $("<input/>", {
        class: "form-control pull-right",
        id: "serial_no_" + n(),
        name: "serial_no_" + n(),
        type: "text"
    });

    var col_sm_6_room = $("<div/>", {
        class: "col-sm-6"
    });

    var col_sm_10_room = $("<div/>", {
        class: "col-sm-10 offset-1"
    });

    var room_form_group = $("<div/>", {
        class: "form-group label-floating"
    });

    var room_label = $("<label/>", {
        class: "control-label",
        text: "Asset Room No.*"
    });

    var room_input = $("<input/>", {
        class: "form-control",
        id: "room_no_" + n(),
        name: "room_no_" + n(),
        type: "text",
        value: "" + room_check
    });



    //count
    $(p_count).appendTo(col_count);

    //row 2

    //room_no
    $(room_label).appendTo(room_form_group);
    $(room_input).appendTo(room_form_group);
    $(room_form_group).appendTo(col_sm_10_room);
    $(col_sm_10_room).appendTo(col_sm_6_room);

    //serail number
    $(serial_floating_label).appendTo(form_group);
    $(serial_no_input).appendTo(form_group);
    $(form_group).appendTo(col_sm_3);

    //append row
    $(col_sm_3).appendTo(row_2);
    $(col_sm_6_room).appendTo(row_2);

    //row 1

    //description
    $(desc_floating_label).appendTo(floating_desc_label_group);
    $(desc_input).appendTo(floating_desc_label_group);
    $(floating_desc_label_group).appendTo(desc_col_sm_10);
    $(desc_col_sm_10).appendTo(col_sm_5_desc);

    //assetNumber
    $(asset_number_label).appendTo(asset_number_group);
    $(asset_number_input).appendTo(asset_number_group);
    $(asset_number_group).appendTo(col_sm_5);

    //append row 1
    $(col_count).prependTo(row_1);
    $(col_sm_5).appendTo(row_1);
    $(col_sm_5_desc).appendTo(row_1);


    //outer col-sm-11
    $(row_1).appendTo(col_sm_11);
    $(row_2).appendTo(col_sm_11);

    //button tag
    $(glyph).appendTo(close_close_btn);

    //count tag
    $(close_close_btn).prependTo(outerDiv);
    $(col_sm_11).appendTo(outerDiv);
    // $(col_sm_5).appendTo(outerDiv);
    // $(col_sm_5_desc).appendTo(outerDiv);
    // $(col_sm_3).appendTo(outerDiv);

    return {
        "0": outerDiv,
        "1": focus_div
    };
}

$('#asset_group').on('click', 'button', function (e) {
    e.preventDefault();
    var target = $("#asset_group").find("#focus-input-" + this.id);
    $(target).remove();
});