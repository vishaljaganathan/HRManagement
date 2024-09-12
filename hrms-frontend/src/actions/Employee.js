import axios from 'axios';
import ImportedURL from '../utils/api';

// Action to list all employees
export function AC_LIST_EMPLOYEES(params) {
    try {
        return async function (dispatch) {
            const response = await axios.get(ImportedURL.API.listEmployees, { params });
            dispatch({ type: "LIST_EMPLOYEES", payload: response.data });
        }
    } catch (error) {
        console.error('------------- Error fetching employees:', error);
    }
}

// Action to handle form changes for employee details
export function AC_HANDLECHANGE_EMPLOYEE(name, value) {
    return function (dispatch) {
        dispatch({ type: "HANDLECHANGE_EMPLOYEE", name: name, value: value });
    }
}

// Action to view a specific employee by ID
export function AC_VIEW_EMPLOYEE(ID) {
    try {
        return async function (dispatch) {
            const response = await axios.post(ImportedURL.API.viewEmployee + `/${ID}`);
            dispatch({ type: 'VIEW_EMPLOYEE', payload: response.data });
        }
    } catch (error) {
        console.error('------------- Error fetching employee details:', error);
    }
}

// Action to clear employee data (e.g., form reset)
export function AC_CLEAR_EMPLOYEE() {
    return function (dispatch) {
        dispatch({ type: 'CLEAR_EMPLOYEE' });
    }
}

// Action to add a new employee
export function AC_ADD_EMPLOYEE(employeeData) {
    try {
        return async function (dispatch) {
            const response = await axios.post(ImportedURL.API.addEmployee, employeeData);
            dispatch({ type: 'ADD_EMPLOYEE', payload: response.data });
        }
    } catch (error) {
        console.error('------------- Error adding employee:', error);
    }
}

// Action to update an existing employee
export function AC_UPDATE_EMPLOYEE(ID, employeeData) {
    try {
        return async function (dispatch) {
            const response = await axios.post(ImportedURL.API.updateEmployee + `/${ID}`, employeeData);
            dispatch({ type: 'UPDATE_EMPLOYEE', payload: response.data });
        }
    } catch (error) {
        console.error('------------- Error updating employee:', error);
    }
}

// Action to soft delete an employee
export function AC_SOFTDELETE_EMPLOYEE(ID) {
    try {
        return async function (dispatch) {
            const response = await axios.get(ImportedURL.API.softDeleteEmployee + `/${ID}`);
            dispatch({ type: 'SOFTDELETE_EMPLOYEE', payload: response.data });
        }
    } catch (error) {
        console.error('------------- Error deleting employee:', error);
    }
}
