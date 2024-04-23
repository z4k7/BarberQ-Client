/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IVendor } from 'src/app/models/vendor';
import { selectVendorDetails } from 'src/app/state/vendor-store/vendor.selector';
import { VendorService } from 'src/app/services/vendor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-vendor-overview',
  templateUrl: './vendor-overview.component.html',
  styleUrls: ['./vendor-overview.component.css'],
})
export class VendorOverviewComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    private vendorService: VendorService,
    private spinner: NgxSpinnerService
  ) {}

  data: {
    labels: string[];
    datasets: { label: string; data: number[]; backgroundColor: string[] }[];
  } = {
    labels: [],
    datasets: [
      {
        label: 'Sales Amount',
        data: [],
        backgroundColor: [],
      },
    ],
  };

  activeSalons: number = 0;
  totalBookings: any[] = [];
  totalRevenue: number = 0;
  isLoading: boolean = true;

  vendorState$ = this.store.select(selectVendorDetails);
  vendorData!: IVendor;
  vendorSubscription!: Subscription;

  monthlySalesData: { salonName: string; data: number[] }[] = [];

  ngOnInit(): void {
    this.spinner.show();
    this.vendorSubscription = this.vendorState$.subscribe((vendor) => {
      if (vendor) {
        this.vendorData = vendor;
        this.getDashboardData(this.vendorData._id);
      }
    });
  }

  ngOnDestroy(): void {
    this.vendorSubscription.unsubscribe();
  }

  getDashboardData(vendorId: string) {
    this.vendorService.getDashboardData(vendorId).subscribe({
      next: (res) => {
        this.activeSalons = res.data.salons;
        this.totalBookings = res.data.bookings;
        this.totalRevenue = res.data.revenue;
        this.isLoading = false;
        this.spinner.hide();
        console.log(`Bookings in response`, this.totalBookings);

        const salonNames: string[] = [];
        const salesData: number[] = [];
        const backgroundColor: string[] = [];
        res.data.bookings.forEach((booking: any) => {
          if (!salonNames.includes(booking.salonName)) {
            salonNames.push(booking.salonName);
            salesData.push(booking.totalAmount);
            backgroundColor.push(this.getRandomColor());
          } else {
            const index = salonNames.indexOf(booking.salonName);
            salesData[index] += booking.totalAmount;
          }
        });

        this.data = {
          labels: salonNames,
          datasets: [
            {
              label: 'Sales Amount',
              data: salesData,
              backgroundColor: backgroundColor,
            },
          ],
        };
      },
      error: (error) => {
        console.log(`Error`, error);
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  downloadSalesReport() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Sales Report', 20, 20);

    const tableBody = this.totalBookings.map((booking, index) => [
      index + 1,
      booking.salonName,
      booking.date,
      booking.time,
      booking.totalAmount,
    ]);
    autoTable(doc, {
      head: [['Sl.no', 'Salon Name', 'Date', 'Time', 'Total Amount']],
      body: tableBody,
      startY: 30,
    });
    doc.save('sales_report.pdf');
  }
}
