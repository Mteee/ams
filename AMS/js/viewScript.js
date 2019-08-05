
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
    console.log(assetId);
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
        $('#loader').fadeIn(500);
        document.getElementById('current').innerHTML = "";


        $.ajax({
            url: "../../ams_apis/slimTest/index.php/getAssets",
            type: "POST",
            dataType: 'json',
            data: '{"v_assetNo" :"' + assetNo + '","v_room" : "' + room + '","v_location" : "' + location + '","v_description" : "' + description + '"}',
            success: function (data) {
                // console.log(data);
                var table = null;



                if (data.rows > 0) {

                    var str = '{"data" : [';
                    for (var k = 0; k < data.rows; k++) {
                        if ((data.rows - 1) == k) {
                            str += '["' + data.data[k].ASSET_ID + '","' +
                                data.data[k].ASSET_ID + '","' +
                                data.data[k].ASSET_ROOM_NO + '","' +
                                data.data[k].ASSET_LOCATION_AREA + '","' +
                                data.data[k].ASSET_DESCRIPTION + '"]'
                        } else {
                            str += '["' + data.data[k].ASSET_ID + '","' +
                                data.data[k].ASSET_ID + '","' +
                                data.data[k].ASSET_ROOM_NO + '","' +
                                data.data[k].ASSET_LOCATION_AREA + '","' +
                                data.data[k].ASSET_DESCRIPTION + '"],'
                        }
                    }
                    str += ']}'
                    str = (JSON.parse(str));
                    console.log(str.data);




                    table = createTable("#currentAssetsTable", str.data);


                    console.log(table);

                    $('#currentAssetsTable tbody').on('click', 'input[type="checkbox"]', function () {
                        var data = table.row($(this).parents('tr')).data();
                        alert(data[0] + "'s salary is: " + data[4]);
                    });

                    $('#currentAssetsTable tbody').on('click', 'button', function () {
                        var data = table.row($(this).parents('tr')).data();
                        viewAsset(data[0]);
                    });


                }
                else {
                    // current += '<tr id="nodata" class="text-center"><th scope="row" colspan="6"><h1 class="text-muted">No data</h1></th></tr>';
                    $('#searchView').fadeIn(500);
                    console.log(data.data);

                    table = createTable("#currentAssetsTable", data.data);


                    $('#currentAssetsTable tbody').on('click', 'input[type="checkbox"]', function () {
                        var data = table.row($(this).parents('tr')).data();
                        alert(data[0] + "'s salary is: " + data[4]);
                    });
                    $('#currentAssetsTable tbody').on('click', 'button', function () {
                        var data = table.row($(this).parents('tr')).data();
                        viewAsset(data[0]);
                    });

                   

                }
                $('#loader').hide();

            },
            error: function (err) {
                console.log(err)
                $('#searchView').fadeIn(500);
                $('#loader').hide();
                alert('Ooops');
            }
        });

        function createTable(tableID, tableData) {
            var table = $(tableID).DataTable({
                "data": tableData,
                "searching": false,
                "ordering": true,
                "info": false,
                "columnDefs": [{
                    "targets": 0,
                    "data": null,
                    "defaultContent": "<input type='checkbox'/>"
                }, {
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button type='button' class='btn btn-primary'><span class='fa fa-eye'></span></button>"
                }]
            });

            return table;
        }

      

        

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
        //                 current += '<tr id="c_row' + data.data[i].ASSET_ID + '"><th scope="row" style="width: 10%;"><input id="check' + data.data[i].ASSET_ID + '" class="currentItems" type="checkbox" value="' + data.data[i].ASSET_ID + '" onclick="getNumberOfSelectedItems(currentSelectedItems,`#current .currentItems:checked`)"></th><td>' + data.data[i].ASSET_ID + '</td><td>' + data.data[i].ASSET_ROOM_NO + '</td><td>' + data.data[i].ASSET_LOCATION_AREA + '</td><td class="" style="width: 24%;">' + (data.data[i].ASSET_DESCRIPTION).substring(0, 20) + '...</td><td class="text-center" ><button class="btn btn-default" style="border-radius:50%;" onclick="viewAsset(`' + data.data[i].ASSET_ID + '`)"><span class="fa fa-eye item-view"></span></button></td></tr>';
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