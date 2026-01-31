import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StoryService } from '../../services/story.service';
import { AuthService } from '../../services/auth.service';
import { Chapter, Story } from '../../models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chapter',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './chapter.component.html',
  styleUrl: './chapter.component.scss'
})
export class ChapterComponent implements OnInit {
  chapter: Chapter | null = null;
  story: Story | null = null;
  allChapters: Chapter[] = [];
  
  prevChapterId: string | null = null;
  nextChapterId: string | null = null;

  isEditMode: boolean = false;
  editedContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private storyService: StoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        const chapterId = params['chapterId'];
        const storyId = params['storyId'];
        this.loadData(storyId, chapterId);
    });
  }

  loadData(storyId: string, chapterId: string) {
    this.isEditMode = false;
    
    if (chapterId) {
      this.storyService.getChapter(chapterId).subscribe(chapter => {
        this.chapter = chapter;
        this.editedContent = chapter.content;
      });
    }

    if (storyId) {
      this.storyService.getStory(storyId).subscribe(story => {
        this.story = story;
        this.loadChapters(storyId, chapterId);
      });
    }
  }

  loadChapters(storyId: string, currentChapterId: string) {
      this.storyService.getChapters(storyId).subscribe(chapters => {
          this.allChapters = chapters;
          const currentIndex = chapters.findIndex(c => c.id === currentChapterId);
          
          this.prevChapterId = currentIndex > 0 ? chapters[currentIndex - 1].id : null;
          this.nextChapterId = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1].id : null;
      });
  }

  isAuthor(): boolean {
    const user = this.authService.getCurrentUser();
    return !!(user && this.story && user.id === this.story.authorId);
  }

  toggleEdit(): void {
    this.isEditMode = !this.isEditMode;
  }

  save(): void {
    if (this.chapter && this.editedContent) {
      this.storyService.updateChapter(this.chapter.id, this.editedContent).subscribe(() => {
        this.chapter!.content = this.editedContent;
        this.isEditMode = false;
      });
    }
  }
}