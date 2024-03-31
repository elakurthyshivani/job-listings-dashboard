import {useEffect } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';

export function EnableBootstrapTooltips()    {
    // To use Bootstrap Tooltips
    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipTriggerList2 = document.querySelectorAll('[data-bs-toggle-second="tooltip"]');
        [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        [...tooltipTriggerList2].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }, []);
}