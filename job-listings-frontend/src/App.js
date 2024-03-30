import {React} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Body from './Body';
import Companies from './Companies';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Body />} />
                <Route path="/companies" element={<Companies />} />
            </Routes>
        </Router>
    );
};

export default App;
