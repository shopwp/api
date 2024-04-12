export { fetchProducts, fetchProductsByCollections } from "./products"
export { fetchCollections } from "./collections"

export {
  getLocalizations,
  sanitizeTranslations,
  findCountryByCode,
  sanitizeCountries,
} from "./shop"

export { buildQuery } from "./api/query"
export {
  getAllTags,
  getAllTypes,
  getAllVendors,
  getProducts,
} from "./internal/products"
export { getTemplate } from "./internal/components"
export {
  fetchMaskedConnection,
  saveConnectionLocally,
} from "./internal/connection"

export { getPosts } from "./internal/posts"

export { getAllCollections } from "./internal/collections"
export { showMetafield, hideMetafield } from "./internal/metafields"
export { getAvailableLocalizations } from "./internal/translator"
export {
  setLicenseLocally,
  deleteLicenseLocally,
  getActiveDownloadsLocally,
  deactivateLicenseKeyRemote,
  activateLicenseKeyRemote,
  getLicenseKeyStatusRemote,
  getProductInfoRemote,
} from "./internal/license"

export {
  activateRechargeApiKey,
  deactivateRechargeApiKey,
  getRechargeSellingGroupsFromProductId,
} from "./internal/subscriptions"

export {
  activateYotpoApiKey,
  deactivateYotpoApiKey,
  getYotpoReviews,
  getYotpoReviewsByProductId,
  createYotpoReview,
} from "./internal/reviews"

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
} from "./internal/cart"

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
} from "./internal/syncing"

export { clearCache } from "./internal/tools"

export { maybeAlterErrorMessage, maybeHandleApiError } from "./errors"

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
} from "./internal/customers"

export { queryOptionsNoRefetch, queryOptionsWithRefetch } from "./queries"
