from app import db

#用户表
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer,primary_key=True,nullable=True)
    uid = db.Column(db.String(48),index=True,nullable=True,unique=True)
    username = db.Column(db.String(10),nullable=True,unique=True)
    password = db.Column(db.String(16), nullable=True)
    create_time = db.Column(db.DateTime)
    spare1 = db.Column(db.String(48))
    spare2 = db.Column(db.String(48))
    spare3 = db.Column(db.String(48))

#使用中用户表
class User_Inuse(db.Model):
    __tablename__ = 'user_inuse'
    uid = db.Column(db.String(48),primary_key=True,index=True,nullable=True)
    tocken= db.Column(db.String(280),nullable=True,unique=True)
    create_time = db.Column(db.DateTime)
    spare1 = db.Column(db.String(48))
    spare2 = db.Column(db.String(48))
    spare3 = db.Column(db.String(48))
