import { Injectable } from '@angular/core';
import { ApplicationInsights, IExceptionTelemetry, DistributedTracingModes } from '@microsoft/applicationinsights-web';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Platform } from '@ionic/angular';


@Injectable({
    providedIn: 'root',
})

export class ApplicationInsightsService {
    private appInsights: ApplicationInsights;

    constructor(private router: Router,
        private platform: Platform,
    ) {

        this.appInsights = new ApplicationInsights({
            config: {
                instrumentationKey: environment.appInsightsKey,
                enableAutoRouteTracking: true // option to log all route changes
            }
        });

        this.appInsights.loadAppInsights();
        this.loadCustomTelemetryProperties();
        this.createRouterSubscription();
    }

    setUserId(userId: string) {
        this.appInsights.setAuthenticatedUserContext(userId);
    }

    clearUserId() {
        this.appInsights.clearAuthenticatedUserContext();
    }

    logPageView(name?: string, uri?: string) {
        this.appInsights.trackPageView({ name, uri });
    }

    logTrace(message: string, properties?: { [key: string]: any }) {
        this.appInsights.trackTrace({ message }, properties);
    }

    logEvent(name: string, properties?: { [key: string]: any }) {
        this.appInsights.trackEvent({ name }, properties);
    }

    logMetric(name: string, average: number, properties?: { [key: string]: any }) {
        this.appInsights.trackMetric({ name, average }, properties);
    }

    logException(error: Error) {
        const exception: IExceptionTelemetry = {
            exception: error
        };
        this.appInsights.trackException(exception);
    }

    private loadCustomTelemetryProperties() {
        this.appInsights.addTelemetryInitializer((envelope) => {
            const item = envelope.baseData;
            item.properties = item.properties || {};
            item.properties.ApplicationPlatform = this.platform.platforms.name;
            item.properties.ApplicationName = 'goOfflineE-App';
        }
        );
    }

    private createRouterSubscription() {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            this.logPageView(null, event.urlAfterRedirects);
        });
    }
}