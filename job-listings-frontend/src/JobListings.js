import {React} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect, useContext } from 'react';
import './JobListings.scss';
import { CompanyNameContext } from './Context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

const status = ["Not Applied", "New", "Applied"];
const statusClasses = ["not-applied", "new", "applied"];

function Job(props)  {
    return (
        <tr className={statusClasses[props.job.Status]}>
            <td><div>
                <input type="checkbox" name={props.job.JobID} onChange={toggleJobSelection} />
            </div></td>
            <td><div>{ props.job.JobID }</div></td>
            <td className="col-6">
                <div><a href={props.job.Link} target="_blank">{ props.job.Title }</a></div>
            </td>
            <td className={"text-center days-old " + (props.job.DaysOld <= 7 ? "within-week" : 
                                                (props.job.DaysOld <=30 ? "within-month" : ""))}>
                <div>{ props.job.DaysOld }</div>
            </td>
            <td className="job-status">
                <div>
                    <span className="rounded-pill">
                        { status[props.job.Status] }
                        <span className="ms-2 edit-icon">
                            <FontAwesomeIcon icon={faChevronDown} />
                        </span>
                    </span>
                    
                </div>
            </td>
            <td>
                <div className="icons d-flex justify-content-center">
                    <span className="icon d-flex justify-content-center align-items-center" data-bs-toggle="tooltip" 
                            title="Marks as seen. Sets the Status to 'Not Applied'">
                        <FontAwesomeIcon icon={faTrashCan} />
                    </span>
                </div>
            </td>
            {/* <td><FontAwesomeIcon icon={faEllipsisVertical} /></td> */}
        </tr>
    );
}

const toggleJobSelection = (e) => {
    try {
        var parentNode = e.target.parentNode.parentNode;
        if (parentNode.classList.contains("selected"))
            parentNode.classList.remove("selected");
        else    
            parentNode.classList.add("selected");
    } 
    catch (e)  {
        console.log(e);
    }
};

function Jobs(props)  {
    return (
        <>
            { props.jobsList.map((job) => <Job job={job} key={job.JobID} />) }
        </>
    );
}

function JobListings() {
    const companyName = useContext(CompanyNameContext);
    const url = "https://job-listings-dashboard.azurewebsites.net/companies/" + companyName;

    const [jobs, setJobs] = useState("");
    const getJobs = async () => {
        const response = await fetch(url, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                Accept: 'application/json'
            }    
        });
        try {
            const json = await response.json();
            setJobs(json);
        }
        catch   {
            setJobs({"error": "Error loading data"});
        }
    }
    useEffect(() => {
        getJobs();
    }, [companyName]);

    return (
        <main className="table-responsive col h-100 p-4">
            <header>
                <div className="fw-bold fs-2">{companyName}</div>
            </header>
            <table className="table">
                <tbody>
                    <tr className="p-2">
                        <th><div><input type="checkbox" name="select-all" /></div></th>
                        <th>Job ID</th>
                        <th>Title</th>
                        <th className="text-center">Days Old</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                    { Object.keys(jobs).includes("data") ?
                        (Object.keys(jobs.data).includes("Jobs") ?
                            <Jobs jobsList={jobs.data.Jobs} /> : 
                            <></>) :
                        <></> }
                </tbody>
            </table>
        </main>
    );
}

export default JobListings;