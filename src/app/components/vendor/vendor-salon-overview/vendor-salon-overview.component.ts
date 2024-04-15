import { Component } from '@angular/core';

@Component({
  selector: 'app-vendor-salon-overview',
  templateUrl: './vendor-salon-overview.component.html',
  styleUrls: ['./vendor-salon-overview.component.css'],
})
export class VendorSalonOverviewComponent {
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
