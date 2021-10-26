import { SERVER_ADDRESS } from "@env";

// URL for webviews
export const WEBSITE_URL = "https://dev.cavcash.com";

// Home page
export const MONTHLY_REPORT = `${SERVER_ADDRESS}/api/user/analytics/daybyday`;
export const GET_USER_INFO = `${SERVER_ADDRESS}/api/user`;
export const GET_TRANSACTIONS = `${SERVER_ADDRESS}/api/user/transactions`;

// Account settings
export const GET_PLAID_TOKEN = `${SERVER_ADDRESS}/api/Developer/plaid/link_token`;
export const SEND_BANK_DETAILS_FRONT = `${SERVER_ADDRESS}/api/User`;
export const SEND_BANK_DETAILS_END = "bank/dwolla";
export const ADD_DEVICE = `${SERVER_ADDRESS}/api/user/devices`;

// New transaction
export const GET_FEE = `${SERVER_ADDRESS}/api/user/transactions/fees`;
export const SEND_MONEY = `${SERVER_ADDRESS}/api/user/transactions`;

// Login
export const AUTH_USER = `${SERVER_ADDRESS}/api/User/auth?level=basic`;