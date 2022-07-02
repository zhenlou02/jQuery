
$(document).ready(function () {
    
});

var timerId;
var mm;
var ii = 0;

function StartTimer(i_Minute, i_Second) {
    mm = i_Minute;
    if (i_Second == 0)
        ii = 60;
    else
        ii = i_Second;
    timerId = setInterval("recycle()", 1000);
}

function recycle() {
    if (ii == 0) {
        ii = 60;
        mm = mm - 1;
    }
    ii = ii - 1;
    var theDate = "  " + mm + "分" + ii + "秒";
//    $("#minute").html(mm);
//    $("#second").html(ii);
    $("#lasttime").html(theDate);
    document.getElementById("txtTimer").value = theDate;
     
    if ((mm == 0 && ii == 0) || mm < 0) {
        clearInterval(timerId);
//        $("#minute").html(0);
//        $("#second").html(0);
        $("#lasttime").html(" " + 0 + "分" + 0 + "秒");
        document.getElementById("txtTimer").value = " " + 0 + "分" + 0 + "秒";
        UpExam(-3);
    } 
    else {

        if (GetDateDiff(CurentTime(), $("#endtime").val(), "second") < 0) {//获取当前时间和模板结束时间对照，判断是否需要自动交卷
            UpExam(-3);
        } 
    }

}
//获取当前时间
function CurentTime() {
    var now = new Date();

    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分

    var clock = year + "-";

    if (month < 10)
        clock += "0";

    clock += month + "-";

    if (day < 10)
        clock += "0";

    clock += day + " ";

    if (hh < 10)
        clock += "0";

    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm;
    return (clock);
} 

function GetDateDiff(startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式  
    startTime = startTime.replace(/-/g, "/");
    endTime = endTime.replace(/-/g, "/");
    //将计算间隔类性字符转换为小写  
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime); //开始时间  
    var eTime = new Date(endTime); //结束时间  
    //作为除数的数字  
//    var divNum = 1;
//    switch (diffType) {
//        case "second":
//            divNum = 1000;
//            break;
//        case "minute":
//            divNum = 1000 * 60;
//            break;
//        case "hour":
//            divNum = 1000 * 3600;
//            break;
//        case "day":
//            divNum = 1000 * 3600 * 24;
//            break;
//        default:
//            break;
//    }
    return parseInt((eTime.getTime() - sTime.getTime())); //17jquery.com   / parseInt(divNum)
}

function getAjax(url, parm, callBack) {
    $.ajax({
        type: 'post',
        dataType: "json",
        url: url,
        data: parm,
        cache: false,
        async: false,
        success: function (msg) {
            callBack(msg);
        }
    });
}
function GetData(url, parm) {
    var obj;
    getAjax(url, parm, function (rs) {
        obj = rs;
    });
    return obj;
}
//整体考试页面保存选项
function GetNoAnswer() {
    var noanwer = '';
    var hisID = $("#HidhisID").val();
    var data = GetData("/ClientPage/PersonalCenter/StuPages/JIZExam.ashx?action=getquesno&historyid=" + hisID);
    if (data != null) {
        var a = data.ds;
        $.each(data.ds, function (index) {
            if (this.QuestionType != 4) {
                var mychoose = $('input[name="rd' + this.QuestionID + '"]:checked');                
                if (mychoose.length == 0) {
                    noanwer += this.Num + ",";
                }
            } else {
                var ans = $("#rd" + this.QuestionID).val();
                if (ans=='') {
                    noanwer += this.Num + ",";
                }
            }
        });

    }
    return noanwer;
    
}

function checkanswer(QuestionID, choosetype, choose) {
var mychoose = $('input[name="rd' + QuestionID + '"]:checked'); //获取选中值
    if (choosetype == 2) {//复选
        if ($("#lbl" + choose + QuestionID).attr('class').indexOf('mus') > 0) {//若原来是选中模式
            $("#lbl" + choose + QuestionID).removeClass('mus');//去掉选中样式
        } else {//若原来非选中模式
            $("#lbl" + choose + QuestionID).addClass('mus');//添加选中模式
        }
    } else if (choosetype == 4) {        //主观题
        if ($("#rd"+QuestionID).val()=="") {
            $("#num" + QuestionID).removeClass("bg-blue"); //若没有选中项则清除样式
        } else {
            $("#num" + QuestionID).addClass("bg-blue"); //若本题有选中项则添加样式
        }
    }
     else {
         $("#lbl" + choose + QuestionID).addClass('mus').siblings().removeClass('mus'); //单选模式，除了选中那个其他的样式清除
    }
    if (choosetype!=4) {
        if (mychoose.length > 0) {
            $("#num" + QuestionID).addClass("bg-blue"); //若本题有选中项则添加样式
        } else {
            $("#num" + QuestionID).removeClass("bg-blue"); //若没有选中项则清除样式
        }   
    }
    
}

function UpExam(type) {
    var noanwer = GetNoAnswer();   
    if (type == -4) {//检测未做题       
        if (noanwer == '') {
            alert("您已全部作答，检查无误后可以交卷！");
        } else {
            alert("第" + noanwer + "题未完成！");

        }

    } else if (type == -3) {
        alert("做题试卷已到，自动交卷！");
        form1.submit();
        alert("交卷完成")
        this.close();
    } else if (type == -2) {
        alert("做题试卷已到，自动交卷！");
        form1.submit();
        alert("交卷完成")
        this.close();
    } else {
        var msg = '';
        if (noanwer != "") {
            msg = noanwer + "未选择，是否交卷？"

        } else {
            msg = "您是否确定交卷？"
        }
        if (confirm(msg)) {
            form1.submit();
            alert("交卷完成")
            this.close();
        }
    }
   
    }

  