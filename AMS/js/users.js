

var user_class = localStorage.username;

$('#username').text(user_class.toUpperCase());

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
    localStorage.asset_no = ''
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
        localStorage.asset_no = ''
        populate_dropdown();
    }
}



function view_user(username) {
    alert("View user Clicked");
}

function getValues() {
    alert("getUserValues");
}



function extractValues_inElements(a, arr, key) {
    if (key == "serial") {
        console.log("serial");
        console.log(a);
        var stringValue = "";
        for (i = 0; i < a.length; i++) {
            console.log(a.length + " " + i);
            if (i == a.length - 3) {

                stringValue += a[i].value + "|" + a[++i].value + "|" + a[++i].value
            } else {
                stringValue += a[i].value + "|" + a[++i].value + "|" + a[++i].value + "^"
            }

        }
        arr.push(stringValue);
    }
}


var allArr = {
    usersTable: []
};

function add_new_user() {
    localStorage.filter = $("#asset_class option:selected").text();
    document.getElementById('overlay-assets-added').style.display = "block";
}

function closeAsset(id) {
    document.getElementById(id).style.display = "none"
}

addUserClasses();

function addUserClasses(){

    var jsonData = '{"asset_class":"'+localStorage.filter+'","role":"'+localStorage.role+'"}';
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/getClasses",
        type: "POST",
        dataType: 'json',
        data:jsonData,
        success: function (data) {

            var options = "";

            for(var i=0;i<data.rows;i++){
                options += "<option value='"+data.data[i].ASSET_CLASS_NAME+"'>"+data.data[i].ASSET_CLASS_NAME+"</option>";
            }

            document.getElementById('u_class').innerHTML += options;
            console.log("data");
            console.log(data);
            console.log("data");
        },
        error:function(error){
            console.log(error);
        }
    });
}

getUsers(localStorage.filter,localStorage.role);

function getUsers(a,b) {

    var jsonData = '{"asset_class" :"' + a + '","role" :"' + b + '"}';

    console.log(jsonData);

    $.ajax({
        url: "../../ams_apis/slimTest/index.php/getAllUsers_on_class",
        type: "POST",
        dataType: 'json',
        data: jsonData,
        success: function (data) {
            
            if (data.rows > 0) {

                var str = '{"data" : [';

                for (var k = 0; k < data.rows; k++) {
                    console.log(data.data[k].ASSET_USERNAME +"!="+ localStorage.username);
                    if((data.data[k].ASSET_USERNAME).toUpperCase() != (localStorage.username).toUpperCase()){
                        if ((data.rows - 1) == k) {
                            str += '["' + data.data[k].ASSET_USERNAME + '","';
                            str += data.data[k].ASSETS_USER_BADGENO + '","';
                            str += data.data[k].ASSET_USER_CLASS + '","';
                            str += data.data[k].ASSET_USER_CREATED + '","';
                            str += data.data[k].ASSETS_USER_ROLES + '"]';
                        } else {
                            str += '["' + data.data[k].ASSET_USERNAME + '","';
                            str += data.data[k].ASSETS_USER_BADGENO + '","';
                            str += data.data[k].ASSET_USER_CLASS + '","';
                            str += data.data[k].ASSET_USER_CREATED + '","';
                            str += data.data[k].ASSETS_USER_ROLES + '"],';
                        }
                    }
                }

                str += ']}'

                str = replaceAll("\n", "", str);

                console.log(str);

                str = (JSON.parse(str));
                // console.log(str.data);
                $('#users_loader').hide();
                table = createTable("#usersTable", str.data);
                
                // table.clear().draw();
                


            }
            else {
                // current += '<tr id="nodata" class="text-center"><th scope="row" colspan="6"><h1 class="text-muted">No data</h1></th></tr>';
                // $('#searchView').fadeIn(500);
                // console.log(data.data);

                table = createTable("#usersTable", []);

            }

          

        $('#usersTable tbody').on('click', 'button[name="view"]', function () {
            var data = table.row($(this).parents('tr')).data();
            view_user(data[0]);
        });

        $('#usersTable tbody').on('click', 'button[name="edit"]', function () {
            var data = table.row($(this).parents('tr')).data();
            edit_user(data[0]);
        });

        $('#usersTable tbody').on('click', 'button[name="delete"]', function () {
            var data = table.row($(this).parents('tr')).data();
            swal.fire({
                html: "<span style='font-size:13pt importnat;'>Are you sure you want to delete <strong>"+data[0]+"</strong>?</span>",
                type: "question",
                showCancelButton: true,
                confirmButtonColor: "#419641",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                cancelButtonColor: "#C12E2A",
                closeOnConfirm: false,
                closeOnCancel: false,
                showCloseButton: true,
                allowOutsideClick: false,
                customClass: {
                    popup: 'animated tada'
                }
            }).then(function (result) {
                if (result.value) {
                    delete_user(data[0]);
                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
        
                }
            })
        
        });

        },
        error: function (err) {
            console.log(err)
            $('#searchView').fadeIn(500);
            $('#loader').hide();
            alert('Ooops');
        }
    });
}

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
            {
                "targets": -1,
                "data": null,
                "orderable": false,
                "defaultContent": "<button type='button' name='view' class='btn btn-primary'><span class='fa fa-eye'></span></button>"+
                                  " <button type='button' name='edit' class='btn btn-info'><span class='fa fa-edit'></span></button>"+
                                  " <button type='button' name='delete' class='btn btn-danger'><span class='fa fa-trash'></span></button>"
            },
            {
                "className": "dt-center",
                "targets": -2
            },
            {
                "targets": -2,
                "orderable": false
            }
        ],
        fnCreatedRow: function (nTd, nRow, aData, iDataIndex) {

            $(nRow).attr('id', aData[0]);
            // console.log($(nTd).children()[0].children);
        }
    });

    return table;
}

function view_user(username){
    alert('view Clicked'+username);
}

function edit_user(username){
    alert('edit Clicked'+username);
}

function delete_user(username){
    $('#users_loader').slideToggle(500);
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/deleteUser",
        method: "post",
        data: '{"username" : "' + username + '"}',
        dataType: "JSON",
        success: function (data) {
            if(data.rows > 0){
                getUsers(localStorage.filter,localStorage.role)
                swal.fire({
                    title: "Success",
                    text:  data.data,
                    type: "success",
                    showCloseButton: true,
                    confirmButtonColor: "#C12E2A",
                    allowOutsideClick: true,
                });
            }else{
                swal.fire({
                    title: "Error",
                    text: data.data,
                    type: "error",
                    showCloseButton: true,
                    confirmButtonColor: "#C12E2A",
                    allowOutsideClick: true,
                });
            }
            
        },
        error: function (err) {
           alert("err");
           alert(err);
           alert("err");
        }
    });
}

// function viewCommAssets(assets) {
//     var currentItem = "";
//     document.getElementById('overlay-comm').style.display = "block";
//     // console.log($('#assetBody'));
//     document.getElementById('movItemCount').innerHTML = assets.length;


//     console.log(assets);

//     var assets_arr = assets;
//     var send_assets = "";
//     for (var i = 0; i < assets_arr.length; i++) {
//         if (i == assets_arr.length - 1) {
//             send_assets += "\'" + assets_arr[i] + "\'";
//         } else {
//             send_assets += "\'" + assets_arr[i] + "\',";
//         }

//     }

//     console.log(send_assets);
//     var cert_no = { data: "" };

//     $.ajax({
//         // url: "assets.json",
//         url: "../../ams_apis/slimTest/index.php/generate_Cert_no",
//         method: "post",
//         data: '{"assert_primary_id" : "' + send_assets + '"}',
//         dataType: "json",
//         success: function (data) {
//             console.log(data);
//             $('#loaderComm').hide();
//             if (data.rows > 0) {
//                 document.getElementById("assetTbody").innerHTML = data.data;
//                 cert_no.data = data.certificate_number;
//                 $("#movItemCount").text(data.rows);
//             }
//         },
//         error: function (err) {
//             console.log(err);
//         }
//     });

//     var conc_assets = "";
//     for (var i = 0; i < assets_arr.length; i++) {
//         if (i != assets_arr.length - 1) {
//             conc_assets += assets_arr[i] + "^";
//         } else {
//             conc_assets += assets_arr[i];
//         }

//     }

//     $("#confirmComm").off().on("click", function () {
//         confirmComm(conc_assets, cert_no.data);
//     });
// }

// function confirmComm(assets_ids, certificate_no) {

//     console.log('{"assets" : "' + assets_ids + '","cert" : "' + certificate_no + '"}');


//     $.ajax({
//         // url: "assets.json",
//         url: "../../ams_apis/slimTest/index.php/comm_asset",
//         method: "post",
//         data: '{"username":"' + localStorage.username + '","asset_class":"' + localStorage.filter + '","assets":"' + assets_ids + '","cert":"' + certificate_no + '"}',
//         dataType: "json",
//         success: function (data) {
//             closeAsset('overlay-comm');
//             console.log(data);
//             // $('#commAssets').fadeOut(500);
//             search();
//             $('#commAssets').fadeOut(500);
//             swal.fire({
//                 title: "Success",
//                 text: data.data,
//                 type: 'success',
//                 showCloseButton: true,
//                 closeButtonColor: '#3DB3D7',
//                 allowOutsideClick: true,
//             })
//             $('#loaderComm').hide();
//             if (data.rows > 0) {
//                 document.getElementById("assetTbody").innerHTML = data.data;
//                 cert_no.data = data.certificate_number;
//                 $("movItemCount").text(data.rows);
//             }
//         },
//         error: function (err) {
//             console.log(err);
//         }
//     });

// }


if (localStorage.filter == "ALL EQUIPMENT") {

    $('#class-options').append(new Option("ALL EQUIPMENT", "all_equip"));
    $('#class-options').append(new Option("FACILITIES MANAGEMENT", "fac_equip"));
    $('#class-options').append(new Option("IT EQUIPMENT", "it_equip"));
    $('#class-options').append(new Option("MEDICAL EQUIPMENT", "med_equip"));
    $('#class-options').prop('disabled', false);

    $('#class-options').on('change', function () {
        var filter = $("#class-options option:selected").text();
        localStorage.filter = filter;
        // toogleSub(filter);
        getUsers(localStorage.filter,localStorage.role);
        // clearLocalStorageFilters();
        // populate_dropdown();
        //clear btn text
        // checkFilter("search_addition_building");

    });

} else {
    // toogleSub(localStorage.filter);
    $('#class-options').append(new Option(localStorage.filter, "user_class"));
    $('#class-options').css({ "-moz-appearance": "none" });
    $('#class-options').prop('disabled', 'disabled');
}