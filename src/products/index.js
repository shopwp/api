import { maybeHandleApiError } from "../errors"
import { to } from "@shopwp/common"
import isEmpty from "lodash-es/isEmpty"
import isArray from "lodash-es/isArray"
import { getProducts, getProductsByCollections } from "../internal/products"
import { getCache, maybeSetCache, clearCache } from "../cache"

function fetchProducts(queryParams, shopState, cursor = false) {
  return new Promise(async (resolve, reject) => {
    if (!queryParams) {
      console.error(shopState.t.e.noQueryParams)

      reject({
        type: "error",
        message: shopState.t.e.noQueryParams,
      })
    }

    if (queryParams?.sortKey) {
      queryParams.sortKey = queryParams.sortKey.toUpperCase()
    }

    if (cursor) {
      queryParams.cursor = cursor
    } else {
      delete queryParams.cursor
    }

    if (shopwp.misc.cacheEnabled) {
      const [queryCacheError, queryCache] = await to(getCache(queryParams))

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

    const shopStateCopy = Object.assign({}, shopState)

    if (shopStateCopy) {
      delete shopStateCopy.cartData
      delete shopStateCopy.t
    }

    const [resultsError, results] = await to(
      getProducts({
        queryParams: queryParams,
        shopState: shopStateCopy,
      })
    )

    var maybeApiError = maybeHandleApiError(resultsError, results)

    if (maybeApiError) {
      reject({
        type: "error",
        message: maybeApiError,
      })
      return
    }

    maybeSetCache({
      cacheType: "products",
      dataToHash: queryParams,
      dataToCache: results.data,
    })

    resolve(results.data)
  })
}

function fetchProductsByCollections(queryParams, shopState, cursor = false) {
  return new Promise(async (resolve, reject) => {
    if (!queryParams) {
      return reject({
        type: "error",
        message: shopState.t.e.noQueryParams,
      })
    }

    if (queryParams?.sortKey) {
      queryParams.sortKey = queryParams.sortKey.toUpperCase()
    }

    if (queryParams?.first) {
      queryParams.first = parseInt(queryParams.first, 10)
    }

    if (cursor) {
      queryParams.cursor = cursor
    } else {
      delete queryParams.cursor
    }

    if (shopwp.misc.cacheEnabled) {
      const [queryCacheError, queryCache] = await to(getCache(queryParams))

      var errorMsg = maybeHandleApiError(queryCacheError, queryCache)

      if (errorMsg) {
        return reject({
          type: "error",
          message: errorMsg,
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

    let cloneShopState = Object.assign({}, shopState)

    delete cloneShopState.t

    const [resultsError, results] = await to(
      getProductsByCollections({
        queryParams: queryParams,
        shopState: cloneShopState,
      })
    )

    var maybeApiError = maybeHandleApiError(resultsError, results)

    if (maybeApiError) {
      reject({
        type: "error",
        message: maybeApiError,
      })
      return
    }

    if (isEmpty(results.data)) {
      resolve(results.data)
      return
    }

    if (isArray(results.data)) {
      var nonFalseyData = results.data.filter((v) => !!v)
    } else {
      var nonFalseyData = results.data.nodes.filter((v) => !!v)
    }

    if (!isEmpty(nonFalseyData)) {
      // Server is returning products from more than one collection
      if (nonFalseyData.length > 1) {
        let data = {
          edges: nonFalseyData,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        }

        maybeSetCache({
          cacheType: "collectionProducts",
          dataToHash: queryParams,
          dataToCache: data,
        })

        return resolve(data)
      }

      if (nonFalseyData[0].hasOwnProperty("products")) {
        let data = nonFalseyData[0].products

        maybeSetCache({
          cacheType: "collectionProducts",
          dataToHash: queryParams,
          dataToCache: data,
        })

        resolve(data)
      } else {
        resolve(false)
      }
    } else {
      maybeSetCache({
        cacheType: "collectionProducts",
        dataToHash: queryParams,
        dataToCache: nonFalseyData,
      })

      resolve(nonFalseyData)
    }
  })
}

export { fetchProducts, fetchProductsByCollections }
