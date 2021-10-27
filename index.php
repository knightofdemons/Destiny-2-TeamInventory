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
        <link rel="stylesheet" href="css/search.css">
        <link rel="stylesheet" href="css/sidebar.css">
        <link rel="stylesheet" href="css/main-content.css">
    	<link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"/>
</head>

<body>
<script type="text/javascript">
    var akey = "<?php require ('config.php'); echo $apiKey; ?>";
</script>
<div class="profile"><include src="scripts/loginheader.php"></include></div>
<div class="sidebar">
 <div class="sidebar-logo-details">
      <img src="https://raw.githubusercontent.com/knightofdemons/Destiny-2-TeamInventory/main/css/images/ico/favicon.ico"></img>
      <div class="sidebar-logo_name">D2 TeamInv</div>
      <i class="bx bx-menu" id="sidebar-btn"></i>
    </div>
    <ul class="nav-list">
      <li>
        <div class="search-input">
          <i class="bx bx-search"></i>
          <input id="search" type="text" placeholder="Search...">
          <span class="tooltip">Search</span>
          <div class="autocom-box">
            <!-- here list are inserted from javascript -->
          </div>
        </div>
      </li>
      <div class="savedPlayers">
      <li>
        <a href="#">
          <span class="links_name">Spieler1</span>
        </a>
        <span class="tooltip">Spieler1</span>
      </li>
      <li>
        <a href="#">
          <span class="links_name">Spieler2</span>
        </a>
        <span class="tooltip">Spieler2</span>
      </li>
      <li>
        <a href="#">
          <span class="links_name">Spieler3</span>
        </a>
        <span class="tooltip">Spieler3</span>
      </li>
      <li>
        <a href="#">
          <span class="links_name">Spieler4</span>
        </a>
        <span class="tooltip">Spieler4</span>
      </li>
      </div>
      <div class="nav-settings">
        <li>
          <a href="#">
            <i class="bx bx-cog"></i>
            <span class="links_name">Settings</span>
          </a>
          <span class="tooltip">Settings</span>
        </li>
      </div>
  </ul>
</div>
  <section class="main-content">
    <div class="main-header">
    </div>
    <div class="main-inv_rec">
		<div class="main-inv" w3-include-html="inv_query.php">1</div>  
		<div class="main"><?php require_once ("./scripts/query_collection.php");?></div>
    </div>
  </section>

  <script type="text/javascript" src="js/sidebar.js"></script>
  <script type="text/javascript" src="js/search.js"></script>
</body>
</html>




