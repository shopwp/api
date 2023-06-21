import { to } from "@shopwp/common"
import { maybeHandleApiError } from "../errors"
import { getAvailableLocalizations } from "../internal/translator"
import { sanitizeLanguages } from "@shopwp/common"

function sanitizeCountries(countries) {
  if (!countries) {
    return false
  }

  return countries.map((country) => {
    return { label: country.label, value: country.value.isoCode }
  })
}

function sanitizeTranslations(rawTranslations) {
  if (!rawTranslations) {
    return false
  }

  return rawTranslations.map((translation) => {
    translation.flag =
      shopwp.misc.pluginsDirURL +
      "public/imgs/flags/" +
      translation.isoCode.toLowerCase() +
      ".svg"

    return { label: translation.name, value: translation }
  })
}

function findCountryByCode(countries, code = shopwp.general.countryCode) {
  if (!countries) {
    return false
  }

  return countries.filter((country) => country.value.isoCode === code)
}

async function getLocalizations(shopState, dispatch) {
  dispatch({
    type: "SET_IS_LOADING",
    payload: true,
  })

  const [error, resp] = await to(getAvailableLocalizations())

  dispatch({
    type: "SET_IS_LOADING",
    payload: false,
  })

  var maybeApiError = maybeHandleApiError(error, resp)

  if (maybeApiError) {
    return maybeApiError
  }

  var countries = sanitizeTranslations(resp.data.availableCountries)

  dispatch({
    type: "SET_AVAILABLE_TRANSLATIONS",
    payload: countries,
  })

  const foundSelectedCountry = findCountryByCode(
    countries,
    shopState.buyerIdentity.country
  )

  if (foundSelectedCountry.length) {
    dispatch({
      type: "SET_SELECTED_COUNTRY",
      payload: foundSelectedCountry[0],
    })

    const foundSelectedLanguages =
      foundSelectedCountry[0].value.availableLanguages.filter(
        (lang) => lang.isoCode === shopState.buyerIdentity.language
      )

    if (foundSelectedLanguages.length) {
      var sanitizedLanguages = sanitizeLanguages(foundSelectedLanguages)
    } else {
      if (foundSelectedCountry[0].value.availableLanguages.length) {
        var sanitizedLanguages = [
          {
            label: foundSelectedCountry[0].value.availableLanguages[0].name,
            value: foundSelectedCountry[0].value.availableLanguages[0].isoCode,
          },
        ]
      } else {
        var sanitizedLanguages = false
      }
    }

    if (sanitizedLanguages.length) {
      dispatch({
        type: "SET_SELECTED_LANGUAGE",
        payload: sanitizedLanguages[0],
      })
    }
  }
}

export {
  getLocalizations,
  sanitizeTranslations,
  findCountryByCode,
  sanitizeCountries,
}
