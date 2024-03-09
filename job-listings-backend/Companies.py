from flask import Blueprint, current_app
from Enum import CosmosContainers
import Database

companiesBp = Blueprint('companies', 
                        __name__, 
                        url_prefix="/api/companies")

@companiesBp.route('/',
                   methods=["GET"])
def get_companies():
    container = None
    try:
        container = current_app.config["database"]\
                    .get_container_client(CosmosContainers.CONTAINER_NAMES.value)
        return {"data": Database.getCompanyNames(container)}
    
    except Exception as err:
        return {"error": f"Error connecting to Cosmos DB - {err}"}, 503