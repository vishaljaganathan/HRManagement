const initialState = {
    faq: {
        question: '',
        answare: ''
    },
    listfaq: null,
}
// Object.assign({}, state,)
const faqReducer = (state = initialState, action) => {
    // console.log('------state-----', state, action);
    switch (action.type) {
        case 'LIST_FAQ':
            return {
                ...state,
                listfaq: action.payload ? action.payload : null,
            }
        case 'HANDLECHANGE_FAQ':
            return Object.assign({}, state, {
                faq: {
                    ...state.faq,
                    [action.name]: action.value
                }
            })
        case 'VIEW_FAQ':
            return {
                ...state,
                faq: action.payload ? action.payload : null,
            }
        case 'CLEAR_FAQ':
            return {
                ...state,
                faq: initialState.faq,
            }
        default:
            return state;
            break;
    }
}
export default faqReducer;