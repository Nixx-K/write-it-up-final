import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StoryService } from '../../services/story.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-story',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-story.component.html',
  styleUrl: './add-story.component.scss'
})
export class AddStoryComponent {
  story = {
    title: '',
    description: '',
    genre: 'Fantasy',
    coverUrl: 'https://placehold.co/300x450/333/FFF?text=Nowe+Opowiadanie',
    tagsString: ''
  };
  
  firstChapter = {
    title: 'Rozdział 1',
    content: ''
  };

  constructor(
    private storyService: StoryService,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.getCurrentUser()) {
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    const user = this.authService.getCurrentUser();
    if (user && this.story.title && this.firstChapter.content) {
      const tags = this.story.tagsString.split(',')
        .map(t => t.trim().replace(/^#/, ''))
        .filter(t => t !== '');
      
      const newStory = {
        authorId: user.id,
        title: this.story.title,
        description: this.story.description,
        genre: this.story.genre,
        coverUrl: this.story.coverUrl,
        tags: tags,
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0
      };

      this.storyService.addStory(newStory).subscribe(savedStory => {
        const chapter = {
          storyId: savedStory.id,
          title: this.firstChapter.title,
          content: this.firstChapter.content,
          publishedAt: new Date().toISOString()
        };
        
        this.storyService.addChapter(chapter).subscribe(() => {
          this.router.navigate(['/story', savedStory.id]);
        });
      });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}