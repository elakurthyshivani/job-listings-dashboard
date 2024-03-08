import {React} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useContext } from 'react';

import './JobListings.scss';
import { CheckedContext } from './Context';
import { statusClasses } from './Constants';
import JobStatusPill from './JobStatusPill';

// Component: Job
export function Job(props)  {
    const [setAllChecked, isChecked, setIsChecked,
            selectedJobCount, setSelectedJobCount,
            allCheckedRef] = useContext(CheckedContext);

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
                    <JobStatusPill status={props.job.Status} />
                    {/* <span className={statusClasses[props.job.Status] + " rounded-pill"}>
                        { status[props.job.Status] }
                    </span> */}
                </div>
            </td>
        </tr>
    );
}

// Component: Jobs
export function Jobs(props)  {
    return (
        <>
            { props.jobsList.map((job, index) => <Job job={job} key={job.JobID} index={index} />) }
        </>
    );
}

// Event Listener
// --------------
// Toggles the target checkbox
export const toggleJobSelection = (e, index, isChecked, setIsChecked, setAllChecked, 
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
export const toggleAllJobsSelection = (allChecked, setAllChecked, isChecked, setIsChecked,
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
