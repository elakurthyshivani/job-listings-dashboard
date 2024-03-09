import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './IconButton.scss';

export function IconButton(props)    {
    return ( // Add button
        <span className={props.customClass + " p-2 icon d-flex align-items-center justify-content-center"} 
                data-bs-toggle="tooltip" title={props.tooltip}>
            <FontAwesomeIcon icon={props.icon} />
        </span>
    );
}