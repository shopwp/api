import { post, getRestErrorContents } from "../request"

function setLicenseLocally(license = false) {
  return post("license", { license: license })
}

function deleteLicenseLocally(key = false) {
  return post("license/delete_locally", { key: key })
}

function getActiveDownloadsLocally() {
  return post("license/downloads")
}

function updatePaymentMethod(customerId) {
  return post("account/paymentUpdate", customerId)
}

function updateCustomer(customerInput) {
  return post("account/customerUpdate", customerInput)
}

function deactivateLicenseKeyNew(data) {
  return post("license/deactivate", data)
}

function getProductInfoRemote(key, downloadName) {
  return licenseRemote(key, downloadName, "get_version")
}

function getLicenseKeyStatusRemote(key, itemId) {
  return licenseRemote(key, itemId, "check_license")
}

function activateLicenseKeyRemote(key, itemId) {
  return licenseRemote(key, itemId, "activate_license")
}

function deactivateLicenseKeyRemote(key, itemId) {
  return licenseRemote(key, itemId, "deactivate_license")
}

function licenseRemote(key, itemId, action) {
  return new Promise((resolve, reject) => {
    var url =
      "https://wpshop.io/edd-sl?edd_action=" +
      action +
      "&item_id=" +
      itemId +
      "&license=" +
      key +
      "&url=" +
      shopwp.misc.siteUrl

    fetch(url, {
      method: "post",
    })
      .then((response) => response.json())
      .then((resp) => {
        resolve(resp)
      })
      .catch((error) => {
        reject(getRestErrorContents(error))
      })
  })
}

export {
  setLicenseLocally,
  deleteLicenseLocally,
  getActiveDownloadsLocally,
  deactivateLicenseKeyRemote,
  activateLicenseKeyRemote,
  getLicenseKeyStatusRemote,
  getProductInfoRemote,
  updatePaymentMethod,
  updateCustomer,
  deactivateLicenseKeyNew,
}
