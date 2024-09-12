import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import axios from 'axios';
import { AC_CLEAR_DOCUMENT, AC_HANDLECHANGE_DOCUMENT, AC_LIST_DOCUMENT, AC_VIEW_DOCUMENT } from '../../../actions/document';
import ImportedUrl from '../../../utils/api';
import { Error, Success } from '../../../utils/Swalalermsg';

function Listdocument(props) {
    const documentFile = useRef(null)
    const [employeeError, setEmployeeError] = useState(false);
    const [documentTittleError, setDocumentTittleError] = useState(false);
    const [documentFileError, setDocumentFileError] = useState(false);
    const [modelType, setModelType] = useState('Add');
    const dispatch = useDispatch();
    const fetchDocuments = async () => {
        try {
            await AC_LIST_DOCUMENT()(dispatch); // Call AC_LIST_DOCUMENT and pass dispatch
        } catch (error) {
            console.error("Error fetching Document's:", error);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // Access entire state 
    const listDocumentReducer = useSelector((state) => state.documentReducer);
    const data = {
        listdocument: listDocumentReducer.listdocument,
        employee: listDocumentReducer.document && listDocumentReducer.document.employee,
        documentTittle: listDocumentReducer.document && listDocumentReducer.document.documentTittle,
        documentFile: listDocumentReducer.document && listDocumentReducer.document.documentFile,
    }

    const fetchFile = async (fileData, type) => {
                console.log("response", fileData)
                const fileInput = document.getElementById('documentFile');
        if (fileData) {
            if(type == "add") {
                
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(fileData);
                // fileInput.files = dataTransfer.files;
                documentFile.current.files = dataTransfer.files
                console.log('File in input:', fileInput.files[0]);
            }

            else if(type == "update") {

                
                const response = await fetch(`http://127.0.0.1:4000/uploads/${fileData.documentFile}`);
                const blob = await response.blob();
                const file = new File([blob], fileData.documentFile, { type: blob.type });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                console.log("response")
                documentFile.current.files = dataTransfer.files
                dispatch(AC_HANDLECHANGE_DOCUMENT("documentFile", file))
            }
        }
    }

    const handleChange = (event) => {
        var name = event.target.name;
        if(name == "documentFile") {
            var file = event.target.files[0];
            dispatch(AC_HANDLECHANGE_DOCUMENT(name, file))
            if (name === 'documentFile') {
                if (file.type) {
                    setDocumentFileError(false)
                } else {
                    setDocumentFileError(true)
                }
            }
            fetchFile(file, "add");
        }
        else {
            console.log(document.getElementById('documentFile').files)
            var value = event.target.value;
        dispatch(AC_HANDLECHANGE_DOCUMENT(name, value))
        if (name === 'employee') {
            if (value && value !== "-1") {
                setEmployeeError(false)
            } else {
                setEmployeeError(true)
            }
        }
        if (name === 'documentTittle') {
            if (value) {
                setDocumentTittleError(false)
            } else {
                setDocumentTittleError(true)
            }
        }
        }
        
    }
    const addModel = () => {
        if(modelType != "View") {

            documentFile.current.value = null;
        }
        setModelType('Add')
        // documentFile.current = null
        // document.getElementById("documentFile")
    }
    const handleClick = () => {
        let data = listDocumentReducer.document;
        let valid = 1;
        if (!data.employee && data.employee !== "-1") {
            setEmployeeError(true);
            valid = 0
        }
        if (!data.documentTittle) {
            setDocumentTittleError(true);
            valid = 0
        }
        if (!data.documentFile) {
            setDocumentFileError(true);
            valid = 0
        }

        if (valid) {
            const formData = new FormData();
            formData.append("file", data.documentFile)
            formData.append("employee", data.employee)
            formData.append("documentTittle", data.documentTittle)
            if (modelType === 'Add') {
                axios.post(ImportedUrl.API.addDocument, formData, { headers: { 'Content-Type': 'multipart/form-data', }, })
                    .then(res => {
                        AC_CLEAR_DOCUMENT()(dispatch);
                        AC_LIST_DOCUMENT()(dispatch);
                        Success('Document added successfully');
                        document.getElementById('closeModel').click();
                    })
                    .catch(err => {
                        let error = err.response?.status
                        if (error == 409) {
                            Error('Data is already exists!')
                        }
                    })
            } else {
                console.log(data.documentFile)
                axios.post(ImportedUrl.API.updateDocument + `/${data._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data', }, })
                    .then(res => {
                        AC_CLEAR_DOCUMENT()(dispatch);
                        AC_LIST_DOCUMENT()(dispatch);
                        Success('Document updated successfully')
                        document.getElementById('closeModel').click();
                    })
                    .catch(err => {
                        let error = err.response?.status
                        if (error == 409) {
                            Error('Data is already exists!')
                        }
                    })
            }
        }
    }
    const handleView = (ID) => {
        setModelType('View');
        dispatch(AC_VIEW_DOCUMENT(ID));
    }
    const handleUpdate = (data, ID) => {
        setModelType('Edit');
        dispatch(AC_VIEW_DOCUMENT(ID));
        fetchFile(data, "update");
    }
    const handleClose = () => {
        AC_CLEAR_DOCUMENT()(dispatch);
    }
    const handleStatus = (ID, Modal) => {
        Swal.fire({
            title: "Are you sure to change status?",
            // text: "You won't be able to revert this!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.get(ImportedUrl.API.statusChange + `/${ID}/${Modal}`)
                    .then(res => {
                        AC_LIST_DOCUMENT()(dispatch);
                        Swal.fire({
                            title: "Staus changed!",
                            text: "Your status has been updated.",
                            icon: "success"
                        });
                    })
                    .catch(err => {
                        throw err;
                    })
            }
        });
    }
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
                axios.get(ImportedUrl.API.softDeleteDocument + `/${ID}`)
                    .then(res => {
                        AC_LIST_DOCUMENT()(dispatch);
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                    })
                    .catch(err => {
                        throw err;
                    })

            }
        });
    }
    return (
        <>
            <div class="page-header">
                <h3 class="page-title"> Document's </h3>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="#">Forms</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Form elements</li>
                    </ol>
                </nav>
            </div>
            <div class="col-lg-12 grid-margin stretch-card">
                <div class="card">
                    <div class="card-body">
                        <div className='d-flex justify-content-between mb-4'>
                            <h4 class="card-title">List Document</h4>
                            <button type="button" class="btn btn-gradient-primary btn-fw" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => addModel()}>Add Document</button>
                        </div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Document Tittle</th>
                                    <th>Document</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.listdocument && data.listdocument.length > 0 ? data.listdocument.map(data => {
                                    return <tr key={data._is}>
                                        <td>{data.employee}</td>
                                        <td>{data.documentTittle}</td>
                                        <td>{data.documentFile}</td>
                                        <td ><label style={{ cursor: "pointer" }} class={`badge ${data.status === true ? 'badge-success' : 'badge-danger'}`} onClick={() => handleStatus(data._id, 'document')}>{data.status === true ? 'Active' : 'Inactive'}</label></td>
                                        <td>
                                            <i class="mdi mdi-eye" onClick={() => handleView(data._id)} data-bs-toggle="modal" data-bs-target="#staticBackdrop"></i>
                                            <i class="mdi mdi-pencil-box" onClick={() => handleUpdate(data, data._id)} data-bs-toggle="modal" data-bs-target="#staticBackdrop" ></i>
                                            <i class="mdi mdi-delete" onClick={() => handleDelete(data._id)}></i>
                                        </td>
                                    </tr>
                                }) :
                                    // <tr><td >No record to</td></tr>
                                    null
                                }

                            </tbody>
                        </table>
                        {/* <!-- Modal --> */}
                        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="staticBackdropLabel">{modelType} Document</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                                    </div>
                                    {modelType === 'View' ?
                                        <div class="modal-body">
                                            <h5>{data.employee}</h5>
                                            <p>{data.documentTittle}</p>
                                            <a href={"http://127.0.0.1:4000/uploads/"+ data.documentFile} target="_blank">{data.documentFile}</a>
                                        </div>
                                        :
                                        <>
                                            <div class="modal-body">
                                                <div class="form-group">
                                                    <label for="exampleInputUsername1">Employee<code>*</code></label>
                                                    <select name='employee'  value={data.employee} onChange={handleChange} style={{ height : "48px" }} class="form-control ps-4 text-black" id="exampleInputUsername1" placeholder="Employee" autoComplete='off' >
                                                        <option value="-1">Select</option>
                                                        <option value="Option-1">Option 1</option>
                                                        <option value="Option-2">Option 2</option>
                                                        <option value="Option-n">Option n</option>
                                                    </select>
                                                    <code style={{ display: employeeError ? 'block' : 'none' }}>Employee is required</code>
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInputUsername1">Document Tittle<code>*</code></label>
                                                    <input type="text" name='documentTittle' value={data.documentTittle} onChange={handleChange} class="form-control" id="exampleInputUsername1" placeholder="Document Tittle" autoComplete='off' />
                                                    <code style={{ display: documentTittleError ? 'block' : 'none' }}>Document Tittle is required</code>
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInputUsername1">Document File (e.g., PDF, DOCX, JPG, PNG)<code>*</code></label>
                                                    <input type="file" name='documentFile' ref={documentFile} onChange={handleChange} class="form-control" id="documentFile" autoComplete='off' />
                                                    <code style={{ display: documentFileError ? 'block' : 'none' }}>Document is required</code>
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" id='closeModel' data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                                                <button type="button" class="btn btn-primary" onClick={() => handleClick()}>{modelType === 'Add' ? 'Save' : 'Update'} </button>
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

export default Listdocument;