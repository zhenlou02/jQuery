function autoRoll() {
	var count = 1; //鼠标灵敏度
	var top = 0;
	var pageNum=$('#pageDiv').children('.page').length;
	console.log(pageNum)
	$(document).bind("mousewheel DOMMouseScroll", function(e) {
		var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
			(e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)); // firefox
		if (count === 1) {　　
			if (delta > 0) { // 向上滚
				console.log(delta);
				if (top > -1) {
					top--;
					$(".page" + (parseInt(top)-1)).addClass("out").siblings().removeClass("out");
					$(".page" + parseInt(top)).addClass("show").siblings().removeClass("show");
				}
				if(top == -1){
					top = pageNum;
					$(".page" + 0).addClass("out").siblings().removeClass("out");
					$(".page" + (parseInt(top)-1)).addClass("show").siblings().removeClass("show");
				}
				if(top == 0){
					$(".page" + (parseInt(pageNum)-1)).addClass("out").siblings().removeClass("out");
					$(".page" + parseInt(top)).addClass("show").siblings().removeClass("show");
				}
				if(top == pageNum){
					$(".page" + (parseInt(pageNum)-1)).addClass("show").siblings().removeClass("show");
					$(".page" + (parseInt(pageNum)-2)).addClass("out").siblings().removeClass("out")
					top--;
				}
				var tx = -235;//导航左translateX数值
				tx= tx*top;
				$(".nav_list").css("transform", "translateX("+ tx +"px)")
				
			} else if (delta < 0) { // 向下滚
				console.log(delta);
				if (top == 0 || top < pageNum) {
					top++;
					$(".page" + parseInt(top)).addClass("show").siblings().removeClass("show");
					$(".page" + (parseInt(top)-1)).addClass("out").siblings().removeClass("out");
					
				}
				if(top == pageNum){
					top = 0;
					$(".page" + parseInt(top)).addClass("show").siblings().removeClass("show");
					$(".page" + parseInt(pageNum)).addClass("out").siblings().removeClass("out");
				}
				var tx = -235;//导航左translateX数值
				tx= tx*top;
				$(".nav_list").css("transform", "translateX("+ tx +"px)")
			}
			console.log('top',top);
			console.log('tx',tx);
			//导航
			$('.nav_list li').eq(top).addClass('active').siblings().removeClass("active");
			setTimeout(function() {　　　　　　 
				//1000ms之后重置count
				count = 1;　
			}, 1000);　　
		}　　 
		//1000ms内每滚动一次就自增一次
		count++;
	});
	//导航点击
	$(".nav_list li").click(function(){
		var _index = $(this).index();
		$(".nav_list li").eq($(this).index()).addClass('active').siblings().removeClass("active");
		$(".page").removeClass("show");
		$(".page" + parseInt(_index)).addClass("show")
	});
	
}
autoRoll()