let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#sidebar-btn");
let searchBtn = document.querySelector(".bx-search");
let searchBar = document.querySelector("#searchAcc");

// close sidebar when clicking on menu icon
    closeBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      menuBtnChange();
    });

// change sidebar button appearance
function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
  }
}

// reload page on click & show loading banner
function searchAcc() {
    var x = document.getElementById("searchAcc");
    if (x.value) {
        const rbs = document.querySelectorAll('input[name="platform"]');
        let selectedValue;
                for (const rb of rbs) {
                    if (rb.checked) {
                        selectedValue = rb.value;
                        break;
                    }
                }
         if (playerCounter > 0) {
            var xmlhttp = new XMLHttpRequest();
            var vars = 'playerDetails=' + escape(JSON.stringify(playerDetails)) + '&playerCounter=' + playerCounter;
            xmlhttp.open("POST", "incMain.php?account=" + x.value + '&platform=' + selectedValue, true);
            xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xmlhttp.onreadystatechange = function() {
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var return_data = xmlhttp.responseText;
                    document.getElementById("main").insertAdjacentHTML('afterbegin', return_data); // add new player
                    showFirstPlayer(); // show new player
                    hideLoadingBanner(); // hide loading banner
                    document.getElementById('searchAcc').value = ''; // clear search field
                }
            }
            xmlhttp.send(vars);
            document.getElementById('loading').style.display = "flex"; // show loading banner
        } else {
            window.location.href = (window.location.href.split('?')[0]) + "?account=" + x.value + '&platform=' + selectedValue;
            document.getElementById('loading').style.display = "flex"; // show loading banner
    
        }    
    }
}

// add Player to sidebar-bucket
function addPlayer(playerName) {
    if (!document.getElementById("playerBucket_" + playerName)) {
        document.getElementById("playerBucket").insertAdjacentHTML('beforeend', "<a id='playerBucket_" + playerName + "' onclick=togglePlayer('" + encodeURI(playerName) + "')><i class='bx bxs-heart'></i><span class='links_name'>" + playerName + "</span><i class='bx bx-trash' onclick=deletePlayer(event,'" + encodeURI(playerName) + "')></i></a>");
        playerCounter ++;   
    } else {
        document.getElementById('playerBucket_' + playerName).style.display = "flex";
    }
}

// delete Player from sidebar-bucket
function deletePlayer(event,playerName) {
    document.getElementById('playerBucket_' + decodeURI(playerName)).style.display = "none";
    event.stopPropagation();
}

// show / hide player div
function togglePlayer(playerName) {
  if (document.getElementById(decodeURI(playerName)).style.display === "none") {
    hideLastPlayer();
    document.getElementById(decodeURI(playerName)).style.display = "block";
    window.location.href = "#" + playerName + "_" + window.location.hash.substr(1).split("_").pop(); // go to same anchor as before
    
  }
}

// show first player div
function showFirstPlayer() {
     hideLastPlayer();
     $(".playerWrapper:first").eq(0).css("display", "block");
}

// hide all
function hideLastPlayer() {
     $(".playerWrapper").css("display", "none");
     
}

// hide loading banner
function hideLoadingBanner() {
    document.getElementById('loading').style.display = "none";
}

// jump to section of player
function jumpTo(section) { 
    var x = document.getElementsByClassName("playerWrapper");
    var l = Object.keys(x).length;
    for (var i = 0; i <= l-1; i++) {
    	var style = window.getComputedStyle(x[i]); // get actual style of the element with class name playerWrapper
    	if (style.display === 'block') {
        	var y = x[i].id; // set y to id of element which has display:block
        }
    }
    window.location.href = "#" + y + "_" + section;   
}

// show class nav settings
function showSubNav() {
    document.getElementsByClassName("nav-settings")[0].style.display = "block";
}