import {React, useState, useEffect, useContext, useMemo} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './Body.scss';
import JobListings from './JobListings';
import { CompanyNameContext } from './Context';
import { EnableBootstrapTooltips } from './EnableBootstrapTooltips';

const siteTypes = {"own-site-job-listings": "Own Site", 
                    "group-1-job-listings": "JIBE Apply", 
                    "workday-job-listings": "Workday",
                    "eightfold-ai-job-listings": "Eightfold.ai",
                    "phs-job-listings": "PHS"};

function NavItem(props) {
    return (
        <button className={"nav-link w-100 fw-bold d-flex justify-content-between " + (props.companyName == props.currentCompany? "active" : "") }
                key={props.companyName} type="button" 
                name={props.companyName} role="tab"
                onClick={props.showJobs}>
            <span>{props.companyName}</span>
            {props.newJobsCount > 0 ? <span className="new-jobs-count-pill d-flex justify-content-center align-items-center">{props.newJobsCount}</span> : <></>}
        </button>
    );
}

function Body() {
    EnableBootstrapTooltips();

    const [currCompany, setCurrCompany] = useState(useContext(CompanyNameContext));
    const [companies, setCompanies] = useState("");
    const getCompanies = async () => {
        const response = await fetch('https://job-listings-dashboard.azurewebsites.net/api/companies/', {
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
        console.log(e.target.localName);
        if(e.target.localName == "button")
            setCurrCompany(e.target.name);
        else
            setCurrCompany(e.target.parentNode.name);
    };

    return (
        <div className="outer-container d-flex align-items-start w-100 h-100 flex-row flex-wrap">
            <CompanyNameContext.Provider value={useMemo(() => currCompany)}>
                <nav className="nav col-xl-2 col-lg-3 col-md-4 col-12 h-100 py-3 px-4" role="tablist" aria-orientation="vertical">
                    <div className="w-100 logo-container d-flex justify-content-between align-items-center">
                        <img src="favicon.png" />
                        <span>
                            <span className="add-new-company icon d-flex justify-content-center align-items-center"
                                data-bs-toggle="tooltip" title="Add a new company">
                            </span>
                        </span>
                        {/* <div className="fw-bold">Job Listings Dashboard</div> */}
                    </div>
                    
                    { Object.keys(companies).includes("data") ? 
                        Object.keys(companies.data).map(category => 
                            <>
                                <div className="w-100 fw-bold pb-2 pt-3 site-category">{siteTypes[category]}</div>
                                { companies.data[category].map((company) => <NavItem key={company["CompanyName"]}
                                                                                    companyName = {company["CompanyName"]} 
                                                                                    currentCompany = {currCompany}
                                                                                    newJobsCount = {company["NewJobsCount"]}
                                                                                    showJobs = {showJobs} />) }
                            </> ) : 
                        companies.error}

                    {/* { Object.keys(companies).includes("data") ? 
                        companies.data.map((companyName) => <NavItem key={companyName.id}
                                                                companyName = {companyName.id} 
                                                                currentCompany = {currCompany}
                                                                showJobs = {showJobs} />) : 
                        companies.error } */}
                </nav>
                { 
                    currCompany === "" ? 
                        <div className="home-div col-xl-10 col-lg-9 col-md-8 col-12 h-100 bg-light">
                            &nbsp;
                        </div> : 
                        <JobListings /> }
            </CompanyNameContext.Provider>
        </div>
    );
}

export default Body;