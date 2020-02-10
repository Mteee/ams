
function getData(a, colums) {
    var asset_description = document.getElementById('dashboard_description').value;

    var jsonData = '{"building" :"' + localStorage.building + '","level" :"' + localStorage.level + '","area_name" :"' + localStorage.area_name + '","area" :"' + localStorage.area + '","room_no" :"' + localStorage.room_no + '","sub_location" :"' + localStorage.sub_location + '","assetNo" :"' + localStorage.assetno + '","dateStart" :"' + localStorage.dateStart + '","dateEnd" :"' + localStorage.dateEnd + '","asset_class" :"' + localStorage.filter + '","role" :"' + localStorage.role + '","user" :"' + localStorage.username + '","asset_description":"' + asset_description + '","columns":"'+colums+'"}';

    console.log(jsonData);
    console.log(a);

    $.ajax({
        url: "../../ams_apis/slimTest/index.php/" + a,
        type: "POST",
        dataType: 'json',
        data: jsonData,
        success: function (data) {
            console.log(data);
            if (data.rows > 0) {
                document.getElementById("table-view").innerHTML = data.data;
                $('#table-export').DataTable({
                    "bPaginate": false,
                    "fixedColumns": true,
                    "searching": false
                });
                $("#loader-overlay").css("display", "none");
                $(".modals-container").fadeIn(500);
            }

        },
        error: function (error) {
            console.log(error);
        }
    });
}
