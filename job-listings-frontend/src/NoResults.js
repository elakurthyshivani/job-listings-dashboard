import './NoResults.scss';

function NoResults() {
    return (
        <div className="no-results w-100 d-flex flex-column justify-content-center align-items-center p-4">
            <img src="no_results.png" />
            <span className="pt-4">No jobs found</span>
        </div>
    );
}

export default NoResults;