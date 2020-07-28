import { Component, OnInit } from '@angular/core';
import { service, factories, models, IEmbedConfiguration } from "powerbi-client";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  private static readonly EmbedToken = "H4sIAAAAAAAEACWWxQ7sWBJE_-VtPZKZRuqF2WXGMuzMzOzW_PuUuveZUt7IvHHi7z9W8vRTkv_5759qL_Y1-QpjILl3t1u4dJsLHegYWKNscMnvU1bTdQSKge0IcykPQdUGkPGP7eBCLQszvef5EXoq-1J705KBx3nAwny52y883VG56CzDdGOQgjpIlctEt8-iHfGxdKEBkBoPogSsKxHebVcHyUNz7v7Mu4Yqsh3CQ6MspVnNk7FBdxFBoMEbjh-_-AfuazzPZ-VrvPyVwJnHXOy7qHqEyTr2tmq37O0DT_bL0ztBOeATpQbQ3uSDbN58phIGpJYiitOz-ChgBxvaRKHMkfVrjpIUv-47omZbdKL7xsLKKE3VxhR9lFOd4Tvpg28GmQlslCMAu_MS2Ce51a3S8xWSf0n7QTI4nZ69JzJsJO-nAJdPyPlbrpU7JJdzH9rJBDulIB8AQC6d-slNDHjlFae2T8vuGKdfeDiijSIPUl2OqoGp3iZmRuc9sTsC543K0WCYtUBqZGGfpofuFLrCGDoDfayvjs0PwWNYOps_MsE5JU-LGqU-1QIUaNWPoWy50BP4ftS0x3rUiJ6h_YCM0GScSlLLoJuX21aBuWaB3mt9J4NwWv4txcGHdpC_8Ju6Atjtw07b9XSA2kqH8fza5TCM5KDXT5MOY2fE72sn76yecSH8cihIX0_yDcKWXJSNt6FiduUmYvbL4WPc1t0AiS9H_9SqH68us5oVACRUGCQLPR4CQUCZ5gR3xwUayCqlZKibVKXzTtnBvj1H0PpeRcURWbovqSYy9HTdcPVB2gB8KWgFnhVSUdR9m78hj23NhMJL3sJX6msS3i9vuzMl5qO37xyATl3cSUzUNK_I8J4OhSBuunlNCujDFzKEEF1yw0kg_aHoqqMBqd-oL2N2L5LEZ7uD_lPQRFSStbSyglNPl_6WLFMG2fNpPRYzAfO0duZ9ybnHYk1kF5i71C09If-LP1pIM_p68kU1O6QIIwejSwmEDnUi4JUtRCK1UQoNzrlXzB310Tv_ZZh6EhmlSCy43Ad4BZbvbwCZJ5NlJZ58cjhMX9eGt0KI5mJhInxqVGSLZdLFPz_Ae4_fvvdAtaHKyPl8SuYj5Luazy0JWqID04WzW8_0LjlzLyTJlqnFsziuKsT3zMrj3sTwk_JSY2AmgipRzraavhzQcz6FBPaVK34jlgcdEfGljNY55SzKwqJyZK-ZBxJBTjAw19ovVHOe6Oi3Jznr5KvqBqLQFLl9VJH3BrAkHhZSqYRoDuVu3G_HP3ofPeBPfgjf9N7mqP1Ksd0YnZCok-X99mdQE7ZGdOIc5DTWLrxesl4koeeyP2n-glXd5Z1a-VotXgcilcHLjDszj3J_P60dwy1T9W7Q2YdVLf2R8haIdaIS4inL-Qf7UYzs2j0vqphNeMlu_LzzFC2et-OOq2phRwS_NyXDoD_M-5y1Rj3McGqWf4iDzsOUMxUdP-e8lnSOJAuPjHp9i-aHZwpFaADFk4ZUcsltzz5xR06Or_Xsbbys_FmxJS6oQTS51_3yDVGwcsYkY3USpy2b0QnMcpIAEwcikFF378-dDB2wX3ibzfZ8JWgDOKLomOSziPl5InQTgReRUaNJfNq1mwD9vR5IMEn5dnNimQdxJ3jngOEBWgkRsvygFvq6rlskquhFdqNTLlESEI_zLvpQWjh4hpgvQ6ROKPd9xVPuuqq1feeryx0NSZJLzHgQJj5Nx2PpLqN2PTQVMYb6E--owm-3jk80pYDvrQYPN2dajRrvZutfStAnd4sK7jQUCWxu4kCaRelPNTtz2sCerbegMierk3nDW8-Zds92f5-OlJbzz4Y1VOJP6xvWnMZ0BYX2D_OtYADM3C_7EfXsxkfJNQkl1QvNBTwBqTB06OEsnPKKyCZKDxdKHLidwdEP9k4V_1ql0URaOa6YoTjzoYWIlbZhizdJpfBaP4-EEme2dA9qC7KVJxufZAdF4jXeFASwqzoV8Z1F-YX9jh8gbQp0QJnerjS-KITalyMdABdnjYiMKd-rCip_GSu9R5K0yYuUzv5Vj371XwLIq3KzKn6c3f7abwMCLwdfrfXOxyNbBzVAn2GiCMaYqQHlDRQdeO0QRUdXDMrmBfEE2dyHjNPQAkCH3GfEgL23y4BOcDMACFWvpMh5vKNMdJspx1eKCZRDA-KSm9E0Cx0XKK5iv4nrXtiSZ6XEDotbhNuGd4JfTVMx5KWl5gzoBtqN3p9iWE9x1sc4-1031VssZDtY0hPgJ-r77v4Y119__fnPH2595n1Si-cXUwY8jPUSC4oXOpBp18XfhnuRTOLPxXsK5fT0sxHRYM0P5a28yLujkIYj34Gv17KBqbaKZiJj9X5AVF5GiyTNxWbOuYNsWhnHh8JWJs_kMOlDR_sNMclrDJVw790-f-mfCe8WGYmB333djVnSST_HHVFCGLQVzHcrDRwmUS2IgtbdLmHeLqRsXdMVq5VgnmQBLTQQD-gdCBO8RHjkfkCmr7t8lBC67i2UN0fGnA5U4yv-UXqygxM2eC6wRCT89YsfrNxynaR1Db-TC6LXU_5ZJo1qmb2xx3Ztgb6pIx3SujVrjoDqfNDeEw1exg8YajyajqtoLozI9tPyqNaNqMfVUFUz_8r8zHWxfr4_lUfpSDvtjrCMDoJQNo-RDt7qnyq3qcZkP9biVzaHB0ocTBvZb0DbQJFMStvDv_9He9_ZNYxRCpuM017UCahmm4gZ5ECP_eGOPD9Qmhl1awhWCcomrWMtZTfzpzZEEMC3OJl2od1Thu6VvsPr3cHoCNwpwAbpXxwq83zy6hK9V9njAL1oqF-AA01cVEes6A6xcef-XFXklTrbnDpZm_M9D8l8KzvSu_Kmxr5TD08_V1riA0c0AAWt3Klcm-q5qCY0gbKHLxyHwcEqJO_fJ64s-oLBO1uZusHWXGm36lnUcOFLV_JlHvLb64sz7gDL_DDTwXklrpI_QBbuuvdWQpDTKQRp-E91q7rtgqBmHcqa95u9u3HTslHPlyFMS2iAKvZP5v_9H0blzFOaCwAA.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9ERi1NU0lULVNDVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVtYmVkIjpmYWxzZX19";
  private static readonly EmbedUrl = "https://app.powerbi.com/reportEmbed?reportId=1ce76fdb-d49a-44fc-800f-a7d091f14b31&groupId=9ea4fee7-6a43-45fc-ba6e-9e2785e807fc&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9kZi1tc2l0LXNjdXMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D";
  private static readonly ReportId = "1ce76fdb-d49a-44fc-800f-a7d091f14b31";
  
  constructor() { }

  ngOnInit() {
  }

  generateReport(): void {
    const powerbi = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);

    // We give All permissions to demonstrate switching between View and Edit mode and saving report.
    var permissions = models.Permissions.All;

    // Embed configuration used to describe the what and how to embed.
    // This object is used when calling powerbi.embed.
    // This also includes settings and options such as filters.
    // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
    var config = {
      type: 'report',
      uniqueId: "test",
      datasetId: "21e01eb0-98a7-4479-aae7-5d3abab3df80",
      tokenType: models.TokenType.Embed,
      accessToken: DashboardPage.EmbedToken,
      embedUrl: DashboardPage.EmbedUrl,
      id: DashboardPage.ReportId,
      permissions: permissions
    };

    // Get a reference to the embedded report HTML element
    var embedContainer = document.getElementById("dashboard-report");

    // // Embed the report and display it within the div container.
    var report = powerbi.embed(embedContainer, config);

    // Report.off removes a given event handler if it exists.
    report.off("loaded");

    // Report.on will add an event handler which prints to Log window.
    report.on("loaded", function () {
      console.log("Loaded");
    });

    // Report.off removes a given event handler if it exists.
    report.off("rendered");

    // Report.on will add an event handler which prints to Log window.
    report.on("rendered", function () {
      console.log("Rendered");
    });

    report.on("error", function (event) {
      console.log(event.detail);

      report.off("error");
    });

    report.off("saved");
  }

}
