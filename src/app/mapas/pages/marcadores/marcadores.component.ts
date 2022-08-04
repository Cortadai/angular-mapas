import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorConColor{
  color:string,
  marcador?: mapboxgl.Marker,
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
     .mapa-container{
      width: 100%;
      height: 100%;
     }

     .list-group{
      position:fixed;
      top:20px;
      right:20px;
      z-index:99;
     }

     li{
      cursor:pointer;
     }

    `
  ]
})
export class MarcadoresComponent implements AfterViewInit, OnDestroy {

  @ViewChild("mapaMarcadores") divMapa!:ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number=15;
  center: [number,number]=[-4.542200928432322, 43.37405977172291];

  // Arreglo de marcadores
  marcadoresConColor: MarcadorConColor[]=[];

  constructor() { }

  ngOnDestroy(): void {
    this.mapa.off("dragend",()=>{});
  }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.recuperarMarcadoresLocalStorage();

    // const markerHtml: HTMLElement = document.createElement("div");
    // markerHtml.innerHTML="Hola Mundo"
    // new mapboxgl.Marker({
    //   element:markerHtml
    // })
    //   .setLngLat(this.center)
    //   .addTo(this.mapa);

  }

  agregarMarcador(){

    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
      draggable:true,
      color:color
    })
    .setLngLat(this.center)
    .addTo(this.mapa);

    this.marcadoresConColor.push(
      {color, marcador:nuevoMarcador}
    );
    
    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on("dragend", ()=>{
      this.guardarMarcadoresLocalStorage();
    });

  }

  navegar(marcadorConColor: MarcadorConColor){

    this.mapa.flyTo({
      center: marcadorConColor.marcador!.getLngLat()
    })

  }

  guardarMarcadoresLocalStorage(){

    const coordenadasSalvadas:MarcadorConColor[]=[];

    this.marcadoresConColor.forEach(m => {
      const color = m.color;
      const {lng,lat} = m.marcador!.getLngLat();
      coordenadasSalvadas.push({
        color:color,
        centro:[lng,lat]
      })
    });

    localStorage.setItem("marcadores", JSON.stringify(coordenadasSalvadas));
  }

  recuperarMarcadoresLocalStorage(){

    if(!localStorage.getItem("marcadores")){
      return;
    }

    const coordenadasRecuperadas:MarcadorConColor[] = 
      JSON.parse(localStorage.getItem("marcadores")!);

    coordenadasRecuperadas.forEach(m => {
      const marcadorRecuperado = new mapboxgl.Marker({
        color:m.color,
        draggable:true
      })
        .setLngLat(m.centro!)
        .addTo(this.mapa);

      this.marcadoresConColor.push({
        color:m.color,
        marcador: marcadorRecuperado
      });

      marcadorRecuperado.on("dragend", ()=>{
        this.guardarMarcadoresLocalStorage();
      });

    });

  }

  borrarMarcador(index:number){
    this.marcadoresConColor[index].marcador?.remove();
    this.marcadoresConColor.splice(index,1);
    this.guardarMarcadoresLocalStorage();
  }

}
