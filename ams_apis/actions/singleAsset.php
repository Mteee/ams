<?php

//Testing Function
require "../functions.php";

//Create the instance of the Function Object
$func = new Functions();
$data = json_decode(file_get_contents('php://input') );

$ASSET_NO = $data->primary_asset_id;



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
        <table id="viewAssetTable2" style="width:100%;height:151px;overflow-y:auto;border-radius: 5px;display:block;position:inherit;">
            <tbody id="asset-info" style="display:block;overflow-y:auto;">
              
                ';

        foreach($results->data as $res){

            // echo $res->ASSET_ID.'<br>';

            if($ASSET_NO != $res->ASSET_ID){
               
               $sub .= '<tr style="display: inherit;">
                            <th class="theading" style="display: inline-block;">Sub Item</th>
                            <td style="display: inline-block;">'.$res->ASSET_ID.'</td>
                        </tr>'
                        ;
            }
        }

        $sub .= ' 
                        
                </tbody>
                </table>   
                
                ';

        echo $sub;
    }
}




//Call the function from the function class and pass all the required parameters
// $obj = json_decode($assets,true);



// $rows = $obj['rows'];

// if($rows){
//      echo json_encode($obj);
// }else{
//     echo json_encode(array("rows" => "0","data" =>"none"));
// }


?>