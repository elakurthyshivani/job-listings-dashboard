from flask import Flask, current_app
import Database
from Home import homeBp
from Companies import companiesBp

app = Flask(__name__)
with app.app_context():
    current_app.config["database"]=Database.getDatabase()
    app.register_blueprint(homeBp)
    app.register_blueprint(companiesBp)

if __name__ == '__main__':
   app.run()