<?php

//Testing Function
require "../functions.php";

//Create the instance of the Function Object
$func = new Functions();
$data = json_decode(file_get_contents('php://input') );

$ASSET_NO = strtoupper($data->primary_asset_id);

$response = array();
$count = 0;


if(!empty($ASSET_NO)){

    $sql = "SELECT * FROM AMSD.ASSETS_VW WHERE ASSET_PRIMARY_ID='$ASSET_NO'";

    $assets =$func->executeQuery($sql);

    if($assets){
        $results = json_decode($assets);
        $loc = $results->data[0]->ASSET_CLASS;
        $room = $results->data[0]->ASSET_ROOM_NO;
        $sub = '
        <table id="viewAssetTable1" style="width:100%;border-radius: 5px;">
            <thead>
                <tr>
                    <div class="asset-header text-center">
                        Asset#
                    </div>
                </tr>
            </thead>
            <tbody id="asset-info">
                <tr id="assetLocation">
                    <th class="theading">Location</th>
                    <td>'.$loc.'</td>
                </tr>
                <tr id="assetRoom">
                    <th class="theading">Room </th>
                    <td>'.$room.'</td>
                </tr>
                <tr>
                    <th class="theading">Primary </th>
                    <td><span id="assetBody">'.$ASSET_NO.'</span></td>
                </tr>
            </tbody>
        </table>

        <div class="test-scroll">
        <table id="viewAssetTable2" class="table-bordered table-striped">
            <thead>
                <tr style="" class="bg-dark text-light">
                    <th class="theading-sub">Sub Asset(s)</th>
                    <th class="theading-sub">Description</th>
                </tr>
            </thead>
            <tbody id="asset-info">
                ';

        foreach($results->data as $res){

            // echo $res->ASSET_ID.'<br>';
            
            if($ASSET_NO != $res->ASSET_ID){
            //    TO-Do Limit description length
               $sub .= '<tr>
                            <td>'.$res->ASSET_ID.'</td>
                            <td>'.$res->ASSET_DESCRIPTION.'</td>
                        </tr>
                      ';

                        $count++;
            }
        }

        

        if($count > 0){

            $sub .= ' 
                </tbody>
                </table>   
                </div>
                ';
             array_push($response,array("items"=>$count,"table"=>$sub));
             echo json_encode($response);
        }
        else{
            $sub .= '<tr class="text-center py-4">
                        <td colspan="2"><p class="text-muted py-4">No sub assets found</p></td>
                     </tr>
                    ';
            $sub .= ' 
                </tbody>
                </table>   
                </div>
                ';
            array_push($response,array("items"=>$count,"table"=>$sub));
            echo json_encode($response);
        }

        // echo $sub;
    }
}




?>