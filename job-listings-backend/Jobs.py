from flask import Blueprint, current_app, request
from Enum import CosmosContainers
import Database

jobsBp = Blueprint('jobs', __name__)

@jobsBp.route('/api/companies/<companyName>/jobs', methods=["GET"])
def get_job_listings(companyName):
    if companyName == "":
        return {"error": "Invalid company name"}, 400

    container = None
    try:
        container = current_app.config["database"]\
                    .get_container_client(CosmosContainers.CONTAINER_NAMES.value)
        containerListingsName = Database.getContainerName(container, companyName)
        if containerListingsName == None:
            return {"error": "Invalid company name"}, 400
        
        containerListings = current_app.config["database"]\
                    .get_container_client(containerListingsName)
        return {"data": Database.getJobListings(containerListings, companyName)}
    
    except Exception as err:
        return {"error": f"Error connecting to Cosmos DB - {err}"}, 503
    

@jobsBp.route('/api/companies/<companyName>/jobs/status', methods=["PUT"])
def update_job_listings(companyName):
    if "update" not in request.json or \
            "jobIds" not in request.json["update"] or \
            "status" not in request.json["update"]:
        return {"error": "Invalid request"}, 400
    
    container = None
    try:
        container = current_app.config["database"]\
                    .get_container_client(CosmosContainers.CONTAINER_NAMES.value)
        containerListingsName = Database.getContainerName(container, companyName)
        if containerListingsName == None:
            return {"error": "Invalid company name"}, 400
        
        containerListings = current_app.config["database"]\
                    .get_container_client(containerListingsName)
        
        successfullyUpdated, response = Database.updateStatus(containerListings, 
                                companyName, 
                                request.json["update"]["jobIds"],
                                request.json["update"]["status"])
        if successfullyUpdated == False:
            return {"error" : response}
        return {"data": response}
    
    except Exception as err:
        return {"error": f"Error connecting to Cosmos DB - {err}"}, 503


@jobsBp.route('/api/companies/<companyName>/jobs/status', methods=["DELETE"])
def delete_job_listings(companyName):
    if "delete" not in request.json or \
            "jobIds" not in request.json["delete"]:
        return {"error": "Invalid request"}, 400
    
    container = None
    try:
        container = current_app.config["database"]\
                    .get_container_client(CosmosContainers.CONTAINER_NAMES.value)
        containerListingsName = Database.getContainerName(container, companyName)
        if containerListingsName == None:
            return {"error": "Invalid company name"}, 400
        
        containerListings = current_app.config["database"]\
                    .get_container_client(containerListingsName)
        
        successfullyDeleted, response = Database.deleteStatus(containerListings, 
                                companyName, 
                                request.json["delete"]["jobIds"])
        if successfullyDeleted == False:
            return {"error" : response}
        return {"data": response}
    
    except Exception as err:
        return {"error": f"Error connecting to Cosmos DB - {err}"}, 503