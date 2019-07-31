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
        echo$assets;
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