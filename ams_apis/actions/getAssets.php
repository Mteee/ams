<?php

//Testing Function
require "../functions.php";

//Create the instance of the Function Object
$func = new Functions();

$ASSET_ID = 'ZBM1053-0021';
$ASSET_CLASS = 'T';

//sql query
$sql = "SELECT ASSET_ID,ASSET_CLASS,ASSET_ROOM_NO,ASSET_DESCRIPTION,ASSET_TRAN_STATUS FROM AMSD.ASSETS_VW WHERE ASSET_CLASS  LIKE '%$ASSET_CLASS%'";

//Call the function from the function class and pass all the required parameters
$assets =$func->executeQuery($sql);
// $obj = json_decode($assets,true);

if($assets){
    echo $assets;
}

// $rows = $obj['rows'];

// if($rows){
//      echo json_encode($obj);
// }else{
//     echo json_encode(array("rows" => "0","data" =>"none"));
// }


?>