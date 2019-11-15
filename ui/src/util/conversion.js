const stringToBool = string => {
  if (string.toLowerCase() === 'true') {
    return true
  } else {
    return false
  }
}

export {
  stringToBool
}