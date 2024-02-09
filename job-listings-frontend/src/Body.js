import { useState, useEffect, useContext, useMemo } from 'react';
import './Body.scss';
import JobListings from './JobListings';
import { CompanyNameContext } from './Context';


function NavItem(props) {
    return (
        <button className={props.companyName == props.currentCompany? "nav-link active w-100" : "nav-link w-100" }
                key={props.companyName} type="button" 
                name={props.companyName} role="tab"
                onClick={props.showJobs}>{props.companyName}</button>
    );
}

function Body() {
    const [currCompany, setCurrCompany] = useState(useContext(CompanyNameContext));
    const [companies, setCompanies] = useState("");
    const getCompanies = async () => {
        const response = await fetch('https://job-listings-dashboard.azurewebsites.net/companies/', {
            headers: {
                "Access-Control-Allow-Origin": "*",
                Accept: 'application/json'
            }    
        });
        try {
            const json = await response.json();
            setCompanies(json);
        }
        catch   {
            setCompanies({"error": "Error loading data"});
        }
    }
    useEffect(() => {
        getCompanies();
    }, []);

    const showJobs = (e) => {
        setCurrCompany(e.target.name);
    };

    return (
        <div className="d-flex align-items-start w-100 h-100">
            <CompanyNameContext.Provider value={useMemo(() => currCompany)}>
                <nav className="nav col-2 h-100 p-3" role="tablist" aria-orientation="vertical">
                    <div className="logo-container d-flex justify-content-center align-items-center">
                        <img src="favicon.png" />
                        <div className="fw-bold">Job Listings Dashboard</div>
                    </div>
                    { Object.keys(companies).includes("data") ? 
                        companies.data.map((companyName) => <NavItem key={companyName}
                                                                companyName = {companyName} 
                                                                currentCompany = {currCompany}
                                                                showJobs = {showJobs} />) : 
                        companies.error }
                </nav>
                <JobListings />
            </CompanyNameContext.Provider>
        </div>
    );
}

export default Body;