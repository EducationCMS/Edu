const getImageUrl = (uri: string) => {
  const host = import.meta.env.VITE_BASE_URL
  return host + uri
}

export {
  getImageUrl
}
