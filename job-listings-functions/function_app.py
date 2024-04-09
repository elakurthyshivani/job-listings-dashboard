import azure.functions as func
import json
import pandas as pd
import pytz
from datetime import datetime
from Enum import JobStatus

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

@app.route(route="siteTypes/{siteType}/companies/{companyName}/newJobsCount")
@app.cosmos_db_input(arg_name="companyDetails", 
                     database_name="job-listings-db",
                     container_name="{siteType}",
                     id="{companyName}",
                     connection=f"COSMOS_CONNECTION")
@app.cosmos_db_input(arg_name="companyNamesIn", 
                      database_name="job-listings-db", 
                      container_name="container-names",
                      id="{companyName}",
                      connection="COSMOS_CONNECTION")
@app.cosmos_db_output(arg_name="companyNamesOut", 
                      database_name="job-listings-db", 
                      container_name="container-names", 
                      connection="COSMOS_CONNECTION")

def new_jobs_count(req: func.HttpRequest, 
                   companyDetails : func.DocumentList, 
                   companyNamesIn : func.DocumentList, 
                   companyNamesOut : func.Out[func.Document]) -> func.HttpResponse:
    if req.method == "POST" or req.method == "PUT":
        companyName = req.route_params.get('companyName')
        if companyDetails and len(companyDetails) > 0 and "Jobs" in companyDetails[0]:
            keys = ["JobID"] 
            for key in companyDetails[0]["Jobs"]:
                keys += list(companyDetails[0]["Jobs"][key].keys())
                break
            jobs = pd.DataFrame([[key] + list(companyDetails[0]["Jobs"][key].values()) for key in companyDetails[0]["Jobs"]], 
                                columns = keys)
            
            newJobsCount = jobs[(jobs.DaysOld <= 1) & (jobs.Status == JobStatus.NEW.value)].shape[0]

            if companyNamesIn and len(companyNamesIn) > 0:
                EST = pytz.timezone('America/New_York')
                companyNamesIn[0]["LastUpdated"] = datetime.now(EST).strftime("%m-%d-%Y %H:%M:%S %Z")
                companyNamesIn[0]["NewJobsCount"] = newJobsCount
                try:
                    companyNamesOut.set(companyNamesIn[0])
                    return func.HttpResponse(json.dumps({"NewJobsCount": newJobsCount, 
                                                         "LastUpdated": companyNamesIn[0]["LastUpdated"]}))
                except Exception as err:
                    return func.HttpResponse(json.dumps({"Error": "Error with Cosmos DB"}),
                                            status_code = 500)
            
            else:
                return func.HttpResponse(json.dumps({"Error": f"No company {companyName}"}),
                                        status_code = 404)

        else:
            return func.HttpResponse(json.dumps({"Error": f"No company {companyName}"}),
                                    status_code = 404)
    else:
        return func.HttpResponse(json.dumps({"Error": f"Invalid method"}),
                                    status_code = 400)