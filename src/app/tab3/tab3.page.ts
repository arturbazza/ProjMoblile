import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonButton, IonCardContent, IonItem } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Component, NgZone, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
@Component({
    selector: 'app-tab3',
    templateUrl: 'tab3.page.html',
    styleUrls: ['tab3.page.scss'],
    standalone: true,
    imports: [IonicModule, ExploreContainerComponent],
})
export class Tab3Page implements OnInit {
    latitude: number | undefined = 0.0
    longitude: number | undefined = 0.0
    permission: PermissionStatus | undefined
    watchId: any;
    options = {
        enableHighAccuracy: true,
        maximumAge: 0
    };
    constructor(private readonly toastController: ToastController, private readonly zone: NgZone) { }
    ngOnInit() {
        this.requestPermissions()
    }
    async requestPermissions() {
        const permResult = await Geolocation.requestPermissions();
        console.log('Perm request result: ', permResult);
        this.permission = permResult;
    }
    async getCurrentPosition() {
        const toast = await this.toastController.create({
            message: `Getting current position`,
            position: 'top',
            duration: 3000
        })
        await toast.present()
        Geolocation.getCurrentPosition(this.options).then(data => {
            const toast = this.toastController.create({
                message: `Current position ${JSON.stringify(data)}`,
                duration: 3000
            }).then(t => t.present())
            this.latitude = data.coords.altitude ? data.coords.latitude : undefined
            this.longitude = data.coords.longitude ? data.coords.longitude :
                undefined
        }).catch(err => {
            const toast = this.toastController.create({
                message: `Error: ${err}`,
                duration: 3000
            }).then(t => t.present().then(() => { }))
        });
    }
    watchPosition() {
        if (this.watchId) {
            return;
        }
        const watchId = Geolocation.watchPosition(this.options, async (coordinates,
            err) => {
            this.zone.run(() => {
                this.latitude = coordinates?.coords.latitude
                this.longitude = coordinates?.coords.longitude
            })
            if (err) {
                const toast = await this.toastController.create({
                    message: `Error: ${err}`,
                    duration: 3000
                })
                await toast.present()
            }
        })
        this.watchId = watchId
    }
    clearWatch() {
        if (this.watchId) {
            Geolocation.clearWatch({ id: this.watchId });
            this.watchId = null;
        }
    }
}