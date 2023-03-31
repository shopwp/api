import isString from "lodash/isString"
import isError from "lodash/isError"
import isArray from "lodash/isArray"
import isObject from "lodash/isObject"
import isEmpty from "lodash/isEmpty"
import forEach from "lodash/forEach"
import has from "lodash/has"

function findErrorMessage(maybeErrorMessage, shopState) {
  if (isString(maybeErrorMessage)) {
    return maybeErrorMessage
  }

  if (isError(maybeErrorMessage)) {
    return maybeErrorMessage.name + ": " + maybeErrorMessage.message
  }

  if (isArray(maybeErrorMessage)) {
    return maybeErrorMessage[0].message.toString()
  }

  if (isObject(maybeErrorMessage)) {
    if (has(maybeErrorMessage, "message")) {
      return maybeErrorMessage.message.toString()
    }

    if (has(maybeErrorMessage, "config")) {
      return shopState.t.e.noClientCreds
    }
  }

  return maybeErrorMessage.toString()
}

function isWordPressError(response) {
  var foundError = false

  // A single error is being checked
  if (isObject(response) && has(response, "success")) {
    if (!response.success) {
      foundError = true
    }
  }

  if (isObject(response) && has(response, "type")) {
    if (response.type === "error") {
      return true
    }
  }

  if (isObject(response) && has(response, "action_name")) {
    return true
  }

  // REST API error
  if (isObject(response) && has(response, "data")) {
    if (has(response.data, "type")) {
      if (response.data.type === "error") {
        foundError = true
      }
    } else {
      if (has(response.data, "data")) {
        if (has(response.data, "success")) {
          if (!response.data.success) {
            foundError = true
          }
        }

        if (isArray(response.data.data)) {
          if (response.data.data[0].code === "error") {
            foundError = true
          }
        }
      } else if (
        has(response.data[0], "code") &&
        response.data[0].code === "error"
      ) {
        foundError = true
      }
    }
  }

  // Used when using promise all for checking more than one returned response
  if (isArray(response) && !isEmpty(response)) {
    forEach(response, function (possibleError) {
      if (isObject(possibleError)) {
        if (has(possibleError, "success")) {
          if (!possibleError.success) {
            foundError = true
          }
        } else if (has(possibleError, "code")) {
          if (
            possibleError.code === "error" ||
            possibleError.code === "http_request_failed"
          ) {
            foundError = true
          }
        }
      }
    })
  }

  return foundError
}

function getWordPressErrorMessage(error) {
  if (isString(error)) {
    return error
  }

  if (isObject(error) && has(error, "data") && has(error.data, "message")) {
    return error.data.message
  } else if (isObject(error) && has(error, "message")) {
    return error.message
  } else if (isObject(error) && has(error, "data")) {
    if (isArray(error.data)) {
      if (isString(error.data[0])) {
        return error.data[0]
      }

      if (has(error.data[0], "message")) {
        return error.data[0].message
      }

      return shopwp.t.e.unknown
    } else {
      if (isString(error.data)) {
        return error.data
      }

      if (has(error, "data")) {
        if (has(error.data, "data") && error.data.data.length > 0) {
          return error.data.data[0].message
        }

        return Object.values(error.data)[0].errors.error[0]
      }

      return shopwp.t.e.unknown
    }
  } else if (isArray(error)) {
    var onlyErrors = error.filter((err) => {
      if (has(err, "success")) {
        return !err.success
      }

      if (has(err, "code")) {
        return err.code === "error" || err.code === "http_request_failed"
      }
    })

    let firstErrorOnly = onlyErrors[0]

    if (has(firstErrorOnly, "data")) {
      return firstErrorOnly.data.message
    } else if (has(firstErrorOnly, "message")) {
      return firstErrorOnly.message
    } else {
      return firstErrorOnly
    }
  } else {
    return shopwp.t.e.unknown
  }
}

function maybeAlterErrorMessage(errorMessage, shopState) {
  let finalError = ""
  let error = findErrorMessage(errorMessage, shopState)

  if (!error) {
    return shopState.t.e.unknown
  }

  if (error.includes("TypeError: Failed to fetch")) {
    finalError = shopState.t.e.badCreds
  } else if (
    error.includes("Variable ids of type [ID!]! was provided invalid value")
  ) {
    finalError = shopState.t.e.badProductIds
  } else if (error.includes('Parse error on "}" (RCURLY) at [1, 10]')) {
    finalError = shopState.t.e.rCurly
  } else if (error.includes("Network Error")) {
    finalError = shopState.t.e.badNetwork
  } else if (
    error.includes(
      "Variable lineItems of type [CheckoutLineItemInput!]! was provided invalid value"
    )
  ) {
    finalError = shopState.t.e.invalidLineitemsType
  } else if (error.includes("Missing credentials Client object")) {
    finalError = shopState.t.e.badCreds
  } else if (error.includes('Parse error on "}" (RCURLY)')) {
    finalError = shopState.t.e.badApiField
  } else {
    finalError = error
  }

  return finalError
}

function maybeHandleApiError(clientError, response, dispatch) {
  if (clientError) {
    if (isObject(clientError)) {
      if (has(clientError, "message")) {
        var errorMessage = clientError.message
      } else {
        var errorMessage = JSON.stringify(clientError)
      }
    }

    if (isString(clientError)) {
      var errorMessage = clientError
    } else if (isObject(clientError)) {
      var errorMessage = clientError.message
    }

    if (dispatch) {
      dispatch({
        type: "SET_NOTICE",
        payload: {
          type: "error",
          message: errorMessage,
        },
      })
    }

    return errorMessage
  } else if (isWordPressError(response)) {
    let errorMessage = getWordPressErrorMessage(response)

    if (dispatch) {
      dispatch({
        type: "SET_NOTICE",
        payload: {
          type: "error",
          message: errorMessage,
        },
      })
    }

    return errorMessage
  } else {
    return false
  }
}

export {
  maybeAlterErrorMessage,
  isWordPressError,
  getWordPressErrorMessage,
  maybeHandleApiError,
}
