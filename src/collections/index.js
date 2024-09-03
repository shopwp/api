import { to } from "@shopwp/common"
import { maybeHandleApiError } from "../errors"
import { getCollections } from "../internal/cart"
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

      var errMsg = maybeHandleApiError(queryCacheError, queryCache)

      if (errMsg) {
        return reject({
          type: "error",
          message: errMsg,
        })
      }

      if (queryCache) {
        if (queryCache.cacheKey === shopwp.misc.cacheKey) {
          return resolve(queryCache)
        }
      }

      if (queryCache && queryCache.cacheKey !== shopwp.misc.cacheKey) {
        clearCache()
      }
    }

    const [resultsError, results] = await to(getCollections(params, shopState))

    var errMsg = maybeHandleApiError(resultsError, results)

    if (errMsg) {
      return reject({
        type: "error",
        message: errMsg,
      })
    }

    maybeSetCache({
      cacheType: "collections",
      dataToHash: params,
      dataToCache: results.collections,
    })

    resolve(results.collections)
  })
}

export { fetchCollections }
