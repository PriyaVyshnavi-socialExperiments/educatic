export const environment = {
  appVersion: require('../../package.json').version,
  production: true,
  apiBaseUrl : 'https://goofflinee.azurewebsites.net/api',
  blobURL: 'https://goofflinee.blob.core.windows.net',
  offlineWebsiteURL: 'https://goofflinee.azureedge.net',
  appInsightsKey: '3e02a970-cb6e-4b40-85f7-657a6171d65a',
  bingMapsKey: 'Arj5Vb7VhC-b7w9jXuZmY9X7tSh60g6E2IsKPSLySP0EKtUBo3ABoYRX2x7scpMh',
  sqlLiteDBName: 'goOfflineE',
  StaticSourcePath: 'default',
  PageTitle: 'Social Experiments',
};
