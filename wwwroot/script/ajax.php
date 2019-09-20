<?php
// No HTML required by this script!
// Validate that the page received $_GET['email']:

$c = oci_pconnect ('STO_SYS', 'STO_SYS1', 'nvr.gent.vcc.ford.com:49970/DST')
OR die('Unable to connect to the database. Error: <pre>'
. print_r(oci_error(),1) . '</pre>');

if (isset($_GET['run'])) {

	// Define the query.
	$q = "SELECT ALARMDATEANDTIMESTAMP, ALARMSOURCE, ALARMOBJECT,
	ALARMCOMMENT, ALARMSEVERITY, ALARMSTATUS FROM ALARM_DATA_FINALASS
	WHERE ALARMSEVERITY NOT LIKE 'E'
	AND ALARMSOURCE LIKE 'CLF3037','CMP305'
	AND CHANGETS > SYSTIMESTAMP - 1
	ORDER BY CHANGETS DESC ";

	// Parse the query.
	$s = oci_parse($c, $q);

	// // Execute the query.
	oci_execute($s);

	//fetch all in 2d array
	oci_fetch_all($s,$data,null,null,OCI_FETCHSTATEMENT_BY_ROW+OCI_NUM );

	//send json encoded data back
	echo json_encode($data);

};



if (isset($_GET['stn'])
&& isset($_GET['sev'])
&& (isset($_GET['lbt'])
|| (isset($_GET['sta'])
&& isset($_GET['end'])))) {

$lbt_val = (isset($_GET['lbt'])) ? $_GET['lbt'] : '' ;
$sta_val = (isset($_GET['sta'])) ? $_GET['sta'] : '' ;
$end_val = (isset($_GET['end'])) ? $_GET['end'] : '' ;

alarmquery($_GET['stn'],$_GET['sev'],$lbt_val,$sta_val,$end_val,$c);

};

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
	$Q = "SELECT ALARMDATEANDTIMESTAMP, ALARMSOURCE, ALARMOBJECT,
	ALARMCOMMENT, ALARMSEVERITY, ALARMSTATUS FROM ALARM_DATA_FINALASS WHERE ";

	//time (always)
	$Q .= "CHANGETS > SYSTIMESTAMP - " . $lbt . " ";

	//Station
	$Q .= "AND " . $stn_str . " ";

	//Severity
	$Q .= "AND " . $sev_str . " ";

	$Q .= "ORDER BY CHANGETS DESC ";

	//echo $Q . '<br><br><br><br><br>';

	$s = oci_parse($c, $Q);
	oci_execute($s);
	oci_fetch_all($s,$data,null,null,OCI_FETCHSTATEMENT_BY_ROW+OCI_NUM );
	echo json_encode($data);


};


?>
