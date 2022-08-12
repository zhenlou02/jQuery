(function(){
    
//动态获取导航数据
// get_menu()
function get_menu() {
    $.ajax({
        type: 'get',
        url: '导航请求接口',
        dataType: 'json',
        data: {},
        success: function (data) {
            var str = '';
            if (data.error_code == 0) {
                $.each(data.data, function (k, v) {
                    v.cate_name = v.name.substring(0, 2);
                    if (k == 0) {
                        str += ' <div class="swiper-slide nav-a selected" navid="'+v.id+'"><span>' + v.name + '</span></div>';
                    } else {
                        str += ' <div class="swiper-slide nav-a" navid="'+v.id+'"><span>' + v.name + '</span></div>';
                    }
                
                })
                str += ' <div class="bar"><div class="color"></div></div>';
                $('#nav .swiper-wrapper').html(str);
            }
            
        }
    });
};
//模拟数据
var data = [
    {id: 0, pid: 0, name: "推荐", title: "今日热点"},
    {id: 1, pid: 0, name: "社会", title: "社会热点"},
    {id: 2, pid: 0, name: "娱乐", title: "娱乐热点"},
    {id: 3, pid: 0, name: "体育", title: "体育热点"},
    {id: 4, pid: 0, name: "军事", title: "军事热点"},
    {id: 5, pid: 0, name: "国际", title: "国际热点"},
    {id: 6, pid: 0, name: "财经", title: "财经热点"},
    {id: 7, pid: 0, name: "历史", title: "历史热点"},
    {id: 8, pid: 0, name: "游戏", title: "游戏热点"},
    {id: 9, pid: 0, name: "汽车", title: "汽车热点"},
    {id: 10, pid: 0, name: "养生", title: "养生热点"}
]
get()
function get() {
    var str = '';
    $.each(data,function (k, v) {
        if (k == 0) {
            str += ' <div class="swiper-slide nav-a selected" navid="'+v.id+'"><span>' + v.name + '</span></div>';
        } else {
            str += ' <div class="swiper-slide nav-a" navid="'+v.id+'"><span>' + v
                .name + '</span></div>';
        }
    
    })
    str += ' <div class="bar"><div class="color"></div></div>';
    $('#nav .swiper-wrapper').html(str);
};
//点击导航高亮
$("body").on("click", '.nav-a', function () {
    var moveX = $(this).position().left + $(this).parent().scrollLeft();
    var pageX = document.documentElement.clientWidth;
    var blockWidth = $(this).width();
    var left = moveX - (pageX / 2) + (blockWidth / 2);
    $(".nav-list").animate({
        scrollLeft: left,
    });
    $(".nav-a").removeClass("selected");
    $(this).addClass("selected");
    var cate_index = $(this).prevAll().length;
    var a_id = $(this).attr('navid');
    if (a_id == 0) {
        $('.tuijian').show();
        $('#qudao').show();
    } else {
        $('.tuijian').hide();
        $('#qudao').hide();
    }
    var pxs = parseInt(cate_index) * 52;
    $('.bar').css({"width": "52px", "transition-duration": "100ms", "transform": "translateX(" + pxs + "px)"})
});
})()
