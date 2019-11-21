
var user_class = localStorage.username;

$('#username').text(user_class.toUpperCase());

localStorage.searchUsername = "";

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
    localStorage.clear();
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

function desc_role(value) {
    if (value == "ADMIN") {
        return value;
    } else if (value == "null" || value == null || value == undefined) {
        return "<strong>No Permissions</strong>";
    }

    return "Permissions : <strong>" + value.split("|").length + "</strong>";

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

function getValues_onElements(arrElements) {
    var newArr = []
    for (var i = 0; i < arrElements.length; i++) {
        newArr.push(arrElements[i].value);
    }
    return newArr;
}

function sliptWith(arr, separator) {
    var str = ""
    for (var i = 0; i < arr.length; i++) {
        if (arr.length - 1 == i)
            str += arr[i];
        else
            str += arr[i] + separator;
    }
    return str;
}

function closeAsset(id) {
    document.getElementById("add_users").reset();
    document.getElementById(id).style.display = "none";
}

addUserClasses();
function addUserClasses() {

    var jsonData = '{"asset_class":"' + localStorage.filter + '","role":"' + localStorage.role + '"}';
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/getClasses",
        type: "POST",
        dataType: 'json',
        data: jsonData,
        success: function (data) {

            var options = "";

            for (var i = 0; i < data.rows; i++) {
                options += "<option value='" + data.data[i].ASSET_CLASS_NAME + "'>" + data.data[i].ASSET_CLASS_NAME + "</option>";
            }

            document.getElementById('u_class').innerHTML += options;
            console.log("data");
            console.log(data);
            console.log("data");
        },
        error: function (error) {
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'getClasses'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,

            })
        }
    });
}

getUsers(localStorage.filter, localStorage.role, localStorage.username);

populate_dropdown();

function populate_dropdown() {
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/getSearchUser",
        method: "POST",
        dataType: 'json',
        data: '{"username":"'+localStorage.searchUsername+'"}',
        success: function (data) {
            var rows = [];
            for (var k = 0; k < data.rows; k++) {
                rows.push({
                    values: [data.data[k].ASSET_USERNAME],
                    markup: '<input type="button" style="border-bottom:1px solid #ecebeb" class="dropdown-item form-control" type="button" value="' + data.data[k].ASSET_USERNAME + '"/>',
                    active: true
                });
            }

            allArr["search_users_username"] = rows;

            filterItems(rows);
        },
        error: function(data_error){
            console.log(data_error);
        }

    });
}

function getUsers(a, b, c) {

    var jsonData = '{"asset_class" :"' + a + '","role" :"' + b + '","user" :"' + c + '"}';

    console.log(jsonData);

    $.ajax({
        url: "../../ams_apis/slimTest/index.php/getAllUsers_on_class",
        type: "POST",
        dataType: 'json',
        data: jsonData,
        success: function (data) {
            // console.log(data);
            if (data.rows > 0) {

                var str = '{"data" : [';

                for (var k = 0; k < data.rows; k++) {
                    if ((data.rows - 1) == k) {
                        str += '["' + data.data[k].ASSET_USERNAME + '","';
                        str += data.data[k].ASSET_USER_BADGENO + '","';
                        str += data.data[k].ASSET_USER_CLASS + '","';
                        str += data.data[k].ASSET_USER_CREATED + '","';
                        str += desc_role(data.data[k].ASSET_USER_ROLES) + '"]';
                    } else {
                        str += '["' + data.data[k].ASSET_USERNAME + '","';
                        str += data.data[k].ASSET_USER_BADGENO + '","';
                        str += data.data[k].ASSET_USER_CLASS + '","';
                        str += data.data[k].ASSET_USER_CREATED + '","';
                        str += desc_role(data.data[k].ASSET_USER_ROLES) + '"],';
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
                    html: "<span style='font-size:13pt importnat;'>Are you sure you want to delete <strong>" + data[0] + "</strong>?</span>",
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
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'getAllUsers_on_class'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,

            })
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
                "defaultContent": "<button type='button' name='view' class='btn btn-primary'><span class='fa fa-eye'></span></button>" +
                    " <button type='button' name='edit' class='btn btn-info'><span class='fa fa-edit'></span></button>" +
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

var form_ids_fields = [
    "u_username",       // 0
    "u_badge",          // 1
    "u_class",          // 2
    "r_all",            // 3
    "r_view",           // 4
    "r_move",           // 5
    "r_cert",           // 6
    "r_car",            // 7
    "r_ca",             // 8
    "r_cr",             // 9
    "r_al",             // 10
    "r_l",              // 11
    "r_u"               // 12
];

function disableFormFields() {
    for (var i = 0; i < form_ids_fields.length; i++) {
        $('#' + form_ids_fields[i]).prop("disabled", true);
        //    document.getElementById().disabled = true;
    }
}

function enableFormFields() {
    for (var i = 0; i < form_ids_fields.length; i++) {
        $('#' + form_ids_fields[i]).prop("disabled", false);
        //    document.getElementById().disabled = true;
    }
}

function enableCheckboxFields() {
    for (var i = 3; i < form_ids_fields.length; i++) {
        $('#' + form_ids_fields[i]).prop("disabled", false);
        //    document.getElementById().disabled = true;
    }
}

function checkAll() {
    for (var i = 3; i < form_ids_fields.length; i++) {
        $('#' + form_ids_fields[i]).prop("checked", true);
        //    document.getElementById().disabled = true;
    }
}

function check_checkboxes(arr) {

    if (arr != "ADMIN") {
        var arr = arr.split("|");
        console.log(arr);
        for (var i = 0; i < arr.length; i++) {
            $('#' + checkValueWithId(arr[i])).prop('checked', true);
        }
    } else {
        checkAll();
    }

}

function checkValueWithId(value) {
    switch (value) {
        case "V":
            return form_ids_fields[4];
        case "M":
            return form_ids_fields[5];
        case "C":
            return form_ids_fields[6];
        case "CAR":
            return form_ids_fields[7];
        case "CA":
            return form_ids_fields[8];
        case "CR":
            return form_ids_fields[9];
        case "AL":
            return form_ids_fields[10];
        case "L":
            return form_ids_fields[11];
        case "U":
            return form_ids_fields[12];
    }
}

function show_add_new_user() {
    enableFormFields();
    $('#add_user').show();
    $('#update_user').hide();
    document.getElementById('user_name').innerHTML = "<strong>ADD USER</strong>";
    document.getElementById('overlay-assets-added').style.display = "block";
}

function view_user(username) {

    document.getElementById('user_name').innerHTML = "<strong>VIEW USER</strong>";
    $('#add_user').hide();
    $('#update_user').hide();
    $('#overlay-assets-added').show();
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/getAdminUser",
        type: "POST",
        dataType: 'json',
        data: '{"user":"' + username + '"}',
        success: function (data) {
            console.log("data view user");
            console.log(data);
            disableFormFields();
            document.getElementById(form_ids_fields[0]).value = data.data[0].ASSET_USERNAME;
            document.getElementById(form_ids_fields[1]).value = data.data[0].ASSET_USER_BADGENO;
            document.getElementById(form_ids_fields[2]).value = data.data[0].ASSET_USER_CLASS;
            check_checkboxes(data.data[0].ASSET_USER_ROLES);
        },
        error: function (error) {
            console.log(error);
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) code : 'createUser'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,

            })
        }
    });

}


$('#add_user').click(function () {
    $("#add_users").submit(function (e) {
        e.preventDefault();
    });
    var user_details = $(".user-info select option:selected,.user-info input[type='text']");
    var arr_user_details = getValues_onElements(user_details);
    var user_roles = $(".user-info input[type='checkbox']:checked");
    var arr_user_roles = getValues_onElements(user_roles);

    console.log(arr_user_details);
    console.log(arr_user_roles.length);

    if (arr_user_details[0] == "" || arr_user_details[1] == "") {



    } else if (arr_user_roles.length == 0) {
        swal.fire({
            title: "User must have atleast one role",
            type: "error",
            showCloseButton: true,
            confirmButtonColor: "#C12E2A",
            allowOutsideClick: true,
            animation: false,
            customClass: {
                popup: 'animated tada'
            }

        }).then(function (res) {
            if (res.value) {

            } else {
                window.location.reload();
            }
        });



    } else {
        var strRoles = "";
        if (user_roles.length == 10)
            strRoles = "ADMIN";
        else
            strRoles = sliptWith(arr_user_roles, "|");

        var jsonData = '{"u_username":"' + arr_user_details[0] + '","u_badge":"' + arr_user_details[1] + '","u_class":"' + arr_user_details[2] + '","user_added_by":"' + localStorage.username + '","u_roles":"' + strRoles + '"}'

        $.ajax({
            url: "../../ams_apis/slimTest/index.php/createUser",
            type: "POST",
            dataType: 'json',
            data: jsonData,
            success: function (data) {
                console.log(data);
                if (data.rows > 0) {
                    if (data.rows == 2) {
                        swal.fire({
                            title: data.data,
                            type: "error",
                            showCloseButton: true,
                            confirmButtonColor: "#C12E2A",
                            allowOutsideClick: true,
                            animation: false,
                            customClass: {
                                popup: 'animated tada'
                            }

                        });
                    }
                    else {
                        swal.fire({
                            title: data.data,
                            type: "success",
                            showCloseButton: true,
                            confirmButtonColor: "#419641",
                            allowOutsideClick: true,
                            animation: false,
                            customClass: {
                                popup: 'animated tada'
                            }

                        });

                        getUsers(localStorage.filter, localStorage.role, localStorage.username);
                    }
                } else {

                    swal.fire({
                        title: data.data,
                        type: "error",
                        showCloseButton: true,
                        confirmButtonColor: "#C12E2A",
                        allowOutsideClick: true,
                        animation: false,
                        customClass: {
                            popup: 'animated tada'
                        }

                    });
                }
            },
            error: function (error) {
                console.log(error);
                swal.fire({
                    title: "Unexpected Error #42404",
                    text: "An error has occured, please contact admin (amsdev@ialch.co.za) code : 'createUser'",
                    type: "error",
                    showCloseButton: true,
                    confirmButtonColor: "#C12E2A",
                    allowOutsideClick: true,

                })
            }
        });

        closeAsset('overlay-assets-added');

    }

});


function edit_user(username) {
    document.getElementById('user_name').innerHTML = "<strong>UPDATE USER</strong>";
    disableFormFields();

    $('#add_user').hide();
    $('#update_user').show();
    $('#overlay-assets-added').show();
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/getAdminUser",
        type: "POST",
        dataType: 'json',
        data: '{"user":"' + username + '"}',
        success: function (data) {
            console.log("data edit user");
            console.log(data);
            document.getElementById(form_ids_fields[0]).value = data.data[0].ASSET_USERNAME;
            document.getElementById(form_ids_fields[1]).value = data.data[0].ASSET_USER_BADGENO;
            document.getElementById(form_ids_fields[2]).value = data.data[0].ASSET_USER_CLASS;
            check_checkboxes(data.data[0].ASSET_USER_ROLES);
            localStorage.user_role = data.data[0].ASSET_USER_ROLES;
            localStorage.user_username = data.data[0].ASSET_USERNAME;
            enableCheckboxFields();

        },
        error: function (error) {
            console.log(error);
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) code : 'createUser'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,

            })
        }
    });
}

$('#update_user').click(function () {
    // $("#update_user").submit(function (e) {
    //     e.preventDefault();
    // });
    var user_roles = $(".user-info input[type='checkbox']:checked");
    var arr_user_roles = getValues_onElements(user_roles);

    var strRoles = "";
    if (user_roles.length == 10)
        strRoles = "ADMIN";
    else
        strRoles = sliptWith(arr_user_roles, "|");

    console.log("arr_user_roles");
    console.log(arr_user_roles);
    console.log("localStorage.role");
    console.log(localStorage.role);
    console.log("strRoles");
    console.log(strRoles);

    if (strRoles == localStorage.user_role) {
        swal.fire({
            title: "No Changes Made",
            text: "Please make changes before updating",
            type: "error",
            showCloseButton: true,
            confirmButtonColor: "#C12E2A",
            allowOutsideClick: true,
        });
    } else if (user_roles.length == 0) {
        swal.fire({
            title: "No Changes Made",
            text: "You must select atlease one roles",
            type: "error",
            showCloseButton: true,
            confirmButtonColor: "#C12E2A",
            allowOutsideClick: true,
        });
    } else {
        $.ajax({
            url: "../../ams_apis/slimTest/index.php/updateAdminUser",
            type: "POST",
            dataType: 'json',
            data: '{"roles":"' + strRoles + '","username":"' + localStorage.user_username + '"}',
            success: function (data) {
                swal.fire({
                    title: data.data,
                    type: "success",
                    showCloseButton: true,
                    confirmButtonColor: "#419641",
                    allowOutsideClick: true,
                    animation: false,
                    customClass: {
                        popup: 'animated tada'
                    }

                });

                localStorage.user_role = strRoles;
                getUsers(localStorage.filter, localStorage.role, localStorage.username);
                closeAsset('overlay-assets-added');

            },
            error: function (error) {
                console.log(error);
                swal.fire({
                    title: "Unexpected Error #42404",
                    text: "An error has occured, please contact admin (amsdev@ialch.co.za) code : 'updateAdminUser'",
                    type: "error",
                    showCloseButton: true,
                    confirmButtonColor: "#C12E2A",
                    allowOutsideClick: true,

                })
            }
        });
    }
});

function delete_user(username) {
    $('#users_loader').slideToggle(500);
    $.ajax({
        url: "../../ams_apis/slimTest/index.php/deleteUser",
        method: "post",
        data: '{"username" : "' + username + '"}',
        dataType: "JSON",
        success: function (data) {
            if (data.rows > 0) {
                getUsers(localStorage.filter, localStorage.role, localStorage.username);
                swal.fire({
                    title: "Success",
                    text: data.data,
                    type: "success",
                    showCloseButton: true,
                    confirmButtonColor: "#419641",
                    allowOutsideClick: true,
                });
            } else {
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
            swal.fire({
                title: "Unexpected Error #42404",
                text: "An error has occured, please contact admin (amsdev@ialch.co.za) CODE : 'deleteUser'",
                type: "error",
                showCloseButton: true,
                confirmButtonColor: "#C12E2A",
                allowOutsideClick: true,

            })
        }
    });
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
        // toogleSub(filter);
        getUsers(localStorage.filter, localStorage.role, localStorage.username);
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

var clusterize = {
    search_users_username: []
};

var allArr = {
    search_users_username: []
};

function filterItems(rows) {
    clusterize["search_users_username"] = (new Clusterize({
        rows: filterRows(rows),
        scrollId: "scroll_username",
        contentId: "menu_users_username"
    }));

}

var filterRows = function (rows) {
    var results = [];
    for (var i = 0, ii = rows.length; i < ii; i++) {
        if (rows[i].active) results.push(rows[i].markup)
    }

    return results;
}

var onSearch = function (btn_id, searchValue, emptyId) {

    var getId = searchValue;

    var found = false;
    // console.log(localStorage.getItem("rows"));

    // var rows = JSON.parse(localStorage.getItem(searchValue));
    var rows = allArr[searchValue];

    document.getElementById(searchValue).onkeypress = function (e) {

        console.log(e.keyCode);
        if (e.keyCode == 13) {
            e.preventDefault();
            var value = searchValue.value;

            if (value.length) {

                getUsers(localStorage.filter, localStorage.role, localStorage.username);
                setValueBtn(btn_id, value);
                search();

            }
        }
    }

    searchValue = document.getElementById(searchValue);

    for (var i = 0; i < rows.length; i++) {

        var suitable = false;

        // console.log(rows[i].values[0].trim().toString().indexOf(searchValue.value) + 1);

        if (rows[i].values[0].trim().toString().indexOf((searchValue.value).toUpperCase()) + 1) {
            suitable = true;
            found = true;
        }

        rows[i].active = suitable;
    }

    if (searchValue.value.length == 0) {
        // var resObj = checkFilter(getId);
        // populate_dropdown();
        // $('#' + resObj.btnId).text(resObj.btnContent);
    }

    if (found) {
        $(emptyId).css("display", "none");
    } else {
        $(emptyId).css("display", "block");
    }

    // console.log(clusterize[getId]);

    clusterize[getId].update(filterRows(rows));
}

$('#menu_users_username').on('click', '.dropdown-item', function () {
    $('#username_filter').text($(this)[0].value);
    localStorage.searchUsername = $(this)[0].value;
    populate_dropdown();
    $("#username_filter").dropdown('toggle');
    $('#search_users_username').val($(this)[0].value);
});

function clearData(input, btnDafualtId, text) {
    var value = $(input).val();

    if (value.length > 0) {

        if (input == "#search_users_username") {

            document.getElementById('menu_users_username').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            
            localStorage.searchUsername = '';

            populate_dropdown();

            $('#search_users_username').val("");
            $('#username_filter').text("USERNAME");

        }
    }
}

function cleaAllFilters() {
    
    document.getElementById('menu_users_username').innerHTML = ' <div id="locationLoader" class="dropdown-loader"><img src="../img/loading-transparent.gif" alt=""></div>';
            
    localStorage.searchUsername = '';

    populate_dropdown();

    $('#search_users_username').val("");
    $('#username_filter').text("USERNAME");
}

function search(){
    var username = document.getElementById("search_users_username").value;

    if(username.length == 0){
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
    }
    else{
        $('#usersTable').DataTable().clear().destroy();
        $('#users_loader').show();

        $.ajax({
            url: "../../ams_apis/slimTest/index.php/getSearchUser",
            method: "POST",
            dataType: 'json',
            data: '{"username":"'+localStorage.searchUsername+'"}',
            success: function (data) {
                $('#users_loader').hide();
                if (data.rows > 0) {

                    var str = '{"data" : [';
    
                    for (var k = 0; k < data.rows; k++) {
                        if ((data.rows - 1) == k) {
                            str += '["' + data.data[k].ASSET_USERNAME + '","';
                            str += data.data[k].ASSET_USER_BADGENO + '","';
                            str += data.data[k].ASSET_USER_CLASS + '","';
                            str += data.data[k].ASSET_USER_CREATED + '","';
                            str += desc_role(data.data[k].ASSET_USER_ROLES) + '"]';
                        } else {
                            str += '["' + data.data[k].ASSET_USERNAME + '","';
                            str += data.data[k].ASSET_USER_BADGENO + '","';
                            str += data.data[k].ASSET_USER_CLASS + '","';
                            str += data.data[k].ASSET_USER_CREATED + '","';
                            str += desc_role(data.data[k].ASSET_USER_ROLES) + '"],';
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
                        html: "<span style='font-size:13pt importnat;'>Are you sure you want to delete <strong>" + data[0] + "</strong>?</span>",
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
            error: function(data_error){
                console.log(data_error);
            }
    
        });
    }
}