import {
  maybeAlterErrorMessage,
  isWordPressError,
  getWordPressErrorMessage,
} from "../errors"
import { to } from "@shopwp/common"
import isEmpty from "lodash-es/isEmpty"
import isArray from "lodash-es/isArray"
import { getProducts, getProductsByCollections } from "../internal/products"

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

    const shopStateCopy = Object.assign({}, shopState)

    if (shopStateCopy) {
      delete shopStateCopy.cartData
    }

    const [resultsError, results] = await to(
      getProducts({
        queryParams: queryParams,
        shopState: shopStateCopy,
      })
    )

    if (resultsError) {
      reject({
        type: "error",
        message: maybeAlterErrorMessage(resultsError, shopState),
      })
      return
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

    let cloneShopState = Object.assign({}, shopState)
    delete cloneShopState.t

    const [resultsError, results] = await to(
      getProductsByCollections({
        queryParams: queryParams,
        shopState: cloneShopState,
      })
    )

    if (resultsError) {
      reject({
        type: "error",
        message: maybeAlterErrorMessage(resultsError, shopState),
      })
      return
    }

    if (isWordPressError(results)) {
      return reject({
        type: "error",
        message: getWordPressErrorMessage(results),
      })
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
        return resolve({
          edges: nonFalseyData,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        })
      }

      if (nonFalseyData[0].hasOwnProperty("products")) {
        resolve(nonFalseyData[0].products)
      } else {
        resolve(false)
      }
    } else {
      resolve(nonFalseyData)
    }
  })
}

export { fetchProducts, fetchProductsByCollections }
