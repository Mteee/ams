<?php

//Testing Function
require "../functions.php";

//Create the instance of the Function Object
$func = new Functions();

$sql_stmt = "INSERT INTO AMSD.TEST_ASSETS (
    ASSET_CLASS,
    ASSET_ID,
    ASSET_PRIMARY_ID,
    ASSET_DESCRIPTION,
    ASSET_MODEL,
    ASSET_CLASSIFICATION,
    ASSET_ROOM_NO,
    ASSET_LOCATION,
    ASSET_PARENT_LOCATION,
    ASSET_BUILDING,
    ASSET_LEVEL,
    ASSET_AREA,
    ASSET_SERIAL_NO,
    ASSET_PURCHASE_DT,
    ASSET_WARRANTY_DATE,
    ASSET_VENDOR_ID,
    ASSET_VENFOR_NAME,
    ASSET_USEFUL_LIFE,
    ASSET_STATUS,
    ASSET_DISPODAL_DATE,
    ASSET_SERVICE_DATE,
    ASSET_SERVICE_BY,
    ASSET_SERVICE_DUE_DATE,
    ASSET_COMMENTS,
    ASSET_CERTIFICATE_IND,
    ASSET_CERTIFICATE_NO,
    ASSET_ASSIGNED_BY,
    ASSET_ASSIGNED_DATE,
    ASSET_ASSIGNED_TIME
  ) 
  VALUES('FACILITIES MANAGEMENT','SN0017-0125','SN0017-0125','STORAGE RACKS - STEEL','N/A','FURNITURE','1B27-1','DSFM MAINTENANCE STORES','MAIN-L1-Z3','MAIN','1','MAINTENANCE ENGINEERING SERVICES','N/A','',NULL,'UNKNOWN','UNKNOWN',0,'Active',NULL,NULL,'',NULL,'','','','',NULL,'0')";



//Call the function from the function class and pass all the required parameters
$results =$func->executeNonQuery($sql_stmt);

if($results){
    echo "success";
}else{
    
}
