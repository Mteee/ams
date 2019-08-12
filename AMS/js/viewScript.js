
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
    var assetNo = document.getElementById('searchasset').value,
        room = document.getElementById('searchroomno').value,
        location = document.getElementById('searchlocation').value,
        description = document.getElementById('description').value;

    var results = (assetNo + " - " + room + " - " + location + " - " + description);
    var current = "";
    console.log(results);
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
            data: '{"v_assetNo" :"' + assetNo + '","v_room" : "' + room + '","v_location" : "' + location + '","v_description" : "' + description + '","asset_class":"' + localStorage.filter + '"}',
            success: function (data) {
                // console.log(data);
                var table = null;

                console.log(data);

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

                    str = replaceAll("\r\n", "", str);

                    str = (JSON.parse(str));
                    console.log(str.data);

                    table = createTable("#currentAssetsTable", str.data);



                    // table.clear().draw();


                }
                else {
                    // current += '<tr id="nodata" class="text-center"><th scope="row" colspan="6"><h1 class="text-muted">No data</h1></th></tr>';
                    $('#searchView').fadeIn(500);
                    console.log(data.data);

                    table = createTable("#currentAssetsTable", data.data);

                }

                $('#currentAssetsTable tbody').on('click', 'input[type="checkbox"]', function () {
                    var data = table.row($(this).parents('tr')).data();
                    if (checkboxSelectedLength() > 0) {
                        $('#printAssetsView').fadeIn(500);
                    } else {
                        $('#printAssetsView').fadeOut(500);
                    }

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

                    var data = table.row($(this).parents('tr')).data();
                    if (data == null || data == undefined) {
                        data = (localStorage.tableDataSet).split(',');
                    } else {
                        localStorage.tableDataSet = data;
                    }
                    viewAsset(data[0]);
                });
                $('#loader').hide();
                // $('#printAssetsView').fadeIn(500);

            },
            error: function (err) {
                console.log(err)
                $('#searchView').fadeIn(500);
                $('#loader').hide();
                alert('Ooops');
            }
        });


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

function createTable(tableID, tableData) {
    var table = $(tableID).DataTable({
        "paging" : true,
        "processing": true,
        "searching": false,
        "ordering": false,
        "serverSide": true,
        ajax: function ( data, callback, settings ) {
             var out = [];
            console.log("=======================");
            console.log(data);
            console.log("=======================");
            for ( var i=data.start, ien=data.start+data.length ; i<ien ; i++ ) {
                if(tableData[i] == undefined){
                    break;
                }else{
                    out.push(tableData[i]);
                }
                
            }

            console.log("=========out=========");
            console.log(out);
            console.log("========out==========");
            setTimeout( function () {
                callback( {
                    draw: data.draw,
                    data: out,
                    recordsTotal: tableData.length,
                    recordsFiltered: tableData.length
                } );
            }, 50 );
        },
        // scroller: {
        //     loadingIndicator: true
        // },
        "destroy": true,
        "columnDefs": [{
            "targets": 0,
            "data": null,
            "orderable": false,
            "defaultContent": "<input class='checkitem' type='checkbox'/>"
        },
        {
            "targets": -1,
            "data": null,
            "orderable": false,
            "defaultContent": "<button type='button' class='btn btn-primary'><span class='fa fa-eye'></span></button>"
        },
        {
            "className": "dt-center",
            "targets": [-2, 0]
        },
        {
            "targets": -2,
            "orderable": false
        }
        ]
    });

    return table;
}





function printView() {

    var id = $('.checkitem:checked').map(function () {
        return $(this).val();
    }).get().join(' ');

    console.log(id);
}


function checkboxSelectedLength() {
    var lengthh = $(":checkbox:checked").length;
    return lengthh;
}

//updating y to icons
function updateLetterToIcon(letter) {


    var results = "";

    switch (letter) {
        case "y":
            results = "<p class='text-success'><strong>YES</strong></p>";
            break;
        case "n":
            results = "<p class='text-danger'><strong>NO</strong></p>";
            break;
    }

    return results;
}//close updateLetterToIcon function



/*-----------------------------------------------------*/
/*--------------   Plugin Dropdown Search -------------*/
/*-----------------------------------------------------*/

// let names = ["BTC", "XRP", "ETH", "BCH", "ADA", "XEM", "LTC", "XLM", "TRX", "MIOTA", "DASH", "EOS", "XMR", "NEO", "QTUM", "BTG", "ETC", "ICX", "LSK", "XRB", "OMG", "SC", "BCN", "ZEC", "XVG", "BCC", "DCN", "BTS", "PPT", "DOGE", "BNB", "KCS", "STRAT", "ARDR", "SNT", "STEEM", "USDT", "WAVES", "VEN", "DGB", "KMD", "DRGN", "HSR", "KIN", "ETN", "GNT", "REP", "VERI", "ETHOS", "RDD", "ARK", "XP", "FUN", "KNC", "BAT", "DCR", "SALT", "DENT", "ZRX", "PIVX", "QASH", "NXS", "ELF", "AE", "FCT", "POWR", "REQ", "AION", "SUB", "BTM", "WAX", "XDN", "NXT", "QSP", "MAID", "RHOC"];


// let asset_no = document.getElementById("asseetsno");
// let room_no = document.getElementById("roomno");
// let loc = document.getElementById("location");

// let items = document.getElementsByClassName("dropdown-item");

// function buildDropDown(viewId, values, isEmpty) {
//     // let contents = []
//     // console.log(values.data);
//     var clusterize = new Clusterize({
//         rows: values,
//         scrollId: 'scrollArea',
//         contentId: 'menuAssets'
//     });
//     // for (var i=0;i<(values.length);i++) {
//     // contents.push('<input type="button" class="dropdown-item form-control" type="button" value="' + values[i] + '"/>')

//     // }
//     // $(viewId).append(contents.join(""))
//     // document.getElementById(viewId).innerHTML = values;
//     console.log(values)

//     //Hide the row that shows no items were found
//     $(isEmpty).hide()

// }


//Capture the event when user types into the search box
// window.addEventListener('#asseetsno', function () {
//     console.log('here');
//     filter(asset_no.value.trim().toLowerCase(), '#emptyAsset')
// })
// window.addEventListener('#roomno', function () {
//     filter(room_no.value.trim().toLowerCase(), '#emptyRoom')
// })
// window.addEventListener('#location', function () {
//     filter(loc.value.trim().toLowerCase(), '#emptyAsset')
// })

// function filterAssets(id,empytyId){
//     var element = document.getElementById(id.replace('#',''));
//     console.log(element.value)
//     filter(element.value.trim().toLowerCase(), empytyId)
// }

//For every word entered by the user, check if the symbol starts with that word
//If it does show the symbol, else hide it
// function filter(word, myId) {
//     let length = items.length
//     console.log(items);
//     let collection = []
//     let hidden = 0
//     for (let i = 0; i < length; i++) {
//         if (items[i].value.toLowerCase().startsWith(word)) {
//             $(items[i]).show()
//         }
//         else {
//             $(items[i]).hide()
//             hidden++
//         }
//     }

//     //If all items are hidden, show the empty view
//     if (hidden === length) {
//         $(myId).show()
//     }
//     else {
//         $(myId).hide()
//     }

// }



//If the user clicks on any item, set the title of the button as the text of the item
$('#menuAssets').on('click', '.dropdown-item', function () {
    $('#dropdown_assets').text($(this)[0].value)
    $("#dropdown_assets").dropdown('toggle');
    $('#searchasset').val($(this)[0].value);
})
$('#menuRoom').on('click', '.dropdown-item', function () {
    $('#dropdown_room').text($(this)[0].value)
    $("#dropdown_room").dropdown('toggle');
    $('#searchroomno').val($(this)[0].value);
})
$('#menuLocation').on('click', '.dropdown-item', function () {
    $('#dropdown_location').text($(this)[0].value)
    $("#dropdown_location").dropdown('toggle');
    $('#searchlocation').val($(this)[0].value);
})



    // get assets
     getItems('../../ams_apis/slimTest/index.php/asset_no','searchasset','scrollAssets','menuAssets','#emptyAsset');
    // get room_no
     getItems('../../ams_apis/slimTest/index.php/room_no','searchroomno','scrollRoom','menuRoom','emptyRoom');
    // get location
     getItems('../../ams_apis/slimTest/index.php/location','searchlocation','scrollLocation','menuLocation','emptyLocation');
    


function getItems(url,id,scrollArea,menuid,emptyId){
    $.ajax({
        url: url,
        method: 'POST',
        dataType: 'JSON',
        data: '{"asset_class":"' + localStorage.filter + '"}',
        success: function (data) {
            console.log(data);
            var rows = [];
            var searchValue = document.getElementById(id);
            for (var i = 0; i < data.rows; i++) {
                rows.push({
                    values: [data.data[i]],
                    markup: '<input type="button" style="border-bottom:1px solid #ecebeb" class="dropdown-item form-control" type="button" value="' + data.data[i] + '"/>',
                    active: true
                });
            }
    
            filterItems(rows,scrollArea,menuid,emptyId,searchValue);
            // // console.log(data.data);
            // // buildDropDown('menuAssets', data.data, '#emptyAssets');
            // // let contents = []
            // // for(var i=0;i<data.rows;i++){
    
            // //     contents.push('<input type="button" class="dropdown-item form-control" type="button" value="' + data.data[i] + '"/>')
    
            // //     $('#menuAssets').append(contents.join(""))
    
            // //     //Hide the row that shows no items were found
            // //     $('#emptyAssets').hide()
            // // }
            // console.log('done');
            // // buildDropDown('#menuAssets',data.data);
            
        },
        error: function (data_err) {
            console.log(data_err);
            console.log(localStorage.filter);
        }
    })
}



<<<<<<< HEAD

var clusterize = [];
var count = 0;
       
        

        function filterItems(rows,scrollArea,menuid ,emptyId,searchValue){
            var filterRows = function (rows) {
                var results = [];
                for (var i = 0, ii = rows.length; i < ii; i++) {
                    if (rows[i].active) results.push(rows[i].markup)
                }
                
                return results;
            }

        var found = false;
        console.log(searchasset.value.length);
=======
>>>>>>> parent of b623d5b... Merge pull request #91 from Mteee/talent-branch

       
        

<<<<<<< HEAD
        for (var i = 0; i < rows.length; i++) {

=======
        function filterItems(rows,scrollArea,menuid ,emptyId){
            var filterRows = function (rows) {
                var results = [];
                for (var i = 0, ii = rows.length; i < ii; i++) {
                    if (rows[i].active) results.push(rows[i].markup)
                }
                
                return results;
            }
>>>>>>> parent of b623d5b... Merge pull request #91 from Mteee/talent-branch
            
            
<<<<<<< HEAD

            clusterize.push(new Clusterize({
                rows: filterRows(rows),
                scrollId: scrollArea,
                contentId: menuid
            }));
            
            var onSearch = function (element) {
                // console.log(rows);
                // console.log(searchasset.value);
                console.log("element");
                console.log(element);
                console.log("element");
=======
            var clusterize = new Clusterize({
                rows: filterRows(rows),
                scrollId: scrollArea,
                contentId: menuid
            });
            
            var onSearch = function () {
                // console.log(rows);
                // console.log(searchasset.value);

>>>>>>> parent of b623d5b... Merge pull request #91 from Mteee/talent-branch
                var found = false;

                for (var i = 0; i < rows.length; i++) {
                    
                    var suitable = false;
                    
                    // console.log(rows[i].values[0].toString().indexOf(searchasset.value) + 1);
<<<<<<< HEAD
                        if (rows[i].values[0].toString().indexOf(searchValue.value) + 1){
                            suitable = true;
                            found = true;
                        }

                    rows[i].active = suitable;
                }
                console.log(found);
                console.log(emptyId);
                if(found){
                    $(emptyId).css("display","none");
                }else{
                    $(emptyId).css("display","block");
                }

                console.log(clusterize);

                    clusterize[count].update(filterRows(rows));
                    count++;
               

            // console.log(rows[i].values[0].toString().indexOf(searchasset.value) + 1);
                if (rows[i].values[0].toString().indexOf(searchasset.value) + 1){
                    suitable = true;
                    found = true;
                }

            rows[i].active = suitable;
        }

        console.log(found);
        console.log(emptyId);
        if(found){
            $(emptyId).css("display","none");
        }else{
            $(emptyId).css("display","block");
        }
        clusterize.update(filterRows(rows));
    }
    
    searchasset.onkeyup = onSearch;
}



// ====================================================================ASSETS NO FILITER==================================================================

    $.ajax({
        url: '../../ams_apis/slimTest/index.php/asset_no',
        method: 'POST',
        dataType: 'JSON',
        data: '{"asset_class":"' + localStorage.filter + '"}',
        success: function (data) {
            console.log(data);
            var rows = [];
            var searchasset = document.getElementById('searchasset');
            for (var i = 0; i < data.rows; i++) {
                rows.push({
                    values: [data.data[i]],
                    markup: '<input type="button" style="border-bottom:1px solid #ecebeb" class="dropdown-item form-control" type="button" value="' + data.data[i] + '"/>',
                    active: true
                });

=======
                        if (rows[i].values[0].toString().indexOf(searchasset.value) + 1){
                            suitable = true;
                            found = true;
                        }

                    rows[i].active = suitable;
                }
                console.log(found);
                console.log(emptyId);
                if(found){
                    $(emptyId).css("display","none");
                }else{
                    $(emptyId).css("display","block");
                }
                clusterize.update(filterRows(rows));
>>>>>>> parent of b623d5b... Merge pull request #91 from Mteee/talent-branch
            }
            
<<<<<<< HEAD

            searchValue.onkeyup = onSearch(this);

        },
        error: function (data_err) {
            console.log(data_err);
            console.log(localStorage.filter);

=======
            searchasset.onkeyup = onSearch;
>>>>>>> parent of b623d5b... Merge pull request #91 from Mteee/talent-branch
        }




// buildDropDown('#menuRoom',names);
// buildDropDown('#menuLocation',names);

function replaceAll(find, replace, str) {
    while (str.indexOf(find) > -1) {
        str = str.replace(find, replace);
    }
    return str;
}