<?php

//Testing Function
require "../functions.php";

//Create the instance of the Function Object
$func = new Functions();
$data = json_decode(file_get_contents('php://input') );

$ASSET_NO = strtoupper($data->v_assetNo);
$ASSET_ROOM = strtoupper($data->v_room);
$ASSET_LOCATION = strtoupper($data->v_location);
$ASSET_DESCRIPTION = strtoupper($data->v_description);
$response = array();


if(!empty($ASSET_NO) || !empty($ASSET_ROOM) || !empty($ASSET_LOCATION) || !empty($ASSET_DESCRIPTION)){

    $sql = "SELECT ASSET_ID,ASSET_CLASS,ASSET_LOCATION_AREA,ASSET_ROOM_NO,ASSET_DESCRIPTION,ASSET_TRANSACTION_STATUS FROM AMSD.ASSETS_VW WHERE ASSET_PRIMARY_ID LIKE '%$ASSET_NO%' AND ASSET_ROOM_NO LIKE '%$ASSET_ROOM%' AND ASSET_LOCATION_AREA LIKE '%$ASSET_LOCATION%' AND ASSET_DESCRIPTION LIKE '%$ASSET_DESCRIPTION%' AND ASSET_ID=ASSET_PRIMARY_ID";

    $assets =$func->executeQuery($sql);

    if($assets){
        echo $assets;
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>"No data"));

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