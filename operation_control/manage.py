from app import app
from app import db
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)

#引用实例对象
from app.model.user import *
from app.model.netable import *
if __name__=='__main__':
    manager.run()