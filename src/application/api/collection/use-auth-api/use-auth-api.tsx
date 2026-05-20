import { config } from "../../config";
import useApi from "../../core";

const useAuthApi = () => {
  const { coreRequest } = useApi();

  const fetchLogin = async (email: string, password: string) => {
    const endpoint = `${config.auth.endpoints.login.request}`
    const method = config.auth.endpoints.login.method;
    const options = {
      headers: {
        "Content-Type": config.auth.endpoints.login.type
      },
      body: JSON.stringify({
        email,
        password
      })
    }

    try {
      const response = await coreRequest(endpoint, method, options);
      const data = await response.json();

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  return { fetchLogin };
}

export default useAuthApi;