import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AC_CLEAR_DEPARTMENT, AC_HANDLECHANGE_DEPARTMENT, AC_LIST_DEPARTMENT, AC_VIEW_DEPARTMENT } from '../../../actions/Department';
import ImportedUrl from '../../../utils/api';
import { Error, Success } from '../../../utils/Swalalermsg';
import downloadPDF from '../export/downloadPDF';
import downloadExcel from '../export/downloadExcel'; 

function Listdepartment(props) {
    const [nameError, setNameError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [modelType, setModelType] = useState('Add');
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false); 
    const dispatch = useDispatch();

    const fetchDepartments = async () => {
        try {
            await AC_LIST_DEPARTMENT()(dispatch); // Call AC_LIST_DEPARTMENT and pass dispatch
        } catch (error) {
            console.error('Error fetching DEPARTMENTs:', error);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const listDepartmentReducer = useSelector((state) => state.departmentReducer);
    const data = {
        listdepartment: listDepartmentReducer.listdepartment || [], // Default to empty array
        name: listDepartmentReducer.department && listDepartmentReducer.department.name,
        description: listDepartmentReducer.department && listDepartmentReducer.department.description,
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
        if (name === 'description') {
            if (value) {
                setDescriptionError(false);
            } else {
                setDescriptionError(true);
            }
        }
        dispatch(AC_HANDLECHANGE_DEPARTMENT(name, value));
    };

    const handleClick = () => {
        let data = listDepartmentReducer.department;
        let valid = 1;
        if (!data.name) {
            setNameError(true);
            valid = 0;
        }
        if (!data.description) {
            setDescriptionError(true);
            valid = 0;
        }

        if (valid) {
            if (modelType === 'Add') {
                axios.post(ImportedUrl.API.addDepartment, data)
                    .then(res => {
                        AC_CLEAR_DEPARTMENT()(dispatch);
                        AC_LIST_DEPARTMENT()(dispatch);
                        Success('Department added successfully');
                        document.getElementById('closeModel').click();
                    })
                    .catch(err => {
                        let error = err.response?.status;
                        if (error === 409) {
                            Error('Data is already exists!');
                        }
                    });
            } else {
                axios.post(ImportedUrl.API.updateDepartment + `/${data._id}`, data)
                    .then(res => {
                        AC_CLEAR_DEPARTMENT()(dispatch);
                        AC_LIST_DEPARTMENT()(dispatch);
                        Success('Department updated successfully');
                        document.getElementById('closeModel').click();
                    })
                    .catch(err => {
                        let error = err.response?.status;
                        if (error === 409) {
                            Error('Data is already exists!');
                        }
                    });
            }
        }
    };

    const handleView = (ID) => {
        setModelType('View');
        dispatch(AC_VIEW_DEPARTMENT(ID));
    };

    const handleUpdate = (ID) => {
        setModelType('Edit');
        dispatch(AC_VIEW_DEPARTMENT(ID));
    };

    const handleClose = () => {
        AC_CLEAR_DEPARTMENT()(dispatch);
    };

    const handleStatus = (ID, Modal) => {
        Swal.fire({
            title: "Are you sure to change status?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.get(ImportedUrl.API.statusChange + `/${ID}/${Modal}`)
                    .then(res => {
                        AC_LIST_DEPARTMENT()(dispatch);
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
                axios.get(ImportedUrl.API.softDeleteDepartment + `/${ID}`)
                    .then(res => {
                        AC_LIST_DEPARTMENT()(dispatch);
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                    })
                    .catch(err => {
                        throw err;
                    });
            }
        });
    };

    const handleCheckboxChange = (id) => {
        setSelectedRows(prevSelectedRows => {
            const newSelectedRows = new Set(prevSelectedRows);
            if (newSelectedRows.has(id)) {
                newSelectedRows.delete(id);
            } else {
                newSelectedRows.add(id);
            }
            return newSelectedRows;
        });
    };

    const handleSelectAllChange = (event) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);
        setSelectedRows(isChecked ? new Set(data.listdepartment.map(dept => dept._id)) : new Set());
    };

    useEffect(() => {
        if (data.listdepartment && data.listdepartment.length > 0) {
            setSelectAll(
                data.listdepartment.every(dept => selectedRows.has(dept._id))
            );
        } else {
            setSelectAll(false);
        }
    }, [selectedRows, data.listdepartment]);

    const exportData = (data.listdepartment || [])
        .filter(dept => selectedRows.has(dept._id))
        .map(dept => ({
            col1: dept.name,
            col2: dept.description,
            col3: dept.status ? 'Active' : 'Inactive'
        }));

    const headers = ['Name', 'Description', 'Status']; // Dynamic headers

    const handleExportPDF = () => {
        const title = "Department";
        downloadPDF(exportData, title, headers);
    };

    const handleExportExcel = () => {
        const title = "Department";
        downloadExcel(exportData, title, headers);
    };

    return (
        <>
            <div className="page-header">
                <h3 className="page-title"> DEPARTMENT's </h3>
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
                            <h4 className="card-title">List Department</h4>
                            <button
                                type="button"
                                className="btn btn-gradient-primary btn-fw"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                                onClick={() => setModelType('Add')}
                            >
                                Add Department
                            </button>
                        </div>
                        {data.listdepartment.length > 0 ? (
                            <>
                                <div className='d-flex justify-content-end mb-4'>
                                    <button className="btn btn-outline-primary btn-sm me-2" onClick={handleExportPDF}>Download PDF</button>
                                    <button className="btn btn-outline-primary btn-sm" onClick={handleExportExcel}>Download Excel</button>
                                </div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"   kallila irunthu sapdala solli thitranga
                                                    checked={selectAll}
                                                    onChange={handleSelectAllChange}
                                                />
                                            </th>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.listdepartment.map((item) => (
                                            <tr key={item._id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRows.has(item._id)}
                                                        onChange={() => handleCheckboxChange(item._id)}
                                                    />
                                                </td>
                                                <td>{item.name}</td>
                                                <td>{item.description}</td>
                                                <td ><label style={{ cursor: "pointer" }} class={`badge ${item.status === true ? 'badge-success' : 'badge-danger'}`} onClick={() => handleStatus(item._id, 'departments')}>{item.status === true ? 'Active' : 'Inactive'}</label></td>
                                                <td>
                                                    <i className="mdi mdi-eye" onClick={() => handleView(item._id)} data-bs-toggle="modal" data-bs-target="#staticBackdrop"></i>
                                                    <i className="mdi mdi-pencil" onClick={() => handleUpdate(item._id)} data-bs-toggle="modal" data-bs-target="#staticBackdrop"></i>
                                                    <i className="mdi mdi-delete" onClick={() => handleDelete(item._id)}></i>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <p>No departments available</p>
                        )}

                        {/* <!-- Modal --> */}
                        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="staticBackdropLabel">{modelType} Department</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                                    </div>
                                    {modelType === 'View' ? (
                                        <div className="modal-body">
                                            <h5>{data.name}</h5>
                                            <p>{data.description}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="modal-body">
                                                <div className="form-group">
                                                    <label htmlFor="exampleInputUsername1">Name<code>*</code></label>
                                                    <input
                                                        type="text"
                                                        name='name'
                                                        value={data.name || ''}
                                                        onChange={handleChange}
                                                        className="form-control"
                                                        id="exampleInputUsername1"
                                                        placeholder="Name"
                                                        autoComplete='off'
                                                    />
                                                    <code style={{ display: nameError ? 'block' : 'none' }}>Name is required</code>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="exampleTextarea1">Description<code>*</code></label>
                                                    <textarea
                                                        className="form-control"
                                                        id="exampleTextarea1"
                                                        value={data.description || ''}
                                                        onChange={handleChange}
                                                        rows="6"
                                                        name='description'
                                                        placeholder="Description"
                                                    ></textarea>
                                                    <code style={{ display: descriptionError ? 'block' : 'none' }}>Description is required</code>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" id='closeModel' data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                                                <button type="button" className="btn btn-primary" onClick={handleClick}>{modelType === 'Add' ? 'Save' : 'Update'} </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Listdepartment;
