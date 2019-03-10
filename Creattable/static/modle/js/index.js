var uname=$.cookie('uname');
var token=$.cookie('token');
var uid=$.cookie('uid');

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
            alert(err.responseText);
        }
    });
}
$(document).ready(function(){
    if(!token){
        window.location.href='login.html';
    }
    if(uname){
        $("#unamespan").html("").html("&nbsp"+uname+"&nbsp");
    }
    $("#thisnavbar li").on("click",function () {
        $("#thisnavbar li").attr("class","");
        $(this).attr("class","active")
    })
});








