// lib/constants.js
export const API_ROUTES = {
    REGISTER: '/api/auth/register',
    CHECKMAIL: '/api/auth/check-email',
    CHECKPASSWORD: '/api/auth/check-password',
    GETUSERDETAILS: '/api/auth/check-user',
    UPDATE: '/api/profile/update',
    LOGOUT: '/api/auth/logout',
};

export const MESSAGES = {
    REGISTRATION_SUCCESS: 'You have successfully registered. Please log in to continue.',
    REGISTRATION_FAILURE: 'An error occurred during registration.',
    EMAIL_EXISTS: 'Email not available. Please try another email.',
    LOGOUT_SUCCESS: 'You have successfully logged out.',
    LOGOUT_FAILURE: 'An error occurred while logging out.',
    PROFILE_UPDATE_SUCCESS: 'Your profile has been updated successfully.',
    PROFILE_UPDATE_FAILURE: 'Failed to update your profile. Please try again.',
};

