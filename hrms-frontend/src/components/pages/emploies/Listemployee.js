import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';

import { AC_CLEAR_EMPLOYEE, AC_HANDLECHANGE_EMPLOYEE, AC_LIST_EMPLOYEES, AC_VIEW_EMPLOYEE } from '../../../actions/Employee';
import ImportedUrl from '../../../utils/api';
import { Error, Success } from '../../../utils/Swalalermsg';

function ListEmployee(props) {
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [modelType, setModelType] = useState('Add');
    const dispatch = useDispatch();

    const fetchEmployees = async () => {
        try {
            await AC_LIST_EMPLOYEES()(dispatch); // Call AC_LIST_EMPLOYEES and pass dispatch
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const listEmployeeReducer = useSelector((state) => state.employeeReducer);

    const data = {
        listEmployee: listEmployeeReducer.listEmployee,
        name: listEmployeeReducer.employee && listEmployeeReducer.employee.name,
        email: listEmployeeReducer.employee && listEmployeeReducer.employee.email,
        position: listEmployeeReducer.employee && listEmployeeReducer.employee.position,
        hireDate: listEmployeeReducer.employee && listEmployeeReducer.employee.hireDate,
    };

    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        if (name === 'name') {
            if (value) {
                setNameError(false);
            } else {
                setNameError(true);
            }
        }
        if (name === 'email') {
            if (value) {
                setEmailError(false);
            } else {
                setEmailError(true);
            }
        }
        dispatch(AC_HANDLECHANGE_EMPLOYEE(name, value));
    };

    const handleClick = () => {
        let data = listEmployeeReducer.employee;
        let valid = 1;
        if (!data.name) {
            setNameError(true);
            valid = 0;
        }
        if (!data.email) {
            setEmailError(true);
            valid = 0;
        }

        if (valid) {
            if (modelType === 'Add') {
                axios.post(ImportedUrl.API.addEmployee, data)
                    .then(res => {
                        AC_CLEAR_EMPLOYEE()(dispatch);
                        AC_LIST_EMPLOYEES()(dispatch);
                        Success('Employee added successfully');
                        document.getElementById('closeModel').click();
                    })
                    .catch(err => {
                        let error = err.response?.status;
                        if (error === 409) {
                            Error('Employee already exists!');
                        }
                    });
            } else {
                axios.post(ImportedUrl.API.updateEmployee + `/${data._id}`, data)
                    .then(res => {
                        AC_CLEAR_EMPLOYEE()(dispatch);
                        AC_LIST_EMPLOYEES()(dispatch);
                        Success('Employee updated successfully');
                        document.getElementById('closeModel').click();
                    })
                    .catch(err => {
                        let error = err.response?.status;
                        if (error === 409) {
                            Error('Employee already exists!');
                        }
                    });
            }
        }
    };

    const handleView = (ID) => {
        setModelType('View');
        dispatch(AC_VIEW_EMPLOYEE(ID));
    };

    const handleUpdate = (ID) => {
        setModelType('Edit');
        dispatch(AC_VIEW_EMPLOYEE(ID));
    };

    const handleClose = () => {
        AC_CLEAR_EMPLOYEE()(dispatch);
    };

    const handleStatus = (ID, Modal) => {
        Swal.fire({
            title: "Are you sure to change status?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.get(ImportedUrl.API.statusChangeEmployee + `/${ID}/${Modal}`)
                    .then(res => {
                        AC_LIST_EMPLOYEES()(dispatch);
                        Swal.fire({
                            title: "Status changed!",
                            text: "Your status has been updated.",
                            icon: "success"
                        });
                    })
                    .catch(err => {
                        throw err;
                    });
            }
        });
    };

    const handleDelete = (ID) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.get(ImportedUrl.API.softDeleteEmployee + `/${ID}`)
                    .then(res => {
                        AC_LIST_EMPLOYEES()(dispatch);
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your record has been deleted.",
                            icon: "success"
                        });
                    })
                    .catch(err => {
                        throw err;
                    });
            }
        });
    };

    return (
        <>
            <div className="page-header">
                <h3 className="page-title"> Employees </h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#">Forms</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Form elements</li>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <div className='d-flex justify-content-between mb-4'>
                            <h4 className="card-title">List Employees</h4>
                            <button type="button" className="btn btn-gradient-primary btn-fw" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => setModelType('Add')}>Add Employee</button>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Position</th>
                                    <th>Hire Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.listEmployees && data.listEmployees.length > 0 ? data.listEmployees.map(employee => {
                                    return (
                                        <tr key={employee._id}>
                                            <td>{employee.name}</td>
                                            <td>{employee.email}</td>
                                            <td>{employee.position}</td>
                                            <td>{employee.hireDate}</td>
                                            <td>
                                                <label style={{ cursor: "pointer" }} className={`badge ${employee.status === true ? 'badge-success' : 'badge-danger'}`} onClick={() => handleStatus(employee._id, 'employees')}>
                                                    {employee.status === true ? 'Active' : 'Inactive'}
                                                </label>
                                            </td>
                                            <td>
                                                <i className="mdi mdi-eye" onClick={() => handleView(employee._id)} data-bs-toggle="modal" data-bs-target="#staticBackdrop"></i>
                                                <i className="mdi mdi-pencil-box" onClick={() => handleUpdate(employee._id)} data-bs-toggle="modal" data-bs-target="#staticBackdrop"></i>
                                                <i className="mdi mdi-delete" onClick={() => handleDelete(employee._id)}></i>
                                            </td>
                                        </tr>
                                    );
                                }) : null}
                            </tbody>
                        </table>
                        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="staticBackdropLabel">{modelType} Employee</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                                    </div>
                                    {modelType === 'View' ?
                                        <div className="modal-body">
                                            <h5>{data.name}</h5>
                                            <p>{data.email}</p>
                                            <p>{data.position}</p>
                                            <p>{data.hireDate}</p>
                                        </div>
                                        :
                                        <>
                                            <div className="modal-body">
                                                <div className="form-group">
                                                    <label>Name<code>*</code></label>
                                                    <input type="text" name='name' value={data.name} onChange={handleChange} className="form-control" placeholder="Name" autoComplete='off' />
                                                    <code style={{ display: nameError ? 'block' : 'none' }}>Name is required</code>
                                                </div>
                                                <div className="form-group">
                                                    <label>Email<code>*</code></label>
                                                    <input type="email" name='email' value={data.email} onChange={handleChange} className="form-control" placeholder="Email" autoComplete='off' />
                                                    <code style={{ display: emailError ? 'block' : 'none' }}>Email is required</code>
                                                </div>
                                                <div className="form-group">
                                                    <label>Position</label>
                                                    <input type="text" name='position' value={data.position} onChange={handleChange} className="form-control" placeholder="Position" autoComplete='off' />
                                                </div>
                                                <div className="form-group">
                                                    <label>Hire Date</label>
                                                    <input type="date" name='hireDate' value={data.hireDate} onChange={handleChange} className="form-control" />
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" id='closeModel' data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                                                <button type="button" className="btn btn-primary" onClick={handleClick}>{modelType === 'Add' ? 'Save' : 'Update'}</button>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ListEmployee;
