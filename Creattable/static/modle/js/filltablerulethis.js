var pk='';
var BgNum=0;//表格数
var SmNum=0;
var NrNum=0;
var BzNum=0;
var Bz1Num=0;
var tabledatalist=[];
var senddata={};
var canpushdata=1;
var  basemodelid;
$(document).ready(function(){
    var url1=urlnei+"/work_table_rule";
    DataGet(url1,'',function(data) {
        var mag=data.work_model_list;
        ListShow2(mag,"#bmselect3");
    });
});
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
        msg.table_data=eval('('+msg.table_data+')');
        msg.data=eval('('+msg.data+')');
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
    "                    <input  name=\"bz1\" class=\"divstepbz1\">\n" +
    "                </div>";
var template7="<div class=\"divstep\">\n" +
    "    <div  class=\"divstepbg\">\n" +
    "        <table  name=\"{{tablenum}}\" title=\"{{tabletitle}}\" class=\"layui-table\">\n" +
    "            {{tablehtml}}\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>";

function BtnSave() {
         canpushdata=1;
        var userdata=GetUserData();
        var bzlist=[];
        var nrlist=[];
    $('input[name="bz1"]').each(function () {
        bzlist.push($(this).val());
    });
    $('textarea[name="nr"]').each(function () {
        nrlist.push($(this).val());
    });
    bzlist=ToString(bzlist);
    nrlist=ToString(nrlist);
        senddata={
            data:userdata,
            base_model:basemodelid,
            other_data:nrlist,
            remarks:bzlist
        };
    if(canpushdata){
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.confirm('确认保存此报告？', {
                btn: ['确认','取消'] //按钮
            }, function(){
                var url=urlnei+"/newtable_end";
                DataPost(url,senddata,function(data){
                    if(data.msg="请求成功!"){
                        layer.msg('报告已保存！');
                    }
                });
                layer.msg('报告已保存！');
            }, function(){

            });
        });
    }else{
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.alert("数据有误，请修改后再提交！")
        });
    }
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
    var taskid=$("#bmselect3").val();
    if(taskid){
        pk=taskid;
    }else {
        layui.use('layer', function() {
            var layer = layui.layer;
            layer.msg("请先选择要填写的报告！")
        })
    }
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
    ShowTdDate();
    basemodelid=taskid;
}
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


function ListShow2(data,id){
    var len=data.length;
    $(id).append("<option></option>");
    for(var i=0;i<len;i++){
        $(id).append("<option value="+data[i].id+">"+data[i].model_name+"</option>");
    }
}
function GetUserData() {
    var alldata=[];
    var numberlist=[];
    var datelist=[];
    var textlist=[];
    var selectlist=[];
    var checkboxlist=[];
    $("#newtable td").find("input[type='number']").each(function(){
        var canusethis=1;
        var thisdata=$(this).val();
        $(this).css("background", "#ffffff");
        var max=$(this).attr("max");
        if(max){
            if(parseFloat(thisdata)>parseFloat(max)){
                $(this).css("background", "red");
                alert("数值超过最大限制！");
                canusethis=0;
                canpushdata=0;
            }
        }
        var min=$(this).attr("min");
        if(min){
            if(parseFloat(thisdata)<parseFloat(min)){
                $(this).css("background", "red");
                alert("数值超过最小限制！");
                canusethis=0;
                canpushdata=0;
            }
        }
        if(canusethis){
            numberlist.push(thisdata);
        }else {
            numberlist.push('');
        }
    });
    $("#newtable td").find("input[type='datetimethis']").each(function(){
        var thisdata=$(this).val();
        datelist.push(thisdata);
    });
    $("#newtable td").find("input[type='text']").each(function(){
        var thisdata=$(this).val();
        textlist.push(thisdata);
    });
    $("#newtable td").find("select").each(function(){
        var thisdata=$(this).val();
        selectlist.push(thisdata);
    });
    $("#newtable td").find("input[type='checkbox']").each(function(){
        if ($(this).attr('checked')) {
            checkboxlist.push("1");
        }else {
            checkboxlist.push("0");
        }
    });
    alldata.push(numberlist);
    alldata.push(datelist);
    alldata.push(textlist);
    alldata.push(selectlist);
    alldata.push(checkboxlist);
    alldata=getString(alldata);
    return alldata;
}
function getString( objarr ){
    var tree = "[";
    for (var i=0;i<objarr.length;i++){
        tree+="[";
        for(var j=0;j<objarr[i].length;j++){
            if(objarr[i][j]===null){
                objarr[i][j]="";
            }
            tree+="'"+objarr[i][j]+"'";
            if(j<objarr[i].length-1){
                tree+=","
            }
        }
        tree+="]";
        if(i<objarr.length-1){
            tree+=","
        }
    }
    tree+="]";
    return tree;
}
function ToString(objarr) {
    var tree = "[";
    for (var i=0;i<objarr.length;i++){
        tree+="'"+objarr[i]+"',"
    }
    tree+="]";
    return tree;
}