from flask import Blueprint, current_app
from Enum import CosmosContainers
import Database

companiesBp = Blueprint('companies', 
                        __name__, 
                        url_prefix="/companies")

@companiesBp.route('/')
def dashboard() -> list[str]:
    container = None
    try:
        container = current_app.config["database"]\
                    .get_container_client(CosmosContainers.WORKDAY_JOB_LISTINGS.value)
        return {"data": Database.getCompanyNames(container)}
    except:
        return {"error": "Error connecting to Cosmos DB"}