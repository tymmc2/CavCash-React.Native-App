import * as Actions from '../../constants/ReduxConstants';

// Add alert to front
export const addAlert = alert => ({
    type: Actions.ADD_ALERT,
    alert
});

// Clear all current alerts
export const clearAlerts = () => ({
    type: Actions.CLEAR_ALERTS
});

// Add loader to front
export const addLoader = () => ({
    type: Actions.ADD_LOADER
});

// Clear current loader
export const clearLoader = () => ({
    type: Actions.CLEAR_LOADER
});