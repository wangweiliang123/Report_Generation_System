from flask import Blueprint,request,jsonify,abort
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from app.model.user import *
from app.model.netable import *
from  app import app
import datetime
import time
import uuid
route_1 = Blueprint('route_1', __name__)
from app import db

#获取验证token
def GetToken(func):
    def wrapper(*args, **kwargs):
        tokenthis = request.headers.get('token', None)
        s = Serializer(app.config['SECRET_KEY'])
        token = s.loads(tokenthis)
        uid_get = token.get("uid")
        thisuser = User_Inuse.query.filter_by(uid=uid_get).first()
        if thisuser == None:
            return abort(400)
        else:
            if thisuser.tocken != tokenthis:
                return abort(400)
            else:
                timeout = token.get("timeout")
                timenow = time.time()
                if timenow > timeout:
                    db.session.delete(thisuser)
                    db.session.commit()
                    return abort(400)
        return func(uid_get)
    return wrapper
#验证token
def CheckToken():
    tokenthis = request.headers.get('token', None)
    s = Serializer(app.config['SECRET_KEY'])
    token = s.loads(tokenthis)
    uid_get = token.get("uid")
    thisuser = User_Inuse.query.filter_by(uid=uid_get).first()
    if thisuser == None:
        return abort(400)
    else:
        if thisuser.tocken != tokenthis:
            return abort(400)
        else:
            timeout = token.get("timeout")
            timenow = time.time()
            if timenow > timeout:
                db.session.delete(thisuser)
                db.session.commit()
                return abort(400)
    return uid_get
#生成随机的
def New_Id():
    id=uuid.uuid4()
    id=str(id).split("-")
    newid=[]
    for i in range(len(id)):
        item=int(id[i],16)
        newid.append(str(item))
    id=''.join(newid)
    id="1"+id
    return id

# 登录模块
@route_1.route('/login', methods=['post'])
def Login():
    if request.method == 'POST':
        data=request.json
        uname=data.get("username")
        password=data.get("password")
        thisuser=User.query.filter_by(username=uname,password=password).all()
        if len(thisuser)==1:
            #删除原有用户
            user_login_old = User_Inuse.query.filter_by(uid=thisuser[0].uid).all()
            for i in range(len(user_login_old)):
                db.session.delete(user_login_old[i])
                db.session.commit()
            #添加新用户
            time=datetime.datetime.now()
            token=generator_auth_token(thisuser[0].uid,uname).decode('utf-8')
            user_login = User_Inuse(uid=thisuser[0].uid, tocken=token,create_time=time)
            db.session.add(user_login)
            db.session.commit()
            return jsonify({"code":200,"msg":"用户名密码正确！","uname":uname,"uid":thisuser[0].uid,"token":token})
        return abort(400)
    return abort(500)

#生成token
def generator_auth_token(uid, uname,expiration=7200):
    s = Serializer(app.config['SECRET_KEY'],expires_in=expiration)
    timeout=time.time()+7200
    return s.dumps({'uid': uid,"uname":uname,"timeout":timeout})

# 新增表格
@route_1.route('/newtable', methods=['post'])
def TableSave():
    uid=CheckToken()
    try:
        if request.method == 'POST':
            data = request.json
            newtablethis = NewTable(
            model_name = data.get("model_name"),
            table_data = data.get("table_data"),
            merge_cells = data.get("merge_cells"),
            step_data = data.get("step_data"),
            step_order = data.get("step_order"),
            explain = data.get("explain"),
            other_data = data.get("other_data"),
            remarks = data.get("remarks"),
            html_code = data.get("html_code"),
            tid=New_Id(),
            create_time = datetime.datetime.now(),
            creator=uid,
            )
            db.session.add(newtablethis)
            db.session.commit()
            return jsonify({"code": 200, "msg": "请求成功!"})
    except ZeroDivisionError as e:
        return abort(400)

# 获取表格列表
@route_1.route('/work_table', methods=['get'])
def ShowTables():
    uid=CheckToken()
    limit=request.args.get("limit",10)
    offset = request.args.get("offset", 0)
    count=NewTable.query.count()
    newtable = NewTable.query.offset(offset).limit(limit).all()
    work_model_all=[]
    for i in range(len(newtable)):
        work_model_this={"model_name":newtable[i].model_name,"id":newtable[i].tid,"created_time":newtable[i].create_time}
        work_model_all.append(work_model_this)

    return jsonify({"code": 200, "msg": "请求成功!","count":count,"work_model_all":work_model_all})

# 获取表格数据
@route_1.route('/info_table', methods=['get'])
def InfoTables():
    uid=CheckToken()
    pk=request.args.get("pk")
    if len(pk)<10:
        return abort(400)
    infotable = NewTable.query.filter_by(tid=pk).first()
    work_step_list={
        "model_name":infotable.model_name,
        "table_data":infotable.table_data,
        "step_data":infotable.step_data,
        "merge_cells":infotable.merge_cells,
        "step_order": infotable.step_order,
        "explain": infotable.explain,
        "other_data": infotable.other_data,
        "remarks": infotable.remarks,
        "html_code": infotable.html_code,
                    }
    return jsonify({"code": 200,"work_step_list":work_step_list,"msg":"请求成功！"})

# 编辑表格
@route_1.route('/edit_table', methods=['post'])
def Tables():
    uid=CheckToken()
    data = request.json
    pk=data.get("pk")
    if len(pk)<10:
        return abort(400)
    infotable = NewTable.query.filter_by(tid=pk).first()
    infotable.model_name=data.get("model_name"),
    infotable.table_data=data.get("table_data"),
    infotable.merge_cells=data.get("merge_cells"),
    infotable.step_data=data.get("step_data"),
    infotable.step_order=data.get("step_order"),
    infotable.explain=data.get("explain"),
    infotable.other_data=data.get("other_data"),
    infotable.remarks=data.get("remarks"),
    infotable.html_code=data.get("html_code"),
    infotable.creator=uid,
    db.session.commit()
    return jsonify({"code": 200,"msg":"请求成功!"})

# 新增规则表
@route_1.route('/newtable_rule', methods=['post'])
def TableSave_Rule():
    uid=CheckToken()
    try:
        if request.method == 'POST':
            data = request.json
            pk = data.get("base_model")
            infotable = NewTable.query.filter_by(tid=pk).first()
            newtablethis = NewTable_Rule(
                model_name=infotable.model_name,
                table_data=infotable.table_data,
                merge_cells=infotable.merge_cells,
                step_data=infotable.step_data,
                step_order=infotable.step_order,
                explain=infotable.explain,
                other_data=infotable.other_data,
                remarks=infotable.remarks,
                html_code=infotable.html_code,
                table_rule=data.get("table_rule"),
                tid=New_Id(),
                create_time=datetime.datetime.now(),
                creator=uid,
                base_model=pk
            )
            db.session.add(newtablethis)
            db.session.commit()
            return jsonify({"code": 200, "msg": "请求成功!"})
    except ZeroDivisionError as e:
        return abort(400)


# 获取表格规则列表
@route_1.route('/work_table_rule', methods=['get'])
def ShowTables_rule():
    uid=CheckToken()
    limit=request.args.get("limit",10)
    offset = request.args.get("offset", 0)
    count=NewTable_Rule.query.count()
    newtable = NewTable_Rule.query.offset(offset).limit(limit).all()
    work_model_all=[]
    for i in range(len(newtable)):
        work_model_this={"model_name":newtable[i].model_name,"id":newtable[i].tid,"created_time":newtable[i].create_time}
        work_model_all.append(work_model_this)

    return jsonify({"code": 200, "msg": "请求成功!","count":count,"work_model_list":work_model_all})


# 获取表格规则数据
@route_1.route('/info_table_rule', methods=['get'])
def InfoTables_rule():
    uid=CheckToken()
    pk=request.args.get("pk")
    if len(pk)<10:
        return abort(400)
    infotable = NewTable_Rule.query.filter_by(tid=pk).first()
    work_step_list={
        "model_name":infotable.model_name,
        "step_data":infotable.step_data,
        "step_order": infotable.step_order,
        "explain": infotable.explain,
        "other_data": infotable.other_data,
        "remarks": infotable.remarks,
        "table_rule": infotable.table_rule,
        "html_code": infotable.html_code,
        "table_data": infotable.table_data,
        "merge_cells": infotable.merge_cells,
                    }
    return jsonify({"code": 200,"work_step_list":work_step_list,"msg":"请求成功！"})

# 编辑表格规则
@route_1.route('/edit_table_rule', methods=['post'])
def Tables_Rule():
    uid=CheckToken()
    data = request.json
    pk=data.get("pk")
    if len(pk)<10:
        return abort(400)
    infotable = NewTable_Rule.query.filter_by(tid=pk).first()
    infotable.table_rule=data.get("table_rule"),
    db.session.commit()
    return jsonify({"code": 200,"msg":"请求成功!"})


# 新增归档表格
@route_1.route('/newtable_end', methods=['post'])
def TableSave_End():
    uid=CheckToken()
    try:
        if request.method == 'POST':
            data = request.json
            pk = data.get("base_model")
            infotable = NewTable_Rule.query.filter_by(tid=pk).first()
            newtablethis = NewTable_End(
                model_name=infotable.model_name,
                table_data=infotable.table_data,
                merge_cells=infotable.merge_cells,
                step_data=infotable.step_data,
                step_order=infotable.step_order,
                explain=infotable.explain,
                other_data=data.get("other_data"),
                remarks=data.get("remarks"),
                html_code=infotable.html_code,
                table_rule=infotable.table_rule,
                data=data.get("data"),
                tid=New_Id(),
                create_time=datetime.datetime.now(),
                creator=uid,
                base_model=pk
            )
            db.session.add(newtablethis)
            db.session.commit()
            return jsonify({"code": 200, "msg": "请求成功!"})
    except ZeroDivisionError as e:
        return abort(400)


# 获取归档表格列表
@route_1.route('/work_table_end', methods=['get'])
def ShowTables_end():
    uid=CheckToken()
    limit=request.args.get("limit",10)
    offset = request.args.get("offset", 0)
    count=NewTable_End.query.count()
    newtable = NewTable_End.query.offset(offset).limit(limit).all()
    task_work_list=[]
    for i in range(len(newtable)):
        work_model_this={"model_name":newtable[i].model_name,"id":newtable[i].tid,"created_time":newtable[i].create_time}
        task_work_list.append(work_model_this)

    return jsonify({"code": 200, "msg": "请求成功!","count":count,"task_work_list":task_work_list})

# 获取归档表格数据
@route_1.route('/info_table_end', methods=['get'])
def InfoTables_end():
    uid=CheckToken()
    pk=request.args.get("pk")
    if len(pk)<10:
        return abort(400)
    infotable = NewTable_End.query.filter_by(tid=pk).first()
    task_work_detail={
        "model_name":infotable.model_name,
        "step_data":infotable.step_data,
        "step_order": infotable.step_order,
        "explain": infotable.explain,
        "other_data": infotable.other_data,
        "remarks": infotable.remarks,
        "table_rule": infotable.table_rule,
        "html_code": infotable.html_code,
        "table_data": infotable.table_data,
        "data": infotable.data,
        "merge_cells": infotable.merge_cells,
                    }
    return jsonify({"code": 200,"task_work_detail":task_work_detail,"msg":"请求成功！"})

# 编辑表格规则
@route_1.route('/edit_table_end', methods=['post'])
def Tables_End():
    uid=CheckToken()
    data = request.json
    pk=data.get("pk")
    if len(pk)<10:
        return abort(400)
    infotable = NewTable_End.query.filter_by(tid=pk).first()
    infotable.data=data.get("data"),
    infotable.other_data = data.get("other_data"),
    infotable.remarks = data.get("remarks"),
    db.session.commit()
    return jsonify({"code": 200,"msg":"请求成功!"})