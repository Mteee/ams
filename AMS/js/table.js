
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
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/" + a,
        type: "POST",
        dataType: 'json',
        data: jsonData,
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.log(error);
        }
    });
}
