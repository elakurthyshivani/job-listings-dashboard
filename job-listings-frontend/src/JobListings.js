import {React} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useState, useEffect, useContext, useRef } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

import './JobListings.scss';
import { CompanyNameContext, CheckedContext, HeaderContext } from './Context';
// import { status } from './Constants';
import { JobListingsHeader } from './JobListingsHeader';
import { Jobs, toggleAllJobsSelection } from './Jobs';
import Spinner from './Spinner';
import NoResults from './NoResults';
// import JobStatusPill from './JobStatusPill';

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
            <HeaderContext.Provider 
                value={[isChecked, selectedJobCount, isLoading]}>
                <JobListingsHeader />
            </HeaderContext.Provider>
            
            {/* Show loading when API is called to fetch the data */}
            { isLoading ? 
                <Spinner /> :
                <table className="table">
                    <tbody>
                        <tr className="p-2">
                            <th>
                                <div>
                                    { isChecked.length > 0 ?
                                        <input id="select-all" className="form-check-input" type="checkbox" 
                                                name="select-all" ref={allCheckedRef} checked={allChecked}
                                                onChange={() => toggleAllJobsSelection(allChecked, setAllChecked,
                                                                                    isChecked, setIsChecked,
                                                                                    setSelectedJobCount,
                                                                                    allCheckedRef)} /> : 
                                        <></> }
                                </div>
                            </th>
                            <th>Job ID</th>
                            <th>Title</th>
                            <th className="text-center">Days Old</th>
                            <th>Status</th>
                        </tr>

                        {/* Jobs list */}
                        { Object.keys(jobs).includes("data") ?
                            (Object.keys(jobs.data).includes("Jobs") ?
                            <CheckedContext.Provider 
                                value={[setAllChecked, isChecked, setIsChecked,
                                        selectedJobCount, setSelectedJobCount, allCheckedRef]}>
                                <Jobs jobsList={jobs.data.Jobs} />
                            </CheckedContext.Provider> : 
                                <></>) :
                            <></> }
                    </tbody>

                    {/* When there are no jobs returned */}
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