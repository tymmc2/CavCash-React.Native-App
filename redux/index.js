import Alert from "../components/custom/alert";
import { loggedOut } from "./actions/userInfo";
import { clearAlerts, addAlert } from "./actions/alert";

/**
 * Handle error function intended to work for most server calls.
 * 
 * @param error error from server
 */
export const handleError = (error = null) => dispatch => {
    try {
        error.text().then(text => {
            try {
                const data = JSON.parse(text);
                console.log(data);
                if (error && data.HttpCode === 401) {
                    dispatch(loggedOut());
                    props.navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
                }
                else dispatch(addAlert({ title: 'Uh oh!', hideAlert: () => dispatch(clearAlerts()), body: data.ErrorMessage, visible: true}));
            } catch (e) {
                dispatch(addAlert({ title: 'Oops!', hideAlert: () => dispatch(clearAlerts()), body: 'An unknown error has occurred, please contact CavCash administrators for assistance.', visible: true}));
            }
        });
    } catch {
        dispatch(addAlert({ title: 'Oops!', hideAlert: () => dispatch(clearAlerts()), body: 'An unknown error has occurred, please contact CavCash administrators for assistance.', visible: true}));
    }
}