import { useState, useEffect } from 'react';
import './CompaniesList.scss';

function Navigation() {
    const [companies, setCompanies] = useState("");
    const getData = async () => {
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
        getData();
    }, []);
    return (
        <nav className="nav flex-column col-2 h-100 p-3" role="tablist" aria-orientation="vertical">
            { Object.keys(companies).includes("data") ? 
                companies.data.map((companyName) => <button className="nav-link active" key={companyName} type="button" role="tab">{companyName}</button>) : 
                companies.error }
        </nav>
    );
}

export default Navigation;