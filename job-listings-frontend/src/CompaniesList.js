import { useState, useEffect } from 'react';
import './CompaniesList.scss';


function Navigation() {
    const [currCompany, setCurrCompany] = useState("");
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
    
    return (
        <nav className="nav col-2 h-100 p-3" role="tablist" aria-orientation="vertical">
            { Object.keys(companies).includes("data") ? 
                companies.data.map((companyName) => <button className={companyName == currCompany? "nav-link active w-100" : "nav-link w-100" }
                                                            key={companyName} type="button" 
                                                            role="tab">{companyName}</button>) : 
                companies.error }
        </nav>
    );
}

export default Navigation;