import axios from 'axios';
import ImportedURL from '../utils/api'


export function AC_ADD_LEAVE(params) {
    try {
        return {
            type: 'LIST_LEAVE',
            payload: params,
        }
    } catch (error) {
        console.error('------------- Error fetching Leave:', error);
    }
}

export function AC_HANDLECHANGE_LEAVE(params) {
    return function (dispatch) {
        dispatch({ type: "HANDLECHANGE_FAQ", params });
    }
}

export function AC_CLEAR_LEAVE(params) {
    try {
        return {
            type: 'CLEAR_LEAVE',
        }
    } catch (error) {
        console.error('------------- Error deleting Leave:', error);
    }
}
