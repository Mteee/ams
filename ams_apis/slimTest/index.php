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
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $asset_primar_id = strtoupper($data->asset_primary_id);
    $ASSET_DESCRIPTION = strtoupper($data->description);
    $ASSET_CLASS = strtoupper($data->asset_class);
    $response = array();

    if(!empty($building) || !empty($level) || !empty($area) || !empty($ASSET_DESCRIPTION) || !empty($ASSET_CLASS)){

        if($ASSET_CLASS == 'ALL EQUIPMENT'){
            $ASSET_CLASS = '';
        }
        
        $sql = "SELECT ASSET_CLASS,ASSET_SUB_LOCATION,ASSET_ID,ASSET_ROOM_NO,ASSET_AREA,ASSET_DESCRIPTION,ASSET_IS_SUB 
        FROM AMSD.ASSETS_VW
        WHERE ASSET_BUILDING LIKE '%$building%' 
        AND ASSET_LEVEL LIKE '%$level%' 
        AND ASSET_ROOM_NO LIKE '%$room_no%' 
        AND ASSET_AREA_NAME LIKE '%$area%' 
        AND ASSET_CLASSIFICATION LIKE '%$ASSET_DESCRIPTION%' 
        AND ASSET_CLASS LIKE '%$ASSET_CLASS%' 
        AND HD_ASSET_LOCATION LIKE '%$sub_location%' 
        AND ASSET_PRIMARY_ID LIKE '%$asset_primar_id%' 
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
            $loc = $results->data[0]->ASSET_AREA;
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

    $sql = "SELECT ASSET_ID FROM AMSD.ASSETS_VW WHERE ASSET_CLASS LIKE '%$ASSET_CLASS%' AND ASSET_ID LIKE '%$ASSET_ID%' AND ASSET_ROOM_NO LIKE '%$ASSET_ROOM_NO%' AND ASSET_AREA_NAME LIKE '%$ASSET_LOCATION%' AND ASSET_ID=ASSET_PRIMARY_ID ORDER BY ASSET_ID ASC";
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
    $ASSET_BUILDING = strtoupper($data->building);
    $ASSET_LEVEL = strtoupper($data->level);
    $ASSET_AREA = strtoupper($data->area);
    $ASSET_ROOM_NO = strtoupper($data->room_no);
    $ASSET_CLASS = strtoupper($data->asset_class);


    if($ASSET_CLASS == 'ALL EQUIPMENT' ){
        $ASSET_CLASS = '';
    }

    $sql = "SELECT ASSET_ROOM_NO
    FROM AMSD.ASSETS_VW
    WHERE ASSET_CLASS LIKE '%$ASSET_CLASS%' 
    AND ASSET_BUILDING LIKE '%$ASSET_BUILDING%' 
    AND ASSET_ROOM_NO LIKE '%$ASSET_ROOM_NO%' 
    AND ASSET_AREA_NAME LIKE '%$ASSET_AREA%' 
    AND ASSET_LEVEL LIKE '%$ASSET_LEVEL%' 
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
$app->map(['GET','POST'],'/location_area',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $ASSET_BUILDING = strtoupper($data->building);
    $ASSET_LEVEL = strtoupper($data->level);
    $ASSET_AREA = strtoupper($data->area);
    $ASSET_ROOM_NO = strtoupper($data->room_no);
    $ASSET_CLASS = strtoupper($data->asset_class);


    if($ASSET_CLASS == 'ALL EQUIPMENT' ){
        $ASSET_CLASS = '';
    }

    $sql = "SELECT ASSET_AREA_NAME
    FROM AMSD.ASSETS_VW
    WHERE ASSET_CLASS LIKE '%$ASSET_CLASS%' 
    AND ASSET_BUILDING LIKE '%$ASSET_BUILDING%' 
    AND ASSET_ROOM_NO LIKE '%$ASSET_ROOM_NO%' 
    AND ASSET_AREA_NAME LIKE '%$ASSET_AREA%' 
    AND ASSET_LEVEL LIKE '%$ASSET_LEVEL%' 
    GROUP BY ASSET_AREA_NAME
    ORDER BY ASSET_AREA_NAME ASC";

    // $sql = "SELECT ASSET_LOCATION_AREA FROM AMSD.ASSETS_LOCATION WHERE  GROUP BY ASSET_LOCATION_AREA";
    // $sql = "SELECT * FROM AMSD.ASSETS_VW";

    $assets_no =$func->executeQuery($sql);
    $response = array();
    $items = '';

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
        echo json_encode(array("rows" => 0 ,"data" =>""));

    }

});
$app->map(['GET','POST'],'/asset_leve',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $ASSET_BUILDING = strtoupper($data->building);
    $ASSET_LEVEL = strtoupper($data->level);
    $ASSET_AREA = strtoupper($data->area);
    $ASSET_ROOM_NO = strtoupper($data->room_no);
    $ASSET_CLASS = strtoupper($data->asset_class);


    if($ASSET_CLASS == 'ALL EQUIPMENT' ){
        $ASSET_CLASS = '';
    }

    $sql = "SELECT ASSET_LEVEL
    FROM AMSD.ASSETS_VW
    WHERE ASSET_CLASS LIKE '%$ASSET_CLASS%' 
    AND ASSET_BUILDING LIKE '%$ASSET_BUILDING%' 
    AND ASSET_ROOM_NO LIKE '%$ASSET_ROOM_NO%' 
    AND ASSET_AREA_NAME LIKE '%$ASSET_AREA%' 
    AND ASSET_LEVEL LIKE '%$ASSET_LEVEL%' 
    GROUP BY ASSET_LEVEL
    ORDER BY ASSET_LEVEL ASC";

    // $sql = "SELECT ASSET_LOCATION_AREA FROM AMSD.ASSETS_LOCATION WHERE  GROUP BY ASSET_LOCATION_AREA";
    // $sql = "SELECT * FROM AMSD.ASSETS_VW";

    $assets_no =$func->executeQuery($sql);
    $response = array();
    $items = '';

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
        echo json_encode(array("rows" => 0 ,"data" =>""));

    }

});
$app->map(['GET','POST'],'/asset_building',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $ASSET_BUILDING = strtoupper($data->building);
    $ASSET_LEVEL = strtoupper($data->level);
    $ASSET_AREA = strtoupper($data->area);
    $ASSET_ROOM_NO = strtoupper($data->room_no);
    $ASSET_CLASS = strtoupper($data->asset_class);


    if($ASSET_CLASS == 'ALL EQUIPMENT' ){
        $ASSET_CLASS = '';
    }

    $sql = "SELECT ASSET_BUILDING
    FROM AMSD.ASSETS_VW
    WHERE ASSET_CLASS LIKE '%$ASSET_CLASS%' 
    AND ASSET_BUILDING LIKE '%$ASSET_BUILDING%' 
    AND ASSET_ROOM_NO LIKE '%$ASSET_ROOM_NO%' 
    AND ASSET_AREA_NAME LIKE '%$ASSET_AREA%' 
    AND ASSET_LEVEL LIKE '%$ASSET_LEVEL%' 
    GROUP BY ASSET_BUILDING
    ORDER BY ASSET_BUILDING ASC";

    // $sql = "SELECT ASSET_LOCATION_AREA FROM AMSD.ASSETS_LOCATION WHERE  GROUP BY ASSET_LOCATION_AREA";
    // $sql = "SELECT * FROM AMSD.ASSETS_VW";

    $assets_no =$func->executeQuery($sql);
    $response = array();
    $items = '';

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

    $sql = "SELECT ASSET_AREA_NAME AS ASSET_AREA,ASSET_ROOM_NO,ASSET_PRIMARY_ID,ASSET_ID,ASSET_DESCRIPTION,ASSET_IS_SUB
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
    $level = strtoupper($data->level);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $building = strtoupper($data->building);
    $area = strtoupper($data->area);
    $ASSET_DESCRIPTION = strtoupper($data->description);
    $ASSET_CLASS = strtoupper($data->asset_class);
    $response = array();

    if(!empty($level) || !empty($building) || !empty($ASSET_DESCRIPTION) || !empty($ASSET_CLASS) || !empty($room_no) || !empty($area)){

        if($ASSET_CLASS == 'ALL EQUIPMENT'){
            $ASSET_CLASS = '';
        }
        $sql = "SELECT ASSET_ID,ASSET_CLASS,ASSET_ROOM_NO,ASSET_AREA_NAME AS ASSET_AREA,ASSET_SUB_LOCATION,ASSET_DESCRIPTION ||' - ' || ASSET_CLASSIFICATION AS ASSET_DESCRIPTION,ASSET_TRANSACTION_STATUS,ASSET_IS_SUB,ASSET_TRANSACTION_STATUS AS ASSET_STATUS 
        FROM AMSD.ASSETS_VW 
        WHERE ASSET_BUILDING LIKE '%$building%' 
        AND ASSET_LEVEL LIKE '%$level%' 
        AND ASSET_ROOM_NO LIKE '%$room_no%' 
        AND ASSET_SUB_LOCATION LIKE '%$sub_location%' 
        AND ASSET_PRIMARY_ID LIKE '%$asset_primary_id%' 
        AND ASSET_AREA_NAME LIKE '%$area%' 
        AND (ASSET_CLASSIFICATION LIKE '%$ASSET_DESCRIPTION%' 
        OR ASSET_DESCRIPTION LIKE '%$ASSET_DESCRIPTION%') 
        AND ASSET_CLASS LIKE '%$ASSET_CLASS%' 
        AND ASSET_ID=ASSET_PRIMARY_ID
        AND ASSET_STATUS = 'ACTIVE'
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
$app->map(['GET','POST'],'/getInAssets', function (Request $request, Response $response){

    global $func;
    $data = json_decode(file_get_contents('php://input') );
    $level = strtoupper($data->level);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $building = strtoupper($data->building);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $area = strtoupper($data->area);
    $ASSET_DESCRIPTION = strtoupper($data->description);
    $ASSET_CLASS = strtoupper($data->asset_class);
    $response = array();

    if(!empty($level) || !empty($building) || !empty($ASSET_DESCRIPTION) || !empty($ASSET_CLASS) || !empty($room_no) || !empty($area)){

        if($ASSET_CLASS == 'ALL EQUIPMENT'){
            $ASSET_CLASS = '';
        }
        
        $sql = "SELECT  avw.asset_primary_id  as ASSET_ID,
                        lvw.asset_room_no_new as ASSET_ROOM_NO,
                        lvw.asset_location_area_new as ASSET_AREA,
                        avw.asset_class, 
                        lvw.asset_sub_location_new as ASSET_SUB_LOCATION,
                        avw.asset_description,
                        asset_is_sub,
                        avw.ASSET_TRANSACTION_STATUS AS ASSET_STATUS
                FROM amsd.assets_log_pending_vw lvw, amsd.assets_vw avw
                WHERE        (asset_transaction_status = 'PENDING' OR asset_transaction_status = 'PENDING-TEMP')
                        AND (lvw.asset_building_new LIKE '%$building%'
                        OR     lvw.asset_building_new IS NULL)
                        AND (lvw.asset_level_new LIKE '%$level%'
                        OR     lvw.asset_level_new IS NULL)
                        AND (lvw.asset_location_area_new LIKE '%$area%'
                        OR     lvw.asset_location_area_new IS NULL)
                        AND (lvw.asset_room_no_new LIKE '%$room_no%'
                        OR     lvw.asset_room_no_new IS NULL)
                        AND (lvw.asset_sub_location_new LIKE '%$sub_location%'
                        OR     lvw.asset_sub_location_new IS NULL)
                        AND avw.asset_primary_id LIKE '%$asset_primary_id%'
                        AND avw.ASSET_CLASSIFICATION LIKE '%$ASSET_DESCRIPTION%' 
                        AND avw.asset_class LIKE '%$ASSET_CLASS%'
                        AND avw.asset_primary_id = lvw.asset_primary_id
                        AND avw.asset_id = lvw.asset_id
                        AND avw.asset_primary_id = lvw.asset_id";
                                   
                                
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
    $level = strtoupper($data->level);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $building = strtoupper($data->building);
    $area = strtoupper($data->area);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $ASSET_DESCRIPTION = strtoupper($data->description);
    $ASSET_CLASS = strtoupper($data->asset_class);
    $response = array();

    if(!empty($level) || !empty($building) || !empty($ASSET_DESCRIPTION) || !empty($ASSET_CLASS) || !empty($room_no) || !empty($area)){

        if($ASSET_CLASS == 'ALL EQUIPMENT'){
            $ASSET_CLASS = '';
        }

        $sql = " SELECT avw.asset_primary_id as ASSET_ID,
                        lvw.asset_room_no_old as ASSET_ROOM_NO,
                        lvw.asset_location_area_old as ASSET_AREA,
                        avw.asset_sub_location,
                        avw.asset_class,
                        avw.asset_description,
                        asset_is_sub,
                        avw.ASSET_TRANSACTION_STATUS AS ASSET_STATUS,
                        'OUT' as movement_type
                FROM amsd.assets_log_pending_vw lvw, amsd.assets_vw avw
                WHERE         (asset_transaction_status = 'PENDING' OR asset_transaction_status = 'PENDING-TEMP')
                        AND ASSET_LOCATION_AREA_OLD LIKE '%$area%'
                        AND lvw.asset_room_no_old LIKE '%$room_no%'
                        AND avw.asset_sub_location LIKE '%$sub_location%'
                        AND avw.asset_primary_id LIKE '%$asset_primary_id%'
                        AND avw.ASSET_AREA_NAME LIKE '%$area%' 
                        AND avw.ASSET_BUILDING LIKE '%$building%' 
                        AND avw.ASSET_LEVEL LIKE '%$level%' 
                        AND avw.ASSET_CLASSIFICATION LIKE '%$ASSET_DESCRIPTION%' 
                        AND avw.asset_class LIKE '%$ASSET_CLASS%'
                        AND avw.asset_primary_id = lvw.asset_primary_id
                        AND avw.asset_id = lvw.asset_id
                        AND avw.asset_primary_id = lvw.asset_id
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
        $assetIds = strtoupper($data->assetIds);
        $building = strtoupper($data->building);
        $level = strtoupper($data->level);
        $area = strtoupper($data->area);
        $room = strtoupper($data->room);
        $sub_location = strtoupper($data->sub_location);
        $type = strtoupper($data->type);
        $username = strtoupper($data->username);
        $result = '';

        // echo $USERNAME.$ASSET_NO.$LOCATION.$ROOM.$RESULT;

        $sql = "BEGIN AMSD.ASSET_TRANSFER_MOVEMENT(:USERNAME,:ASSET_NO,:BUILDING,:LEVEL,:AREA,:ROOM,:SUB,:TYPE,:RESULT); END;";
        $statement = oci_parse($connect,$sql);
        oci_bind_by_name($statement, ':USERNAME', $username, 30);
        oci_bind_by_name($statement, ':ASSET_NO', $assetIds, 4000);
        oci_bind_by_name($statement, ':BUILDING', $building, 30);
        oci_bind_by_name($statement, ':LEVEL', $level, 30);
        oci_bind_by_name($statement, ':AREA', $area, 30);
        oci_bind_by_name($statement, ':ROOM', $room, 30);
        oci_bind_by_name($statement, ':SUB', $sub_location, 30);
        oci_bind_by_name($statement, ':TYPE', $type, 30);
        oci_bind_by_name($statement, ':RESULT', $result, 2);

        oci_execute($statement , OCI_NO_AUTO_COMMIT);

        oci_commit($connect);

        if($result == "y"){
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

    $sql = "SELECT ASSET_PRIMARY_ID,ASSET_ROOM_NO_OLD,ASSET_BUILDING_NEW,ASSET_LEVEL_NEW,ASSET_LOCATION_AREA_NEW
    FROM AMSD.ASSETS_LOG_PENDING_VW
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
        $ROOM = strtoupper($data->room);
        $sub_location = strtoupper($data->sub_location);
        $USERNAME = strtoupper($data->username);
        $RESULT = '';

        // echo $USERNAME.$ASSET_NO.$LOCATION.$ROOM.$RESULT;
        
        $sql = "BEGIN AMSD.asset_approve_movement(:USERNAME,:ASSET_NO,:ROOM,:SUB,:RESULT); END;";
        $statement = oci_parse($connect,$sql);
        oci_bind_by_name($statement, ':USERNAME', $USERNAME, 30);
        oci_bind_by_name($statement, ':ASSET_NO', $ASSET_NO, 4000);
        oci_bind_by_name($statement, ':ROOM', $ROOM, 30);
        oci_bind_by_name($statement, ':SUB', $sub_location, 30);
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
    $sub_location = strtoupper($data->sub_location);

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
    AND (ASSET_AREA_NAME LIKE '%$area%' OR ASSET_AREA_NAME IS NULL)
    AND ASSET_ROOM_NO LIKE '%$room_no%'
    AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
    AND HD_ASSET_DESC LIKE '%$description%'
    order by amsd.fn_pri_assigned_new (HD_ASSET_ROOM_LOCATION) ASC";

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
    $asset_primary_id = strtoupper($data->asset_primary_id);

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
    AND l_new.ASSET_AREA_NAME LIKE '%$area%'
    AND l_new.ASSET_ROOM_NO LIKE '%$room_no%'
    AND a_new.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%'
    AND a_new.ASSET_ID = a_new.ASSET_PRIMARY_ID
    GROUP BY a_new.ASSET_ID,l_new.ASSET_ROOM_NO,l_new.ASSET_AREA_NAME,a_new.ASSET_CLASSIFICATION || ' - ' || ASSET_DESCRIPTION";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
         echo $assets_no;
    }else{
        echo json_encode(array("rows"=>0,"data"=>[]));
    }
 
});

$app->map(['GET','POST'],'/building_sub', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $response = array();

    $sql = "SELECT 
                ASSET_BUILDING
            FROM 
                AMSD.ASSETS_LOCATION_NEW 
            WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA_NAME LIKE '%$area%' OR ASSET_AREA_NAME IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
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
$app->map(['GET','POST'],'/asset_level_new_sub', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $response = array();

    $sql = "SELECT 
                ASSET_LEVEL 
            FROM 
            AMSD.ASSETS_LOCATION_NEW 
            WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA_NAME LIKE '%$area%' OR ASSET_AREA_NAME IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
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
$app->map(['GET','POST'],'/asset_area_sub', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $response = array();

    $sql = "SELECT 
                ASSET_AREA_NAME
            FROM 
                AMSD.ASSETS_LOCATION_NEW
                WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA_NAME LIKE '%$area%' OR ASSET_AREA_NAME IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
            GROUP BY ASSET_AREA_NAME
            ORDER BY ASSET_AREA_NAME";

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
$app->map(['GET','POST'],'/asset_room_no_sub', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $response = array();

    $sql = "SELECT ASSET_ROOM_NO
            FROM 
                AMSD.ASSETS_LOCATION_NEW 
                WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
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

$app->map(['GET','POST'],'/asset_link_al_no', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $response = array();

    $sql = "SELECT 
                HD_ASSET_ROOM_LOCATION
            FROM 
                AMSD.ASSETS_LOCATION_NEW 
            WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA LIKE '%$area%' OR ASSET_AREA IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
            GROUP BY HD_ASSET_ROOM_LOCATION
            ORDER BY HD_ASSET_ROOM_LOCATION";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->HD_ASSET_ROOM_LOCATION;
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

$app->map(['GET','POST'],'/building_assets', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $response = array();

    $sql = "SELECT 
                L_NEW.ASSET_BUILDING
            FROM 
            AMSD.ASSETS_LOCATION_NEW L_NEW, AMSD.ASSETS_NEW A_NEW 
                WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND L_NEW.ASSET_ROOM_NO = A_NEW.ASSET_ROOM_NO
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            AND A_NEW.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%'
            GROUP BY L_NEW.ASSET_BUILDING
            ORDER BY L_NEW.ASSET_BUILDING";

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
$app->map(['GET','POST'],'/asset_level_new_assets', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $response = array();

    $sql = "SELECT 
                L_NEW.ASSET_LEVEL 
            FROM 
            AMSD.ASSETS_LOCATION_NEW L_NEW, AMSD.ASSETS_NEW A_NEW 
                WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND L_NEW.ASSET_ROOM_NO = A_NEW.ASSET_ROOM_NO
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA_NAME LIKE '%$area%' OR ASSET_AREA_NAME IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            AND A_NEW.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%'
            GROUP BY L_NEW.ASSET_LEVEL
            ORDER BY L_NEW.ASSET_LEVEL";

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
$app->map(['GET','POST'],'/asset_area_assets', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $response = array();

    $sql = "SELECT 
                ASSET_AREA_NAME
            FROM 
               AMSD.ASSETS_LOCATION_NEW L_NEW, AMSD.ASSETS_NEW A_NEW 
                WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND L_NEW.ASSET_ROOM_NO = A_NEW.ASSET_ROOM_NO
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA_NAME LIKE '%$area%' OR ASSET_AREA_NAME IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            AND A_NEW.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%'
            GROUP BY ASSET_AREA_NAME
            ORDER BY ASSET_AREA_NAME";

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
$app->map(['GET','POST'],'/asset_room_no_assets', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $response = array();

    $sql = "SELECT L_NEW.ASSET_ROOM_NO
            FROM 
                AMSD.ASSETS_LOCATION_NEW L_NEW, AMSD.ASSETS_NEW A_NEW 
                WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND L_NEW.ASSET_ROOM_NO = A_NEW.ASSET_ROOM_NO
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%'
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            AND ASSET_PRIMARY_ID LIKE '%$asset_primary_id%'
            GROUP BY L_NEW.ASSET_ROOM_NO
            ORDER BY L_NEW.ASSET_ROOM_NO";

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

$app->map(['GET','POST'],'/asset_primary_id_view', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT A_OLD.ASSET_PRIMARY_ID
            FROM 
                AMSD.ASSETS_LOCATION_NEW L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO
            AND A_OLD.ASSET_PRIMARY_ID = A_OLD.ASSET_ID
            AND A_OLD.ASSET_CLASS LIKE '%$asset_class%'
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA LIKE '%$area%' OR L_NEW.ASSET_AREA IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            AND A_OLD.ASSET_STATUS = '1'
            AND A_OLD.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%'
            AND A_OLD.ASSET_STATUS = '1'
            GROUP BY A_OLD.ASSET_PRIMARY_ID
            ORDER BY A_OLD.ASSET_PRIMARY_ID";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response [] = $value->ASSET_PRIMARY_ID;
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
        oci_bind_by_name($statement, ':ASSET_IDS', $ASSETS_IDS, 2000);
        oci_bind_by_name($statement, ':PRIMARY_ID', $PRIMARY_ID, 2000);
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

        $sql = "BEGIN amsd.asset_it_fix_unlink_all_subs_view(:ASSET_ID,:RESULT); END;";
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
    $sub_location = strtoupper($data->sub_location);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                L_NEW.ASSET_BUILDING
            FROM 
                AMSD.ASSETS_LOCATION_NEW L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO
            AND A_OLD.ASSET_CLASS LIKE '%$asset_class%'
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            AND A_OLD.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%'
            AND A_OLD.ASSET_STATUS = '1'
            GROUP BY L_NEW.ASSET_BUILDING
            ORDER BY L_NEW.ASSET_BUILDING";

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
    $sub_location = strtoupper($data->sub_location);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                L_NEW.ASSET_LEVEL 
            FROM 
                AMSD.ASSETS_LOCATION_NEW L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO
            AND A_OLD.ASSET_CLASS LIKE '%$asset_class%'
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            AND A_OLD.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%'
            AND A_OLD.ASSET_STATUS = '1'
            GROUP BY L_NEW.ASSET_LEVEL
            ORDER BY L_NEW.ASSET_LEVEL";

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
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $sub_location = strtoupper($data->sub_location);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                L_NEW.ASSET_AREA_NAME
            FROM 
                AMSD.ASSETS_LOCATION_NEW L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO
            AND A_OLD.ASSET_CLASS LIKE '%$asset_class%'
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            AND A_OLD.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%'
            AND A_OLD.ASSET_STATUS = '1'
            GROUP BY L_NEW.ASSET_AREA_NAME
            ORDER BY L_NEW.ASSET_AREA_NAME";

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
    $sub_location = strtoupper($data->sub_location);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT L_NEW.ASSET_ROOM_NO
            FROM 
                AMSD.ASSETS_LOCATION_NEW L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO
            AND A_OLD.ASSET_CLASS LIKE '%$asset_class%'
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND A_OLD.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%'
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            AND A_OLD.ASSET_STATUS = '1'
            GROUP BY L_NEW.ASSET_ROOM_NO
            ORDER BY L_NEW.ASSET_ROOM_NO";

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
$app->map(['GET','POST'],'/asset_sub_location_view', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $sub_location = strtoupper($data->sub_location);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT A_OLD.ASSET_SUB_LOCATION
            FROM 
                AMSD.ASSETS_LOCATION_NEW L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO
            AND A_OLD.ASSET_CLASS LIKE '%$asset_class%'
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            AND A_OLD.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%'
            AND A_OLD.ASSET_STATUS = '1'
            GROUP BY A_OLD.ASSET_SUB_LOCATION
            ORDER BY A_OLD.ASSET_SUB_LOCATION";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response [] = $value->ASSET_SUB_LOCATION;
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
$app->map(['GET','POST'],'/asset_primary_view', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $sub_location = strtoupper($data->sub_location);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT A_OLD.ASSET_PRIMARY_ID
            FROM 
                AMSD.ASSETS_LOCATION_NEW L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO
            AND A_OLD.ASSET_CLASS LIKE '%$asset_class%'
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            AND A_OLD.ASSET_STATUS = '1'
            AND A_OLD.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%'
            AND A_OLD.ASSET_STATUS = '1'
            GROUP BY A_OLD.ASSET_PRIMARY_ID
            ORDER BY A_OLD.ASSET_PRIMARY_ID";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response [] = $value->ASSET_PRIMARY_ID;
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



// $app->map(['GET','POST'],'/asset_area_addition', function(Request $request, Response $response){
//     global $func;
//     $data = json_decode(file_get_contents('php://input'));
//     $building = strtoupper($data->building);
//     $level = strtoupper($data->level);
//     $area = strtoupper($data->area);
//     $room_no = strtoupper($data->room_no);
//     $asset_class = strtoupper($data->asset_class);
//     $response = array();

//     if($asset_class == 'ALL EQUIPMENT'){
//         $asset_class = '';
//     }

//     $sql = "SELECT 
//                 L_NEW.ASSET_AREA_NAME
//             FROM 
//                 AMSD.ASSETS_LOCATION_NEW L_NEW, AMSD.ASSETS  A_OLD
//             WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO
//             AND A_OLD.ASSET_CERT_NO IS NOT NULL
//             AND A_OLD.ASSET_CLASS LIKE '%$asset_class%'
//             AND L_NEW.ASSET_BUILDING LIKE '%$building%'
//             AND L_NEW.ASSET_LEVEL LIKE '%$level%'
//             AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
//             AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
//             GROUP BY L_NEW.ASSET_AREA_NAME
//             ORDER BY L_NEW.ASSET_AREA_NAME";

//     $assets_no =$func->executeQuery($sql);

//     if($assets_no){
        
//         $res = json_decode($assets_no);
//         $length = $res->rows;
//         foreach($res->data as $value){

//             $response []= $value->ASSET_AREA;
//             // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
//             // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

//         }

//         // echo $items;
//          echo json_encode(array("rows"=>$length,"data" =>$response));
//     }
//     else{
//         echo json_encode(array("rows" => 0 ,"data" =>"Error"));
//     }
// });





/**
 * Addition filters
 * 
 */


$app->map(['GET','POST'],'/building_addition', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $asset_no = strtoupper($data->asset_no);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                ASSET_BUILDING
                FROM AMSD.ASSETS_VW 
            WHERE ASSET_CLASS LIKE '%$asset_class%'
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND ASSET_ID LIKE '%$asset_no%'
            AND ASSET_STATUS = 'ACTIVE'
            AND (ASSET_CERT_NO IS NULL OR ASSET_CERT_NO = ' ')
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

$app->map(['GET','POST'],'/asset_level_new_addition', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $asset_no = strtoupper($data->asset_no);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                ASSET_LEVEL 
                FROM AMSD.ASSETS_VW 
            WHERE ASSET_CLASS LIKE '%$asset_class%'
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND ASSET_ID LIKE '%$asset_no%'
            AND ASSET_STATUS = 'ACTIVE'
            AND (ASSET_CERT_NO IS NULL OR ASSET_CERT_NO = ' ')
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

$app->map(['GET','POST'],'/asset_area_addition', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $asset_no = strtoupper($data->asset_no);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                ASSET_AREA_NAME
                FROM AMSD.ASSETS_VW 
            WHERE ASSET_CLASS LIKE '%$asset_class%'
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%' 
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND ASSET_ID LIKE '%$asset_no%'
            AND ASSET_STATUS = 'ACTIVE'
            AND (ASSET_CERT_NO IS NULL OR ASSET_CERT_NO = ' ')
            GROUP BY ASSET_AREA_NAME
            ORDER BY ASSET_AREA_NAME";

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


$app->map(['GET','POST'],'/asset_room_no_addition', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $asset_no = strtoupper($data->asset_no);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT ASSET_ROOM_NO
            FROM AMSD.ASSETS_VW 
            WHERE ASSET_CLASS LIKE '%$asset_class%'
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND ASSET_ID LIKE '%$asset_no%'
            AND ASSET_STATUS = 'ACTIVE'
            AND (ASSET_CERT_NO IS NULL OR ASSET_CERT_NO = ' ')
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

$app->map(['GET','POST'],'/asset_sub_location_addition', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $asset_no = strtoupper($data->asset_no);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT ASSET_SUB_LOCATION
            FROM AMSD.ASSETS_VW 
            WHERE ASSET_CLASS LIKE '%$asset_class%'
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND ASSET_ID LIKE '%$asset_no%'
            AND ASSET_STATUS = 'ACTIVE'
            AND (ASSET_CERT_NO IS NULL OR ASSET_CERT_NO = ' ')
            GROUP BY ASSET_SUB_LOCATION
            ORDER BY ASSET_SUB_LOCATION";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response [] = $value->ASSET_SUB_LOCATION;
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

$app->map(['GET','POST'],'/asset_id_addition', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $asset_no = strtoupper($data->asset_no);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT ASSET_ID
            FROM AMSD.ASSETS_VW 
            WHERE ASSET_CLASS LIKE '%$asset_class%'
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%' 
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND ASSET_ID LIKE '%$asset_no%'
            AND ASSET_STATUS = 'ACTIVE'
            AND (ASSET_CERT_NO IS NULL OR ASSET_CERT_NO = ' ')
            GROUP BY ASSET_ID
            ORDER BY ASSET_ID";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response [] = $value->ASSET_ID;
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
//without cert no
$app->map(['GET','POST'],'/getAll_Assets_withNo_Cert_no',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $asset_description = strtoupper($data->description);
    $sub_location = strtoupper($data->asset_sub_location);
    $asset_no = strtoupper($data->asset_no);
    $asset_class = strtoupper($data->asset_class);


    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT
        ASSET_CLASS,ASSET_SUB_LOCATION,ASSET_ID,ASSET_ROOM_NO,ASSET_AREA_NAME,ASSET_CLASSIFICATION || ' - ' ||ASSET_DESCRIPTION as ASSET_DESCRIPTION,ASSET_IS_SUB
    FROM AMSD.ASSETS_VW 
    WHERE ASSET_CLASS LIKE '%$asset_class%'
    AND ASSET_BUILDING LIKE '%$building%'
    AND ASSET_LEVEL LIKE '%$level%'
    AND ASSET_AREA_NAME LIKE '%$area%'
    AND ASSET_ROOM_NO LIKE '%$room_no%'
    AND ASSET_SUB_LOCATION LIKE '%$sub_location%'
    AND ASSET_ID LIKE '%$asset_no%'
    AND (ASSET_CLASSIFICATION LIKE '%$asset_description%'
        OR ASSET_DESCRIPTION LIKE '%$asset_description%')
    AND (ASSET_CERT_NO IS NULL OR ASSET_CERT_NO = ' ')
    AND ASSET_STATUS = 'ACTIVE'";

    $assets_withno_crt =$func->executeQuery($sql);

    if($assets_withno_crt){
       echo $assets_withno_crt;
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>[]));
    }

});
// with cert no
$app->map(['GET','POST'],'/getAll_Assets_with_Cert_no',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $asset_description = strtoupper($data->description);
    $sub_location = strtoupper($data->asset_sub_location);
    $asset_no = strtoupper($data->asset_no);
    $asset_class = strtoupper($data->asset_class);


    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT
        ASSET_CLASS,ASSET_SUB_LOCATION,ASSET_ID,ASSET_ROOM_NO,ASSET_AREA_NAME AS ASSET_AREA,ASSET_CLASSIFICATION || ' - ' ||ASSET_DESCRIPTION as ASSET_DESCRIPTION,ASSET_IS_SUB
    FROM AMSD.ASSETS_VW 
    WHERE ASSET_CLASS LIKE '%$asset_class%'
    AND ASSET_BUILDING LIKE '%$building%'
    AND ASSET_LEVEL LIKE '%$level%'
    AND ASSET_AREA_NAME LIKE '%$area%'
    AND ASSET_ROOM_NO LIKE '%$room_no%'
    AND ASSET_SUB_LOCATION LIKE '%$sub_location%'
    AND ASSET_ID LIKE '%$asset_no%'
    AND (ASSET_CLASSIFICATION LIKE '%$asset_description%'
        OR ASSET_DESCRIPTION LIKE '%$asset_description%')
    AND ASSET_CERT_NO IS NOT NULL 
    AND ASSET_STATUS = 'ACTIVE'";

    $assets_withno_crt =$func->executeQuery($sql);

    if($assets_withno_crt){
       echo $assets_withno_crt;
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>[]));
    }

});

$app->map(['GET','POST'],'/generate_Cert_no',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    // $cert_no = strtoupper($data->cert);
    $ASSET_NO = strtoupper($data->assert_primary_id);

    $sql = "SELECT ASSET_CERT_NO
    FROM AMSD.ASSETS
    WHERE ASSET_CERT_NO <> ' '
    AND ASSET_STATUS = '1'
    GROUP BY ASSET_CERT_NO
    ORDER BY ASSET_CERT_NO DESC";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){

        $assets_no;
        $new_cert = json_decode($assets_no);

        $new_cert = $new_cert->data[0]->ASSET_CERT_NO;
        $str_arr = explode("/", $new_cert);  

        $cert_int = (int)$str_arr[1];
        // echo $str_arr[1]." b4 -----------";
        $cert_int++;
        $len = strlen((string)$cert_int);
        $zeros = "";
        if($len < 5){

            for($i = $len;$i<5;$i++){
                $zeros .="0";
            }

            $cert_int = $zeros.$cert_int;
        }

        $cert_int = date("Y").'/'.$cert_int;
        // $ass ={ };
        // echo $cert_int." after";
        if(!empty($cert_int)){

            $asset_sql = "SELECT ASSET_ID,ASSET_DESCRIPTION
            FROM AMSD.ASSETS_VW
            WHERE ASSET_ID IN ($ASSET_NO)";

            $count = 0;
            $sub = "";

            $asset_info =$func->executeQuery($asset_sql);

            if($asset_info){
                // $ass = $asset_info;
                $decode_response = json_decode($asset_info);

                // array_push($decode_response->data,array("cert"=> $cert_int));
                // echo json_encode($decode_response);

                foreach($decode_response->data as $res){

                    //  echo $res->ASSET_PRIMARY_ID;
              
                    $sub .= '<tr>
                                    <td>'.$res->ASSET_ID.'</td>
                                    <td>'.$res->ASSET_DESCRIPTION.'</td>
                                    <td>'.$cert_int.'</td>
                                </tr>
                            ';
    
                                $count++;
                    
                }


                echo json_encode(array("rows" => $count ,"data"=>$sub,"certificate_number"=>$cert_int));
            }
            else{
                echo json_encode(array("rows" => 0 ,"data" =>[]));
            }
        }

    }
  

});

//asset with active status
$app->map(['GET','POST'],'/get_Asset_status_decom',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    // $cert_no = strtoupper($data->cert);
    $ASSET_NO = strtoupper($data->assert_primary_id);

    $sql_exec = "SELECT ASSET_ID,ASSET_DESCRIPTION,ASSET_STATUS
    FROM AMSD.ASSETS_VW
    WHERE ASSET_ID IN ($ASSET_NO)
    AND ASSET_STATUS = 'ACTIVE'
    GROUP BY ASSET_ID,ASSET_DESCRIPTION,ASSET_STATUS
    ORDER BY ASSET_ID ASC";

    $count = 0;
    $sub = "";

    $asset_info =$func->executeQuery($sql_exec);

    if($asset_info){
        // $ass = $asset_info;
        $decode_response = json_decode($asset_info);

        // array_push($decode_response->data,array("cert"=> $cert_int));
        // echo json_encode($decode_response);

        foreach($decode_response->data as $res){

            //  echo $res->ASSET_PRIMARY_ID;
      
            $sub .= '<tr>
                            <td>'.$res->ASSET_ID.'</td>
                            <td>'.$res->ASSET_DESCRIPTION.'</td>
                            <td>'.$res->ASSET_STATUS.'</td>
                        </tr>
                    ';

                        $count++;
            
        }


        echo json_encode(array("rows" => $count ,"data"=>$sub));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>[]));
    }

});


$app->map(['GET','POST'],'/update_cert',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $assets = strtoupper($data->assets);
    $cert = strtoupper($data->cert);

    $sql = "UPDATE AMSD.ASSETS SET ASSET_CERT_NO = '$cert' WHERE ASSET_ID IN ($assets)";

    $update_cert =$func->executeNonQuery($sql);

    if($update_cert){
       echo json_encode(array("rows" => 0 ,"data" =>"success"));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>"error"));
    }

});

$app->map(['GET','POST'],'/add_assets',function(Request $request, Response $response){
    try{
        global $connect;
        $data = json_decode(file_get_contents('php://input'));
        $v_asset_class = strtoupper($data->v_asset_class);
        $v_assets = strtoupper($data->v_assets);
        $v_asset_model = strtoupper($data->v_asset_model);
        $v_asset_classification = strtoupper($data->v_asset_classification);
        $v_asset_room_no = strtoupper($data->v_asset_room_no);
        $v_asset_purchase_dt = strtoupper($data->v_asset_purchase_dt);
        $v_asset_warranty_dt = strtoupper($data->v_asset_warranty_dt);
        $v_asset_vendor_id = strtoupper($data->v_asset_vendor_id);
        $v_asset_vendor_name = strtoupper($data->v_asset_vendor_name);
        $v_asset_useful_life = strtoupper($data->v_asset_useful_life);
        $v_asset_service_dt = strtoupper($data->v_asset_service_dt);
        $v_asset_service_by = strtoupper($data->v_asset_service_by);
        $v_asset_cert_ind = strtoupper($data->v_asset_cert_ind);
        $v_asset_cert_no = strtoupper($data->v_asset_cert_no);
        $v_asset_added_by = strtoupper($data->v_asset_added_by);
            
       

        // echo $USERNAME.$ASSET_NO.$LOCATION.$ROOM.$RESULT;

        $sql = "BEGIN amsd.asset_create(:v_asset_class,:v_assets,:v_asset_model,:v_asset_classification,:v_asset_room_no,:v_asset_purchase_dt,:v_asset_warranty_dt,:v_asset_vendor_id,:v_asset_vendor_name,:v_asset_useful_life,:v_asset_service_dt,:v_asset_service_by,:v_asset_cert_ind,:v_asset_cert_no,:v_asset_added_by,:v_out); END;";               


        $statement = oci_parse($connect,$sql);
        // oci_bind_by_name($statement, ':USERNAME', $USERNAME, 30);
        oci_bind_by_name($statement, ':v_asset_class', $v_asset_class, 50);
        oci_bind_by_name($statement, ':v_assets', $v_assets, 4000);
        oci_bind_by_name($statement, ':v_asset_model', $v_asset_model, 50);
        oci_bind_by_name($statement, ':v_asset_classification', $v_asset_classification, 50);
        oci_bind_by_name($statement, ':v_asset_room_no', $v_asset_room_no, 50);
        oci_bind_by_name($statement, ':v_asset_purchase_dt', $v_asset_purchase_dt, 50);
        oci_bind_by_name($statement, ':v_asset_warranty_dt', $v_asset_warranty_dt, 50);
        oci_bind_by_name($statement, ':v_asset_vendor_id', $v_asset_vendor_id, 50);
        oci_bind_by_name($statement, ':v_asset_vendor_name', $v_asset_vendor_name, 50);
        oci_bind_by_name($statement, ':v_asset_useful_life', $v_asset_useful_life, 50);
        oci_bind_by_name($statement, ':v_asset_service_dt', $v_asset_service_dt, 50);
        oci_bind_by_name($statement, ':v_asset_service_by', $v_asset_service_by, 50);
        oci_bind_by_name($statement, ':v_asset_cert_ind', $v_asset_cert_ind, 50);
        oci_bind_by_name($statement, ':v_asset_cert_no', $v_asset_cert_no, 50);
        oci_bind_by_name($statement, ':v_asset_added_by', $v_asset_added_by, 50);
        oci_bind_by_name($statement, ':v_out', $add_assets, 2);

        oci_execute($statement , OCI_NO_AUTO_COMMIT);

        oci_commit($connect);

        if($add_assets == "y"){
            echo json_encode(array("rows" => 0 ,"data" =>"ASSETS ADDED WAS SUCCESSFUL"));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"ASSETS WAS NOT SUCCESSFUL"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
    

});

$app->run();
