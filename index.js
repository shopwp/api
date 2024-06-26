export { fetchProducts, fetchProductsByCollections } from "./src/products"
export { fetchCollections } from "./src/collections"

export {
  getLocalizations,
  sanitizeTranslations,
  findCountryByCode,
  sanitizeCountries,
} from "./src/shop"

export { buildQuery } from "./src/api/query"
export {
  getAllTags,
  getAllTypes,
  getAllVendors,
  getProducts,
} from "./src/internal/products"
export { getTemplate } from "./src/internal/components"
export {
  fetchMaskedConnection,
  saveConnectionLocally,
} from "./src/internal/connection"

export { getPosts } from "./src/internal/posts"

export { getAllCollections } from "./src/internal/collections"
export { showMetafield, hideMetafield } from "./src/internal/metafields"
export { getAvailableLocalizations } from "./src/internal/translator"
export {
  setLicenseLocally,
  deleteLicenseLocally,
  getActiveDownloadsLocally,
  deactivateLicenseKeyRemote,
  activateLicenseKeyRemote,
  getLicenseKeyStatusRemote,
  getProductInfoRemote,
} from "./src/internal/license"

export {
  activateYotpoApiKey,
  deactivateYotpoApiKey,
  getYotpoReviews,
  getYotpoReviewsByProductId,
  createYotpoReview,
} from "./src/internal/reviews"

export {
  createCart,
  updateCartAttributes,
  updateBuyerIdentity,
  getCart,
  addLineItems,
  removeLineItems,
  updateLineItems,
  applyDiscount,
  updateNote,
} from "./src/internal/cart"

export {
  getSyncingStatus,
  setSyncingIndicator,
  syncRemove,
  syncOn,
  syncOff,
  scheduleNewCron,
  syncAndScheduleNewCron,
  disconnectCron,
  updateSettings,
  removeConnection,
  syncShopifyData,
  manuallyCancelSync,
  syncRemoveImages,
  removeWebhooks,
  connectWebhooks,
} from "./src/internal/syncing"

export { clearCacheTool } from "./src/internal/tools"

export { maybeAlterErrorMessage, maybeHandleApiError } from "./src/errors"

export {
  loginCustomer,
  associateCustomer,
  resetPasswordCustomer,
  setPasswordCustomer,
  resetPasswordByUrlCustomer,
  registerCustomer,
  getCustomer,
  updateCustomerAddress,
  addCustomerAddress,
  deleteCustomerAddress,
  createCustomerAccessToken,
} from "./src/internal/customers"

export { queryOptionsNoRefetch, queryOptionsWithRefetch } from "./src/queries"

export { fetchPostById, editPost } from "./src/wordpress"
export { getCache, maybeSetCache, clearCache } from "./src/cache"
