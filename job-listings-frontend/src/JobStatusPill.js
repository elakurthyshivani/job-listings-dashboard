import './JobStatusPill.scss';
import { status, statusClasses } from './Constants';

// Component: JobStatusPill
function JobStatusPill(props)  {
    return (
        <span className={statusClasses[props.status] + " rounded-pill"}>
            { status[props.status] }
        </span>
    );
}

export default JobStatusPill;