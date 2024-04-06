"use strict";
/**
 * Dancing☆Onigiri カスタム用jsファイル
 * その１：共通設定用
 * 
 * このファイルは、作品個別に設定できる項目となっています。
 * 譜面データ側で下記のように作品別の外部jsファイルを指定することで、
 * danoni_main.js の中身を変えることなく設定が可能です。
 * 
 * 設定例：
 * |customjs=danoni_custom-003.js|
 * 
 * ・グローバル変数、div要素、関数は danoni_main.js のものがそのまま利用できます。
 * ・danoni_main.jsの変数を直接書き換えると、動かなくなることがあります。
 * 　こまめのバックアップをおススメします。
 * ・ラベルなどのdiv要素を作る場合、「divRoot」の下にappendChild（div要素を追加）することで
 * 　画面遷移したときにきれいに消してくれます。
 */

/**
/* ！！注意！！
/* ・表示の都合上、0譜面目（最初の譜面）の難易度名にコース名を入力してください。
/* ・0譜面目のキー数と難易度名が、twitterのリザルトに表示されるキー数と難易度名になります。
/* 
/* ・同一のコースに同一の楽曲が複数ステージにわたって使用される場合であっても、musicTitleやmusicNoなどの設定は個別に行ってください。
/* 　良い例: |musicTitle=なんかすごいコース,Various,$なんかすごい曲,なんかすごいアーティスト,$なんかすごい曲,なんかすごいアーティスト,|
/* 　　　　  |musicNo=0$1$2|
/*
/* 　悪い例: |musicTitle=なんかすごいコース,Various,$なんかすごい曲,なんかすごいアーティスト|
/* 　　　　  |musicNo=0$1$1|
/*
/* ・譜面ヘッダーにcourseNameを追加してください。
/* 　例: |courseName=11key皆伝|
/*
*/


/**
/* グローバル変数（ユーザー指定）
*/

// 補正（ダメージが半減する）が入り始めるライフを指定してください
const g_damageReductionFrom = 300;

// 補正を適用「しない」ゲージを指定してください
const g_gaugesWithoutDamageReduction = ["EX", "LIFE4", "LIFE8"];

// ステージ完走後にライフ回復を適用するゲージと、その回復量を指定してください
// ※回復量: 直前に完走したステージでのダメージ量を1とした値。10であれば、10ミス分のライフを回復します。
const g_gaugeWithRecoveryAtEnd = {
	gauge: ["LIFE4", "LIFE8"],
	recovery: [1, 1]
};

// Readyの代わりに表示される曲名のフォントサイズを指定してください
const g_courseNameFontSize = 28;


// その他のグローバル変数

let g_accumulatedResultObj = {
	combo: 0,
	fCombo: 0,
	fast: 0,
	fmaxCombo: 0,
	ii: 0,
	iknai: 0,
	kita: 0,
	matari: 0,
	maxCombo: 0,
	score: 0,
	sfsf: 0,
	shakin: 0,
	shobon: 0,
	slow: 0,
	spState: "",
	uwan: 0
};

let g_courseFinishFlg = false;
let g_accumulatedCurrentArrows = 0;
let g_combo = 0;
let g_fcombo = 0;
let g_maxCombo = 0;
let g_fmaxCombo = 0;

let g_preCombo = 0;
let g_preFcombo = 0;
let g_preMaxCombo = 0;
let g_preFmaxCombo = 0;

/**
 * ローディング中処理
 * @param {event} _event ローディングプロパティ
 * 	_event.loaded 読込済バイト数
 * 	_event.total  読込総バイト数 
 */
function customLoadingProgress(_event) {

}

/**
 * タイトル画面 [Scene: Title / Melon]
 */
function customTitleInit() {

	// バージョン表記
	g_localVersion = `2.0.0`;

	// コース初期化
	resetCourse();
}

/**
 * 譜面選択(Difficultyボタン)時カスタム処理
 * @param {boolean} _initFlg 譜面変更フラグ (true:譜面変更選択時 / false:画面遷移による移動時)
 * @param {boolean} _canLoadDifInfoFlg 譜面初期化フラグ (true:譜面設定を再読込 / false:譜面設定を引き継ぐ)
 */
function customSetDifficulty(_initFlg, _canLoadDifInfoFlg) {

}

/**
 * タイトル画面(フレーム毎表示) [Scene: Title / Melon]
 */
function customTitleEnterFrame() {

}

/**
 * オプション画面(初期表示) [Scene: Option / Lime]
 */
function customOptionInit() {

	document.querySelector("#lnkDifficultyL").remove();
	document.querySelector("#lnkDifficultyR").remove();
	
	const lnkDifficulty = document.querySelector("#lnkDifficulty");
	lnkDifficulty.style.left = "120px";
	lnkDifficulty.style.width = "290px";

	const currentStage = getStageNum(g_stateObj.scoreId, g_headerObj.keyLabels.length - 1);
	const songName = `${g_headerObj.musicTitles[g_stateObj.scoreId]}`;

	let songFontSize = 16;

	if (getStrLength(songName) > 25) {
		songFontSize = 14;
	} else if (getStrLength(songName) > 18) {
		songFontSize = 16;
	}

	const stageNumFontSize = Math.ceil(songFontSize * 0.8);

	// 譜面名の代わりに曲名を表示
	lnkDifficulty.innerHTML = `<span style="font-size:${stageNumFontSize}px">${currentStage} stage</span>\n<span style="font-size:${songFontSize}px">${songName}</span>`;

	// コースの途中では設定不可の項目
	if (g_stateObj.scoreId > 1) {
		g_btnDeleteFlg.btnBack = true;

		g_btnDeleteFlg.lnkGauge = true;
		g_btnDeleteFlg.lnkGaugeL = true;
		g_btnDeleteFlg.lnkGaugeR = true;

		g_btnDeleteFlg.lnkAutoPlay = true;
		g_btnDeleteFlg.lnkAutoPlayL = true;
		g_btnDeleteFlg.lnkAutoPlayR = true;

		g_cxtDeleteFlg.lnkGauge = true;
		g_cxtDeleteFlg.lnkAutoPlay = true;
	}

	// 最初から設定不可の項目
	g_btnDeleteFlg.lnkDifficulty = true;
	g_cxtDeleteFlg.lnkDifficulty = true;

	g_btnDeleteFlg.lnkFadeinL = true;
	g_btnDeleteFlg.lnkFadeinR = true;
	document.querySelector("#fadeinSlider").max = 0;
}

/**
 * 表示変更(初期表示) [Scene: Settings-Display / Lemon]
 */
function customSettingsDisplayInit() {
	if (g_stateObj.scoreId > 1) {
		g_btnDeleteFlg.btnBack = true;
	}
}

/**
 * キーコンフィグ画面(初期表示) [Scene: KeyConfig / Orange]
 */
function customKeyConfigInit() {

}

/**
 * 譜面読込画面 [Scene: Loading / Strawberry]
 * - この画面のみ、画面表示がありません。
 * - 処理が完了すると、自動的にメイン画面へ遷移します。
 */
function customLoadingInit() {
	g_workObj.lifeVal = g_gaugeOptionObj[`gauge${g_stateObj.gauge}s`].lifeInits[g_stateObj.scoreId] * 10;

	g_workObj.lifeDmg /= 2;

	g_headerObj.keyRetry = C_KEY_RETRY;

	const stageNum = getStageNum(g_stateObj.scoreId, g_headerObj.keyLabels.length - 1);
	g_headerObj.readyHtml = `<span style="font-size:${g_courseNameFontSize}px">${stageNum} stage<br>${g_headerObj.musicTitles[g_stateObj.scoreId]} [${g_headerObj.difLabels[g_stateObj.scoreId]}]</span>`

	// リトライ時などに、曲の途中までで獲得したコンボをリセット
	g_combo = g_preCombo;
	g_fcombo = g_preFcombo;
	g_maxCombo = g_preMaxCombo;
	g_fmaxCombo = g_preFmaxCombo;
}

/**
 * メイン画面(初期表示) [Scene: Main / Banana]
 */
function customMainInit() {
	
}

/**
 * メイン画面(フレーム毎表示) [Scene: Main / Banana]
 */
function customMainEnterFrame() {
	// 開始20秒以内であればリトライ可能
	if (g_scoreObj.frameNum === 20 * 60) {
		g_headerObj.keyRetry = 0;
	}

	// 開始20秒以内であればオプション設定画面に戻ることができる
	if (keyIsDown(g_kCd[C_KEY_TITLEBACK]) && g_scoreObj.frameNum < 20 * 60) {
		setTimeout(optionInit2, 0);
	}

	function optionInit2() {
		g_lblNameObj.b_back = g_stateObj.scoreId === 1 ? "Back" : "-";
		g_audio.pause();
		clearTimeout(g_timeoutEvtId);
		optionInit();
	}
}

/**
 * 結果画面(初期表示) [Scene: Result / Grape]
 */
function customResultInit() {

	g_workObj.lifeDmg *= 2;

	// コース完走ではない場合
	if (g_courseFinishFlg === false) {

		// 判定の累積値を算出
		calcAccumulatedResults();

		if (g_resultObj.spState !== "failed" && g_workObj.lifeVal > 0) {

			// Failedでない場合
			if (g_stateObj.scoreId + 1 < g_headerObj.keyLabels.length) {

				// 生存かつ最後の譜面ではない場合
				g_lblNameObj.b_retry = "Next";
				g_lblNameObj.b_back = "-";
				g_btnDeleteFlg.btnBack = true;
				g_btnDeleteFlg.btnRetry = true;

				g_btnAddFunc.btnRetry = _ => {

					g_lblNameObj.b_back = "-";
					g_stateObj.scoreId++;
					g_keyObj.currentPtn = 0;

					g_gaugeOptionObj[`gauge${g_stateObj.gauge}s`].lifeInits[g_stateObj.scoreId] = getNewLifeInit();

					const url = getUrlWithResetParam("stageNum", g_stateObj.scoreId);
				
					history.replaceState(null, document.title, url);
					loadLocalStorage();

					clearTimeout(g_timeoutEvtId);
					clearTimeout(g_timeoutEvtResultId);
					g_audio.pause();
					setTimeout(optionInit, 0);
				}
			} else {

				// 生存かつ最後の譜面の場合
				g_lblNameObj.b_retry = "Result";
				g_lblNameObj.b_back = "-";

				g_btnDeleteFlg.btnRetry = true;
				g_btnDeleteFlg.btnBack = true;

				g_btnAddFunc.btnRetry = toCourseResult;
			}
		} else {

			// 途中落ちの場合
			g_lblNameObj.b_retry = "Result";
			g_lblNameObj.b_back = "Back";

			g_btnDeleteFlg.btnRetry = true;

			g_btnAddFunc.btnRetry = toCourseResult;
		}
	} else {

		// コース全体のリザルト
		g_lblNameObj.b_retry = "Retry";
		g_lblNameObj.b_back = "Back";

		document.querySelector("#lblMusic").innerText = "Course";
		document.querySelector("#lblMusicData").innerText = g_rootObj.courseName;
		document.querySelector("#lblDifficulty").innerText = "";
		document.querySelector("#lblDifData").innerText = "";

		g_gaugeOptionObj[`gauge${g_stateObj.gauge}s`].lifeInits.fill(100);

		// リトライ選択時はコースを初期化
		g_btnDeleteFlg.btnRetry = true;
		g_btnAddFunc.btnRetry = _ => {
			g_audio.pause();
			clearTimeout(g_timeoutEvtId);
			clearTimeout(g_timeoutEvtResultId);

			resetCourse();
			setTimeout(() =>{
				optionInit();
				loadMusic();
			}, 0)
		}
	}

	function calcAccumulatedResults() {
		const keys = Object.keys(g_resultObj);
		keys.forEach(key => {
			if (typeof g_resultObj[key] === "number") {
				if (key === "maxCombo") {
					g_accumulatedResultObj.maxCombo = g_maxCombo;
				} else if (key === "fmaxCombo"){
					g_accumulatedResultObj.fmaxCombo = g_fmaxCombo;
				} else {
					g_accumulatedResultObj[key] += g_resultObj[key];
				}
			}
		})
		g_accumulatedCurrentArrows += g_currentArrows;

		// 譜面を完走したのでコンボを確定
		g_preCombo = g_combo;
		g_preFcombo = g_fcombo;
		g_preMaxCombo = g_maxCombo;
		g_preFmaxCombo = g_fmaxCombo;

	}

	function getNewLifeInit() {
		let life = g_workObj.lifeVal;
		if (g_stateObj.scoreId === 1) {
			return life / 10;
		}

		if (g_gaugeWithRecoveryAtEnd.gauge.includes(g_stateObj.gauge)) {
			const recovery = getOneUpRecovery();
			life = Math.min(life + recovery, g_headerObj.maxLifeVal);
		}
		return life / 10;

		function getOneUpRecovery() {
			const scoreId = g_stateObj.scoreId - 1;
			const index = g_gaugeWithRecoveryAtEnd.gauge.indexOf(g_stateObj.gauge);
			let recovery;
		
			if (g_stateObj.lifeVariable === C_FLG_ON) {
				const allArrows = g_detailObj.arrowCnt[scoreId].reduce((accum, num) =>{
					return accum + num;
				}, 0);
				const allFrzs = g_detailObj.frzCnt[scoreId].reduce((accum, num) =>{
					return accum + num;
				}, 0);

				const fullArrows = (g_headerObj.frzStartjdgUse === true) ? allArrows + allFrzs * 2 : allArrows + allFrzs;

				recovery = calcLifeVal(g_gaugeOptionObj[`gauge${g_stateObj.gauge}s`].lifeDamages[scoreId], fullArrows) * g_gaugeWithRecoveryAtEnd.recovery[index];
			} else {
				recovery = g_gaugeOptionObj[`gauge${g_stateObj.gauge}s`].lifeDamages[scoreId] * g_gaugeWithRecoveryAtEnd.recovery[index];
			}
			return recovery;
		}
	}

	function toCourseResult() {
		g_courseFinishFlg = true;

		// g_resultObj自体は再代入不可なので、キーごとにコース全体のリザルトを代入
		const keys = Object.keys(g_resultObj);
		keys.forEach(key => {
			g_resultObj[key] = g_accumulatedResultObj[key];
		});

		g_fullArrows = getCourseFullArrows();

		// 実際に判定された数はランク計算に必要
		g_currentArrows = g_accumulatedCurrentArrows;

		if (g_accumulatedCurrentArrows === g_fullArrows) {
			if (g_resultObj.ii + g_resultObj.kita === g_fullArrows) {
				g_resultObj.spState = `allPerfect`;
			} else if (g_resultObj.ii + g_resultObj.shakin + g_resultObj.kita === g_fullArrows) {
				g_resultObj.spState = `perfect`;
			} else if (g_resultObj.uwan === 0 && g_resultObj.shobon === 0 && g_resultObj.iknai === 0) {
				g_resultObj.spState = `fullCombo`;
			}
		}

		g_stateObj.scoreId = 0;

		// 記録保存用のURLはパラメータなしのものを用いる
		const url = new URL(location.href);
		url.searchParams.delete("stageNum");

		history.replaceState(null, document.title, url);
		loadLocalStorage();

		clearTimeout(g_timeoutEvtId);
		clearTimeout(g_timeoutEvtResultId);
		g_audio.pause();
		setTimeout(resultInit, 0);
	}
	
	function getCourseFullArrows() {
		g_allArrow = g_detailObj.arrowCnt.reduce((accum, myArray) => {
			return accum + myArray.reduce((accum, num) => {
				return accum + num;
			}, 0);
		}, 0);
	
		g_allFrz = g_detailObj.frzCnt.reduce((accum, myArray) => {
			return accum + myArray.reduce((accum, num) => {
				return accum + num;
			}, 0);
		}, 0);

		// フリーズ始点判定がある場合は通常矢印数を上乗せ
		if (g_headerObj.frzStartjdgUse === true) {
			g_allArrow += g_allFrz;
		}

		return g_allArrow + g_allFrz;
	}
}

/**
 * 結果画面(フレーム毎表示) [Scene: Result / Grape]
 */
function customResultEnterFrame() {

}

function getStageNum(current, max) {
	let order;
	if (current === max) {
		order = "Final";
	} else {
		switch (current % 10) {
			case 1:
				order = String(current) + "st";
				break;

			case 2:
				order = String(current) + "nd";
				break;

			case 3:
				order = String(current) + "rd";
				break;

			default:
				order = String(current) + "th";
				break;
		}
	}
	return order;
}

// コースの初期化
function resetCourse() {

	g_lblNameObj.b_back = "Back";

	g_courseFinishFlg = false;

	g_preCombo = 0;
	g_preFcombo = 0;
	g_preMaxCombo = 0;
	g_preFmaxCombo = 0;

	g_accumulatedCurrentArrows = 0;
	g_accumulatedResultObj = {
		combo: 0,
		fCombo: 0,
		fast: 0,
		fmaxCombo: 0,
		ii: 0,
		iknai: 0,
		kita: 0,
		matari: 0,
		maxCombo: 0,
		score: 0,
		sfsf: 0,
		shakin: 0,
		shobon: 0,
		slow: 0,
		spState: "",
		uwan: 0
	};

	g_stateObj.scoreId = 1;
	g_keyObj.currentKey = g_headerObj.keyLabels[g_stateObj.scoreId];
	g_keyObj.currentPtn = 0;

	const url = getUrlWithResetParam("stageNum", g_stateObj.scoreId);

	history.replaceState(null, document.title, url);
	loadLocalStorage();
}

function getUrlWithResetParam(paramName, val) {
	const url = new URL(location.href);
	url.searchParams.delete(paramName);
	url.searchParams.append(paramName, val);
	return url;
}

/**
 * 判定カスタム処理 (引数は共通で1つ保持)
 * @param {number} difFrame タイミング誤差(フレーム数)
 */

// イイ
function customJudgeIi(difFrame){
	g_combo++;
	g_maxCombo = Math.max(g_maxCombo, g_combo);
}

// シャキン
function customJudgeShakin(difFrame){
	g_combo++;
	g_maxCombo = Math.max(g_maxCombo, g_combo);
}

// マターリ
function customJudgeMatari(difFrame){

}

// ショボーン
function customJudgeShobon(difFrame){
	g_combo = 0;

	// 補正が入ってる場合はダメージ半減
	if (g_workObj.lifeVal > g_damageReductionFrom - g_workObj.lifeDmg || g_gaugesWithoutDamageReduction.includes(g_stateObj.gauge)) {
		lifeDamage();
	}
}

// ウワァン
function customJudgeUwan(difFrame){
	g_combo = 0;

	// 補正が入ってる場合はダメージ半減
	if (g_workObj.lifeVal > g_damageReductionFrom - g_workObj.lifeDmg || g_gaugesWithoutDamageReduction.includes(g_stateObj.gauge)) {
		lifeDamage();
	}
}

// キター
function customJudgeKita(difFrame){
	g_fcombo++;
	g_fmaxCombo = Math.max(g_fmaxCombo, g_fcombo);
}

// イクナイ
function customJudgeIknai(difFrame){
	g_fcombo = 0;

	// 補正が入ってる場合はダメージ半減
	if (g_workObj.lifeVal > g_damageReductionFrom - g_workObj.lifeDmg || g_gaugesWithoutDamageReduction.includes(g_stateObj.gauge)) {
		lifeDamage();
	}
}

// ダミー矢印
function customJudgeDummyArrow(difFrame){

}

// ダミーフリーズアロー
function customJudgeDummyFrz(difFrame){

}
