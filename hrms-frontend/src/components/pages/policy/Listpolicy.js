import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';
import { AC_CLEAR_POLICY, AC_HANDLECHANGE_POLICY, AC_LIST_POLICY, AC_VIEW_POLICY } from '../../../actions/Policy';
import ImportedUrl from '../../../utils/api';
import { Error, Success } from '../../../utils/Swalalermsg';
import downloadPDF from '../export/downloadPDF';
import downloadExcel from '../export/downloadExcel';

function ListPolicy(props) {
    const [errors, setErrors] = useState({});
    const [modelType, setModelType] = useState('Add');
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const dispatch = useDispatch();

    const fetchPolicies = async () => {
        try {
            console.log('Fetching policies...');
            await dispatch(AC_LIST_POLICY());
            console.log('Policies fetched successfully');
        } catch (error) {
            console.error('Error fetching policies:', error);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, [dispatch]);

    const listPolicyReducer = useSelector((state) => state.policyReducer);
    const data = {
        listPolicy: listPolicyReducer.listPolicy || [],
        policy: listPolicyReducer.policy || {}
    };

    console.log('Data from Redux:', data);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: !value
        }));

        dispatch(AC_HANDLECHANGE_POLICY(name, value));
    };

    const handleClick = async () => {
        const policy = listPolicyReducer.policy;
        const requiredFields = ['policyName', 'policyDescription', 'policyCategory', 'effectiveDate', 'policyOwner', 'policyApprover', 'versionNumber'];
        let valid = true;
    
        requiredFields.forEach(field => {
            if (!policy[field]) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [field]: true
                }));
                valid = false;
            }
        });
    
        if (valid) {
            try {
                const apiCall = modelType === 'Add'
                    ? axios.post(ImportedUrl.API.addPolicy, policy)
                    : axios.post(`${ImportedUrl.API.updatePolicy}/${policy._id}`, policy);
    
                const response = await apiCall;
                console.log('API Response:', response.data);
    
                dispatch(AC_CLEAR_POLICY());
                await dispatch(AC_LIST_POLICY());
                Success(`Policy ${modelType === 'Add' ? 'added' : 'updated'} successfully`);
                document.getElementById('closeModel').click();
            } catch (err) {
                console.error('API Error:', err);
                if (err.response) {
                    console.error('Error Response Data:', err.response.data);
                    console.error('Error Response Status:', err.response.status);
                }
                
            }
        } else {
            Error('Please fill in all required fields.');
        }
    };
    

    const handleView = (ID) => {
        setModelType('View');
        dispatch(AC_VIEW_POLICY(ID));
    };

    const handleUpdate = (ID) => {
        setModelType('Edit');
        dispatch(AC_VIEW_POLICY(ID));
    };

    const handleClose = () => {
        dispatch(AC_CLEAR_POLICY());
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
                if (ID) {
                    axios.get(`${ImportedUrl.API.statusChange}/${ID}/${Modal}`)
                        .then(res => {
                            dispatch(AC_LIST_POLICY());
                            Swal.fire({
                                title: "Status changed!",
                                text: "Your status has been updated.",
                                icon: "success"
                            });
                        })
                        .catch(err => {
                            console.error('Status Change Error:', err);
                        });
                } else {
                    console.error("ID is undefined");
                }
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
                axios.get(`${ImportedUrl.API.softDeletePolicy}/${ID}`)
                    .then(res => {
                        dispatch(AC_LIST_POLICY());
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                    })
                    .catch(err => {
                        console.error('Delete Error:', err);
                    });
            }
        });
    };
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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
        setSelectedRows(isChecked ? new Set(data.listPolicy.map(policy => policy._id)) : new Set());
    };

    useEffect(() => {
        if (data.listPolicy && data.listPolicy.length > 0) {
            setSelectAll(
                data.listPolicy.every(policy => selectedRows.has(policy._id))
            );
        } else {
            setSelectAll(false);
        }
    }, [selectedRows, data.listPolicy]);

    const exportData = (data.listPolicy || [])
        .filter(policy => selectedRows.has(policy._id))
        .map(policy => ({
            col1: policy.policyName,
            col2: policy.policyDescription,
            col3: policy.status ? 'Active' : 'Inactive'
        }));

    const headers = ['Policy Name', 'Policy Description', 'Status'];

    const handleExportPDF = () => {
        const title = "Policy";
        downloadPDF(exportData, title, headers);
    };

    const handleExportExcel = () => {
        const title = "Policy";
        downloadExcel(exportData, title, headers);
    };

    return (
        <>
            <div className="page-header">
                <h3 className="page-title"> Policies </h3>
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
                            <h4 className="card-title">List Policies</h4>
                            <button
                                type="button"
                                className="btn btn-gradient-primary btn-fw"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                                onClick={() => setModelType('Add')}
                            >
                                Add Policy
                            </button>
                        </div>
                        {data.listPolicy.length > 0 ? (
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
                                                    type="checkbox"
                                                    checked={selectAll}
                                                    onChange={handleSelectAllChange}
                                                />
                                            </th>
                                            <th>Policy Name</th>
                                            <th>Policy Description</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.listPolicy.map((item) => (
                                            <tr key={item._id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRows.has(item._id)}
                                                        onChange={() => handleCheckboxChange(item._id)}
                                                    />
                                                </td>
                                                <td>{item.policyName}</td>
                                                <td>{item.policyDescription}</td>
                                                <td>
                                                    <label
                                                        style={{ cursor: "pointer" }}
                                                        className={`badge ${item.status ? 'badge-success' : 'badge-danger'}`}
                                                        onClick={() => handleStatus(item._id, 'policies')}
                                                    >
                                                        {item.status ? 'Active' : 'Inactive'}
                                                    </label>
                                                </td>
                                                <td>
                                                    <i
                                                        className="mdi mdi-eye"
                                                        onClick={() => handleView(item._id)}
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#staticBackdrop"
                                                    ></i>
                                                    <i
                                                        className="mdi mdi-pencil"
                                                        onClick={() => handleUpdate(item._id)}
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#staticBackdrop"
                                                    ></i>
                                                    <i
                                                        className="mdi mdi-delete"
                                                        onClick={() => handleDelete(item._id)}
                                                    ></i>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <p>No policies found.</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{modelType} Policy</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="forms-sample">
                                <div className="form-group">
                                    <label htmlFor="policyName">Policy Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name='policyName'
                                        value={data.policy.policyName || ''}
                                        onChange={handleChange}
                                        readOnly={modelType === 'View'}
                                    />
                                    {errors.policyName && <span className="text-danger">Please enter policy name</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="policyDescription">Policy Description</label>
                                    <textarea
                                        className="form-control"
                                        name='policyDescription'
                                        rows="4"
                                        value={data.policy.policyDescription || ''}
                                        onChange={handleChange}
                                        readOnly={modelType === 'View'}
                                    ></textarea>
                                    {errors.policyDescription && <span className="text-danger">Please enter policy description</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="policyCategory">Policy Category</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name='policyCategory'
                                        value={data.policy.policyCategory || ''}
                                        onChange={handleChange}
                                        readOnly={modelType === 'View'}
                                    />
                                    {errors.policyCategory && <span className="text-danger">Please enter policy category</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="effectiveDate">Effective Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name='effectiveDate'
                                        value={data.policy.effectiveDate ? formatDate(data.policy.effectiveDate) : ''}
                                        onChange={handleChange}
                                        readOnly={modelType === 'View'}
                                    />
                                    {errors.effectiveDate && <span className="text-danger">Please enter effective date</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="expirationDate">Expiration Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name='expirationDate'
                                        value={data.policy.expirationDate ? formatDate(data.policy.expirationDate) : ''}
                                        onChange={handleChange}
                                        readOnly={modelType === 'View'}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="policyDocument">Policy Document</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name='policyDocument'
                                        value={data.policy.policyDocument || ''}
                                        onChange={handleChange}
                                        readOnly={modelType === 'View'}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="policyOwner">Policy Owner</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name='policyOwner'
                                        value={data.policy.policyOwner || ''}
                                        onChange={handleChange}
                                        readOnly={modelType === 'View'}
                                    />
                                    {errors.policyOwner && <span className="text-danger">Please enter policy owner</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="policyApprover">Policy Approver</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name='policyApprover'
                                        value={data.policy.policyApprover || ''}
                                        onChange={handleChange}
                                        readOnly={modelType === 'View'}
                                    />
                                    {errors.policyApprover && <span className="text-danger">Please enter policy approver</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="versionNumber">Version Number</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name='versionNumber'
                                        value={data.policy.versionNumber || ''}
                                        onChange={handleChange}
                                        readOnly={modelType === 'View'}
                                    />
                                    {errors.versionNumber && <span className="text-danger">Please enter version number</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="comments">Comments</label>
                                    <textarea
                                        className="form-control"
                                        name='comments'
                                        rows="4"
                                        value={data.policy.comments || ''}
                                        onChange={handleChange}
                                        readOnly={modelType === 'View'}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        {modelType !== 'View' && (
                            <div className="modal-footer">
                                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary me-2" onClick={handleClick}>{modelType} Policy</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ListPolicy;
