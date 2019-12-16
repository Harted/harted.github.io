<?php
// CONNECTION STRING -----------------------------------------------------------
$c = oci_pconnect ('STO_SYS', 'STO_SYS1', 'nvg.gent.vcc.ford.com:49970/DST')
OR die('Unable to connect to the database. Error: <pre>'
. print_r(oci_error(),1) . '</pre>');

$aq = "SELECT ALARMDATEANDTIMESTAMP, ALARMSOURCE, ALARMOBJECT,
ALARMCOMMENT, ALARMSEVERITY, ALARMSTATUS FROM ALARM_DATA_FINALASS WHERE ";

$nid = "SELECT MIN(NID_ALARM_DATA) FROM ALARM_DATA_FINALASS WHERE ";

// ALARM DATA GET --------------------------------------------------------------
if (!isset($_GET['nid'])
&& isset($_GET['mid'])
&& isset($_GET['rel'])
&& isset($_GET['stn'])
&& isset($_GET['sev'])
&& (isset($_GET['lbt']) || (isset($_GET['sta'])
&& isset($_GET['end'])))) {

// create query
$q = $aq . "NID_ALARM_DATA > " . $_GET['mid'] . " AND ". alarmquery(
	$_GET['rel'],$_GET['stn'],$_GET['sev'],
	$_GET['lbt'],$_GET['sta'],$_GET['end']
);

//echo $q;

// request and echo data
request($q, $c);

};


// SET UP ALARMQUERY -----------------------------------------------------------
function alarmquery($rel,$stn,$sev,$lbt,$sta,$end){

	// split sring to get array
	$stn_arr = preg_split('/:/',$stn);
	$sev_arr = preg_split('/:/',$sev);

	$rel = filter_var($rel, FILTER_VALIDATE_BOOLEAN);

	// NOTE: tried this for tuning because it's indexed, needs longer!!!!
	//				6s!! with changets it's 2s
	// $timestamp = "TO_TIMESTAMP(ALARMDATEANDTIMESTAMP, 'yyyy-mm-dd hh24:mi:ss.ff')";

	if ($rel) {
		$q = "CHANGETS > SYSTIMESTAMP - " . $lbt . " ";
	} else {
		$q = "(CHANGETS > TO_TIMESTAMP('" . $sta . "', 'yyyy-mm-dd hh24:mi:ss')) AND "
		. "(CHANGETS < TO_TIMESTAMP('" . $end . "', 'yyyy-mm-dd hh24:mi:ss')) ";
	};

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


// MIN NID ---------------------------------------------------------------------
if (isset($_GET['nid']) && isset($_GET['rel']) && isset($_GET['stn'])
&& isset($_GET['sev']) && isset($_GET['lbt'])) {

	// create query
	$q = $nid . alarmquery(
		$_GET['rel'],$_GET['stn'],$_GET['sev'],
		$_GET['lbt'],$_GET['sta'],$_GET['end']
	);

	echo request($q, $c, false)[0][0];

};


// ORACLE REQUEST AND ECHO BACK ------------------------------------------------
function request($q, $c, $echo = true){

	$s = oci_parse($c, $q);
	oci_execute($s);
	oci_fetch_all($s,$data,null,null,OCI_FETCHSTATEMENT_BY_ROW+OCI_NUM );

	if ($echo) {
		echo json_encode($data);
	} else {
		return $data;
	}


};


?>
