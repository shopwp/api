import { post } from "../request"

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

function manuallyCancelSync(data) {
  return post("syncing/expire", data)
}

function syncAndScheduleNewCron(data) {
  return post("syncing/cron/scheduleAndSync", data)
}

function scheduleNewCron(data) {
  return post("syncing/cron/schedule", data)
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
  return post("webhooks/delete", data)
}

function connectWebhooks(data) {
  return post("webhooks/connect", data)
}

export {
  getSyncingStatus,
  setSyncingIndicator,
  syncShopifyData,
  syncRemove,
  manuallyCancelSync,
  syncOn,
  scheduleNewCron,
  syncOff,
  disconnectCron,
  updateSettings,
  removeConnection,
  syncRemoveImages,
  removeWebhooks,
  connectWebhooks,
  syncAndScheduleNewCron,
}
