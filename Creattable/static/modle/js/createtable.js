// 基于handsontable插件，创建类excel表格，通过按钮点击动态添加响应组件

var BgNum=0;//表格数
var ordernum=0;//组件总数
var tableobject=[];//handsontable表格对象列表
var order=[];//组件顺序列表，1为步骤，2为说明，3为内容，4为备注，5为表格
// 添加步骤模板
var template1="   <div class=\"divcontain1\">\n" +
    "                <input type=\"text\"  lay-verify=\"required\" name=\"bz1\"   placeholder=\"请输入步骤\" class=\"inputbz\" style =\"margin-left: -10px;width: 98%\">\n" +
    " <button class=\"layui-btn layui-btn-sm\" onclick=\"BtnRv(this);\" name=\"{{ordnum}}\" style=\"margin-top: 6px;margin-left: 26px;display: block\">删除</button>"+
    "            </div>";
// 添加说明模板
var template2="<div class=\"divcontain1\">\n" +
    "                <input type=\"text\"  lay-verify=\"required\" name=\"sm\"   placeholder=\"请输入说明\" class=\"inputsm\">\n" +
    " <button class=\"layui-btn layui-btn-sm\" onclick=\"BtnRv(this);\" name=\"{{ordnum}}\"  style=\"margin-top: 6px;margin-left: 26px;display: block\">删除</button>"+
    "            </div>";
// 添加文本域模板
var template3=" <div  class=\"divcontain1\" >\n" +
    "                <textarea   placeholder=\"请输入内容\" name=\"nr\" class=\"layui-textarea inputnr\"></textarea>\n" +
    " <button class=\"layui-btn layui-btn-sm\" onclick=\"BtnRv(this);\" name=\"{{ordnum}}\"   style=\"margin-top: 6px;margin-left: 26px;display: block\">删除</button>"+
    "            </div>";
// 添加备注模板
var template4=" <div  class=\"divcontain1\" >\n" +
    "                <input  lay-verify=\"required\" name=\"bz\" placeholder=\"请输入备注\" class=\"inputzs\" style=\"border: none;border-bottom: 1px solid black;background-color:#f0fcff\">\n" +
    " <button class=\"layui-btn layui-btn-sm\" onclick=\"BtnRv(this);\" name=\"{{ordnum}}\"   style=\"margin-top: 6px;margin-left: 26px;display: block\">删除</button>"+
    "            </div>";
// 添加表格模板
var template5="<div class=\"divcontain1\" >\n" +
    "                <div id=\"hot{{i}}\" class=\"divstepbg\" style=\"padding-left: 20px;padding-top: 6px\" >\n" +
    "                </div>\n" +
    " <button class=\"layui-btn layui-btn-sm\" onclick=\"BtnRv(this);\" name=\"{{ordnum}}\"  data-tableid=\"{{i}}\" data-btnname=\"btntb\" style=\"margin-top: 6px;margin-left: 26px;display: block\">删除</button>"+
    "            </div>";
// 添加步骤按钮
function BtnBz() {
    var temp=template1.replace(/{{ordnum}}/g, ordernum);
    $("#newtable").append(temp);
    order.push(1);
    ordernum++;
}
// 添加说明按钮
function BtnSm() {
    var temp=template2.replace(/{{ordnum}}/g, ordernum);
    $("#newtable").append(temp);
    order.push(2);
    ordernum++;
}
// 添加备注按钮
function BtnZs() {
    var temp=template4.replace(/{{ordnum}}/g, ordernum);
    $("#newtable").append(temp);
    order.push(4);
    ordernum++;
}
// 添加文本域按钮
function BtnNs() {
    var temp=template3.replace(/{{ordnum}}/g,ordernum);
    $("#newtable").append(temp);
    order.push(3);
    ordernum++;
}
// 保存按钮，获取相应数据（步骤、说明、备注、文本域、表格单元格数据、表格合并数据、表格html数据）
function BtnSave() {
    var tablehtmllist=[];/*表格html数据*/
    var senddata={};
    var bz1list=[];/*步骤数据列表*/
    var smlist=[];/*说明数据列表*/
    var nrlist=[];/*文本域数据列表*/
    var bzlist=[];/*备注数据列表*/
    var bglist1=["[['安抚','啊师傅'],['暗示法','阿斯弗']]"];/*表格单元格数据列表，防止后期加载出错，不能为空*/
    var bglist2=["[{'row':0,'col':0,'rowspan':2,'colspan':2},{'row':2,'col':3,'rowspan':1,'colspan':3},]"];/*表格单元格合并数据列表，防止后期加载出错，不能为空*/
    var tabletittle=$("#inputtittle").val();
    $('input[name="bz1"]').each(function () {
        bz1list.push($(this).val().replace(/↵/g,"").replace(/[\r\n]/g,""));
    });
    $('input[name="sm"]').each(function () {
        smlist.push($(this).val().replace(/↵/g,"").replace(/[\r\n]/g,""));
    });
    $('input[name="bz"]').each(function () {
        bzlist.push($(this).val().replace(/↵/g,"").replace(/[\r\n]/g,""));
    });
    $('textarea[name="nr"]').each(function () {
        nrlist.push($(this).val().replace(/↵/g,"").replace(/[\r\n]/g,""));
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
    //console.log(bglist2);
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
        html_code:tablehtmllist
    };
    senddata.merge_cells=ToString_1(senddata.merge_cells);
    senddata.table_data=ToString_1(senddata.table_data);
    //console.log(senddata);
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.confirm('确认保存此模板？', {
            btn: ['确认','取消']
        }, function(){
            var url=urlnei+"/newtable";
            DataPost(url,senddata,function(data){
                if(data.msg="请求成功!"){
                    layer.msg('模板已保存！');
                }
                setTimeout(function () {
                    window.location.href='tablenew.html';
                },1200);
            });
        }, function(){

        });
    });
}
// 添加表格按钮
function BtnBg() {
    var temp=template5.replace(/{{i}}/g, BgNum).replace(/{{ordnum}}/g, ordernum);
    $("#newtable").append(temp);
    var datam = [['',  '', '',  '', '', ''], ['',  '',  '', '', '', ''], ['',  '', '',  '', '', ''], ['', '', '', '', '', '']];
    var hotsetting = {
        data: datam,
        autoColumnSize: true,
        contextMenu: true,
        mergeCells: true
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
// 删除按钮，删除相应组件，并将组件顺序列表相应位置置0
function BtnRv(that) {
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.confirm('确认删除此项？', {
            btn: ['确认','取消']
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
// 获取表格合并数据
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
// 获取表格单元格数据
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
            objarr[i][j]=objarr[i][j].replace(/↵/g,'').replace(/[\r\n]/g,'');
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
function ToString_1(objarr) {
    var tree = "[";
    for (var i=0;i<objarr.length;i++){
        tree+=objarr[i]+","
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
// 获取表格html数据
 function GetHtmlData() {
    var htmllist=[];
     $.each($("#newtable .ht_master table"),function(i,item){
         var thisa=$(item).html().replace(/↵/g,"").replace(/[\r\n]/g,"");
         htmllist.push(thisa);
     });
     return htmllist;
 }