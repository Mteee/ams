<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require './vendor/autoload.php';
require './inc/functions.php';


$app = new \Slim\App;
$func = new Functions();


$app->map(['GET','POST'],'/getAssets', function (Request $request, Response $response){

    global $func;
    $data = json_decode(file_get_contents('php://input') );
    $ASSET_NO = strtoupper($data->v_assetNo);
    $ASSET_ROOM = strtoupper($data->v_room);
    $ASSET_LOCATION = strtoupper($data->v_location);
    $ASSET_DESCRIPTION = strtoupper($data->v_description);
    $ASSET_CLASS = strtoupper($data->asset_class);
    $response = array();

    if(!empty($ASSET_NO) || !empty($ASSET_ROOM) || !empty($ASSET_LOCATION) || !empty($ASSET_DESCRIPTION) || !empty($ASSET_CLASS)){

        if($ASSET_CLASS == 'ALL EQUIPMENT'){
            $ASSET_CLASS = '';
        }
        $sql = "SELECT ASSET_ID,ASSET_ROOM_NO,ASSET_LOCATION_AREA,ASSET_DESCRIPTION,ASSET_IS_SUB 
                FROM AMSD.ASSETS_VW 
                WHERE ASSET_PRIMARY_ID LIKE '%$ASSET_NO%' 
                AND ASSET_ROOM_NO LIKE '%$ASSET_ROOM%' 
                AND ASSET_LOCATION_AREA LIKE '%$ASSET_LOCATION%' 
                AND ASSET_DESCRIPTION LIKE '%$ASSET_DESCRIPTION%' 
                AND ASSET_CLASS LIKE '%$ASSET_CLASS%' 
                AND ASSET_ID=ASSET_PRIMARY_ID";
        // $sql = "SELECT * FROM AMSD.ASSETS_VW";

        $assets =$func->executeQuery($sql);

        if($assets){
            echo $assets;
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>[]));

        }
    }

});

$app->map(['GET','POST'],'/singleAssetInfo_asset_no',function(Request $request, Response $response){

    $data = json_decode(file_get_contents('php://input') );

    $ASSET_NO = strtoupper($data->value);

    $response = array();
    global $func;

    if(!empty($ASSET_NO)){

        $sql = "SELECT ASSET_ID,ASSET_ROOM_NO,ASSET_LOCATION_AREA FROM AMSD.ASSETS_VW WHERE ASSET_PRIMARY_ID='$ASSET_NO' AND ASSET_ID = ASSET_PRIMARY_ID";

        $assets =$func->executeQuery($sql);

        if($assets){
            echo $assets;
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"No data"));
    
        }
    }

});

// $app->map(['GET','POST'],'/singleAssetInfo_room_no',function(Request $request, Response $response){

//     $data = json_decode(file_get_contents('php://input') );

//     $ASSET_NO = strtoupper($data->value);

//     $response = array();
//     global $func;

//     if(!empty($ASSET_NO)){

//         $sql = "SELECT ASSET_ID,ASSET_ROOM_NO,ASSET_LOCATION_AREA FROM AMSD.ASSETS_VW WHERE ASSET_PRIMARY_ID='$ASSET_NO' AND ASSET_ID = ASSET_PRIMARY_ID";

//         $assets =$func->executeQuery($sql);

//         if($assets){
//             echo $assets;
//         }
//         else{
//             echo json_encode(array("rows" => 0 ,"data" =>"No data"));
    
//         }
//     }

// });

// $app->map(['GET','POST'],'/singleAssetInfo_location',function(Request $request, Response $response){

//     $data = json_decode(file_get_contents('php://input') );

//     $ASSET_NO = strtoupper($data->value);

//     $response = array();
//     global $func;

//     if(!empty($ASSET_NO)){

//         $sql = "SELECT ASSET_ID,ASSET_ROOM_NO,ASSET_LOCATION_AREA FROM AMSD.ASSETS_VW WHERE ASSET_PRIMARY_ID='$ASSET_NO' AND ASSET_ID = ASSET_PRIMARY_ID";

//         $assets =$func->executeQuery($sql);

//         if($assets){
//             echo $assets;
//         }
//         else{
//             echo json_encode(array("rows" => 0 ,"data" =>"No data"));
    
//         }
//     }

// });

$app->map(['GET','POST'],'/singleAsset',function(Request $request, Response $response){

    $data = json_decode(file_get_contents('php://input') );

    $ASSET_NO = strtoupper($data->primary_asset_id);

    $response = array();
    $count = 0;
    global $func;



    if(!empty($ASSET_NO)){

        $sql = "SELECT * FROM AMSD.ASSETS_VW WHERE ASSET_PRIMARY_ID='$ASSET_NO'";

        $assets =$func->executeQuery($sql);

        if($assets){
            $results = json_decode($assets);
            $loc = $results->data[0]->ASSET_LOCATION_AREA;
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
                    <tr style="" class="text-light">
                        <th class="theading-sub bg-dark">Sub Asset(s)</th>
                        <th class="theading-sub bg-dark">Description</th>
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

});

$app->map(['GET','POST'],'/login',function(Request $request, Response $response){
    
    global $func;
    $data = json_decode(file_get_contents('php://input') );
    $response = array();
    $username = strtoupper($data->username);
   if($username != null && $username != ''){

        $sql_query = "SELECT ASSET_USER_CLASS FROM AMSD.ASSETS_USER WHERE ASSET_USERNAME='$username'";
        
        $results =$func->executeQuery($sql_query);

        if($results){
            $decoded_res = json_decode($results);
            $filter = $decoded_res->data[0]->ASSET_USER_CLASS;

            array_push($response,array("filter"=>$filter));
            return json_encode($response);
        }
        else{
            $filter = "All EQUIPMENT";
            array_push($response,array("filter"=>$filter));
            return json_encode($response);
        }

    }
    else{
        $filter = "Error";
        array_push($response,array("filter"=>$filter));
        return json_encode($response);
    }


});

$app->map(['GET','POST'],'/asset_no',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
     $ASSET_CLASS = $func->checkValue(strtoupper($data->asset_class));
    $ASSET_LOCATION = $func->checkValue(strtoupper($data->asset_location));
    $ASSET_ROOM_NO = $func->checkValue(strtoupper($data->asset_room));
    $ASSET_ID = $func->checkValue(strtoupper($data->asset_id));
    if($ASSET_CLASS == 'ALL EQUIPMENT'){
        $ASSET_CLASS = '';
    }

    $sql = "SELECT ASSET_ID FROM AMSD.ASSETS_VW WHERE ASSET_CLASS LIKE '%$ASSET_CLASS%' AND ASSET_ID LIKE '%$ASSET_ID%' AND ASSET_ROOM_NO LIKE '%$ASSET_ROOM_NO%' AND ASSET_LOCATION_AREA LIKE '%$ASSET_LOCATION%' AND ASSET_ID=ASSET_PRIMARY_ID ORDER BY ASSET_ID ASC";
    // $sql = "SELECT * FROM AMSD.ASSETS_VW";

    $assets_no =$func->executeQuery($sql);
    $response = array();
    $items = '';

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->ASSET_ID;
            // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
            // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

        }

        // echo $items;
         echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        // echo json_encode(array("rows" => 0 ,"data" =>""));

    }

});

$app->map(['GET','POST'],'/room_no',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $ASSET_CLASS = $func->checkValue(strtoupper($data->asset_class));
    $ASSET_LOCATION = $func->checkValue(strtoupper($data->asset_location));
    $ASSET_ROOM_NO = $func->checkValue(strtoupper($data->asset_room));
    $ASSET_ID = $func->checkValue(strtoupper($data->asset_id));


    if($ASSET_CLASS == 'ALL EQUIPMENT' ){
        $ASSET_CLASS = '';
    }

    $sql = "SELECT ASSET_ROOM_NO
    FROM AMSD.ASSETS_VW
    WHERE ASSET_CLASS LIKE '%$ASSET_CLASS%' AND ASSET_ID LIKE '%$ASSET_ID%' AND ASSET_ROOM_NO LIKE '%$ASSET_ROOM_NO%' AND ASSET_LOCATION_AREA LIKE '%$ASSET_LOCATION%' 
    GROUP BY ASSET_ROOM_NO
    ORDER BY ASSET_ROOM_NO ASC";
    // $sql = "SELECT ASSET_ROOM_NO FROM AMSD.ASSETS_LOCATION WHERE ASSET_CLASS LIKE '%$ASSET_CLASS%' GROUP BY ASSET_ROOM_NO";
    // $sql = "SELECT * FROM AMSD.ASSETS_VW";

    $assets_no =$func->executeQuery($sql);
    $response = array();
    $items = '';

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->ASSET_ROOM_NO;
            // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
            // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

        }

        // echo $items;
         echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        // echo json_encode(array("rows" => 0 ,"data" =>""));

    }

});

$app->map(['GET','POST'],'/location',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $ASSET_CLASS = $func->checkValue(strtoupper($data->asset_class));
    $ASSET_LOCATION = $func->checkValue(strtoupper($data->asset_location));
    $ASSET_ROOM_NO = $func->checkValue(strtoupper($data->asset_room));
    $ASSET_ID = $func->checkValue(strtoupper($data->asset_id));

   if($ASSET_CLASS == 'ALL EQUIPMENT'){
        $ASSET_CLASS = '';
    }

    $sql = "SELECT ASSET_LOCATION_AREA
    FROM AMSD.ASSETS_VW
    WHERE ASSET_CLASS LIKE '%$ASSET_CLASS%' AND ASSET_ID LIKE '%$ASSET_ID%' AND ASSET_ROOM_NO LIKE '%$ASSET_ROOM_NO%' AND ASSET_LOCATION_AREA LIKE '%$ASSET_LOCATION%'
    GROUP BY ASSET_LOCATION_AREA
    ORDER BY ASSET_LOCATION_AREA ASC";

    // $sql = "SELECT ASSET_LOCATION_AREA FROM AMSD.ASSETS_LOCATION WHERE  GROUP BY ASSET_LOCATION_AREA";
    // $sql = "SELECT * FROM AMSD.ASSETS_VW";

    $assets_no =$func->executeQuery($sql);
    $response = array();
    $items = '';

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->ASSET_LOCATION_AREA;
            // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
            // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

        }

        // echo $items;
         echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        // echo json_encode(array("rows" => 0 ,"data" =>""));

    }

});

$app->map(['GET','POST'],'/filter_with_var',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    if ($data != null){
        $input_var = $data->input_var;

        $sql_query = "";

        $results = $func->executeQuery($sql_query);

        if($results){
            
        }
    }

});

$app->map(['GET','POST'],'/printView',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $ASSET_CLASS = strtoupper($data->asset_class);
    $ASSET_NO = strtoupper($data->primary_asset_id);

    if($ASSET_CLASS == 'ALL EQUIPMENT'){
        $ASSET_CLASS = '';
    }

    $sql = "SELECT ASSET_LOCATION_AREA,ASSET_ROOM_NO,ASSET_PRIMARY_ID,ASSET_ID,ASSET_DESCRIPTION,ASSET_IS_SUB
    FROM AMSD.ASSETS_VW
    WHERE ASSET_CLASS LIKE '%$ASSET_CLASS%'
    AND ASSET_PRIMARY_ID IN ($ASSET_NO)";


    $assets_no =$func->executeQuery($sql);

    if($assets_no){

         echo $assets_no;
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>[]));

    }

});

$app->map(['GET','POST'],'/getCurrentAssets', function (Request $request, Response $response){

    global $func;
    $data = json_decode(file_get_contents('php://input') );
    $ASSET_NO = strtoupper($data->v_assetNo);
    $ASSET_ROOM = strtoupper($data->v_room);
    $ASSET_LOCATION = strtoupper($data->v_location);
    $ASSET_DESCRIPTION = strtoupper($data->v_description);
    $ASSET_CLASS = strtoupper($data->asset_class);
    $response = array();

    if(!empty($ASSET_NO) || !empty($ASSET_ROOM) || !empty($ASSET_LOCATION) || !empty($ASSET_DESCRIPTION) || !empty($ASSET_CLASS)){

        if($ASSET_CLASS == 'ALL EQUIPMENT'){
            $ASSET_CLASS = '';
        }
        $sql = "SELECT ASSET_ID,ASSET_ROOM_NO,ASSET_LOCATION_AREA,ASSET_DESCRIPTION,ASSET_TRANSACTION_STATUS,ASSET_IS_SUB 
        FROM AMSD.ASSETS_VW 
        WHERE ASSET_PRIMARY_ID LIKE '%$ASSET_NO%' 
        AND ASSET_ROOM_NO LIKE '%$ASSET_ROOM%' 
        AND ASSET_LOCATION_AREA LIKE '%$ASSET_LOCATION%' 
        AND ASSET_DESCRIPTION LIKE '%$ASSET_DESCRIPTION%' 
        AND ASSET_CLASS LIKE '%$ASSET_CLASS%' 
        AND ASSET_ID=ASSET_PRIMARY_ID 
        ORDER BY ASSET_ID ASC";
        // $sql = "SELECT * FROM AMSD.ASSETS_VW WHERE ASSET_ID=ASSET_PRIMARY_ID";

        $assets =$func->executeQuery($sql);

        if($assets){
            echo $assets;
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>[]));

        }

    }

});

$app->map(['GET','POST'],'/getOutAssets', function (Request $request, Response $response){

    global $func;
    $data = json_decode(file_get_contents('php://input') );
    $ASSET_NO = strtoupper($data->v_assetNo);
    $ASSET_ROOM = strtoupper($data->v_room);
    $ASSET_LOCATION = strtoupper($data->v_location);
    $ASSET_DESCRIPTION = strtoupper($data->v_description);
    $ASSET_CLASS = strtoupper($data->asset_class);
    $response = array();

    if(!empty($ASSET_NO) || !empty($ASSET_ROOM) || !empty($ASSET_LOCATION) || !empty($ASSET_DESCRIPTION) || !empty($ASSET_CLASS)){

        if($ASSET_CLASS == 'ALL EQUIPMENT'){
            $ASSET_CLASS = '';
        }
        $sql = "SELECT AVW.ASSET_ID,AVW.ASSET_ROOM_NO,AVW.ASSET_LOCATION_AREA,AVW.ASSET_DESCRIPTION,ASSET_IS_SUB
        FROM AMSD.ASSET_LOG_PENDING_VW LVW, AMSD.ASSETS_VW AVW
        WHERE ASSET_TRANSACTION_STATUS = 'Pending'
        AND ASSET_LOCATION_AREA_OLD LIKE '%$ASSET_LOCATION%'
        AND LVW.ASSET_ROOM_NO_OLD LIKE '%$ASSET_ROOM%'
        AND AVW.ASSET_PRIMARY_ID LIKE '%$ASSET_NO%' 
        AND AVW.ASSET_ROOM_NO LIKE '%$ASSET_ROOM%' 
        AND AVW.ASSET_LOCATION_AREA LIKE '%$ASSET_LOCATION%' 
        AND AVW.ASSET_DESCRIPTION LIKE '%$ASSET_DESCRIPTION%' 
        AND AVW.ASSET_CLASS LIKE '%$ASSET_CLASS%'
        AND AVW.ASSET_ID=ASSET_PRIMARY_ID
        GROUP BY AVW.ASSET_ID,AVW.ASSET_ROOM_NO,AVW.ASSET_LOCATION_AREA,AVW.ASSET_DESCRIPTION,ASSET_IS_SUB";
        // $sql = "SELECT * FROM AMSD.ASSETS_VW WHERE ASSET_ID=ASSET_PRIMARY_ID";

        $assets =$func->executeQuery($sql);

        if($assets){
            echo $assets;
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>[]));

        }
    }

});

$app->map(['GET','POST'],'/getInAssets', function (Request $request, Response $response){

    global $func;
    $data = json_decode(file_get_contents('php://input') );
    $ASSET_NO = strtoupper($data->v_assetNo);
    $ASSET_ROOM = strtoupper($data->v_room);
    $ASSET_LOCATION = strtoupper($data->v_location);
    $ASSET_DESCRIPTION = strtoupper($data->v_description);
    $ASSET_CLASS = strtoupper($data->asset_class);

    if(!empty($ASSET_NO) || !empty($ASSET_ROOM) || !empty($ASSET_LOCATION) || !empty($ASSET_DESCRIPTION) || !empty($ASSET_CLASS)){

        if($ASSET_CLASS == 'ALL EQUIPMENT'){
            $ASSET_CLASS = '';
        }
        $sql = "SELECT AVW.ASSET_ID,AVW.ASSET_ROOM_NO,AVW.ASSET_LOCATION_AREA,AVW.ASSET_DESCRIPTION,ASSET_IS_SUB
        FROM AMSD.ASSET_LOG_PENDING_VW LVW, AMSD.ASSETS_VW AVW
        WHERE ASSET_TRANSACTION_STATUS = 'Pending'
        AND ASSET_LOCATION_AREA_NEW LIKE '%$ASSET_LOCATION%'
        AND LVW.ASSET_ID NOT IN (SELECT ASSET_ID FROM AMSD.ASSET_LOG_PENDING_VW 
                                WHERE ASSET_LOCATION_AREA_OLD LIKE '%$ASSET_LOCATION%'
                                AND ASSET_LOCATION_AREA_NEW IS NULL)
        AND LVW.ASSET_ROOM_NO_NEW LIKE '%$ASSET_ROOM%'
        AND AVW.ASSET_PRIMARY_ID LIKE '%$ASSET_NO%' 
        AND AVW.ASSET_ROOM_NO LIKE '%$ASSET_ROOM%' 
        -- AND AVW.ASSET_LOCATION_AREA LIKE '%$ASSET_LOCATION%' 
        AND AVW.ASSET_DESCRIPTION LIKE '%$ASSET_DESCRIPTION%' 
        AND AVW.ASSET_CLASS LIKE '%$ASSET_CLASS%'
        GROUP BY AVW.ASSET_ID,AVW.ASSET_ROOM_NO,AVW.ASSET_LOCATION_AREA,AVW.ASSET_DESCRIPTION,ASSET_IS_SUB";

        $assets =$func->executeQuery($sql);

        if($assets){
            echo $assets;
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>[]));

        }


    }

});


$app->map(['GET','POST'],'/pendingTransfer',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $ASSET_NO = strtoupper($data->primary_asset_id);


    $sql = "SELECT ASSET_ROOM_NO,ASSET_PRIMARY_ID
    FROM AMSD.ASSETS_VW
    WHERE ASSET_PRIMARY_ID IN ($ASSET_NO)";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
         echo $assets_no;
    }
    else{
        // echo json_encode(array("rows" => 0 ,"data" =>""));
    }

});

$app->map(['GET','POST'],'/confirmTransfer',function(Request $request, Response $response){
    try{
        global $connect;
        $data = json_decode(file_get_contents('php://input'));
        $ASSET_NO = strtoupper($data->assetIds);
        $LOCATION = strtoupper($data->location);
        $ROOM = strtoupper($data->room);
        $USERNAME = strtoupper($data->username);
        $RESULT = '';

        // echo $USERNAME.$ASSET_NO.$LOCATION.$ROOM.$RESULT;

        $sql = "BEGIN AMSD.ASSET_TRANSFER_MOVEMENT(:USERNAME,:ASSET_NO,:LOCATION,:ROOM,:RESULT); END;";
        $statement = oci_parse($connect,$sql);
        oci_bind_by_name($statement, ':USERNAME', $USERNAME, 30);
        oci_bind_by_name($statement, ':ASSET_NO', $ASSET_NO, 4000);
        oci_bind_by_name($statement, ':LOCATION', $LOCATION, 30);
        oci_bind_by_name($statement, ':ROOM', $ROOM, 30);
        oci_bind_by_name($statement, ':RESULT', $RESULT, 2);

        oci_execute($statement , OCI_NO_AUTO_COMMIT);

        oci_commit($connect);

        if($RESULT == "y"){
            echo json_encode(array("rows" => 0 ,"data" =>"TRANSFER WAS SUCCESSFUL"));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"TRANSFER WAS NOT SUCCESSFUL"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
    

});

$app->map(['GET','POST'],'/cancelTransfer',function(Request $request, Response $response){
    try{
        global $connect;
        $data = json_decode(file_get_contents('php://input'));
        $ASSET_NO = strtoupper($data->asset_id);
        $USERNAME = strtoupper($data->username);
        $RESULT = '';

        // echo $USERNAME.$ASSET_NO.$LOCATION.$ROOM.$RESULT;

        $sql = "BEGIN amsd.asset_cancel_movement(:USERNAME,:ASSET_NO,:RESULT); END;";
        $statement = oci_parse($connect,$sql);
        oci_bind_by_name($statement, ':USERNAME', $USERNAME, 30);
        oci_bind_by_name($statement, ':ASSET_NO', $ASSET_NO, 4000);
        oci_bind_by_name($statement, ':RESULT', $RESULT, 2);

        oci_execute($statement , OCI_NO_AUTO_COMMIT);

        oci_commit($connect);

        if($RESULT == "y"){
            echo json_encode(array("rows" => 0 ,"data" =>"CANCEL WAS SUCCESSFUL"));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"CANCEL WAS NOT SUCCESSFUL"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
    

});


$app->run();
