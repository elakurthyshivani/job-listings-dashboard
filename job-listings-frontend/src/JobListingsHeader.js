import {React} from 'react';
import { useContext } from 'react';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';

import './JobListingsHeader.scss';
import { CompanyNameContext, HeaderContext } from './Context';
import { status } from './Constants';
import JobStatusPill from './JobStatusPill';
import { IconButton } from './IconButton';

export function JobListingsHeader()    {
    const companyName = useContext(CompanyNameContext);
    const [isChecked, selectedJobCount, isLoading] = useContext(HeaderContext);

    return (
        <header className="d-flex justify-content-between">
            <div className="fw-bold fs-2 col-6 d-flex align-items-center">{companyName}</div>
            <div className="fe-2 col-6">
                { selectedJobCount > 0 && !isLoading ?  
                    <div className="pe-3 py-2 ps-3">
                        <div className="d-flex justify-content-end align-items-center">
                            <div className="pe-4 jobs-selected">
                                <div>
                                    <span className="fw-bold jobs-selected-count">{selectedJobCount}</span> 
                                    &nbsp; Jobs Selected
                                </div>
                            </div>
                            <div className="pe-4">
                                <div className="dropdown">
                                    <button className="btn px-3 py-2" type="button" id="dropdownMenuButton1" 
                                            data-bs-toggle="dropdown" aria-expanded="false">
                                        Edit Status
                                    </button>
                                    <ul className="dropdown-menu pt-1 px-1 pb-2" aria-labelledby="dropdownMenuButton1">
                                        {status.map((value, index) => 
                                            <>
                                                <li className="p-1">
                                                    <a>
                                                        <JobStatusPill status={index} />
                                                    </a>
                                                </li>
                                                { status.length - 1 == index ?
                                                    <></> : 
                                                    <li><hr class="dropdown-divider" /></li> }
                                            </>)}
                                    </ul>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <IconButton class="delete-all" tooltip="Delete all selected jobs" icon={faTrashCan} />
                            </div>
                        </div>
                    </div> :
                    <></> 
                }
            </div>
        </header>
    );
}