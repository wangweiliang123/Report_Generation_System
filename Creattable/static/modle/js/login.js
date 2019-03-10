$(document).ready(function(){
    $.cookie("token",'',{expires:-1,path:'/'});
    $.cookie("uname",'',{expires:-1,path:'/'});
    $.cookie('uid', "", {expires: -1, path: '/'});
    $("#login_button").click(function(){
        var username1=$("#username").val();
        if(!username1){
            alert("用户名不能为空！");
            return false;
        }
        var password1=$("#password").val();
        if(!password1){
            alert("密码不能为空！");
            return false;
        }
        //console.log(username1);
        $.ajax({
            url: urlnei+"/login",
            type: "POST",
            async:false,
            dataType: 'json',
            contentType:'application/json;charset=UTF-8',
            data:JSON.stringify({
                username: username1,
                password: password1
            }),
            success: function (data) {
                //console.log(data);
                if(data) {
                    if (data.code == 200) {
                        var token = data.token;
                        var uname=data.uname;
                        var uid=data.uid;
                        $.cookie("token",'',{expires:-1,path:'/'});
                        $.cookie("uname",'',{expires:-1,path:'/'});
                        $.cookie("uid",'',{expires:-1,path:'/'});
                        $.cookie('token', token, {expires: 7, path: '/'});
                        $.cookie('uname', uname, {expires: 7, path: '/'});
                        $.cookie('uid', uid, {expires: 7, path: '/'});
                        window.location.href='index.html';
                    }
                }
            },
            error: function (err) {
                $.cookie("token",'',{expires:-1,path:'/'});
                $.cookie("uname",'',{expires:-1,path:'/'});
                $.cookie("uid",'',{expires:-1,path:'/'});
                $.cookie('token',null);
                $.cookie('uname',null);
                $.cookie('uid',null);
                $.cookie("token",'',{expires:-1,path:'/'});
                $.cookie("uname",'',{expires:-1,path:'/'});
                $.cookie("uid",'',{expires:-1,path:'/'});
                alert("登陆失败！");
            }
        })
    });
});