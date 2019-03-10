# _*_ coding: utf-8 _*_

#调试模式是否开启
DEBUG = True
SQLALCHEMY_TRACK_MODIFICATIONS = False
#session必须要设置key
SECRET_KEY='p046Zr98/3yX R~XH!j7mN[0]LWX/,?RW'
TOKEN_LIFETIME=6000000
#mysql数据库连接信息,这里改为自己的账号
SQLALCHEMY_DATABASE_URI = "mysql://root:123456@localhost:3306/custom_form"