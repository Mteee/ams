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
    $level = strtoupper($data->level);
    $room_no = strtoupper($data->room_no);
    $building = strtoupper($data->building);
    $area = strtoupper($data->area);
    $ASSET_DESCRIPTION = strtoupper($data->v_description);
    $ASSET_CLASS = strtoupper($data->asset_class);
    $response = array();

    if(!empty($ASSET_NO) || !empty($ASSET_ROOM) || !empty($ASSET_LOCATION) || !empty($ASSET_DESCRIPTION) || !empty($ASSET_CLASS)){

        if($ASSET_CLASS == 'ALL EQUIPMENT'){
            $ASSET_CLASS = '';
        }
        $sql = "SELECT ASSET_ID,ASSET_ROOM_NO,ASSET_AREA,ASSET_DESCRIPTION,ASSET_IS_SUB 
        FROM AMSD.ASSETS_VIEW
        WHERE ASSET_BUILDING LIKE '%$building%' 
        AND ASSET_LEVEL LIKE '%$level%' 
        AND ASSET_ROOM_NO LIKE '%$room_no%' 
        AND ASSET_AREA LIKE '%$area%' 
        AND ASSET_CLASSIFICATION LIKE '%$ASSET_DESCRIPTION%' 
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


$app->map(['GET','POST'],'/singleAsset_al_no',function(Request $request, Response $response){

    $data = json_decode(file_get_contents('php://input') );

    $ASSET_NO = strtoupper($data->al_no);

    $response = array();
    $count = 0;
    global $func;



    if(!empty($ASSET_NO)){

        $sql = "SELECT * FROM AMSD.ASSETS_NEW WHERE ASSET_SUB_LOCATION='$ASSET_NO'";

        $assets =$func->executeQuery($sql);

        if($assets){
            // echo $assets;
            $results = json_decode($assets);
            $loc = $results->data[0]->ASSET_SUB_LOCATION;
            $room = $results->data[0]->ASSET_ROOM_NO;
            $asset_pr = $results->data[0]->ASSET_PRIMARY_ID;
            $sub = '
            <table id="viewAssetTable1" style="width:100%;border-radius: 5px;">
                <thead>
                    <tr>
                        <div class="asset-header text-center">
                            Asset Location
                        </div>
                    </tr>
                </thead>
                <tbody id="asset-info">
                    <tr id="assetLocation">
                        <th class="theading">Sub Location</th>
                        <td>'.$loc.'</td>
                    </tr>
                    <tr id="assetRoom">
                        <th class="theading">Room</th>
                        <td>'.$room.'</td>
                    </tr>
                    <tr>
                        <th class="theading">Primary </th>
                        <td><span id="assetBody">'.$asset_pr.'</span></td>
                    </tr>
                </tbody>
            </table>

            <div class="test-scroll">
            <table id="viewAssetTable2" class="table-bordered table-striped">
                <thead>
                    <tr style="" class="text-light">
                        <th class="theading-sub bg-dark">ASSET(S)</th>
                        <th class="theading-sub bg-dark">CLASSIFICATION</th>
                        <th class="theading-sub bg-dark">UNLINK</th>
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
                                <td>'.$res->ASSET_CLASSIFICATION.'</td>
                                <td><button class="btn btn-info" onclick="unlinkSub(\''.$res->ASSET_ID.'\')"><i class="fa fa-chain-broken"></i></button></td>
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
                            <td colspan="3"><p class="text-muted py-4">No assets found</p></td>
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
        }else{
            $sql = "SELECT * FROM AMSD.ASSETS_LOCATION_NEW WHERE HD_ASSET_ROOM_LOCATION='$ASSET_NO'";
    
            $assets =$func->executeQuery($sql);

            if($assets){

                // echo $assets;
                $results = json_decode($assets);
                $loc = $results->data[0]->HD_ASSET_ROOM_LOCATION;
                $room = $results->data[0]->ASSET_ROOM_NO;
                $asset_pr = "No Assets Assigned";
                $sub = '
                <table id="viewAssetTable1" style="width:100%;border-radius: 5px;">
                 <thead>
                 <tr>
                         <div class="asset-header text-center">
                         Asset Location
                             </div>
                     </tr>
                 </thead>
                 <tbody id="asset-info">
                     <tr id="assetLocation">
                     <th class="theading">Sub Location</th>
                         <td>'.$loc.'</td>
                     </tr>
                     <tr id="assetRoom">
                         <th class="theading">Room</th>
                         <td>'.$room.'</td>
                     </tr>
                     <tr>
                     <th class="theading">Primary </th>
                         <td><span id="assetBody">'.$asset_pr.'</span></td>
                     </tr>
                     </tbody>
             </table>
             
             <div class="test-scroll">
             <table id="viewAssetTable2" class="table-bordered table-striped">
                 <thead>
                     <tr style="" class="text-light">
                     <th class="theading-sub bg-dark">ASSET(S)</th>
                         <th class="theading-sub bg-dark">CLASSIFICATION</th>
                     </tr>
                     </thead>
                 <tbody id="asset-info">
                     ';
                     $sub .= '<tr class="text-center py-4">
                     <td colspan="2"><p class="text-muted py-4">No assets found</p></td>
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
                 
         }
    }

});
$app->map(['GET','POST'],'/getAssets_al_no',function(Request $request, Response $response){

    $data = json_decode(file_get_contents('php://input') );
    $ASSET_NO = strtoupper($data->al_no);

    global $func;

    if(!empty($ASSET_NO)){

        $sql = "SELECT ASSET_ID || '|' || ASSET_CLASSIFICATION ||' - '||ASSET_DESCRIPTION  AS A_A FROM AMSD.ASSETS_NEW WHERE ASSET_SUB_LOCATION='$ASSET_NO'";

        $assets =$func->executeQuery($sql);

        if($assets){
            echo $assets;
        }else{
            echo json_encode(array("rows" => 0 ,"data" =>"Error"));
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
            $filter = "ALL EQUIPMENT";
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
        echo json_encode(array("rows" => 0 ,"data" =>"Error"));
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
        echo json_encode(array("rows" => 0 ,"data" =>""));

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
        echo json_encode(array("rows" => 0 ,"data" =>""));

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
        $sql = "SELECT ASSET_ID AS ASSET_PRIMARY_ID,ASSET_ROOM_NO,ASSET_LOCATION_AREA,ASSET_DESCRIPTION,ASSET_TRANSACTION_STATUS,ASSET_IS_SUB 
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

        $sql = "SELECT  a.asset_primary_id AS ASSET_PRIMARY_ID,
                        a.asset_room_no_new AS ASSET_ROOM_NO,
                        a.asset_location_area_new AS ASSET_LOCATION_AREA,
                        a.asset_description AS ASSET_DESCRIPTION,
                        a.asset_is_sub AS ASSET_IS_SUB
                        FROM
                            (SELECT avw.asset_primary_id,
                                            lvw.asset_room_no_new,
                                            lvw.asset_location_area_new,
                                            avw.asset_description,
                                            asset_is_sub,
                                            'IN' as movement_type
                                    FROM amsd.asset_log_pending_vw lvw, amsd.assets_vw avw
                                    WHERE        asset_transaction_status = 'Pending'
                                            AND asset_location_area_new LIKE '%$ASSET_LOCATION%'
                                            AND (lvw.asset_room_no_new LIKE '%$ASSET_ROOM%'
                                            OR     lvw.asset_room_no_new IS NULL)
                                            AND avw.asset_primary_id LIKE '%$ASSET_NO%'
                                            AND avw.asset_description LIKE '%$ASSET_DESCRIPTION%'
                                            AND avw.asset_class LIKE '%$ASSET_CLASS%'
                                            AND avw.asset_primary_id = lvw.asset_primary_id
                                            AND avw.asset_id = lvw.asset_id
                                            AND avw.asset_primary_id = lvw.asset_id
                                    union all            
                                    SELECT avw.asset_primary_id,
                                            lvw.asset_room_no_old,
                                            lvw.asset_location_area_old,
                                            avw.asset_description,
                                            asset_is_sub,
                                            'OUT' as movement_type
                                    FROM amsd.asset_log_pending_vw lvw, amsd.assets_vw avw
                                    WHERE        asset_transaction_status = 'Pending'
                                            AND asset_location_area_old LIKE '%$ASSET_LOCATION%'
                                            AND lvw.asset_room_no_old LIKE '%$ASSET_ROOM%'
                                            AND avw.asset_primary_id LIKE '%$ASSET_NO%'
                                            AND avw.asset_room_no LIKE '%$ASSET_ROOM%'
                                            AND avw.asset_location_area LIKE '%$ASSET_LOCATION%'
                                            AND avw.asset_description LIKE '%$ASSET_DESCRIPTION%'
                                            AND avw.asset_class LIKE '%$ASSET_CLASS%'
                                            AND avw.asset_primary_id = lvw.asset_primary_id
                                            AND avw.asset_id = lvw.asset_id
                                            AND avw.asset_primary_id = lvw.asset_id) a
                                where a.movement_type = 'OUT'";
                                
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

        $sql = "SELECT  a.asset_primary_id AS ASSET_PRIMARY_ID,
                        a.asset_room_no_new AS ASSET_ROOM_NO,
                        a.asset_location_area_new AS ASSET_LOCATION_AREA,
                        a.asset_description AS ASSET_DESCRIPTION,
                        a.asset_is_sub AS ASSET_IS_SUB
                        FROM
                            (SELECT avw.asset_primary_id,
                                            lvw.asset_room_no_new,
                                            lvw.asset_location_area_new,
                                            avw.asset_description,
                                            asset_is_sub,
                                            'IN' as movement_type
                                    FROM amsd.asset_log_pending_vw lvw, amsd.assets_vw avw
                                    WHERE        asset_transaction_status = 'Pending'
                                            AND asset_location_area_new LIKE '%$ASSET_LOCATION%'
                                            AND (lvw.asset_room_no_new LIKE '%$ASSET_ROOM%'
                                            OR     lvw.asset_room_no_new IS NULL)
                                            AND avw.asset_primary_id LIKE '%$ASSET_NO%'
                                            AND avw.asset_description LIKE '%$ASSET_DESCRIPTION%'
                                            AND avw.asset_class LIKE '%$ASSET_CLASS%'
                                            AND avw.asset_primary_id = lvw.asset_primary_id
                                            AND avw.asset_id = lvw.asset_id
                                            AND avw.asset_primary_id = lvw.asset_id
                                    union all            
                                    SELECT avw.asset_primary_id,
                                            lvw.asset_room_no_old,
                                            lvw.asset_location_area_old,
                                            avw.asset_description,
                                            asset_is_sub,
                                            'OUT' as movement_type
                                    FROM amsd.asset_log_pending_vw lvw, amsd.assets_vw avw
                                    WHERE        asset_transaction_status = 'Pending'
                                            AND asset_location_area_old LIKE '%$ASSET_LOCATION%'
                                            AND lvw.asset_room_no_old LIKE '%$ASSET_ROOM%'
                                            AND avw.asset_primary_id LIKE '%$ASSET_NO%'
                                            AND avw.asset_room_no LIKE '%$ASSET_ROOM%'
                                            AND avw.asset_location_area LIKE '%$ASSET_LOCATION%'
                                            AND avw.asset_description LIKE '%$ASSET_DESCRIPTION%'
                                            AND avw.asset_class LIKE '%$ASSET_CLASS%'
                                            AND avw.asset_primary_id = lvw.asset_primary_id
                                            AND avw.asset_id = lvw.asset_id
                                            AND avw.asset_primary_id = lvw.asset_id) a
                                where a.movement_type = 'IN'
                ";


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
            WHERE ASSET_PRIMARY_ID IN ($ASSET_NO)
            AND ASSET_ID = ASSET_PRIMARY_ID";



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
            echo json_encode(array("rows" => 0 ,"data" =>"TRASNSFER WAS NOT SUCCESSFUL"));
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

$app->map(['GET','POST'],'/checkRoom', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $ASSET_NO = strtoupper($data->asset_id);

    $sql = "SELECT ASSET_PRIMARY_ID,ASSET_ROOM_NO_OLD
    FROM AMSD.ASSET_LOG_PENDING_VW
    WHERE ASSET_PRIMARY_ID IN ($ASSET_NO)
    AND ASSET_ROOM_NO_NEW IS NULL";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
         echo $assets_no;
    }else{
        echo json_encode(array("rows"=>0,"data"=>[]));
    }
 
});


$app->map(['GET','POST'],'/approveAsset',function(Request $request, Response $response){
    try{
        global $connect;
        $data = json_decode(file_get_contents('php://input'));
        $ASSET_NO = strtoupper($data->assetIds);
        $LOCATION = strtoupper($data->location);
        $ROOM = strtoupper($data->room);
        $USERNAME = strtoupper($data->username);
        $RESULT = '';

        // echo $USERNAME.$ASSET_NO.$LOCATION.$ROOM.$RESULT;
        
        $sql = "BEGIN AMSD.asset_approve_movement(:USERNAME,:ASSET_NO,:ROOM,:RESULT); END;";
        $statement = oci_parse($connect,$sql);
        oci_bind_by_name($statement, ':USERNAME', $USERNAME, 30);
        oci_bind_by_name($statement, ':ASSET_NO', $ASSET_NO, 4000);
        oci_bind_by_name($statement, ':ROOM', $ROOM, 30);
        oci_bind_by_name($statement, ':RESULT', $RESULT, 2);
        
        oci_execute($statement , OCI_NO_AUTO_COMMIT);
        
        oci_commit($connect);

        if($RESULT == "y"){
            echo json_encode(array("rows" => 0 ,"data" =>"APPROVAL WAS SUCCESSFUL"));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"APPROVAL WAS NOT SUCCESSFUL"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
    

});

$app->map(['GET','POST'],'/sub_location', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $description = strtoupper($data->description);

    $sql = "SELECT 
    HD_ASSET_ROOM_LOCATION AS \"AL_NO\",
    HD_ASSET_LOCATION,
    HD_ASSET_DESC,
    ASSET_ROOM_NO,
    amsd.fn_sub_assigned_new (HD_ASSET_ROOM_LOCATION)  AS HAS_SUB,
    amsd.fn_pri_assigned_new (HD_ASSET_ROOM_LOCATION)  AS HAS_PRI
    FROM 
        AMSD.ASSETS_LOCATION_NEW 
    WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')   
    --WHERE  substr(HD_ASSET_ROOM_LOCATION,1,1) <> 'M'
    --AND substr(a.asset,1,2) = 'AL'
    AND ASSET_BUILDING LIKE '%$building%'
    AND ASSET_LEVEL LIKE '%$level%'
    AND (ASSET_AREA LIKE '%$area%' OR ASSET_AREA IS NULL)
    AND ASSET_ROOM_NO LIKE '%$room_no%'
    AND HD_ASSET_DESC LIKE '%$description%'
    order by asset_room_no";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
         echo $assets_no;
    }else{
        echo json_encode(array("rows"=>0,"data"=>[]));
    }
 
});

$app->map(['GET','POST'],'/assets_not_linked', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $description = strtoupper($data->description);

    $sql = "SELECT 
    a_new.ASSET_ID,
    l_new.ASSET_ROOM_NO,
    l_new.ASSET_AREA_NAME,
    a_new.ASSET_CLASSIFICATION || ' - ' || ASSET_DESCRIPTION AS ASSET_DESCRIPTION
    --l_new.ASSET_LEVEL_NEW,
    --l_new.ASSET_AREA,
FROM 
    amsd.assets_new a_new,
    AMSD.ASSETS_LOCATION_NEW l_new
WHERE a_new.ASSET_ROOM_NO = l_new.ASSET_ROOM_NO
AND a_new.ASSET_ROOM_NO = a_new.ASSET_SUB_LOCATION
AND a_new.ASSET_CLASS LIKE '%IT EQUIPMENT%'
AND a_new.ASSET_CLASSIFICATION LIKE '%$description%'
AND l_new.ASSET_BUILDING LIKE '%$building%'
AND l_new.ASSET_LEVEL LIKE '%$level%'
AND l_new.ASSET_AREA LIKE '%$area%'
AND l_new.ASSET_ROOM_NO LIKE '%$room_no%'
AND a_new.ASSET_ID = a_new.ASSET_PRIMARY_ID
GROUP BY a_new.ASSET_ID,l_new.ASSET_ROOM_NO,l_new.ASSET_AREA_NAME,a_new.ASSET_CLASSIFICATION || ' - ' || ASSET_DESCRIPTION";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
         echo $assets_no;
    }else{
        echo json_encode(array("rows"=>0,"data"=>[]));
    }
 
});

$app->map(['GET','POST'],'/building', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $response = array();

    $sql = "SELECT 
                ASSET_BUILDING
            FROM 
                AMSD.ASSETS_LOCATION_NEW 
            WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA LIKE '%$area%' OR ASSET_AREA IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            GROUP BY ASSET_BUILDING
            ORDER BY ASSET_BUILDING";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->ASSET_BUILDING;
            // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
            // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

        }

        // echo $items;
         echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>"Error"));
    }
 
});

$app->map(['GET','POST'],'/asset_level_new', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $response = array();

    $sql = "SELECT 
                ASSET_LEVEL 
            FROM 
            AMSD.ASSETS_LOCATION_NEW 
            WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA LIKE '%$area%' OR ASSET_AREA IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            GROUP BY ASSET_LEVEL
            ORDER BY ASSET_LEVEL";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->ASSET_LEVEL;
            // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
            // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

        }

        // echo $items;
         echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>"Error"));
    }
});

$app->map(['GET','POST'],'/asset_area', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $response = array();

    $sql = "SELECT 
                ASSET_AREA
            FROM 
                AMSD.ASSETS_LOCATION_NEW
                WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA LIKE '%$area%' OR ASSET_AREA IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            GROUP BY ASSET_AREA
            ORDER BY ASSET_AREA";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->ASSET_AREA;
            // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
            // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

        }

        // echo $items;
         echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>"Error"));
    }
});

$app->map(['GET','POST'],'/asset_area_name', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $response = array();

    $sql = "SELECT ASSET_AREA
            FROM 
                AMSD.ASSETS_LOCATION_NEW 
                WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA LIKE '%$area%' OR ASSET_AREA IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            GROUP BY ASSET_AREA
            ORDER BY ASSET_AREA";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->ASSET_AREA_NAME;
            // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
            // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

        }

        // echo $items;
         echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>"Error"));
    }
 
});

$app->map(['GET','POST'],'/asset_room_no', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $response = array();

    $sql = "SELECT ASSET_ROOM_NO
            FROM 
                AMSD.ASSETS_LOCATION_NEW 
                WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            GROUP BY ASSET_ROOM_NO
            ORDER BY ASSET_ROOM_NO";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response [] = $value->ASSET_ROOM_NO;
            // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
            // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

        }

        // echo $assets_no;
         echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>"Error"));
    }
 
});



$app->map(['GET','POST'],'/link_assets',function(Request $request, Response $response){
    try{
        global $connect;
        $data = json_decode(file_get_contents('php://input'));
        $ALC_NO = strtoupper($data->al_no);
        $ASSETS_IDS = strtoupper($data->assetIds);
        $PRIMARY_ID = strtoupper($data->primary_asset_id);
        $USERNAME = strtoupper($data->username);
        $RESULT = '';

        // echo $USERNAME.$ASSET_NO.$LOCATION.$ROOM.$RESULT;

        $sql = "BEGIN amsd.asset_it_fix (:AL_NO,:ASSET_IDS,:PRIMARY_ID,:RESULT); END;";
        $statement = oci_parse($connect,$sql);
        // oci_bind_by_name($statement, ':USERNAME', $USERNAME, 30);
        oci_bind_by_name($statement, ':AL_NO', $ALC_NO, 100);
        oci_bind_by_name($statement, ':ASSET_IDS', $ASSETS_IDS, 50000);
        oci_bind_by_name($statement, ':PRIMARY_ID', $PRIMARY_ID, 50000);
        oci_bind_by_name($statement, ':RESULT', $RESULT, 2);

        oci_execute($statement , OCI_NO_AUTO_COMMIT);

        oci_commit($connect);

        if($RESULT == "y"){
            echo json_encode(array("rows" => 0 ,"data" =>"LINK WAS SUCCESSFUL"));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"LINK WAS NOT SUCCESSFUL"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
    

});

$app->map(['GET','POST'],'/unlink_assets',function(Request $request, Response $response){
    try{
        global $connect;
        $data = json_decode(file_get_contents('php://input'));
        $ASSETS_ID = strtoupper($data->assetid);
        $USERNAME = strtoupper($data->username);
        $RESULT = '';

        // echo $USERNAME.$ASSET_NO.$LOCATION.$ROOM.$RESULT;

        $sql = "BEGIN amsd.asset_it_fix_unlink_sub(:ASSET_ID,:RESULT); END;";
        $statement = oci_parse($connect,$sql);
        // oci_bind_by_name($statement, ':USERNAME', $USERNAME, 30);
        oci_bind_by_name($statement, ':ASSET_ID', $ASSETS_ID, 30);
        oci_bind_by_name($statement, ':RESULT', $RESULT, 2);

        oci_execute($statement , OCI_NO_AUTO_COMMIT);

        oci_commit($connect);

        if($RESULT == "y"){
            echo json_encode(array("rows" => 0 ,"data" =>"UNLINK WAS SUCCESSFUL"));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"UNLINK WAS NOT SUCCESSFUL"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
    

});

$app->map(['GET','POST'],'/unlink_all_subs',function(Request $request, Response $response){
    try{
        global $connect;
        $data = json_decode(file_get_contents('php://input'));
        $ASSETS_ID = strtoupper($data->asset_primary_id);
        $USERNAME = strtoupper($data->username);
        $RESULT = '';

        // echo $USERNAME.$ASSET_NO.$LOCATION.$ROOM.$RESULT;

        $sql = "BEGIN amsd.asset_it_fix_unlink_all_subs(:ASSET_ID,:RESULT); END;";
        $statement = oci_parse($connect,$sql);
        // oci_bind_by_name($statement, ':USERNAME', $USERNAME, 30);
        oci_bind_by_name($statement, ':ASSET_ID', $ASSETS_ID, 30);
        oci_bind_by_name($statement, ':RESULT', $RESULT, 2);

        oci_execute($statement , OCI_NO_AUTO_COMMIT);

        oci_commit($connect);

        if($RESULT == "y"){
            echo json_encode(array("rows" => 0 ,"data" =>"UNLINKING ALL SUBS WAS SUCCESSFUL"));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"UNLINKING ALL SUBS WAS NOT SUCCESSFUL"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
    

});



/**
 * View
 */


$app->map(['GET','POST'],'/building_view', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $response = array();

    $sql = "SELECT 
                ASSET_BUILDING
            FROM 
                AMSD.ASSETS_LOCATION_NEW 
            WHERE ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA LIKE '%$area%' OR ASSET_AREA IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            GROUP BY ASSET_BUILDING
            ORDER BY ASSET_BUILDING";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->ASSET_BUILDING;
            // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
            // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

        }

        // echo $items;
         echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>"Error"));
    }
 
});

$app->map(['GET','POST'],'/asset_level_new_view', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $response = array();

    $sql = "SELECT 
                ASSET_LEVEL 
            FROM 
            AMSD.ASSETS_LOCATION_NEW 
            WHERE ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA LIKE '%$area%' OR ASSET_AREA IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            GROUP BY ASSET_LEVEL
            ORDER BY ASSET_LEVEL";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->ASSET_LEVEL;
            // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
            // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

        }

        // echo $items;
         echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>"Error"));
    }
});

$app->map(['GET','POST'],'/asset_area_view', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $response = array();

    $sql = "SELECT 
                ASSET_AREA
            FROM 
                AMSD.ASSETS_LOCATION_NEW
                WHERE ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA LIKE '%$area%' OR ASSET_AREA IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            GROUP BY ASSET_AREA
            ORDER BY ASSET_AREA";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->ASSET_AREA;
            // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
            // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

        }

        // echo $items;
         echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>"Error"));
    }
});

$app->map(['GET','POST'],'/asset_area_name_view', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $response = array();

    $sql = "SELECT ASSET_AREA
            FROM 
                AMSD.ASSETS_LOCATION_NEW 
                WHERE ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA LIKE '%$area%' OR ASSET_AREA IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            GROUP BY ASSET_AREA
            ORDER BY ASSET_AREA";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->ASSET_AREA_NAME;
            // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
            // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

        }

        // echo $items;
         echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>"Error"));
    }
 
});

$app->map(['GET','POST'],'/asset_room_no_view', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $response = array();

    $sql = "SELECT ASSET_ROOM_NO
            FROM 
                AMSD.ASSETS_LOCATION_NEW 
                WHERE  ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            GROUP BY ASSET_ROOM_NO
            ORDER BY ASSET_ROOM_NO";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response [] = $value->ASSET_ROOM_NO;
            // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
            // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

        }

        // echo $assets_no;
         echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>"Error"));
    }
 
});

$app->run();
