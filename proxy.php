<?php
  header("Content-Type: text/xml");
  $host = "http://api.geonames.org/findNearByWeatherXML";
  $query = $_SERVER['QUERY_STRING'];
  $ch = curl_init($host . "?" . $query);
  curl_exec($ch);
  curl_close($ch);
?>
