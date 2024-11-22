import { maybeHandleApiError } from "../errors"
import { getAvailableLocalizations } from "../internal/translator"
import { to, sanitizeLanguages } from "@shopwp/common"

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

function get_lang() {
  if (shopwp.misc.siteLang === shopwp.general.languageCode) {
    return shopwp.general.languageCode
  } else {
    return shopwp.misc.siteLang
  }
}

function findSavedBuyerIdentity(sessionValue) {
  // We don't want to use the "users" saved value in the admin area
  if (!sessionValue || shopwp.misc.isAdmin) {
    let defaults = {
      language: get_lang(),
      country: shopwp.general.countryCode,
      currency: shopwp.general.currencyCode,
    }

    return defaults
  }

  sessionValue = JSON.parse(sessionValue)

  var finalStuff = {
    language: sessionValue?.language ? sessionValue.language : get_lang(),
    country: sessionValue?.country
      ? sessionValue.country
      : shopwp.general.countryCode,
    currency: sessionValue?.currency
      ? sessionValue.currency
      : shopwp.general.currencyCode,
  }

  return finalStuff
}

async function getLocalizations(dispatch) {
  const buyerIdentity = findSavedBuyerIdentity(
    sessionStorage.getItem("shopwp-buyer-identity")
  )

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
    console.error(maybeApiError)
    return false
  }

  var countries = sanitizeTranslations(resp.data.availableCountries)

  dispatch({
    type: "SET_AVAILABLE_TRANSLATIONS",
    payload: countries,
  })

  const foundSelectedCountry = findCountryByCode(
    countries,
    buyerIdentity.country
  )

  if (foundSelectedCountry.length) {
    dispatch({
      type: "SET_SELECTED_COUNTRY",
      payload: foundSelectedCountry[0],
    })

    const foundSelectedLanguages =
      foundSelectedCountry[0].value.availableLanguages.filter((lang) => {
        return lang.isoCode === buyerIdentity.language
      })

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
