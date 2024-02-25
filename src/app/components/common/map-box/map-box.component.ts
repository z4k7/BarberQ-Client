import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css'],
})
export class MapBoxComponent implements OnInit {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 30.2672;
  lng: number = -97.7431;

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat],
    });

    this.map.on('load', () => {
      this.map?.addSource('earthquakes', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
      });

      this.map?.addLayer({
        id: 'earthquakes-layer',
        type: 'circle',
        source: 'earthquakes',
        paint: {
          'circle-radius': 4,
          'circle-stroke-width': 2,
          'circle-color': 'red',
          'circle-stroke-color': 'white',
        },
      });

      this.map?.addSource('Austin Hex', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: [],
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-97.792921355615277, 30.127749592004189],
                [-97.792921355615277, 30.196912993949898],
                [-97.723644348336762, 30.231476492188843],
                [-97.654367341058247, 30.196912993949898],
                [-97.654367341058247, 30.127749592004189],
                [-97.723644348336762, 30.093149704984011],
                [-97.792921355615277, 30.127749592004189],
              ],
            ],
          },
        },
      });

      this.map?.addSource('Austin Points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [-97.693686723567652, 30.282059053494251],
              },
              properties: {
                title: 'Austin 1',
              },
            },
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [-97.763899906620225, 30.251333606714322],
              },
              properties: {
                title: 'Austin 2',
              },
            },
          ],
        },
      });

      this.map?.addLayer({
        id: 'Austin Hex',
        type: 'fill',
        source: 'Austin Hex', // reference the data source
        layout: {},
        paint: {
          'fill-color': '#0080ff', // blue color fill
          'fill-opacity': 0.5,
        },
      });

      this.map?.addLayer({
        id: 'Austin Points',
        type: 'circle', // circle marker types
        source: 'Austin Points', // reference the data source
        layout: {},
        paint: {
          'circle-color': 'blue',
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-stroke-color': 'white',
        },
      });
    });
  }
}
