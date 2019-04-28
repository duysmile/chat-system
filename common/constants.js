const constants = {
    ERROR: {
        DATABASE: 'Database error.',
        INVALID_INTEGER: 'Id is not an integer.',
        NOT_EXISTED_USER: 'User id is not existed.',
        EXISTED_USERNAME: 'Username is existed.',
        COMMON: 'Opps, something went wrong.',
        REQUIRED_USERNAME: 'Username is a required field.',
        REQUIRED_PASSWORD: 'Password is a required field.'
    },
    SUCCESS: {
        GET_LIST_USERS: 'Get list users successfully.',
        GET_USER_BY_ID: 'Get user by id successfully.',
        CREATE_USER: 'Create new user successfully.',
        DELETE_USER: 'Deleting user by id successfully.',
        UPDATE_USER: 'Update user successfully.'
    }
};

module.exports = Object.freeze(constants);