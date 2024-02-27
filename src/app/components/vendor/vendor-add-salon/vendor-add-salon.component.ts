import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Compressor from 'compressorjs';

@Component({
  selector: 'app-vendor-add-salon',
  templateUrl: './vendor-add-salon.component.html',
  styleUrls: ['./vendor-add-salon.component.css'],
})
export class VendorAddSalonComponent implements OnInit {
  salonForm!: FormGroup;
  invalid: boolean = false;
  isSubmitted: boolean = false;

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.salonForm = this.formBuilder.group({
      salonName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]*$'),
        ],
      ],
      landmark: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[^\d\s]+(?:[^\d\s]+|\s)*$'),
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
    });
  }


  get salonName(): FormControl{
    return this.salonForm.get('salonName') as FormControl
  }

  get landmark(): FormControl{
    return this.salonForm.get('landmark') as FormControl
  }

  get locality(): FormControl{
    return this.salonForm.get('locality') as FormControl
  }

  get contactNumber(): FormControl{
    return this.salonForm.get('contactNumber') as FormControl
  }

  get district(): FormControl{
    return this.salonForm.get('district') as FormControl
  }

  get openTime(): FormControl{
    return this.salonForm.get('openTime') as FormControl
  }

  get closeTime(): FormControl{
    return this.salonForm.get('closeTime') as FormControl
  }
  

  get chairCount(): FormControl{
    return this.salonForm.get('chairCount') as FormControl
  }
  get banner(): FormControl{
    return this.salonForm.get('banner') as FormControl
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

console.log(`file size:`,file.size);

      if (file.size > 10485760) {
        this.compressImage(file).then((compressedFile) => {
          console.log('compressedsize:',compressedFile.size)
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
        quality: 0.6,
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

  onSubmit(): void {
    this.isSubmitted = true;

    console.log(this.salonForm.controls, 'contols');
    

    if (this.salonForm.invalid) {
      this.invalid = true;
      this.toastr.error('Please check the provided input');
      return;
    }

    console.log('submitted');
    const formData = new FormData();
    const formValue = this.salonForm.getRawValue();
    console.log(`formValue`, formValue);

    const facilities: string[] = [];

    if (formValue.wifi) {
      facilities.push('Wi-Fi');
    }
    if (formValue.parking) {
      facilities.push('Parking');
    }
    if (formValue.ac) {
      facilities.push('Air Conditioning');
    }
    if (formValue.cards) {
      facilities.push('Cards Accepted');
    }
    if (formValue.tv) {
      facilities.push('Television');
    }

    for (const key in formValue) {
      if (key === 'banner' &&formValue[key]) {
        formData.append(key, formValue[key], formValue[key]?.name);
      } else if (!['wifi', 'parking', 'ac', 'cards', 'tv'].includes(key)) {
        formData.append(key, formValue[key]);
      }
    }
    formData.append('facilities', JSON.stringify(facilities));

    console.log('FormData entries:');
    formData.forEach((value, key) => {
      console.log(key + ': ' + value);
    });

    this.http.post<any>('/vendor/add-salon', formData).subscribe({
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
