

$(function(){

    step_();
})
function step_(){
    let howLong=$(".modal-steps ").actual("width")/3;
    console.log(howLong)
    let current=0;
    $('.step-main').css("height",getMaxHeight());
    $('.step-slide').eq(current).fadeIn(500)
    $('.step').eq(current).addClass("current");

    let preventResponse=false;
    $('#next').click(function(){
        if(!preventResponse){
            if(current!=($('.step-slide').length-1)){
        
                $('.step').eq(current).addClass("completed");
            
                current++;
                
                let timeOut=null;
                clearTimeout(timeOut);
                timeOut=setTimeout(function(){
                    console.log(current)
                    $('.step').eq(current).addClass("current");
                },200);

                console.log(current);
                $('.step-slide').eq(current).stop().fadeIn(500).siblings().fadeOut(500);
                if(current==($('.step-slide').length-1)){
                    $(this).html("完成");
                }else{
                    $(this).html("下一步");
                }
                if(current==0){
                    $('#pre').addClass('unVisible')
                }else{
                    $('#pre').removeClass('unVisible')
                }
            }
            
            // $(".step").eq(0).css("width",current*howLong);
            preventResponse=true;
            setTimeout(function(){
                preventResponse=false;
            },500);
        }
    })
    $('#pre').click(function(){
        if(!preventResponse){
            if(current!=0){

                $('.step').eq(current).removeClass("current");
                current--;
                let timeOut=null;
                clearTimeout(timeOut);
                timeOut=setTimeout(function(){
                    $('.step').eq(current).removeClass("completed");
                },200);
                $('.step-slide').eq(current).stop().fadeIn(500).siblings().fadeOut(500);
                if(current==($('.step-slide').length-1)){
                    $("#next").html("完成");
                }else{
                    $("#next").html("下一步");
                }
                if(current==0){
                    $(this).addClass('unVisible')
                }else{
                    $(this).removeClass('unVisible')
                }
            }
            
           
            preventResponse=true;
            setTimeout(function(){
                preventResponse=false;
            },500);
        }
    })
}

function getMaxHeight(){
    let MaxHeight=0;
    $('.step-slide').each(function(){
        let actualHeight=parseFloat($(this).actual('outerHeight'));
        if(actualHeight>MaxHeight){
            MaxHeight=actualHeight
        }
    })
    // console.log(MaxHeight)
    return MaxHeight;
}