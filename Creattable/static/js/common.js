var token=$.cookie('token');
var canuse=true;
// jQuery(function($){
//     var url=urlnei+"/users/api/menu/";
//     DataGet(url,'',function(data) {
//         var msg=data.menu_code_list;
//         for(var i=0;i<msg.length;i++){
//             if(msg[i]==thistabid){
//                 canuse=true;
//             }
//         }
//     });
//     if(!canuse){
//         $("body").html("");
//         layui.use('layer', function() { //独立版的layer无需执行这一句
//             layer.msg('您暂时无权使用此功能，请联系系统管理员！');
//         });
//         setTimeout(function () {
//             window.location.href='../../../index.html';
//         },2000);
//     }
// });
$(document).ready(function(){
    if(!token){
        window.location.href='login.html';
        self.close();
    }
});
// get方法获取数据
function DataGet(url,data,sucfunc){
    $.ajax({
        url: url,
        method: "GET",
        timeout: 5000,
        async:false,
        dataType: 'json',
        data:data,
        contentType:'application/json;charset=UTF-8',
        headers: {
            token:token
        },
        success: sucfunc,
        error: function (err) {
            alert("请求失败！");
            // window.location.href='index.html';
        }
    });
}
// post方法获取数据
function DataPost(url,data,sucfunc){
    $.ajax({
        url: url,
        method: "POST",
        timeout: 5000,
        async:false,
        dataType: 'json',
        data:JSON.stringify(data),
        contentType:'application/json;charset=UTF-8',
        headers: {
            token:token
        },
        success: sucfunc,
        error: function (err) {
            alert(err.responseText);
            // window.location.href='index.html';
        }
    });
}
// Put方法获取数据
function DataPut(url,data,sucfunc){
    $.ajax({
        url: url,
        method: "PUT",
        async:false,
        timeout: 5000,
        dataType: 'json',
        data:JSON.stringify(data),
        contentType:'application/json;charset=UTF-8',
        headers: {
            token:token
        },
        success: sucfunc,
        error: function (err) {
            alert(err.responseText);
            // window.location.href='index.html';
        }
    });
}
function GetInputVal(divid){
    var value=$(divid).val(); //获取选中的项
    return(value);
}
function GetSelectVal(divid){
    var options=$(divid).find("option:selected").val();
    return(options);
}

function validform() {
    layui.use('form', function(){
        var form = layui.form;
        form.on('submit(go)', function(data){
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    });
}
layui.use('form', function(){
    var form = layui.form;
    form.on('submit(go)', function(data){
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
});
