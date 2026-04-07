// store/sharedConfig.ts
export const sharedPersistConfig = {
  PERSIST_KEY: "Inventory-app",
  BASE_URL: process.env.NEXT_PUBLIC_API_URL as string,
};
