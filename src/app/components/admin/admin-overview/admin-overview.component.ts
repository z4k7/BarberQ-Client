import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.css'],
})
export class AdminOverviewComponent implements OnInit {
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

  ngOnInit(): void {}
}
