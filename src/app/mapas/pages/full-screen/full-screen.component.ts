import { Component, OnInit } from '@angular/core';
import * as mapboxgl from "mapbox-gl";

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `
     #mapaFull{
      width: 100%;
      height: 100%;
     }
    `
  ]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    var map = new mapboxgl.Map({
      container: 'mapaFull',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-4.542200928432322, 43.37405977172291],
      zoom: 18
    });

  }

}
