/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

  vendorCount: number = 0;
  salonCount: number = 0;
  totalRevenue: number = 0;
  totalBookings: any[] = [];
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
        this.totalBookings = res.data.bookings;
        console.log(`Total Bookings`, this.totalBookings);
        this.isLoading = false;
        this.spinner.hide();

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
