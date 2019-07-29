/*!
 * AME SYSADMIN Library JS
 * website
 * Copyright AME SOFTWARE DEVELOPMENT TEAM (Talent & Melusi)
 * Released under the AME license
 * Date: 2019-07-29
 */
       
       var filtersConfig = {
                base_path: 'js/',
                auto_filter: {
                    delay: 0 //milliseconds
                },
                filters_row_index: 1,
                state: true,
                alternate_rows: true,
                rows_counter: true,
                btn_reset: true,
                status_bar: true,
                msg_filter: 'Filtering...'
            };

      

        var current = "", inn = "", out = "";
        // console.log("data");
        document.getElementById('currentItems').innerHTML = "100";
        $.ajax({
            url: "data/ASSETS.json",
            method:"POST", 
            success : function(data){
                console.log(data);
                if(data.rows > 0){
                    for (var i = 0; i < data.rows ; i++) {
                        current += '<tr id="c_row' + data.data[i].ASSET_ID + '"><th scope="row"><input id="check' + data.data[i].ASSET_ID + '" class="currentItems" type="checkbox" value="' + data.data[i].ASSET_ID + '" onclick="getNumberOfSelectedItems(currentSelectedItems,`#current .currentItems:checked`)"></th><td>' + data.data[i].ASSET_ID + '</td><td>' + data.data[i].ASSET_LOCATION + '</td><td>' + data.data[i].ASSET_DESCRIPTION + '</td><td class="text-center"><span class="fa fa-eye item-view" onclick="viewAsset(`' + data.data[i].ASSET_ID + '`)""></span></td></tr>';
                    }
                }else{
                    current += '<tr id="nodata"><th scope="row" colspan="5"></th></tr>';
                }//close if
                document.getElementById('currentItems').innerHTML = data.rows;
                document.getElementById('current').innerHTML = current;
            },//close success function
            error:function(err){
                console.log(err);
            }//close error function
        });//close ajax function
        // console.log("out");
        // for(var i=1;i<100;i++){
        //     current += '<tr id="c_row' + i + '><th scope="row"><input id="check' + i + '" class="currentItems" type="checkbox" value="' + i+ '" onclick="getNumberOfSelectedItems(currentSelectedItems,`#current .currentItems:checked`)"></th><td>Larry</td><td>the Bird</td><td>@twitter</td></td><td class="text-center"><span class="fa fa-eye item-view" onclick="viewAsset(`' + i + '`)""></span></td></tr>';
        // }
        
        // for(var i=1;i<100;i++){
        //     inn += '<tr><th scope="row">'+i+'</th><td>Larry</td><td>the Bird</td><td>@twitter</td><td><span class="fa fa-eye item-view"></span></td></tr>';
        // }

        // for(var i=1;i<100;i++){
        //     out += '<tr><th scope="row">'+i+'</th><td>Larry</td><td>the Bird</td><td>@twitter</td><td><span class="fa fa-eye     item-view"></span></td></tr>';
        // }

        inn = '<tr><th colspan="5" class="text-center">No data</th></tr>';
        out = '<tr><th colspan="5" class="text-center">No data</th></tr>';

        var countCurrentSelected = 0;

        $('#transfer').click(function () {
            var itemsCount = getSelected('#current .currentItems:checked').length;

            var itemsSelected = getSelected('#current .currentItems:checked').split("|");
            console.log("item " + itemsSelected[0]);
            if (itemsCount != 0) {

                if (out == '<tr><th colspan="5" class="text-center">No data</th></tr>') {
                    out = "";
                }

                for (var i = 0; i < itemsSelected.length; i++) {
                    console.log("#c_row" + itemsSelected[i]);
                    $("#c_row" + itemsSelected[i]).css({
                        'background-color': '#948d8d7d',
                        'pointer-events': 'none',
                        'cursor': 'not-allowed',
                        'color': '#4e4d4d',
                        'transition': '500ms'
                    });

                    $("#c_row" + itemsSelected[i]).attr({ 'disabled': true });
                    $("#current #check" + itemsSelected[i]).css({ 'display': 'none', 'transition': '500ms' });
                    console.log(document.getElementById("c_row" + itemsSelected[i]));
                    $("#current #check" + itemsSelected[i]).prop({ 'checked': false });

                    out += "<tr id='o_row" + itemsSelected[i] + "'>" + document.getElementById("c_row" + itemsSelected[i]).innerHTML + "</tr>";
                }
                out = replaceAll(out, "display: none", "display: block");
                out = replaceAll(out, 'onclick="getNumberOfSelectedItems(currentSelectedItems,`#current .currentItems:checked`)"', 'onclick="getNumberOfSelectedItems(outSelectedItems,`#out .currentItems:checked`)"')
                document.getElementById('out').innerHTML = out;
                document.getElementById('currentSelectedItems').innerHTML = 0;
                var tot = parseInt(document.getElementById('outTotalItems').innerHTML) + itemsSelected.length;
                document.getElementById('outTotalItems').innerHTML = tot;
            } else {
                alert("Selected Assets");
            }
        });

        $('#cancel').click(function () {

            var itemsCount = getSelected('#out .currentItems:checked').length;

            var itemsSelected = getSelected('#out .currentItems:checked').split("|");

            if (itemsCount != 0) {

                var results = confirm("Are you sure you want to cancle the selected asset tranfer?");
                if (results) {
                    out = document.getElementById('out').innerHTML;
                    console.log(out);
                    var selectedOut = "";

                    for (var i = 0; i < itemsSelected.length; i++) {
                        console.log("#c_row" + itemsSelected[i]);
                        $("#c_row" + itemsSelected[i]).css({
                            'background-color': 'green',
                            'pointer-events': 'auto',
                            'cursor': 'pointer',
                            'color': 'black'
                        });


                        setTimeout(function () {
                            for (var i = 0; i < itemsSelected.length; i++) {
                                $("#c_row" + itemsSelected[i]).css({ 'background-color': 'white', 'transition': '500ms' });
                            }
                        }, 1000);

                        $("#c_row" + itemsSelected[i]).attr({ 'disabled': false });
                        $("#o_row" + itemsSelected[i]).css({ 'display': 'none', 'transition': '500ms' });
                        $("#current #check" + itemsSelected[i]).css({ 'display': 'block', 'transition': '500ms' });
                        $("#current #check" + itemsSelected[i]).prop({ 'checked': false });

                        selectedOut = "<tr id=\"o_row" + itemsSelected[i] + "\">" + document.getElementById("o_row" + itemsSelected[i]).innerHTML + "</tr>";
                        console.log(selectedOut);
                        console.log(out);
                        out = replaceAll(out, selectedOut, "");

                    }
                    out = replaceAll(out, "display: none", "display: block");

                    document.getElementById('out').innerHTML = out;
                    document.getElementById('outSelectedItems').innerHTML = 0;
                    var tot = parseInt(document.getElementById('outTotalItems').innerHTML) - itemsSelected.length;
                    document.getElementById('outTotalItems').innerHTML = tot;
                    if (tot == 0) {
                        out = '<tr><th colspan="5" class="text-center">No data</th></tr>';
                        document.getElementById('out').innerHTML = out
                    }

                }

            } else {
                alert("Selected Assets");
            }
        });

        function replaceAll(str, valuetoReplace, valuetoReplaceWith) {
            while (str.indexOf(valuetoReplace) > -1) {
                str = str.replace(valuetoReplace, valuetoReplaceWith);
            }

            return str;
        }

        function getNumberOfSelectedItems(numberDisplay, checkbox) {

            if (getSelected(checkbox) != "") {
                countItems = getSelected(checkbox).split("|");
            } else {
                countItems = [];
            }
            numberDisplay.innerHTML = countItems.length;

        }

        function getSelected(checkbox) {
            var id = $(checkbox).map(function () {
                return $(this).val();
            }).get().join('|');

            return id;

        }

        // $('.currentItems:checked').change(function () {
        //     console.log(1);
        // });

        // document.getElementById('current').innerHTML = current;
        document.getElementById('inn').innerHTML = inn;
        document.getElementById('out').innerHTML = out;

        function closeAsset() {
            document.getElementById('overlay-asset').style.display = "none"
        }

        function viewAsset(assetId) {
            document.getElementById('overlay-asset').style.display = "block";
            console.log($('#assetBody'));
            $('#assetBody')['0'].innerHTML = assetId;
        }

        /*-------   Zoom handler -------*/
        var width = screen.width;
        var height = screen.height;
        if( (width > 700) && (height < 700) || (width < 1400) && (height < 900)){
            toggleZoomScreen("80%");
        }else{
            toggleZoomScreen("100%");
        }
        function toggleZoomScreen(value) {
            document.body.style.zoom= value;
        } 
        /*------   Zoom handler -----*/

        var tf = new TableFilter('currentAssetsTable', filtersConfig);
        tf.init();