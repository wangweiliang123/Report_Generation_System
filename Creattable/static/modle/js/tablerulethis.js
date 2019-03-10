var pk=$.cookie('bmid');
var BgNum=0;//表格数
var SmNum=0;
var NrNum=0;
var BzNum=0;
var Bz1Num=0;
var tabledatalist=[];
var senddata={};
var tabletemid;
$(document).ready(function(){
    ShowTable();
    ShowTdDate()
});
function ShowTdDate() {
    $("#newtable td").find("input[type='datetimethis']").each(function(){
        var thisid="#"+this.id;
        layui.use(['laydate','form'],function() {
            var laydate = layui.laydate;
            var form = layui.form;
            laydate.render({
                elem: thisid,
                type: 'datetime'
            });
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
        msg.other_data=eval('('+msg.other_data+')');
        msg.remarks=eval('('+msg.remarks+')');
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
                temp=template7.replace(/{{tablenum}}/g, BgNum).replace(/{{tabletitle}}/g, "控件表格，请按照规则填写！").replace(/{{tablehtml}}/g,tablerulehtml[BgNum]);
                $("#newtable").append(temp);
                BgNum++;
            }
        }
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
