import axios from 'axios';
import ImportedURL from '../utils/api'


export function AC_LIST_DEPARTMENT(params) {
    try {
        return async function (dispatch) {
            const response = await axios.get(ImportedURL.API.listDepartment, { params });
            dispatch({ type: "LIST_DEPARTMENT", payload: response.data });
        }
    } catch (error) {
        console.error('------------- Error fetching DEPARTMENTs:', error);
    }
}

export function AC_HANDLECHANGE_DEPARTMENT(name, value) {
    return function (dispatch) {
        dispatch({ type: "HANDLECHANGE_DEPARTMENT", name: name, value: value });
    }
}

export function AC_VIEW_DEPARTMENT(ID) {
    try {
        return async function (dispatch) {
            const response = await axios.post(ImportedURL.API.viewDepartment + `/${ID}`);
            dispatch({ type: 'VIEW_DEPARTMENT', payload: response.data })
        }
    } catch (error) {
        console.error('------------- Error fetching DEPARTMENTs:', error);
        
    }
}



export function AC_CLEAR_DEPARTMENT(params) {
    return function (dispatch) {
        dispatch({ type: 'CLEAR_DEPARTMENT' })
    }
}

