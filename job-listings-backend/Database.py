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

def getContainerNames(container):
    containerNames = container.query_items("SELECT DISTINCT c.ContainerName FROM c ORDER BY c.id ASC",
                                         enable_cross_partition_query = True)
    containerNames = [containerName["ContainerName"] for containerName in containerNames]
    return containerNames

def getCompanyNames(container):
    companyNames = container.query_items("SELECT c.id, c.ContainerName FROM c ORDER BY c.id ASC",
                                         enable_cross_partition_query = True)
    companyNames = [company for company in companyNames]
    containerNames = {containerName: [] for containerName in getContainerNames(container)}
    for companyName in companyNames:
        containerNames[companyName["ContainerName"]].append(companyName["id"])
    return containerNames

def getContainerName(container, companyName):
    containerName = container.query_items(f"SELECT c.ContainerName FROM c WHERE c.id='{companyName}'",
                                          enable_cross_partition_query = True)
    containerName = [_container["ContainerName"] for _container in containerName]
    return containerName[0] if len(containerName) > 0 else None

def getJobListings(container, companyName):
    jobListings = container.query_items(f"SELECT c.Jobs, c.LastUpdated FROM c WHERE c.id='{companyName}'",
                                        enable_cross_partition_query = True)
    jobListings = [jobListing for jobListing in jobListings]
    if len(jobListings) == 0:
        return {}
    else:
        newListings = []
        for jobID, details in jobListings[0]["Jobs"].items():
            newListings.append({
                "JobID": jobID,
                "Title": details["Title"],
                "DaysOld": details["DaysOld"],
                "Link": details["Link"],
                "Status": details["Status"]
            })
        newListings.sort(key=lambda job: job["DaysOld"])
        jobListings[0]["Jobs"] = newListings
        return jobListings[0]