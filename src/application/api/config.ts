const API_URL = import.meta.env.VITE_API_URL;

const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE"
}

const TYPES = {
  APPLICATION_JSON: "application/json"
}

export const config = {
  auth: {
    endpoints: {
      login: {
        request: `${API_URL}/api/login`,
        method: METHODS.POST,
        type: TYPES.APPLICATION_JSON
      }
    }
  }
}