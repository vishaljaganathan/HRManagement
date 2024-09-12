import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import axios from 'axios';

import { AC_CLEAR_FAQ, AC_HANDLECHANGE_FAQ, AC_LIST_FAQ, AC_VIEW_FAQ } from '../../../actions/Faq';
import ImportedUrl from '../../../utils/api';
import { Error, Success } from '../../../utils/Swalalermsg';




function Listfaq(props) {
    const [questionError, setQuestionError] = useState(false);
    const [answareError, setAnswareError] = useState(false);
    const [modelType, setModelType] = useState('Add');
    const dispatch = useDispatch();
    const fetchFaqs = async () => {
        try {
            await AC_LIST_FAQ()(dispatch); // Call AC_LIST_FAQ and pass dispatch
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    // Access entire state 
    const listFaqReducer = useSelector((state) => state.faqReducer);

    const data = {
        listfaq: listFaqReducer.listfaq,
        question: listFaqReducer.faq && listFaqReducer.faq.question,
        answare: listFaqReducer.faq && listFaqReducer.faq.answare,
    }
    console.log('data', data);
    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        if (name === 'question') {
            if (value) {
                setQuestionError(false)
            } else {
                setQuestionError(true)
            }
        }
        if (name === 'answare') {
            if (value) {
                setAnswareError(false)
            } else {
                setAnswareError(true)
            }
        }
        dispatch(AC_HANDLECHANGE_FAQ(name, value))
    }
    const handleClick = () => {
        let data = listFaqReducer.faq;
        let valid = 1;
        if (!data.question) {
            setQuestionError(true);
            valid = 0
        }
        if (!data.answare) {
            setAnswareError(true);
            valid = 0
        }

        if (valid) {
            if (modelType === 'Add') {
                axios.post(ImportedUrl.API.addFaq, data)
                    .then(res => {
                        AC_CLEAR_FAQ()(dispatch);
                        AC_LIST_FAQ()(dispatch);
                        Success('Faq added successfully');
                        document.getElementById('closeModel').click();
                    })
                    .catch(err => {
                        let error = err.response?.status
                        if (error == 409) {
                            Error('Data is already exists!')
                        }
                    })
            } else {
                axios.post(ImportedUrl.API.updateFaq + `/${data._id}`, data)
                    .then(res => {
                        AC_CLEAR_FAQ()(dispatch);
                        AC_LIST_FAQ()(dispatch);
                        Success('Faq updated successfully')
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
        dispatch(AC_VIEW_FAQ(ID));
    }
    const handleUpdate = (ID) => {
        setModelType('Edit');
        dispatch(AC_VIEW_FAQ(ID));
    }
    const handleClose = () => {
        AC_CLEAR_FAQ()(dispatch);
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
                        AC_LIST_FAQ()(dispatch);
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
                axios.get(ImportedUrl.API.softDeleteFaq + `/${ID}`)
                    .then(res => {
                        AC_LIST_FAQ()(dispatch);
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
                <h3 class="page-title"> FAQ's </h3>
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
                            <h4 class="card-title">List Faq</h4>
                            <button type="button" class="btn btn-gradient-primary btn-fw" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => setModelType('Add')}>Add Faq</button>
                        </div>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Question</th>
                                    <th>Answare</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.listfaq && data.listfaq.length > 0 ? data.listfaq.map(data => {
                                    return <tr key={data._is}>
                                        <td>{data.question}</td>
                                        <td>{data.answare}</td>
                                        <td ><label style={{ cursor: "pointer" }} class={`badge ${data.status === true ? 'badge-success' : 'badge-danger'}`} onClick={() => handleStatus(data._id, 'faqs')}>{data.status === true ? 'Active' : 'Inactive'}</label></td>
                                        <td>
                                            <i class="mdi mdi-eye" onClick={() => handleView(data._id)} data-bs-toggle="modal" data-bs-target="#staticBackdrop"></i>
                                            <i class="mdi mdi-pencil-box" onClick={() => handleUpdate(data._id)} data-bs-toggle="modal" data-bs-target="#staticBackdrop" ></i>
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
                                        <h5 class="modal-title" id="staticBackdropLabel">{modelType} Faq</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                                    </div>
                                    {modelType === 'View' ?
                                        <div class="modal-body">
                                            <h5>{data.question}</h5>
                                            <p>{data.answare}</p>
                                        </div>
                                        :
                                        <>
                                            <div class="modal-body">
                                                <div class="form-group">
                                                    <label for="exampleInputUsername1">Question<code>*</code></label>
                                                    <input type="text" name='question' value={data.question} onChange={handleChange} class="form-control" id="exampleInputUsername1" placeholder="Question" autoComplete='off' />
                                                    <code style={{ display: questionError ? 'block' : 'none' }}>Question is required</code>
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleTextarea1">Answare<code>*</code></label>
                                                    <textarea class="form-control" id="exampleTextarea1" value={data.answare} onChange={handleChange} rows="6" name='answare' placeholder="Answare"></textarea>
                                                    <code style={{ display: answareError ? 'block' : 'none' }}>Answare is required</code>
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

export default Listfaq;