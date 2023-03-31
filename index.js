export { fetchProducts, fetchProductsByCollections } from "./src/src/products"
export { fetchCollections } from "./src/collections"

export {
  getLocalizations,
  sanitizeLanguages,
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
  activateRechargeApiKey,
  deactivateRechargeApiKey,
  getRechargeSellingGroupsFromProductId,
} from "./src/internal/subscriptions"

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
  turnCronOn,
  disconnectCron,
  updateSettings,
  removeConnection,
  syncShopifyData,
  syncExpire,
  syncRemoveImages,
  removeWebhooks,
} from "./src/internal/syncing"

export { clearCache } from "./src/internal/tools"

export {
  maybeAlterErrorMessage,
  isWordPressError,
  getWordPressErrorMessage,
  maybeHandleApiError,
} from "./src/errors"

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
