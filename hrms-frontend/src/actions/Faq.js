import axios from 'axios';
import ImportedURL from '../utils/api'


export function AC_LIST_FAQ(params) {
    try {
        return async function (dispatch) {
            const response = await axios.get(ImportedURL.API.listFaq, { params });
            dispatch({ type: "LIST_FAQ", payload: response.data });
        }
    } catch (error) {
        console.error('------------- Error fetching FAQs:', error);
    }
}

export function AC_HANDLECHANGE_FAQ(name, value) {
    return function (dispatch) {
        dispatch({ type: "HANDLECHANGE_FAQ", name: name, value: value });
    }
}

export function AC_VIEW_FAQ(ID) {
    try {
        return async function (dispatch) {
            const response = await axios.post(ImportedURL.API.viewFaq + `/${ID}`);
            dispatch({ type: 'VIEW_FAQ', payload: response.data })
        }
    } catch (error) {
        console.error('------------- Error fetching FAQs:', error);
        
    }
}



export function AC_CLEAR_FAQ(params) {
    return function (dispatch) {
        dispatch({ type: 'CLEAR_FAQ' })
    }
}

