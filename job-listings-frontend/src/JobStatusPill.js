import './JobStatusPill.scss';
import { status, statusClasses } from './Constants';
import { EnableBootstrapTooltips } from './EnableBootstrapTooltips';

// Component: JobStatusPill
function JobStatusPill(props)  {
    EnableBootstrapTooltips();
    
    return (
        <span className={statusClasses[props.status] + " rounded-pill"} 
                data-bs-toggle="tooltip" 
                title={Object.keys(props).includes("tooltip") ? props.tooltip : ""}>
            { status[props.status] }
        </span>
    );
}

export default JobStatusPill;