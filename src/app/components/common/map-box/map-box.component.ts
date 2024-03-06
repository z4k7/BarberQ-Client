import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { CommonModule } from '@angular/common';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class MapBoxComponent implements OnInit {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 11.2588;
  lng: number = 75.7804;
  marker: mapboxgl.Marker | undefined;
  geocoder: MapboxGeocoder | undefined;
  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>();
  @Output() chooseLocation = new EventEmitter<{ lat: number; lng: number }>();

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat],
    });

    this.map.on('load', () => {
      this.geocoder = new MapboxGeocoder({
        accessToken: environment.mapbox.accessToken,
        mapboxgl: mapboxgl,
        placeholder: 'Search for a location',
      });

      this.map?.addControl(this.geocoder);

      const canvas = this.map?.getCanvas();
      if (canvas) {
        canvas.style.cursor = 'grab';
      }

      this.map?.on('dblclick', (e) => {
        const { lngLat } = e;
        if (this.map && lngLat) {
          this.addMarker(lngLat);
        }
      });
    });
  }

  addMarker(lngLat: mapboxgl.LngLat): void {
    // Remove existing marker
    if (this.marker) {
      this.marker.remove();
    }

    // Create a new marker at the clicked location
    this.marker = new mapboxgl.Marker({
      draggable: true,
    }).setLngLat(lngLat);

    // Add the new marker to the map
    if (this.map) {
      this.marker.addTo(this.map);
    }
  }

  chooseLocationClicked(): void {
    if (this.marker) {
      const coordinates = this.marker.getLngLat();
      this.chooseLocation.emit({
        lat: coordinates.lat,
        lng: coordinates.lng,
      });
    }
  }

  onMoveMarker = (e: mapboxgl.MapMouseEvent) => {
    const lngLat = e.lngLat;
    this.marker?.setLngLat([lngLat.lng, lngLat.lat]);
    this.chooseLocation.emit({
      lat: lngLat.lat,
      lng: lngLat.lng,
    });
  };
}
