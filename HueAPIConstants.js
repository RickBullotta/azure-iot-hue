/**
 * 
 */

HueAPIConstants = {
    // HTTP status codes

    APIBase: "/api",

    Collections: {
        LIGHTS: "lights",
        GROUPS: "groups"
    },

    StatusCodes: {
        STATUS_SUCCESS: 200,
        STATUS_CREATED: 201,
        STATUS_ACCEPTED: 202,
        STATUS_NO_CONTENT: 204,
        STATUS_PARTIAL_CONTENT: 206,

        STATUS_NOT_MODIFIED: 304,

        STATUS_BAD_REQUEST: 400,
        STATUS_UNAUTHORIZED: 401,
        STATUS_PAYMENT_REQUIRED: 402,
        STATUS_FORBIDDEN: 403,
        STATUS_NOT_FOUND: 404,
        STATUS_METHOD_NOT_ALLOWED: 405,
        STATUS_NOT_ACCEPTABLE: 406,
        STATUS_REQUEST_TIMEOUT: 408,
        STATUS_CONFLICT: 409,
        STATUS_INTERNAL_ERROR: 500,
        STATUS_NOT_IMPLEMENTED: 501,
        STATUS_BAD_GATEWAY: 502,
        STATUS_SERVICE_UNAVAILABLE: 503,
        STATUS_GATEWAY_TIMEOUT: 504
    },

    RESTConstants: {
        WEBAPP_PATH_DELIMITER: "/",

        URL_QUERY_DELIMITER: "?",
        URL_PARAM_DELIMITER: "&",

        CONTENT_TYPE: "Content-Type",
        ACCEPT_HEADER: "Accept",
    },

    // Supported MIME types

    MimeTypes: {
        MIME_TYPE_JSON: "application/json",
        MIME_TYPE_TEXT: "text/plain"
    }

};

module.exports = HueAPIConstants;
