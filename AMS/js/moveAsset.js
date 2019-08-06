
/*!
 * AME SYSADMIN Library JS
 * website
 * Copyright AME SOFTWARE DEVELOPMENT TEAM (Talent & Melusi)
 * Released under the AME license
 * Date: 2019-07-29
 */

$('#searchView').fadeIn(500);

var user_class = localStorage.getItem("filter");

$('.user-class option').text(user_class);

console.log(user_class);

function closeAsset() {
    document.getElementById('overlay-asset').style.display = "none"
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
    var assetNo = document.getElementById('asseetsno').value,
        room = document.getElementById('roomno').value,
        location = document.getElementById('location').value,
        description = document.getElementById('description').value;

    var results = (assetNo + " - " + room + " - " + location + " - " + description);
    var current = "";

    if (" -  -  - " == results) {
        alert("Please enter alteast one filter");
    } else {
        $('#searchView').hide();
        $('#outSearch').hide();
        $('#inSearch').hide();
        $('#loader').fadeIn(500);
        document.getElementById('current').innerHTML = "";

        makeCall('#currentAssetsTable',10);
        makeCall('#inAssetsTable',5);
        makeCall('#outAssetsTable',5);

     
        //updating y to icons
        function updateLetterToIcon(letter) {
            var results = "";
            switch (letter) {
                case "y":
                    results = "<i class='fa fa-check-circle text-center' style='color:green;font-size:16pt;'></i>";
                    break;
                case "n":
                    results = "<i class='fa fa-times-circle text-center' style='color:red;font-size:16pt;'></i>";
                    break;
                case null:
                    results = "<i class='fa fa-times-circle text-center' style='color:red;font-size:16pt;'></i>";
                    break;
                case "null":
                    results = "<i class='fa fa-times-circle text-center' style='color:red;font-size:16pt;'></i>";
                    break;
                case " ":
                    results = "<i class='fa fa-times-circle text-center' style='color:red;font-size:16pt;'></i>";
                    break;
                case "":
                    results = "<i class='fa fa-times-circle text-center' style='color:red;font-size:16pt;'></i>";
                    break;
            }

            return results;
        }//close updateLetterToIcon function

        function createTable(tableID, tableData, length) {
            var table = $(tableID).DataTable({
                "data": tableData,
                "searching": false,
                "ordering": true,
                "destroy": true,
                "pageLength":length,
                "columnDefs": [{
                    "targets": 0,
                    "data": null,
                    "defaultContent": "<input type='checkbox'/>"
                }, {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button type='button' class='btn btn-primary'><span class='fa fa-eye'></span></button>"
                },
                { "className": "dt-center",
                 "targets": -2 }
                ]
            });

            return table;
        }
    }

    function makeCall(table_dom, length){

        $.ajax({
            url: "../../ams_apis/slimTest/index.php/getAssets",
            type: "POST",
            dataType: 'json',
            data: '{"v_assetNo" :"' + assetNo + '","v_room" : "' + room + '","v_location" : "' + location + '","v_description" : "' + description + '","asset_class":"' + localStorage.filter + '"}',
            success: function (data) {
                // console.log(data);
                $('#loader').hide();
                var table = null;
                if (data.rows > 0) {

                    var str = '{"data" : [';
                    for (var k = 0; k < data.rows; k++) {
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
                    str = (JSON.parse(str));
                    console.log(str.data);

                    table = createTable(table_dom, str.data, length);



                    // table.clear().draw();


                }
                else {
                    // current += '<tr id="nodata" class="text-center"><th scope="row" colspan="6"><h1 class="text-muted">No data</h1></th></tr>';
                    $('#searchView').fadeIn(500);
                    console.log(data.data);

                    table = createTable(table_dom, data.data);

                }

                $(table_dom+'" tbody"').on('click', 'input[type="checkbox"]', function () {
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

                $(table_dom+'"tbody"').on('click', 'button', function () {

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
}



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