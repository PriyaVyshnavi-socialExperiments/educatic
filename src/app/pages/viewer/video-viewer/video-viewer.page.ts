import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import * as PluginsLibrary from 'capacitor-video-player';
const { CapacitorVideoPlayer, Device } = Plugins;

import { ICourseContent } from 'src/app/_models/course-content';
import { BlobStorageRequest } from 'src/app/_services/azure-blob/azure-storage';
import { SasGeneratorService } from 'src/app/_services/azure-blob/sas-generator.service';


@Component({
  selector: 'app-video-viewer',
  templateUrl: './video-viewer.page.html',
  styleUrls: ['./video-viewer.page.scss'],
})
export class VideoViewerPage implements OnInit, AfterViewInit {

  courseContent: ICourseContent;
  title = '';
  videoPlayer: any;
  constructor(private sasGeneratorService: SasGeneratorService,
    private navCtrl: NavController) { }

  ngOnInit() {
  }

  async ngAfterViewInit() {
    this.courseContent = history.state;
    if (!this.courseContent.categoryName) {
      this.navCtrl.back();
    }
    this.title = `${this.courseContent.categoryName} - ${this.courseContent.courseName}`;

    const info = await Device.getInfo();
    if (info.platform === 'ios' || info.platform === 'android') {
      this.videoPlayer = CapacitorVideoPlayer;
    } else {
      this.videoPlayer = PluginsLibrary.CapacitorVideoPlayer
    }

    this.VideoConfig();

    this.sasGeneratorService.getSasToken('coursecontent').subscribe(async (blobStorage: BlobStorageRequest) => {
      const videoURL = `${blobStorage.storageUri}coursecontent/${this.courseContent.courseURL}`;
      await this.videoPlayer.initPlayer({ mode: 'fullscreen', url: videoURL });
    })
  }

  private VideoConfig() {
    document.addEventListener('jeepCapVideoPlayerPlay',
      (e: CustomEvent) => {
        console.log('Event jeepCapVideoPlayerPlay ', e.detail);
        this.navCtrl.setDirection('back');
      }, false);
    document.addEventListener('jeepCapVideoPlayerPause',
      (e: CustomEvent) => {
        console.log('Event jeepCapVideoPlayerPause ', e.detail);
      }, false);
    document.addEventListener('jeepCapVideoPlayerEnded',
      (e: CustomEvent) => {
        console.log('Event jeepCapVideoPlayerEnded ', e.detail);
      }, false);
      document.addEventListener('jeepCapVideoPlayerExit',
      (e: CustomEvent) => {
        console.log('Event jeepCapVideoPlayerExit ', e.detail);
        this.navCtrl.setDirection('back');
      }, false);
  }

}
