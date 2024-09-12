const initialState = {
    data: [{
        leaveType: 'test',
        fromDate: 'test',
        toDate: 'test',
        reason: 'test',
    }]
}

const leaveReducer = (state = initialState, action) => {
    // console.log('------state-----', state, action);
    switch (action.type) {
        case 'LIST_LEAVE':
            return {
                ...state,
                data: action.payload ? action.payload : null,
            }
        case 'AC_HANDLECHANGE_LEAVE':
            return {
                ...state,
                faq: initialState.faq,
            }
        case 'CLEAR_LEAVE':
            return {
                ...state,
                data: initialState.data,
            }

        default:
            return state;
    }
}
export default leaveReducer;