<?php
// CONNECTION STRING -----------------------------------------------------------
$c = oci_pconnect ('STO_SYS', 'STO_SYS1', 'nvr.gent.vcc.ford.com:49970/DST')
OR die('Unable to connect to the database. Error: <pre>'
. print_r(oci_error(),1) . '</pre>');

// ALARM DATA GET --------------------------------------------------------------
if (isset($_GET['stn']) && isset($_GET['sev']) && (isset($_GET['lbt'])
|| (isset($_GET['sta']) && isset($_GET['end'])))) {

// Set time values to empty string when not set
$lbt_val = (isset($_GET['lbt'])) ? $_GET['lbt'] : '' ;
$sta_val = (isset($_GET['sta'])) ? $_GET['sta'] : '' ;
$end_val = (isset($_GET['end'])) ? $_GET['end'] : '' ;

// create alarmquery
$q = alarmquery($_GET['stn'],$_GET['sev'],$lbt_val,$sta_val,$end_val);

// request and echo data
request($q, $c);

};


// SET UP ALARMQUERY -----------------------------------------------------------
function alarmquery($stn,$sev,$lbt,$sta,$end){

	// split sring to get array
	$stn_arr = preg_split('/:/',$stn);
	$sev_arr = preg_split('/:/',$sev);

	// Alarm query first part
	$q = "SELECT ALARMDATEANDTIMESTAMP, ALARMSOURCE, ALARMOBJECT,
	ALARMCOMMENT, ALARMSEVERITY, ALARMSTATUS FROM ALARM_DATA_FINALASS WHERE ";

	// Time (always)
	$q .= "CHANGETS > SYSTIMESTAMP - " . $lbt . " ";

	// Station
	$q .= queryPart('ALARMSOURCE', $stn_arr);

	// Severity
	$q .= queryPart('ALARMSEVERITY', $sev_arr);

	// Order data by date put in database
	$q .= "ORDER BY CHANGETS DESC ";

	// return query
	return $q;

};

// Function for aditional query parts (ALARMSOURCE & ALARMSEVERITY)
function queryPart($str, $arr){

	// If there's something in array make.. else return empty
	if (strlen($arr[0]) > 0) {

		$temp_str = "AND" . " (";

		for ($i=0; $i < count($arr); $i++) {
			$temp_str .= $str . " LIKE '" . $arr[$i] . "'";
			if (count($arr) > 1 && $i < count($arr) - 1) {
				$temp_str .= " OR ";
			};
		};

		$temp_str .= ") " ;

	} else { $temp_str = ""; };

	return $temp_str;

};


// STATIONS QUERY --------------------------------------------------------------
if (isset($_GET['stations'])){

	$q = "SELECT DISTINCT(ALARMSOURCE) FROM ALARM_DATA_FINALASS
	ORDER BY ALARMSOURCE";

	request($q, $c);

};


// ORACLE REQUEST AND ECHO BACK ------------------------------------------------
function request($q, $c){

	$s = oci_parse($c, $q);
	oci_execute($s);
	oci_fetch_all($s,$data,null,null,OCI_FETCHSTATEMENT_BY_ROW+OCI_NUM );
	echo json_encode($data);

};
?>
