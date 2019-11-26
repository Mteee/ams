<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require './vendor/autoload.php';
require './inc/functions.php';


$app = new \Slim\App;
$func = new Functions();

/**
 * View Filters
 */

$app->map(['GET','POST'],'/asset_primary_view_v', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $sub_location = strtoupper($data->sub_location);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $asset_class = strtoupper($data->asset_class);
    $asset_area_name = strtoupper($data->asset_area_name);

    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT ASSET_ID
            FROM (SELECT DISTINCT
                        L_NEW.ASSET_ROOM_NO,
                        L_NEW.HD_ASSET_ROOM_LOCATION,
                        L_NEW.ASSET_AREA_NAME,
                        L_NEW.ASSET_AREA,
                        L_NEW.ASSET_LEVEL,
                        L_NEW.ASSET_BUILDING,
                        NVL (A_OLD.ASSET_ID, 'NO DATA')
                            AS ASSET_ID,
                        NVL (A_OLD.ASSET_CLASS, 'NO DATA')
                            AS ASSET_CLASS,
                        NVL (L_NEW.HD_ASSET_ROOM_LOCATION, 'NO DATA')
                            AS ASSET_SUB_LOCATION
                FROM AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS A_OLD
                WHERE     L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
                AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+))
                WHERE     (ASSET_CLASS LIKE '%$asset_class%' OR ASSET_CLASS = 'NO DATA')
                AND (ASSET_BUILDING LIKE '%$building%')
                AND (ASSET_SUB_LOCATION LIKE '%$sub_location%')
                AND (ASSET_LEVEL LIKE '%$level%')
                AND (ASSET_AREA_NAME LIKE '%$area%')
                AND (ASSET_AREA LIKE '%$asset_area_name%' OR ASSET_AREA IS NULL)
                AND (ASSET_ID LIKE '%$asset_primary_id%')
                AND (ASSET_ROOM_NO LIKE '%$room_no%')
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

$app->map(['GET','POST'],'/asset_sub_location_view_v', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $asset_class = strtoupper($data->asset_class);
    $asset_area_name = strtoupper($data->asset_area_name);

    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    // $sql = "SELECT 
    //             A_OLD.ASSET_SUB_LOCATION
    //         FROM 
    //             AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
    //         WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
    //         AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
    //         AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
    //         AND L_NEW.ASSET_BUILDING LIKE '%$building%'
    //         AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%' OR A_OLD.ASSET_CLASS IS NULL)
    //         AND L_NEW.ASSET_LEVEL LIKE '%$level%'
    //         AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
    //         AND (L_NEW.ASSET_AREA LIKE '%$asset_area_name%' OR L_NEW.ASSET_AREA IS NULL)
    //         AND (A_OLD.ASSET_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_ID IS NULL)
    //         AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
    //         --AND A_OLD.ASSET_STATUS = '1'
    //         GROUP BY A_OLD.ASSET_SUB_LOCATION
    //         ORDER BY A_OLD.ASSET_SUB_LOCATION";

            $sql = "SELECT ASSET_SUB_LOCATION
            FROM (SELECT DISTINCT
                        L_NEW.ASSET_ROOM_NO,
                        L_NEW.HD_ASSET_ROOM_LOCATION,
                        L_NEW.ASSET_AREA_NAME,
                        L_NEW.ASSET_AREA,
                        L_NEW.ASSET_LEVEL,
                        L_NEW.ASSET_BUILDING,
                        NVL (A_OLD.ASSET_ID, 'NO DATA')
                            AS ASSET_ID,
                        NVL (A_OLD.ASSET_CLASS, 'NO DATA')
                            AS ASSET_CLASS,
                        NVL (L_NEW.HD_ASSET_ROOM_LOCATION, 'NO DATA')
                            AS ASSET_SUB_LOCATION
                FROM AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS A_OLD
                WHERE     L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
                AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+))
                WHERE     (ASSET_CLASS LIKE '%$asset_class%' OR ASSET_CLASS = 'NO DATA')
                AND (ASSET_BUILDING LIKE '%$building%')
                AND (ASSET_SUB_LOCATION LIKE '%$sub_location%')
                AND (ASSET_LEVEL LIKE '%$level%')
                AND (ASSET_AREA_NAME LIKE '%$area%')
                AND (ASSET_AREA LIKE '%$asset_area_name%' OR ASSET_AREA IS NULL)
                AND (ASSET_ID LIKE '%$asset_primary_id%')
                AND (ASSET_ROOM_NO LIKE '%$room_no%')
                AND substr(ASSET_SUB_LOCATION,1,2) in ('VL','SW','AL','SC','SA','PL','AP')   

        --AND A_OLD.ASSET_STATUS = '1'
                    GROUP BY ASSET_SUB_LOCATION
                    ORDER BY ASSET_SUB_LOCATION";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = 0;
        foreach($res->data as $value){
            $length++;
            $response []= $value->ASSET_SUB_LOCATION;
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

$app->map(['GET','POST'],'/asset_room_no_view_v', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $sub_location = strtoupper($data->sub_location);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $asset_class = strtoupper($data->asset_class);
    $asset_area_name = strtoupper($data->asset_area_name);

    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT L_NEW.ASSET_ROOM_NO
            FROM 
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%')
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (L_NEW.ASSET_AREA LIKE '%$asset_area_name%' OR L_NEW.ASSET_AREA IS NULL)
            AND (A_OLD.ASSET_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_ID IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            --AND A_OLD.ASSET_STATUS = '1'
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

$app->map(['GET','POST'],'/asset_area_view_v', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $sub_location = strtoupper($data->sub_location);
    $asset_class = strtoupper($data->asset_class);
    $asset_area_name = strtoupper($data->asset_area_name);

    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                L_NEW.ASSET_AREA_NAME 
            FROM 
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%')
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (L_NEW.ASSET_AREA LIKE '%$asset_area_name%' OR L_NEW.ASSET_AREA IS NULL)
            AND (A_OLD.ASSET_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_ID IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            ---AND A_OLD.ASSET_STATUS = '1'
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

$app->map(['GET','POST'],'/asset_area_name_view_v', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $sub_location = strtoupper($data->sub_location);
    $asset_class = strtoupper($data->asset_class);
    $asset_area_name = strtoupper($data->asset_area_name);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                L_NEW.ASSET_AREA 
            FROM 
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%')
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (L_NEW.ASSET_AREA LIKE '%$asset_area_name%' OR L_NEW.ASSET_AREA IS NULL)
            AND (A_OLD.ASSET_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_ID IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            ---AND A_OLD.ASSET_STATUS = '1'
            GROUP BY L_NEW.ASSET_AREA
            ORDER BY L_NEW.ASSET_AREA";

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

$app->map(['GET','POST'],'/asset_level_new_view_v', function(Request $request, Response $response){
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
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%')
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (A_OLD.ASSET_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_ID IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            --AND A_OLD.ASSET_STATUS = '1'
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

$app->map(['GET','POST'],'/building_view_v', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $asset_class = strtoupper($data->asset_class);
    $asset_area_name = strtoupper($data->asset_area_name);

    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                L_NEW.ASSET_BUILDING
            FROM 
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%')
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (L_NEW.ASSET_AREA LIKE '%$asset_area_name%' OR L_NEW.ASSET_AREA IS NULL)
            AND (A_OLD.ASSET_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_ID IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            --AND A_OLD.ASSET_STATUS = '1'
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

 /**
 * End View Filters/Search Options
 */

/**
 * Dashboard filters
 */

$app->map(['GET','POST'],'/asset_primary_dashboard_filters', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $sub_location = strtoupper($data->sub_location);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $asset_class = strtoupper($data->asset_class);
    $asset_area_name = strtoupper($data->asset_area_name);

    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT ASSET_ID
            FROM (SELECT DISTINCT
                        L_NEW.ASSET_ROOM_NO,
                        L_NEW.HD_ASSET_ROOM_LOCATION,
                        L_NEW.ASSET_AREA_NAME,
                        L_NEW.ASSET_AREA,
                        L_NEW.ASSET_LEVEL,
                        L_NEW.ASSET_BUILDING,
                        NVL (A_OLD.ASSET_ID, 'NO DATA')
                            AS ASSET_ID,
                        NVL (A_OLD.ASSET_CLASS, 'NO DATA')
                            AS ASSET_CLASS,
                        NVL (L_NEW.HD_ASSET_ROOM_LOCATION, 'NO DATA')
                            AS ASSET_SUB_LOCATION
                FROM AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS A_OLD
                WHERE     L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
                AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+))
                WHERE     (ASSET_CLASS LIKE '%$asset_class%' OR ASSET_CLASS = 'NO DATA')
                AND (ASSET_BUILDING LIKE '%$building%')
                AND (ASSET_SUB_LOCATION LIKE '%$sub_location%')
                AND (ASSET_LEVEL LIKE '%$level%')
                AND (ASSET_AREA_NAME LIKE '%$area%')
                AND (ASSET_AREA LIKE '%$asset_area_name%' OR ASSET_AREA IS NULL)
                AND (ASSET_ID LIKE '%$asset_primary_id%')
                AND (ASSET_ROOM_NO LIKE '%$room_no%')
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

$app->map(['GET','POST'],'/asset_sub_location_dashboard_filters', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $asset_class = strtoupper($data->asset_class);
    $asset_area_name = strtoupper($data->asset_area_name);

    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    // $sql = "SELECT 
    //             A_OLD.ASSET_SUB_LOCATION
    //         FROM 
    //             AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
    //         WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
    //         AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
    //         AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
    //         AND L_NEW.ASSET_BUILDING LIKE '%$building%'
    //         AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%' OR A_OLD.ASSET_CLASS IS NULL)
    //         AND L_NEW.ASSET_LEVEL LIKE '%$level%'
    //         AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
    //         AND (L_NEW.ASSET_AREA LIKE '%$asset_area_name%' OR L_NEW.ASSET_AREA IS NULL)
    //         AND (A_OLD.ASSET_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_ID IS NULL)
    //         AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
    //         --AND A_OLD.ASSET_STATUS = '1'
    //         GROUP BY A_OLD.ASSET_SUB_LOCATION
    //         ORDER BY A_OLD.ASSET_SUB_LOCATION";

            $sql = "SELECT ASSET_SUB_LOCATION
            FROM (SELECT DISTINCT
                        L_NEW.ASSET_ROOM_NO,
                        L_NEW.HD_ASSET_ROOM_LOCATION,
                        L_NEW.ASSET_AREA_NAME,
                        L_NEW.ASSET_AREA,
                        L_NEW.ASSET_LEVEL,
                        L_NEW.ASSET_BUILDING,
                        NVL (A_OLD.ASSET_ID, 'NO DATA')
                            AS ASSET_ID,
                        NVL (A_OLD.ASSET_CLASS, 'NO DATA')
                            AS ASSET_CLASS,
                        NVL (L_NEW.HD_ASSET_ROOM_LOCATION, 'NO DATA')
                            AS ASSET_SUB_LOCATION
                FROM AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS A_OLD
                WHERE     L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
                AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+))
                WHERE     (ASSET_CLASS LIKE '%$asset_class%' OR ASSET_CLASS = 'NO DATA')
                AND (ASSET_BUILDING LIKE '%$building%')
                AND (ASSET_SUB_LOCATION LIKE '%$sub_location%')
                AND (ASSET_LEVEL LIKE '%$level%')
                AND (ASSET_AREA_NAME LIKE '%$area%')
                AND (ASSET_AREA LIKE '%$asset_area_name%' OR ASSET_AREA IS NULL)
                AND (ASSET_ID LIKE '%$asset_primary_id%')
                AND (ASSET_ROOM_NO LIKE '%$room_no%')
                AND substr(ASSET_SUB_LOCATION,1,2) in ('VL','SW','AL','SC','SA','PL','AP')   
                --AND A_OLD.ASSET_STATUS = '1'
                    GROUP BY ASSET_SUB_LOCATION
                    ORDER BY ASSET_SUB_LOCATION";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = 0;
        foreach($res->data as $value){
            $length++;
            $response []= $value->ASSET_SUB_LOCATION;
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

$app->map(['GET','POST'],'/asset_room_no_dashboard_filters', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $sub_location = strtoupper($data->sub_location);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $asset_class = strtoupper($data->asset_class);
    $asset_area_name = strtoupper($data->asset_area_name);

    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT L_NEW.ASSET_ROOM_NO
            FROM 
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%')
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (L_NEW.ASSET_AREA LIKE '%$asset_area_name%' OR L_NEW.ASSET_AREA IS NULL)
            AND (A_OLD.ASSET_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_ID IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            --AND A_OLD.ASSET_STATUS = '1'
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

$app->map(['GET','POST'],'/asset_area_dashboard_filters', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $sub_location = strtoupper($data->sub_location);
    $asset_class = strtoupper($data->asset_class);
    $asset_area_name = strtoupper($data->asset_area_name);

    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                L_NEW.ASSET_AREA_NAME 
            FROM 
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%')
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (L_NEW.ASSET_AREA LIKE '%$asset_area_name%' OR L_NEW.ASSET_AREA IS NULL)
            AND (A_OLD.ASSET_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_ID IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            ---AND A_OLD.ASSET_STATUS = '1'
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

$app->map(['GET','POST'],'/asset_area_name_dashboard_filters', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $sub_location = strtoupper($data->sub_location);
    $asset_class = strtoupper($data->asset_class);
    $asset_area_name = strtoupper($data->asset_area_name);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                L_NEW.ASSET_AREA 
            FROM 
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%')
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (L_NEW.ASSET_AREA LIKE '%$asset_area_name%' OR L_NEW.ASSET_AREA IS NULL)
            AND (A_OLD.ASSET_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_ID IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            ---AND A_OLD.ASSET_STATUS = '1'
            GROUP BY L_NEW.ASSET_AREA
            ORDER BY L_NEW.ASSET_AREA";

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

$app->map(['GET','POST'],'/asset_level_new_dashboard_filters', function(Request $request, Response $response){
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
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%')
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (A_OLD.ASSET_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_ID IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            --AND A_OLD.ASSET_STATUS = '1'
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

$app->map(['GET','POST'],'/building_dashboard_filters', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $asset_primary_id = strtoupper($data->asset_primary_id);
    $asset_class = strtoupper($data->asset_class);
    $asset_area_name = strtoupper($data->asset_area_name);

    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                L_NEW.ASSET_BUILDING
            FROM 
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%')
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (L_NEW.ASSET_AREA LIKE '%$asset_area_name%' OR L_NEW.ASSET_AREA IS NULL)
            AND (A_OLD.ASSET_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_ID IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            --AND A_OLD.ASSET_STATUS = '1'
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

/**
 * End Dashboard Filters
 */

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
    $asset_area_name = strtoupper($data->asset_area_name);

    $response = array();

    if(!empty($building) || !empty($level) || !empty($area) || !empty($ASSET_DESCRIPTION) || !empty($ASSET_CLASS)){

        if($ASSET_CLASS == 'ALL EQUIPMENT'){
            $ASSET_CLASS = '';
        }
        
        $sql = "SELECT ASSET_CLASS,ASSET_SUB_LOCATION,ASSET_ID,ASSET_ROOM_NO,ASSET_AREA,ASSET_DESCRIPTION,ASSET_STATUS,ASSET_HAS_SUB_ASSETS
        FROM AMSD.ASSETS_VW
        WHERE ASSET_BUILDING LIKE '%$building%' 
        AND ASSET_LEVEL LIKE '%$level%' 
        AND ASSET_ROOM_NO LIKE '%$room_no%' 
        AND ASSET_AREA_NAME LIKE '%$area%'  
        AND ASSET_CLASSIFICATION LIKE '%$ASSET_DESCRIPTION%' 
        AND ASSET_CLASS LIKE '%$ASSET_CLASS%' 
        AND ASSET_SUB_LOCATION LIKE '%$sub_location%' 
        AND ASSET_AREA LIKE '%$asset_area_name%' 
        AND ASSET_ID LIKE '%$asset_primar_id%'"; 
        // AND ASSET_ID=ASSET_PRIMARY_ID";

        // $sql = "SELECT * FROM AMSD.ASSETS_VW";

        $assets =$func->executeQuery($sql);

        if($assets){
            // echo $assets;

            $assets_decode = json_decode($assets);

            // print_r($assets_decode);


            $len = $assets_decode->rows;

            // echo $len;
            $str = '{"data" : [';
                for ($k = 0; $k < $len; $k++) {
                    if (($len - 1) == $k){

                        $str .= '["' . $assets_decode->data[$k]->ASSET_ID . '","';
                        $str .= $assets_decode->data[$k]->ASSET_ID . '","';
                        $str .= $assets_decode->data[$k]->ASSET_SUB_LOCATION . '","';
                        $str .= $assets_decode->data[$k]->ASSET_ROOM_NO . '","';
                        $str .= $assets_decode->data[$k]->ASSET_AREA . '","';
                        $str .= str_replace("\"", "`", $assets_decode->data[$k]->ASSET_DESCRIPTION) . '","';
                        $str .= $func->assetStatus($assets_decode->data[$k]->ASSET_STATUS) . '","';
                        $str .= $func->updateLetterToWords($assets_decode->data[$k]->ASSET_HAS_SUB_ASSETS) . '"]';
                    } else {

                        $str .= '["' . $assets_decode->data[$k]->ASSET_ID . '","';
                        $str .= $assets_decode->data[$k]->ASSET_ID . '","';
                        $str .= $assets_decode->data[$k]->ASSET_SUB_LOCATION . '","';
                        $str .= $assets_decode->data[$k]->ASSET_ROOM_NO . '","';
                        $str .= $assets_decode->data[$k]->ASSET_AREA . '","';
                        $str .= str_replace("\"", "`", $assets_decode->data[$k]->ASSET_DESCRIPTION) . '","';
                        $str .= $func->assetStatus($assets_decode->data[$k]->ASSET_STATUS) . '","';
                        $str .= $func->updateLetterToWords($assets_decode->data[$k]->ASSET_HAS_SUB_ASSETS) . '"],';
                    }
                }

                $str .= ']}';

                $str = str_replace("\n", "", $str);
                $str = str_replace("\\", "", $str);

                echo json_encode(array("rows" =>$len ,"data" => $str ));
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
// 
        // $sql = "SELECT * FROM AMSD.ASSETS_VW WHERE ASSET_ID='$ASSET_NO' OR ASSET_PRIMARY_ID='$ASSET_NO' ORDER BY ASSET_PRIMARY_ID";
        $sql = "SELECT * FROM AMSD.ASSETS_VW WHERE ASSET_PRIMARY_ID IN ('$ASSET_NO') OR ASSET_ID IN ('$ASSET_NO') ORDER BY CASE WHEN ASSET_ID = ASSET_PRIMARY_ID THEN 1 END";

        $assets =$func->executeQuery($sql);

        if($assets){
            $results = json_decode($assets);
            $loc = $results->data[0]->ASSET_AREA;
            $room = $results->data[0]->ASSET_ROOM_NO;
            $sub = '
            <table class="table-bordered" id="viewAssetTable1" style="width:100%;border-radius: 5px;border-raduis:20px;">
            <thead>
                <tr>
                    <div class="asset-header text-center" style="font-weight:bolder;font-size:13pt !important;">
                        Asset# '.$func->replaceNull($results->data[0]->ASSET_ID).'
                    </div>
                </tr>
            </thead>
            <tbody id="asset-info">
                <tr>
                    <th style="width:25%" class="theading">ASSET CLASS</th>
                    <td style="width:25%">'.$func->replaceNull($results->data[0]->ASSET_CLASS).'</td>
                    <th style="width:25%" class="theading">PRIMARY ID</th>
                    <td style="width:25%">'.$func->replaceNull($results->data[0]->ASSET_PRIMARY_ID).'</td>
                </tr>
                <tr>
                    <th style="width:25%" class="theading">BUILDING </th>
                    <td style="width:25%">'.$func->replaceNull($results->data[0]->ASSET_BUILDING).'</td>
                    <th style="width:25%" class="theading">ASSET ID </th>
                    <td style="width:25%">'.$func->replaceNull($results->data[0]->ASSET_ID).'</td>
                </tr>
                <tr>
                    <th style="width:25%" class="theading">LEVEL </th>
                    <td style="width:25%"><span>'.$func->replaceNull($results->data[0]->ASSET_LEVEL).'</span></td>
                    <th style="width:25%" class="theading">MODEL </th>
                    <td style="width:25%"><span>'.$func->replaceNull($results->data[0]->ASSET_MODEL).'</span></td>
                </tr>
                <tr>
                    <th style="width:25%" class="theading">AREA </th>
                    <td style="width:25%"><span>'.$func->replaceNull($results->data[0]->ASSET_AREA).'</span></td>
                    <th style="width:25%" class="theading">DESCRIPTION </th>
                    <td style="width:25%"><span>'.$func->replaceNull($results->data[0]->ASSET_DESCRIPTION).'</span></td>
                </tr>
                <tr>
                    <th style="width:25%" class="theading">AREA NAME </th>
                    <td style="width:25%"><span>'.$func->replaceNull($results->data[0]->ASSET_AREA_NAME).'</span></td>
                    <th style="width:25%" class="theading">CLASSIFICATION </th>
                    <td style="width:25%"><span>'.$func->replaceNull($results->data[0]->ASSET_CLASSIFICATION).'</span></td>
                </tr>
                <tr>
                    <th style="width:25%" class="theading">ROOM </th>
                    <td style="width:25%"><span>'.$func->replaceNull($results->data[0]->ASSET_ROOM_NO).'</span></td>
                    <th style="width:25%" class="theading">SERVICE BY </th>
                    <td style="width:25%"><span>'.$func->replaceNull($results->data[0]->ASSET_SERVICE_BY).'</span></td>
                </tr>
                <tr>
                    <th style="width:25%" class="theading">SUB LOCATION </th>
                    <td style="width:25%"><span>'.$func->replaceNull($results->data[0]->ASSET_SUB_LOCATION).'</span></td>
                    <th style="width:25%" class="theading">STATUS </th>
                    <td style="width:25%"><span>'.$func->replaceNull($results->data[0]->ASSET_STATUS).'</span></td>
                </tr>
                <tr>
                    <th style="width:25%" class="theading">CERTIFICATE NUMBER </th>
                    <td style="width:25%"><span>'.$func->replaceNull($results->data[0]->ASSET_CERT_NO).'</span></td>
                    <th style="width:25%" class="theading">PRINT DATE </th>
                    <td style="width:25%"><span>'.$func->replaceNull($results->data[0]->ASSET_PRINT_DATE).'</span></td>
                </tr>
                <tr>
                    <th style="width:25%" class="theading">CREATION DATE </th>
                    <td style="width:25%"><span>'.$func->replaceNull($results->data[0]->ASSET_CREATE_DT).'</span></td>
                    <th style="width:25%" class="theading">TRANSACTION STATUS </th>
                    <td style="width:25%"><span>'.$func->replaceNull($results->data[0]->ASSET_TRANSACTION_STATUS).'</span></td>
                </tr>
                <tr>
                    <th style="width:25%" class="theading">IS PRIMARY? </th>
                    <td style="width:25%"><span>'.$func->updateLetterToIcon($func->replaceNull($results->data[0]->ASSET_HAS_SUB_ASSETS)).'</span></td>
                    <th style="width:25%" class="theading">IS SUB ASSET? </th>
                    <td style="width:25%"><span>'.$func->updateLetterToIcon($func->replaceNull($results->data[0]->ASSET_IS_SUB)).'</span></td>
                </tr>
            </tbody>
        </table>
        <p style="font-weight:bolder;font-size:13pt !important;padding-top: 10px !important;" class="text-center"> Sub Assets</p>
        <div class="test-scroll">
            <table id="viewAssetTable2" class="table-bordered table-striped">
                <thead>
                    <tr style="" class="text-light">
                        <th style="width:35%" class="theading-sub bg-dark text-left">ASSET ID</th>
                        <th style="width:55%" class="theading-sub bg-dark text-left">Description</th>
                        <th style="width:10%" class="theading-sub bg-dark text-left">View Asset</th>
                    </tr>
                </thead>
                <tbody id="asset-info">
                    ';

            // $sql = "SELECT * FROM AMSD.ASSETS_VW WHERE ASSET_PRIMARY_ID='$ASSET_NO'";
            // $assets =$func->executeQuery($sql);
            // $results = json_decode($assets);
            foreach($results->data as $res){

                // echo $res->ASSET_ID.'<br>';
                
                if($ASSET_NO != $res->ASSET_ID){
                //    TO-Do Limit description length
                $sub .= '<tr>
                                <td style="width:35%">'.$res->ASSET_ID.'</td>
                                <td style="width:55%">'.$res->ASSET_DESCRIPTION.' - '.$res->ASSET_CLASSIFICATION.'</td>
                                <td style="width:10%" class="text-center"><button type="button" class="btn btn-primary" onclick="viewAsset(\''.$res->ASSET_ID.'\')"><span class="fa fa-eye"></span></button></td>
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
                            <td colspan="3"><p class="text-muted py-4">No sub assets found</p></td>
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
        else{
            $sql = "SELECT * FROM AMSD.ASSETS_VW WHERE ASSET_ID='$ASSET_NO'";

            $assets =$func->executeQuery($sql);

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
                        <th class="theading">Asset ID </th>
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
                <tr class="text-center py-4">
                <td colspan="2"><p class="text-muted py-4">No sub assets found</p></td>
            </tr>
        </tbody>
        </table>   
        </div>
        ';
 
            array_push($response,array("items"=>$count,"table"=>$sub));
            echo json_encode($response);
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

        $sql = "SELECT * FROM AMSD.ASSETS WHERE ASSET_SUB_LOCATION='$ASSET_NO'";

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
                $sub .= '<tr>
                                <td>'.$res->ASSET_ID.'</td>
                                <td>'.$res->ASSET_CLASSIFICATION.'</td>
                                <td>';               
                                
                                $sub .= ($res->ASSET_ID == $res->ASSET_PRIMARY_ID) ? 
                                       '' //  '<button class="btn btn-danger" onclick="unlinkPrimary()"><i class="fa fa-chain-broken"></i></button></td>'
                                :  
                                        '<button class="btn btn-info" onclick="unlinkSub(\''.$res->ASSET_ID.'\')"><i class="fa fa-chain-broken"></i></button></td>';

                                $sub .=  '</tr>';

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
            $sql = "SELECT * FROM AMSD.ASSETS_LOCATION WHERE HD_ASSET_ROOM_LOCATION='$ASSET_NO'";
    
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

        $sql = "SELECT ASSET_ID || '|' || ASSET_CLASSIFICATION ||' - '||ASSET_DESCRIPTION  AS A_A FROM AMSD.ASSETS WHERE ASSET_SUB_LOCATION='$ASSET_NO'";

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

        $sql_query = "SELECT ASSET_USER_CLASS,ASSET_USER_ROLES,ASSET_USER_STATUS FROM AMSD.ASSETS_USER WHERE ASSET_USERNAME='$username' AND ASSET_USER_STATUS = '1'";
        
        $results =$func->executeQuery($sql_query);

        if($results){
            $decoded_res = json_decode($results);
            $filter = $decoded_res->data[0]->ASSET_USER_CLASS;
            $role = $decoded_res->data[0]->ASSET_USER_ROLES;
            $status = $decoded_res->data[0]->ASSET_USER_STATUS;

            array_push($response,array("filter"=>$filter,"role"=>$role,"status"=>$status));
            return json_encode($response);
        }
        else{
            $filter = "ALL EQUIPMENT";
            //$func->closeConnection($results);
            $func->executeNonQuery("INSERT INTO AMSD.ASSETS_USER VALUES('$username','N/A','ALL EQUIPMENT',sysdate,'system added','V|M','1')");
            array_push($response,array("filter"=>$filter,"role"=>"V|M","status"=>"1"));
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

$app->map(['GET','POST'],'/assetCert_print',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    // $ASSET_CLASS = strtoupper($data->asset_class);
    $cert_no = strtoupper($data->cert);
    // $ASSET_NO = strtoupper($data->type);

    // if($ASSET_CLASS == 'ALL EQUIPMENT'){
    //     $ASSET_CLASS = '';
    // }


    $sql = "     SELECT DISTINCT a_vw.ASSET_MODEL,
                                a_vw.ASSET_PRIMARY_ID,
                                a_vw.HD_ASSET_LOCATION,
                                a_vw.ASSET_ID,
                                a_vw.ASSET_ROOM_NO,
                                a_vw.ASSET_AREA_NAME,
                                a_vw.ASSET_CLASSIFICATION,
                                a_vw.ASSET_DESCRIPTION,
                                a_vw.ASSET_PURCHASE_DT,
                                a_vw.ASSET_IS_SUB,
                                a_vw.ASSET_DISPOSAL_DT,
                                a_cert.ASSET_CERTIFICATE_NO,
                                a_cert.ASSET_CERTIFICATE_TYPE,
                                a_cert.ASSET_CERTIFICATE_CREATION_DATE,
                                a_vw.ASSET_CLASS,
                                aci.ASSET_BOQ_REFERENCE,
                                aci.ASSET_SP_INV_NO,
                                aci.ASSET_REFERENCE
                            FROM AMSD.ASSETS_vw a_vw, AMSD.ASSETS_CERTIFICATE a_cert, AMSD.ASSETS_CERTIFICATE_INFO aci
                            WHERE  a_vw.ASSET_CERT_NO = a_cert.ASSET_CERTIFICATE_NO
                            AND    aci.ASSET_CERTIFICATE_INFO_DATE = (SELECT ASSET_CERTIFICATE_INFO_DATE
                                                                    FROM (SELECT ASSET_CERTIFICATE_INFO_DATE
                                                                FROM AMSD.ASSETS_CERTIFICATE_INFO 
                                                                WHERE ASSET_CERTIFICATE_NO = '$cert_no' 
                                                                ORDER BY ASSET_CERTIFICATE_INFO_DATE DESC)
                                                                WHERE ROWNUM = 1)
                            AND a_vw.ASSET_CERT_NO = '$cert_no'";


    $assets_no =$func->executeQuery($sql);

    if($assets_no){

         echo $assets_no;
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>[]));

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

    $sql = "SELECT ASSET_AREA_NAME AS ASSET_AREA,ASSET_ROOM_NO,ASSET_PRIMARY_ID,ASSET_ID,ASSET_DESCRIPTION,ASSET_IS_SUB,AMSD.fn_asset_has_subs(ASSET_ID) AS PRI_HAS_SUB
    FROM AMSD.ASSETS_VW
    WHERE ASSET_CLASS LIKE '%$ASSET_CLASS%'
    AND ASSET_PRIMARY_ID IN ($ASSET_NO)
    order by asset_primary_id, asset_is_sub, asset_id";

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
    $rowIds = array();

    if(!empty($level) || !empty($building) || !empty($ASSET_DESCRIPTION) || !empty($ASSET_CLASS) || !empty($room_no) || !empty($area)){

        if($ASSET_CLASS == 'ALL EQUIPMENT'){
            $ASSET_CLASS = '';
        }
        $sql = "SELECT ASSET_ID,ASSET_CLASS,ASSET_ROOM_NO,ASSET_AREA_NAME AS ASSET_AREA,ASSET_SUB_LOCATION,ASSET_DESCRIPTION ||' - ' || ASSET_CLASSIFICATION AS ASSET_DESCRIPTION,ASSET_TRANSACTION_STATUS,ASSET_IS_SUB,ASSET_HAS_SUB_ASSETS,ASSET_TRANSACTION_STATUS AS ASSET_STATUS 
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
            $assets = json_decode($assets);
            $len = $assets->rows;
            $str = '{"data" : [';
                for ($k = 0; $k <  $len; $k++) {
                  
                    if ($assets->data[$k]->ASSET_TRANSACTION_STATUS == "PENDING" || $assets->data[$k]->ASSET_TRANSACTION_STATUS == "PENDING-TEMP") {
                        // console.log($assets->data[$k]->ASSET_PRIMARY_ID);
                        // echo $assets->data[$k]->ASSET_TRANSACTION_STATUS;
                        array_push($rowIds,$assets->data[$k]->ASSET_ID);
                    }

                    if (($assets->rows - 1) == $k) {

                        $str .= '["' . $assets->data[$k]->ASSET_ID . '","';
                        $str .= $assets->data[$k]->ASSET_ID . '","';
                        $str .= $func->isSpecified($assets->data[$k]->ASSET_SUB_LOCATION) . '","';
                        $str .= $func->isSpecified($assets->data[$k]->ASSET_ROOM_NO) . '","';
                        $str .= $assets->data[$k]->ASSET_AREA . '","';
                        $str .= $assets->data[$k]->ASSET_DESCRIPTION . '","';
                        $str .= $assets->data[$k]->ASSET_STATUS . '","';
                        $str .= $func->updateLetterToWords($assets->data[$k]->ASSET_HAS_SUB_ASSETS) . '"]';

                    } else {

                        $str .= '["' . $assets->data[$k]->ASSET_ID . '","';
                        $str .= $assets->data[$k]->ASSET_ID . '","';
                        $str .= $func->isSpecified($assets->data[$k]->ASSET_SUB_LOCATION) . '","';
                        $str .= $func->isSpecified($assets->data[$k]->ASSET_ROOM_NO) . '","';
                        $str .= $assets->data[$k]->ASSET_AREA . '","';
                        $str .= $assets->data[$k]->ASSET_DESCRIPTION . '","';
                        $str .= $assets->data[$k]->ASSET_STATUS . '","';
                        $str .= $func->updateLetterToWords($assets->data[$k]->ASSET_HAS_SUB_ASSETS) . '"],';

                    }
                }

                $str .= ']}';
                $str = str_replace("\n", "", $str);
                $str = str_replace(' 14"', "14`", $str);
                $str = str_replace(' 26"', "26`", $str);
                $str = str_replace(' 18"', " 18`", $str);
                $str = str_replace("\r", "", $str);
                $str = str_replace("\\", "", $str);


                echo json_encode(array("rows" =>$len ,"data" => $str ,"rowsID" => $rowIds));

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
    $rowIds = array();

    if(!empty($level) || !empty($building) || !empty($ASSET_DESCRIPTION) || !empty($ASSET_CLASS) || !empty($room_no) || !empty($area)){

        if($ASSET_CLASS == 'ALL EQUIPMENT'){
            $ASSET_CLASS = '';
        }
        
        $sql = "SELECT  avw.asset_primary_id  as ASSET_ID,
                        lvw.asset_room_no_new as ASSET_ROOM_NO,
                        lvw.asset_location_area_new as ASSET_AREA,
                        avw.asset_class, 
                        lvw.asset_sub_location_new as ASSET_SUB_LOCATION,
                        avw.asset_description as asset_description,
                        asset_is_sub as asset_is_sub,
                        avw.ASSET_TRANSACTION_STATUS AS ASSET_STATUS
                FROM AMSD.assets_log_pending_vw lvw, AMSD.assets_vw avw
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

            // echo $assets;
            $assets = json_decode($assets);
            // print_r($assets);
            $len = $assets->rows;
            $str = '{"data" : [';
                for ($k = 0; $k <  $len; $k++) {

                    if (($assets->rows - 1) == $k) {

                        $str .= '["' . $assets->data[$k]->ASSET_ID . '","';
                        $str .= $assets->data[$k]->ASSET_ID . '","';
                        $str .= $func->isSpecified($assets->data[$k]->ASSET_SUB_LOCATION) . '","';
                        $str .= $func->isSpecified($assets->data[$k]->ASSET_ROOM_NO) . '","';
                        $str .= $assets->data[$k]->ASSET_AREA . '","';
                        $str .= $assets->data[$k]->ASSET_DESCRIPTION . '","';
                        $str .= $assets->data[$k]->ASSET_STATUS . '","';
                        $str .= $func->updateLetterToWords($assets->data[$k]->ASSET_IS_SUB) . '"]';

                    } else {

                        $str .= '["' . $assets->data[$k]->ASSET_ID . '","';
                        $str .= $assets->data[$k]->ASSET_ID . '","';
                        $str .= $func->isSpecified($assets->data[$k]->ASSET_SUB_LOCATION) . '","';
                        $str .= $func->isSpecified($assets->data[$k]->ASSET_ROOM_NO) . '","';
                        $str .= $assets->data[$k]->ASSET_AREA . '","';
                        $str .= $assets->data[$k]->ASSET_DESCRIPTION . '","';
                        $str .= $assets->data[$k]->ASSET_STATUS . '","';
                        $str .= $func->updateLetterToWords($assets->data[$k]->ASSET_IS_SUB) . '"],';

                    }
                }

                $str .= ']}';
                $str = str_replace("\n", "", $str);
                $str = str_replace(' 14"', "14`", $str);
                $str = str_replace(' 26"', "26`", $str);
                $str = str_replace(' 18"', " 18`", $str);
                $str = str_replace("\r", "", $str);
                $str = str_replace("\\", "", $str);


                echo json_encode(array("rows" =>$len ,"data" => $str ,"rowsID" => $rowIds));
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
    $rowIds = array();

    if(!empty($level) || !empty($building) || !empty($ASSET_DESCRIPTION) || !empty($ASSET_CLASS) || !empty($room_no) || !empty($area)){

        if($ASSET_CLASS == 'ALL EQUIPMENT'){
            $ASSET_CLASS = '';
        }

        $sql = " SELECT avw.asset_primary_id as ASSET_ID,
                        lvw.asset_room_no_old as ASSET_ROOM_NO,
                        lvw.asset_location_area_old as ASSET_AREA,
                        avw.asset_sub_location  as asset_sub_location,
                        avw.asset_class as asset_class,
                        avw.asset_description as asset_description,
                        asset_is_sub as asset_is_sub,
                        avw.ASSET_TRANSACTION_STATUS AS ASSET_STATUS,
                        'OUT' as movement_type
                FROM AMSD.assets_log_pending_vw lvw, AMSD.assets_vw avw
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
            $assets = json_decode($assets);
            $len = $assets->rows;
            $str = '{"data" : [';
                for ($k = 0; $k <  $len; $k++) {
                  

                    if (($assets->rows - 1) == $k) {

                        $str .= '["' . $assets->data[$k]->ASSET_ID . '","';
                        $str .= $assets->data[$k]->ASSET_ID . '","';
                        $str .= $func->isSpecified($assets->data[$k]->ASSET_SUB_LOCATION) . '","';
                        $str .= $func->isSpecified($assets->data[$k]->ASSET_ROOM_NO) . '","';
                        $str .= $assets->data[$k]->ASSET_AREA . '","';
                        $str .= $assets->data[$k]->ASSET_DESCRIPTION . '","';
                        $str .= $assets->data[$k]->ASSET_STATUS . '","';
                        $str .= $func->updateLetterToWords($assets->data[$k]->ASSET_IS_SUB) . '"]';

                    } else {

                        $str .= '["' . $assets->data[$k]->ASSET_ID . '","';
                        $str .= $assets->data[$k]->ASSET_ID . '","';
                        $str .= $func->isSpecified($assets->data[$k]->ASSET_SUB_LOCATION) . '","';
                        $str .= $func->isSpecified($assets->data[$k]->ASSET_ROOM_NO) . '","';
                        $str .= $assets->data[$k]->ASSET_AREA . '","';
                        $str .= $assets->data[$k]->ASSET_DESCRIPTION . '","';
                        $str .= $assets->data[$k]->ASSET_STATUS . '","';
                        $str .= $func->updateLetterToWords($assets->data[$k]->ASSET_IS_SUB) . '"],';

                    }
                }

                $str .= ']}';
                $str = str_replace("\n", "", $str);
                $str = str_replace(' 14"', "14`", $str);
                $str = str_replace(' 26"', "26`", $str);
                $str = str_replace(' 18"', " 18`", $str);
                $str = str_replace("\r", "", $str);
                $str = str_replace("\\", "", $str);


                echo json_encode(array("rows" =>$len ,"data" => $str ,"rowsID" => $rowIds));
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
        oci_bind_by_name($statement, ':ASSET_NO', $assetIds, -1);
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
            echo json_encode(array("rows" => 1 ,"data" =>"TRANSFER WAS SUCCESSFUL"));
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

        $sql = "BEGIN AMSD.asset_cancel_movement(:USERNAME,:ASSET_NO,:RESULT); END;";
        $statement = oci_parse($connect,$sql);
        oci_bind_by_name($statement, ':USERNAME', $USERNAME, 30);
        oci_bind_by_name($statement, ':ASSET_NO', $ASSET_NO, -1);
        oci_bind_by_name($statement, ':RESULT', $RESULT, 2);

        oci_execute($statement , OCI_NO_AUTO_COMMIT);

        oci_commit($connect);

        if($RESULT == "y"){
            echo json_encode(array("rows" => 1 ,"data" =>"CANCEL WAS SUCCESSFUL"));
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
        oci_bind_by_name($statement, ':ASSET_NO', $ASSET_NO, -1);
        oci_bind_by_name($statement, ':ROOM', $ROOM, 30);
        oci_bind_by_name($statement, ':SUB', $sub_location, 30);
        oci_bind_by_name($statement, ':RESULT', $RESULT, 2);
        
        oci_execute($statement , OCI_NO_AUTO_COMMIT);
        
        oci_commit($connect);

        if($RESULT == "y"){
            echo json_encode(array("rows" => 1 ,"data" =>"APPROVAL WAS SUCCESSFUL"));
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
    AMSD.fn_sub_assigned (HD_ASSET_ROOM_LOCATION)  AS HAS_SUB,
    AMSD.fn_pri_assigned (HD_ASSET_ROOM_LOCATION)  AS HAS_PRI
    FROM 
        AMSD.ASSETS_LOCATION 
    WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')   
    --WHERE  substr(HD_ASSET_ROOM_LOCATION,1,1) <> 'M'
    --AND substr(a.asset,1,2) = 'AL'
    AND ASSET_BUILDING LIKE '%$building%'
    AND ASSET_LEVEL LIKE '%$level%'
    AND (ASSET_AREA_NAME LIKE '%$area%' OR ASSET_AREA_NAME IS NULL)
    AND ASSET_ROOM_NO LIKE '%$room_no%'
    AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
    AND HD_ASSET_DESC LIKE '%$description%'
    AND ASSET_LOCATION_STATUS = '1'
    order by AMSD.fn_pri_assigned (HD_ASSET_ROOM_LOCATION) ASC";

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
        AMSD.assets a_new,
        AMSD.ASSETS_LOCATION l_new
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
    AND a_new.ASSET_STATUS = '1'
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
                AMSD.ASSETS_LOCATION 
            WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA_NAME LIKE '%$area%' OR ASSET_AREA_NAME IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
            AND ASSET_LOCATION_STATUS = '1'
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
            AMSD.ASSETS_LOCATION 
            WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA_NAME LIKE '%$area%' OR ASSET_AREA_NAME IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
            AND ASSET_LOCATION_STATUS = '1'
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
                AMSD.ASSETS_LOCATION
                WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA_NAME LIKE '%$area%' OR ASSET_AREA_NAME IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
            AND ASSET_LOCATION_STATUS = '1'
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
                AMSD.ASSETS_LOCATION 
                WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
            AND ASSET_LOCATION_STATUS = '1'
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
                AMSD.ASSETS_LOCATION 
            WHERE substr(hd_asset_room_location,1,2) in ('VL','SW','AL','SC','SA','PL','AP')
            AND ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA LIKE '%$area%' OR ASSET_AREA IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
            AND ASSET_LOCATION_STATUS = '1'
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
            AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS A_NEW 
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
            AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS A_NEW 
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
               AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS A_NEW 
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
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS A_NEW 
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
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO
            AND A_OLD.ASSET_PRIMARY_ID = A_OLD.ASSET_ID
            AND A_OLD.ASSET_CLASS LIKE '%$asset_class%'
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA LIKE '%$area%' OR L_NEW.ASSET_AREA IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
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

        $sql = "BEGIN AMSD.asset_it_fix (:USERNAME,:AL_NO,:ASSET_IDS,:PRIMARY_ID,:RESULT); END;";
        $statement = oci_parse($connect,$sql);
        oci_bind_by_name($statement, ':USERNAME', $USERNAME, 100);
        oci_bind_by_name($statement, ':AL_NO', $ALC_NO, 100);
        oci_bind_by_name($statement, ':ASSET_IDS', $ASSETS_IDS, -1);
        oci_bind_by_name($statement, ':PRIMARY_ID', $PRIMARY_ID, -1);
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

$app->map(['GET','POST'],'/unlink_all_subs',function(Request $request, Response $response){
    try{
        global $connect;
        $data = json_decode(file_get_contents('php://input'));
        $ASSETS_ID = strtoupper($data->asset_primary_id);
        $USERNAME = strtoupper($data->username);
        $RESULT = '';

        // echo $USERNAME.$ASSET_NO.$LOCATION.$ROOM.$RESULT;

        $sql = "BEGIN AMSD.asset_it_fix_unlink_all_subs_view(:USERNAME,:ASSET_ID,:RESULT); END;";
        $statement = oci_parse($connect,$sql);
        oci_bind_by_name($statement, ':USERNAME', $USERNAME, 100);
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

/*
 transfer room filters 
*/

$app->map(['GET','POST'],'/building_view_transfer', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $response = array();

    $sql = "SELECT ASSET_BUILDING
    FROM AMSD.ASSETS_LOCATION
    WHERE ASSET_BUILDING LIKE '%$building%' 
    AND ASSET_ROOM_NO LIKE '%$room_no%' 
    AND ASSET_AREA_NAME LIKE '%$area%' 
    AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%' 
    AND ASSET_LEVEL LIKE '%$level%' 
    GROUP BY ASSET_BUILDING
    ORDER BY ASSET_BUILDING ASC";

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

$app->map(['GET','POST'],'/asset_level_new_transfer', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $response = array();

    $sql = "SELECT ASSET_LEVEL
    FROM AMSD.ASSETS_LOCATION
    WHERE ASSET_BUILDING LIKE '%$building%' 
    AND ASSET_ROOM_NO LIKE '%$room_no%' 
    AND ASSET_AREA_NAME LIKE '%$area%' 
    AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%' 
    AND ASSET_LEVEL LIKE '%$level%' 
    GROUP BY ASSET_LEVEL
    ORDER BY ASSET_LEVEL ASC";

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

$app->map(['GET','POST'],'/location_area_transfer',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $ASSET_BUILDING = strtoupper($data->building);
    $ASSET_LEVEL = strtoupper($data->level);
    $ASSET_AREA = strtoupper($data->area);
    $ASSET_ROOM_NO = strtoupper($data->room_no);
    $ASSET_CLASS = strtoupper($data->asset_class);
    $HD_ASSET_ROOM_LOCATION = strtoupper($data->sub_location);


    if($ASSET_CLASS == 'ALL EQUIPMENT' ){
        $ASSET_CLASS = '';
    }

    $sql = "SELECT ASSET_AREA_NAME
    FROM AMSD.ASSETS_LOCATION
    WHERE ASSET_BUILDING LIKE '%$ASSET_BUILDING%' 
    AND ASSET_ROOM_NO LIKE '%$ASSET_ROOM_NO%' 
    AND ASSET_AREA_NAME LIKE '%$ASSET_AREA%' 
    AND ASSET_LEVEL LIKE '%$ASSET_LEVEL%' 
    AND HD_ASSET_ROOM_LOCATION LIKE '%$HD_ASSET_ROOM_LOCATION%' 
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

$app->map(['GET','POST'],'/room_no_transfer',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $ASSET_BUILDING = strtoupper($data->building);
    $ASSET_LEVEL = strtoupper($data->level);
    $ASSET_AREA = strtoupper($data->area);
    $ASSET_ROOM_NO = strtoupper($data->room_no);
    $ASSET_CLASS = strtoupper($data->asset_class);
    $HD_ASSET_ROOM_LOCATION = strtoupper($data->sub_location);



    if($ASSET_CLASS == 'ALL EQUIPMENT' ){
        $ASSET_CLASS = '';
    }

    $sql = "SELECT ASSET_ROOM_NO
    FROM AMSD.ASSETS_LOCATION
    WHERE ASSET_BUILDING LIKE '%$ASSET_BUILDING%' 
    AND ASSET_ROOM_NO LIKE '%$ASSET_ROOM_NO%' 
    AND ASSET_AREA_NAME LIKE '%$ASSET_AREA%' 
    AND ASSET_LEVEL LIKE '%$ASSET_LEVEL%' 
    AND HD_ASSET_ROOM_LOCATION LIKE '%$HD_ASSET_ROOM_LOCATION%' 
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

$app->map(['GET','POST'],'/asset_sub_location_transfer', function(Request $request, Response $response){
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

    $sql = "SELECT HD_ASSET_ROOM_LOCATION
            FROM 
                AMSD.ASSETS_LOCATION             
            WHERE ASSET_BUILDING LIKE '%$building%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
            AND substr(HD_ASSET_ROOM_LOCATION,1,2) in ('VL','SW','AL','SC','SA','PL','AP') 
            AND HD_ASSET_ROOM_LOCATION||ASSET_ROOM_NO NOT IN(SELECT ASSET_SUB_LOCATION||ASSET_ROOM_NO FROM AMSD.ASSETS)
            AND ASSET_LEVEL LIKE '%$level%'
            AND (ASSET_AREA_NAME LIKE '%$area%' OR ASSET_AREA_NAME IS NULL)
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            GROUP BY HD_ASSET_ROOM_LOCATION
            ORDER BY HD_ASSET_ROOM_LOCATION";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response [] = $value->HD_ASSET_ROOM_LOCATION;
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

/*
 end transfer room filters 
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
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%')
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (A_OLD.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_PRIMARY_ID IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            --AND A_OLD.ASSET_STATUS = '1'
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

$app->map(['GET','POST'],'/asset_sub_location_view', function(Request $request, Response $response){
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
                A_OLD.ASSET_SUB_LOCATION
            FROM 
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (A_OLD.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_PRIMARY_ID IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            --AND A_OLD.ASSET_STATUS = '1'
            GROUP BY A_OLD.ASSET_SUB_LOCATION
            ORDER BY A_OLD.ASSET_SUB_LOCATION";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = 0;
        foreach($res->data as $value){
            $length++;
            $response []= $value->ASSET_SUB_LOCATION;
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
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%')
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (A_OLD.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_PRIMARY_ID IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            --AND A_OLD.ASSET_STATUS = '1'
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
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND (A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%')
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (A_OLD.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_PRIMARY_ID IS NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
            ---AND A_OLD.ASSET_STATUS = '1'
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

    $sql = "SELECT ASSET_ROOM_NO
    FROM (SELECT DISTINCT
                 L_NEW.ASSET_ROOM_NO,
                 L_NEW.HD_ASSET_ROOM_LOCATION,
                 L_NEW.ASSET_AREA_NAME,
                 L_NEW.ASSET_LEVEL,
                 L_NEW.ASSET_BUILDING,
                 NVL (A_OLD.ASSET_PRIMARY_ID, 'NO DATA')
                     AS ASSET_PRIMARY_ID,
                 NVL (A_OLD.ASSET_CLASS, 'NO DATA')
                     AS ASSET_CLASS,
                 NVL (L_NEW.HD_ASSET_ROOM_LOCATION, 'NO DATA')
                      AS ASSET_SUB_LOCATION
            FROM AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS A_OLD
           WHERE     L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
                 AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+))
   WHERE     (ASSET_CLASS LIKE '%$asset_class%' OR ASSET_CLASS = 'NO DATA')
         AND (ASSET_BUILDING LIKE '%$building%')
         AND (ASSET_SUB_LOCATION LIKE '%$sub_location%')
         AND (ASSET_LEVEL LIKE '%$level%')
         AND (ASSET_AREA_NAME LIKE '%$area%')
         AND (ASSET_PRIMARY_ID LIKE '%$asset_primary_id%')
         AND (ASSET_ROOM_NO LIKE '%$room_no%')
  --AND A_OLD.ASSET_STATUS = '1'
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

$app->map(['GET','POST'],'/asset_sub_location_move', function(Request $request, Response $response){
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

    $sql = "SELECT ASSET_SUB_LOCATION
    FROM (SELECT DISTINCT
                 L_NEW.ASSET_ROOM_NO,
                 L_NEW.HD_ASSET_ROOM_LOCATION,
                 L_NEW.ASSET_AREA_NAME,
                 L_NEW.ASSET_LEVEL,
                 L_NEW.ASSET_BUILDING,
                 NVL (A_OLD.ASSET_PRIMARY_ID, 'NO DATA')
                     AS ASSET_PRIMARY_ID,
                 NVL (A_OLD.ASSET_CLASS, 'NO DATA')
                     AS ASSET_CLASS,
                 NVL (L_NEW.HD_ASSET_ROOM_LOCATION, 'NO DATA')
                      AS ASSET_SUB_LOCATION
            FROM AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS A_OLD
           WHERE     L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
                 AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+))
   WHERE     (ASSET_CLASS LIKE '%$asset_class%' OR ASSET_CLASS = 'NO DATA')
         AND (ASSET_BUILDING LIKE '%$building%')
         AND (ASSET_SUB_LOCATION LIKE '%$sub_location%')
         AND (ASSET_LEVEL LIKE '%$level%')
         AND (ASSET_AREA_NAME LIKE '%$area%')
         AND (ASSET_PRIMARY_ID LIKE '%$asset_primary_id%')
         AND (ASSET_ROOM_NO LIKE '%$room_no%')
  --AND A_OLD.ASSET_STATUS = '1'
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
                AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
            WHERE  L_NEW.ASSET_ROOM_NO = A_OLD.ASSET_ROOM_NO(+)
            AND L_NEW.HD_ASSET_ROOM_LOCATION = A_OLD.ASSET_SUB_LOCATION(+)
            AND (A_OLD.ASSET_CLASS LIKE '%$asset_class%' OR A_OLD.ASSET_CLASS IS NULL)
            AND L_NEW.ASSET_BUILDING LIKE '%$building%'
            AND A_OLD.ASSET_SUB_LOCATION LIKE '%$sub_location%' 
            AND L_NEW.ASSET_LEVEL LIKE '%$level%'
            AND (L_NEW.ASSET_AREA_NAME LIKE '%$area%' OR L_NEW.ASSET_AREA_NAME IS NULL)
            AND (A_OLD.ASSET_PRIMARY_ID LIKE '%$asset_primary_id%' OR A_OLD.ASSET_PRIMARY_ID IS NOT NULL)
            AND L_NEW.ASSET_ROOM_NO LIKE '%$room_no%'
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
//                 AMSD.ASSETS_LOCATION L_NEW, AMSD.ASSETS  A_OLD
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

/**
 * COMMISSIONING FILTERS
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

/**
 * END COMMISSIONING FILTERS
 */

 /**
 * DECOMMISSIONING FILTERS
 */
$app->map(['GET','POST'],'/building_removal', function(Request $request, Response $response){
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
            AND ASSET_CERT_NO IS NOT NULL
            --AND ASSET_PRINT_DATE IS NOT NULL 
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

$app->map(['GET','POST'],'/asset_level_removal', function(Request $request, Response $response){
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
            AND ASSET_CERT_NO IS NOT NULL
            --AND ASSET_PRINT_DATE IS NOT NULL 
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

$app->map(['GET','POST'],'/asset_area_removal', function(Request $request, Response $response){
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
            AND ASSET_CERT_NO IS NOT NULL
            --AND ASSET_PRINT_DATE IS NOT NULL 
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

$app->map(['GET','POST'],'/asset_room_no_removal', function(Request $request, Response $response){
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
            AND ASSET_CERT_NO IS NOT NULL
            --AND ASSET_PRINT_DATE IS NOT NULL 
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

$app->map(['GET','POST'],'/asset_sub_location_removal', function(Request $request, Response $response){
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
            AND ASSET_CERT_NO IS NOT NULL
            --AND ASSET_PRINT_DATE IS NOT NULL             
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

$app->map(['GET','POST'],'/asset_id_removal', function(Request $request, Response $response){
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
            AND ASSET_CERT_NO IS NOT NULL
            --AND ASSET_PRINT_DATE IS NOT NULL 
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

/**
 * END DECOMMISSIONING FILTERS
 */

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
    AND ASSET_PRINT_DATE IS NOT NULL
    AND ASSET_STATUS = 'ACTIVE'";

    $assets_withno_crt =$func->executeQuery($sql);

    if($assets_withno_crt){
       echo $assets_withno_crt;
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>[]));
    }

});
$app->map(['GET','POST'],'/generate_certificate_number',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    // $cert_no = strtoupper($data->cert);

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
        // $new_cert = "2020/000000230265416";

        $str_arr = explode("/", $new_cert);  

        $cert_int = (int)$str_arr[1];
        // echo $str_arr[1]." b4 -----------";
        $cert_int++;
        $len = strlen((string)$cert_int);
        $zeros = "";

        if($len < 6){

            for($i = $len;$i<6;$i++){
                $zeros .="0";
            }

            $cert_int = $zeros.$cert_int;
        }

        if($str_arr[0] == $str_arr[0]){
            $cert_int = date("Y").'/'.$cert_int;
        }else{
            $cert_int = date("Y").'/000000';
        }
    
         echo json_encode(array("rows" => 1 ,"certificate_number" =>$cert_int));
    }
});

$app->map(['GET','POST'],'/check_assets',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $assets = strtoupper($data->assets);

    $sql = "SELECT ASSET_ID
    FROM AMSD.ASSETS
    WHERE ASSET_ID IN ($assets)";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){

        echo $assets_no;
    }else{
        echo json_encode(array("rows" => 0 ,"data" =>"none"));
    }
});



$app->map(['GET','POST'],'/generate_Cert_no',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    // $cert_no = strtoupper($data->cert);
    $ASSET_NO = strtoupper($data->assert_primary_id);

    $sql = "SELECT ASSET_CERT_NO
    FROM AMSD.ASSETS
    WHERE ASSET_CERT_NO IS NOT NULL
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
        if($len < 6){

            for($i = $len;$i<6;$i++){
                $zeros .="0";
            }

            $cert_int = $zeros.$cert_int;
        }

        if($str_arr[0] == (string)date("Y")){
            $cert_int = date("Y").'/'.$cert_int;
        }else{
            $cert_int = date("Y").'/000000';
        }
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

$app->map(['GET','POST'],'/getAsset_for_CertNO',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    // $cert_no = strtoupper($data->cert);
    $cert_no = strtoupper($data->cert_no);

    $sql = "SELECT ASSET_ID,ASSET_DESCRIPTION,ASSET_CERT_NO
    FROM AMSD.ASSETS
    WHERE ASSET_CERT_NO = '$cert_no'
    GROUP BY ASSET_ID,ASSET_DESCRIPTION,ASSET_CERT_NO
    ORDER BY ASSET_CERT_NO DESC";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){

        $assets_no;
        $new_cert = json_decode($assets_no);

        $count = 0;
        $sub = "";

        foreach($new_cert->data as $res){
            $sub .= '<tr>
                        <td>'.$res->ASSET_ID.'</td>
                        <td>'.$res->ASSET_DESCRIPTION.'</td>
                        <td>'.$res->ASSET_CERT_NO.'</td>
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

//asset with active status
$app->map(['GET','POST'],'/get_Asset_status_decom',function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    // $cert_no = strtoupper($data->cert);
    $ASSET_NO = strtoupper($data->assert_primary_id);

    $sql = "SELECT ASSET_CERT_NO
    FROM AMSD.ASSETS
    WHERE ASSET_CERT_NO IS NOT NULL
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
        if($len < 6){

            for($i = $len;$i<6;$i++){
                $zeros .="0";
            }

            $cert_int = $zeros.$cert_int;
        }

        if($str_arr[0] == (string)date("Y")){
            $cert_int = date("Y").'/'.$cert_int;
        }else{
            $cert_int = date("Y").'/000000';
        }
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


//commissioning procedure
$app->map(['GET','POST'],'/comm_asset',function(Request $request, Response $response){

    try{

        global $connect;

        $data = json_decode(file_get_contents('php://input'));
        $assets = strtoupper($data->assets);
        $cert = strtoupper($data->cert);
        $asset_class = strtoupper($data->asset_class);
        $username = strtoupper($data->username);
        $boq = strtoupper($data->boq);
        $invoce_number = strtoupper($data->invoce_number);
        $asset_reference = strtoupper($data->asset_reference);
        $v_out = "";
        // $v_print_date = "";
        // $v_cert_status  = "1";
        // $v_cert_type = "COMM";
        // $sql = "UPDATE AMSD.ASSETS SET ASSET_CERT_NO = '$cert' WHERE ASSET_ID IN ($assets)";

        if($asset_class == 'ALL EQUIPMENT'){
            $asset_class = '';
        }

        $sql  = "BEGIN asset_certificate_comm(:v_username,:v_asset_class,:v_asset_ids,:v_asset_certificate,'COMM','','1',:boq,:invoce_number,:asset_reference,:v_out); END;";
        $statement = oci_parse($connect,$sql);
        oci_bind_by_name($statement, ':v_username', $username, 50);
        oci_bind_by_name($statement, ':v_asset_class', $asset_class, 50);
        oci_bind_by_name($statement, ':v_asset_ids', $assets, -1);
        oci_bind_by_name($statement, ':v_asset_certificate', $cert, 50);
        oci_bind_by_name($statement, ':boq', $boq, -1);
        oci_bind_by_name($statement, ':invoce_number', $invoce_number, -1);
        oci_bind_by_name($statement, ':asset_reference', $asset_reference, -1);
        // oci_bind_by_name($statement, ':v_asset_certificate', $cert, 50);
        oci_bind_by_name($statement, ':v_out',  $v_out, 2);

        oci_execute($statement , OCI_NO_AUTO_COMMIT);

        oci_commit($connect);

        if($v_out == "y"){
            echo json_encode(array("rows" => 0 ,"data" =>"ASSETS COMMISSIONED SUCCESSFULLY"));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"ASSETS WAS NOT COMMISSIONED"));
        }
    }
    catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }

});

//decommissioning procedure
$app->map(['GET','POST'],'/decomm_asset',function(Request $request, Response $response){

    try{

        global $connect;

        $data = json_decode(file_get_contents('php://input'));
        $username = strtoupper($data->username);
        $asset_class = strtoupper($data->asset_class);
        $assets = strtoupper($data->assets);
        $cert = strtoupper($data->cert);
        $comments = strtoupper($data->comments);
        $v_out = "";
        // $v_print_date = "";
        // $v_cert_status  = "1";
        // $v_cert_type = "COMM";
        // $sql = "UPDATE AMSD.ASSETS SET ASSET_CERT_NO = '$cert' WHERE ASSET_ID IN ($assets)";

        if($asset_class == 'ALL EQUIPMENT'){
            $asset_class = '';
        }

        $sql  = "BEGIN asset_certificate_decomm(:v_username,:v_asset_class,:v_asset_ids,:v_asset_certificate,'',:v_comments,:v_out); END;";
        $statement = oci_parse($connect,$sql);
        oci_bind_by_name($statement, ':v_username', $username, 50);
        oci_bind_by_name($statement, ':v_asset_class', $asset_class, 50);
        oci_bind_by_name($statement, ':v_asset_ids', $assets, -1);
        oci_bind_by_name($statement, ':v_asset_certificate', $cert, 50);
        oci_bind_by_name($statement, ':v_comments', $comments, 50);
        oci_bind_by_name($statement, ':v_out',  $v_out, 2);

        oci_execute($statement , OCI_NO_AUTO_COMMIT);

        oci_commit($connect);

        if($v_out == "y"){
            echo json_encode(array("rows" => 1 ,"data" =>"ASSETS DECOMMISSIONED SUCCESSFULLY"));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"ASSETS WAS NOT DECOMMISSIONED"));
        }
    }
    catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }

});

// $app->map(['GET','POST'],'/update_cert',function(Request $request, Response $response){
//     global $func;
//     $data = json_decode(file_get_contents('php://input'));
//     $assets = strtoupper($data->assets);
//     $cert = strtoupper($data->cert);

//     $sql = "UPDATE AMSD.ASSETS SET ASSET_CERT_NO = '$cert' WHERE ASSET_ID IN ($assets)";

//     $update_cert =$func->executeNonQuery($sql);

//     if($update_cert){
//        echo json_encode(array("rows" => 0 ,"data" =>"success"));
//     }
//     else{
//         echo json_encode(array("rows" => 0 ,"data" =>"error"));
//     }

// });

$app->map(['GET','POST'],'/add_assets',function(Request $request, Response $response){
    try{
        global $connect;
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $v_asset_class = strtoupper($data->v_asset_class);
        $v_assets = strtoupper($data->v_assets);
        $v_asset_model = strtoupper($data->v_asset_model);
        $v_asset_type = strtoupper($data->v_asset_type);
        $v_asset_classification = strtoupper($data->v_asset_classification);
        $v_asset_room_no = strtoupper($data->v_asset_room_no);
        $v_asset_purchase_dt = strtoupper($data->v_asset_purchase_dt);
        $v_asset_warranty_dt = strtoupper($data->v_asset_warranty_dt);
        $v_asset_vendor_id = strtoupper($data->v_asset_vendor_id);
        $v_asset_vendor_name = strtoupper($data->v_asset_vendor_name);
        $v_asset_useful_life = strtoupper($data->v_asset_useful_life);
        $v_asset_service_dt = strtoupper($data->v_asset_service_dt);
        $v_asset_service_due_dt = strtoupper($data->v_asset_service_due_dt);
        $v_asset_service_by = strtoupper($data->v_asset_service_by);
        $v_asset_cert_ind = strtoupper($data->v_asset_cert_ind);
        $v_asset_cert_no = strtoupper($data->v_asset_cert_no);
        $v_asset_added_by = strtoupper($data->v_asset_added_by);
       

        // echo $USERNAME.$ASSET_NO.$LOCATION.$ROOM.$RESULT;

        $sql = "BEGIN AMSD.asset_create(:v_asset_class,:v_assets,:v_asset_model,:v_asset_type,:v_asset_classification,:v_asset_purchase_dt,:v_asset_warranty_dt,:v_asset_vendor_id,:v_asset_vendor_name,:v_asset_useful_life,:v_asset_service_dt,:v_asset_service_due_dt,:v_asset_service_by,:v_asset_cert_ind,:v_asset_cert_no,:v_asset_added_by,'','','',:v_out); END;";               


        $statement = oci_parse($connect,$sql);
        $add_assets = oci_new_cursor($connect);
        // oci_bind_by_name($statement, ':USERNAME', $USERNAME, 30);
        oci_bind_by_name($statement, ':v_asset_class', $v_asset_class, 50);
        oci_bind_by_name($statement, ':v_assets', $v_assets, -1);
        oci_bind_by_name($statement, ':v_asset_model', $v_asset_model, 50);
        oci_bind_by_name($statement, ':v_asset_type', $v_asset_type, 50);
        oci_bind_by_name($statement, ':v_asset_classification', $v_asset_classification, 50);
        // oci_bind_by_name($statement, ':v_asset_room_no', $v_asset_room_no, 50);
        oci_bind_by_name($statement, ':v_asset_purchase_dt', $v_asset_purchase_dt, 50);
        oci_bind_by_name($statement, ':v_asset_warranty_dt', $v_asset_warranty_dt, 50);
        oci_bind_by_name($statement, ':v_asset_vendor_id', $v_asset_vendor_id, 50);
        oci_bind_by_name($statement, ':v_asset_vendor_name', $v_asset_vendor_name, 50);
        oci_bind_by_name($statement, ':v_asset_useful_life', $v_asset_useful_life, 50);
        oci_bind_by_name($statement, ':v_asset_service_dt', $v_asset_service_dt, 50);
        oci_bind_by_name($statement, ':v_asset_service_due_dt', $v_asset_service_due_dt, 50);
        oci_bind_by_name($statement, ':v_asset_service_by', $v_asset_service_by, 50);
        oci_bind_by_name($statement, ':v_asset_cert_ind', $v_asset_cert_ind, 50);
        oci_bind_by_name($statement, ':v_asset_cert_no', $v_asset_cert_no, 50);
        oci_bind_by_name($statement, ':v_asset_added_by', $v_asset_added_by, 50);
        // oci_bind_by_name($statement, ':v_out', $add_assets, -1);
        oci_bind_by_name($statement, ':v_out', $add_assets, -1, OCI_B_CURSOR);

        // oci_execute($statement);

        // oci_commit($connect);
        oci_execute($statement, OCI_NO_AUTO_COMMIT);
        oci_execute($add_assets, OCI_DEFAULT);

        $response = array();
        $count = 0;
        $check_assets_id = false;

        $tdata = '<table id="assetsAdded_table" class="table table-bordered table-striped">
                    <thead>
                        <tr style="background:black" class="text-light">
                            <th class="theading-sub bg-dark">ASSET(S)</th>
                            <th class="theading-sub bg-dark">DESCRIPTION</th>
                            <th class="theading-sub bg-dark">STATUS</th>
                        </tr>
                    </thead>
                    <tbody id="assetsAdded">
                        ';
        while (($row = oci_fetch_array($add_assets, OCI_ASSOC+OCI_RETURN_NULLS)) != false) {

            $response [] = $row;
            $tdata .= '<tr>
                            <td class="theading-sub">'.$row['G_ASSET_ID'].'</td>
                            <td class="theading-sub">'.$row['G_ASSET_DESC'].'</td>
                            <td class="theading-sub text-center">'.$func->updateLetterToIcon($row['G_STATUS']).'</td>
                       </tr>';
            $count++;

            if($row['G_STATUS'] == 'n'){
                $check_assets_id = true;
            }
        }
        oci_commit($connect);
        $tdata .= '</tbody></table>';

        if($check_assets_id){
            echo json_encode(array("rows" =>  $count ,"data" => $response,"tdata" => $tdata,"found" => $check_assets_id));
        }else{
            echo json_encode(array("rows" =>  $count ,"data" => $response,"tdata" => $tdata,"found" => $check_assets_id));
        }

         
  
    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});


/**
 * 
 * 
 * 
 * 
 */

 
$app->map(['GET','POST'],'/building_cert', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $cert_no = strtoupper($data->cert_no);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                a.ASSET_BUILDING
            FROM 
                AMSD.ASSETS_VW a, AMSD.ASSETS_CERTIFICATE b
            WHERE a.ASSET_ID = b.ASSET_ID
            AND b.ASSET_CERTIFICATE_NO = a.ASSET_CERT_NO
            AND a.ASSET_CLASS LIKE '%$asset_class%'
            AND a.ASSET_BUILDING LIKE '%$building%'
            AND a.ASSET_LEVEL LIKE '%$level%'
            AND a.ASSET_AREA_NAME LIKE '%$area%'
            AND a.ASSET_ROOM_NO LIKE '%$room_no%'
            AND a.ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND a.ASSET_CERT_NO LIKE '%$cert_no%'
            GROUP BY a.ASSET_BUILDING
            ORDER BY a.ASSET_BUILDING";

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

$app->map(['GET','POST'],'/level_cert', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $cert_no = strtoupper($data->cert_no);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                a.ASSET_LEVEL
            FROM 
                AMSD.ASSETS_VW a, AMSD.ASSETS_CERTIFICATE b
            WHERE a.ASSET_ID = b.ASSET_ID
            AND b.ASSET_CERTIFICATE_NO = a.ASSET_CERT_NO
            AND a.ASSET_CLASS LIKE '%$asset_class%'
            AND a.ASSET_BUILDING LIKE '%$building%'
            AND a.ASSET_LEVEL LIKE '%$level%'
            AND a.ASSET_AREA_NAME LIKE '%$area%'
            AND a.ASSET_ROOM_NO LIKE '%$room_no%'
            AND a.ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND a.ASSET_CERT_NO LIKE '%$cert_no%'
            GROUP BY a.ASSET_LEVEL
            ORDER BY a.ASSET_LEVEL";

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

$app->map(['GET','POST'],'/area_cert', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $cert_no = strtoupper($data->cert_no);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                a.ASSET_AREA_NAME
            FROM 
                AMSD.ASSETS_VW a, AMSD.ASSETS_CERTIFICATE b
            WHERE a.ASSET_ID = b.ASSET_ID
            AND b.ASSET_CERTIFICATE_NO = a.ASSET_CERT_NO
            AND a.ASSET_CLASS LIKE '%$asset_class%'
            AND a.ASSET_BUILDING LIKE '%$building%'
            AND a.ASSET_LEVEL LIKE '%$level%'
            AND a.ASSET_AREA_NAME LIKE '%$area%'
            AND a.ASSET_ROOM_NO LIKE '%$room_no%'
            AND a.ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND a.ASSET_CERT_NO LIKE '%$cert_no%'
            GROUP BY a.ASSET_AREA_NAME
            ORDER BY a.ASSET_AREA_NAME";

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

$app->map(['GET','POST'],'/room_no_cert', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $cert_no = strtoupper($data->cert_no);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                a.ASSET_ROOM_NO
            FROM 
                AMSD.ASSETS_VW a, AMSD.ASSETS_CERTIFICATE b
            WHERE a.ASSET_ID = b.ASSET_ID
            AND b.ASSET_CERTIFICATE_NO = a.ASSET_CERT_NO
            AND a.ASSET_CLASS LIKE '%$asset_class%'
            AND a.ASSET_BUILDING LIKE '%$building%'
            AND a.ASSET_LEVEL LIKE '%$level%'
            AND a.ASSET_AREA_NAME LIKE '%$area%'
            AND a.ASSET_ROOM_NO LIKE '%$room_no%'
            AND a.ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND a.ASSET_CERT_NO LIKE '%$cert_no%'
            GROUP BY a.ASSET_ROOM_NO
            ORDER BY a.ASSET_ROOM_NO";

    $assets_no =$func->executeQuery($sql);

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
        echo json_encode(array("rows" => 0 ,"data" =>"Error"));
    }
 
});

$app->map(['GET','POST'],'/sub_location_cert', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $cert_no = strtoupper($data->cert_no);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                a.ASSET_SUB_LOCATION
            FROM 
                AMSD.ASSETS_VW a, AMSD.ASSETS_CERTIFICATE b
            WHERE a.ASSET_ID = b.ASSET_ID
            AND b.ASSET_CERTIFICATE_NO = a.ASSET_CERT_NO
            AND a.ASSET_CLASS LIKE '%$asset_class%'
            AND a.ASSET_BUILDING LIKE '%$building%'
            AND a.ASSET_LEVEL LIKE '%$level%'
            AND a.ASSET_AREA_NAME LIKE '%$area%'
            AND a.ASSET_ROOM_NO LIKE '%$room_no%'
            AND a.ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND a.ASSET_CERT_NO LIKE '%$cert_no%'
            GROUP BY a.ASSET_SUB_LOCATION
            ORDER BY a.ASSET_SUB_LOCATION";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->ASSET_SUB_LOCATION;
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

$app->map(['GET','POST'],'/cert_no_cert', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $cert_no = strtoupper($data->cert_no);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                a.ASSET_CERT_NO
            FROM 
                AMSD.ASSETS_VW a, AMSD.ASSETS_CERTIFICATE b
            WHERE a.ASSET_ID = b.ASSET_ID
            AND b.ASSET_CERTIFICATE_NO = a.ASSET_CERT_NO
            AND a.ASSET_CLASS LIKE '%$asset_class%'
            AND a.ASSET_BUILDING LIKE '%$building%'
            AND a.ASSET_LEVEL LIKE '%$level%'
            AND a.ASSET_AREA_NAME LIKE '%$area%'
            AND a.ASSET_ROOM_NO LIKE '%$room_no%'
            AND a.ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND a.ASSET_CERT_NO LIKE '%$cert_no%'
            GROUP BY a.ASSET_CERT_NO
            ORDER BY a.ASSET_CERT_NO DESC";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->ASSET_CERT_NO;
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
$app->map(['GET','POST'],'/getCerts', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $cert_no = strtoupper($data->cert_no);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }


    $sql = "SELECT 
                a.ASSET_CERT_NO,a.ASSET_CLASS,b.ASSET_CERTIFICATE_TYPE,b.ASSET_CERTIFICATE_CREATION_DATE,a.ASSET_PRINT_DATE,b.ASSET_CERTIFICATE_STATUS
            FROM 
                AMSD.ASSETS_VW a, AMSD.ASSETS_CERTIFICATE b
            WHERE a.ASSET_ID = b.ASSET_ID
            AND b.ASSET_CERTIFICATE_NO = a.ASSET_CERT_NO
            AND a.ASSET_CLASS LIKE '%$asset_class%'
            AND a.ASSET_BUILDING LIKE '%$building%'
            AND a.ASSET_LEVEL LIKE '%$level%'
            AND a.ASSET_AREA_NAME LIKE '%$area%'
            AND a.ASSET_ROOM_NO LIKE '%$room_no%'
            AND a.ASSET_SUB_LOCATION LIKE '%$sub_location%'
            AND a.ASSET_CERT_NO LIKE '%$cert_no%'
           GROUP BY a.ASSET_CERT_NO,a.ASSET_CLASS,b.ASSET_CERTIFICATE_TYPE,b.ASSET_CERTIFICATE_CREATION_DATE,a.ASSET_PRINT_DATE,b.ASSET_CERTIFICATE_STATUS
            ";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        // echo $assets_no;
        $assets = json_decode($assets_no);
        // print_r($assets);
        $len = $assets->rows;

        $str = '{"data" : [';
            for ($k = 0; $k <  $len; $k++) {

                if (($len- 1) == $k) {

                    $str .= '["' . $assets->data[$k]->ASSET_CERT_NO . '","';
                    $str .= $assets->data[$k]->ASSET_CERT_NO . '","';
                    $str .= $assets->data[$k]->ASSET_CLASS . '","';
                    $str .= $func->checkType($assets->data[$k]->ASSET_CERTIFICATE_TYPE) . '","';
                    $str .= $assets->data[$k]->ASSET_CERTIFICATE_CREATION_DATE . '","';
                    $str .= $func->isSpecified($assets->data[$k]->ASSET_PRINT_DATE) . '","';
                    $str .= $func->updateLetterToWords($assets->data[$k]->ASSET_CERTIFICATE_STATUS) . '"]';

                } else {

                    $str .= '["' . $assets->data[$k]->ASSET_CERT_NO . '","';
                    $str .= $assets->data[$k]->ASSET_CERT_NO . '","';
                    $str .= $assets->data[$k]->ASSET_CLASS . '","';
                    $str .= $func->checkType($assets->data[$k]->ASSET_CERTIFICATE_TYPE) . '","';
                    $str .= $assets->data[$k]->ASSET_CERTIFICATE_CREATION_DATE . '","';
                    $str .= $func->isSpecified($assets->data[$k]->ASSET_PRINT_DATE) . '","';
                    $str .= $func->updateLetterToWords($assets->data[$k]->ASSET_CERTIFICATE_STATUS) . '"],';

                }
            }

            $str .= ']}';


            // $arrRemove = ['\n',' 14"',' 26"',' 18"','\r','\\']; // Replacing these values
            // $arrWith   = ['',' 14`',' 26`',' 18`','',''];      // With these values


            // $str = $func->replaceMulti($arrRemove,$arrWith,$str);

            $str = str_replace("\n", "", $str);
            $str = str_replace(' 14"', "14`", $str);
            $str = str_replace(' 26"', "26`", $str);
            $str = str_replace(' 18"', " 18`", $str);
            $str = str_replace("\r", "", $str);
            $str = str_replace("\\", "", $str);

            echo json_encode(array("rows" =>$len ,"data" => $str));


    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>[]));
    }
 
});

//check is asset decommissionable
$app->map(['GET','POST'],'/check_id', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $asset_id = strtoupper($data->asset_id);
    $response = array();

        $sql = "SELECT (SELECT ASSET_PRIMARY_ID FROM AMSD.ASSETS 
        WHERE ASSET_PRIMARY_ID = '$asset_id'
        HAVING COUNT(ASSET_PRIMARY_ID)>1
        GROUP BY ASSET_PRIMARY_ID) AS IS_PRIMARY,

    (SELECT ASSET_ID FROM AMSD.ASSETS 
        WHERE ASSET_ID <> ASSET_PRIMARY_ID
        AND ASSET_ID = '$asset_id') AS IS_SUB,

        (SELECT ASSET_ID FROM AMSD.ASSETS 
        WHERE ASSET_ROOM_NO <> ASSET_SUB_LOCATION
        AND ASSET_ID = '$asset_id') AS IS_LINKED from dual";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        echo $assets_no;
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>[]));
    }
 
});

$app->map(['GET','POST'],'/check_status', function(Request $request, Response $responce){
    global $connect;
    $data = json_decode(file_get_contents('php://input'));
    $asset_ids = strtoupper($data->check_ids);
    $v_out_status = "";
    $v_out_room = "";
    $responce = array();
    

    $sql = "SELECT count(*) AS RES FROM 
    (SELECT ASSET_TRANSACTION_STATUS FROM ASSETS
    WHERE ASSET_ID IN($asset_ids)
    GROUP BY ASSET_TRANSACTION_STATUS)";

    $sql = "BEGIN AMSD.ASSETS_CHECK_IF_STATUS_IS_SAME_TEST(:ASSET_IDS,:RESULT_STATUS,:RESULT_ROOM); END;";
    $statement = oci_parse($connect,$sql);
    oci_bind_by_name($statement, ':ASSET_IDS', $asset_ids, 400);
    oci_bind_by_name($statement, ':RESULT_STATUS', $v_out_status, 5);
    oci_bind_by_name($statement, ':RESULT_ROOM', $v_out_room, 5);

    oci_execute($statement , OCI_NO_AUTO_COMMIT);

    oci_commit($connect);

   array_push($responce,array("room_res"=>$v_out_room,"status_res"=>$v_out_status));

    echo json_encode(array("rows" => 1 ,"data" =>$responce));
 
});


$app->map(['GET','POST'],'/get_oldRoom', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $asset_ids = strtoupper($data->temp_ids);
    $response = array();

 

    $sql = "SELECT ASSET_ID,ASSET_ROOM_NO_OLD,ASSET_ROOM_NO_NEW
        FROM  ASSETS_LOG
        WHERE ASSET_DATE = (SELECT MAX (ASSET_DATE)
                             FROM ASSETS_LOG
                            WHERE ASSET_ID IN ($asset_ids))
         AND ASSET_ID IN ($asset_ids)";


$assets_no =$func->executeQuery($sql);

        if($assets_no){
            
            $res = json_decode($assets_no);
            $length = $res->rows;
            $sub = '';
            
            foreach($res->data as $value){

                $sub = '<tr>
                        <td>'.$value->ASSET_ID.'</td>
                        <td>'.$value->ASSET_ROOM_NO_NEW.'</td>
                        <td>'.$value->ASSET_ROOM_NO_OLD.'</td>
                        </tr>';
            }

            echo json_encode(array("rows"=>$length,"data"=>$sub));
        }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>"Error"));
        }

});

/**
 * 
 * 
 * Location Filters
 * 
 */

$app->map(['GET','POST'],'/building_location', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $description = strtoupper($data->description);
    $sub_location = strtoupper($data->sub_location);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                ASSET_BUILDING
                FROM AMSD.ASSETS_LOCATION
            WHERE ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
            AND HD_ASSET_DESC LIKE '%$description%'
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



$app->map(['GET','POST'],'/asset_level_new_location', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $description = strtoupper($data->description);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                ASSET_LEVEL 
                FROM AMSD.ASSETS_LOCATION 
                WHERE ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
            AND HD_ASSET_DESC LIKE '%$description%'
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

// area_name
$app->map(['GET','POST'],'/asset_area_location', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $description = strtoupper($data->description);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                ASSET_AREA_NAME
            FROM AMSD.ASSETS_LOCATION 
            WHERE ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
            AND HD_ASSET_DESC LIKE '%$description%'
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

//area
$app->map(['GET','POST'],'/asset_proper_area', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $description = strtoupper($data->description);
    $asset_class = strtoupper($data->asset_class);
    $proper_area = strtoupper($data->proper_area);
    $area_details = strtoupper($data->area_details);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                ASSET_AREA 
                FROM AMSD.ASSETS_LOCATION 
                WHERE ASSET_BUILDING LIKE '%$building%'
                AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA LIKE '%$proper_area%'
            AND ASSET_AREA_DETAIL LIKE '%$area_details%'
            AND ASSET_AREA_NAME LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_DESC LIKE '%$description%'
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


//area_detail
$app->map(['GET','POST'],'/asset_area_detail', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $description = strtoupper($data->description);
    $asset_class = strtoupper($data->asset_class);
    $proper_area = strtoupper($data->proper_area);
    $area_details = strtoupper($data->area_details);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT 
                ASSET_AREA_DETAIL 
                FROM AMSD.ASSETS_LOCATION 
                WHERE ASSET_BUILDING LIKE '%$building%'
                AND ASSET_LEVEL  LIKE '%$level%'
            AND ASSET_AREA_DETAIL LIKE '%$area_details%'
            AND ASSET_AREA LIKE '%$proper_area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_DESC LIKE '%$description%'
            GROUP BY ASSET_AREA_DETAIL
            ORDER BY ASSET_AREA_DETAIL";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response []= $value->ASSET_AREA_DETAIL;
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

$app->map(['GET','POST'],'/asset_room_no_location', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $description = strtoupper($data->description);
    $asset_class = strtoupper($data->asset_class);
    $description = strtoupper($data->description);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT ASSET_ROOM_NO
            FROM AMSD.ASSETS_LOCATION 
            WHERE ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
            AND HD_ASSET_DESC LIKE '%$description%'
            GROUP BY ASSET_ROOM_NO
            ORDER BY ASSET_ROOM_NO";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        
        foreach($res->data as $value){

            $response [] = $value->ASSET_ROOM_NO;

        }         
        echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>"Error"));
    }
 
});

$app->map(['GET','POST'],'/asset_sub_location_location', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $description = strtoupper($data->description);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT HD_ASSET_ROOM_LOCATION
            FROM AMSD.ASSETS_LOCATION 
            WHERE ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
            AND HD_ASSET_DESC LIKE '%$description%'
            GROUP BY HD_ASSET_ROOM_LOCATION
            ORDER BY HD_ASSET_ROOM_LOCATION";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        $res = json_decode($assets_no);
        $length = $res->rows;
        foreach($res->data as $value){

            $response [] = $value->HD_ASSET_ROOM_LOCATION;
            // $response []= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';
            // $items .= '<input type="button" class="dropdown-item form-control" type="button" value="'.$value->ASSET_ID.'"/>';

        }

        // echo $assets_no;
         echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>[]));
    }
 
});

$app->map(['GET','POST'],'/get_all_locations', function(Request $request, Response $response){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->asset_sub_location);
    $description = strtoupper($data->description);
    $asset_class = strtoupper($data->asset_class);
    $response = array();

    if($asset_class == 'ALL EQUIPMENT'){
        $asset_class = '';
    }

    $sql = "SELECT ASSET_BUILDING, ASSET_LEVEL, ASSET_AREA, ASSET_AREA_NAME, ASSET_AREA_DETAIL, ASSET_ROOM_NO, HD_ASSET_ROOM_LOCATION, HD_ASSET_DESC
            FROM AMSD.ASSETS_LOCATION 
            WHERE ASSET_BUILDING LIKE '%$building%'
            AND ASSET_LEVEL LIKE '%$level%'
            AND ASSET_AREA_NAME LIKE '%$area%'
            AND ASSET_ROOM_NO LIKE '%$room_no%'
            AND HD_ASSET_ROOM_LOCATION LIKE '%$sub_location%'
            AND HD_ASSET_DESC LIKE '%$description%'";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        echo $assets_no;

    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>[]));
    }
 
});
$app->map(['GET','POST'],'/getAssetsType', function(Request $request, Response $response){
    global $func;

    $sql = "SELECT ASSET_TYPEID,ASSET_TYPE_DESC FROM AMSD.ASSETS_TYPE ORDER BY ASSET_TYPEID";

    $assets_no =$func->executeQuery($sql);

    if($assets_no){
        
        echo $assets_no;
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>[]));
    }
 
});

$app->map(['GET','POST'],'/getAssetsTypeLocation', function(Request $request, Response $response){
    global $func;
    $response = array();
    $sql = "SELECT ASSET_TYPE_DESC FROM AMSD.ASSETS_TYPE ORDER BY ASSET_TYPEID";
    

    $assets_no =$func->executeQuery($sql);

    if($assets_no){

        $res = json_decode($assets_no);
        $length = $res->rows;
        
        foreach($res->data as $value){

            $response [] = $value->ASSET_TYPE_DESC;

        }         
        echo json_encode(array("rows"=>$length,"data" =>$response));
    }
    else{
        echo json_encode(array("rows" => 0 ,"data" =>[]));
    }
 
});


$app->map(['GET','POST'],'/new_location', function (Request $requet, Response $response){
    global $func;
    global $connect;

    $data = json_decode(file_get_contents('php://input'));
    $building = strtoupper($data->building);
    $level = strtoupper($data->level);
    $area = strtoupper($data->area);
    $room_no = strtoupper($data->room_no);
    $sub_location = strtoupper($data->sub_location);
    $username = strtoupper($data->username);
    $asset_type = strtoupper($data->asset_type);
    $proper_area = strtoupper($data->proper_area);
    $area_detail = strtoupper($data->area_detail);
    $v_out = "";
    $type = strtoupper($data->type);

    if($type == "NR"){
        // echo json_encode("New Room");
        //check if room already exits
        $sql_check_room = "SELECT HD_ASSET_ROOM_LOCATION FROM AMSD.ASSETS_LOCATION WHERE HD_ASSET_ROOM_LOCATION = '$room_no'";

        $room_no_exec =$func->executeQuery($sql_check_room);

        if($room_no_exec){
            //return room no already exit;
            echo json_encode(array("rows" => 0 ,"data" =>"ROOM NO ALREADY EXISTS, CHOOSE DIFFERENT ROOM"));

        }else{
            $sql_new_room_proc = "BEGIN AMSD.asset_create_location(:USERNAME,'',:BUILDING,:LEVEL,:AREA,:AREA_NAME,:AREA_DETAIL,:ROOM_NO,:RESULT); END;";
            $statement = oci_parse($connect,$sql_new_room_proc);
            oci_bind_by_name($statement, ':USERNAME', $username, 30);
            oci_bind_by_name($statement, ':BUILDING', $building, -1);
            oci_bind_by_name($statement, ':LEVEL', $level, 30);
            oci_bind_by_name($statement, ':AREA', $proper_area, 30);
            oci_bind_by_name($statement, ':AREA_NAME', $area, -1);
            oci_bind_by_name($statement, ':AREA_DETAIL', $area_detail, -1);
            oci_bind_by_name($statement, ':ROOM_NO', $room_no, 30);
            oci_bind_by_name($statement, ':RESULT', $v_out, 2);

            oci_execute($statement , OCI_NO_AUTO_COMMIT);

            oci_commit($connect);

                if($v_out == "y"){
                    echo json_encode(array("rows" => 1 ,"data" =>"ROOM CREATED SUCCESSFULLY"));
                }
                else
                {
                    echo json_encode(array("rows" => 0 ,"data" =>"ROOM NOT CREATED"));
                }
        }

    }
    else if($type == "NSL"){
        // echo json_encode("New Sub Location");
        $sql_check_sub_location = "SELECT HD_ASSET_ROOM_LOCATION FROM AMSD.ASSETS_LOCATION WHERE HD_ASSET_ROOM_LOCATION = '$sub_location'";

        $sub_location_exec =$func->executeQuery($sql_check_sub_location);

        if($sub_location_exec){
            //return sub location already exit;
            echo json_encode(array("rows" => 0 ,"data" =>"SUB LOCATION ALREADY EXISTS, CHOOSE A DIFFERENT ONE"));
        }
        else{
            
            $sql_new_sub_proc = "BEGIN AMSD.assets_create_sub_location(:USERNAME,:ROOM_NO,:SUB_LOCATION,:ASSET_TYPE,:RESULT); END;";
            $statement = oci_parse($connect,$sql_new_sub_proc);
            oci_bind_by_name($statement, ':USERNAME', $username, 30);
            oci_bind_by_name($statement, ':ROOM_NO', $room_no, -1);
            oci_bind_by_name($statement, ':SUB_LOCATION', $sub_location, 30);
            oci_bind_by_name($statement, ':ASSET_TYPE', $asset_type, -1);
            oci_bind_by_name($statement, ':RESULT', $v_out, 2);

            oci_execute($statement , OCI_NO_AUTO_COMMIT);

            oci_commit($connect);

                if($v_out == "y"){
                    echo json_encode(array("rows" => 1 ,"data" =>"SUB LOCATION CREATED SUCCESSFULLY"));
                }
                else
                {
                    echo json_encode(array("rows" => 0 ,"data" =>"SUB LOCATION NOT CREATED"));
                }
            }
    }
    else if($type == "BT"){

        $sql_check_room = "SELECT HD_ASSET_ROOM_LOCATION FROM AMSD.ASSETS_LOCATION WHERE HD_ASSET_ROOM_LOCATION = '$room_no'";
        $sql_check_sub_location = "SELECT HD_ASSET_ROOM_LOCATION FROM AMSD.ASSETS_LOCATION WHERE HD_ASSET_ROOM_LOCATION = '$sub_location'";

        $room_exec = $func->executeQuery($sql_check_room);
        $sub_exec = $func->executeQuery($sql_check_sub_location);


        if($room_exec != false && $sub_exec != false){
            //room and sub exits
            echo json_encode(array("rows" => 0 ,"data" =>"ROOM NUMBER & SUB LOCATION ALREADY EXISTS, CHOOSE A DIFFERENT ONE`S"));
        }
        else if($room_exec == false && $sub_exec != false){
            //sub exits
            echo json_encode(array("rows" => 0 ,"data" =>"SUB LOCATION ALREADY EXISTS, CHOOSE A DIFFERENT ONE"));
        } 
        else if($room_exec != false && $sub_exec == false){
            //room exists
            echo json_encode(array("rows" => 0 ,"data" =>"ROOM NUMBER ALREADY EXISTS, CHOOSE A DIFFERENT ONE"));
        } 
        else if($room_exec == false && $sub_exec == false){
            // nothing exits
            
            $sql_new_room_proc = "BEGIN AMSD.asset_create_location(:USERNAME,'',:BUILDING,:LEVEL,:AREA,:AREA_NAME,:AREA_DETAIL,:ROOM_NO,:RESULT); END;";
            $statement = oci_parse($connect,$sql_new_room_proc);
            oci_bind_by_name($statement, ':USERNAME', $username, 30);
            oci_bind_by_name($statement, ':BUILDING', $building, -1);
            oci_bind_by_name($statement, ':LEVEL', $level, 30);
            oci_bind_by_name($statement, ':AREA', $proper_area, 30);
            oci_bind_by_name($statement, ':AREA_NAME', $area, -1);
            oci_bind_by_name($statement, ':AREA_DETAIL', $area_detail, -1);
            oci_bind_by_name($statement, ':ROOM_NO', $room_no, 30);
            oci_bind_by_name($statement, ':RESULT', $v_out, 2);

            oci_execute($statement , OCI_NO_AUTO_COMMIT);

            oci_commit($connect);

            if($v_out == "y"){

                $sql_new_sub_proc = "BEGIN AMSD.assets_create_sub_location(:USERNAME,:ROOM_NO,:SUB_LOCATION,:ASSET_TYPE,:RESULT); END;";
                $statement = oci_parse($connect,$sql_new_sub_proc);
                oci_bind_by_name($statement, ':USERNAME', $username, 30);
                oci_bind_by_name($statement, ':ROOM_NO', $room_no, -1);
                oci_bind_by_name($statement, ':SUB_LOCATION', $sub_location, 30);
                oci_bind_by_name($statement, ':ASSET_TYPE', $asset_type, -1);
                oci_bind_by_name($statement, ':RESULT', $v_out, 2);

                oci_execute($statement , OCI_NO_AUTO_COMMIT);

                oci_commit($connect);

                    if($v_out == "y"){
                        echo json_encode(array("rows" => 1 ,"data" =>"SUB & ROOM CREATED SUCCESSFULLY"));
                    }
                    else
                    {
                        echo json_encode(array("rows" => 0 ,"data" =>"SUB LOCATION NOT CREATED"));
                    }
            }
            else
            {
                echo json_encode(array("rows" => 0 ,"data" =>"ROOM NOT CREATED"));
            }
        } 

    }
});

$app->map(['GET','POST'],'/asset_print_cert',function(Request $request, Response $response){

    try{

        global $connect;

        $data = json_decode(file_get_contents('php://input'));
        $cert = strtoupper($data->cert_no);
        $v_asset_boq = strtoupper($data->v_asset_boq);
        $v_asset_invno = strtoupper($data->v_asset_invno);
        $v_asset_ref = strtoupper($data->v_asset_ref);
        $username = strtoupper($data->username);
        $v_out = "";


        $sql  = "BEGIN AMSD.asset_certificate_print(:v_asset_user,:v_asset_cert_no,:v_asset_boq,:v_asset_invno,:v_asset_ref,:v_out); END;";
        $statement = oci_parse($connect,$sql);
        oci_bind_by_name($statement, ':v_asset_user', $username, 50);
        oci_bind_by_name($statement, ':v_asset_cert_no', $cert, 50);
        oci_bind_by_name($statement, ':v_asset_boq', $v_asset_boq, 50);
        oci_bind_by_name($statement, ':v_asset_invno', $v_asset_invno, 50);
        oci_bind_by_name($statement, ':v_asset_ref', $v_asset_ref, 50);
        oci_bind_by_name($statement, ':v_out',  $v_out, 2);

        oci_execute($statement , OCI_NO_AUTO_COMMIT);

        oci_commit($connect);

        if($v_out == "y"){
            echo json_encode(array("rows" => 1 ,"data" =>"CERTIFICATE PRINTED SUCCESSFULLY"));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"CERTIFICATE PRINT WAS NOT COMMISSIONED"));
        }
    }
    catch (Exception $pdoex) {
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

        $sql = "BEGIN AMSD.asset_it_fix_unlink_sub(:USERNAME,:ASSET_ID,:RESULT); END;";
        $statement = oci_parse($connect,$sql);
        oci_bind_by_name($statement, ':USERNAME', $USERNAME, 30);
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

$app->map(['GET','POST'],'/getAllUsers_on_class',function(Request $request, Response $response){
    try{
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $asset_class = strtoupper($data->asset_class);
        $role = strtoupper($data->role);
        $user = strtoupper($data->user);

        if($asset_class == 'ALL EQUIPMENT' && $role == 'ADMIN')
            $sql = "SELECT * FROM ASSETS_USER WHERE ASSET_USER_STATUS = '1' AND ASSET_USERNAME <> '$user' ORDER BY ASSET_USERNAME ASC";
        else{
            if($asset_class == 'ALL EQUIPMENT')
                $asset_class = '';

            $sql = "SELECT * FROM ASSETS_USER WHERE ASSET_USER_CLASS LIKE '%$asset_class%' AND ASSET_USER_STATUS = '1' AND ASSET_USERNAME <> '$user'";
        }

        $users =$func->executeQuery($sql);

        if($users){

            //  echo $users;

               $assets_decode = json_decode($users);

            // print_r($assets_decode);


            $len = $assets_decode->rows;

             $str = '{"data" : [';

                for ($k = 0; $k < $len; $k++) {

                    if (($len - 1) == $k) {
                        $str .= '["' . $assets_decode->data[$k]->ASSET_USERNAME . '","';
                        $str .= $assets_decode->data[$k]->ASSET_USER_BADGENO . '","';
                        $str .= $assets_decode->data[$k]->ASSET_USER_CLASS . '","';
                        $str .= $assets_decode->data[$k]->ASSET_USER_CREATED . '","';
                        $str .= $func->desc_role($assets_decode->data[$k]->ASSET_USER_ROLES) . '"]';
                    } else {
                        $str .= '["' . $assets_decode->data[$k]->ASSET_USERNAME . '","';
                        $str .= $assets_decode->data[$k]->ASSET_USER_BADGENO . '","';
                        $str .= $assets_decode->data[$k]->ASSET_USER_CLASS . '","';
                        $str .= $assets_decode->data[$k]->ASSET_USER_CREATED . '","';
                        $str .= $func->desc_role($assets_decode->data[$k]->ASSET_USER_ROLES) . '"],';
                    }

                }

                $str .= ']}';

                $str = str_replace("\n", "", $str);
                $str = str_replace("\\", "", $str);

                // echo  $str;

                echo json_encode(array("rows" =>$len ,"data" => $str ));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"Error"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});

$app->map(['GET','POST'],'/getUsers_dash',function(Request $request, Response $response){
    try{
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $building = strtoupper($data->building);
        $level = strtoupper($data->level);
        $area_name = strtoupper($data->area_name);
        $area = strtoupper($data->area);
        $room_no = strtoupper($data->room_no);
        $assetNo = strtoupper($data->assetNo);
        $dateStart = strtoupper($data->dateStart);
        $dateEnd = strtoupper($data->dateEnd);
        $asset_class = strtoupper($data->asset_class);
        $role = strtoupper($data->role);
        $user = strtoupper($data->user);

        // echo $dateStart." - ".$dateEnd;

        if($asset_class == 'ALL EQUIPMENT' && $role == 'ADMIN')
            $sql = "SELECT * FROM ASSETS_USER WHERE ASSET_USER_STATUS = '1' AND ASSET_USERNAME <> '$user' AND  ASSET_USER_CREATED BETWEEN  to_date('$dateStart 00:00:00','YYYY/MM/DD HH24:MI:SS') 
            and to_date('$dateEnd 23:59:59','YYYY/MM/DD HH24:MI:SS') ORDER BY ASSET_USERNAME ASC";
        else{
            if($asset_class == 'ALL EQUIPMENT')
                $asset_class = '';

            $sql = "SELECT * FROM ASSETS_USER WHERE ASSET_USER_CLASS LIKE '%$asset_class%' AND ASSET_USER_STATUS = '1' AND ASSET_USERNAME <> '$user' AND ASSET_USER_CREATED BETWEEN  to_date('$dateStart 00:00:00','YYYY/MM/DD HH24:MI:SS') 
            and to_date('$dateEnd 23:59:59','YYYY/MM/DD HH24:MI:SS')";
        }

        $users =$func->executeQuery($sql);

        if($users){

            // echo $users;

            $assets_decode = json_decode($users);

            // print_r($assets_decode);

            $len = $assets_decode->rows;

             $str = '{"data" : [';

                for ($k = 0; $k < $len; $k++) {

                    if (($len - 1) == $k) {
                        $str .= '["' . $assets_decode->data[$k]->ASSET_USERNAME . '","';
                        $str .= $assets_decode->data[$k]->ASSET_USER_BADGENO . '","';
                        $str .= $assets_decode->data[$k]->ASSET_USER_CLASS . '","';
                        $str .= $assets_decode->data[$k]->ASSET_USER_CREATED . '","';
                        $str .= $func->desc_role($assets_decode->data[$k]->ASSET_USER_ROLES) . '"]';
                    } else {
                        $str .= '["' . $assets_decode->data[$k]->ASSET_USERNAME . '","';
                        $str .= $assets_decode->data[$k]->ASSET_USER_BADGENO . '","';
                        $str .= $assets_decode->data[$k]->ASSET_USER_CLASS . '","';
                        $str .= $assets_decode->data[$k]->ASSET_USER_CREATED . '","';
                        $str .= $func->desc_role($assets_decode->data[$k]->ASSET_USER_ROLES) . '"],';
                    }

                }

                $str .= ']}';

                $str = str_replace("\n", "", $str);
                $str = str_replace("\\", "", $str);

                // echo  $str;

                echo json_encode(array("rows" =>$len ,"data" => $str ));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"Error"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});

$app->map(['GET','POST'],'/getActiveAssets',function(Request $request, Response $response){
    try{
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $building = strtoupper($data->building);
        $level = strtoupper($data->level);
        $area_name = strtoupper($data->area_name);
        $area = strtoupper($data->area);
        $room_no = strtoupper($data->room_no);
        $assetNo = strtoupper($data->assetNo);
        $dateStart = strtoupper($data->dateStart);
        $dateEnd = strtoupper($data->dateEnd);
        $asset_class = strtoupper($data->asset_class);
        $sub_location = strtoupper($data->sub_location);
        $role = strtoupper($data->role);
        $user = strtoupper($data->user);

        if($asset_class == 'ALL EQUIPMENT')
            $asset_class = '';

        $sql = "SELECT * 
                FROM ASSETS_VW 
                WHERE ASSET_STATUS = 'ACTIVE'
                AND   ASSET_ID LIKE '%$assetNo%'
                AND   ASSET_BUILDING LIKE '%$building%'
                AND   ASSET_LEVEL LIKE '%$level%'
                AND   (ASSET_AREA LIKE '%$area%' OR ASSET_AREA_NAME LIKE '%$area_name%')
                AND   ASSET_ROOM_NO LIKE '%$room_no%'
                AND   ASSET_SUB_LOCATION LIKE '%$sub_location%'
                AND   ASSET_CREATE_DT BETWEEN to_date('$dateStart','YYYY/MM/DD HH24:MI:SS')
                                    AND to_date('$dateEnd 23:59:59','YYYY/MM/DD HH24:MI:SS')";
    
        $users =$func->executeQuery($sql);

        if($users){
             echo $users;
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"Error"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});

$app->map(['GET','POST'],'/getInactiveAssets',function(Request $request, Response $response){
    try{
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $building = strtoupper($data->building);
        $level = strtoupper($data->level);
        $area_name = strtoupper($data->area_name);
        $area = strtoupper($data->area);
        $room_no = strtoupper($data->room_no);
        $assetNo = strtoupper($data->assetNo);
        $dateStart = strtoupper($data->dateStart);
        $dateEnd = strtoupper($data->dateEnd);
        $asset_class = strtoupper($data->asset_class);
        $sub_location = strtoupper($data->sub_location);
        $role = strtoupper($data->role);
        $user = strtoupper($data->user);

        if($asset_class == 'ALL EQUIPMENT')
            $asset_class = '';

        $sql = "SELECT * 
                FROM ASSETS_VW 
                WHERE ASSET_STATUS = 'INACTIVE'
                AND   ASSET_ID LIKE '%$assetNo%'
                AND   ASSET_BUILDING LIKE '%$building%'
                AND   ASSET_LEVEL LIKE '%$level%'
                AND   (ASSET_AREA LIKE '%$area%' OR ASSET_AREA_NAME LIKE '%$area_name%')
                AND   ASSET_ROOM_NO LIKE '%$room_no%'
                AND   ASSET_SUB_LOCATION LIKE '%$sub_location%'
                AND   ASSET_CREATE_DT BETWEEN to_date('$dateStart','YYYY/MM/DD HH24:MI:SS')
                                    AND to_date('$dateEnd 23:59:59','YYYY/MM/DD HH24:MI:SS')";
    
        $users =$func->executeQuery($sql);

        if($users){
             echo $users;
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"Error"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});


$app->map(['GET','POST'],'/getPendingAssets_dash',function(Request $request, Response $response){
    try{
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $building = strtoupper($data->building);
        $level = strtoupper($data->level);
        $area_name = strtoupper($data->area_name);
        $area = strtoupper($data->area);
        $room_no = strtoupper($data->room_no);
        $assetNo = strtoupper($data->assetNo);
        $dateStart = strtoupper($data->dateStart);
        $dateEnd = strtoupper($data->dateEnd);
        $asset_class = strtoupper($data->asset_class);
        $sub_location = strtoupper($data->sub_location);
        $role = strtoupper($data->role);
        $user = strtoupper($data->user);

        if($asset_class == 'ALL EQUIPMENT')
            $asset_class = '';

        $sql = "SELECT * 
                FROM AMSD.ASSETS_LOG_PENDING_VW 
                WHERE ASSET_ID LIKE '%$assetNo%'
                AND   (ASSET_BUILDING_OLD LIKE '%$building%' OR ASSET_BUILDING_NEW LIKE '%$building%')
                AND   (ASSET_LEVEL_OLD LIKE '%$level%' OR ASSET_LEVEL_NEW LIKE '%$level%')
                AND  ((ASSET_LOCATION_AREA_OLD LIKE '%$area%' OR ASSET_LOCATION_AREA_NEW LIKE '%$area%')
                OR   (ASSET_LOCATION_AREA_OLD LIKE '%$area_name%' OR ASSET_LOCATION_AREA_NEW LIKE '%$area_name%'))
                AND   (ASSET_ROOM_NO_OLD LIKE '%$room_no%' OR ASSET_ROOM_NO_NEW LIKE '%$room_no%') 
                AND   (ASSET_SUB_LOCATION_OLD LIKE '%$sub_location%' OR ASSET_SUB_LOCATION_NEW LIKE '%$sub_location%')
                AND   ASSET_DATE BETWEEN  to_date('$dateStart 00:00:00','YYYY/MM/DD HH24:MI:SS') 
                                      and to_date('$dateEnd 23:59:59','YYYY/MM/DD HH24:MI:SS')";
    
        $users =$func->executeQuery($sql);

        if($users){

             echo $users;

            //    $assets_decode = json_decode($users);

            // // print_r($assets_decode);


            // $len = $assets_decode->rows;

            //  $str = '{"data" : [';

            //     for ($k = 0; $k < $len; $k++) {

            //         if (($len - 1) == $k) {
            //             $str .= '["' . $assets_decode->data[$k]->ASSET_USERNAME . '","';
            //             $str .= $assets_decode->data[$k]->ASSET_USER_BADGENO . '","';
            //             $str .= $assets_decode->data[$k]->ASSET_USER_CLASS . '","';
            //             $str .= $assets_decode->data[$k]->ASSET_USER_CREATED . '","';
            //             $str .= $func->desc_role($assets_decode->data[$k]->ASSET_USER_ROLES) . '"]';
            //         } else {
            //             $str .= '["' . $assets_decode->data[$k]->ASSET_USERNAME . '","';
            //             $str .= $assets_decode->data[$k]->ASSET_USER_BADGENO . '","';
            //             $str .= $assets_decode->data[$k]->ASSET_USER_CLASS . '","';
            //             $str .= $assets_decode->data[$k]->ASSET_USER_CREATED . '","';
            //             $str .= $func->desc_role($assets_decode->data[$k]->ASSET_USER_ROLES) . '"],';
            //         }

            //     }

            //     $str .= ']}';

            //     $str = str_replace("\n", "", $str);
            //     $str = str_replace("\\", "", $str);

            //     // echo  $str;

            //     echo json_encode(array("rows" =>$len ,"data" => $str ));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"Error"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});

$app->map(['GET','POST'],'/getMovedAssets_dash',function(Request $request, Response $response){
    try{
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $building = strtoupper($data->building);
        $level = strtoupper($data->level);
        $area_name = strtoupper($data->area_name);
        $area = strtoupper($data->area);
        $room_no = strtoupper($data->room_no);
        $dateStart = strtoupper($data->dateStart);
        $dateEnd = strtoupper($data->dateEnd);
        $asset_class = strtoupper($data->asset_class);
        $role = strtoupper($data->role);
        $user = strtoupper($data->user);

        if($asset_class == 'ALL EQUIPMENT')
            $asset_class = '';

        $sql = "SELECT asset_username,
                        asset_class,
                        asset_primary_id,
                        asset_type,
                        asset_id,
                        asset_description,       
                        from_asset_room_no,
                        to_asset_room_no,
                        from_asset_sub_location,
                        to_asset_sub_location,
                        asset_date,
                        AMSD.fn_get_asset_tran_status(asset_tran_status) as asset_transaction_status
                from
                (
                select asset_username,
                        amsd.fn_get_asset_class(asset_id) as asset_class,
                        asset_primary_id,
                        AMSD.fn_get_asset_type(asset_primary_id) as asset_type,
                        asset_id,
                        AMSD.fn_get_asset_description(asset_id) as asset_description,       
                        asset_room_no_old as from_asset_room_no,
                        asset_room_no_new as to_asset_room_no,
                        asset_sub_location_old as from_asset_sub_location,
                        asset_sub_location_new as to_asset_sub_location,
                        max(asset_date) over (partition by asset_id, asset_primary_id) as asset_date_max,
                        asset_date,
                        row_number() over (partition by asset_id, asset_primary_id order by asset_primary_id, asset_id,asset_date desc) as asset_order,
                        --AMSD.fn_get_asset_tran_status(asset_tran_status) as asset_transaction_status
                        asset_tran_status
                from amsd.assets_log
                --movement only
                where (asset_room_no_old <> asset_room_no_new
                    or asset_sub_location_old <> asset_sub_location_new)
                order by asset_primary_id, asset_id,asset_date
                )
                where asset_order = 1
                --all assets movement excluding pending movement
                and asset_tran_status in ('C','CT')
                and asset_date between to_date('2019/11/10 00:00:00','YYYY/MM/DD HH24:MI:SS') and to_date('2019/11/20 23:59:59','YYYY/MM/DD HH24:MI:SS')
                and asset_class LIKE '$asset_class'";
        
        $users =$func->executeQuery($sql);

        if($users){

             echo $users;

            //    $assets_decode = json_decode($users);

            // // print_r($assets_decode);


            // $len = $assets_decode->rows;

            //  $str = '{"data" : [';

            //     for ($k = 0; $k < $len; $k++) {

            //         if (($len - 1) == $k) {
            //             $str .= '["' . $assets_decode->data[$k]->ASSET_USERNAME . '","';
            //             $str .= $assets_decode->data[$k]->ASSET_USER_BADGENO . '","';
            //             $str .= $assets_decode->data[$k]->ASSET_USER_CLASS . '","';
            //             $str .= $assets_decode->data[$k]->ASSET_USER_CREATED . '","';
            //             $str .= $func->desc_role($assets_decode->data[$k]->ASSET_USER_ROLES) . '"]';
            //         } else {
            //             $str .= '["' . $assets_decode->data[$k]->ASSET_USERNAME . '","';
            //             $str .= $assets_decode->data[$k]->ASSET_USER_BADGENO . '","';
            //             $str .= $assets_decode->data[$k]->ASSET_USER_CLASS . '","';
            //             $str .= $assets_decode->data[$k]->ASSET_USER_CREATED . '","';
            //             $str .= $func->desc_role($assets_decode->data[$k]->ASSET_USER_ROLES) . '"],';
            //         }

            //     }

            //     $str .= ']}';

            //     $str = str_replace("\n", "", $str);
            //     $str = str_replace("\\", "", $str);

            //     // echo  $str;

            //     echo json_encode(array("rows" =>$len ,"data" => $str ));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"Error"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});

$app->map(['GET','POST'],'/getSearchUser',function(Request $request, Response $response){
    try{
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $username = strtoupper($data->username);

        $sql = "SELECT * FROM ASSETS_USER WHERE ASSET_USERNAME LIKE '%$username%' ORDER BY ASSET_USERNAME ASC";

        $users =$func->executeQuery($sql);

        if($users){

             echo $users;
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"Error"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});

$app->map(['GET','POST'],'/getCounts',function(Request $request, Response $response){
    try{
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $building = strtoupper($data->building);
        $level = strtoupper($data->level);
        $area_name = strtoupper($data->area_name);
        $area = strtoupper($data->area);
        $room_no = strtoupper($data->room_no);
        $sub_location = strtoupper($data->sub_location);
        $dateStart = strtoupper($data->dateStart);
        $dateEnd = strtoupper($data->dateEnd);
        $assetNo = strtoupper($data->assetNo);
        $asset_class = strtoupper($data->asset_class);
        $role = strtoupper($data->role);
        $user = strtoupper($data->user);

        if($asset_class == "ALL EQUIPMENT"){
            $asset_class = '';
        }

        $sql = "--------------- active --------------------
                    SELECT 
                    (SELECT count(*) 
                    FROM ASSETS_VW 
                    WHERE ASSET_STATUS = 'INACTIVE'
                    AND   ASSET_CLASS LIKE '%$asset_class%'
                    AND   ASSET_ID LIKE '%$assetNo%'
                    AND   ASSET_BUILDING LIKE '%$building%'
                    AND   ASSET_LEVEL LIKE '%$level%'
                    AND   ASSET_AREA LIKE '%$area%'
                    AND   ASSET_AREA_NAME LIKE '%$area_name%'
                    AND   ASSET_ROOM_NO LIKE '%$room_no%'
                    AND   ASSET_SUB_LOCATION LIKE '%$sub_location%'
                    AND   (ASSET_CREATE_DT BETWEEN to_date('$dateStart 00:00:00','YYYY/MM/DD HH24:MI:SS')
                                        AND to_date('$dateEnd 23:59:59','YYYY/MM/DD HH24:MI:SS') OR ASSET_CREATE_DT IS NULL))  AS \"INACTIVE\"
                ,   
                    --------------------------------------------
                    ----------------inactive--------------------
                    --------------------------------------------
                    (SELECT count(*)
                    FROM ASSETS_VW 
                    WHERE ASSET_STATUS = 'ACTIVE'
                    AND   ASSET_CLASS LIKE '%$asset_class%'
                    AND   ASSET_ID LIKE '%$assetNo%'
                    AND   ASSET_BUILDING LIKE '%$building%'
                    AND   ASSET_LEVEL LIKE '%$level%'
                    AND   ASSET_AREA LIKE '%$area%'
                    AND   ASSET_AREA_NAME LIKE '%$area_name%'
                    AND   ASSET_ROOM_NO LIKE '%$room_no%'
                    AND   ASSET_SUB_LOCATION LIKE '%$sub_location%'
                    AND   (ASSET_CREATE_DT BETWEEN to_date('$dateStart 00:00:00','YYYY/MM/DD HH24:MI:SS')
                                        AND to_date('$dateEnd 23:59:59','YYYY/MM/DD HH24:MI:SS')OR ASSET_CREATE_DT IS NULL) ) AS \"ACTIVE\",
                    ---------------------------------------------------------------------------
                    ------------------- unassigned assets certificates ------------------------
                    ---------------------------------------------------------------------------
                    (SELECT count(*)
                    FROM ASSETS_VW 
                    WHERE ASSET_CERT_NO IS NULL
                    AND   ASSET_CLASS LIKE '%$asset_class%'
                    AND   ASSET_ID LIKE '%$assetNo%'
                    AND   ASSET_BUILDING LIKE '%$building%'
                    AND   ASSET_LEVEL LIKE '%$level%'
                    AND   ASSET_AREA LIKE '%$area%' 
                    AND   ASSET_AREA_NAME LIKE '%$area_name%'
                    AND   ASSET_ROOM_NO LIKE '%$room_no%'
                    AND   ASSET_SUB_LOCATION LIKE '%$sub_location%'
                    AND   (ASSET_CREATE_DT BETWEEN to_date('$dateStart 00:00:00','YYYY/MM/DD HH24:MI:SS')
                                        AND to_date('$dateEnd 23:59:59','YYYY/MM/DD HH24:MI:SS')OR ASSET_CREATE_DT IS NULL) ) AS \"assetsWithNoCert\",
                    -------------------------------------------------------------------------
                    ------------------- assigned assets certificates ------------------------
                    -------------------------------------------------------------------------
                    (SELECT count(*)
                    FROM ASSETS_VW 
                    WHERE ASSET_CERT_NO IS NOT NULL
                    AND   ASSET_CLASS LIKE '%$asset_class%'
                    AND   ASSET_ID LIKE '%$assetNo%'
                    AND   ASSET_BUILDING LIKE '%$building%'
                    AND   ASSET_LEVEL LIKE '%$level%'
                    AND   ASSET_AREA LIKE '%$area%' 
                    AND   ASSET_AREA_NAME LIKE '%$area_name%'
                    AND   ASSET_ROOM_NO LIKE '%$room_no%'
                    AND   ASSET_SUB_LOCATION LIKE '%$sub_location%'
                    AND   (ASSET_CREATE_DT BETWEEN to_date('$dateStart 00:00:00','YYYY/MM/DD HH24:MI:SS')
                                        AND to_date('$dateEnd 23:59:59','YYYY/MM/DD HH24:MI:SS')OR ASSET_CREATE_DT IS NULL) ) AS \"assetsWithCert\",
                    ---------------------------------------------
                    ---------------- pending --------------------
                    ---------------------------------------------
                    (SELECT count(*) 
                    FROM AMSD.ASSETS_LOG_PENDING_VW 
                    WHERE ASSET_ID LIKE '%$assetNo%'
                    AND   (ASSET_BUILDING_OLD LIKE '%$building%' OR   ASSET_BUILDING_NEW LIKE '%$building%')
                    AND   (ASSET_LEVEL_OLD LIKE '%$level%' OR ASSET_LEVEL_NEW LIKE '%$level%')
                    AND   ((ASSET_LOCATION_AREA_OLD LIKE '%$area%' OR ASSET_LOCATION_AREA_NEW LIKE '%$area_name%') 
                    OR    (ASSET_LOCATION_AREA_OLD LIKE '%$area_name%' OR ASSET_LOCATION_AREA_NEW LIKE '%$area%') )
                    AND   (ASSET_ROOM_NO_OLD LIKE '%$room_no%' OR ASSET_ROOM_NO_NEW LIKE '%$room_no%')
                    AND   (ASSET_SUB_LOCATION_OLD LIKE '%$sub_location%' OR ASSET_SUB_LOCATION_NEW LIKE '%$sub_location%')
                    AND   (ASSET_DATE BETWEEN  to_date('$dateStart 00:00:00','YYYY/MM/DD HH24:MI:SS')
                                        and to_date('$dateEnd 23:59:59','YYYY/MM/DD HH24:MI:SS' )OR ASSET_DATE IS NULL)) AS \"PENDING\",
                    (
                    select count(*)
                    from
                    (
                    select asset_username,
                        amsd.fn_get_asset_class(asset_id) as asset_class,
                        asset_primary_id,
                        AMSD.fn_get_asset_type(asset_primary_id) as asset_type,
                        asset_id,
                        AMSD.fn_get_asset_description(asset_id) as asset_description,       
                        asset_room_no_old as from_asset_room_no,
                        asset_room_no_new as to_asset_room_no,
                        asset_sub_location_old as from_asset_sub_location,
                        asset_sub_location_new as to_asset_sub_location,
                        max(asset_date) over (partition by asset_id, asset_primary_id) as asset_date_max,
                        asset_date,
                        row_number() over (partition by asset_id, asset_primary_id order by asset_primary_id, asset_id,asset_date desc) as asset_order,
                        --AMSD.fn_get_asset_tran_status(asset_tran_status) as asset_transaction_status
                        asset_tran_status
                    from amsd.assets_log
                    --movement only
                    where (asset_room_no_old <> asset_room_no_new
                        or asset_sub_location_old <> asset_sub_location_new)
                    order by asset_primary_id, asset_id,asset_date
                    )
                    where asset_order = 1
                    --all assets movement excluding pending movement
                    and asset_tran_status in ('C','CT')
                    and (asset_date between to_date('2000/01/01 00:00:00','YYYY/MM/DD HH24:MI:SS') and to_date('9999/12/31 23:59:59','YYYY/MM/DD HH24:MI:SS') OR asset_date IS NULL)
                    and asset_class LIKE '%%'           
                    ) AS \"MOVED\",
                    ------------------------------------------------
                    ------------------ ACTIVE USERS -----------------
                    ------------------------------------------------
                    (SELECT count(*) 
                    FROM ASSETS_USER 
                    WHERE ASSET_USER_CLASS LIKE '%$asset_class %'
                    AND ASSET_USER_STATUS = '1' 
                    AND ASSET_USERNAME <> '$user' 
                    AND (ASSET_USER_CREATED BETWEEN  to_date('$dateStart 00:00:00','YYYY/MM/DD HH24:MI:SS') 
                                and to_date('$dateEnd 23:59:59','YYYY/MM/DD HH24:MI:SS') OR ASSET_USER_CREATED IS NULL)) AS \"USERS\" 
                    FROM DUAL";

        $users =$func->executeQuery($sql);

        if($users){

             echo $users;
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"Error"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});


$app->map(['GET','POST'],'/getAdminUser',function(Request $request, Response $response){
    try{
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $user = strtoupper($data->user);

        $sql = "SELECT * FROM ASSETS_USER WHERE ASSET_USERNAME = '$user'";
        
        $users =$func->executeQuery($sql);

        if($users){

             echo $users;
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"Error"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});

$app->map(['GET','POST'],'/getClasses',function(Request $request, Response $response){
    try{
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $asset_class = strtoupper($data->asset_class);
        $role = strtoupper($data->role);

        if($asset_class == 'ALL EQUIPMENT' && $role == 'ADMIN')
                $sql = "SELECT * FROM ASSETS_CLASS";
        else{
            if($asset_class == 'ALL EQUIPMENT')
                $asset_class = '';
            
                $sql = "SELECT * FROM ASSETS_CLASS WHERE ASSET_CLASS_NAME LIKE '%$asset_class%'";
        }

        $users =$func->executeQuery($sql);

        if($users){

             echo $users;
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"Error"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});

$app->map(['GET','POST'],'/deleteUser',function(Request $request, Response $response){
    try{
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $username = strtoupper($data->username);

        $sql = "UPDATE ASSETS_USER SET ASSET_USER_STATUS = '0' WHERE ASSET_USERNAME = '$username'";

        $deleteusers =$func->executeNonQuery($sql);

        if($deleteusers){

            echo json_encode(array("rows" => 1 ,"data" =>"User ".$username." Successfully deleted"));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"User was not deleted"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});
$app->map(['GET','POST'],'/updateAdminUser',function(Request $request, Response $response){
    try{
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $roles = strtoupper($data->roles);
        $username = strtoupper($data->username);

        $sql = "UPDATE ASSETS_USER SET ASSET_USER_ROLES = '$roles' WHERE ASSET_USERNAME = '$username'";

        $deleteusers =$func->executeNonQuery($sql);

        if($deleteusers){

            echo json_encode(array("rows" => 1 ,"data" =>"User ".$username." Successfully Updates Roles"));
        }
        else{
            echo json_encode(array("rows" => 0 ,"data" =>"User was not Updated"));
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});

$app->map(['GET','POST'],'/createUser',function(Request $request, Response $response){
    try{
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $username = strtoupper($data->u_username);
        $u_badge = strtoupper($data->u_badge);
        $u_class = strtoupper($data->u_class);
        $user_added_by = strtoupper($data->user_added_by);
        $u_roles = strtoupper($data->u_roles);  

        $sql = "SELECT * FROM AMSD.ASSETS_USER WHERE ASSET_USERNAME = '$username'";

        $res = $func->executeQuery($sql);

        if($res){
            echo json_encode(array("rows" => 2 ,"data" =>"User already Exists"));
        }else{
            $sql = "INSERT INTO AMSD.ASSETS_USER VALUES('$username','$u_badge','$u_class',sysdate,'added by ".$user_added_by."','$u_roles','1')";

            $userAdded =$func->executeNonQuery($sql);
    
            if($userAdded){
                echo json_encode(array("rows" => 1 ,"data" =>"User Successfully Added"));
            }
            else{
                echo json_encode(array("rows" => 0 ,"data" =>"User was not Added"));
            }
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});

$app->map(['GET','POST'],'/edit_assets',function(Request $request, Response $response){
    try{
        global $func;
        $data = json_decode(file_get_contents('php://input'));
        $asset_id = strtoupper($data->asset_id); 
        $response = array();

        $sql = "SELECT * FROM AMSD.ASSETS WHERE ASSET_ID = '$asset_id'";

        $res = $func->executeQuery($sql);

        if($res){
            // echo $res;
            $get_data = json_decode($res);

            $asset_type = $func->executeQuery("SELECT ASSET_TYPE_DESC FROM AMSD.ASSETS_TYPE ORDER BY ASSET_TYPEID");

            if($asset_type){
                $asset_type_dc = json_decode($asset_type);
                $count = count($asset_type_dc->data);
                $str = '<div class="row" id="user_info">
                        <div class="col-md-4 p-0">
                            <div class="form-group">
                                <div class="col-md-12 p-0">
                                    <label for="v_asset_type">ASSET MODEL</label>
                                </div>
                                <div class="col-md-12 p-0">
                                    <input type="text" value="'.$func->replaceNull($get_data->data[0]->ASSET_MODEL).'" required name="v_asset_type" class="form-control" id="v_asset_type">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 p-0">
                            <div class="form-group">
                                <div class="col-md-12">
                                    <label for="v_service_date">ASSET SERVICE DATE</label>
                                </div>
                                <div class="col-md-12">
                                    <input type="date" value="'.$func->replaceNull($get_data->data[0]->ASSET_SERVICE_DT).'" required name="v_service_date" class="form-control" id="v_service_date">
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4 p-0">
                            <div class="form-group">
                                <div class="col-md-12 p-0">
                                    <label for="v_service_by">ASSET TYPE</label>
                                </div>
                                <div class="col-md-12 p-0">
                                    <select id="asset_types" required class="form-control">
                                        <option value="db_opt">'.$func->replaceNull($get_data->data[0]->ASSET_TYPE).'</option>';

                                        for($t=0;$t<$count;$t++){
                                            $str .= '<option value=val_'.$t.'>'.$asset_type_dc->data[$t]->ASSET_TYPE_DESC.'</option>';
                                        }
                                        
                                $str .= ' </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row" id="user_info">
                        <div class="col-md-4 p-0">
                            <div class="form-group">
                                <div class="col-md-12 p-0">
                                    <label for="v_asset_comments">ASSET COMMMENTS</label>
                                </div>
                                <div class="col-md-12 p-0">
                                    <input type="text" value="'.$func->replaceNull($get_data->data[0]->ASSET_COMMENTS).'" required name="v_asset_comments" class="form-control" id="v_asset_comments">
                                </div>
                            </div>
                        </div>
                    </div>';

                    array_push($response,array("data"=>$str,"rows"=>"1"));
                    return json_encode($response);

            }

        }
        else{
            // array_push($response,array("data"=>"","rows"=>"0"));
            // return json_encode($response);
        }

    }catch (Exception $pdoex) {
        echo "Database Error : " . $pdoex->getMessage();
    }
});

$app->map(['GET','POST'],'/update_asset', function(Request $request, Response $responce){
    global $func;
    $data = json_decode(file_get_contents('php://input'));
    $asset_model = strtoupper($data->asset_model); 
    $asset_service_date = strtoupper($data->asset_service_date); 
    $asset_comments = strtoupper($data->asset_comments); 
    $asset_id = strtoupper($data->asset_id); 
    $response = array();

    $sql_update = "UPDATE AMSD.ASSETS SET ASSET_MODEL = '$asset_model', ASSET_SERVICE_DT = '$asset_service_date', ASSET_COMMENTS='$asset_comments' WHERE ASSET_ID = '$asset_id'";

    $update_exec = $func->executeNoNQuery($sql_update);

    if($update_exec){
        $code = "update_success";
        $message = "SUCCESSFULLY UPDATED ASSET DETAILS";
        array_push($response,array("code"=>$code,"message"=>$message));
        return json_encode($response);
    }
    else{
        $code = "update_failed";
        $message = "FAILED TO UPDATE ASSET DETAILS";
        array_push($response,array("code"=>$code,"message"=>$message));
        return json_encode($response);
    }

});

$app->map(['GET','POST'],'/get_usernames', function(Request $request, Response $response){
    global $func;
    $data = json_encode(file_get_contents('php://input'));
});

$app->run();
