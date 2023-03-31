import { post } from "../request"

function getCustomers(data = {}) {
  return post("customers", data)
}

function loginCustomer(data = {}) {
  return post("customers/login", data)
}

function associateCustomer(data = {}) {
  return post("customers/associate", data)
}

function resetPasswordCustomer(data = {}) {
  return post("customers/resetPassword", data)
}

function setPasswordCustomer(data = {}) {
  return post("customers/setPassword", data)
}

function resetPasswordByUrlCustomer(data = {}) {
  return post("customers/resetPasswordByUrl", data)
}

function registerCustomer(data = {}) {
  return post("customers/register", data)
}

function getCustomersCount() {
  return post("customers/count")
}

function getCustomer(data = {}) {
  return post("customer", data)
}

function updateCustomerAddress(data = {}) {
  return post("customers/addressUpdate", data)
}

function addCustomerAddress(data = {}) {
  return post("customers/addressAdd", data)
}

function deleteCustomerAddress(data = {}) {
  return post("customers/addressDelete", data)
}

function createCustomerAccessToken(data = {}) {
  return post("customers/createAccessToken", data)
}

export {
  getCustomersCount,
  getCustomers,
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
}
