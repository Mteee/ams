<?php

//Testing Function
require "../functions.php";

//Create the instance of the Function Object
$func = new Functions();


//Call the function from the function class and pass all the required parameters
$assets =$func->getAssets();
$obj = json_decode($assets,true);

$rows = $obj['rows'];

if($rows > 0){
     echo json_encode($obj);
}else{
    echo json_encode(array("rows" => "0","data" =>"none"));
}


?>