import React from 'react';
import { Link } from 'react-router-dom';
function Leftnav(props) {
  return (
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <ul class="nav">
        <li class="nav-item nav-profile">
          <a href="#" class="nav-link">
            <div class="nav-profile-image">
              <img src="assets/images/faces/face1.jpg" alt="profile" />
              <span class="login-status online"></span>
            </div>
            <div class="nav-profile-text d-flex flex-column">
              <span class="font-weight-bold mb-2">David Grey. H</span>
              <span class="text-secondary text-small">Project Manager</span>
            </div>
            <i class="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
          </a>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to="/">
            <span class="menu-title">Dashboard</span>
            <i class="mdi mdi-home menu-icon"></i>
          </Link>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-bs-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
            <span class="menu-title">Masters</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-crosshairs-gps menu-icon"></i>
          </a>
          <div class="collapse" id="ui-basic">
            <ul class="nav flex-column sub-menu">
            <li class="nav-item">
                <Link class="nav-link" to="/Listemployee">
                  <span class="menu-title">Employee</span>
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/Listfaq">
                  <span class="menu-title">Faq</span>
                </Link>
              </li>              
              <li class="nav-item">
                <Link class="nav-link" to="/Listdepartment">
                  <span class="menu-title">Department</span>
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/Listdocument">
                  <span class="menu-title">Document</span>
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/leave">
                  <span class="menu-title">Leave</span>
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/Listpolicy">
                  <span class="menu-title">Policy</span>
                </Link>
              </li>

            </ul>
          </div>
        </li>
        
        {/* <li class="nav-item">
          <Link class="nav-link" to="/Listfaq">
            <span class="menu-title">Faq</span>
            <i class="mdi mdi-contacts menu-icon"></i>
          </Link>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="pages/forms/basic_elements.html">
            <span class="menu-title">Forms</span>
            <i class="mdi mdi-format-list-bulleted menu-icon"></i>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="pages/charts/chartjs.html">
            <span class="menu-title">Charts</span>
            <i class="mdi mdi-chart-bar menu-icon"></i>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="pages/tables/basic-table.html">
            <span class="menu-title">Tables</span>
            <i class="mdi mdi-table-large menu-icon"></i>
          </a>
        </li> */}
        {/* <li class="nav-item">
          <a class="nav-link" data-bs-toggle="collapse" href="#general-pages" aria-expanded="false" aria-controls="general-pages">
            <span class="menu-title">Sample Pages</span>
            <i class="menu-arrow"></i>
            <i class="mdi mdi-medical-bag menu-icon"></i>
          </a>
          <div class="collapse" id="general-pages">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item"> <a class="nav-link" href="pages/samples/blank-page.html"> Blank Page </a></li>
              <li class="nav-item"> <a class="nav-link" href="pages/samples/login.html"> Login </a></li>
              <li class="nav-item"> <a class="nav-link" href="pages/samples/register.html"> Register </a></li>
              <li class="nav-item"> <a class="nav-link" href="pages/samples/error-404.html"> 404 </a></li>
              <li class="nav-item"> <a class="nav-link" href="pages/samples/error-500.html"> 500 </a></li>
            </ul>
          </div>
        </li> */}
      </ul>
    </nav>
  );
}

export default Leftnav;
