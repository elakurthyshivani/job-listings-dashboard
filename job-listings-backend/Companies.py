from flask import Blueprint, current_app
from Enum import CosmosContainers
import Database

companiesBp = Blueprint('companies', 
                        __name__, 
                        url_prefix="/companies")

@companiesBp.route('/',
                   methods=["GET"])
def get_companies():
    container = None
    try:
        container = current_app.config["database"]\
                    .get_container_client(CosmosContainers.CONTAINER_NAMES.value)
        return {"data": Database.getCompanyNames(container)}
    except:
        return {"error": "Error connecting to Cosmos DB"}
    
@companiesBp.route("/<companyName>", 
                   methods=["GET"])
def get_company_job_listings(companyName):
    if companyName == "":
        return {"error": "Invalid company name"}

    container = None
    try:
        container = current_app.config["database"]\
                    .get_container_client(CosmosContainers.CONTAINER_NAMES.value)
        containerListingsName = Database.getContainerName(container, companyName)
        if containerListingsName == None:
            return {"error": "Invalid company name"}
        
        containerListings = current_app.config["database"]\
                    .get_container_client(containerListingsName)
        return {"data": Database.getJobListings(containerListings, companyName)}
    except:
        return {"error": "Error connecting to Cosmos DB"}