import isError from "lodash-es/isError"

function get(endpoint, shopState = {}) {
  return request(
    "get",
    shopwp.api.restUrl + shopwp.api.namespace + "/" + endpoint,
    {},
    shopState
  )
}

function post(endpoint, data = {}, shopState = {}) {
  return request(
    "post",
    shopwp.api.restUrl + shopwp.api.namespace + "/" + endpoint,
    data,
    shopState
  )
}

function del(endpoint, data = {}, shopState = {}) {
  return request(
    "delete",
    shopwp.api.restUrl + shopwp.api.namespace + "/" + endpoint,
    data,
    shopState
  )
}

function getRestErrorContents(error) {
  if (isError(error)) {
    return {
      statusCode: "unknown",
      message: error.message,
      action_name: error.name,
    }
  } else {
    return {
      statusCode: error.response.status,
      message: error.response.data.message,
      action_name: error.response.data.code,
    }
  }
}

function request(method, endpoint, data, shopState) {
  return new Promise((resolve, reject) => {
    let options = {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }

    if (shopwp.misc.cacheLength) {
      options.headers["Cache-Control"] =
        "public, max-age=" +
        shopwp.misc.cacheLength +
        ", s-maxage=" +
        shopwp.misc.cacheLength +
        ", must-revalidate"
    }

    if (method !== "get") {
      options.body = JSON.stringify(data)
    }

    if (shopState && shopState.jwt) {
      options.headers["Authorization"] = "Bearer " + shopState.jwt
    } else {
      options.headers["X-WP-Nonce"] = shopwp.api.nonce
    }

    fetch(endpoint, options)
      .then((response) => {
        return response.json()
      })
      .then((resp) => {
        if (resp.hasOwnProperty("code") && resp.hasOwnProperty("message")) {
          reject({
            statusCode: resp.data.status,
            message: resp.message,
            action_name: resp.code,
          })
        }

        resolve(resp)
      })
      .catch((error) => {
        reject(getRestErrorContents(error))
      })
  })
}

export { get, post, del, getRestErrorContents }
