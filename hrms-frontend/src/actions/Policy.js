import axios from 'axios';
import ImportedURL from '../utils/api';

// Action to list all policies
export function AC_LIST_POLICY(params) {
    try {
        return async function (dispatch) {
            const response = await axios.get(ImportedURL.API.listPolicy, { params });
            dispatch({ type: "LIST_POLICY", payload: response.data });
        }
    } catch (error) {
        console.error('------------- Error fetching policies:', error);
    }
}

// Action to handle changes in the policy form fields
export function AC_HANDLECHANGE_POLICY(name, value) {
    return function (dispatch) {
        dispatch({ type: "HANDLECHANGE_POLICY", name: name, value: value });
    }
}

// Action to view a specific policy by ID
export function AC_VIEW_POLICY(ID) {
    try {
        return async function (dispatch) {
            const response = await axios.get(ImportedURL.API.viewPolicy + `/${ID}`);
            dispatch({ type: 'VIEW_POLICY', payload: response.data });
        }
    } catch (error) {
        console.error('------------- Error fetching policy details:', error);
    }
}

// Action to clear the policy state
export function AC_CLEAR_POLICY() {
    return function (dispatch) {
        dispatch({ type: 'CLEAR_POLICY' });
    }
}
