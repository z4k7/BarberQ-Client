import { Component } from '@angular/core';
import {
  faLocation,
  faShop,
  faBoxes,
  faMoneyBill,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vendor-overview',
  templateUrl: './vendor-overview.component.html',
  styleUrls: ['./vendor-overview.component.css'],
})
export class VendorOverviewComponent {
  faLocation = faLocation;
  faShop = faShop;
  faBoxes = faBoxes;
  faMoneyBill = faMoneyBill;

  pieChartData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        data: [89, 34, 43, 54, 28, 74, 93],
        label: 'Sales Percent',

        backgroundColor: [
          'rgba(255, 0, 25, 0.7)',
          'rgba(0, 255, 25, 0.7)',
          'rgba(0, 25, 255, 0.7)',
          'rgba(67, 25, 255, 0.7)',
          'rgba(67, 25, 78, 0.7)',
          'rgba(167,125, 78, 0.7)',
          'rgba(67, 255, 178, 0.7)',
        ],
      },
    ],
  };

  pieChartOption = {
    responsive: false,
  };
}
