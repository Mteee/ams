
function generateTable(id) {
    let str = '<table>' +
        '<tr class="bg-tr"><th>#</th><th>Asset ID</th><th>Room</th><th>Status</th></tr>';
    for (let i = 0; i < 20; i++) {
        str += '<tr>' +
            '<td>' + i + '</td>' +
            '<td>XXX</td>' +
            '<td>XXXX</td>' +
            '<td>XXXXXX</td>' +
            '</tr>';
    }

    str += ' </table>';
    document.getElementById(id).innerHTML = str;
}

generateTable('table-view');

function getData(a) {

    var jsonData = '{"building" :"' + localStorage.building + '","level" :"' + localStorage.level + '","area_name" :"' + localStorage.area_name + '","area" :"' + localStorage.area + '","room_no" :"' + localStorage.room_no + '","sub_location" :"' + localStorage.sub_location + '","assetNo" :"' + localStorage.assetno + '","dateStart" :"' + localStorage.dateStart + '","dateEnd" :"' + localStorage.dateEnd + '","asset_class" :"' + localStorage.filter + '","role" :"' + localStorage.role + '","user" :"' + localStorage.username + '"}';

    console.log(jsonData);

    $.ajax({
        url: "../../ams_apis/slimTest/index.php/" + a,
        type: "POST",
        dataType: 'json',
        data: jsonData,
        success: function (data) {
            console.log(data);

            // let str = '<table>' +
            //     '<tr class="bg-tr"><th>#</th><th>Asset ID</th><th>Room</th><th>Status</th></tr>';
            // for (let i = 0; i < 20; i++) {
            //     str += '<tr>' +
            //         '<td>' + i + '</td>' +
            //         '<td>XXX</td>' +
            //         '<td>XXXX</td>' +
            //         '<td>XXXXXX</td>' +
            //         '</tr>';
            // }

            // str += ' </table>';
            if (data.rows > 0) {
                document.getElementById("table-view").innerHTML = data.data;
            }

        },
        error: function (error) {
            console.log(error);
        }
    });
}
