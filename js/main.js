$(document).ready(function(){
	console.log("W")
	resizeWindow();	
	$(".page1_button1").on("mousedown touchstart",function(){
		changePage("page_choose")
	});
	$(".page2_text2").on("mousedown touchstart",function(){
		teamchoose="nus"
		changePage("page_inst")
	});
	$(".page2_text3").on("mousedown touchstart",function(){
		teamchoose="ntu"
		changePage("page_inst")
	});
	$(".page3_button1").on("mousedown touchstart",function(){
		changePage("page_game");
		$.each($(".game_ele"),function(i,a){
			resetEle(a);
		});
		setTimeout(function(){startGame();},500);
	});
	$("#page_tvc,#page_gameend_ntu,#page_gameend_nus").on("mousedown touchstart",function(){
		changePage("page_start");
		 player.stopVideo();
	});
	
	$(".game_ele").on("mousedown touchstart",eleClicked);
	$('img').on('dragstart', function(event) { event.preventDefault(); });
	$(window).resize(resizeWindow);
	fc = new FpsCtrl(60, function(e) {
     draw();
  	});
});

$(document).idle({
  onIdle: function(){
	if($("#page_tvc").css("display")!="block"){
		changePage("page_tvc");
		if (requestId) {
			window.cancelAnimationFrame(requestId);
			requestId = undefined;
		}
		player.playVideo();
	}
  },
  idle: 60000
})
var fc;
var life;
var gamescore;
var teamchoose="nus"
function startGame(){
	life = 3;
	gamescore = 0;
	timestamp=0;
	$.each($(".game_ele"),function(i,a){
		resetEle(a);
	});
	$(".game_life").show();
	
  fc.start();
	//requestId  = window.requestAnimationFrame(mainLoop);
}

function stopGame() {
	fc.pause();
	$(".page4_p_text1 span,.page5_p_text1 span").html(gamescore)
	changePage("page_gameend_"+teamchoose);
}

function resizeWindow(){
	var wWidth = $(window).height()/1920 * 1080;
	$("#gamearea").width(wWidth);
	$("#gamearea").height($(window).height())
}

function changePage(pageName){	$.each($(".gamepage"),function(i,a){		if($(a).css("display")=="block"){			$(a).fadeOut()		}	});
	$("#"+pageName).fadeIn();
}

function mainLoop() {
    requestId = window.requestAnimationFrame(mainLoop);
    update();
    draw();
}

function eleClicked(e){
	$(this).attr("data-speed",0);
	$(this).find(".emotion").show();
	var de = $(this);
	if($(this).hasClass("game_ele1")){
		gamescore++;
		setTimeout(function(){resetEle(de)},500);
	}else{
		$(".game_life"+life).hide();
		life--;
		if(life==0){
			stopGame();
		}else{
			setTimeout(function(){resetEle(de)},500);
		}
	}
}
function resetEle(e){
	$(e).css("top",-100- getRandomInt(-25,50)+"px");
	$(e).css("left", 0+getRandomInt(10,$("#gamearea").width())+"px");
	$(e).attr("data-speed",getRandomInt(10,20));
	
	if($(e).hasClass("game_ele1")){
		$(e).css("transform","rotate("+getRandomInt(-10,20)+"deg)");
	}
	if($(e).hasClass("game_obs1")){
		$(e).css("transform","rotate("+getRandomInt(-10,20)+"deg)");
	}
	if($(e).hasClass("game_obs2")){
		$(e).css("transform","rotate("+getRandomInt(-10,20)+"deg)");
	}
	if($(e).hasClass("game_obs3")){
		$(e).css("transform","rotate("+getRandomInt(-10,20)+"deg)");
	}
	$(e).find(".emotion").hide();
}

function getRandomInt(min,max) {
  return Math.floor(min + (Math.random() * Math.floor(max)));
}

function draw() {
	$.each($(".game_ele"),function(i,a){
	
	if(parseFloat($(a).css("top").toString().replace("px","")) >= $("#gamearea").height()){
		resetEle(a);
	}
	var ttop = parseFloat($(a).css("top").toString().replace("px",""));
	var dspeed = parseInt($(a).attr("data-speed")) / 1920 * $(window).height()
    $(a).css("top", (ttop+dspeed)+"px");
	});
}

function update() {
	
}


function FpsCtrl(fps, callback) {

    var delay = 1000 / fps,                               // calc. time per frame
        time = null,                                      // start time
        frame = -1,                                       // frame count
        tref;                                             // rAF time reference

    function loop(timestamp) {
        if (time === null) time = timestamp;              // init start time
        var seg = Math.floor((timestamp - time) / delay); // calc frame no.
        if (seg > frame) {                                // moved to next frame?
            frame = seg;                                  // update
            callback({                                    // callback function
                time: timestamp,
                frame: frame
            })
        }
        tref = requestAnimationFrame(loop)
    }
    
    // play status
	this.isPlaying = false;

	// set frame-rate
	this.frameRate = function(newfps) {
		if (!arguments.length) return fps;
		fps = newfps;
		delay = 1000 / fps;
		frame = -1;
		time = null;
	};

	// enable starting/pausing of the object
	this.start = function() {
		if (!this.isPlaying) {
			this.isPlaying = true;
			tref = requestAnimationFrame(loop);
		}
	};

	this.pause = function() {
		if (this.isPlaying) {
			cancelAnimationFrame(tref);
			this.isPlaying = false;
			time = null;
			frame = -1;
		}
	};
}