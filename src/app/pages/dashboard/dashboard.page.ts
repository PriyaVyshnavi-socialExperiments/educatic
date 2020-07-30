import { Component, OnInit } from '@angular/core';
import { service, factories, models, IEmbedConfiguration } from "powerbi-client";
import { UserAgentApplication, AuthError, AuthResponse } from "msal";
import { Promise } from "bluebird"; // For MSAL support in IE


let accessToken = "";
let embedUrl = "";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  private static readonly EmbedToken = "H4sIAAAAAAAEACWWtw7shg5E_-W2MqCcDLhQztJqldUp55xlvH9_C7jmgMXhcMh__3ySp5-S_M_ff5yT78_zNTL0rgmpawC-My7mawlAenNc2JRMLZ17GAgIrfNzTBBKE9p1nkr3WlMzYZGUXDDv-HnYjvSFHYyQw1fdq8vPi0Y27rQ-KgA_NhdAbuNXFoguyzYEXyOWNB0x4C-Fuk9t9cy0nwNRwsa387YYgtKiPg04P_YYIUQjBFWR8ZRUXJDT_Rj3VpmvbE7cxZFGn4lyaSiQbMOC5dXzxUXiq6fF-O6d3-7W0x7qJMlOxl2VPYrnmQzky5pM0aOVtMPAffE1r5JZE66ZJ0w0eq_7vbyUgjM61ooFdpTWU6m1NvQAglwnmhL8ZKwD9nybKkaXryLahot5GwEReYze50ySKlHSTbx2t9qamSzLhuA9Ff-FGLckJt3PPKVkeHNBGbsIN7EB0JeaN_a81tO24g48YtdYm5G5WvZjP9j-iduplc6pySuSfupcRZz7bb0-XIiOf17ojAhohbAro3mu5C48zCkOv8wANdWygzrkgHJyhzwqf_Erwb4D1COoFG2SX-mcRPq2Sach7pMixTF35FX9B9D45imbI7Q2mecjACvsTNIitkXb6dNccvVygwC7HoeMHqmMVFyjcSsZVn_X7hWiCn7364yUmGlA1Jh4BcV9uC-8JkIDP9uPITAMrS1ISx3r5Ef1m8UzzZ2TWRjFvFTvQASSORCjaMYSqlhhnAzrw1NCmwqUhG9mOZxDZ4HFd91OgW5QyaJZgFcpaWYh0p_dItsD3XhAYnG6C8zxhsnQjVQn-YZxxSy20SJ-EHFMd6YQ7r4EouVWLsfI-hHMrMshmqLIBt1Qjq0iz93oKaeQhcGhzfditzSI8AwJliOkRFUbxua4XjyvZG6GWZBLeY64dDowivHfZ6ZRas5nE59jNmi2R5kQvjWYa6nsxehhYTyqNkcrFC6QgxWSlpLUiEWhNe9pgo5TqDoaN0cBC6RuxpntMlJeSOo_dV0uBU1ckKfRPpcH_pwBwoDOB9ykEzUZhSIJdkXQZkV44rdIYNWNLpILF1ubIHF1fELhNyzHSX0SelBLYfmLBM81YLE6V_Yzv6Jkdm1NlJvY-VdmNwLRlkMAU6eyZ1vMCW8NK5KZlobv-ZQ8wlBjkoTiobv2-nDKWNeFrtFkJG1kg7zsFpa7xTj72NW74zBha-G0IU3LKgIAI930tVS2lfXANyzC8gS81CqvOdb2tn9-6NjynpnssHan8tQ8-xHMM9PJahIwmuwzxH479_TrVOuKOm1oYL6PzN1KThPZe20PKCezSKFlk903QcyMrTms-ooyWN0PdObjI7PBF2nbODVz5mMizM2GHLVryuzNfFL9XI8aSGefj5Nm_CvblZ9zKKHg9vogxBn5dlyYgJIX_jtjV_9WKDgN79MJ-UfvsYPyGYO4nxHkSxHjlWmzo8gxTJR6BWU5NEYdkb782AwuVKWH-OXUIaVah8g4w3itth3PgdYHNI8pUoMXKdr8dG_6g9arjqcSfekI5mVF9RHfnYAQoViPcTcuJ15Q_5Mzbn244Cdunj6oAXHp9hRh31klAAU3jsC7co5Di9ELN7d0gcBZcbcSknvk0VN8z1-C0IL0DYR90mJWRSCF2o7Rf7TQQ7vrqLHCNVTFxnjw8n1HhGbQQJVCQda2A4X6WrPL4TsECcxfHefjHfrgxGjOUSzrYUcO8k5xsLtW1j5krg_mlKzUSW5mWY_VQfBLJ_KLoK3z-UGf9rcspDPpSPqkX5xCajNBVUE_5BUTw3iXKiqroAVPj9GK7sym9ZgSUhdKzlp-5nYBHKTqvsEwNvpCsizGDlnyRbdV5Q4vl3DJMNY31ycgHpvpfeDBn0Mh0hp7xS7_5aXEGMVxrfdG9SdidiXtfYKSCR4A9uvoraDRnTHgqvUtRlcCJkixlePbd1P-zgQ2RKD52tQnbhQNB8aT-eDA8oofV3fzXPtCPTmvjNgH_M7mY8326sk7einNIzPT5OE9pukgWP-EBVF5pdrQKKaIIGgpWQvIkVvfju2BVVrv15gdW79fR_I6th3E0hJ_dBxdjb0aPFO0KSistBFId4F6OdygOupIsHlQrQea6tqUmY3lECcN1WfhY1wSdFPeVj161Jja9m9JtEbIF86iL1MANWL7mATjBw-zQxObANhX0K4LnwDAeYuZhRo149zl9A0IalWaVsUWdVNZHbRoqX_nusOpU9-eNbyxhc8aYwzq5QK9ahswfhaFS0HYM7H_-efPX3-49Zl__iue35sSQ1c0BS9MADNsalFaGGqcKd1R1iiz_XqMk0OJQX-WrVygzeTu8hxoX-VcOwRqyEi2_dAn8yjGmyhLL6mfxr7gkxYLNqJ04LiXvmHe-ImQsO43xbRUWei7fkYI8czBLHucXwWEQDtIXrmS_PTE257J2aOCPtHHax_4b6WJXiuyXZKrOYjfdi9BKWtDEJxkY0d9vqZIe8qq7zZSU1EokaTOtqjrr7P742hefkssa9jOaEmIqozQfH096y2zidhgDQwNafLNmBmLHMYzQwno5RR2fkGyirgedVSRdObLGTu57fkEp5GT_wa3pjiP7UEYixd54hosu14sZE8uJ1s9qa34dtV_mJ-5LlbF_1FOWxxeCg0uH2qsKdCT8mEl_1M5TTUm-7EWP5kbv7DhKFE_4naominBwFGzgbdZURuplrVAfcyo0H1T2cGj-r0Cg255dDguRva0sed5UD7a8hTVq9KxQint99dB0fljnPQ4JtLn05v7I2Ch4GlrzaOU6TugSoYAW54oRnOdB-z3gBrDMSKmkHplQW5ZmBQxM4sEMTVwygHSHmwgbGWcKF0-PMJJd3gD9HaIlx4XtyE8TnsD5Wvkm3xhkaEZwHyGJTJsJNriwUnm77lfPLLT6u2OUzDP215fKAruq2uia2BIWg12e8_tSQ7nyUSLtNCBcabpa9mdzDqazRREiMVNNPfqJvRIlgHmmrT5w9ct-9SHMQ2FDl5BrbiAGsFAJeaH-X__B5FsKnGaCwAA.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9ERi1NU0lULVNDVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVtYmVkIjpmYWxzZX19";
  private static readonly EmbedUrl = "https://app.powerbi.com/reportEmbed?reportId=f88b23fe-e6ae-4abe-978e-e3c22d961fc6&groupId=9ea4fee7-6a43-45fc-ba6e-9e2785e807fc&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9kZi1tc2l0LXNjdXMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQvIn0%3D";
  private static readonly ReportId = "f88b23fe-e6ae-4abe-978e-e3c22d961fc6";
  private static readonly Scopes = ["https://analysis.windows.net/powerbi/api/Report.Read.All"];
  private static readonly ClientId = "36013c75-089b-4b68-a71d-47b99d2666b6";
  private static readonly WorkspaceId = "9ea4fee7-6a43-45fc-ba6e-9e2785e807fc";
  private static readonly DatasetId = "4d91a780-759a-4cbd-bde3-05a59efe25d8";

  constructor() { }

  ngOnInit() {
  }

  generateReport(): void {
    const powerbi = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);

    // We give All permissions to demonstrate switching between View and Edit mode and saving report.
    var permissions = models.Permissions.All;
    // this.authenticate();

    // Embed configuration used to describe the what and how to embed.
    // This object is used when calling powerbi.embed.
    // This also includes settings and options such as filters.
    // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
    var config = {
      type: 'report',
      uniqueId: "test",
      datasetId: DashboardPage.DatasetId,
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


  // Authenticating to get the access token
  authenticate(): void {
    const thisObj = this;

    const msalConfig = {
      auth: {
        clientId: DashboardPage.ClientId
      }
    };

    const loginRequest = {
      scopes: DashboardPage.Scopes
    };

    const msalInstance: UserAgentApplication = new UserAgentApplication(msalConfig);

    function successCallback(response: AuthResponse): void {

      if (response.tokenType === "id_token") {
        thisObj.authenticate();

      } else if (response.tokenType === "access_token") {
        accessToken = response.accessToken;
        thisObj.getEmbedUrl();

      }
    }

    function failCallBack(error: AuthError): void {
    }

    msalInstance.handleRedirectCallback(successCallback, failCallBack);

    // check if there is a cached user
    if (msalInstance.getAccount()) {

      // get access token silently from cached id-token
      msalInstance.acquireTokenSilent(loginRequest)
        .then((response: AuthResponse) => {

          // get access token from response: response.accessToken
          accessToken = response.accessToken;
          this.getEmbedUrl();
        })
        .catch((err: AuthError) => {

          // refresh access token silently from cached id-token
          // makes the call to handleredirectcallback
          if (err.name === "InteractionRequiredAuthError") {
            msalInstance.acquireTokenRedirect(loginRequest);
          }
        });
    } else {

      // user is not logged in or cached, you will need to log them in to acquire a token
      msalInstance.loginRedirect(loginRequest);
    }
  }

  // Power BI REST API call to get the embed URL of the report
  getEmbedUrl(): void {
    const thisObj: this = this;

    fetch("https://api.powerbi.com/v1.0/myorg/groups/" + DashboardPage.WorkspaceId + "/reports/" + DashboardPage.ReportId, {
      headers: {
        "Authorization": "Bearer " + accessToken
      },
      method: "GET"
    })
      .then(function (response) {
        const errorMessage: string[] = [];
        errorMessage.push("Error occurred while fetching the embed URL of the report")
        errorMessage.push("Request Id: " + response.headers.get("requestId"));

        response.json()
          .then(function (body) {
            // Successful response
            if (response.ok) {
              embedUrl = body["embedUrl"];
            }
            // If error message is available
            else {
              errorMessage.push("Error " + response.status + ": " + body.error.code);
            }

          })
          .catch(function () {
            errorMessage.push("Error " + response.status + ":  An error has occurred");
          });
      })
      .catch(function (error) {
      })
  }


}
