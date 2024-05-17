import padStart from 'lodash/padStart'

export const formatDate = ( d , displayTime ) => {
  if(!d) return ""
  let _date = new Date(d)
  return _date.toLocaleDateString() + (displayTime ? ` ${_date.toLocaleTimeString()}` : '')
}


export const formatStringToBoolean = ( value ) => {
  switch (value){
    case true:
    case "True":
    case "true":
    case 1:
      return true;
    default:
      return false;
  }
}

export const formatPrice = (value, currencyCode) => {
  if(value === null) return ''
  if(value === '-') return '-'

  let locale;
  switch(currencyCode) {
    case 'USD':
      locale = 'en-US'
      break;
    default:
      locale = 'fr-FR'
  }

  return value.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'currency',
    currency: currencyCode || 'EUR'
  })
}

export const formatEan = ean => ean === null || ean === undefined || ean === '' ? '' : padStart(ean || '', 13, '0')
