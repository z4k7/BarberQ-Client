import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISalon } from 'src/app/models/salon';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { initFlowbite } from 'flowbite';
import { Store } from '@ngrx/store';
import { selectUserDetails } from 'src/app/state/user-store/user.selector';
import { IUser } from 'src/app/models/user';
import { Subscription } from 'rxjs';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-user-salon-details',
  templateUrl: './user-salon-details.component.html',
  styleUrls: ['./user-salon-details.component.css'],
})
export class UserSalonDetailsComponent implements OnInit, OnDestroy {
  checked: boolean = false;
  salon: ISalon | null = null;
  showReviewForm: boolean = false;
  salonId: string = '';

  userState$ = this.store.select(selectUserDetails);
  userData!: IUser;
  userSubscription!: Subscription;

  review: any = {
    userId: '',
    rating: 0,
    review: '',
  };
  reviews: any[] = [];
  averageRating: number = 0;
  flooredAverageRating: number = 0;
  canReview: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private store: Store,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    initFlowbite();

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['salonId']) {
          this.salonId = params['salonId'];
          this.fetchSalonDetails(params['salonId']);
        }
      });

    this.userSubscription = this.userState$.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.review = {
          userId: this.userData._id,
          rating: 0,
          review: '',
        };
        this.fetchReviews();
        this.fetchAverageRating();
        this.checkIfUserCanReview();
      }
    });
  }

  fetchSalonDetails(salonId: string): void {
    this.userService
      .getSalonDetails(salonId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((salon) => {
        console.log(`salon response`, salon);
        this.salon = salon.data.salonData;
        console.log(`Salon details`, this.salon);
      });
  }

  bookChair(salon: ISalon): void {
    this.router.navigate(['/user/salons/book-a-chair'], {
      queryParams: { salonId: salon._id },
    });
  }

  toggleAccordion(index: number): void {
    const radioButtonId = `my-accordion-${index}`;
    const radioButton = document.getElementById(
      radioButtonId
    ) as HTMLInputElement;
    if (radioButton) {
      radioButton.checked = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.userSubscription.unsubscribe();
  }

  toggleReviewform() {
    this.showReviewForm = !this.showReviewForm;
  }

  onSubmitReview(): void {
    const salonId = this.salonId;
    this.reviewService.addReview(salonId, this.review).subscribe(
      (response) => {
        console.log('Review added successfully:', response);
        // Reset the review form or perform any other necessary actions
        this.review = {
          userId: this.userData._id,
          rating: 0,
          review: '',
        };
        this.fetchReviews();
        this.fetchAverageRating();
      },
      (error) => {
        console.error('Error adding review:', error);
      }
    );
  }

  fetchReviews(): void {
    const salonId = this.salonId;
    this.reviewService.getReviews(salonId).subscribe(
      (response) => {
        console.log(`Response in fetch Reviews`, response);
        if (response.data) {
          this.reviews = response.data.reviews.filter(
            (review: any) =>
              typeof review.rating === 'number' && isFinite(review.rating)
          );
        }
      },
      (error) => {
        console.error('Error fetching reviews:', error);
        this.reviews = [];
      }
    );
  }

  fetchAverageRating(): void {
    const salonId = this.salonId;
    console.log(`Salon Id`, salonId);
    this.reviewService.getAverageRating(salonId).subscribe(
      (response) => {
        console.log(`Response in fetch avg rating`, response);

        if (response.data.length) {
          const averageRating = response.data[0].averageRating;
          console.log(`Average Rating`, averageRating);
          if (!isNaN(averageRating) && isFinite(averageRating)) {
            this.flooredAverageRating = Math.floor(averageRating);

            this.averageRating = averageRating;
          } else {
            console.error('Invalid average rating value:', response);
            this.averageRating = 0;
            this.flooredAverageRating = 0;
          }
        }
      },
      (error) => {
        console.error('Error fetching average rating:', error);
        this.averageRating = 0;
        this.flooredAverageRating = 0;
      }
    );
  }

  checkIfUserCanReview(): void {
    const salonId = this.salonId;
    const userId = this.userData._id;
    this.reviewService.userInBooking(salonId, userId).subscribe(
      (response) => {
        console.log(`Response in can review`, response);
        this.canReview = response;
      },
      (error) => {
        console.error('Error checking if user can review:', error);
      }
    );
  }

  generateStarArray(length: number): number[] {
    return Array.from({ length }, (_, i) => i);
  }
}
