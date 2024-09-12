const initialState = {
    employee: {
        name: '',
        email: '',
        position: '',
        hireDate: ''
    },
    listEmployees: null,
};

const employeeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LIST_EMPLOYEES':
            return {
                ...state,
                listEmployees: action.payload ? action.payload : null,
            };
        case 'HANDLECHANGE_EMPLOYEE':
            return Object.assign({}, state, {
                employee: {
                    ...state.employee,
                    [action.name]: action.value
                }
            });
        case 'VIEW_EMPLOYEE':
            return {
                ...state,
                employee: action.payload ? action.payload : null,
            };
        case 'CLEAR_EMPLOYEE':
            return {
                ...state,
                employee: initialState.employee,
            };
        default:
            return state;
    }
};

export default employeeReducer;
