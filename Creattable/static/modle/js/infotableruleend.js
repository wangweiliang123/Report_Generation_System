var pk=$.cookie('bmid');
var BgNum=0;//表格数
var SmNum=0;
var NrNum=0;
var BzNum=0;
var Bz1Num=0;
var senddata={};
var tablelist1;
var tablelist=[];
var tabledatalist=[];
var userinterdata;
$(document).ready(function(){
    ShowTable();
    GetTableList();
});
function GetTableList(){
    var url = urlnei + "/work_table_end?limit=10000";
    var pagecount;
    DataGet(url, '', function (data) {
        var msg=data.task_work_list;
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
        urlthis=urlnei + "/info_table_end?pk="+pk;
    }
    DataGet(urlthis,'',function(data) {
        var msg=data.task_work_detail;
        msg.step_data=eval('('+msg.step_data+')');
        msg.explain=eval('('+msg.explain+')');
        msg.other_data=eval('('+msg.other_data+')');
        msg.remarks=eval('('+msg.remarks+')');
        msg.table_data=eval('('+msg.table_data+')');
        msg.data=eval('('+msg.data+')');
        tabledatalist=msg.table_data;
        userinterdata=msg.data;
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
                var temp=template7.replace(/{{tablenum}}/g, BgNum).replace(/{{tabletitle}}/g, "控件表格，请按照规则填写！").replace(/{{tablehtml}}/g,tablerulehtml[BgNum]);
                $("#newtable").append(temp);
                BgNum++;
            }
        }
        ShowUserData();
    });
    $("#newtable").find("input").each(function(){
        $(this).attr("disabled","disabled");
        $(this).css("background-color","#ffffff");
        $(this).attr("title","");
    });
    $("#newtable").find("textarea").each(function(){
        $(this).attr("disabled","disabled");
        $(this).css("background-color","#ffffff");
    });
    $("#newtable").find("select").each(function(){
        $(this).attr("disabled","disabled");
    });
    $("#newtable").find("input[name='bz1']").each(function(){
        $(this).css("background-color","");
    });
    $("#newtable").find("table").each(function(){
        $(this).attr("title","");
    });
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
var template7="<div class=\"divstep\">\n" +
    "    <div  class=\"divstepbg\">\n" +
    "        <table  name=\"{{tablenum}}\" title=\"{{tabletitle}}\" class=\"layui-table\">\n" +
    "            {{tablehtml}}\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>";
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
function ShowUserData() {
    var numbernum=0;
    var datenum=0;
    var textnum=0;
    var selectnum=0;
    var checkboxnum=0;
    $("#newtable td").find("input[type='number']").each(function(){
        $(this).val(userinterdata[0][numbernum]);
        numbernum++;
    });
    $("#newtable td").find("input[type='datetimethis']").each(function(){
        $(this).val(userinterdata[1][datenum]);
        datenum++;
    });
    $("#newtable td").find("input[type='text']").each(function(){
        $(this).val(userinterdata[2][textnum]);
        textnum++;
    });
    $("#newtable td").find("select").each(function(){
        $(this).val(userinterdata[3][selectnum]);
        selectnum++;
    });
    $("#newtable td").find("input[type='checkbox']").each(function(){
        if(userinterdata[4][checkboxnum]==1){
            $(this).attr("checked","checked")
        }
        checkboxnum++;
    });
}
