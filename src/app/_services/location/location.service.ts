import { Injectable, NgZone } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Capacitor, Geolocation, Toast } from '@capacitor/core';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    lat: any;
    lng: any;
    watchId: any;

    constructor(public ngZone: NgZone) {
        this.lat = 12.93448;
        this.lng = 77.6192;
    }

    public async GetGeolocation() {
        return this.getMyLocation().then(() =>{
            return { lat: this.lat, lng: this.lng };
        });
    }

    async getMyLocation() {
        const hasPermission = await this.checkGPSPermission();
        if (hasPermission) {
            if (Capacitor.isNative) {
                const canUseGPS = await this.askToTurnOnGPS();
                this.postGPSPermission(canUseGPS);
            }
            else { this.postGPSPermission(true); }
        }
        else {
            const permission = await this.requestGPSPermission();
            if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
                if (Capacitor.isNative) {
                    const canUseGPS = await this.askToTurnOnGPS();
                    this.postGPSPermission(canUseGPS);
                }
                else { this.postGPSPermission(true); }
            }
            else {
                await Toast.show({
                    text: 'User denied location permission'
                })
            }
        }
    }

    async postGPSPermission(canUseGPS: boolean) {
        if (canUseGPS) { this.watchPosition(); }
        else {
            await Toast.show({
                text: 'Please turn on GPS to get location'
            })
        }
    }

    async watchPosition() {
        try {
            this.watchId = Geolocation.watchPosition({}, (position, err) => {
                this.ngZone.run(() => {
                    if (err) { console.log('err', err); return; }
                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude
                    this.clearWatch();
                })
            })
        }
        catch (err) { console.log('err', err) }
    }

    clearWatch() {
        if (this.watchId != null) {
            Geolocation.clearWatch({ id: this.watchId });
        }
    }

    async askToTurnOnGPS(): Promise<boolean> {
        return await new Promise((resolve, reject) => {
            LocationAccuracy.canRequest().then((canRequest: boolean) => {
                if (canRequest) {
                    // the accuracy option will be ignored by iOS
                    LocationAccuracy.request(LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                        () => {
                            resolve(true);
                        },
                        error => { resolve(false); }
                    );
                }
                else { resolve(false); }
            });
        })
    }
    // Check if application having GPS access permission
    async checkGPSPermission(): Promise<boolean> {
        return await new Promise((resolve, reject) => {
            if (Capacitor.isNative) {
                AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
                    result => {
                        if (result.hasPermission) {
                            // If having permission show 'Turn On GPS' dialogue
                            resolve(true);
                        } else {
                            // If not having permission ask for permission
                            resolve(false);
                        }
                    },
                    err => { alert(err); }
                );
            }
            else { resolve(true); }
        })
    }

    async requestGPSPermission(): Promise<string> {
        return await new Promise((resolve, reject) => {
            LocationAccuracy.canRequest().then((canRequest: boolean) => {
                if (canRequest) {
                    resolve('CAN_REQUEST');
                } else {
                    // Show 'GPS Permission Request' dialogue
                    AndroidPermissions.requestPermission(AndroidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
                        .then(
                            (result) => {
                                if (result.hasPermission) {
                                    // call method to turn on GPS
                                    resolve('GOT_PERMISSION');
                                } else {
                                    resolve('DENIED_PERMISSION');
                                }
                            },
                            error => {
                                // Show alert if user click on 'No Thanks'
                                alert('requestPermission Error requesting location permissions ' + error);
                            }
                        );
                }
            });
        })
    }
}