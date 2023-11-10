import {
  maybeAlterErrorMessage,
  isWordPressError,
  getWordPressErrorMessage,
} from "../errors"
import { to } from "@shopwp/common"
import { getCollections } from "../internal/collections"
import { getCache, maybeSetCache, clearCache } from "../cache"

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

    if (shopwp.misc.cacheEnabled) {
      const [queryCacheError, queryCache] = await to(getCache(params))

      if (queryCacheError) {
        return reject({
          type: "error",
          message: JSON.stringify(queryCacheError),
        })
      }

      if (queryCache) {
        if (queryCache.cacheKey === shopwp.misc.cacheKey) {
          console.log("📦 Valid collections cache found, just returning ...")
          return resolve(queryCache)
        }
      }

      if (queryCache && queryCache.cacheKey !== shopwp.misc.cacheKey) {
        clearCache()
      }
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

    maybeSetCache({
      cacheType: "collections",
      dataToHash: params,
      dataToCache: results.data,
    })

    resolve(results.data)
  })
}

export { fetchCollections }
