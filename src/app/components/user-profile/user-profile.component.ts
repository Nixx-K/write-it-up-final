import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StoryService } from '../../services/story.service';
import { AuthService } from '../../services/auth.service';
import { User, Story, Follow, Rating } from '../../models';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  userStories: Story[] = [];
  followers: Follow[] = [];
  following: Follow[] = [];
  isFollowing: boolean = false;
  currentFollowId: string | null = null;
  
  ratings: Rating[] = [];
  averageRating: number = 0;
  hasRated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private storyService: StoryService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.loadUserData(userId);
      }
    });
  }

  loadUserData(userId: string) {
    this.storyService.getUser(userId).subscribe(user => this.user = user);
    
    this.storyService.getStories().pipe(
      map(stories => stories.filter(s => s.authorId === userId))
    ).subscribe(stories => this.userStories = stories);

    this.storyService.getFollowers(userId).subscribe(f => {
      this.followers = f;
      this.checkIfFollowing();
    });

    this.storyService.getFollowing(userId).subscribe(f => this.following = f);
    
    this.storyService.getUserRatings(userId).subscribe(r => {
      this.ratings = r;
      this.calculateAverageRating();
      this.checkIfRated();
    });
  }

  checkIfFollowing() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && this.user) {
      const follow = this.followers.find(f => f.followerId === currentUser.id);
      this.isFollowing = !!follow;
      this.currentFollowId = follow ? follow.id : null;
    }
  }

  toggleFollow() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && this.user) {
      if (this.isFollowing && this.currentFollowId) {
        this.storyService.unfollowUser(this.currentFollowId).subscribe(() => {
          this.loadUserData(this.user!.id);
        });
      } else {
        this.storyService.followUser(currentUser.id, this.user.id).subscribe(() => {
          this.loadUserData(this.user!.id);
        });
      }
    }
  }

  calculateAverageRating() {
    if (this.ratings.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.ratings.reduce((acc, r) => acc + r.score, 0);
    this.averageRating = sum / this.ratings.length;
  }

  checkIfRated() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && this.user) {
      this.hasRated = this.ratings.some(r => r.raterId === currentUser.id);
    }
  }

  rate(score: number) {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && this.user && !this.hasRated && currentUser.id !== this.user.id) {
      this.storyService.rateUser(currentUser.id, this.user.id, score).subscribe(() => {
        this.loadUserData(this.user!.id);
      });
    }
  }
}
