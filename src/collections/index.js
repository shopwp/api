import { to } from "@shopwp/common"
import { maybeHandleApiError } from "../errors"
import { getCollections, getCollection } from "../internal/cart"
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

    // @ts-ignore
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

    // We know that we're fetching by ids ...
    if (results.hasOwnProperty("nodes")) {
      var nodesResults = {
        collections: {
          edges: results.nodes.map(function (collection) {
            return {
              node: collection,
            }
          }),
          pageInfo: false,
        },
      }

      maybeSetCache({
        cacheType: "collections",
        dataToHash: params,
        dataToCache: nodesResults.collections,
      })

      resolve(nodesResults.collections)
    } else {
      maybeSetCache({
        cacheType: "collections",
        dataToHash: params,
        dataToCache: results.collections,
      })

      resolve(results.collections)
    }
  })
}

/*

We need both a fetchCollection and fetchCollections because only the former
allows for fetching collections by ID.

*/
function fetchCollection(queryParams, collectionId, shopState) {
  return new Promise(async (resolve, reject) => {
    if (!collectionId) {
      return reject({
        type: "error",
        message: shopState.t.e.noQueryParams,
      })
    }

    if (shopwp.misc.cacheEnabled) {
      const [queryCacheError, queryCache] = await to(
        getCache(collectionId, shopState)
      )

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

    var params = {
      queryParams: {
        ...queryParams,
        id: collectionId,
      },
      withProducts: true,
    }

    const [resultsError, results] = await to(getCollection(params, shopState))

    var errMsg = maybeHandleApiError(resultsError, results)

    if (errMsg) {
      return reject({
        type: "error",
        message: errMsg,
      })
    }

    maybeSetCache({
      cacheType: "collections",
      dataToHash: collectionId,
      dataToCache: results.collection,
    })

    resolve({
      edges: [results.collection],
      cursor: false,
      pageInfo: {
        cursor: false,
      },
    })
  })
}

export { fetchCollection, fetchCollections }
