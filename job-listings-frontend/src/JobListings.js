import {React} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect, useContext, useRef } from 'react';
import './JobListings.scss';
import { CompanyNameContext, AllCheckedContext } from './Context';
import Spinner from './Spinner';
import NoResults from './NoResults';

const status = ["Not Applied", "New", "Applied"];
const statusClasses = ["not-applied", "new", "applied"];

// Component: Job
function Job(props)  {
    const [setAllChecked, isChecked, setIsChecked,
            selectedJobCount, setSelectedJobCount,
            allCheckedRef] = useContext(AllCheckedContext);

    return (
        <tr className={statusClasses[props.job.Status] + " job-row"}>
            {/* Column: Checkbox */}
            <td>
                <div>
                    <input className="form-check-input" type="checkbox" 
                        name={props.job.JobID} 
                        checked={isChecked[props.index]} 
                        onChange={(e) => toggleJobSelection(e, props.index, isChecked, setIsChecked,
                                                            setAllChecked, selectedJobCount, 
                                                            setSelectedJobCount, allCheckedRef)} 
                        />
                </div>
            </td>

            {/* Column: JobID */}
            <td><div>{ props.job.JobID }</div></td>

            {/* Column: Job Title */}
            <td className="col-6">
                <div><a href={props.job.Link} target="_blank">{ props.job.Title }</a></div>
            </td>

            {/* Column: Days Old */}
            <td className={"text-center days-old " + (props.job.DaysOld <= 7 ? "within-week" : 
                                                (props.job.DaysOld <=30 ? "within-month" : ""))}>
                <div>{ props.job.DaysOld }</div>
            </td>

            {/* Column: Job Status */}
            <td className="job-status">
                <div>
                    <span className="rounded-pill">
                        { status[props.job.Status] }
                    </span>
                </div>
            </td>
        </tr>
    );
}

// Component: Jobs
function Jobs(props)  {
    return (
        <>
            { props.jobsList.map((job, index) => <Job job={job} key={job.JobID} index={index} />) }
        </>
    );
}

// Event Listener
// --------------
// Toggles the target checkbox
const toggleJobSelection = (e, index, isChecked, setIsChecked, setAllChecked, 
                            selectedJobCount, setSelectedJobCount, allCheckedRef) => {
    try {
        // Toggle check for target checkbox
        const updatedCheckedState = isChecked.map((check, i) =>
            i === index ? !check : check
        );
        setIsChecked(updatedCheckedState);

        // Updates count of selected jobs
        const currSelectedCount = !isChecked[index] ? selectedJobCount + 1 : selectedJobCount - 1;
        setSelectedJobCount(currSelectedCount);

        // If all jobs are selected or de-selected
        if(currSelectedCount === isChecked.length || currSelectedCount === 0) {
            setAllChecked(currSelectedCount === isChecked.length);
            allCheckedRef.current.indeterminate = false;
        }  
        else    {
            allCheckedRef.current.indeterminate = true;
        }

        // Toggle "selected" class in the <tr> parent for the target checkbox.
        var parentNode = e.target.parentNode.parentNode.parentNode;
        if(!isChecked[index])    {
            parentNode.classList.add("selected");
        }  
        else    {
            parentNode.classList.remove("selected");
        }
    } 
    catch (err)  {
        console.log(err);
    }
};

// Event Listener
// --------------
// Toggles the checkbox in the table header
// Selects or de-selects all jobs
const toggleAllJobsSelection = (allChecked, setAllChecked, isChecked, setIsChecked,
                                setSelectedJobCount, allCheckedRef) => {
    try {
        // Toggle "select-all" checkbox
        setAllChecked(!allChecked);
        allCheckedRef.current.indeterminate = false;
        setIsChecked(isChecked.map(() => !allChecked));

        // Update count of selected jobs
        setSelectedJobCount(!allChecked ? isChecked.length : 0);

        // Toggle "selected" class in the target's <tr>.
        var jobRows = document.querySelectorAll("tr.job-row");
        for(var i = 0; i < jobRows.length; i++)  {
            if(!allChecked)
                jobRows[i].classList.add("selected");
            else
                jobRows[i].classList.remove("selected");
        }
    } 
    catch (err)  {
        console.log(err);
    }
};

function JobListings() {
    // Used to maintain state for the checkboxes
    const allCheckedRef = useRef();
    const [allChecked, setAllChecked] = useState(false);
    const [isChecked, setIsChecked] = useState([]);
    const [selectedJobCount, setSelectedJobCount] = useState(0);

    const companyName = useContext(CompanyNameContext);
    const url = "https://job-listings-dashboard.azurewebsites.net/companies/" + companyName;

    const [jobs, setJobs] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    // Gets jobs from the API
    const getJobs = async () => {
        setIsLoading(true);
        const response = await fetch(url, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                Accept: 'application/json'
            }    
        });
        try {
            const json = await response.json();
            setJobs(json);

            // Reset checkboxes state
            setAllChecked(false);
            setIsChecked(new Array(json.data.Jobs.length).fill(false));
            setSelectedJobCount(0);
            if (allCheckedRef.current != null)
                allCheckedRef.current.indeterminate = false;
          
            setIsLoading(false);
        }
        catch   {
            setJobs({"error": "Error loading data"});

            // Reset checkboxes state
            setAllChecked(false);
            setIsChecked([]);
            setSelectedJobCount(0);
            if (allCheckedRef.current != null)
                allCheckedRef.current.indeterminate = false;
          
            setIsLoading(false);
        }
    }
    // Call the API each time the "companyName" is changed.
    useEffect(() => {
        getJobs();
    }, [companyName]);

    return (
        <main className="table-responsive col h-100 w-100 p-4">
            <header>
                <div className="fw-bold fs-2">{companyName}</div>
            </header>
            { isLoading ? 
                <Spinner /> :
                <table className="table">
                    <tbody>
                        <tr className="p-2">
                            <th>
                                <div>
                                    <input id="select-all" className="form-check-input" type="checkbox" 
                                            name="select-all" ref={allCheckedRef} checked={allChecked}
                                            onChange={() => toggleAllJobsSelection(allChecked, setAllChecked,
                                                                                isChecked, setIsChecked,
                                                                                setSelectedJobCount,
                                                                                allCheckedRef)} />
                                </div>
                            </th>
                            <th>Job ID</th>
                            <th>Title</th>
                            <th className="text-center">Days Old</th>
                            <th>Status</th>
                        </tr>
                        { Object.keys(jobs).includes("data") ?
                            (Object.keys(jobs.data).includes("Jobs") ?
                            <AllCheckedContext.Provider 
                                value={[setAllChecked, isChecked, setIsChecked,
                                        selectedJobCount, setSelectedJobCount, allCheckedRef]}>
                                <Jobs jobsList={jobs.data.Jobs} />
                            </AllCheckedContext.Provider> : 
                                <></>) :
                            <></> }
                    </tbody>
                    { Object.keys(jobs).includes("data") && Object.keys(jobs.data).includes("Jobs") &&
                        jobs.data.Jobs.length == 0 ? 
                        <caption>
                            <NoResults />
                        </caption> : <></>
                    }
                </table>
            }
        </main>
    );
}

export default JobListings;