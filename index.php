<html lang="en" dir="ltr">
 <head>
   <meta charset="utf-8">
   <title>D2 TeamInv</title>
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
    		<link rel="stylesheet" href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"/>
		<link rel="stylesheet" type="text/css" href="sidebar.css" />
		<link rel="stylesheet" type="text/css" href="search.css" />
 </head>
<body>
  <div class="profile">
    <div class="name_job">
      <div class="name">Hühnchen Süß-Sauer 7,99€</div>
      <div class="plattform"><img id="profilePlat" src="https://cdn.freebiesupply.com/images/large/2x/steam-logo-transparent.png" alt="profilePlat">Steam</div>
    </div>
    <img id="profilePic" src="https://www.bungie.net/img/profile/avatars/cc000016.jpg" alt="profilePic"></img>
    <i class="bx bx-log-out" id="logout"></i>
  </div>
  <div class="sidebar">
    <div class="sidebar-logo-details">
      <img src="https://raw.githubusercontent.com/knightofdemons/Destiny-2-TeamInventory/main/favicon.ico"></img>
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
      <li>
        <a href="#">
          <i class="bx bx-heart"></i>
          <span class="links_name">PLACEHOLDER</span>
        </a>
        <span class="tooltip">PLACEHOLDER</span>
      </li>
    </ul>
    <div class="sidebar-settings">
      <ul class="nav-settings">
        <li>
          <a href="#">
            <i class="bx bx-cog"></i>
            <span class="links_name">Settings</span>
          </a>
          <span class="tooltip">Settings</span>
        </li>
      </ul>
    </div>
  </div>
  <section class="main-content">
    <div class="main-header">
      <a class="list-header-playername">Accountname</a>
      <br>
      <a class="list-header-char1">Char1</a>
      <a class="list-header-char2">Char2</a>
      <a class="list-header-char3">Char3</a>
    </div>
    <div class="main-inv_rec">
      <div class="main-inv" w3-include-html="inv_query.php">CONTENT</div>
      <div class="main-rec" w3-include-html="rec_query.php"></div>
    </div>
  </section>
  <script type="text/javascript" src="sidebar.js"></script>
  <script type="text/javascript" src="test_search_response.js"></script>
  <script type="text/javascript" src="search.js"></script>
</body>
</html>
