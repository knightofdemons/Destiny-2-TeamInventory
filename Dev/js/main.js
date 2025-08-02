/*********************************************************************************/
/* Variables & Elements                                                          */
/*********************************************************************************/

// Global variables
let userDB = {
    loadedPlayers: {},
    siteSettings: {},
    Definitions: {},
    manifestPaths: {}
};
let placeholderHTML = "<div id='placeholder'><div class='loader-wrapper'><div class='loader'><div class='loader-inner'></div></div></div></div>";
let statDefinitions = new Object();
let classDefinitions = new Object();
let itemDefinitions = new Object();
let itemDefinitionsTmp = new Object();
let energyDefinitions = new Object();
let catDefinitions = new Object();
let playerlist = new Object();
let siteSettings = new Object();
let lang = '';
let charStatOrder = [2996146975,392767087,1943323491,1735777505,144602215,4244567218];
let buckets = [1498876634,2465295065,953998645,3448274439,3551918588,14239492,20886954,1585787867];
let vendorHashList = [1037843411, 3989934776, 864211278];
let fireteamInterval;
let fireteamCounter;
let fireteamTimer = 60;

let searchWrapper = document.querySelector(".search-input");
let inputBox = searchWrapper.querySelector("#searchAcc");
let suggBox = searchWrapper.querySelector(".autocom-box");
let icon = searchWrapper.querySelector(".icon");
let linkTag = searchWrapper.querySelector("a");
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#sidebar-btn");
let searchBtn = document.querySelector(".bx-search");
let searchBar = document.querySelector("#searchAcc");
let settingsSubMenu = document.querySelector(".settingsSubMenu");
let aboutFrame = document.querySelector(".aboutFrameOuter");
let settingsThemes = document.querySelector(".settingsThemes");
let settingsBtnCog = document.querySelector("#settingsBtnCog");
let langBtn = document.querySelector("#lang-btn");
let langOpt = document.querySelector(".language-options");
let viewMain = document.querySelector("#viewMain");
let viewFireteam = document.querySelector("#viewFireteam");
let contentFireteam = document.querySelector("#contentFireteam");
let timerBar = document.querySelector(".timerBar");
let viewDIM = document.querySelector(".viewDIM");
let emptyArray = [];
let myInterval;


/*********************************************************************************/
/* document KeyInputs                                                            */
/*********************************************************************************/
inputBox.onkeyup = (e)=>{
	searchPlayer(e.target.value);
}

suggBox.onclick = (e)=>{
	console.log(e.target.value);
}

suggBox.addEventListener('blur', (event) => {
	searchWrapper.classList.remove("active"); //hide autocomplete box
});

document.onmousedown = (e)=> {
	if(!langOpt.contains(e.target) && !settingsSubMenu.contains(e.target) && !settingsThemes.contains(e.target)&& !settingsBtnCog.contains(e.target) && !aboutFrame.contains(e.target)){
		langOpt.classList.remove("open");
		settingsSubMenu.classList.remove("open");
		settingsThemes.classList.remove("open");
		aboutFrame.classList.add("closed");
	}
}

// Pull-to-refresh variables
let isPulling = false;
let pullStartY = 0;
let pullDistance = 0;
const PULL_THRESHOLD = 100; // Distance needed to trigger refresh
let pullStartTime = 0;
const PULL_DELAY = 500; // Minimum time (ms) to hold pull before triggering

// Scroll-down-to-exit variables
let isScrollingDown = false;
let scrollDownStartY = 0;
let scrollDownDistance = 0;
const SCROLL_DOWN_THRESHOLD = 100; // Distance needed to trigger exit
let scrollDownStartTime = 0;
const SCROLL_DOWN_DELAY = 500; // Minimum time (ms) to hold scroll before triggering

// Translation system
const translations = {
	en: {
		searchPlaceholder: "Search Destiny-Account...",
		clearCachedData: "Clear cached data",
		themes: "Themes",
		scrollDownToExit: "Scroll down to return",
		loadingScreen: "Loading Destiny 2 Team Inventory...",
		loadingPlayer: "Loading player...",
		initializingDatabase: "Initializing Database...",
		loadingManifestData: "Loading Manifest Data...",
		fetchingPlayerData: "Fetching Player Data...",
		processingInventory: "Processing Inventory...",
		readyToLaunch: "Ready to Launch...",
		error: "Error",
		fireteamView: "Fireteam View",
		noFireteamData: "No fireteam data available"
	},
	de: {
		searchPlaceholder: "Destiny-Account suchen...",
		clearCachedData: "Cache-Daten löschen",
		themes: "Themen",
		scrollDownToExit: "Nach unten scrollen zum Zurückkehren",
		loadingScreen: "Lade Destiny 2 Team Inventar...",
		loadingPlayer: "Spieler wird geladen...",
		initializingDatabase: "Datenbank wird initialisiert...",
		loadingManifestData: "Manifest-Daten werden geladen...",
		fetchingPlayerData: "Spielerdaten werden abgerufen...",
		processingInventory: "Inventar wird verarbeitet...",
		readyToLaunch: "Bereit zum Start...",
		error: "Fehler",
		fireteamView: "Fireteam-Ansicht",
		noFireteamData: "Keine Fireteam-Daten verfügbar"
	},
	es: {
		searchPlaceholder: "Buscar cuenta de Destiny...",
		clearCachedData: "Borrar datos en caché",
		themes: "Temas",
		scrollDownToExit: "Deslizar hacia abajo para volver",
		loadingScreen: "Cargando Inventario de Equipo Destiny 2...",
		loadingPlayer: "Cargando jugador...",
		initializingDatabase: "Inicializando base de datos...",
		loadingManifestData: "Cargando datos del manifiesto...",
		fetchingPlayerData: "Obteniendo datos del jugador...",
		processingInventory: "Procesando inventario...",
		readyToLaunch: "Listo para lanzar...",
		error: "Error",
		fireteamView: "Vista de Equipo",
		noFireteamData: "No hay datos de equipo disponibles"
	},
	"es-mx": {
		searchPlaceholder: "Buscar cuenta de Destiny...",
		clearCachedData: "Borrar datos en caché",
		themes: "Temas",
		scrollDownToExit: "Deslizar hacia abajo para volver",
		loadingScreen: "Cargando Inventario de Equipo Destiny 2...",
		loadingPlayer: "Cargando jugador...",
		initializingDatabase: "Inicializando base de datos...",
		loadingManifestData: "Cargando datos del manifiesto...",
		fetchingPlayerData: "Obteniendo datos del jugador...",
		processingInventory: "Procesando inventario...",
		readyToLaunch: "Listo para lanzar...",
		error: "Error",
		fireteamView: "Vista de Equipo",
		noFireteamData: "No hay datos de equipo disponibles"
	},
	fr: {
		searchPlaceholder: "Rechercher un compte Destiny...",
		clearCachedData: "Effacer les données en cache",
		themes: "Thèmes",
		scrollDownToExit: "Faire défiler vers le bas pour revenir",
		loadingScreen: "Chargement de l'Inventaire d'Équipe Destiny 2...",
		loadingPlayer: "Chargement du joueur...",
		initializingDatabase: "Initialisation de la base de données...",
		loadingManifestData: "Chargement des données du manifeste...",
		fetchingPlayerData: "Récupération des données du joueur...",
		processingInventory: "Traitement de l'inventaire...",
		readyToLaunch: "Prêt à lancer...",
		error: "Erreur",
		fireteamView: "Vue d'Équipe",
		noFireteamData: "Aucune donnée d'équipe disponible"
	},
	it: {
		searchPlaceholder: "Cerca account Destiny...",
		clearCachedData: "Cancella dati in cache",
		themes: "Temi",
		scrollDownToExit: "Scorri verso il basso per tornare",
		loadingScreen: "Caricamento Inventario Squadra Destiny 2...",
		loadingPlayer: "Caricamento giocatore...",
		initializingDatabase: "Inizializzazione database...",
		loadingManifestData: "Caricamento dati manifest...",
		fetchingPlayerData: "Recupero dati giocatore...",
		processingInventory: "Elaborazione inventario...",
		readyToLaunch: "Pronto al lancio...",
		error: "Errore",
		fireteamView: "Vista Squadra",
		noFireteamData: "Nessun dato squadra disponibile"
	},
	ja: {
		searchPlaceholder: "Destinyアカウントを検索...",
		clearCachedData: "キャッシュデータをクリア",
		themes: "テーマ",
		scrollDownToExit: "下にスクロールして戻る",
		loadingScreen: "Destiny 2 チームインベントリを読み込み中...",
		loadingPlayer: "プレイヤーを読み込み中...",
		initializingDatabase: "データベースを初期化中...",
		loadingManifestData: "マニフェストデータを読み込み中...",
		fetchingPlayerData: "プレイヤーデータを取得中...",
		processingInventory: "インベントリを処理中...",
		readyToLaunch: "起動準備完了...",
		error: "エラー",
		fireteamView: "ファイアチーム表示",
		noFireteamData: "ファイアチームデータがありません"
	},
	ko: {
		searchPlaceholder: "Destiny 계정 검색...",
		clearCachedData: "캐시 데이터 지우기",
		themes: "테마",
		scrollDownToExit: "아래로 스크롤하여 돌아가기",
		loadingScreen: "Destiny 2 팀 인벤토리 로딩 중...",
		loadingPlayer: "플레이어 로딩 중...",
		initializingDatabase: "데이터베이스 초기화 중...",
		loadingManifestData: "매니페스트 데이터 로딩 중...",
		fetchingPlayerData: "플레이어 데이터 가져오는 중...",
		processingInventory: "인벤토리 처리 중...",
		readyToLaunch: "시작 준비 완료...",
		error: "오류",
		fireteamView: "파이어팀 보기",
		noFireteamData: "파이어팀 데이터가 없습니다"
	},
	pl: {
		searchPlaceholder: "Szukaj konta Destiny...",
		clearCachedData: "Wyczyść dane w pamięci podręcznej",
		themes: "Motyw",
		scrollDownToExit: "Przewiń w dół, aby wrócić",
		loadingScreen: "Ładowanie Inwentarza Drużyny Destiny 2...",
		loadingPlayer: "Ładowanie gracza...",
		initializingDatabase: "Inicjalizacja bazy danych...",
		loadingManifestData: "Ładowanie danych manifestu...",
		fetchingPlayerData: "Pobieranie danych gracza...",
		processingInventory: "Przetwarzanie inwentarza...",
		readyToLaunch: "Gotowy do uruchomienia...",
		error: "Błąd",
		fireteamView: "Widok Drużyny",
		noFireteamData: "Brak danych drużyny"
	},
	"pt-br": {
		searchPlaceholder: "Pesquisar conta Destiny...",
		clearCachedData: "Limpar dados em cache",
		themes: "Temas",
		scrollDownToExit: "Role para baixo para voltar",
		loadingScreen: "Carregando Inventário de Equipe Destiny 2...",
		loadingPlayer: "Carregando jogador...",
		initializingDatabase: "Inicializando banco de dados...",
		loadingManifestData: "Carregando dados do manifesto...",
		fetchingPlayerData: "Obtendo dados do jogador...",
		processingInventory: "Processando inventário...",
		readyToLaunch: "Pronto para iniciar...",
		error: "Erro",
		fireteamView: "Visualização da Equipe",
		noFireteamData: "Nenhum dado de equipe disponível"
	},
	ru: {
		searchPlaceholder: "Поиск аккаунта Destiny...",
		clearCachedData: "Очистить кэш",
		themes: "Темы",
		scrollDownToExit: "Прокрутите вниз для возврата",
		loadingScreen: "Загрузка Инвентаря Команды Destiny 2...",
		loadingPlayer: "Загрузка игрока...",
		initializingDatabase: "Инициализация базы данных...",
		loadingManifestData: "Загрузка данных манифеста...",
		fetchingPlayerData: "Получение данных игрока...",
		processingInventory: "Обработка инвентаря...",
		readyToLaunch: "Готов к запуску...",
		error: "Ошибка",
		fireteamView: "Вид Команды",
		noFireteamData: "Нет данных команды"
	},
	"zh-chs": {
		searchPlaceholder: "搜索Destiny账户...",
		clearCachedData: "清除缓存数据",
		themes: "主题",
		scrollDownToExit: "向下滚动返回",
		loadingScreen: "正在加载命运2团队库存...",
		loadingPlayer: "正在加载玩家...",
		initializingDatabase: "正在初始化数据库...",
		loadingManifestData: "正在加载清单数据...",
		fetchingPlayerData: "正在获取玩家数据...",
		processingInventory: "正在处理库存...",
		readyToLaunch: "准备启动...",
		error: "错误",
		fireteamView: "火力战队视图",
		noFireteamData: "无火力战队数据"
	},
	"zh-cht": {
		searchPlaceholder: "搜尋Destiny帳戶...",
		clearCachedData: "清除快取資料",
		themes: "主題",
		scrollDownToExit: "向下滾動返回",
		loadingScreen: "正在載入命運2團隊庫存...",
		loadingPlayer: "正在載入玩家...",
		initializingDatabase: "正在初始化資料庫...",
		loadingManifestData: "正在載入清單資料...",
		fetchingPlayerData: "正在取得玩家資料...",
		processingInventory: "正在處理庫存...",
		readyToLaunch: "準備啟動...",
		error: "錯誤",
		fireteamView: "火力戰隊視圖",
		noFireteamData: "無火力戰隊資料"
	}
};

// Function to get current language
function getCurrentLang() {
	return userDB.siteSettings.lang || 'en';
}

// Function to get translated text
function getText(key) {
	const lang = getCurrentLang();
	return translations[lang]?.[key] || translations.en[key] || key;
}

// Function to apply translations to UI
function applyTranslations() {
	const searchInput = document.getElementById('searchAcc');
	if (searchInput) {
		searchInput.placeholder = getText('searchPlaceholder');
	}
	
	const clearDataBtn = document.querySelector('.settingsSubMenuBtns[onClick="clearData()"]');
	if (clearDataBtn) {
		clearDataBtn.innerHTML = `<i id="settingsClearData" class="bx bxs-trash"></i>&nbsp; ${getText('clearCachedData')}`;
	}
	
	const themesBtn = document.querySelector('.settingsSubMenuBtns[onClick="showTheme()"]');
	if (themesBtn) {
		themesBtn.innerHTML = `<i id="settingsThemesBtn" class="bx bxs-square-rounded"></i>&nbsp; ${getText('themes')}`;
	}
	
	// Apply loading screen translation
	const loadingText = document.getElementById('loadingText');
	if (loadingText) {
		loadingText.textContent = getText('loadingScreen');
	}
	
	// Apply fireteam view translation
	const fireteamView = document.getElementById('viewFireteam');
	if (fireteamView) {
		// Add a title or header for the fireteam view if needed
		const fireteamHeader = fireteamView.querySelector('.fireteam-header');
		if (!fireteamHeader) {
			const header = document.createElement('div');
			header.className = 'fireteam-header';
			header.textContent = getText('fireteamView');
			header.style.cssText = 'color: #fff; font-size: 1.5rem; text-align: center; padding: 1rem; background: var(--grad1); border-bottom: 1px solid var(--grad0);';
			fireteamView.insertBefore(header, fireteamView.firstChild);
		} else {
			fireteamHeader.textContent = getText('fireteamView');
		}
	}
}

document.onkeydown = (e)=> {
	var keycode;
	if (window.event)
		{keycode = window.event.keyCode;}
	else if (e)
		{keycode = e.which;}
	// Removed arrow key functionality for fireteam view - replaced with scroll gestures
	//Playerscrolling
	if(keycode == 37 && viewMain.classList.contains("open") && userDB.siteSettings.playerCursor > 0){
		userDB.siteSettings.playerCursor--;
		window.dbOperations.setSetting("playerCursor", userDB.siteSettings.playerCursor);
		switchPlayer();
	}else if(keycode == 39 && viewMain.classList.contains("open") && userDB.siteSettings.playerCursor < (Object.keys(userDB.loadedPlayers).length - 1)){
		userDB.siteSettings.playerCursor++;
		window.dbOperations.setSetting("playerCursor", userDB.siteSettings.playerCursor);
		switchPlayer();
	}
}

// Pull-to-refresh functionality
document.addEventListener('touchstart', function(e) {
	console.log('Touch start - viewMain open:', viewMain.classList.contains("open"), 'viewFireteam open:', viewFireteam.classList.contains("open"));
	
	if (viewMain.classList.contains("open")) {
		pullStartY = e.touches[0].clientY;
		pullStartTime = Date.now();
		isPulling = true;
		console.log('Touch start detected for pull-to-refresh, isPulling:', isPulling);
	} else if (viewFireteam.classList.contains("open")) {
		scrollDownStartY = e.touches[0].clientY;
		scrollDownStartTime = Date.now();
		isScrollingDown = true;
		console.log('Touch start detected for scroll down, isScrollingDown:', isScrollingDown);
	} else {
		console.log('Touch start but no view is open - viewMain:', viewMain.classList.contains("open"), 'viewFireteam:', viewFireteam.classList.contains("open"));
	}
});

document.addEventListener('touchmove', function(e) {
	if (isPulling && viewMain.classList.contains("open")) {
		pullDistance = e.touches[0].clientY - pullStartY;
		
		// Only allow pulling down (positive distance) and at the very top of the page
		if (pullDistance > 0 && window.scrollY === 0) {
			e.preventDefault();
			
			// Add visual feedback
			const pullIndicator = document.getElementById('pull-indicator') || createPullIndicator();
			const pullProgress = Math.min(pullDistance / PULL_THRESHOLD, 1);
			const timeProgress = Math.min((Date.now() - pullStartTime) / PULL_DELAY, 1);
			const totalProgress = (pullProgress + timeProgress) / 2; // Average of distance and time
			
			pullIndicator.style.transform = `translateY(${pullDistance * 0.3}px)`;
			pullIndicator.style.opacity = totalProgress;
			console.log('Pull indicator opacity set to:', totalProgress);
			
			// No text content needed - indicators show only icons
			
			console.log('Pulling down, distance:', pullDistance, 'time:', Date.now() - pullStartTime, 'total progress:', totalProgress);
		}
	} else if (isScrollingDown && viewFireteam.classList.contains("open")) {
		scrollDownDistance = scrollDownStartY - e.touches[0].clientY; // Inverted for scroll down
		
		// Only allow scrolling down (positive distance) and at the very top of the page
		if (scrollDownDistance > 0 && window.scrollY === 0) {
			e.preventDefault();
			
			// Add visual feedback
			const scrollDownIndicator = document.getElementById('scroll-down-indicator') || createScrollDownIndicator();
			const scrollProgress = Math.min(scrollDownDistance / SCROLL_DOWN_THRESHOLD, 1);
			const timeProgress = Math.min((Date.now() - scrollDownStartTime) / SCROLL_DOWN_DELAY, 1);
			const totalProgress = (scrollProgress + timeProgress) / 2; // Average of distance and time
			
			scrollDownIndicator.style.transform = `translateY(${scrollDownDistance * 0.3}px)`;
			scrollDownIndicator.style.opacity = totalProgress;
			console.log('Scroll down indicator opacity set to:', totalProgress);
			
			// No text content needed - indicators show only icons
			
			console.log('Scrolling down, distance:', scrollDownDistance, 'time:', Date.now() - scrollDownStartTime, 'total progress:', totalProgress);
		}
	}
});

document.addEventListener('touchend', function(e) {
	console.log('Touch end - isPulling:', isPulling, 'isScrollingDown:', isScrollingDown, 'viewMain open:', viewMain.classList.contains("open"), 'viewFireteam open:', viewFireteam.classList.contains("open"));
	
	if (isPulling && viewMain.classList.contains("open")) {
		const timeElapsed = Date.now() - pullStartTime;
		console.log('Touch end, pullDistance:', pullDistance, 'threshold:', PULL_THRESHOLD, 'time:', timeElapsed, 'delay:', PULL_DELAY);
		
		if (pullDistance >= PULL_THRESHOLD && timeElapsed >= PULL_DELAY && window.scrollY === 0) {
			console.log('Triggering fireteam refresh');
			// Trigger fireteam refresh
			sidebar.style.display = "none";
			sidebar.classList.toggle("open");
			viewMain.classList.remove("open");
			viewFireteam.classList.add("open");
			
			// Clear any existing content and ensure clean state
			contentFireteam.innerHTML = '';
			
			// Make timer bar visible when entering fireteam view
			const timerBar = document.querySelector('.timerBar');
			if (timerBar) {
				timerBar.style.display = 'block';
			}
			
			countDown(fireteamTimer, getFireteam());
		}
		
		// Reset pull state
		isPulling = false;
		pullDistance = 0;
		pullStartTime = 0;
		
		// Hide pull indicator
		const pullIndicator = document.getElementById('pull-indicator');
		if (pullIndicator) {
			pullIndicator.style.transform = 'translateY(-50px)';
			pullIndicator.style.opacity = '0';
			// Remove from DOM after animation
			setTimeout(() => {
				if (pullIndicator.parentNode) {
					pullIndicator.parentNode.removeChild(pullIndicator);
				}
			}, 300);
		}
	} else if (isScrollingDown && viewFireteam.classList.contains("open")) {
		const timeElapsed = Date.now() - scrollDownStartTime;
		console.log('Touch end for scroll down, scrollDownDistance:', scrollDownDistance, 'threshold:', SCROLL_DOWN_THRESHOLD, 'time:', timeElapsed, 'delay:', SCROLL_DOWN_DELAY);
		
		if (scrollDownDistance >= SCROLL_DOWN_THRESHOLD && timeElapsed >= SCROLL_DOWN_DELAY && window.scrollY === 0) {
			console.log('Triggering return to main view');
			// Return to main view and remove timer bar
			sidebar.style.display = "block";
			sidebar.classList.toggle("open");
			clearInterval(fireteamInterval);
			viewFireteam.classList.remove("open");
			viewMain.classList.add("open");
			
			// Clear fireteam content to prevent remains
			contentFireteam.innerHTML = '';
			
			// Remove timer bar when returning
			const timerBar = document.querySelector('.timerBar');
			if (timerBar) {
				timerBar.style.display = 'none';
			}
		} else {
			console.log('Scroll down conditions not met - distance:', scrollDownDistance, 'threshold:', SCROLL_DOWN_THRESHOLD, 'time:', timeElapsed, 'delay:', SCROLL_DOWN_DELAY, 'scrollY:', window.scrollY);
		}
		
		// Reset scroll down state
		isScrollingDown = false;
		scrollDownDistance = 0;
		scrollDownStartTime = 0;
		
		// Hide scroll down indicator
		const scrollDownIndicator = document.getElementById('scroll-down-indicator');
		if (scrollDownIndicator) {
			scrollDownIndicator.style.transform = 'translateY(-50px)';
			scrollDownIndicator.style.opacity = '0';
			// Remove from DOM after animation
			setTimeout(() => {
				if (scrollDownIndicator.parentNode) {
					scrollDownIndicator.parentNode.removeChild(scrollDownIndicator);
				}
			}, 300);
		}
	} else {
		console.log('Touch end but no gesture detected - isPulling:', isPulling, 'isScrollingDown:', isScrollingDown);
	}
});

// Add mouse wheel support for desktop testing
let wheelDistance = 0;
let wheelStartTime = 0;
let wheelDownDistance = 0;
let wheelDownStartTime = 0;

document.addEventListener('wheel', function(e) {
	if (viewMain.classList.contains("open") && window.scrollY === 0) {
		// Only trigger on upward scroll (negative deltaY)
		if (e.deltaY < 0) {
			e.preventDefault(); // Prevent default scroll behavior
			if (wheelDistance === 0) {
				wheelStartTime = Date.now();
			}
			wheelDistance += Math.abs(e.deltaY);
			console.log('Wheel scroll up, distance:', wheelDistance, 'time:', Date.now() - wheelStartTime);
			
			// Show pull indicator with opacity based on progress
			const pullIndicator = document.getElementById('pull-indicator') || createPullIndicator();
			const timeProgress = Math.min((Date.now() - wheelStartTime) / PULL_DELAY, 1);
			const distanceProgress = Math.min(wheelDistance / PULL_THRESHOLD, 1);
			const totalProgress = (timeProgress + distanceProgress) / 2;
			pullIndicator.style.opacity = totalProgress;
			console.log('Pull indicator opacity set to:', totalProgress);
			
			if (wheelDistance >= PULL_THRESHOLD && (Date.now() - wheelStartTime) >= PULL_DELAY) {
				console.log('Triggering fireteam refresh via wheel');
				sidebar.style.display = "none";
				sidebar.classList.toggle("open");
				viewMain.classList.remove("open");
				viewFireteam.classList.add("open");
				
				// Clear any existing content and ensure clean state
				contentFireteam.innerHTML = '';
				
				// Make timer bar visible when entering fireteam view
				const timerBar = document.querySelector('.timerBar');
				if (timerBar) {
					timerBar.style.display = 'block';
				}
				
				countDown(fireteamTimer, getFireteam());
				wheelDistance = 0;
				wheelStartTime = 0;
				
				// Hide pull indicator
				pullIndicator.style.opacity = 0;
				// Remove from DOM after animation
				setTimeout(() => {
					if (pullIndicator.parentNode) {
						pullIndicator.parentNode.removeChild(pullIndicator);
					}
				}, 300);
			}
		} else {
			// Reset on downward scroll
			wheelDistance = 0;
			wheelStartTime = 0;
			const pullIndicator = document.getElementById('pull-indicator');
			if (pullIndicator) {
				pullIndicator.style.opacity = 0;
			}
		}
	} else if (viewFireteam.classList.contains("open")) {
		// Only trigger on downward scroll (positive deltaY)
		if (e.deltaY > 0) {
			e.preventDefault(); // Prevent default scroll behavior
			if (wheelDownDistance === 0) {
				wheelDownStartTime = Date.now();
			}
			wheelDownDistance += e.deltaY;
			console.log('Wheel scroll down, distance:', wheelDownDistance, 'time:', Date.now() - wheelDownStartTime);
			
			// Show scroll down indicator with opacity based on progress
			const scrollDownIndicator = document.getElementById('scroll-down-indicator') || createScrollDownIndicator();
			const timeProgress = Math.min((Date.now() - wheelDownStartTime) / SCROLL_DOWN_DELAY, 1);
			const distanceProgress = Math.min(wheelDownDistance / SCROLL_DOWN_THRESHOLD, 1);
			const totalProgress = (timeProgress + distanceProgress) / 2;
			scrollDownIndicator.style.opacity = totalProgress;
			console.log('Scroll down indicator opacity set to:', totalProgress);
			
			if (wheelDownDistance >= SCROLL_DOWN_THRESHOLD && (Date.now() - wheelDownStartTime) >= SCROLL_DOWN_DELAY) {
				console.log('Triggering return to main view via wheel');
				sidebar.style.display = "block";
				sidebar.classList.toggle("open");
				clearInterval(fireteamInterval);
				viewFireteam.classList.remove("open");
				viewMain.classList.add("open");
				
				// Clear fireteam content to prevent remains
				contentFireteam.innerHTML = '';
				
				// Remove timer bar when returning
				const timerBar = document.querySelector('.timerBar');
				if (timerBar) {
					timerBar.style.display = 'none';
				}
				
				wheelDownDistance = 0;
				wheelDownStartTime = 0;
				
				// Hide scroll down indicator
				scrollDownIndicator.style.opacity = 0;
				// Remove from DOM after animation
				setTimeout(() => {
					if (scrollDownIndicator.parentNode) {
						scrollDownIndicator.parentNode.removeChild(scrollDownIndicator);
					}
				}, 300);
			}
		} else {
			// Reset on upward scroll
			wheelDownDistance = 0;
			wheelDownStartTime = 0;
			const scrollDownIndicator = document.getElementById('scroll-down-indicator');
			if (scrollDownIndicator) {
				scrollDownIndicator.style.opacity = 0;
			}
		}
	}
});

// Create pull indicator element with full-width design and glowing arrows
function createPullIndicator() {
	console.log('Creating pull indicator');
	const indicator = document.createElement('div');
	indicator.id = 'pull-indicator';
	indicator.style.cssText = `
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 45px;
		background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7));
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		font-weight: 500;
		z-index: 1000;
		opacity: 0;
		transition: all 0.3s ease;
		pointer-events: none;
		backdrop-filter: blur(10px);
	`;
	
	// Create arrow container
	const arrowContainer = document.createElement('div');
	arrowContainer.style.cssText = `
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: -4px;
	`;
	
	// Create 3 stacked arrow stripes using Boxicons
	for (let i = 0; i < 3; i++) {
		const arrow = document.createElement('div');
		arrow.innerHTML = '<i class="bx bx-chevron-up"></i>';
		arrow.style.cssText = `
			font-size: 24px;
			color: white;
			text-shadow: 0 0 10px white, 0 0 20px white, 0 0 30px white;
			margin: -4px 0;
			animation: arrowPulse 1.2s ease-in-out infinite;
		`;
		arrowContainer.appendChild(arrow);
	}
	
	// Add CSS animation for pulsating white glow
	if (!document.getElementById('arrow-pulse-style')) {
		const style = document.createElement('style');
		style.id = 'arrow-pulse-style';
		style.textContent = `
			@keyframes arrowPulse {
				0% { text-shadow: 0 0 10px white, 0 0 20px white, 0 0 30px white; }
				50% { text-shadow: 0 0 15px white, 0 0 25px white, 0 0 35px white, 0 0 45px white; }
				100% { text-shadow: 0 0 10px white, 0 0 20px white, 0 0 30px white; }
			}
		`;
		document.head.appendChild(style);
	}
	
	indicator.appendChild(arrowContainer);
	document.body.appendChild(indicator);
	return indicator;
}

// Create scroll down indicator element with full-width design and glowing arrows
function createScrollDownIndicator() {
	console.log('Creating scroll down indicator');
	const indicator = document.createElement('div');
	indicator.id = 'scroll-down-indicator';
	indicator.style.cssText = `
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 45px;
		background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7));
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 16px;
		font-weight: 500;
		z-index: 1000;
		opacity: 0;
		transition: all 0.3s ease;
		pointer-events: none;
		backdrop-filter: blur(10px);
	`;
	
	// Create arrow container
	const arrowContainer = document.createElement('div');
	arrowContainer.style.cssText = `
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: -4px;
	`;
	
	// Create 3 stacked arrow stripes pointing down using Boxicons
	for (let i = 0; i < 3; i++) {
		const arrow = document.createElement('div');
		arrow.innerHTML = '<i class="bx bx-chevron-down"></i>';
		arrow.style.cssText = `
			font-size: 24px;
			color: white;
			text-shadow: 0 0 10px white, 0 0 20px white, 0 0 30px white;
			margin: -4px 0;
			animation: arrowPulseDown 1.2s ease-in-out infinite;
		`;
		arrowContainer.appendChild(arrow);
	}
	
	// Add CSS animation for pulsating white glow
	if (!document.getElementById('arrow-pulse-down-style')) {
		const style = document.createElement('style');
		style.id = 'arrow-pulse-down-style';
		style.textContent = `
			@keyframes arrowPulseDown {
				0% { text-shadow: 0 0 10px white, 0 0 20px white, 0 0 30px white; }
				50% { text-shadow: 0 0 15px white, 0 0 25px white, 0 0 35px white, 0 0 45px white; }
				100% { text-shadow: 0 0 10px white, 0 0 20px white, 0 0 30px white; }
			}
		`;
		document.head.appendChild(style);
	}
	
	indicator.appendChild(arrowContainer);
	document.body.appendChild(indicator);
	return indicator;
}


/*********************************************************************************/
/* Element Actions	                                                             */
/*********************************************************************************/

async function switchPlayer(){
	try {
		const playerKeys = Object.keys(userDB.loadedPlayers);
		if (playerKeys.length > 0 && userDB.siteSettings.playerCursor < playerKeys.length) {
			const currentPlayer = userDB.loadedPlayers[playerKeys[userDB.siteSettings.playerCursor]];
			viewMain.innerHTML = generatePlayerHTML(currentPlayer);
		}
	} catch (error) {
		console.error("Error switching player:", error);
	}
}

async function showPlayer(membershipId){
	try {
		const cursor = Object.keys(userDB.loadedPlayers).indexOf(membershipId);
		if (cursor !== -1) {
			userDB.siteSettings.playerCursor = cursor;
			await window.dbOperations.setSetting("playerCursor", cursor);
			await switchPlayer();
		}
	} catch (error) {
		console.error("Error showing player:", error);
	}
}

function showItemDetails(){
	// echo "";
}

function showSuggestions(list){
    let listData;
    if (list !== undefined){
		if(!list.length){
			userValue = inputBox.value;
			listData = '<li>${userValue}</li>';
		}else{
		  listData = list.join('');
		}
		suggBox.innerHTML = listData;
	}
}

function countDown(time, callback) {
    fireteamInterval = setInterval(function() {
		if(fireteamCounter == -1){
			timerBar.innerHTML = "<div class='timerBar'>" +
								"You're not logged in - <i onClick='refreshTimer()' class='bx bx-sync'></i> in " + time + "s</div>";			
		}else if(fireteamCounter == 0){
			timerBar.innerHTML = "<div class='timerBar'><span id='offdot'>&#9679;</span>&nbsp;" +
								"Offline (no data) - <i onClick='refreshTimer()' class='bx bx-sync'></i> in " + time + "s</div>";			
		}else if(fireteamCounter > 0){
			timerBar.innerHTML = "<div class='timerBar'><span id='livedot'>&#9679;</span>&nbsp;" +
								"Live Fireteam - <i onClick='refreshTimer()' class='bx bx-sync'></i> in " + time + "s</div>";
		}
        time-- || (clearInterval(fireteamInterval), time=fireteamTimer, countDown(fireteamTimer, getFireteam()));
    }, 1000);
}

function refreshTimer() {
	clearInterval(fireteamInterval);
	time=fireteamTimer;
	countDown(fireteamTimer, getFireteam());
}

function showSettingsSubmenu(){
	settingsSubMenu.classList.toggle("open");
}

function showSettingsAbout(){
	aboutFrame.classList.toggle("closed");
}

function showLoginFrame(){
	loginFrame.classList.remove("closed");
}

function closeLoginFrame(){
	loginFrame.classList.add("closed");
}

function showLoadingFrame(){
	loadingFrame.classList.add("closed");
}



async function clearData() {
	try {
		await window.dbOperations.clearAllData();
		location.reload();
	} catch (error) {
		console.error("Error clearing data:", error);
	}
}


async function searchPlayer(inputData){
	if(inputData){
		tmpData = inputData.split('#');
		inputData = tmpData[0];
		let postJson = new Object();
		postJson.displayNamePrefix = inputData;
		let rqURL = "https://www.bungie.net/Platform/User/Search/GlobalName/0/";
		let temp = await postData(rqURL, postJson); //data is requested as json
		let tmpRes = temp['Response']['searchResults'];
		if (tmpRes.length > 0) {
			var tmpR = [];
			tmpRes.forEach(function(item, index, array) {
			  IDs = item.destinyMemberships[0].membershipId + "|" + item.destinyMemberships[0].applicableMembershipTypes[0];
			  t = "<li><div class='sresult'><img class='platformLogo' alt='" + IDs + "' src='css/images/logo" + item.destinyMemberships[0].applicableMembershipTypes[0] + ".svg'>" + item.bungieGlobalDisplayName + "#" + item.bungieGlobalDisplayNameCode + "</div></li>";
			  tmpR.push(t);
			});
		}
			searchWrapper.classList.add("active");
			showSuggestions(tmpR);
			let allList = suggBox.querySelectorAll("li");
			for (let i = 0; i < allList.length; i++) {
				//adding onclick attribute in all li tag
				allList[i].setAttribute("onclick", "select(this)");
			}
    }else{
        searchWrapper.classList.remove("active"); //hide autocomplete box
    }
	
}

async function select(element){
    let selectData = element.textContent;
    inputBox.value = selectData;
    if (selectData) {
		selectedAttribute = element.firstChild.firstChild.alt;
        membershipType = (selectedAttribute.split('|'))[1];
        membershipId = (selectedAttribute.split('|'))[0];
		try {
			currentPlayer = await getPlayer(membershipId, membershipType);
			await window.dbOperations.savePlayer(currentPlayer);
			
			// Update local userDB
			userDB.loadedPlayers[currentPlayer.membershipId[0]] = currentPlayer;
			
			// Display the player
			viewMain.innerHTML = generatePlayerHTML(currentPlayer);
			
			suggBox.innerHTML = "";
			inputBox.value = "";
		}catch(err){
			console.log(err.message);
			inputBox.value = "An error occured...";
		}
		searchWrapper.classList.remove("active");
    }
}

// close sidebar when clicking on menu icon
    closeBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      console.log('Sidebar toggled, open state:', sidebar.classList.contains("open"));
      
      // Update mainframe adjustment
      const mainElement = document.getElementById('Main');
      const mainContent = document.querySelector('.main-content');
      
      if (sidebar.classList.contains("open")) {
        mainElement.classList.add("sidebar-open");
        mainContent.classList.add("sidebar-open");
      } else {
        mainElement.classList.remove("sidebar-open");
        mainContent.classList.remove("sidebar-open");
      }
      
      menuBtnChange();
    });


// change sidebar button appearance
function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
  }
  if (langOpt.classList.contains("open")) {
    langOpt.classList.toggle("open");
  }
}

// toggle navigation button appearance
/*
function anchBtnChange() {
	if (window.location.hash.substr(1) == 'anch-vault') {
		anchorVault.classList.add("selected");
		anchorInv.classList.remove("selected");
		anchorExo.classList.remove("selected");
	} else if (window.location.hash.substr(1) == 'anch-equip') {
		anchorInv.classList.add("selected");
		anchorVault.classList.remove("selected");
		anchorExo.classList.remove("selected");
	} else {
		anchorExo.classList.add("selected");
		anchorVault.classList.remove("selected");
		anchorInv.classList.remove("selected");
	}		
}
*/

function anchBtnChange(anch) {
	anchorVault.classList.remove("selected");
	anchorInv.classList.remove("selected");
	anchorExo.classList.remove("selected");
	document.getElementById(anch).classList.add("selected");
}

// Language
// toggle language when clicking on icon
    langBtn.addEventListener("click", () => {
      langOpt.classList.toggle("open");
    });


async function setLang(lang) {
	try {
		// close language-window
		langOpt.classList.toggle("open");
		// show active language
		var x = document.getElementsByClassName("lang-opt");
		for (let i = 0; i<x.length; i++){
			x[i].classList.toggle("act",false);
		}
		document.getElementById(lang).classList.toggle("act",true);
		langBtn.classList.replace(langBtn.classList.item(1), "flag-icon-"+lang);
		await window.dbOperations.setSetting("lang", lang);
		
		// Clear manifest paths to force refresh with new language
		await window.dbOperations.setManifestPaths(null);
		
		// Reload existing player data instead of clearing it
		await reloadStoredPlayers();
		
		// Apply translations immediately
		applyTranslations();
		
		// Reload to get new manifest with translated content
		location.reload();
	} catch (error) {
		console.error("Error setting language:", error);
	}
}

// Function to reload stored players with new language
async function reloadStoredPlayers() {
	try {
		// Get all stored players
		const storedPlayers = await window.dbOperations.getAllPlayers();
		
		if (storedPlayers && Object.keys(storedPlayers).length > 0) {
			console.log("Reloading stored players with new language...");
			
			// Iterate through each stored player and reload their data
			for (const [membershipId, player] of Object.entries(storedPlayers)) {
				try {
					// Get the platform type from the stored player data
					const platformType = player.platformType && player.platformType[0] ? player.platformType[0] : '3';
					
					// Reload player data from API
					const reloadedPlayer = await getPlayer(membershipId, platformType);
					
					// Save the reloaded player data
					await window.dbOperations.savePlayer(reloadedPlayer);
					
					console.log(`Reloaded player data for ${membershipId}`);
				} catch (error) {
					console.error(`Error reloading player ${membershipId}:`, error);
				}
			}
		}
	} catch (error) {
		console.error("Error reloading stored players:", error);
	}
}

async function clickLogout() {
	try {
		document.querySelector(".settingsSubMenu").classList.toggle("open");
		document.querySelector(".language-options").classList.remove("open");
		await window.dbOperations.deleteOAuthToken();
		document.querySelector("#settingsLogin").style.display = 'flex';
		document.querySelector("#settingsLogout").style.display = 'none';
	} catch (error) {
		console.error("Error logging out:", error);
	}
}



function showTheme() {
	document.querySelector(".settingsThemes").classList.toggle("open")
}

async function setTheme(element) {
	try {
		document.querySelector(".theme-opt.act").classList.remove("act");
		element.classList.add("act");
		
		if(element.id == "red"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themeRedA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themeRedB'));		
		}else if(element.id == "blue"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themeBlueA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themeBlueB'));		
		}else if(element.id == "green"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themeGreenA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themeGreenB'));
		}else if(element.id == "yellow"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themeYellowA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themeYellowB'));
		}else if(element.id == "orange"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themeOrangeA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themeOrangeB'));
		}else if(element.id == "purple"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themePurpleA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themePurpleB'));
		}else if(element.id == "black"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themeBlackA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themeBlackB'));
		}else if(element.id == "white"){
			document.documentElement.style.setProperty('--grad0', getComputedStyle(document.documentElement).getPropertyValue('--themeWhiteA'));
			document.documentElement.style.setProperty('--grad1', getComputedStyle(document.documentElement).getPropertyValue('--themeWhiteB'));
		}
		await window.dbOperations.setSetting("ThemeGrad0", getComputedStyle(document.documentElement).getPropertyValue('--grad0'));
		await window.dbOperations.setSetting("ThemeGrad1", getComputedStyle(document.documentElement).getPropertyValue('--grad1'));
	} catch (error) {
		console.error("Error setting theme:", error);
	}
}

async function setIconsize(val) {
	try {
		document.documentElement.style.setProperty('--sizeMultiplier', val);
		await window.dbOperations.setSetting("sizeMultiplier", val);
	} catch (error) {
		console.error("Error setting icon size:", error);
	}
}


/*********************************************************************************/
/* Temp 			                                                             */
/*********************************************************************************/

// Function to populate the player bucket in the sidebar
function populatePlayerBucket() {
    const playerBucket = document.getElementById('playerBucket');
    if (!playerBucket) return;
    
    // Clear existing content
    playerBucket.innerHTML = '';
    
    // Add each player from userDB.loadedPlayers
    Object.values(userDB.loadedPlayers).forEach(player => {
        const membershipId = Array.isArray(player.membershipId) ? player.membershipId[0] : player.membershipId;
        const playerName = Array.isArray(player.bungieName) ? player.bungieName[0] : player.bungieName;
        
        const playerElement = document.createElement('li');
        playerElement.id = `acc-${membershipId}`;
        playerElement.className = 'player-item';
        playerElement.innerHTML = `
            <div class="player-info" onclick="showPlayer('${membershipId}')">
                <span class="player-name">${playerName}</span>
            </div>
            <div class="player-actions">
                <i class="bx bx-trash" onclick="deletePlayer('${membershipId}')" title="Remove player"></i>
            </div>
        `;
        
        playerBucket.appendChild(playerElement);
    });
}

// Function to show a specific player
async function showPlayer(membershipId) {
    try {
        const player = userDB.loadedPlayers[membershipId];
        if (player) {
            viewMain.innerHTML = generatePlayerHTML(player);
        }
    } catch (error) {
        console.error("Error showing player:", error);
    }
}

// Function to delete a player from the database and sidebar
async function deletePlayer(membershipId) {
    try {
        // Remove from database
        await window.dbOperations.deletePlayer(membershipId);
        
        // Remove from local userDB
        delete userDB.loadedPlayers[membershipId];
        
        // Update sidebar
        populatePlayerBucket();
        
        // If this was the currently displayed player, show the first available player
        if (viewMain.innerHTML.includes(membershipId)) {
            const playerKeys = Object.keys(userDB.loadedPlayers);
            if (playerKeys.length > 0) {
                const firstPlayer = userDB.loadedPlayers[playerKeys[0]];
                viewMain.innerHTML = generatePlayerHTML(firstPlayer);
            } else {
                viewMain.innerHTML = '<div class="no-players">No players loaded. Add a player to get started.</div>';
            }
        }
    } catch (error) {
        console.error("Error deleting player:", error);
    }
}

async function buttonClick(mshipId, platType){
	try {
		// Pre-create player button in the recent player list
		const playerBucket = document.getElementById('playerBucket');
		if (playerBucket) {
			const loadingPlayerItem = document.createElement('div');
			loadingPlayerItem.className = 'player-item loading-player';
			loadingPlayerItem.id = `loading-player-${mshipId}`;
			loadingPlayerItem.innerHTML = `
				<div class="player-info">
					<div class="player-name">${getText('loadingPlayer')}</div>
				</div>
				<div class="player-actions">
					<i class="bx bx-loader-alt bx-spin" style="color: var(--grad1);"></i>
				</div>
			`;
			playerBucket.appendChild(loadingPlayerItem);
		}
		
		let cP = await getPlayer(mshipId, platType);
		await window.dbOperations.savePlayer(cP);
		
		// Update local userDB
		userDB.loadedPlayers[cP.membershipId[0]] = cP;
		
		// Remove loading player item
		const loadingPlayerItem = document.getElementById(`loading-player-${mshipId}`);
		if (loadingPlayerItem) {
			loadingPlayerItem.remove();
		}
		
		// Update sidebar
		populatePlayerBucket();
		
		// Display the player
		viewMain.innerHTML = generatePlayerHTML(cP);
	} catch (error) {
		console.error("Error adding player:", error);
		// Remove loading player item on error
		const loadingPlayerItem = document.getElementById(`loading-player-${mshipId}`);
		if (loadingPlayerItem) {
			loadingPlayerItem.remove();
		}
	}
}

// Function to handle scroll-based anchor highlighting
function handleScrollHighlighting() {
    const sections = [
        { id: 'anch-exos', anchor: 'anchorExo' },
        { id: 'anch-equip', anchor: 'anchorInv' },
        { id: 'anch-vault', anchor: 'anchorVault' }
    ];
    
    const scrollPosition = window.scrollY + 100; // Offset for better detection
    
    // Find which section is currently in view
    let currentSection = null;
    
    for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const elementBottom = elementTop + rect.height;
            
            if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
                currentSection = section;
                break;
            }
        }
    }
    
    // Update anchor highlighting
    if (currentSection) {
        anchBtnChange(currentSection.anchor);
    }
}

// Add scroll event listener when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Ensure correct initial view state
    ensureViewState();
    
    // Add scroll event listener for anchor highlighting
    window.addEventListener('scroll', handleScrollHighlighting);
    
    // Initial call to set correct anchor on page load
    setTimeout(handleScrollHighlighting, 100);
});

// Function to ensure correct view state
function ensureViewState() {
    console.log('Ensuring view state - viewMain open:', viewMain.classList.contains("open"), 'viewFireteam open:', viewFireteam.classList.contains("open"));
    
    // If no view is open, open the main view by default
    if (!viewMain.classList.contains("open") && !viewFireteam.classList.contains("open")) {
        console.log('No view open, opening main view');
        viewMain.classList.add("open");
    }
    
    // Ensure only one view is open at a time
    if (viewMain.classList.contains("open") && viewFireteam.classList.contains("open")) {
        console.log('Both views open, closing fireteam view');
        viewFireteam.classList.remove("open");
    }
    
    console.log('Final view state - viewMain open:', viewMain.classList.contains("open"), 'viewFireteam open:', viewFireteam.classList.contains("open"));
}