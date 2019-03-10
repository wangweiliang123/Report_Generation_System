// handsontable 表格生成
var data = [['', '', '', '', '','', '', '', ''], ['',  '', '', '','', '', '', '', ''], ['',  '', '', '','', '', '', '', ''], ['',  '', '', '','', '', '', '', ''], ['',  '', '', '','', '', '', '', ''], ['',  '', '', '','', '', '', '', '']];
var container = document.getElementById("hot");
var hotsetting = {
    data: data,//表格数据
    autoColumnSize: true,//自适应列大小
    contextMenu: true,//右键操作
    mergeCells: true//允许合并
};
var hot1 = new Handsontable(container, hotsetting);
// 汉化设置
hot1.updateSettings({
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
$(document).ready(function(){
    $.cookie('bmid', "", {expires: -1, path: '/'});
    var url1=urlnei+"/handsontable/api/work_step/";
    DataGet(url1,'',function(data) {
        var mag=data.work_model_all;
        ListShow(mag,"#bmselect");
    });
});
// 确认按钮
function btn_confirm(){
    GethbData();
    var tdata=new Array();
    for (var i=0;i<hot1.countRows();i++){
        tdata[i]=new Array();
        tdata[i]=hot1.getDataAtRow(i);
    }
    tdata=getString(tdata);
    var mergecells=GethbData("#hot");
    var url=urlnei+"/handsontable/api/work_step/0/";
    var senddata={};
    var bmname=GetInputVal("#bmname");
    var bmname1=GetInputVal("#bmname1");
    var bmname2=GetInputVal("#bmname2");
    var sjbm1= GetSelectVal("#bmselect1");
    var sjbm= GetSelectVal("#bmselect");
    var isqy=$("input[type='radio']:checked").val();
    var hot=$("#hot").html();
    senddata={
        parent:sjbm,
        name:bmname,
        step_desc:bmname1,
        step_class:sjbm1,
        step_order:bmname2,
        is_leaf_node:isqy,
        table_info:hot,
        table_data:tdata,
        merge_cells:mergecells
    };
    layui.use('layer', function() { //独立版的layer无需执行这一句
        var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
        layer.confirm('确认添加此模板？', {
            btn: ['确认','取消'] //按钮
        }, function(){
            DataPost(url,senddata,function(data){
                if(data.msg="请求成功!"){
                    layer.msg('添加新模板成功！');
                }
            });
        }, function(){
        });
    });
}

function ListShow(data,id){
    var len=data.length;
    $(id).append("<option></option>");
    for(var i=0;i<len;i++){
        $(id).append("<option value="+data[i].id+">"+data[i].name+"</option>");
    }
}

function TableOut() {
    var index=parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
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
function GethbData(divid){
    var redata=[];
    var row1,col1,rowspan1,colspan1;
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
function GetString1( objarr ){
    var tree = "[";
    for (var i=0;i<objarr.length;i++){
        tree+="{'row':"+objarr[i].row+",'col':"+objarr[i].col+",'rowspan':"+objarr[i].rowspan+",'colspan':"+objarr[i].colspan;
        tree+="},";
    }
    tree+="]";
    return tree;
}