<!DOCTYPE HTML>
<html>
<head>
    <title>D2 TeamInv</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- font -->
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" type="text/css">
    <!-- favicon -->
        <link rel="icon" type="image/png" sizes="32x32" href="css/images/ico/favicon32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="css/images/ico/favicon16.png">
    <!-- css -->
        <link rel="stylesheet" href="css/style.css">
    	<link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"/>
</head>

<body>
<div class="profile" w3-include-html="scripts/profile.php"></div>
<div class="sidebar" w3-include-html="scripts/sidebar.html"></div>
  <section class="main-content">
    <div class="main-header">
      <a class="list-header-playername">Accountname</a>
      <br>
      <a class="list-header-char1">Char1</a>
      <a class="list-header-char2">Char2</a>
      <a class="list-header-char3">Char3</a>
    </div>
    <div class="main-inv_rec">
		<div class="main-inv" w3-include-html="inv_query.php">INVENTORY</div>  
		<div class="main" w3-include-html="scripts/query_collection.php"></div>
    </div>
  </section>

  <script type="text/javascript" src="sidebar.js"></script>
  <script type="text/javascript" src="search.js"></script>
</body>
</html>




