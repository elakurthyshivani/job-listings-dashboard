import {React} from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.css';
import './Body.scss';

function Companies() {

    return (
        <div className="outer-container d-flex align-items-start w-100 h-100 flex-row flex-wrap">
                <nav className="nav col-xl-2 col-lg-3 col-md-4 col-12 h-100 py-3 px-4 align-items-start">
                    <div className="logo-container d-flex justify-content-center align-items-center">
                        <img src="favicon.png" />
                    </div>
                    
                </nav>
                <div className="home-div col-xl-10 col-lg-9 col-md-8 col-12 h-100 bg-light">
                    &nbsp;Hi
                </div>
        </div>
    );
}

export default Companies;