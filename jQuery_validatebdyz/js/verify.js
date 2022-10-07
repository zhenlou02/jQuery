(function(){
    var VERY = {map:{}};
    VERY.config={
        cht:2,
        msgSec:'<br>',
        errorCallback:function(msg){
            alert(msg);
        }
    };
    VERY.extend = function(options){
        if(options){
            for(var k in options){
                VERY.config[k] = options[k];
            }
        }
    };
    function countLength(a){
        var chinise = a.replace(/[^\u4E00-\u9FA5]/g,'');//获取中文部分
        return chinise.length * VERY.config.cht + a.length - chinise.length;
    }
    var defaultVerify = {
        //验证非空
        'required':function(a){
            return StringUtil.isNotEmpty(a);
        },
        //验证整型
        'integer':function(a){
            return !(defaultVerify['required'])(a) || new RegExp("^\\d+$").test(a);
        },
        //任意数值
        'number':function(a){
            return !(defaultVerify['required'])(a) || new RegExp("^[-+]?\\d+([\\.]\\d+)?$").test(a);
        },
        //邮件
        'email':function(a){
            return !(defaultVerify['required'])(a) || new RegExp("^\\w+([-\\.]\\w+)*@\\w+([-\\.]\\w+)*\\.\\w+([-\\.]\\w+)*$").test(a);
        },
        //手机号
        'phone':function(a){
            return !(defaultVerify['required'])(a) || new RegExp("(^1[34578]\\d{9}$)|(^09\\d{8}$)").test(a);
        },
        //字母
        'letter':function(a){
            return !(defaultVerify['required'])(a) || new RegExp("^[A-Za-z]+$").test(a);
        },
        //字母或下划线开头的英文字符
        'letter_number':function(a){
            return !(defaultVerify['required'])(a) || new RegExp("^[A-Za-z_0-9]+[\\w]?$").test(a);
        },
        //英文字符
        'english':function(a){
            return !(defaultVerify['required'])(a) || new RegExp("^\\w+$").test(a);
        },
    };
    var exitErrorMode = function(){
        $(this).removeClass("drea-verify-error");
    };
    var inLabel = function(o,vs){
        for (let vsKey in vs) {
            if($(o).is(vsKey)){
                return true;
            }
        }
        return false;
    };
    VERY.init = function(formId){
        var virifyFunc = function(e){
            var dm = VERY.verifyOne(formId,this);
            if(dm.status !== true){
                $(this).addClass("drea-verify-error");
            }
        };

        $(formId).children().find("[drea-verify]").bind("blur",virifyFunc).bind("change",virifyFunc).bind("input",virifyFunc).bind("mousemove",function (e) {
            $(this).trigger("drea-verify-event",[e]);
        }).bind("mouseout",function (e) {
            $(formId+"_div").hide();
        })/*.bind("focus",function (e) {
            $(formId+"_div").hide();
        }).bind("input",function (e) {
            $(formId+"_div").hide();
        })*/;
        var id = formId;
        if(StringUtil.startWidth(id,"#")){
            id = formId.substring(1);
        }
        $("body").append("<div class='drea-verify-error-div' id='"+id+"_div'></div>");
    };

    VERY.verify = function(formId,excludes){
        var $select = $(formId).children().find("[drea-verify]");
        var tips = [];
        var res = true;
        for(var i=0;i<$select.length;i++){
            var obj = $select[i];
            var id = StringUtil.safeToString($(obj).attr("id"),$(obj).attr("name"));
            if(StringUtil.isNotEmpty(id) && excludes != undefined){
                var ifIn = false;
                for (let x in excludes) {
                    if(excludes[x] === id){
                        ifIn = true;
                        break;
                    }
                }
                if(ifIn){
                    continue;
                }
            }
            var dm = VERY.verifyOne(formId,obj);

            if(dm.status !== true){
                res = false;
                if(!ArrayUtil.contain(tips,dm.msg)){
                    tips.push(dm.msg);
                }
            }
        }
        if(tips.length > 0){
            if($.isFunction(VERY.config.errorCallback)){
                VERY.config.errorCallback(ArrayUtil.join(tips,VERY.config.msgSec));
            }

        }
        return res;
        /*each(function(i,obj){

        });*/
    };
    VERY.doVerify = function(formId,verify,value){
        var status = true;
        var func ;
        var def = "";
        if(StringUtil.startWidth(verify,'length[')){
            func = function(){
                var maxLenArr = verify.substring(7,verify.length-1).split("-");
                var min = maxLenArr[0];
                var max = maxLenArr[0];
                if(maxLenArr.length == 2){
                    max = maxLenArr[1];
                }
                var len = countLength(value);
                if(min != '' && len < min || max !='' && len > max){
                    return (min == max) ? '长度必须为'+min:'长度必须介于'+min+'-'+max+'之间';
                }
                return true;
            }
        }else if($.isFunction(defaultVerify[verify])){
            func = defaultVerify[verify];
        }else {
            if(VERY.map[formId]){
                func = VERY.map[formId][verify];
            }
        }
        if($.isFunction(func)){
            try{
                status = func(value);

                if(status === false){
                    def = false;
                }else if(status !== true){
                    def = status;
                    status = false;
                }

            }catch (e) {
                console.log(e);
            }
        }
        return {def:def,status:status};
    };
    VERY.verifyOne = function(formId,obj){
        var status = true;
        var verify = $(obj).attr('drea-verify');
        var tip = $(obj).attr('drea-tip');
        var value = $(obj).trim_val();
        if(StringUtil.isEmpty(verify)){
            verify = 'required';
        }
        var arr = verify.split(",");
        var defArr = [];
        for (let v in arr) {
            var res = VERY.doVerify(formId,arr[v],value,tip);
            if(!res.status){
                status = res.status;
            }
            if(res.def != "" && res.def !== false){
                defArr.push(res.def);
            }

        }
        var hz = ArrayUtil.join(defArr,VERY.config.msgSec);
        var def = StringUtil.isEmpty(tip) ? StringUtil.safeToString(hz,'验证不通过') : tip ;
        if(status !== true){
            //console.log(defArr)
            //console.log(def);
            $(obj).addClass("drea-verify-error").bind("drea-verify-event",function(e1,e){
                //$("#form_"+formId+"_div").show().css();
                var x = e.offsetX + $(obj).offset().left + 15;
                var y = e.offsetY + $(obj).offset().top - 20 - $(window).scrollTop();;
                //console.log(e.offsetX,e.offsetY,$(obj).offset().left,$(obj).offset().top,x,y);
                $(formId+"_div").text(def).css({left:x,top:y}).show();
            });


            //$(obj).focus();
            //$(obj).bind("input",exitErrorMode);
            //$(obj).bind("focus",exitErrorMode);

        }else{
            $(obj).unbind("drea-verify-event").removeClass('drea-verify-error');
            $(formId+"_div").hide();
        }
        return {status:status,msg:def};
    };
    /**
     * 注册自定义验证方法
     */
    VERY.addVerify = function(formId,vrs){
        if(VERY.map[formId] === undefined){
            VERY.map[formId] = {};
        }
        for(var key in vrs){
            VERY.map[formId][key]=vrs[key];
        }
    };
    $(function(){
        $("form[drea-form]").each(function(){
            var id = $(this).attr('id');
            if(StringUtil.isNotEmpty(id)){
                VERY.init("#"+id);
            }
        })
    });
    window.VERY=VERY;
}())


