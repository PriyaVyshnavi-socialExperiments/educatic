export const environment = {
    appVersion: require('../../package.json').version,
    production: true,
    apiBaseUrl: 'https://millat-api.azurewebsites.net/api',
    blobURL: 'https://millat.blob.core.windows.net', 
    offlineWebsiteURL: 'https://goofflinee.azureedge.net',
    appInsightsKey: 'd17999d5-f224-430e-8673-7a549dd41010',
    sqlLiteDBName: 'millat',
    StaticSourcePath: 'millat',
    PageTitle: 'Millat Model High School',
  };