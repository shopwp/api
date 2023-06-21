import {
  maybeAlterErrorMessage,
  isWordPressError,
  getWordPressErrorMessage,
} from "../errors"
import { to } from "@shopwp/common"
import { getCollections } from "../internal/collections"

function fetchCollections(
  queryParams,
  shopState,
  cursor = false,
  withProducts = false
) {
  return new Promise(async (resolve, reject) => {
    if (!queryParams) {
      return reject({
        type: "error",
        message: shopState.t.e.noQueryParams,
      })
    }

    var params = {
      queryParams: queryParams,
      withProducts: withProducts,
    }

    if (cursor) {
      params.queryParams.cursor = cursor
    }

    const [resultsError, results] = await to(getCollections(params))

    if (resultsError) {
      return reject({
        type: "error",
        message: maybeAlterErrorMessage(resultsError, shopState),
      })
    }

    if (isWordPressError(results)) {
      return reject({
        type: "error",
        message: getWordPressErrorMessage(results),
      })
    }

    resolve(results.data)
  })
}

export { fetchCollections }
