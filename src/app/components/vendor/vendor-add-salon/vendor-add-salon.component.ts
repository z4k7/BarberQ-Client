import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Compressor from 'compressorjs';
import { GeoapifyService } from 'src/app/services/geoapify.service';
import { initFlowbite } from 'flowbite';
import { ISalonApiResponse } from 'src/app/models/salon';

@Component({
  selector: 'app-vendor-add-salon',
  templateUrl: './vendor-add-salon.component.html',
  styleUrls: ['./vendor-add-salon.component.css'],
})
export class VendorAddSalonComponent implements OnInit {
  salonForm!: FormGroup;
  invalid: boolean = false;
  isSubmitted: boolean = false;
  showMap: boolean = false;

  markerLat: number = 0;
  markerLng: number = 0;

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  geoapifyFilled: boolean = false;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,

    private geoapifyService: GeoapifyService
  ) {}

  ngOnInit(): void {
    initFlowbite();

    this.salonForm = this.formBuilder.group({
      salonName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)*$'),
        ],
      ],
      landmark: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[^ds]+(?:[^ds]+|s)*$'),
        ],
      ],
      locality: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]*$'),
        ],
      ],
      district: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]*$'),
        ],
      ],
      contactNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('[0-9]*'),
        ],
      ],
      openTime: ['', [Validators.required]],
      closeTime: ['', [Validators.required]],
      chairCount: ['', [Validators.required, Validators.pattern('^[1-9]$')]],
      banner: [null, [Validators.required]],
      wifi: [false],
      parking: [false],
      ac: [false],
      cards: [false],
      tv: [false],
      latitude: 0,
      longitude: 0,
    });
  }

  get salonName(): FormControl {
    return this.salonForm.get('salonName') as FormControl;
  }

  get landmark(): FormControl {
    return this.salonForm.get('landmark') as FormControl;
  }

  get locality(): FormControl {
    return this.salonForm.get('locality') as FormControl;
  }

  get contactNumber(): FormControl {
    return this.salonForm.get('contactNumber') as FormControl;
  }

  get district(): FormControl {
    return this.salonForm.get('district') as FormControl;
  }

  get openTime(): FormControl {
    return this.salonForm.get('openTime') as FormControl;
  }

  get closeTime(): FormControl {
    return this.salonForm.get('closeTime') as FormControl;
  }

  get chairCount(): FormControl {
    return this.salonForm.get('chairCount') as FormControl;
  }
  get banner(): FormControl {
    return this.salonForm.get('banner') as FormControl;
  }

  onFileChange(event: any): void {
    console.log(`Event`, event);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      console.log(`file size:`, file.size / (1024 * 1024));

      if (file.size > 1048576) {
        this.compressImage(file).then((compressedFile) => {
          console.log('compressedsize:', compressedFile.size / (1024 * 1024));
          this.salonForm.get('banner')?.setValue(compressedFile);
        });
      } else {
        this.salonForm.get('banner')?.setValue(file);
      }
    }
  }

  compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.5,
        success(result) {
          resolve(result);
        },
        error(error) {
          console.error('Image compression error:', error);
          reject(error);
        },
      });
    });
  }

  openMap(): void {
    this.showMap = true;
  }

  onLocationChosen(location: { lat: number; lng: number }): void {
    if (location) {
      this.markerLat = location.lat;
      this.markerLng = location.lng;

      this.salonForm.get('landmark')?.enable();
      this.salonForm.get('locality')?.enable();
      this.salonForm.get('district')?.enable();

      this.geoapifyService
        .getLocation(this.markerLat, this.markerLng)
        .subscribe((response: any) => {
          console.log(`Geoapify response`, response);

          const salonLocality = response.features[0].properties.city || '';
          const salonDistrict =
            response.features[0].properties.state_district || '';
          const salonLandmark =
            response.features[0].properties.address_line1 || '';

          this.salonForm.get('latitude')?.setValue(this.markerLat);
          this.salonForm.get('longitude')?.setValue(this.markerLng);

          this.salonForm.get('landmark')?.setValue(salonLandmark);
          this.salonForm.get('locality')?.setValue(salonLocality);
          this.salonForm.get('district')?.setValue(salonDistrict);

          if (salonLandmark) {
            this.salonForm.get('landmark')?.disable();
          }
          if (salonLocality) {
            this.salonForm.get('locality')?.disable();
          }
          if (salonDistrict) {
            this.salonForm.get('district')?.disable();
          }

          this.geoapifyFilled = true;
        });

      this.showMap = false;
    } else {
      console.error('Invalid location:', location);
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.salonForm.invalid || this.markerLat == 0 || this.markerLng == 0) {
      this.invalid = true;
      this.toastr.error('Please check the provided input', 'Invalid Form');

      if (this.markerLat == 0 && this.markerLat == 0) {
        this.toastr.error(
          'Make sure you have choosed your location from map.',
          'Use Map'
        );
      }
      return;
    }

    const formData = new FormData();
    const formValue = this.salonForm.getRawValue();
    console.log('formValue:', JSON.stringify(formValue));
    const facilities: string[] = [];

    for (const facility of ['wifi', 'parking', 'ac', 'cards', 'tv']) {
      if (formValue[facility]) {
        facilities.push(facility);
      }
    }

    for (const key in formValue) {
      if (key !== 'latitude' && key !== 'longitude') {
        formData.append(key, formValue[key]);
      }
    }

    formData.append(
      'location',
      JSON.stringify({
        latitude: formValue.latitude,
        longitude: formValue.longitude,
      })
    );

    formData.append('facilities', JSON.stringify(facilities));

    console.log('FormData:');
    formData.forEach((value, key) => {
      console.log(key + ': ' + value);
    });

    this.http.post<ISalonApiResponse>('/vendor/add-salon', formData).subscribe({
      next: (response) => {
        console.log(`Response from backend`, response);
        this.toastr.success('Salon added successfully');
        this.salonForm.reset();
        this.isSubmitted = false;
      },
      error: (error) => {
        console.error('Error', error);
        this.toastr.error('Error adding salon');
      },
    });
  }
}
