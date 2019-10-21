clearLocalStorageFilters();

$('#searchView').fadeIn(500);

var user_class = localStorage.username;

$('#username').text(user_class);

//check for filter in local storage
if (localStorage.backupFilter == undefined || localStorage.backupFilter == "undefined") {
    localStorage.backupFilter = localStorage.filter;
} else {
    localStorage.filter = localStorage.backupFilter;
}


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
    localStorage.level = ''
    localStorage.area = ''
    localStorage.room_no = ''
    localStorage.sub_location = ''
    open("../index.html", '_self')
    window.location.replace("../index.html");
    window.close();
}

window.onload = function () {
    if (localStorage.building !== '' || localStorage.level !== '' || localStorage.area !== '' || localStorage.room_no !== '') {
        localStorage.building = '';
        localStorage.level = ''
        localStorage.area = ''
        localStorage.room_no = ''
        localStorage.sub_location = ''
        // populate_dropdown();
    }
}

function viewAsset(assetId) {
    var currentItem = "";
    document.getElementById('overlay-asset').style.display = "block";
    // console.log($('#assetBody'));
    $('#assetBody')['0'].innerHTML = assetId;

    console.log("eye-icon");
    console.log('{"primary_asset_id" :"' + assetId + '"}');

    $.ajax({
        url: "../../ams_apis//slimTest/index.php/singleAsset",
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

function populate_add_dropdown() {
    
    // get room
    getItems('../../ams_apis/slimTest/index.php/asset_room_no_location', 'search_add_location_room', 'scroll_add_location_room', 'menu_add_location_room', 'empty_add_location_room');
    // get area
    getItems('../../ams_apis/slimTest/index.php/asset_area_location', 'search_add_location_area', 'scroll_add_location_area', 'meun_add_location_area', 'empty_add_location_area');
    // get level
    getItems('../../ams_apis/slimTest/index.php/asset_level_new_location', 'search_add_location_level', 'scroll_add_location_level', 'menu_add_location_level', 'empty_add_location_level');
    // get building
    getItems('../../ams_apis/slimTest/index.php/building_location', 'search_add_location_building', 'scroll_add_location_building', 'menu_add_location_building', 'empty_add_location_building');

}

function populate_dropdown() {
    // get room
    getItems('../../ams_apis/slimTest/index.php/asset_room_no_location', 'search_location_room', 'scroll_location_room', 'menu_location_room', 'empty_location_room');
    // get area
    getItems('../../ams_apis/slimTest/index.php/asset_area_location', 'search_location_area', 'scroll_location_area', 'meun_location_area', 'empty_location_area');
    // get level
    getItems('../../ams_apis/slimTest/index.php/asset_level_new_location', 'search_location_level', 'scroll_location_level', 'menu_location_level', 'empty_location_level');
    // get building
    getItems('../../ams_apis/slimTest/index.php/building_location', 'search_location_building', 'scroll_location_building', 'menu_location_building', 'empty_location_building');
    // get sub_location
    getItems('../../ams_apis/slimTest/index.php/asset_sub_location_location', 'search_location_sublocaction', 'scroll_location_sublocaction', 'menu_location_sublocaction', 'empty_locaton_sublocaction');
        
}

populate_dropdown();
// populate_add_dropdown();

function add_new_location(){
    $('#overlay-newAssetView').show();
    populate_add_dropdown();
}

function createLocation(){
    var input_building = $("#building_location_filter").text();
    var input_level = $("#level_location_filter").text();
    var input_area = $("#area_location_filter").text();
    var input_Room = $("#location_new_room").text();
    var input_sub = $("#location_new_sub_location").text();

    console.log(input_building+ " " +input_level + " " + input_area + " " + input_Room + " " + input_sub);

    if($('#sameLocation').prop("checked") === true){
        console.log("same"); 
    }else{
        console.log("diff"); 
    }


    //check room if exists

    //check sub
}

$("#sameLocation").change(function() {
    console.log(this.checked); 
    if($('#sameLocation').prop("checked") === true){
        $("#newSubLocation").css({"display":"none !important"}); 
        console.log("1"); 
    }else{
       $("#newSubLocation").css({"display":"block !important"}); 
        console.log("2"); 
    } 
});

// $('#sameLocation').change(function(){
//     if($('#sameLocation').prop("checked") === true){
//         $("#location_new_sub_location").hide(); 
//     }else{
//         $("#location_new_sub_location").show(); 
//     } 
// });

function getRoom() {
    getItems('../../ams_apis/slimTest/index.php/asset_room_no_location', 'search_new_room', 'scroll_new_room', 'menu_new_room', 'empty_new_room');
}

var allArr = {
    search_location_sub_location: [],
    search_location_room: [],
    search_location_area: [],
    search_location_level: [],
    search_location_building: []
};

function getItems(url, id, scrollArea, menuid, empty) {

    var descrption = $('#location_description').val();

    console.log('{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","sub_location":"' + localStorage.sub_location + '","description":"'+descrption+'","asset_class":"' + localStorage.filter + '"}');

    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        data: '{"building":"' + localStorage.building + '","level":"' + localStorage.level + '","area":"' + localStorage.area + '","room_no":"' + localStorage.room_no + '","sub_location":"' + localStorage.sub_location + '","description":"'+descrption+'","asset_class":"' + localStorage.filter + '"}',
        success: function (data) {

            // if ($("#search_location_roomno").val() !== "") {

            //     if (id == "search_location_building") {
            //         $("#building_location_filter").text(data.data[0])
            //         $("#search_location_building").val(data.data[0])
            //     }
            //     if (id == "search_location_level") {
            //         $("#level_location_filter").text(data.data[0])
            //         $("#search_location_level").val(data.data[0])
            //     }
            //     if (id == "search_location_location") {
            //         $("#dropdown_location_location").text(data.data[0])
            //         $("#search_location_location").val(data.data[0])
            //     }
            // }


            console.log(data);
            var rows = [];
            var searchValue = document.getElementById(id);
            // console.log("=============searchValue================");
            // console.log(searchValue);
            // console.log("=============searchValue=================");
            for (var i = 0; i < data.rows; i++) {
                rows.push({
                    values: [data.data[i]],
                    markup: '<input type="button" class="dropdown-item form-control" type="button" value="' + data.data[i] + '"/>',
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
    search_location_room: [],
    search_location_area: [],
    search_location_level: [],
    search_location_building: []
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

function add_new_asset() {
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

    $('#search_location_building').val("");
    $('#search_location_level').val("");
    $('#search_location_area').val("");
    $('#search_location_room').val("");
    $('#search_location_sublocaction').val("");
    $('#search_location_assetNo').val("");
}

function search() {

    var building = document.getElementById('search_location_building').value,
        level = document.getElementById('search_location_level').value,
        area = document.getElementById('search_location_area').value,
        room_no = document.getElementById('search_location_room').value;
        description = document.getElementById('location_description').value;
        sub_location = document.getElementById('search_location_sublocaction').value;

    var results = (building + " - " + level + " - " + area + " - " + room_no + " - " + description + " - " + sub_location);
    var current = "";
    // console.log(results);
    if (results == " -  -  -  -  - ") {
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

        console.log('{"building" :"' + building + '","level" : "' + level + '","area" : "' + area + '","room_no" : "' + room_no + '","description" : "' + description + '","asset_sub_location":"' + localStorage.sub_location + '","asset_class":"' + localStorage.filter + '"}');

        $.ajax({
            url: "../../ams_apis/slimTest/index.php/get_all_locations",
            type: "POST",
            dataType: 'json',
            data: '{"building" :"' + building + '","level" : "' + level + '","area" : "' + area + '","room_no" : "' + room_no + '","description" : "' + description + '","asset_sub_location":"' + localStorage.sub_location + '","asset_class":"' + localStorage.filter + '"}',
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
                        console.log(data.data[k].get_lcoations);
                        if ((data.rows - 1) == k) {
                            str += '["' + data.data[k].ASSET_BUILDING + '","';
                            str += data.data[k].ASSET_LEVEL + '","';
                            str += data.data[k].ASSET_AREA + '","';
                            str += data.data[k].ASSET_AREA_NAME + '","';
                            str += data.data[k].ASSET_AREA_DETAIL + '","';
                            str += data.data[k].ASSET_ROOM_NO + '","';
                            str += data.data[k].HD_ASSET_ROOM_LOCATION + '","';
                            str += data.data[k].HD_ASSET_DESC  + '"]';
                        } else {

                            str += '["' + data.data[k].ASSET_BUILDING + '","';
                            str += data.data[k].ASSET_LEVEL + '","';
                            str += data.data[k].ASSET_AREA + '","';
                            str += data.data[k].ASSET_AREA_NAME + '","';
                            str += data.data[k].ASSET_AREA_DETAIL + '","';
                            str += data.data[k].ASSET_ROOM_NO + '","';
                            str += data.data[k].HD_ASSET_ROOM_LOCATION + '","';
                            str += data.data[k].HD_ASSET_DESC  +'"],';
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
                    var data = table.row($(this).parents('tr')).data();
                    setTimeout(function () {
                        console.log(checkboxSelectedLength());
                        if (checkboxSelectedLength() > 0) {
                            $('#commAssets').fadeIn(500);
                        } else {
                            $('#commAssets').fadeOut(500);
                        }
                    }, 500);

                    // var check_id = table.row($(this).parents('tr')).data();
                    // console.log(check_id[0]);
                    // checkIsPrim(check_id[0]);


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
    }
}

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

function replaceAll(find, replace, str) {
    while (str.indexOf(find) > -1) {
        str = str.replace(find, replace);
    }
    return str;
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
            // {
            //     'targets': 0,
            //     'checkboxes': {
            //         'selectRow': true,
            //         'value': tableData[0]
            //     }
            // },
            {
                // "targets": -1,
                // "data": null,
                // "orderable": false,
                // "defaultContent": "<button type='button' class='btn btn-primary'><span class='fa fa-eye'></span></button>"
            },
            {
                "targets": -2,
                "orderable": false
            }
        ]
        ,
        fnCreatedRow: function (nTd, nRow, aData, iDataIndex) {

            $(nRow).attr('id', aData[0]);
            // console.log($(nTd).children()[0].children);
        }
    });

    $('#frm-example').on('submit', function (e) {

        console.log("click");
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
    // console.log($('#assetBody'));
    document.getElementById('movItemCount').innerHTML = assets.length;


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

    $("#confirmComm").off().on("click", function () {
        confirmComm(conc_assets, cert_no.data);
    });
}

function confirmComm(assets_ids, certificate_no) {

    console.log('{"assets" : "' + assets_ids + '","cert" : "' + certificate_no + '"}');


    $.ajax({
        // url: "assets.json",
        url: "../../ams_apis/slimTest/index.php/comm_asset",
        method: "post",
        data: '{"username":"' + localStorage.username + '","asset_class":"' + localStorage.filter + '","assets":"' + assets_ids + '","cert":"' + certificate_no + '"}',
        dataType: "json",
        success: function (data) {
            closeAsset('overlay-comm');
            console.log(data);
            // $('#commAssets').fadeOut(500);
            search();
            $('#commAssets').fadeOut(500);
            swal.fire({
                title: "Success",
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
            console.log(err);
        }
    });

}


function clearData(input, btnDafualtId, text) {
    // var inputData = document.getElementById(input).(val);
    var value = $(input).val();

    if (value.length > 0) {

        if (input == "#search_location_building") {
            document.getElementById('menu_location_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_location_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_location_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_location_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_location_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';

            populate_dropdown();

            $(input).val("");
            $(btnDafualtId).text(text);

            $('#search_location_building').val("");
            $('#building_location_filter').text("BUILDING");
            $('#search_location_level').val("");
            $('#level_location_filter').text("LEVEL");
            $('#search_location_area').val("");
            $('#area_location_filter').text("AREA");
            $('#search_location_room').val("");
            $('#room_location_filter').text("ROOM");
            $('#search_location_sublocaction').val("");
            $('#sublocaction_location_filter').text("SUB LOCATION");


        } else if (input == "#search_location_level") {

            document.getElementById('menu_location_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_location_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_location_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_location_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            populate_dropdown();

            $(input).val("");
            $(btnDafualtId).text(text);

            $('#search_location_level').val("");
            $('#level_location_filter').text("LEVEL");
            $('#search_location_area').val("");
            $('#area_location_filter').text("AREA");
            $('#search_location_room').val("");
            $('#room_location_filter').text("ROOM");
            $('#search_location_sublocaction').val("");
            $('#sublocaction_location_filter').text("SUB LOCATION");

        } else if (input == "#search_location_area") {

            document.getElementById('meun_location_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_location_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_location_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';

            populate_dropdown();

            $('#search_location_area').val("");
            $('#area_location_filter').text("AREA");
            $('#search_location_room').val("");
            $('#room_location_filter').text("ROOM");
            $('#search_location_sublocaction').val("");
            $('#sublocaction_location_filter').text("SUB LOCATION");

        }
        else if (input == "#search_location_room") {

            document.getElementById('menu_location_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_location_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.room_no = '';
            localStorage.sub_location = '';

            populate_dropdown();

            $('#search_location_room').val("");
            $('#room_location_filter').text("ROOM");
            $('#search_location_sublocaction').val("");
            $('#sublocaction_location_filter').text("SUB LOCATION");

        }
        else if (input == "#search_location_sublocaction") {

            document.getElementById('menu_location_sublocaction').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            localStorage.sub_location = '';

            populate_dropdown();

            $('#search_location_sublocaction').val("");
            $('#sublocaction_location_filter').text("SUB LOCATION");

        }
        else if (input == "#search_add_location_building") {

            document.getElementById('menu_add_location_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_add_location_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_add_location_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_add_location_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            getRoom();

            $('#search_new_room').val("");
            $('#room_new_filter').text("ROOM");

        }
        else if (input == "#search_add_location_level") {

            document.getElementById('menu_add_location_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_add_location_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_add_location_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_add_location_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            getRoom();

            $('#search_new_room').val("");
            $('#room_new_filter').text("ROOM");

        }
        else if (input == "#search_add_location_area") {

            document.getElementById('menu_add_location_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_add_location_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_add_location_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_add_location_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            getRoom();

            $('#search_new_room').val("");
            $('#room_new_filter').text("ROOM");

        }
        else if (input == "#search_add_location_room") {

            document.getElementById('menu_add_location_building').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_add_location_level').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('meun_add_location_area').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            document.getElementById('menu_add_location_room').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';

            getRoom();

            $('#search_new_room').val("");
            $('#room_new_filter').text("ROOM");

        }
    }
}

// Building
$('#menu_location_building').on('click', '.dropdown-item', function () {
    $('#building_location_filter').text($(this)[0].value);
    localStorage.building = $(this)[0].value;
    populate_dropdown();
    $("#building_location_filter").dropdown('toggle');
    $('#search_location_building').val($(this)[0].value);
});

// level
$('#menu_location_level').on('click', '.dropdown-item', function () {
    $('#level_location_filter').text($(this)[0].value);
    localStorage.level = $(this)[0].value;
    populate_dropdown();
    $("#level_location_filter").dropdown('toggle');
    $('#search_location_level').val($(this)[0].value);
});

// area
$('#meun_location_area').on('click', '.dropdown-item', function () {
    $('#area_location_filter').text($(this)[0].value);
    localStorage.area = $(this)[0].value;
    populate_dropdown();
    $("#area_location_filter").dropdown('toggle');
    $('#search_location_area').val($(this)[0].value);
});

// room
$('#menu_location_room').on('click', '.dropdown-item', function () {
    $('#room_location_filter').text($(this)[0].value);
    localStorage.room_no = $(this)[0].value;
    populate_dropdown();
    $("#room_location_filter").dropdown('toggle');
    $('#search_location_room').val($(this)[0].value);
});

// sub_location
$('#menu_location_sublocaction').on('click', '.dropdown-item', function () {
    $('#sublocaction_location_filter').text($(this)[0].value);
    localStorage.sub_location = $(this)[0].value;
    populate_dropdown();
    $("#sublocaction_location_filter").dropdown('toggle');
    $('#search_location_sublocaction').val($(this)[0].value);
});


//  newly Building
$('#menu_add_location_building').on('click', '.dropdown-item', function () {
    $('#building_add_location_filter').text($(this)[0].value);
    localStorage.building_add = $(this)[0].value;
    populate_add_dropdown();
    $("#building_add_location_filter").dropdown('toggle');
    $('#search_add_location_building').val($(this)[0].value);
});

// newly level
$('#menu_add_location_level').on('click', '.dropdown-item', function () {
    $('#level_add_location_filter').text($(this)[0].value);
    localStorage.level_add = $(this)[0].value;
    populate_add_dropdown();
    $("#level_add_location_filter").dropdown('toggle');
    $('#search-add_location_level').val($(this)[0].value);
});

// newly area
$('#meun_add_location_area').on('click', '.dropdown-item', function () {
    $('#area_add_location_filter').text($(this)[0].value);
    localStorage.area_add = $(this)[0].value;
    populate_add_dropdown();
    $("#area_add_location_filter").dropdown('toggle');
    $('#search_add_location_area').val($(this)[0].value);
});

// newly room
$('#menu_add_location_room').on('click', '.dropdown-item', function () {
    $('#room_add_location_filter').text($(this)[0].value);
    localStorage.room_no_add = $(this)[0].value;
    populate_add_dropdown();
    $("#room_add_location_filter").dropdown('toggle');
    $('#search_add_location_room').val($(this)[0].value);
});

if (localStorage.dropdownFilter == "ALL EQUIPMENT") {

    // $('#class-options').append(new Option("ALL EQUIPMENT", "all_equip"));
    $('#class-options').append(new Option("FACILITIES MANAGEMENT", "fac_equip"));
    $('#class-options').append(new Option("IT EQUIPMENT", "it_equip"));
    $('#class-options').append(new Option("MEDICAL EQUIPMENT", "med_equip"));
    $('#class-options').prop('disabled', false);

    $('#class-options').on('change', function () {
        var filter = $("#class-options option:selected").text();
        localStorage.filter = filter;

        if (filter == "IT EQUIPMENT") {
            $('.filter_sub').show();
        } else {
            $('.filter_sub').hide();
        }

        clearLocalStorageFilters();
        populate_dropdown();

        //clear btn text
        resetBtn('#building_location_filter', "BUILDING");
        resetBtn('#level_location_filter', "LEVEL");
        resetBtn('#area_location_filter', "AREA");
        resetBtn('#room_location_filter', "ROOM");
        resetBtn('#sublocaction_location_filter', "SUB LOCATION");
        // resetBtn('#assetNo_location_filter', "ASSET NUMBER");

    });

} else {
    $('#class-options').append(new Option(localStorage.filter, "user_class"));
    $('#class-options').css({ "-moz-appearance": "none" });
    $('#class-options').prop('disabled', 'disabled');
}

$('#asset_class').on('change', function () {
    localStorage.filter = $("#asset_class option:selected").text();
    getRoom();
});

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

    localStorage.building_add = '';
    localStorage.level_add = '';
    localStorage.area_add = '';
    localStorage.room_no_add = '';

    $('#search_location_building').val("");
    $('#search_location_level').val("");
    $('#search_location_area').val("");
    $('#search_location_room').val("");
    $('#search_location_sublocaction').val("");
    // $('#search_location_assetNo').val("");

}

function cleaAllFilters() {

    clearLocalStorageFilters();

    populate_dropdown();

    //clear btn text
    resetBtn('#building_location_filter', "BUILDING");
    resetBtn('#level_location_filter', "LEVEL");
    resetBtn('#area_location_filter', "AREA");
    resetBtn('#room_location_filter', "ROOM");
    resetBtn('#sublocaction_location_filter', "SUB LOCATION");
    resetBtn('#assetNo_location_filter', "ASSET NUMBER");

    //description
    $('#view_description').val("");
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


var onSearch_new = function (searchValue) {
    document.getElementById(searchValue).onkeypress = function (e) {

        console.log(e.keyCode);
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
    // $('asset_group');
    var outerElement = newAssetGroup();
    // console.log(newAssetGroup());
    // console.log($("div#asset_group")[0].children.length);
    $(outerElement[0]).appendTo(target);

    console.log($('.wizard-card form').validate);

    console.log($('#' + outerElement[1]));
    console.log("=========================================");
    // console.log($('#'+outerElement[1]).offset().top);
    // alert($("div#scroll_group_view").scrollTop());
    // $("div#scroll_group_view").animate({
    //     scrollTop: 0
    // });
    // $("div#scroll_group_view").animate({
    //     scrollTop: ($('#'+outerElement[1]).offset().top)
    // });
    document.getElementById(outerElement[1]).scrollIntoView();


});

function checkFilter(key) {
    var res = {};

    switch (key) {
        case "search_location_building":
            res = { "btnId": "building_location_filter", "btnContent": "BUILDING" };

            resetBtn('#building_location_filter', "BUILDING");
            resetBtn('#level_location_filter', "LEVEL");
            resetBtn('#area_location_filter', "AREA");
            resetBtn('#room_location_filter', "ROOM");
            resetBtn('#sublocaction_location_filter', "SUB LOCATION");

            $('#search_location_building').val("");
            $('#search_location_level').val("");
            $('#search_location_area').val("");
            $('#search_location_room').val("");
            $('#search_location_sublocaction').val("");

            localStorage.building = '';
            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            break;

        case "search_location_level":
            res = { "btnId": "level_location_filter", "btnContent": "LEVEL" };

            resetBtn('#level_location_filter', "LEVEL");
            resetBtn('#area_location_filter', "AREA");
            resetBtn('#room_location_filter', "ROOM");
            resetBtn('#sublocaction_location_filter', "SUB LOCATION");
            resetBtn('#assetNo_location_filter', "ASSET NUMBER");

            $('#search_location_level').val("");
            $('#search_location_area').val("");
            $('#search_location_room').val("");
            $('#search_location_sublocaction').val("");

            localStorage.level = '';
            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            break;
        case "search_location_area":
            res = { "btnId": "area_location_filter", "btnContent": "AREA" };

            resetBtn('#area_location_filter', "AREA");
            resetBtn('#room_location_filter', "ROOM");
            resetBtn('#sublocaction_location_filter', "SUB LOCATION");

            $('#search_location_area').val("");
            $('#search_location_room').val("");
            $('#search_location_sublocaction').val("");

            localStorage.area = '';
            localStorage.room_no = '';
            localStorage.sub_location = '';
            break;
        case "search_location_room":
            res = { "btnId": "room_location_filter", "btnContent": "ROOM" };


            resetBtn('#room_location_filter', "ROOM");
            resetBtn('#sublocaction_location_filter', "SUB LOCATION");

            $('#search_location_room').val("");
            $('#search_location_sublocaction').val("");

            localStorage.room_no = '';
            localStorage.sub_location = '';
            break;

        case "search_location_sublocaction":
            res = { "btnId": "sublocaction_location_filter", "btnContent": "SUB LOCATION" };

            resetBtn('#sublocaction_location_filter', "SUB LOCATION");

            $('#search_location_sublocaction').val("");

            localStorage.sub_location = '';
            break;

            //add new filters
        case "search_add_location_building":
            res = { "btnId": "building_location_filter", "btnContent": "BUILDING" };

            resetBtn('#building_location_filter', "BUILDING");
            resetBtn('#level_add_location_filter', "LEVEL");
            resetBtn('#area_add_location_filter', "AREA");
            resetBtn('#room_add_location_filter', "ROOM");

            $('#search_add_location_building').val("");
            $('#search_add_location_level').val("");
            $('#search_add_location_area').val("");
            $('#search_add_location_room').val("");

            localStorage.building_add = '';
            localStorage.level_add = '';
            localStorage.area_add = '';
            localStorage.room_no_add = '';

            break;
        case "search_add_location_level":
            res = { "btnId": "level_add_location_filter", "btnContent": "LEVEL" };

            resetBtn('#level_add_location_filter', "LEVEL");
            resetBtn('#area_add_location_filter', "AREA");
            resetBtn('#room_add_location_filter', "ROOM");

            $('#search_add_location_level').val("");
            $('#search_add_location_area').val("");
            $('#search_add_location_room').val("");

            localStorage.level_add = '';
            localStorage.area_add = '';
            localStorage.room_no_add = '';

            break;
        case "search_add_location_area":
            res = { "btnId": "area_add_location_filter", "btnContent": "AREA" };

            resetBtn('#area_add_location_filter', "AREA");
            resetBtn('#room_add_location_filter', "ROOM");

            $('#search_add_location_area').val("");
            $('#search_add_location_room').val("");

            localStorage.area_add = '';
            localStorage.room_no_add = '';

            break;
        case "search_add_location_room":
            res = { "btnId": "room_add_location_filter", "btnContent": "ROOM" };

            resetBtn('#room_add_location_filter', "ROOM");

            $('#search_add_location_room').val("");

            localStorage.room_no_add = '';

            break;
        default:
            res = { "btnId": "not found", "btnContent": "not found" };
            break;
    }

    return res;
}

