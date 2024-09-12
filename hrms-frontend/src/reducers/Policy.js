const initialState = {
    policy: {
        policyName: '',
        policyDescription: '',
        policyCategory: '',
        effectiveDate: '',
        expirationDate: '',
        policyDocument: '',
        policyOwner: '',
        policyApprover: '',
        versionNumber: 1,
        comments: ''
    },
    listPolicy: [], // Ensure this is initialized as an empty array
}

const policyReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LIST_POLICY':
            return {
                ...state,
                listPolicy: action.payload || [],
            };
        case 'HANDLECHANGE_POLICY':
            return {
                ...state,
                policy: {
                    ...state.policy,
                    [action.name]: action.value
                }
            }
        case 'VIEW_POLICY':
            return {
                ...state,
                policy: action.payload || initialState.policy,
            }
        case 'CLEAR_POLICY':
            return {
                ...state,
                policy: initialState.policy,
            }
        default:
            return state;
    }
}

export default policyReducer;
