/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalonService } from 'src/app/services/salon.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-vendor-salon-overview',
  templateUrl: './vendor-salon-overview.component.html',
  styleUrls: ['./vendor-salon-overview.component.css'],
})
export class VendorSalonOverviewComponent implements OnInit {
  salonId: string = '';
  totalBookings: any[] = [];
  todaysBookings: any[] = [];
  totalRevenue: number = 0;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private salonService: SalonService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.route.params.subscribe((params) => {
      console.log(`Params`, params);
      this.salonId = params['id'];
    });
    console.log(`salonId`, this.salonId);
    this.getDashboardData(this.salonId);
  }

  getDashboardData(salonId: string) {
    this.salonService.getDashboardData(salonId).subscribe({
      next: (res) => {
        this.totalBookings = res.data.totalBookings;
        this.todaysBookings = res.data.todaysBookings;
        this.totalRevenue = res.data.revenue;
        this.isLoading = false;
        this.spinner.hide();
      },
      error: (error) => {
        console.log(`Error `, error);
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  barChartData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        data: [89, 34, 43, 54, 28, 74, 93],
        label: 'Sales Percent',
        backgroundColor: '#f88406',
      },
    ],
  };
}
