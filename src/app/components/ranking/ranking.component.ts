import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../services/story.service';
import { User } from '../../models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';

interface RankedUser extends User {
  averageRating: number;
  ratingCount: number;
}

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements OnInit {
  rankedUsers: RankedUser[] = [];
  filteredUsers: RankedUser[] = [];
  searchText: string = '';

  // Dane awaryjne widoczne, gdy serwer nie działa
  private mockRanked: RankedUser[] = [
    { id: '1', username: 'ksiazkoholik99', email: 'user1@example.com', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', bio: '', averageRating: 4.8, ratingCount: 15 },
    { id: '4', username: 'Romantyczna_Anna', email: 'ania@love.pl', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna', bio: '', averageRating: 4.5, ratingCount: 8 },
    { id: '3', username: 'Piorunujacy_Pisarz', email: 'piorun@test.pl', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thunder', bio: '', averageRating: 4.2, ratingCount: 12 }
  ];

  constructor(private storyService: StoryService) {}

  ngOnInit(): void {
    this.storyService.getUsers().pipe(
      timeout(2500),
      catchError(() => of([]))
    ).subscribe(users => {
      if (users.length === 0) {
        this.rankedUsers = this.mockRanked;
        this.applyFilter();
        return;
      }

      const ratingRequests = users.map(u => 
        this.storyService.getUserRatings(u.id).pipe(
          timeout(1000),
          map(ratings => ({
            ...u,
            ratingCount: ratings.length,
            averageRating: ratings.length > 0 
              ? ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length 
              : 0
          })),
          catchError(() => of({ ...u, ratingCount: 0, averageRating: 0 }))
        )
      );

      forkJoin(ratingRequests).subscribe(results => {
        this.rankedUsers = results.sort((a, b) => b.averageRating - a.averageRating);
        this.applyFilter();
      });
    });
  }

  applyFilter() {
    this.filteredUsers = this.rankedUsers.filter(u => 
      u.username.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
