
/*!
 * AME SYSADMIN Library JS
 * website
 * Copyright AME SOFTWARE DEVELOPMENT TEAM (Talent & Melusi)
 * Released under the AME license
 * Date: 2019-07-29
 */

$('#searchView').fadeIn(500);


function closeAsset() {
    document.getElementById('overlay-asset').style.display = "none"
}

function viewAsset(assetId) {
    document.getElementById('overlay-asset').style.display = "block";
    console.log($('#assetBody'));
    $('#assetBody')['0'].innerHTML = assetId;
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
        $.ajax({
            url: "../../ams_apis/actions/getAssets.php",
            method: "POST",
            dataType: "JSON",
            data: '{"v_assetNo" :"' + assetNo + '","v_room" : "' + room + '","v_location" : "' + location + '","v_description" : "' + description + '"}',
            success: function (data) {
                $('#loader').hide();
                // alert(results);
                console.log(data);
                if (data.rows > 0) {
                    for (var i = 0; i < data.rows; i++) {
                        current += '<tr id="c_row' + data.data[i].ASSET_ID + '"><th scope="row" style="width: 10%;"><input id="check' + data.data[i].ASSET_ID + '" class="currentItems" type="checkbox" value="' + data.data[i].ASSET_ID + '" onclick="getNumberOfSelectedItems(currentSelectedItems,`#current .currentItems:checked`)"></th><td>' + data.data[i].ASSET_ID + '</td><td>' + data.data[i].ASSET_ROOM_NO + '</td><td>' + data.data[i].ASSET_LOCATION_AREA + '</td><td class="" style="width: 24%;">' + (data.data[i].ASSET_DESCRIPTION).substring(0, 20) + '...</td><td class="text-center" ><button class="btn btn-default" style="border-radius:50%;" onclick="viewAsset(`' + data.data[i].ASSET_ID + '`)"><span class="fa fa-eye item-view"></span></button></td></tr>';
                    }
                } else {
                    current += '<tr id="nodata"><th scope="row" colspan="5"></th></tr>';
                }//close if
                // document.getElementById('currentItems').innerHTML = data.rows;
                document.getElementById('current').innerHTML = current;

                setTimeout(function () {
                    // $('#searchView').fadeIn(500);
                }, 5000);
            },//close success function
            error: function (err) {
                console.log(err);
            }//close error function
        });//close ajax function




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