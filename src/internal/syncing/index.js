import { get, post } from "../request"

function getSyncingStatus(data) {
  return post("syncing/status", data)
}

function setSyncingIndicator(data = {}) {
  return post("syncing/indicator", data)
}

function syncShopifyData() {
  return post("syncing/data")
}

function syncRemove(data) {
  return post("syncing/remove", data)
}

function syncRemoveImages() {
  return post("syncing/remove/images")
}

function syncExpire(data) {
  return post("syncing/expire", data)
}

function turnCronOn(data) {
  return post("syncing/cron/add", data)
}

function disconnectCron() {
  return post("syncing/cron/remove")
}

function syncOn() {
  return setSyncingIndicator({
    syncing: true,
  })
}

function syncOff() {
  return setSyncingIndicator({
    syncing: false,
  })
}

function updateSettings(settings, flushRewriteRules = false) {
  return post("settings", {
    settings: settings,
    flushRewriteRules: flushRewriteRules,
  })
}

function removeConnection() {
  return post("connection/delete")
}

function removeWebhooks(data) {
  return post("webhooks/delete/all", data)
}

function connectWebhooks() {
  return post("webhooks/connect")
}

export {
  getSyncingStatus,
  setSyncingIndicator,
  syncShopifyData,
  syncRemove,
  syncExpire,
  syncOn,
  turnCronOn,
  syncOff,
  disconnectCron,
  updateSettings,
  removeConnection,
  syncRemoveImages,
  removeWebhooks,
  connectWebhooks,
}
