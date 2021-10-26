import * as Actions from '../../constants/ReduxConstants';

const initState = {
    toID: '',
    amount: '0',
    description: ''
};

export const newTransactionReducer = (state = initState, action) => {
    switch (action.type) {
        case Actions.SAVE_NEW_TRANSACTION_DETAILS:
            return {
                ...state,
                [action.detail.name]: action.detail.value
            };
        default:
            return state;
    }
};