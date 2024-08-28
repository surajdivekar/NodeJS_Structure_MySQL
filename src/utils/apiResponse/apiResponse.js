// response.js

const createResponse = (
  status,
  statusCode,
  message,
  result = null,
  error = null
) => ({
  status,
  status_code: statusCode,
  message,
  ...(result !== null && { result }),
  ...(error !== null && { error }),
});

const sendResponse = (
  res,
  statusCode,
  responseBody,
  contentType = "application/json"
) => {
  res.status(statusCode).type(contentType).send(responseBody);
};

const APIResponseUtils = {
  sendResponse: (res, statusCode, message, result = null, error = null) => {
    const response = createResponse(
      statusCode < 400,
      statusCode,
      message,
      result,
      error
    );
    sendResponse(res, statusCode, response);
  },
  sendOkResponse: (res, message = "Success", result = null) =>
    APIResponseUtils.sendResponse(res, 200, message, result),
  sendCreatedResponse: (res, result, message = "Created") =>
    APIResponseUtils.sendResponse(res, 201, message, result),
  sendNoContentResponse: (res) => res.status(204).send(),
  sendBadRequestResponse: (res, message = "Bad Request", error = null) =>
    APIResponseUtils.sendResponse(res, 400, message, null, error),
  sendUnauthorizedResponse: (res, message = "Unauthorized", error = null) =>
    APIResponseUtils.sendResponse(res, 401, message, null, error),
  sendForbiddenResponse: (res, message = "Forbidden", error = null) =>
    APIResponseUtils.sendResponse(res, 403, message, null, error),
  sendNotFoundResponse: (res, message = "Not Found", error = null) =>
    APIResponseUtils.sendResponse(res, 404, message, null, error),
  sendConflictResponse: (res, message = "Conflict", error = null) =>
    APIResponseUtils.sendResponse(res, 409, message, null, error),
  sendInternalServerErrorResponse: (
    res,
    message = "Internal Server Error",
    error = null
  ) => APIResponseUtils.sendResponse(res, 500, message, null, error),
};

module.exports = { APIResponseUtils };

// // response.js

// const successResponse = (
//   status_code = 200,
//   result = [],
//   message = "Success"
// ) => {
//   return {
//     status: true,
//     status_code,
//     message,
//     result,
//   };
// };

// const errorResponse = (status_code = 400, message = "Error", error = null) => {
//   return {
//     status: false,
//     status_code,
//     message,
//     error,
//   };
// };

// const successResponseOnlyMessage = (status_code = 200, message = "Success") => {
//   return {
//     status: true,
//     status_code,
//     message,
//   };
// };

// const errorResponseOnlyMessage = (status_code = 400, message = "Error") => {
//   return {
//     status: false,
//     status_code,
//     message,
//   };
// };

// function sendResponse(
//   res,
//   statusCode,
//   result,
//   contentType = "application/json"
// ) {
//   res.setHeader("Content-Type", contentType);
//   res.status(statusCode).send(result);
// }

// const APIResponseUtils = {
//   sendOkResponse: (res, message = "Success", result = [], contentType) => {
//     sendResponse(res, 200, successResponse(200, result, message), contentType);
//   },
//   sendOkResponseOnlyMessage: (res, message = "Success", contentType) => {
//     sendResponse(
//       res,
//       200,
//       successResponseOnlyMessage(200, message),
//       contentType
//     );
//   },
//   sendCreatedResponse: (res, result, message = "Created", contentType) => {
//     sendResponse(res, 201, successResponse(201, result, message), contentType);
//   },
//   sendAcceptedResponse: (res, result, message = "Accepted", contentType) => {
//     sendResponse(res, 202, successResponse(202, result, message), contentType);
//   },
//   sendNoContentResponse: (res) => {
//     res.status(204).send();
//   },
//   sendBadRequestResponse: (res, message = "Bad Request", error = null) => {
//     sendResponse(res, 400, errorResponse(400, message, error));
//   },
//   sendUnauthorizedResponse: (res, message = "Unauthorized", error = null) => {
//     sendResponse(res, 401, errorResponse(401, message, error));
//   },
//   sendForbiddenResponse: (res, message = "Forbidden", error = null) => {
//     sendResponse(res, 403, errorResponse(403, message, error));
//   },
//   sendNotFoundResponse: (res, message = "Not Found", error = null) => {
//     sendResponse(res, 404, errorResponseOnlyMessage(404, message), error);
//   },
//   sendMethodNotAllowedResponse: (
//     res,
//     message = "Method Not Allowed",
//     error = null
//   ) => {
//     sendResponse(res, 405, errorResponse(405, message, error));
//   },
//   sendConflictResponse: (res, message = "Conflict", error = null) => {
//     sendResponse(res, 409, errorResponse(409, message, error));
//   },
//   sendUnprocessableEntityResponse: (
//     res,
//     message = "Unprocessable Entity",
//     error = null
//   ) => {
//     sendResponse(res, 422, errorResponse(422, message, error));
//   },
//   sendInternalServerErrorResponse: (
//     res,
//     message = "Internal Server Error",
//     error = null
//   ) => {
//     sendResponse(res, 500, errorResponse(500, message, error));
//   },
//   sendNotImplementedResponse: (
//     res,
//     message = "Not Implemented",
//     error = null
//   ) => {
//     sendResponse(res, 501, errorResponse(501, message, error));
//   },
//   sendBadGatewayResponse: (res, message = "Bad Gateway", error = null) => {
//     sendResponse(res, 502, errorResponse(502, message, error));
//   },
//   sendServiceUnavailableResponse: (
//     res,
//     message = "Service Unavailable",
//     error = null
//   ) => {
//     sendResponse(res, 503, errorResponse(503, message, error));
//   },
// };

// module.exports = {
//   APIResponseUtils,
// };
