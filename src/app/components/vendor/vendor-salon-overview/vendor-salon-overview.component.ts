/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalonService } from 'src/app/services/salon.service';
import { NgxSpinnerService } from 'ngx-spinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  lineChartData: any;

  constructor(
    private route: ActivatedRoute,
    private salonService: SalonService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.route.params.subscribe((params) => {
      this.salonId = params['id'];
    });
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
        console.log(`Total Bookings`, this.totalBookings);

        const dailySalesData = this.calculateDailySales(this.totalBookings);

        this.lineChartData = {
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          datasets: [
            {
              data: dailySalesData,
              label: 'Sales Percent',
              fill: true,
              backgroundColor: 'rgba(0, 255, 0, 0.3)',
              borderColor: 'black',
              tension: 0.1,
            },
          ],
        };
      },
      error: (error) => {
        console.log(`Error `, error);
        this.isLoading = false;
        this.spinner.hide();
      },
    });
  }

  calculateDailySales(bookings: any[]): number[] {
    const dailySales: number[] = Array(7).fill(0);

    bookings.forEach((booking) => {
      const dateParts = booking.date.split('-');
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const year = parseInt(dateParts[2], 10);
      const date = new Date(year, month, day);

      if (!isNaN(date.getTime())) {
        const dayOfWeek = date.getDay();
        dailySales[dayOfWeek] += booking.totalAmount;
      } else {
        console.error('Invalid date:', booking.date);
      }
    });

    return dailySales;
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
