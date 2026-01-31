import { Component, OnInit } from '@angular/core';
import { Story } from '../../models';
import { StoryService } from '../../services/story.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  allStories: Story[] = [];
  filteredStories: Story[] = [];
  
  searchText: string = '';
  selectedGenre: string = 'Wszystkie';
  selectedTag: string = '';

  genres: string[] = ['Wszystkie', 'Fantasy', 'Romans', 'Kryminał', 'Horror', 'Science-Fiction', 'Inny'];

  constructor(
    private storyService: StoryService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.storyService.getStories().subscribe(data => {
      this.allStories = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredStories = this.allStories.filter(story => {
      const matchesSearch = story.title.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesGenre = this.selectedGenre === 'Wszystkie' || story.genre === this.selectedGenre;
      const matchesTag = !this.selectedTag || story.tags.some(tag => tag.toLowerCase().includes(this.selectedTag.toLowerCase()));
      
      return matchesSearch && matchesGenre && matchesTag;
    });

    // Ranking - sortowanie po lajkach na górze (opcjonalnie)
    // this.filteredStories.sort((a, b) => b.likes - a.likes);
  }
}