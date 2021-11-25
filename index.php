<!DOCTYPE HTML>
<html>
<head>
    <title>D2 TeamInv</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- font -->
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" type="text/css">
    <!-- favicon -->
        <link rel="apple-touch-icon" sizes="180x180" href="css/images/ico/favicon180.png">
        <link rel="icon" type="image/png" sizes="32x32" href="css/images/ico/favicon32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="css/images/ico/favicon16.png">
    <!-- css -->
        <link rel="stylesheet" href="css/style.css">
    	<link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"/>
    <!-- js -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
	<script type="text/javascript">var akey = "<?php require ('config.php'); echo $apiKey; ?>"</script>;
</head>

<body>
<div id="loading" class="loader-wrapper" style='display:none;'><span class="loader"><span class="loader-inner"></span></span></div>
<?php
     include("incSidebar.html");
?>
<div id="main">    
<?php
     include("incMain.php");
?>
</div>
<script type="text/javascript">
    var playerDetails = <?php echo json_encode ($playerDetails, JSON_FORCE_OBJECT); ?>;
    var playerCounter = <?php echo json_encode ($playerCounter); ?>;
</script>
<script>
    document.getElementById("searchAcc").addEventListener("keydown", function (event) {
            if (event.keyCode == 13) {
                document.getElementById("searchIcon").click();
            }
        });
</script>
</body>
</html>