
function generateTable(id){
    let str = '<table>'+
    '<tr class="bg-tr"><th>#</th><th>Asset ID</th><th>Room</th><th>Status</th></tr>';
    for(let i=0;i<20;i++){
        str +='<tr>'+
                '<td>'+i+'</td>'+
                '<td>XXX</td>'+
                '<td>XXXX</td>'+
                '<td>XXXXXX</td>'+
            '</tr>';
    }

    str += ' </table>';

    console.log(str);

    document.getElementById(id).innerHTML = str;
}

generateTable('table-view');