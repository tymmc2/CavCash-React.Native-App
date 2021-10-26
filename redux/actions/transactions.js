import * as Actions from '../../constants/ReduxConstants';

// Save transaction list
export const saveList = list => ({
    type: Actions.SAVE_TRANSACTIONS,
    list
});

// Clear current transaction list
export const clearList = () => ({
    type: Actions.CLEAR_TRANSACTIONS
});

// Fetch transactions actions
export const fetchTransactionsBegin = () => ({
    type: Actions.FETCH_TRANSACTIONS_BEGIN
});

export const fetchTransactionsSuccess = (transactions, lastId) => ({
    type: Actions.FETCH_TRANSACTIONS_SUCCESS,
    payload: { transactions, lastId }
});

export const fetchTransactionsFailure = error => ({
    type: Actions.FETCH_TRANSACTIONS_FAILURE,
    payload: { error }
});