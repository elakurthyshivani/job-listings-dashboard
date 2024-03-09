import { React, useEffect, useContext } from "react";
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';

import "./Toast.scss";
import { ToastContext } from "./Context";

const removeToast = (toastId, toastMessages, setToastMessages) => {
    var id = 0;
    for(var i = 0; i < toastMessages.length; i++)   {
        if(toastMessages[i].props.id == toastId) {
            id = i;
            break;
        }
    }
    setToastMessages(toastMessages.slice(0, id).
                                    concat(toastMessages.slice(id + 1, toastMessages.length)));
};

export const addToast = (messageTitle, messageBody, toastMessages, setToastMessages,
                        totalToastsCount, setTotalToastsCount) =>   {
    setToastMessages([...toastMessages, 
        <Toast messageTitle={messageTitle}
                messageBody={messageBody}
                key={totalToastsCount}
                id={totalToastsCount} />]);
    setTotalToastsCount(totalToastsCount + 1);
}

export function Toast(props) {
    const [toastMessages, setToastMessages, 
            totalToastsCount, setTotalToastsCount] = useContext(ToastContext);

    useEffect(() => {
        if (toastMessages.length > 5)   {
            setToastMessages(toastMessages.slice(toastMessages.length - 5, toastMessages.length));
        }

        var toasts = document.getElementsByClassName("toast");
        for(var i=0; i<toasts.length; i++)  {
            bootstrap.Toast.getOrCreateInstance(toasts[i]).show();
        }
    }, [toastMessages]);

    return (
        <div className="toast" role="alert" aria-live="assertive" aria-atomic="true" 
                data-bs-autohide="false">
            <div className="toast-header">
            <img src="favicon.png" width="20px" className="rounded me-2" alt="logo" />
            <strong className="me-auto">{props.messageTitle}</strong>
            <button type="button" className="btn-close" aria-label="Close"
                    onClick={() => removeToast(props.id, toastMessages, setToastMessages)}></button>
            </div>
            <div className="toast-body">
                {props.messageBody}
            </div>
        </div>
    );
}