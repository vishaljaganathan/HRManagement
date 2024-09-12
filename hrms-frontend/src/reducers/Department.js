const initialState = {
    department: {
        name: '',
        description: ''
    },
    listdepartment: null,
}
// Object.assign({}, state,)
const departmentReducer = (state = initialState, action) => {
    // console.log('------state-----', state, action);
    switch (action.type) {
        case 'LIST_DEPARTMENT':
            return {
                ...state,
                listdepartment: action.payload ? action.payload : null,
            }
        case 'HANDLECHANGE_DEPARTMENT':
            return Object.assign({}, state, {
                department: {
                    ...state.department,
                    [action.name]: action.value
                }
            })
        case 'VIEW_DEPARTMENT':
            return {
                ...state,
                department: action.payload ? action.payload : null,
            }
        case 'CLEAR_DEPARTMENT':
            return {
                ...state,
                department: initialState.department,
            }
        default:
            return state;
            break;
    }
}
export default departmentReducer;