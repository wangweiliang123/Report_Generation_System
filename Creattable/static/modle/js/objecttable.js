layui.use(['tree', 'layer' , 'laydate'], function(){
    var laydate = layui.laydate;
    laydate.render({
        elem: '#test'
    });
    layui.tree({
        elem: '#demo1', //指定元素
        target: '_blank' ,//是否新选项卡打开（比如节点返回href才有效）
        nodes: [ //节点
            {
                name: '常用文件夹'
                ,id: 1
                ,alias: 'changyong'
                ,children: [
                    {
                        name: '所有未读（设置跳转）'
                        ,id: 11
                        ,href: 'http://www.layui.com/'
                        ,alias: 'weidu'
                    }, {
                        name: '置顶邮件'
                        ,id: 12
                    }, {
                        name: '标签邮件'
                        ,id: 13
                    }
                ]
            }, {
                name: '我的邮箱'
                ,id: 2
                ,spread: true
                ,children: [
                    {
                        name: 'QQ邮箱'
                        ,id: 21
                        ,spread: true
                        ,children: [
                            {
                                name: '收件箱'
                                ,id: 211
                                ,children: [
                                    {
                                        name: '所有未读'
                                        ,id: 2111
                                    }, {
                                        name: '置顶邮件'
                                        ,id: 2112
                                    }, {
                                        name: '标签邮件'
                                        ,id: 2113
                                    }
                                ]
                            }, {
                                name: '已发出的邮件'
                                ,id: 212
                            }, {
                                name: '垃圾邮件'
                                ,id: 213
                            }
                        ]
                    }, {
                        name: '阿里云邮'
                        ,id: 22
                        ,children: [
                            {
                                name: '收件箱'
                                ,id: 221
                            }, {
                                name: '已发出的邮件'
                                ,id: 222
                            }, {
                                name: '垃圾邮件'
                                ,id: 223
                            }
                        ]
                    }
                ]
            }
            ,{
                name: '收藏夹'
                ,id: 3
                ,alias: 'changyong'
                ,children: [
                    {
                        name: '爱情动作片'
                        ,id: 31
                        ,alias: 'love'
                    }, {
                        name: '技术栈'
                        ,id: 12
                        ,children: [
                            {
                                name: '前端'
                                ,id: 121
                            }
                            ,{
                                name: '全端'
                                ,id: 122
                            }
                        ]
                    }
                ]
            }
        ]
    });
});
var data = [['', '', '', '', '','', '', '', ''], ['',  '', '', '','', '', '', '', ''], ['',  '', '', '','', '', '', '', ''], ['',  '', '', '','', '', '', '', ''], ['',  '', '', '','', '', '', '', ''], ['',  '', '', '','', '', '', '', '']];
var container = document.getElementById("hot");
var container1 = document.getElementById("hot1");
var hotsetting = {
    data: data,//表格数据
    autoColumnSize: true,//自适应列大小
    contextMenu: true,//右键操作
    mergeCells: true,//允许合并
    colWidths: 118
};
var hot1 = new Handsontable(container, hotsetting);
var hot2 = new Handsontable(container1, hotsetting);
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
hot2.updateSettings({
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