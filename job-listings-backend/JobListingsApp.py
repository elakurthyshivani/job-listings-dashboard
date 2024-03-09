from flask import Flask, current_app
import Database
from Home import homeBp
from Companies import companiesBp
from Jobs import jobsBp

app = Flask(__name__)
with app.app_context():
    current_app.config["database"]=Database.getDatabase()
    app.register_blueprint(homeBp)
    app.register_blueprint(companiesBp)
    app.register_blueprint(jobsBp)

if __name__ == '__main__':
   app.run(debug=True)