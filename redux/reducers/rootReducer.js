import { combineReducers } from 'redux';
import { settingsReducer } from './settingsReducer';
import { newTransactionReducer } from './newTransactionReducer';
import alertsReducer from './alertsReducer';
import pictureCacheReducer from './profilePicturesReducer';
import userInfoReducer from './userInfoReducer';
import transactionsReducer from './transactionsReducer';


export default rootReducer = combineReducers({
    settings: settingsReducer,
    newTransaction: newTransactionReducer,
    userInfo: userInfoReducer,
    transactions: transactionsReducer,
    pictureCache: pictureCacheReducer,
    alerts: alertsReducer
});