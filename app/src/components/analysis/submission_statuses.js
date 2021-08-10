export const SUBMISSION_STATUSES = {
    LOCAL_ERROR: 'local_error',
    LOCAL_SUCCESS: 'local_success',
    TOO_LARGE_TO_SUBMIT: 'too_large_to_submit',
    SUCCESS_SUBMITTING: 'success_submitting',
    ERROR_SUBMITTING: 'error_submitting',
};

export const SUBMISSION_MESSAGES = {
    [SUBMISSION_STATUSES.LOCAL_ERROR]: {
        severity: "error",
        message: "Your submission could not be successfully saved to your device due to an application error."
    },
    [SUBMISSION_STATUSES.LOCAL_SUCCESS]: {
        severity: "success",
        message: "Your submission was successfully saved to your device."
    },
    [SUBMISSION_STATUSES.TOO_LARGE_TO_SUBMIT]: {
        severity: "warning",
        message: "Your submission was too large to submit to your senior responsible officer but was nonetheless saved to your device."
    },
    [SUBMISSION_STATUSES.SUCCESS_SUBMITTING]: {
        severity: "success",
        message: "Your submission was successfully saved and shared with your senior responsible officer."
    },
    [SUBMISSION_STATUSES.ERROR_SUBMITTING]: {
        severity: "error",
        message: "Your submission could not be saved and shared with your senior responsible officer due to an application error."
    },
};
