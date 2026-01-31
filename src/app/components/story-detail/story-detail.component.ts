import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StoryService } from '../../services/story.service';
import { AuthService } from '../../services/auth.service';
import { Story, Chapter, Comment, User } from '../../models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-story-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './story-detail.component.html',
  styleUrl: './story-detail.component.scss'
})
export class StoryDetailComponent implements OnInit {
  story: Story | null = null;
  author: User | null = null;
  chapters: Chapter[] = [];
  comments: Comment[] = [];
  hasLiked: boolean = false;

  isEditingTags: boolean = false;
  editedTags: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storyService: StoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.getCurrentUser()) {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadStory(id);
      this.loadChapters(id);
      this.loadComments(id);
      this.checkIfLiked(id);
    }
  }

  loadStory(id: string): void {
    this.storyService.getStory(id).subscribe(story => {
      this.story = story;
      this.loadAuthor(story.authorId);
      // Inkrementacja wyświetleń
      this.storyService.incrementViews(id, story.views).subscribe();
    });
  }

  checkIfLiked(storyId: string) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.storyService.getUserLike(user.id, storyId).subscribe(likes => {
        this.hasLiked = likes.length > 0;
      });
    }
  }

  loadAuthor(authorId: string): void {
    this.storyService.getUser(authorId).subscribe(user => {
      this.author = user;
    });
  }

  loadChapters(storyId: string): void {
    this.storyService.getChapters(storyId).subscribe(chapters => {
      this.chapters = chapters;
    });
  }

  loadComments(storyId: string): void {
    this.storyService.getComments(storyId).subscribe(comments => {
      this.comments = comments;
    });
  }

  likeStory(): void {
    const user = this.authService.getCurrentUser();
    if (this.story && user) {
      this.storyService.toggleLike(user.id, this.story.id).subscribe(isLiked => {
        this.hasLiked = isLiked;
      });
    }
  }

  sendComment(content: string): void {
    const user = this.authService.getCurrentUser();
    if (user && this.story && content.trim()) {
      const newComment: Partial<Comment> = {
        storyId: this.story.id,
        userId: user.id,
        content: content,
        createdAt: new Date().toISOString()
      };

      this.storyService.addComment(newComment).subscribe(() => {
        this.loadComments(this.story!.id);
      });
    }
  }

  isAuthor(): boolean {
    const user = this.authService.getCurrentUser();
    return !!(user && this.story && user.id === this.story.authorId);
  }

  deleteStory(): void {
    if (this.story && confirm('Czy na pewno chcesz usunąć to opowiadanie?')) {
      this.storyService.deleteStory(this.story.id).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }

  toggleEditTags() {
    this.isEditingTags = !this.isEditingTags;
    if (this.isEditingTags && this.story) {
      this.editedTags = this.story.tags.join(', ');
    }
  }

  saveTags() {
    if (this.story) {
      const tagsArray = this.editedTags.split(',')
        .map(t => t.trim().replace(/^#/, ''))
        .filter(t => t !== '');
      this.storyService.updateStoryTags(this.story.id, tagsArray).subscribe(() => {
        this.story!.tags = tagsArray;
        this.isEditingTags = false;
      });
    }
  }
}