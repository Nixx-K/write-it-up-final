import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StoryService } from '../../services/story.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-chapter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-chapter.component.html',
  styleUrl: './add-chapter.component.scss'
})
export class AddChapterComponent implements OnInit {
  storyId: string = '';
  chapter = {
    title: '',
    content: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storyService: StoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.storyId = this.route.snapshot.paramMap.get('storyId') || '';
    
    this.storyService.getStory(this.storyId).subscribe(story => {
      const user = this.authService.getCurrentUser();
      if (!user || user.id !== story.authorId) {
        this.router.navigate(['/story', this.storyId]);
      }
    });
  }

  onSubmit() {
    if (this.chapter.title && this.chapter.content) {
      const newChapter = {
        storyId: this.storyId,
        title: this.chapter.title,
        content: this.chapter.content,
        publishedAt: new Date().toISOString()
      };

      this.storyService.addChapter(newChapter).subscribe(() => {
        this.router.navigate(['/story', this.storyId]);
      });
    }
  }
}