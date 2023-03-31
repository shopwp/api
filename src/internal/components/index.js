import { post } from "../request"

function getTemplate(settingsState, shopState) {
  return post(
    "components/template",
    {
      data: settingsState,
    },
    shopState
  )
}

export { getTemplate }
