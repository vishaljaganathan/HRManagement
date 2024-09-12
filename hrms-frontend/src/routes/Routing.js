import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Leftnav from '../components/layouts/Leftnav';
import Index from '../components/pages/dashboard/Index';
import Listfaq from '../components/pages/faqs/Listfaq';
import Listdepartment from '../components/pages/departments/Listdepartment';
import Listdocument from '../components/pages/document/Listdocument';
import Leave from '../components/pages/leave/Leave';
import Footer from '../components/layouts/Footer';
import Listpolicy from '../components/pages/policy/Listpolicy';
import Listemployee from '../components/pages/emploies/Listemployee';



import MyComponent1 from '../components/pages/test/MyComponent1';
import MyComponent2 from '../components/pages/test/MyComponent2';

function Routing() {
    return (
        <Router>
            <div class="container-scroller">
                <Header />
                <div class="container-fluid page-body-wrapper">
                    <Leftnav />
                    <div class="main-panel">
                        <div class="content-wrapper">
                            <Routes>
                                <Route path="/" element={<Index />} />
                                <Route path="/Listfaq" element={<Listfaq />} />
                                <Route path="/Listdepartment" element={<Listdepartment />} />
                                <Route path="/Listdocument" element={<Listdocument />} />
                                <Route path="/leave" element={<Leave />} />
                                <Route path="/Listpolicy" element={<Listpolicy />} />
                                <Route path="/Listemployee" element={Listemployee} />
                                <Route path="/MyComponent1" element={<MyComponent1/>}/>
                                <Route path="/MyComponent2" element={<MyComponent2/>}/>
                            </Routes>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        </Router>

    );
}

export default Routing;
