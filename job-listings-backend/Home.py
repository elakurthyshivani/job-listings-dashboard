from flask import Blueprint

homeBp = Blueprint('home', 
                        __name__, 
                        template_folder="templates")

@homeBp.route('/')
def home():
    return {"Message": "Hello!"}
    