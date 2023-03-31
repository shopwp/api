import { del, post } from "../request"

function activateRechargeApiKey(data) {
  return post("recharge/api", data)
}

function deactivateRechargeApiKey(data) {
  return del("recharge/api", data)
}

function getRechargeSellingGroupsFromProductId(data, shopState) {
  return post("recharge/subscriptions/product", data, shopState)
}

export {
  activateRechargeApiKey,
  deactivateRechargeApiKey,
  getRechargeSellingGroupsFromProductId,
}
