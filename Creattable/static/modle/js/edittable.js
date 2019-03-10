var pk=$.cookie('bmid');
var BgNum=0;//表格数
var SmNum=0;
var NrNum=0;
var BzNum=0;
var Bz1Num=0;
var ordernum=0;
var tableobject=[];
var order=[];//步骤为1，说明为2，内容为3，备注为4，表格为5
var template1="   <div class=\"divcontain1\">\n" +
    "                <input type=\"text\"  lay-verify=\"required\" name=\"bz1\"   placeholder=\"请输入步骤\" class=\"inputbz\" style =\"margin-left: -10px;width: 98%\">\n" +
    " <button class=\"layui-btn layui-btn-sm\" onclick=\"BtnRv(this);\" name=\"{{ordnum}}\" style=\"margin-top: 6px;margin-left: 26px;display: block\">删除</button>"+
    "            </div>";
var template2="<div class=\"divcontain1\">\n" +
    "                <input type=\"text\"  lay-verify=\"required\" name=\"sm\"   placeholder=\"请输入说明\" class=\"inputsm\">\n" +
    " <button class=\"layui-btn layui-btn-sm\" onclick=\"BtnRv(this);\" name=\"{{ordnum}}\"  style=\"margin-top: 6px;margin-left: 26px;display: block\">删除</button>"+
    "            </div>";
var template3=" <div  class=\"divcontain1\" >\n" +
    "                <textarea   placeholder=\"请输入内容\" name=\"nr\" class=\"layui-textarea inputnr\"></textarea>\n" +
    " <button class=\"layui-btn layui-btn-sm\" onclick=\"BtnRv(this);\" name=\"{{ordnum}}\"   style=\"margin-top: 6px;margin-left: 26px;display: block\">删除</button>"+
    "            </div>";
var template4=" <div  class=\"divcontain1\" >\n" +
    "                <input type=\"text\"  lay-verify=\"required\" name=\"bz\" placeholder=\"请输入备注\" class=\"inputzs\" style=\"border: none;border-bottom: 1px solid black;background-color:#f0fcff\">\n" +
    " <button class=\"layui-btn layui-btn-sm\" onclick=\"BtnRv(this);\" name=\"{{ordnum}}\"   style=\"margin-top: 6px;margin-left: 26px;display: block\">删除</button>"+
    "            </div>";
var template5="<div class=\"divcontain1\" >\n" +
    "                <div id=\"hot{{i}}\" class=\"divstepbg\" style=\"padding-left: 20px;padding-top: 6px\" >\n" +
    "                </div>\n" +
    " <button class=\"layui-btn layui-btn-sm\" onclick=\"BtnRv(this);\" name=\"{{ordnum}}\"  data-tableid=\"{{i}}\" data-btnname=\"btntb\" style=\"margin-top: 6px;margin-left: 26px;display: block\">删除</button>"+
    "            </div>";
function BtnBz() {
    var temp=template1.replace(/{{ordnum}}/g, ordernum);
    $("#newtable").append(temp);
    order.push(1);
    ordernum++;
}
function BtnSm() {
    var temp=template2.replace(/{{ordnum}}/g, ordernum);
    $("#newtable").append(temp);
    order.push(2);
    ordernum++;
}
function BtnZs() {
    var temp=template4.replace(/{{ordnum}}/g, ordernum);
    $("#newtable").append(temp);
    order.push(4);
    ordernum++;
}
function BtnNs() {
    var temp=template3.replace(/{{ordnum}}/g,ordernum);
    $("#newtable").append(temp);
    order.push(3);
    ordernum++;
}
function BtnSave() {
    var tablehtmllist=[];
    var senddata={};
    var bz1list=[];
    var smlist=[];
    var nrlist=[];
    var bzlist=[];
    var bglist1=["[['安抚','啊师傅'],['暗示法','阿斯弗']]"];
    var bglist2=["[{'row':0,'col':0,'rowspan':2,'colspan':2},{'row':2,'col':3,'rowspan':1,'colspan':3},]"];
    var tabletittle=$("#inputtittle").val();
    var isqy=$("#divcheck input[type='radio']:checked").val();
    $('input[name="bz1"]').each(function () {
        bz1list.push($(this).val());
    });
    $('input[name="sm"]').each(function () {
        smlist.push($(this).val());
    });
    $('input[name="bz"]').each(function () {
        bzlist.push($(this).val());
    });
    $('textarea[name="nr"]').each(function () {
        nrlist.push($(this).val());
    });
    for(var i=0;i<BgNum;i++){
        var thisdata;
        var divid;
        divid="hot"+i;
        if(tableobject[i]!=0){
            thisdata=GethbData(divid);
            bglist2.push(thisdata);
            thisdata=GetbgData(tableobject[i]);
            bglist1.push(thisdata);
        }
    }
    tablehtmllist=GetHtmlData();
    smlist=ToString(smlist);
    bz1list=ToString(bz1list);
    bzlist=ToString(bzlist);
    nrlist=ToString(nrlist);
    tablehtmllist=ToString(tablehtmllist);
    senddata={
        model_name:tabletittle.toString(),
        table_data:bglist1,
        merge_cells:bglist2,
        step_data:bz1list,
        step_order:order.toString(),
        explain:smlist,
        other_data:nrlist,
        remarks:bzlist,
        is_valid:isqy,
        html_code:tablehtmllist,
        pk:pk
    };
    senddata.merge_cells=ToString_1(senddata.merge_cells);
    senddata.table_data=ToString_1(senddata.table_data);
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.confirm('确认保存此模板？', {
            btn: ['确认','取消'] //按钮
        }, function(){
            var url=urlnei+"/edit_table";
            DataPost(url,senddata,function(data){
                //console.log(data);
                if(data.msg="请求成功!"){
                    layer.msg('模板已保存！');
                }
            });
        }, function(){

        });
    });
}
function BtnBg() {
    var temp=template5.replace(/{{i}}/g, BgNum).replace(/{{ordnum}}/g, ordernum);
    $("#newtable").append(temp);
    var datam = [['',  '', '',  '', '', ''], ['',  '',  '', '', '', ''], ['',  '', '',  '', '', ''], ['', '', '', '', '', '']];
    var hotsetting = {
        data: datam,//表格数据
        autoColumnSize: true,//自适应列大小
        contextMenu: true,//右键操作
        mergeCells: true,//允许合并
    };
    var thishot="hot"+BgNum;
    var thishot1="hot"+BgNum+"g";
    var container1 = document.getElementById(thishot);
     thishot1=new Handsontable(container1, hotsetting);
     tableobject.push(thishot1);
    thishot1.updateSettings({
        contextMenu: {
            items: {
                "row_above": {name: '向上插入一行'},
                "row_below": {name: '向下插入一行'},
                "col_left": {name: '向左插入一列'},
                "col_right": {name: '向右插入一列'},
                "remove_row": {name: '删除行'},
                "remove_col": {name: '删除列'},
                "undo": {name: '撤销'},
                "redo": {name: '返回'},
                "copy": {name: '复制'},
                "cut": {name: '剪切'},
                "alignment": {name: '对齐'},
                "mergeCells": {name: '合并'}
            }
        }
    });
    order.push(5);
    ordernum++;
    BgNum++;
}
function BtnRv(that) {
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.confirm('确认删除此项？', {
            btn: ['确认','取消'] //按钮
        }, function(){
            if(that.dataset.btnname=="btntb"){
                ArrDel(tableobject,Number(that.dataset.tableid));
            }
            $(that).parent().remove();
           ArrDel(order,Number(that.name));
            layer.msg('该项已删除！');
        }, function(){

            });
    });
}
function ArrDel(arr,num) {
 arr[num]=0;
}
function GethbData(divid){
    var redata=[];
    var row1,col1,rowspan1,colspan1;
    divid="#"+divid;
    $.each($(divid +" tr"),function(i,item){
        $.each($(item).find("td"),function(j,item1){
            if($(item1).attr("rowspan")){
                var redata1={};
                rowspan1=$(item1).attr("rowspan");
                colspan1=$(item1).attr("colspan");
                row1=i;
                col1=j;
                redata1.row=row1;
                redata1.col=col1;
                redata1.rowspan=rowspan1;
                redata1.colspan=colspan1;
                redata.push(redata1);
            }
        });
    });
    redata=GetString1(redata);
    return redata;
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
function getString( objarr ){
    var tree = "[";
    for (var i=0;i<objarr.length;i++){
        tree+="[";
        for(var j=0;j<objarr[i].length;j++){
            if(objarr[i][j]===null){
                objarr[i][j]="";
            }
            objarr[i][j]=objarr[i][j].replace(/↵/g,"").replace(/[\r\n]/g,"");
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
function GetString1( objarr ){
    var tree = "[";
    for (var i=0;i<objarr.length;i++){
        tree+="{'row':"+objarr[i].row+",'col':"+objarr[i].col+",'rowspan':"+objarr[i].rowspan+",'colspan':"+objarr[i].colspan;
        tree+="},";
    }
    tree+="]";
    return tree;
}
function GetData() {
    var url=urlnei+"/info_table?pk="+pk;
    DataGet(url,'',function(data) {
        var msg=data.work_step_list;
        $('#inputtittle').val(msg.model_name);
        if(!msg.step_order.length){
            var datathis=msg.step_order;
            msg.step_order=[];
            msg.step_order.push(datathis);
        }
        msg.step_data=eval('('+msg.step_data+')');
        msg.explain=eval('('+msg.explain+')');
        msg.html_code=eval('('+msg.html_code+')');
        msg.merge_cells=eval('('+msg.merge_cells+')');
        msg.other_data=eval('('+msg.other_data+')');
        msg.remarks=eval('('+msg.remarks+')');
        msg.table_data=eval('('+msg.table_data+')');
        //console.log(data)
        for(var i=0;i<msg.step_order.length;i++){
            if(msg.step_order[i]==1){
                var temp=template1.replace(/{{ordnum}}/g, ordernum);
                $("#newtable").append(temp);
                order.push(1);
                ordernum++;
                $('#inputtittle').val(msg.model_name);
                $('input[name="bz1"]').eq(Bz1Num).val(msg.step_data[Bz1Num]);
                Bz1Num++;
            }
            if(msg.step_order[i]==2){
                var temp=template2.replace(/{{ordnum}}/g, ordernum);
                $("#newtable").append(temp);
                order.push(2);
                ordernum++;
                $('input[name="sm"]').eq(SmNum).val(msg.explain[SmNum]);
                SmNum++;
            }
            if(msg.step_order[i]==3){
                var temp=template3.replace(/{{ordnum}}/g,ordernum);
                $("#newtable").append(temp);
                order.push(3);
                ordernum++;
                $('textarea[name="nr"]').eq(NrNum).val(msg.other_data[NrNum]);
                NrNum++;
            }
            if(msg.step_order[i]==4){
                var temp=template4.replace(/{{ordnum}}/g, ordernum);
                $("#newtable").append(temp);
                order.push(4);
                ordernum++;
                $('input[name="bz"]').eq(BzNum).val(msg.remarks[BzNum]);
                BzNum++;
            }
            if(msg.step_order[i]==5){
                var temp=template5.replace(/{{i}}/g, BgNum).replace(/{{ordnum}}/g, ordernum);
                $("#newtable").append(temp);
                var datam;
                datam =msg.table_data[BgNum+1];
               // console.log(datam);
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
                            "row_above": {name: '向上插入一行'},
                            "row_below": {name: '向下插入一行'},
                            "col_left": {name: '向左插入一列'},
                            "col_right": {name: '向右插入一列'},
                            "remove_row": {name: '删除行'},
                            "remove_col": {name: '删除列'},
                            "undo": {name: '撤销'},
                            "redo": {name: '返回'},
                            "copy": {name: '复制'},
                            "cut": {name: '剪切'},
                            "alignment": {name: '对齐'},
                            "mergeCells": {name: '合并'}
                        }
                    }
                });
                order.push(5);
                ordernum++;
                BgNum++;
            }
        }
    });
}
$(document).ready(function(){
   GetData();
});
function ToString(objarr) {
    var tree = "[";
    for (var i=0;i<objarr.length;i++){
        tree+="'"+objarr[i]+"',"
    }
    tree+="]";
    return tree;
}
function ToString_1(objarr) {
    var tree = "[";
    for (var i=0;i<objarr.length;i++){
        tree+=objarr[i]+","
    }
    tree+="]";
    return tree;
}
function GetHtmlData() {
    var htmllist=[];
    $.each($("#newtable .ht_master table"),function(i,item){
        var thisa=$(item).html().replace(/↵/g,"").replace(/[\r\n]/g,"");
        htmllist.push(thisa);
    });
    return htmllist;
}