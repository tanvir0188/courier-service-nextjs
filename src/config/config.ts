import type ConfigType from "./types";

const config: ConfigType = {
  base_url: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.BACKEND_API_URL || "http://localhost:8787/api/v1",
  access_secret: process.env.JWT_ACCESS_SECRET || "dronet_access_token_secret_sample",
  refresh_secret: process.env.JWT_REFRESH_SECRET || "dronet_refresh_token_secret_sample",
};

export default config;
