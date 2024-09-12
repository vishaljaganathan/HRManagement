import { combineReducers } from 'redux';

import faqReducer from './reducers/Faq';

import departmentReducer from './reducers/Department';
import documentReducer from './reducers/document';   
import leaveReducer from './reducers/Leave';
import policyReducer from './reducers/Policy';
import employeeReducer from './reducers/Employee';


export default combineReducers({
    faqReducer,
    departmentReducer,
    documentReducer,
    leaveReducer,
    policyReducer,
    employeeReducer,
})






