import { queryOptions } from "@tanstack/react-query";
import { productsApi } from "@/services/api/products";
import { PRODUCTS_LIST_KEY } from "../query-key/products-key";

const getLowStockProductsQueryOptions = () =>
  queryOptions({
    queryKey: [PRODUCTS_LIST_KEY, "low-stock"],
    queryFn: () => productsApi.getLowStockProducts(),
  });

export { getLowStockProductsQueryOptions };
