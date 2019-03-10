var number=1;
$(document).ready(function () {
    $.cookie('bmid', "", {expires: -1, path: '/'});
    var url = urlnei + "/work_table?limit=10";
    var pagecount;
    DataGet(url, '', function (data) {
        //console.log(data);
        pagecount = data.count;
        var msg = data.work_model_all;
        var temp = TableShow(msg);
        document.getElementById("showbm").innerHTML = temp;
    });
    layui.use(['laypage', 'layer'], function () {
        var laypage = layui.laypage;
        laypage.render({
            elem: 'demo3',
            count: pagecount,
            first: '首页',
            last: '尾页',
            prev: '上一页',
            next: '下一页',
            jump: function(obj, first){ //触发分页后的回调
                var offset=(obj.curr-1)*10;
                number=offset+1;
                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
                    document.getElementById("showbm").innerHTML ='';//先清空原先内容
                    var url = urlnei + "/work_table?limit=10&offset="+offset;
                    DataGet(url, '', function (data) {
                        pagecount = data.count;
                        var msg = data.work_model_all;
                        var temp = TableShow(msg);
                        document.getElementById("showbm").innerHTML = temp;
                    });
                }
            }
        });
    });
});

function TableEdit(obj) {
    var bmid=obj.name;
    $.cookie('bmid', bmid, {expires: -1, path: '/'});
    $.cookie('bmid', bmid, {expires: 1, path: '/'});
    window.location.href='edittetable.html';
}
function TableInfo(obj) {
    var bmid=obj.name;
    $.cookie('bmid', bmid, {expires: -1, path: '/'});
    $.cookie('bmid', bmid, {expires: 1, path: '/'});
    window.location.href='infotable.html';
}
function TableShow(data) {
    var temp = "";
    for (var i = 0; i < data.length; i++) {
        temp += template.replace(/{{i}}/g, number+i).replace(/{{name}}/g, data[i].model_name).replace(/{{id}}/g, data[i].id)
           .replace(/{{created_time}}/g, data[i].created_time.replace(/T/g, " "));
    }
    return (temp);
}

var template = '<tr>\n' +
    '                <td>{{i}}</td>\n' +
    '                <td><a onclick="TableInfo(this);" class="btn-link btnuse" name="{{id}}">{{name}}</a></td>\n' +
    '                <td>{{created_time}}</td>\n' +
    '                <td>\n' +
    '                    <a onclick="TableEdit(this);" class="btn-link btnuse"  name="{{id}}">\n' +
    '                         编辑\n' +
    '                    </a>\n' +
    '                </td>\n' +
    '            </tr>';
function newtable() {
    window.location.href='createtable.html';
}
