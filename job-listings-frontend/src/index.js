import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import './index.scss';
import Navigation from './CompaniesList';
import JobListings from './JobListings';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <div className="d-flex align-items-start w-100 h-100">
            <Navigation />
            <JobListings />
        </div>
    </React.StrictMode>
);
