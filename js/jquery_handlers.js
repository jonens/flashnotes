$(document).ready(function () {

	/* Set up global variables and objects */
	var inputs = ["a", "b", "c", "d", "e", "f", "g"];
	
	if (!Modernizr.canvas) {
		$('#nocanvas_frame').show();
	}
	else {
		cfg = new Config();
		statusModel = new StatusModel();
		statusView = new StatusView();
		notationModel = new NotationModel();
		notationController = new NotationController(0);			
		gameController = new GameController();		
		$('#stop').hide();
		$('#menu_frame').show();		
		$('#practice_button').click(function () {
			gameController.displayPractice();
		});
		$('#play_button').click(function () {		
			gameController.displayGame();
		});
		$('#instructions_button').click(function () {
			$('#menu_frame').hide();
			$('#instructions_frame').show();	
		});
		$('#back_button').click(function () {
			$('#instructions_frame').hide();
			$('#menu_frame').show();		
		});
		$('#start_button').click(function () {
			var started = gameController.getStart();		
			if (!started) {
				$(this).hide();
				$('#stop_button').show();
			}			
			gameController.startGame("#status_timer");
		});
		$('#stop_button').click(function () {
			var started = gameController.getStart();		
			if (started) {
				$(this).hide();
				$('#start_button').show();
			}
			gameController.stopGame();
		});	
		$('.inputBtn').keydown(function (event) {
			var keyId, code = event.keyCode;		
			if (code === '13') {
				event.preventDefault();
			}
			if (code >= 65 && code <= 71) {
				keyId = inputs[code - 65];
				gameController.continueGame(code, keyId);
			}
		});
		$('.inputBtn').click(function () {
			var $input = $(this);		
			var code = $input.attr('value').charCodeAt(0);
			var keyId = inputs[code - 65];		
			gameController.continueGame(code, keyId);		
		});
		$('.clefBtn').click(function () {				
			var t = parseInt($(this).attr('value'));
			gameController.toggleClef(t);			
			$('#a').focus();
		});
		$('#session_start_button').click(function () {
			$('#session_frame').hide();
			statusModel.setTimeout(false);
			$('#game_frame').show();		
			gameController.startGame("#status_timer");
		});
		$('#session_summary_button').click(function () {
			$('#session_frame').hide();
			gameController.displaySummary();
		});
		$('#game_end_button').click(function () {
			$('#session_frame').hide();
			gameController.processFinalScore();
		});		
		$('#sum_continue_button').click(function () {		
			$('#summary_frame').hide();
			$('#session_frame').hide();
			if (!statusModel.getTimeout() && statusModel.getMode() === statusModel.GAME_MODE)
			{
				gameController.startGame("#timer");
			}		
			if (statusModel.getTimeout())
			{
				gameController.updateLevel();
			}
			else
			{						
				$('#game_frame').show();
			}		
			$('#a').focus();
		});
		$('#quit_button').click(function () {
			$('#summary_frame').hide();		
			if (statusModel.getMode() === cfg.GAME_MODE){
				gameController.processFinalScore();
				gameController.removeLivesDisplay();
				$('#score_display_frame').show();
			}
			else {
				$('#menu_frame').show();
			}
		});
		$('#main_menu_button').click(function () {
			$('#score_display_frame').hide();
			$('#main_menu_button').hide();
			gameController.init();
			$('#menu_frame').show();
		});
		$('button').hover(function () {
			$(this).css({opacity: 1.0});
			},
			function () {
				$(this).css({opacity: 0.90});
				}
		);
	}
});