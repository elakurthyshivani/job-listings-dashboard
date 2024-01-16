import { useState, useEffect } from 'react';
import './JobListings.scss';

const status = ["Not Applied", "New", "Applied"];
const statusClasses = ["not-applied", "new", "applied"];

function Job(props)  {
    return (
        <tr className={"p-1 " + statusClasses[props.job.Status]}>
            <td>{ props.job.JobID }</td>
            <td className="col-6">
                <a href={props.job.Link} target="_blank">{ props.job.Title }</a>
            </td>
            <td className="text-center">{ props.job.DaysOld }</td>
            <td className="job-status">
                <span className="rounded-pill">{ status[props.job.Status] }</span>
            </td>
            <td></td>
        </tr>
    );
}

function Jobs(props)  {
    return (
        <>
            { props.jobsList.map((job) => <Job job={job} key={job.JobID} />) }
        </>
    );
}

function JobListings() {
    const [jobs, setJobs] = useState("");
    const getJobs = async () => {
        const response = await fetch('https://job-listings-dashboard.azurewebsites.net/companies/Discover', {
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
    }, []);

    return (
        <main className="table-responsive col h-100 p-3">
            <header className="fw-bold fs-1">
                Company Name
            </header>
            <table className="table">
                <tbody>
                    <tr className="p-1">
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