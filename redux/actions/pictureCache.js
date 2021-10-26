import * as Actions from '../../constants/ReduxConstants';

// Add user profile picture to cache
export const addPicture = (user, picture) => ({
    type: Actions.ADD_PICTURE,
    picture,
    user
});

// Clear local cache of profile pictures
export const clearCache = () => ({
    type: Actions.CLEAR_CACHE
});