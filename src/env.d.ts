interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly NG_APP_ENV: string;
  readonly NG_APP_BASE_URL: string;
  readonly NG_APP_BACKEND_URL: string;
  readonly NG_APP_MAPBOX_ACCESSTOKEN: string;
  readonly NG_APP_GEOAPIFY_APIKEY: string;
  readonly NG_APP_GEOAPIFY_URL: string;
}
