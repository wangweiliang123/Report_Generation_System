var pk=$.cookie('bmid');
var BgNum=0;//表格数
var SmNum=0;
var NrNum=0;
var BzNum=0;
var Bz1Num=0;
var tableobject=[];
var issub=0;
var senddata={};
var tablelist1;
var tablelist=[];
$(document).ready(function(){
    layui.use(['layer' , 'laydate'], function() {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#test'
        });
    });
    GetData();
    $("#newtable").find("table").each(function(){
        $(this).width(1014);
    });
    GetTableList();
});
function GetData() {
    var url=urlnei+"/handsontable/api/work_table/"+pk+"/";
    DataGet(url,'',function(data) {
        var msg=data.work_step_list;
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
                var temp=template5.replace(/{{i}}/g, BgNum);
                $("#newtable").append(temp);
                var datam =msg.table_data[BgNum+1];
                var hotsetting = {
                    data: datam,//表格数据
                    autoColumnSize: true,//自适应列大小
                    contextMenu: true,//右键操作
                    mergeCells: msg.merge_cells[BgNum+1]
                };
                var thishot="hot"+BgNum;
                var thishot1="hot"+BgNum+"g";
                var container1 = document.getElementById(thishot);
                thishot1=new Handsontable(container1, hotsetting);
                tableobject.push(thishot1);
                thishot1.updateSettings({
                    contextMenu: {
                        items: {
                            "row_below": {name: '向下插入一行'},
                            "undo": {name: '撤销'},
                            "redo": {name: '返回'},
                            "copy": {name: '复制'},
                            "cut": {name: '剪切'},
                            "alignment": {name: '对齐'}
                        }
                    }
                });
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
var template5="  <div class=\"divstep\">\n" +
    "                    <div id=\"hot{{i}}\" class=\"divstepbg\">\n" +
    "                        <!--加载表格-->\n" +
    "                    </div>\n" +
    "                </div>";

function BtnSave() {
    var bz1list=[];
    var nrlist=[];
    var bglist1=["[['安抚','啊师傅'],['暗示法','阿斯弗']]"];
    var isqy=$("#divcheck input[type='radio']:checked").val();
    $('input[name="bz1"]').each(function () {
        bz1list.push($(this).val());
    });
    $('textarea[name="nr"]').each(function () {
        nrlist.push($(this).val());
    });
    for(var i=0;i<BgNum;i++){
        var thisdata;
        var divid;
        divid="hot"+i;
        if(tableobject[i]!=0){
            thisdata=GetbgData(tableobject[i]);
            bglist1.push(thisdata);
        }
    }
    bz1list=ToString(bz1list);
    nrlist=ToString(nrlist);
    senddata={
        table_data:bglist1.toString(),
        other_data:nrlist,
        remarks:bz1list,
        is_valid:isqy
    };
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.confirm('确认保存此报告？', {
            btn: ['确认','取消'] //按钮
        }, function(){
            var url=urlnei+"/handsontable/api/work_table/"+pk+"/";
            DataPut(url,senddata,function(data){
                if(data.msg="请求成功!"){
                    layer.msg('报告已保存！');
                }
            });
        }, function(){

        });
    });
}
function BtnSave1() {
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.confirm('确认提交此报告？', {
            btn: ['确认','取消'] //按钮
        }, function(){
            $("#btn1").click();
            issub=1;
            var url=urlnei+"/handsontable/api/work_table/"+pk+"/";
            DataPut(url,senddata,function(data){
                if(data.msg="请求成功!"){
                    layer.msg('报告已保存！');
                }
            });
        }, function(){

        });
    });
}
function GetbgData(object) {
    var tdata=new Array();
    for (var i=0;i<object.countRows();i++){
        tdata[i]=new Array();
        tdata[i]=object.getDataAtRow(i);
    }
    tdata=getString(tdata);
    return tdata;
}
function ToString(objarr) {
    var tree = "[";
    for (var i=0;i<objarr.length;i++){
        tree+="'"+objarr[i]+"',"
    }
    tree+="]";
    return tree;
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
function PrintContain() {
    $("#printarea").jqprint({
        debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
        importCSS: true, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
        printContainer: true, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
        operaSupport: true//表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true
    });
}
function GetTableList(){
    var url = urlnei + "/handsontable/api/work_table/";
    var pagecount;
    DataGet(url, '', function (data) {
        var msg=data.work_model_all;
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
                        name: '全部模板'
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
                        GetData();
                    }
                    $("#newtable").find("table").each(function(){
                        $(this).width(1014);
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
                                    name: '全部模板'
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
                                    GetData();
                                }
                                $("#newtable").find("table").each(function(){
                                    $(this).width(1014);
                                });
                            }
                        });
                    });
                }
            }
        });
    });
}