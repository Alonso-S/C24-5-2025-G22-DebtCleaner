let _token: string | null = null

export const authStore = {
  get token() {
    return _token
  },
  setToken(value: string | null) {
    _token = value
  },
  clear() {
    _token = null
  },
}
