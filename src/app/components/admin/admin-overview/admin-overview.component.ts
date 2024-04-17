import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.css'],
})
export class AdminOverviewComponent implements OnInit {
  constructor(
    private adminService: AdminService,
    private spinner: NgxSpinnerService
  ) {}

  vendorCount: number = 0;
  salonCount: number = 0;
  totalRevenue: number = 0;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.spinner.show();
    this.getDashboardData();
  }

  getDashboardData() {
    this.adminService.getDashboardData().subscribe({
      next: (res) => {
        this.vendorCount = res.data.vendors;
        this.salonCount = res.data.salons;
        this.totalRevenue = res.data.revenue;
        this.isLoading = false;
        this.spinner.hide();
      },
      error: (error) => {
        console.log(`Error`, error);
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  lineChartData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        data: [89, 34, 43, 54, 28, 74, 93],
        label: 'Sales Percent',
        fill: true,
        backgroundColor: 'rgba(255, 255, 0, 0.3',
        borderColor: 'black',
      },
    ],
  };
}
