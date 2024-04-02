import { get, set, clear } from "idb-keyval"
import { encodeSettings } from "@shopwp/common"

/*

Params:
{
    cacheType: "products", "collections", "collectionProducts", "cart",
    dataToHash: // The data used to generate a cache key
    dataToCache: // The data to cache 
}

*/
function maybeSetCache(params) {
  if (!shopwp.misc.cacheEnabled) {
    return params.dataToCache
  }

  if (
    params.cacheType === "products" ||
    params.cacheType === "cart" ||
    params.cacheType === "collections"
  ) {
    var finalResults = params.dataToCache
  }

  if (params.cacheType === "collectionProducts") {
    var finalResults = params.dataToCache.data
  }

  if (!finalResults) {
    return params.dataToCache
  }

  finalResults.cacheKey = shopwp.misc.cacheKey

  var encoded = encodeSettings(params.dataToHash)

  if (encoded instanceof Error) {
    console.error(encoded.message)
  } else {
    set(encoded, finalResults)
  }

  return finalResults
}

function getCache(queryParams) {
  var encoded = encodeSettings(queryParams)

  if (encoded instanceof Error) {
    return Promise.reject(encoded.message)
  } else {
    return get(encoded)
  }
}

function clearCache() {
  clear()
}

export { getCache, maybeSetCache, clearCache }
