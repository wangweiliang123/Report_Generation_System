var pk=$.cookie('bmid');
var BgNum=0;//表格数
var SmNum=0;
var NrNum=0;
var BzNum=0;
var Bz1Num=0;
var issub=1;
var senddata={};
var inputdatenum=0;
var tablelist1;
var tablelist=[];
var tabledatalist=[];
var templateinput = " <input type=\"text\" style =\"margin-bottom: 8px\" class=\"layui-input numinput\"><br>";
var templateform = "<form class=\"layui-form\">\n" +
    "    <div class=\"layui-form-item \" style=\"padding-left: 90px\">\n" +
    "        <label class=\"layui-form-label labelthis \">控件范围：</label>\n" +
    "        <div class=\"layui-input-block\" id=\"divcheck\">\n" +
    "            <input type=\"radio\" name=\"rolefw\" value=\"11\" checked style=\"display: inline-block;margin-top: 10px\">\n" +
    "            单一&nbsp&nbsp\n" +
    "            <input type=\"radio\"  name=\"rolefw\" value=\"12\"  style=\"display: inline-block;margin-top: 10px\">\n" +
    "            整行&nbsp&nbsp\n" +
    "            <input type=\"radio\" name=\"rolefw\" value=\"13\" style=\"display: inline-block; margin-top: 10px\"> 整列\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"layui-form-item \" style=\"padding-left: 90px\">\n" +
    "        <label class=\"layui-form-label labelthis \">输入属性：</label>\n" +
    "        <div class=\"layui-input-block\" id=\"divcheck1\">\n" +
    "            <input type=\"radio\" name=\"rolesx\" value=\"21\" checked style=\"display: inline-block;margin-top: 10px\">\n" +
    "            必填&nbsp&nbsp\n" +
    "            <input type=\"radio\"  name=\"rolesx\" value=\"22\"  style=\"display: inline-block;margin-top: 10px\">\n" +
    "            选填&nbsp&nbsp\n" +
    "            <input type=\"radio\" name=\"rolesx\" value=\"23\" style=\"display: inline-block; margin-top: 10px\"> 只读\n" +
    "        </div>\n" +
    "    </div>\n" +
    "        <div id=\"divcheck2\" class=\"layui-form-item \" style=\"padding-left: 90px\">\n" +
    "            <label class=\"layui-form-label labelthis \">控件类型：</label>\n" +
    "            <input type=\"radio\" name=\"readtype1\" value=\"31\" checked style=\"display: inline-block;margin-top: 10px\">\n" +
    "            数字&nbsp&nbsp\n" +
    "            <input type=\"radio\" name=\"readtype1\" value=\"32\"  style=\"display: inline-block;margin-top: 10px\">\n" +
    "            日期&nbsp&nbsp\n" +
    "            <input type=\"radio\" name=\"readtype1\" value=\"33\" style=\"display: inline-block;margin-top: 10px\">\n" +
    "            单选框&nbsp&nbsp\n" +
    "            <input type=\"radio\" name=\"readtype1\" value=\"34\"  style=\"display: inline-block;margin-top: 10px\">\n" +
    "            复选框&nbsp&nbsp\n" +
    "            <input type=\"radio\" name=\"readtype1\" value=\"35\" style=\"display: inline-block; margin-top: 10px\"> 文本\n" +
    "        </div>\n" +
    "    <div class=\"layui-form-item \" style=\"padding-left: 90px\">\n" +
    "        <label class=\"layui-form-label labelthis \">数值范围：</label>\n" +
    "        <div class=\"layui-input-block\">\n" +
    "            <input id=\"bmname\" type=\"number\" class=\"layui-input numinput\" >&nbsp&nbsp—&nbsp&nbsp\n" +
    "            <input id=\"bmname1\" type=\"number\" class=\"layui-input numinput\" >\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"layui-form-item \" style=\"padding-left: 90px\">\n" +
    "        <label class=\"layui-form-label labelthis \">添加选项：</label>\n" +
    "        <div class=\"layui-input-block\" id=\"inputtext\" style=\"margin-left: 180px\">\n" +
    "            <input type=\"text\" class=\"layui-input numinput\" style=\"margin-bottom: 8px\">\n" +
    "            <a class=\"layui-btn layui-btn-xs\" onclick=\"btnadd();\"><i class=\"layui-icon\">+</i></a><br>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"layui-form-item\" style=\"margin-left: 180px\">\n" +
    "        <a onclick=\"btn_confirm();\" class=\"layui-btn layui-btn-sm btn_sum\">确认</a>\n" +
    "        <a href=\"javascript:btn_close();\" class=\"layui-btn layui-btn-sm\" >取消</a>\n" +
    "    </div>\n" +
    "</form>";
var templateinputtype = " <input lay-verify=\"{{required}}\" type=\"{{type}}\" class=\"tableinput\"  title=\"{{title}}\" min=\"{{min}}\" max=\"{{max}}\">";
var templateselect="     <select class=\"tableselect\">\n" +
    "            </select>";
var templateinputdate="<input type=\"datetimethis\" lay-verify=\"{{required}}\" class=\"testthis\" id='testdate{{testdate1}}' title =\"点击选择日期和时间！\" placeholder=\"请选择日期时间\" style=\"padding-left: 10px;border: none;width: 100%\">";
var tempplatefx=" <input type=\"checkbox\" lay-verify=\"{{required}}\" lay-skin=\"primary\" style=\"margin-left: 6px;\">&nbsp{{textname}}";
var thistdid;
var tableruleid;
var rownum;
var colnum;
var tdtext='';
$(document).ready(function(){
    ShowTable();
    GetTableList();
});
function GetTableList(){
    var url = urlnei + "/work_table_rule?limit=10000";
    var pagecount;
    DataGet(url, '', function (data) {
        var msg=data.work_model_list;
        pagecount=data.count;
        for(var i=0;i<msg.length;i++){
            var thislist={};
            thislist.name=msg[i].model_name;
            thislist.id=msg[i].id;
            tablelist.push(thislist);
        }
        tablelist1=tablelist.slice(0,10);
        layui.use(['tree'], function(){
            layui.tree({
                elem: '#demo1', //指定元素
                target: '_blank' ,//是否新选项卡打开（比如节点返回href才有效）
                nodes: [ //节点
                    {
                        name: '全部报告'
                        ,id: ''
                        ,alias: 'changyong',
                        children:tablelist1,
                        spread: true
                    }
                ],
                click: function(node){
                    pk=node.id;
                    BgNum=0;//表格数
                    SmNum=0;
                    NrNum=0;
                    BzNum=0;
                    Bz1Num=0;
                    $('#newtable').html("");
                    if(pk){
                        GetData('');
                    }
                    $("#newtable").find("table").each(function(){
                        $(this).width(1014);
                    });
                    $("#newtable").find("td").each(function(){
                        $(this).attr("height","28px");
                    });
                }
            });
        });
    });
    layui.use(['laypage'], function () {
        var laypage = layui.laypage;
        laypage.render({
            elem: 'demo3',
            count: pagecount,
            layout: ['prev', 'next'],
            jump: function(obj, first){ //触发分页后的回调
                var offset=(obj.curr-1)*10;
                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
                    tablelist1=tablelist.slice(offset,10+offset);
                    $("#demo1").html('');
                    layui.use(['tree'], function(){
                        layui.tree({
                            elem: '#demo1', //指定元素
                            target: '_blank' ,//是否新选项卡打开（比如节点返回href才有效）
                            nodes: [ //节点
                                {
                                    name: '全部报告'
                                    ,id: ""
                                    ,alias: 'changyong',
                                    children:tablelist1,
                                    spread: true
                                }
                            ],
                            click: function(node){
                                pk=node.id;
                                BgNum=0;//表格数
                                SmNum=0;
                                NrNum=0;
                                BzNum=0;
                                Bz1Num=0;
                                // tableobject=[];
                                $('#newtable').html("");
                                if(pk){
                                    GetData('');
                                }
                                $("#newtable").find("table").each(function(){
                                    $(this).width(1014);
                                });
                                $("#newtable").find("td").each(function(){
                                    $(this).attr("height","28px");
                                });
                            }
                        });
                    });
                }
            }
        });
    });
}
function GetData(urlthis) {
    if(!urlthis){
        urlthis=urlnei + "/info_table_rule?pk="+pk;
    }
    DataGet(urlthis,'',function(data) {
        var msg=data.work_step_list;
        msg.step_data=eval('('+msg.step_data+')');
        msg.explain=eval('('+msg.explain+')');
        msg.html_code=eval('('+msg.html_code+')');
        msg.merge_cells=eval('('+msg.merge_cells+')');
        msg.other_data=eval('('+msg.other_data+')');
        msg.remarks=eval('('+msg.remarks+')');
        msg.table_data=eval('('+msg.table_data+')');
        tabledatalist=msg.table_data;
        var tablerulehtml= msg.table_rule.split('!?!');
        $('#inputtittle').text(msg.model_name);
        if(!msg.step_order.length){
            var datathis=msg.step_order;
            msg.step_order=[];
            msg.step_order.push(datathis);
        }
        for(var i=0;i<msg.step_order.length;i++){
            if(msg.step_order[i]==1){
                var temp=template1.replace(/{{bz1info}}/g, msg.step_data[Bz1Num]);
                $("#newtable").append(temp);
                Bz1Num++;
            }
            if(msg.step_order[i]==2){
                var temp=template2.replace(/{{sminfo}}/g, msg.explain[SmNum]);
                $("#newtable").append(temp);
                SmNum++;
            }
            if(msg.step_order[i]==3){
                $("#newtable").append(template3);
                $('textarea[name="nr"]').eq(NrNum).val(msg.other_data[NrNum]);
                NrNum++;
            }
            if(msg.step_order[i]==4){
                $("#newtable").append(template4);
                $('input[name="bz1"]').eq(BzNum).val(msg.remarks[BzNum]);
                BzNum++;
            }
            if(msg.step_order[i]==5){
                var temp=template6.replace(/{{i}}/g, BgNum).replace(/{{tablehtml}}/g,msg.html_code[BgNum]);
                $("#newtable").append(temp);
                temp=template7.replace(/{{tablenum}}/g, BgNum).replace(/{{tabletitle}}/g, "请点击，添加表格控件！").replace(/{{tablehtml}}/g,msg.html_code[BgNum]);
                $("#newtable").append(temp);
                var tabletdid=0;
                $("#newtable").find("table").eq(BgNum*3+1).find("td").each(function(){
                    temp=template8.replace(/{{tabletdid}}/g, tabletdid);
                    tabletdid++;
                    $(this).html("").append(temp).attr("name",BgNum);
                });
                temp=template7.replace(/{{tablenum}}/g, BgNum).replace(/{{tabletitle}}/g, "控件表格，请按照规则填写！").replace(/{{tablehtml}}/g,tablerulehtml[BgNum]);
                $("#newtable").append(temp);
                BgNum++;
            }
        }
    });
    ShowTdDate();
}
var template1=" <div class=\"divstep\">\n" +
    "                    <P class=\"divstepbz\">{{bz1info}}</P>\n" +
    "                </div>";
var template2=" <div class=\"divstep\">\n" +
    "                    <P class=\"divstepsm\">{{sminfo}}</P>\n" +
    "                </div>";
var template3=" <div class=\"divstep\">\n" +
    "                    <textarea class=\"divstepsr\" name=\"nr\" ></textarea>\n" +
    "                </div>";
var template4=" <div class=\"divstep\">\n" +
    "                    <input type=\"text\" name=\"bz1\" class=\"divstepbz1\">\n" +
    "                </div>";

var template6="<div class=\"divstep\">\n" +
    "    <div id=\"hot{{i}}\" class=\"divstepbg\">\n" +
    "        <table title=\"原始模板数据\"  class=\"layui-table\">\n" +
    "            {{tablehtml}}\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>";
var template7="<div class=\"divstep\">\n" +
    "    <div  class=\"divstepbg\">\n" +
    "        <table  name=\"{{tablenum}}\" title=\"{{tabletitle}}\" class=\"layui-table\">\n" +
    "            {{tablehtml}}\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>";
var template8="<a name=\"{{tabletdid}}\" class=\"btntd\" onclick=\"BtnSaveThis(this);\"></a>"
function BtnSave() {
    senddata={
        table_rule:ToString(GetHtmlData()),
        pk:pk
    };
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.confirm('确认保存此报告？', {
            btn: ['确认','取消'] //按钮
        }, function(){
            var url=urlnei+"/edit_table_rule";
            DataPost(url,senddata,function(data){
                if(data.msg="请求成功!"){
                    layer.msg('报告已保存！');
                }
            });
        }, function(){

        });
    });
}

function PrintContain() {
    $("#printarea").jqprint({
        debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
        importCSS: true, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
        printContainer: true, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
        operaSupport: true//表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true
    });
}

function ShowTable() {
    if(pk){
        $("#showtable").show();
        layui.use(['laydate'], function() {
            var laydate = layui.laydate;
            laydate.render({
                elem: '#test'
            });
        });
        BgNum=0;//表格数
        SmNum=0;
        NrNum=0;
        BzNum=0;
        Bz1Num=0;
        $("#newtable").html('');
        GetData('');
        $("#newtable").find("table").each(function(){
            $(this).width(1014);
        });
        $("#newtable").find("td").each(function(){
            $(this).attr("height","28px");
        });
    }
}
function ShowTdDate() {
        inputdatenum=0;
        $("#newtable td").find("input[type='datetimethis']").each(function(){
            var thisdateid="testthis"+inputdatenum;
            $(this).attr("id",thisdateid).html('');
            var thisid="#"+thisdateid;
            layui.use(['laydate','form'],function() {
                var laydate = layui.laydate;
                var form = layui.form;
                laydate.render({
                    elem: thisid,
                    type: 'datetime'
                });
            });
            inputdatenum++;
        });
}
function BtnSaveThis(obj) {
    thistdid=parseInt($(obj).attr("name"));
    tableruleid=parseInt($(obj).parent("td").attr("name"));
    rownum=tabledatalist[tableruleid+1].length;
    colnum=tabledatalist[tableruleid+1][0].length;
    var a=parseInt(thistdid/colnum);
    var b=parseInt(thistdid%colnum);
    tdtext=tabledatalist[tableruleid+1][a][b];
    layui.use(['layer', 'form'], function () {
        var layer = layui.layer;
        var form = layui.form;
        layer.open({
            type: 1,
            skin: 'layui-layer-rim', //加上边框
            title: '请选择配置信息',
            area: ['740px', '400px'], //宽高
            content: templateform
        });
    });
}

function btnadd() {
    $("#inputtext").append(templateinput);
}

function btn_confirm() {
    var thisidlist=[];
    if ($("#divcheck1 input[type='radio']:checked").val() == 21) {
        templateinputtype=templateinputtype.replace(/{{required}}/g, "required");
        templateinputdate=templateinputdate.replace(/{{required}}/g, "required");
        tempplatefx=tempplatefx.replace(/{{required}}/g, "required");
        templateselect= templateselect.replace(/{{required}}/g, "required");
    }else {
        templateinputtype=templateinputtype.replace(/{{required}}/g, "");
        templateinputdate=templateinputdate.replace(/{{required}}/g, "");
        tempplatefx=tempplatefx.replace(/{{required}}/g, "");
        templateselect=templateselect.replace(/{{required}}/g, "");
    }
    if($("#divcheck input[type='radio']:checked").val() == 11){
        thisidlist=GetRolNum(thistdid ,rownum,colnum,0)
    }
    if($("#divcheck input[type='radio']:checked").val() == 12){
        thisidlist=GetRolNum(thistdid ,rownum,colnum,1)
    }
    if($("#divcheck input[type='radio']:checked").val() == 13){
        thisidlist=GetRolNum(thistdid ,rownum,colnum,2)
    }
    if ($("#divcheck2 input[type='radio']:checked").val() == 31) {
        var min=$("#bmname").val();
        var max=$("#bmname1").val();
        var tittletext="请输入有效的数字！最小："+min+"&nbsp&nbsp最大："+max;
        var temp=templateinputtype.replace(/{{type}}/g, "number").replace(/{{min}}/g, min).replace(/{{max}}/g,max ).replace(/{{title}}/g, tittletext);
        for(var i=0;i<thisidlist.length;i++){
            $("#newtable").find("table").eq(tableruleid*3+2).find("td").eq(thisidlist[i]).html("").append(temp);
        }
        layer.closeAll();
    }
    if ($("#divcheck2 input[type='radio']:checked").val() == 32) {
        for(var i=0;i<thisidlist.length;i++){
            var temp=templateinputdate.replace(/{{testdate1}}/g, inputdatenum);
            $("#newtable").find("table").eq(tableruleid*3+2).find("td").eq(thisidlist[i]).html("").append(temp);
            var inputthisid="#testdate"+inputdatenum;
            layui.use(['laydate','form'],function() {
                var laydate = layui.laydate;
                var form = layui.form;
                laydate.render({
                    elem: inputthisid,
                    type: 'datetime'
                });
            });
            inputdatenum++
        }
        layer.closeAll();
    }
    if ($("#divcheck2 input[type='radio']:checked").val() == 33) {
        var temp=templateselect;
        var tempoption="<option style='padding: 2px 6px 2px 6px'>{{option}}</option>";
        for(var i=0;i<thisidlist.length;i++){
            $("#newtable").find("table").eq(tableruleid*3+2).find("td").eq(thisidlist[i]).html("").append(temp);
            $("#inputtext").find("input").each(function () {
                var thistemp=tempoption.replace(/{{option}}/g,$(this).val() );
                $("#newtable").find("table").eq(tableruleid*3+2).find("td").eq(thisidlist[i]).find("select").append(thistemp);
            });
        }
        layer.closeAll();
    }
    if ($("#divcheck2 input[type='radio']:checked").val() == 34) {
        for(var i=0;i<thisidlist.length;i++){
            $("#newtable").find("table").eq(tableruleid*3+2).find("td").eq(thisidlist[i]).html('');
            $("#inputtext").find("input").each(function () {
                var thistemp=tempplatefx.replace(/{{textname}}/g,$(this).val());
                $("#newtable").find("table").eq(tableruleid*3+2).find("td").eq(thisidlist[i]).append(thistemp);
            });
        }
        layer.closeAll();
    }
    if ($("#divcheck2 input[type='radio']:checked").val() == 35) {
        var temp=templateinputtype.replace(/{{type}}/g, "text").replace(/{{min}}/g, "").replace(/{{max}}/g,"" ).replace(/{{title}}/g, "请输入相关内容！");
        for(var i=0;i<thisidlist.length;i++){
            $("#newtable").find("table").eq(tableruleid*3+2).find("td").eq(thisidlist[i]).html("").append(temp);
        }
        layer.closeAll();
    }
    if ($("#divcheck1 input[type='radio']:checked").val() == 23) {
        for(var i=0;i<thisidlist.length;i++){
            tdtext=$("#newtable").find("table").eq(tableruleid * 3).find("td").eq(thisidlist[i]).text();
            $("#newtable").find("table").eq(tableruleid*3+2).find("td").eq(thisidlist[i]).text(tdtext);
        }
        layer.closeAll();
    }
    if ($("#divcheck1 input[type='radio']:checked").val() == 22) {
        if ($("#divcheck2 input[type='radio']:checked").val() == 35) {
            var temp = templateinputtype.replace(/{{type}}/g, "text").replace(/{{min}}/g, "").replace(/{{max}}/g, "").replace(/{{title}}/g, "选填内容，可自由编辑！");
            for (var i = 0; i < thisidlist.length; i++) {
                tdtext=$("#newtable").find("table").eq(tableruleid * 3).find("td").eq(thisidlist[i]).text();
                $("#newtable").find("table").eq(tableruleid * 3 + 2).find("td").eq(thisidlist[i]).html("").append(temp);
                $("#newtable").find("table").eq(tableruleid * 3 + 2).find("td").eq(thisidlist[i]).find("input").val(tdtext)
            }
            layer.closeAll();
        }
    }
}

function btn_close() {
    layui.use('layer', function () { //独立版的layer无需执行这一句
        var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
        layer.closeAll();
    })
}

function GetRolNum(thisid ,row,col,rettype) {
    if(rettype==0){
        var b=[];
        b.push(thisid);
        return b;
    }
    if(rettype==1){
        var a=parseInt(thisid/col);
        var b=[];
        for(var i=0;i<col;i++){
            b.push(a*col+i)
        }
        return b;
    }
    if(rettype==2){
        var a=parseInt(thisid%col);
        var b=[];
        for(var i=0;i<row;i++){
            b.push(i*col+a)
        }
        return b;
    }
}
function GetHtmlData() {
    var htmllist=[];
    $.each($("#newtable table"),function(i,item){
        var k=i+1;
        if(k%3==0){
            htmllist.push($(item).html());
        }
    });
    return htmllist;
}

function ToString(objarr) {
    var tree='';
    for (var i=0;i<objarr.length;i++){
        tree+=objarr[i]+"!?!";
    }
    return tree;
}