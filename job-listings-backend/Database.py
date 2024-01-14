from azure.cosmos import CosmosClient
import os
# from flask import g

def getDatabase():
    # if "database" not in g:
    endpoint = os.environ["CosmosDBAccountURI"]
    key = os.environ["CosmosDBAccountKey"]
    client = CosmosClient(endpoint, key)
    database = client.get_database_client("job-listings-db")
    database.read()
    #     g.database = database 
    # return g.database   
    return database

def getCompanyNames(container):
    companyNames = container.query_items("SELECT c.id FROM c ORDER BY c.id ASC",
                                         enable_cross_partition_query = True)
    companyNames = [company["id"] for company in companyNames]
    return companyNames