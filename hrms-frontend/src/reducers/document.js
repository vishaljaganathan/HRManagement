const initialState = {
    document: {
        employee: '',
        documentTittle: '',
        documentFile: ''
    },
    listdocument: null,
}
// Object.assign({}, state,)
const documentReducer = (state = initialState, action) => {
    // console.log('------state-----', state, action);
    console.log(action.name)
    switch (action.type) {
        case 'LIST_DOCUMENT':
            return {
                ...state,
                listdocument: action.payload ? action.payload : null,
            }
        case 'HANDLECHANGE_DOCUMENT':
            return Object.assign({}, state, {
                document: {
                    ...state.document,
                    [action.name]: action.value
                }
            })
        case 'VIEW_DOCUMENT':
            return {
                ...state,
                document: action.payload ? action.payload : null,
            }
        case 'CLEAR_DOCUMENT':
            return {
                ...state,
                document: initialState.document,
            }
        default:
            return state;
            break;
    }
}
export default documentReducer;