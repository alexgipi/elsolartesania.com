export const API_URL = import.meta.env.PUBLIC_API_URL;
export const UPLOADS_URL = import.meta.env.PUBLIC_UPLOADS_URL;

export const getCategories = async () => {

    try {
        const res = await fetch(`${API_URL}/product-categories`,
          {
              method: "GET",
              headers: {
                "Content-Type": "application/json"
              }
          }
        );
    
        const data = (await res.json()) as any;
        return data;
    
      } catch(error){
          console.error(error);
      }

}

export const getCategoryBySlug = async (categorySlug:string) => {

    try {
        const res = await fetch(`${API_URL}/product-categories/${categorySlug}`,
          {
              method: "GET",
              headers: {
                "Content-Type": "application/json"
              }
          }
        );
    
        const data = (await res.json()) as any;
        return data;
    
      } catch(error){
          console.error(error);
      }

}

interface QueryParams {
    limit?: number;
    page?: number;    // Agrega más parámetros según sea necesario
}

export const getCategoryProducts  = async (categorySlug:string, params?:QueryParams) => {
    try {
        const queryParams = new URLSearchParams({
            limit: params?.limit?.toString() || '',
            page: params?.page?.toString() || '',
        });

        const res = await fetch(`${API_URL}/products/categories.slug/${categorySlug}?${queryParams.toString()}`,
            {
                method: "GET",
                headers: {
                "Content-Type": "application/json"
                }
            }
        );
        const data = (await res.json()) as any;

        return data;

    } catch (error) {
        console.error(error);
    }

}

export const getProudct = async (idOrSlug:string | undefined) =>  {
    try {
        const res = await fetch(`${API_URL}/products/${idOrSlug}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        const data = (await res.json()) as any;
        return data;
    } catch (error) {
        console.error(error);
    }
}
