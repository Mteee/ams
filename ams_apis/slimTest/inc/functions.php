<?php

//Database Connection
try{
	session_start();
	error_reporting(E_ALL);
	ini_set('display_errors', '1');
	$connect = oci_connect('AMSD', 'amsd', '10.192.200.157:1521/lms1.ialch.co.za');
	
	//$connect= new PDO('mysql:host=localhost;dbname=ame','root','');
	//$dbh = new PDO('oci:dbname=10.192.200.173:1521/XE/dwpd1', 'ame_mirth', 'am3_m1rth');
	//$this->dbh = new PDO("mysql:host=".$server.";dbname=".dbname, $db_username, $db_password);

}catch(PDOException $pdoex){
	echo "Unable to connect to development environment error : " . $pdoex->getMessage();
}

class Functions{

	//Function to get all files form the dwdev.dev_log_sapgl table for a specific date
	public function executeQuery($query){
		$count = 0;
		$arr = array();
		try {
			global $connect;
			// $sql="SELECT ASSET_ID,ASSET_CLASS,ASSET_ROOM_NO,ASSET_LOCATION,ASSET_DESCRIPTION,RECSTATUS FROM DWDEV.DEV_SAP_ASSETS WHERE ASSET_ID ='ZBM1053-0021'";
			$statement = oci_parse($connect,$query);
			oci_execute($statement);
		
			while (($row = oci_fetch_assoc($statement)) != false) {
				$arr [] = $row;
				$count++;
			}

			if($count > 0){
				return json_encode(array("rows" => $count ,"data" =>$arr));
			}else{
				return false;
			}

		} catch (PDOException $pdoex) {
			echo "Database Error : " . $pdoex->getMessage();
		}
	}

	public function executeNonQuery($query){

		try {
			global $connect;
			// $sql="SELECT ASSET_ID,ASSET_CLASS,ASSET_ROOM_NO,ASSET_LOCATION,ASSET_DESCRIPTION,RECSTATUS FROM DWDEV.DEV_SAP_ASSETS WHERE ASSET_ID ='ZBM1053-0021'";
			$statement = oci_parse($connect,$query);

			return oci_execute($statement);

		} catch (PDOException $pdoex) {
			return $pdoex->getMessage();
		}

	}

	public function checkValue($value){

		if($value == "UNDEFINED" || $value == 'UNDEFINED'){
			$value = '';
		}
		return $value;
	}
}

class Assets{
	
	public function Assets(){
		$primary = new stdClass;
	}
}

?>