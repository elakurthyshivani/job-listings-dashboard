import './Spinner.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function Spinner() {
    return (
        <div className="spinner d-flex justify-content-center h-75 align-items-center w-100">
            <span>Loading &nbsp;</span>
            <span className="spinner-icon">
                <FontAwesomeIcon icon={faSpinner} />
            </span>
        </div>
    );
}

export default Spinner;