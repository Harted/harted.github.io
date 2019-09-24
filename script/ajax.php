<?php
// No HTML required by this script!
// Validate that the page received $_GET['email']:

$c = oci_pconnect ('STO_SYS', 'STO_SYS1', 'nvr.gent.vcc.ford.com:49970/DST')
OR die('Unable to connect to the database. Error: <pre>'
. print_r(oci_error(),1) . '</pre>');


if (isset($_GET['stn'])
&& isset($_GET['sev'])
&& (isset($_GET['lbt'])
|| (isset($_GET['sta'])
&& isset($_GET['end'])))) {

$lbt_val = (isset($_GET['lbt'])) ? $_GET['lbt'] : '' ;
$sta_val = (isset($_GET['sta'])) ? $_GET['sta'] : '' ;
$end_val = (isset($_GET['end'])) ? $_GET['end'] : '' ;

alarmquery($_GET['stn'],$_GET['sev'],$lbt_val,$sta_val,$end_val, $c);

};


// SET UP ALARMQUERY -----------------------------------------------------------
function alarmquery($stn,$sev,$lbt,$sta,$end, $c){

	$stn_arr = preg_split('/:/',$stn);
	$stn_str = '(';

	for ($i=0; $i < count($stn_arr); $i++) {
		$stn_str .= "ALARMSOURCE LIKE '" . $stn_arr[$i] . "'";
		if (count($stn_arr) > 1 && $i < count($stn_arr) - 1) {
			$stn_str .= " OR ";
		};
	};

	$stn_str .= ')';



	$sev_arr = preg_split('/:/',$sev);

	$sev_str = '(';

	for ($i=0; $i < count($sev_arr); $i++) {
		$sev_str .= "ALARMSEVERITY LIKE '" . $sev_arr[$i] . "'";
		if (count($sev_arr) > 1 && $i < count($sev_arr) - 1) {
			$sev_str .= " OR ";
		};
	};

	$sev_str .= ')';





	//alarm query first part
	$q = "SELECT ALARMDATEANDTIMESTAMP, ALARMSOURCE, ALARMOBJECT,
	ALARMCOMMENT, ALARMSEVERITY, ALARMSTATUS FROM ALARM_DATA_FINALASS WHERE ";

	//time (always)
	$q .= "CHANGETS > SYSTIMESTAMP - " . $lbt . " ";

	//Station
	$q .= "AND " . $stn_str . " ";

	//Severity
	$q .= "AND " . $sev_str . " ";

	$q .= "ORDER BY CHANGETS DESC ";

	//echo $q . '<br><br><br><br><br>';

	request($q, $c);


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
