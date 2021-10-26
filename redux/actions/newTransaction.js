import * as Actions from '../../constants/ReduxConstants';

// Save new transactions details between pages
export const saveNewTransactionDetails = detail => ({
    type: Actions.SAVE_NEW_TRANSACTION_DETAILS,
    detail
});