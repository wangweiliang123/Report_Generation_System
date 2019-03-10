# -*- coding: utf-8 -*-
from flask import Flask
from flask_cors import *
import pymysql
pymysql.install_as_MySQLdb()
from flask_sqlalchemy import SQLAlchemy

#创建项目对象
app = Flask(__name__)
CORS(app, supports_credentials=True)

# 加载配置文件内容
app.config.from_object('app.config')  # 模块下的config文件名，不用加py后缀
db = SQLAlchemy(app)

from app.controller.routs import route_1
app.register_blueprint(route_1)