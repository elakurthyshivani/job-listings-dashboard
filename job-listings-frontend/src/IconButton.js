import {React, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './IconButton.scss';
import { CompanyNameContext, HeaderContext, ToastContext } from './Context';

export function IconButton(props)    {
    const companyName = useContext(CompanyNameContext);
    const headerContext = useContext(HeaderContext);
    const toastContext = useContext(ToastContext);

    return (
        <button onClick={() => props.clickFunction(companyName, headerContext, toastContext)}>
            <span className={props.customClass + " p-2 icon d-flex align-items-center justify-content-center"} 
                    data-bs-toggle="tooltip" title={props.tooltip}>
                <FontAwesomeIcon icon={props.icon} />
            </span>
        </button>
    );
}