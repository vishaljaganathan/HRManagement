import axios from 'axios';
import ImportedURL from '../utils/api'


export function AC_LIST_DOCUMENT(params) {
    try {
        return async function (dispatch) {
            const response = await axios.get(ImportedURL.API.listDocument, { params });
            dispatch({ type: "LIST_DOCUMENT", payload: response.data });
        }
    } catch (error) {
        console.error('------------- Error fetching Documents:', error);
    }
}

export function AC_HANDLECHANGE_DOCUMENT(name, value) {
    return function (dispatch) {
        console.log("action",name, value)
        dispatch({ type: "HANDLECHANGE_DOCUMENT", name: name, value: value });
    }
}

export function AC_VIEW_DOCUMENT(ID) {
    try {
        return async function (dispatch) {
            const response = await axios.post(ImportedURL.API.viewDocument + `/${ID}`);
            dispatch({ type: 'VIEW_DOCUMENT', payload: response.data })
        }
    } catch (error) {
        console.error('------------- Error fetching Documents:', error);
    }
}



export function AC_CLEAR_DOCUMENT(params) {
    return function (dispatch) {
        dispatch({ type: 'CLEAR_DOCUMENT' })
    }
}

