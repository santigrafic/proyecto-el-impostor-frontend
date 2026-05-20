const useApi = () => {
  const coreRequest = async (endpoint: string, method: string, options?: RequestInit) => {
    const resData = await fetch(`${endpoint}`, {
      method,
      ...options
    });

    return resData;
  }

  return { coreRequest };
}

export default useApi;