import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StoryDetailComponent } from './components/story-detail/story-detail.component';
import { ChapterComponent } from './components/chapter/chapter.component';
import { LoginComponent } from './components/login/login.component';
import { AddStoryComponent } from './components/add-story/add-story.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { AddChapterComponent } from './components/add-chapter/add-chapter.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'add-story', component: AddStoryComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'user/:id', component: UserProfileComponent },
  { path: 'story/:id', component: StoryDetailComponent },
  { path: 'story/:storyId/add-chapter', component: AddChapterComponent },
  { path: 'story/:storyId/chapter/:chapterId', component: ChapterComponent },
  { path: '**', redirectTo: '' }
];