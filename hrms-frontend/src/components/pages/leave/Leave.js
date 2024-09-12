import React, { useState, useEffect } from 'react'
import { AC_ADD_LEAVE } from '../../../actions/Leave.js'
import { useDispatch, useSelector } from 'react-redux';



const Leave = () => {
    const dispatch = useDispatch();

    const listLeaveReducer = useSelector((state) => state.leaveReducer);

    // const listLeave = {
    //     leave: listLeaveReducer.data.leave,
    //     fromDate: listLeaveReducer.data.fromDate,
    //     toDate: listLeaveReducer.data.toDate,
    //     reason: listLeaveReducer.data.reason,
    // }


    console.log("reducer", listLeaveReducer.data)

    const [inputValue, setInputValue] = useState(
        [{
            leaveType: '',
            fromDate: '',
            toDate: '',
            reason: '',
        }])
    const [validLeaveType, setvalidLeaveType] = useState('');
    const [validFromDate, setValidFromDate] = useState('');
    const [validToDate, setValidToDate] = useState('');
    const [validReason, setValidReason] = useState('')
    const [validLettersInReasons, setValidLettersInReasons] = useState('')

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInputValue({ ...inputValue, [name]: value })
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(inputValue.leaveType);

        if (inputValue.leaveType) {
            setvalidLeaveType(false)
        } else {
            setvalidLeaveType(true)
        }
        if (inputValue.fromDate) {
            setValidFromDate(false)
        } else {
            setValidFromDate(true)
        }
        if (inputValue.toDate) {
            setValidToDate(false)
        } else {
            setValidToDate(true)
        }
        if (inputValue.reason) {
            setValidReason(false)
            if (inputValue.reason.length > 4) {
                setValidLettersInReasons(false)
            } else {
                setValidLettersInReasons(true)
            }
        } else {
            setValidReason(true)
        }

        if (!validLeaveType && !validFromDate && !validToDate && !validReason && !validLettersInReasons) {
            dispatch(AC_ADD_LEAVE(inputValue))
            document.getElementById('closeModel').click();
        }

    };

    return (
        <>
            <div class="page-header">
                <h3 class="page-title"> LEAVE</h3>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="#">Forms</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Form elements</li>
                    </ol>
                </nav>
            </div>


            <div class="card p-5">
                <div class="d-flex justify-content-between">
                    <div class="">
                        <h4>Leave List </h4>
                    </div>
                    <div class="">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Add Leave
                        </button>
                    </div>
                </div>

                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                {/* <th scope="col">#</th> */}
                                <th scope="col">Leave Type</th>
                                <th scope="col">From Date</th>
                                <th scope="col">To Date</th>
                                <th scope="col">Reason</th>
                                <th scope="col">Actions</th>
                                {/* <th scope="col">Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {/* {listLeaveReducer.data != null && listLeaveReducer.data.map((list, index) => {
                                return (
                                    <tr key={index}> 
                                        <td>{list.leaveType}</td>
                                        <td>{list.fromDate}</td>
                                        <td>{list.toDate}</td>
                                        <td>{list.reason}</td>
                                    </tr>
                                )

                            })} */}


                            {listLeaveReducer.data && listLeaveReducer.data.length > 0 ? (
                                listLeaveReducer.data.map((list, index) => (
                                    <tr key={index}>
                                        <td>{list.leaveType}</td>
                                        <td>{list.fromDate}</td>
                                        <td>{list.toDate}</td>
                                        <td>{list.reason}</td>
                                        <td>
                                            {/* <i class="mdi mdi-eye" data-bs-toggle="modal" data-bs-target="#"></i> */}
                                            <i class="mdi mdi-pencil-box" data-bs-toggle="modal" data-bs-target="#" ></i>
                                            <i class="mdi mdi-delete"></i>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>



                {/* modal */}
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Leave Application</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form >
                                    <div class="row">
                                        {/* leave type */}
                                        <div class=" ">
                                            <label class="form-label mt-3" htmlFor="leaveType">Leave Type:</label>
                                            <select class="form-control" id='leavetype' name='leaveType' value={inputValue.leaveType} onChange={handleInput} required>

                                                <option value="">Select leave type</option>
                                                <option value="annual">Annual Leave</option>
                                                <option value="sick">Sick Leave</option>
                                                <option value="unpaid">Unpaid Leave</option>
                                                <option value="maternity">Maternity Leave</option>
                                                <option value="paternity">Paternity Leave</option>
                                                <option value="others">Others</option>
                                            </select>
                                            {validLeaveType ? <label class="text-danger">Select Leave Type</label> : ""}
                                        </div>

                                        {/* from Date */}
                                        <div class=" ">
                                            <label class="form-label mt-3" htmlFor="fromDate">From Date:</label>
                                            <input class="form-control" type='date' id='fromDate' name='fromDate' value={inputValue.fromDate} onChange={handleInput} required />
                                            {validFromDate ? <label class="text-danger">Select From Date </label> : null}
                                        </div>

                                        {/* to date */}
                                        <div class=" ">
                                            <label class="form-label mt-3" htmlFor="toDate">To Date:</label>
                                            <input class="form-control" type='date' id='toDate' name='toDate' value={inputValue.toDate} onChange={handleInput} required />
                                            {validToDate ? <label class="text-danger">Select To Date</label> : null}
                                        </div>

                                        {/* leave Reason */}
                                        <div class=" ">
                                            <label class="form-label mt-3" htmlFor="reason">Reason for Leave:</label>
                                            <textarea class="form-control" id='reason' name='reason' value={inputValue.reason} onChange={handleInput} required>
                                            </textarea>
                                            {validReason ? <label class="text-danger">Reason for the Leave</label> : null}
                                            {validLettersInReasons ? <label class="text-danger">Min 5 character is required</label> : null}
                                        </div>

                                    </div>
                                    {/* submit  */}
                                    {/* <div>
                                        <button class="btn" type="submit">Submit Application</button>
                                    </div> */}
                                    <div class="modal-footer">
                                        <button type="button" id='closeModel' class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" class="btn btn-primary" onClick={handleSubmit} >Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Leave