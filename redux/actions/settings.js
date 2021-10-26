import * as Actions from '../../constants/ReduxConstants';

// Update given setting
export const updateSetting = setting => ({
    type: Actions.UPDATE_SETTING,
    setting
});