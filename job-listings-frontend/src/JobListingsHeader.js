import {React, useContext } from 'react';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

import './JobListingsHeader.scss';
import { CompanyNameContext, HeaderContext, ToastContext } from './Context';
import { status } from './Constants';
import JobStatusPill from './JobStatusPill';
import { IconButton } from './IconButton';
import { addToast } from './Toast';

const updateStatusSelectedJobs = (companyName, status, headerContext, toastContext) => {
    const [isChecked, selectedJobCount, isLoading, setIsLoading, jobs] = headerContext;
    const [toastMessages, setToastMessages, totalToastsCount,
        setTotalToastsCount] = toastContext;

    // JobIds for jobs to update status
    var request = {
        "update": {
            "jobIds": [],
            "status": status
        }
    };
    for(var i = 0; i < isChecked.length; i++)
        if(isChecked[i])
            request["update"]["jobIds"].push(jobs["data"]["Jobs"][i]["JobID"]);

    // Pass request to PUT API endpoint
    const updateEndpointUrl = 'https://job-listings-dashboard.azurewebsites.net/api/companies/' + 
                                companyName + "/jobs/status";

    const updateStatusForJobs = async () => {
        setIsLoading(true);
        const response = await fetch(updateEndpointUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Accept: 'application/json'
            },
            body: JSON.stringify(request)
        });
        try {
            const json = await response.json();
            setIsLoading(false);

            // Show response in toast
            addToast("Update Status for Selected Jobs", 
                    <>
                        {json["data"]["success"] > 0 ?
                            "Successfully updated status for " + json["data"]["success"] + " jobs!" :
                            "" }
                        {json["data"]["fail"] > 0 ? 
                            <><br />{"Failed updating status for " + json["data"]["fail"] + " jobs."}</> :
                            <></> }
                    </>,
                    toastMessages, setToastMessages, 
                    totalToastsCount, setTotalToastsCount);
        }
        catch   {
            setIsLoading(false);
            addToast("Error", 
                    "Error while getting a response while updating status for selected jobs",
                    toastMessages, setToastMessages, 
                    totalToastsCount, setTotalToastsCount);
        }
    }
    updateStatusForJobs();
}

const deleteSelectedJobs = (companyName, headerContext, toastContext) => {
    const [isChecked, selectedJobCount, isLoading, setIsLoading, jobs] = headerContext;
    const [toastMessages, setToastMessages, totalToastsCount,
        setTotalToastsCount] = toastContext;

    // JobIds for jobs to delete
    var request = {
        "delete": {
            "jobIds": []
        }
    };
    for(var i = 0; i < isChecked.length; i++)
        if(isChecked[i])
            request["delete"]["jobIds"].push(jobs["data"]["Jobs"][i]["JobID"]);

    // Pass request to DELETE API endpoint
    const deleteEndpointUrl = 'https://job-listings-dashboard.azurewebsites.net/api/companies/' + 
                                companyName + "/jobs/status";

    const deleteJobs = async () => {
        setIsLoading(true);
        const response = await fetch(deleteEndpointUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Accept: 'application/json'
            },
            body: JSON.stringify(request)
        });
        try {
            const json = await response.json();
            setIsLoading(false);

            // Show response in toast
            addToast("Delete Selected Jobs", 
                    <>
                        {json["data"]["success"] > 0 ?
                            "Successfully deleted " + json["data"]["success"] + " jobs!" :
                            "" }
                        {json["data"]["fail"] > 0 ? 
                            <><br />{"Failed deleting " + json["data"]["fail"] + " jobs."}</> :
                            <></> }
                    </>,
                    toastMessages, setToastMessages, 
                    totalToastsCount, setTotalToastsCount);
        }
        catch   {
            setIsLoading(false);
            addToast("Error", 
                    "Error while getting a response while deleting selected jobs",
                    toastMessages, setToastMessages, 
                    totalToastsCount, setTotalToastsCount);
        }
    }
    deleteJobs();
};


export function JobListingsHeader()    {
    const companyName = useContext(CompanyNameContext);
    const [isChecked, selectedJobCount, isLoading, setIsLoading, jobs] = useContext(HeaderContext);
    const headerContext = useContext(HeaderContext);
    const toastContext = useContext(ToastContext);

    return (
        <header className="d-flex justify-content-between">
            <div className="fw-bold fs-2 col-6 d-flex align-items-center">{companyName}</div>
            <div className="fe-2 col-6">
                { selectedJobCount > 0 && !isLoading ?  
                    <div className="pe-3 py-2 ps-3">
                        <div className="d-flex justify-content-end align-items-center">
                            <div className="pe-4 jobs-selected">
                                <div>
                                    <span className="fw-bold jobs-selected-count">{selectedJobCount}</span> 
                                    &nbsp; Jobs Selected
                                </div>
                            </div>
                            <div className="pe-4">
                                <div className="dropdown">
                                    <button className="btn px-3 py-2" type="button" id="dropdownMenuButton1" 
                                            data-bs-toggle="dropdown" aria-expanded="false" 
                                            data-bs-toggle-second="tooltip" title="Edit status for selected jobs">
                                        Edit Status
                                    </button>
                                    <ul className="dropdown-menu pt-1 px-1 pb-2" aria-labelledby="dropdownMenuButton1">
                                        {status.map((value, index) => 
                                            <div key={index}>
                                                <li className="p-1">
                                                    <button onClick={() => updateStatusSelectedJobs(companyName, index, headerContext, toastContext)}>
                                                        <JobStatusPill status={index} />
                                                    </button>
                                                </li>
                                                { status.length - 1 == index ?
                                                    <></> : 
                                                    <li><hr className="dropdown-divider" /></li> }
                                            </div>)}
                                    </ul>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <IconButton customClass="delete-all" tooltip="Delete all selected jobs" 
                                        icon={faTrashCan} clickFunction={deleteSelectedJobs} />
                            </div>
                        </div>
                    </div> :
                    <></> 
                }
            </div>
        </header>
    );
}