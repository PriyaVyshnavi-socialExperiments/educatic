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
  private static readonly EmbedToken = "H4sIAAAAAAAEACWWt87EXHJE3-VPKYAcegrYgN4Pvc3o3dD7u9C761spr6DRXXWq__2Pnb2_OSv_-e9_kNq_LvInJrB3M-mBzdhdgEQ-5GIy9pBqPXYsbvrZv8CSUUiyTOPWlj72Ju-XmL6jfwpWGbU17jW-9XHD3yDqcfpNaaymee0nC9k0XksEOqaqqQyHjdqbhq4Wz9Z3rpPkzhmCddL4FUNlCD-2pBzI0FXS-p0N7GvRL6z1NnpSds90ZingCJN89Aa3KBEuhTGEge3Mo131h8dP8hRTn2ZcoZxn3Th6OKcZHYUIA9P5rXXUJi7KdyOfX9uLTHmMhZaba1gmru65A36qws3_ODoQjB9sUVXnqLYo0_nCjEmFdggvLNXDIqScAZEd-hAmWP0G3tiKNFNtlAOd6SWdhTnQI7OJe0lGXtnh50ahlRWF-emuiSEYAqpsvai-99HMcxjtNlNQq_qOPYQhC3PrDWxOyKeR6jQBi69PwV7LV3wZD59zAOqAu9PK1f00_zCz96MUu8AMFvYVQY97ni05-1PjrGC9XDcazmgxUW6pw-09jL9-GFRcrubhA44_CRdWqxIPgm5nN_meVWjKQdK5EvmLX6Pak4ygWS8rOGN1rdRmEL2Vj9hfGpWZu6i8uekj5iJzyJP_kTCiU3e-wviv0ROe4lhsq6da1yzJg0tpyjGSc8h8rDbyiNJzcdUdPKgB4FfYbSEWw2IPn-lj0-ZsOTtqtUZwhtcwjswUrzOlfblZ4nWDrryiBpSX4GWMab4ETujPxKru6IE1RNSDSpjLkF0Q5hriMT1itq5rU4yNLeQO4NHOuicOCMGYMkjjj6Af-iQnmz3X96VIRIky5Us2DgVNwXsGEO3s_oFIpHClZlpd1jZMYAthIegnmhmmN-Gw2Hi16QFpg-akoSUKkZKw13y35GNhT0NjgZVrpBSYe0ZeXYTbLtw0BUUwr9JqqVWAqtkpD0o_PfJIqDfDWSrN1PoGH8Hyyv1Uap8vGwbZV5e9AmSld_Rua0mhfXUIWZJx_BcRc7cU9ADnTUwDUWx82bCa7mXq7aGRLWWVAXSCp9ccDQ902Q2TerJSYZNK4tx16W4iUBLQ1JMH0jadj19IxZjcDNLejrRah2z8fdN8ROzmW3gfGnsbP0yFUO77QUbYPl6Roy_76zex5_gGalDsHy-ayarFf9XqBTrR2E15AbwZPt_y6_wMrltpQV-dJ_50YYXSUAbsI1MNjoUA0Dm3_wsFS9imXqGr6q_yBOXDcef6PBT8Sp5wxTRDOUtCEhc6D7twciq9c1E1d_Ek3wPKlYnWQ-WMJf-m5j4b6nj4JX2NNI6N-eWCkDcp9hM1pGlfXeAM0O2vFJtlCHweWIJDXNdTQtaek7Rm1lGxIknSnBdpLP6j3B9WiiSc9KKkHz5Ek2Zv5bPXyQOO-y72ekTq8qMI2rjLgOx4SjJaDx2KnY2HjjKc6lPOf4dyGeeIWFkaCBhjiEdUrbAlHAzM3HvQRpRw8Xjj3NB9zD7HIShJiqciVnXDy6imurVF84-L9Bb_KHquR8tgoPGqxpPXfng7w-rk8JXJflh-lxuUE4ZrqkZ-Z2LxhbYa6c6a4CXHii9Fqe9KhKg4AiRqZXU-CNav4nGeodzxzFyOfm3WLxwJdoTSOZyc8eR0y3mID1qcyxY17XMXEZ3L4mR4LAuIngj2j_i8f-W96dfZ_XWLhcKFZC1Hw3qgeY4LokpCuhroXoUIwWetLzwLQhdlS8QGMgOhpbL24o_eBgU2bTHbB11BwJzwZIxWZAxdgwFcuAg4_8gqPl3je4L2rwQYe4VeAX1TrCQDxI_ICG5Pz5Uns8NeBtI2urCuw9kKZfrCrzeJ8wtsQ-ynvb0u2dyt9AeVbBBxAaeLgA6nli8tULGNw1WhqyaKuqSfZQZAabkLXUQquS1GXYLTw75O-Fxs9yWhvj2G2LTc6dg1fC-ysaVs74CQxvHt3hQ_lRpcH31eFV2MKFnpVJ36vTbJC056ta2cPSbCob6l1FA8HyJa8T4hcHzCK7NlGVShQjI8j1v6w94ck-Vxv6OwMONNtKeab_uKMwtU4eIiB-n-PkcVXoD0n34OUl8sif5I4R43AqJjAXwBOifYdeJ0eYm2yYCZJRA2a9vPF60ttBSsHdWPIiHJvVHpJaS-gvOz9Fzzwrjy0S-24nD6hwf763Ph0bG9NllszyV9YK3xqR9X2fzrX__81z_89i7HrFfv35vhChFVKz6Xec-ymNaDPLni87fiBg7XAmZlbl4esTJVbLgzISLttrgFi_f5QcuAfFUsfyUYBFFz53nR66R34TQ4usJCMH79mRYKYg7J4zbG2uVGy96h0qApNgEaqo2F0bbrC8T8QXWG4lCopWHV8X-d6iBO74C-UWVGIsK96cQp2wM8l1v9nMGfFVeIcJk_5lBzjzb1p3DzF7B154qifaE6OkKtY9jFri01xX9u7snt8WchtdnZ6TMvppTB7o04wYizIAw8w9pGv7PaM9AIS01mUhsIjcMwRgp7idXrxbqNfaq2Gueckc09N8G1Ohhw1vhwfiPByoWZYUR0909z4FCB6vv_1_wubbWp4d-WJyNb3WU9J5bkW8U7vZNAW-f_VF7XTNlxbtV_ZO4KHUX1hZrxqwKkQmuXaejbHUrK7U_muY1P3P74UU5N4q-JnB6Ntb_iKaVjhuQ69vasnB1nCpa2Y6QiSq-4RAwy328W_kI-lYH60hVK5kxkajgwZKsY_ZHBQpP9CLnQxcuxso4OXCdW1-jvfSjujksTV4NFqhreKOFXo20k5SsiYW9JlBXSipuTaC4m6xTFqN1aZ2uN3ehvxhpmUzDPoy5zJk3C9AFUfeBjGyP8u2abQbwhepfjMQ9VEe1B_r0HCXcXH4gmWkY67cRZsWbzr818za3-AgDZTGjdYvoEsdvErG7164wfzXqPId3DrN5aYCec-goTRjmy731B91GYL9f-x_P_878vm0Y2WgsAAA==.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLVdFU1QyLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJtb2Rlcm5FbWJlZCI6ZmFsc2V9fQ==";
  private static readonly EmbedUrl = "https://app.powerbi.com/reportEmbed?reportId=9abd3178-1724-41be-8184-af3b33f3be1c&groupId=46daf879-abaa-40fd-bcab-d0d4537c2700&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVzLXdlc3QyLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9";
  private static readonly ReportId = "9abd3178-1724-41be-8184-af3b33f3be1c";
  private static readonly Scopes = ["https://analysis.windows.net/powerbi/api/Report.Read.All"];
  private static readonly ClientId = "36013c75-089b-4b68-a71d-47b99d2666b6";
  private static readonly WorkspaceId = "46daf879-abaa-40fd-bcab-d0d4537c2700";
  private static readonly DatasetId = "5d5065bd-7a06-4e8f-b419-831ae37a457d";

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
