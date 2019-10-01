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

function addAsset() {
    alert("hello");
}

function add_new_asset() {
    document.getElementById('overlay-newAssetView').style.display = "block";
}

function closeAsset(id) {
    document.getElementById(id).style.display = "none"
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

function search() {

    var building = document.getElementById('search_addition_building').value,
        level = document.getElementById('search_addition_level').value,
        area = document.getElementById('search_addition_area').value,
        room_no = document.getElementById('search_addition_room').value;
        description = document.getElementById('addition_description').value;

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
                        console.log(data.data[k].ASSET_IS_SUB);
                        if ((data.rows - 1) == k) {

                            if(data.data[k].ASSET_CLASS == "IT EQUIPMENT"){
                                str += '["' + data.data[k].ASSET_SUB_LOCATION + '","';
                                str +=    data.data[k].ASSET_SUB_LOCATION + '","';
                            }else{
                                str += '["' + data.data[k].ASSET_ID + '","';
                                str +=    data.data[k].ASSET_ID + '","';
                            }
                            
                            str +=    data.data[k].ASSET_ROOM_NO + '","';
                            str +=    data.data[k].ASSET_AREA + '","';
                            str +=    replaceAll("\"", "`", data.data[k].ASSET_DESCRIPTION) + '","';
                            str +=    updateLetterToIcon(data.data[k].ASSET_IS_SUB) + '"]';
                        } else {

                            if(data.data[k].ASSET_CLASS == "IT EQUIPMENT"){
                                str += '["' + data.data[k].ASSET_SUB_LOCATION + '","';
                                str +=    data.data[k].ASSET_SUB_LOCATION + '","';
                            }else{
                                str += '["' + data.data[k].ASSET_ID + '","';
                                str +=    data.data[k].ASSET_ID + '","';
                            }
                            
                            str +=    data.data[k].ASSET_ROOM_NO + '","';
                            str +=    data.data[k].ASSET_AREA + '","';
                            str +=    replaceAll("\"", "`", data.data[k].ASSET_DESCRIPTION) + '","';
                            str +=    updateLetterToIcon(data.data[k].ASSET_IS_SUB) + '"],';
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

                    var data = tableArr["currentAssetsTable"].row($(this).parents('tr')).data();
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