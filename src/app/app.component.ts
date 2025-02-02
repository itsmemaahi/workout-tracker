import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  userName: string = '';
  selectedWorkout: string = '';
  workoutMinutes: number | null = null;
  workoutTypes: string[] = ['Running', 'Swimming', 'Cycling'];
  searchQuery: string = '';
  filterType: string = '';

  workouts: {
    [key: string]: {
      types: Set<string>;
      totalMinutes: number;
    };
  } = {};

  // Pagination settings
  currentPage: number = 1;
  itemsPerPage: number = 5;

  addWorkout() {
    if (this.userName && this.selectedWorkout && this.workoutMinutes !== null) {
      if (!this.workouts[this.userName]) {
        this.workouts[this.userName] = { types: new Set(), totalMinutes: 0 };
      }

      this.workouts[this.userName].types.add(this.selectedWorkout);
      this.workouts[this.userName].totalMinutes += this.workoutMinutes;

      this.userName = '';
      this.selectedWorkout = '';
      this.workoutMinutes = null;
    }
  }

  getWorkoutTypes(name: string): string {
    return [...this.workouts[name].types].join(', ');
  }

  getWorkoutCount(name: string): number {
    return this.workouts[name]?.types.size || 0;
  }

  getTotalMinutes(name: string): number {
    return this.workouts[name]?.totalMinutes || 0;
  }

  getUserNames(): string[] {
    let names = Object.keys(this.workouts);

    // Filter by name
    if (this.searchQuery) {
      names = names.filter((name) =>
        name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Filter by workout type
    if (this.filterType) {
      names = names.filter((name) =>
        this.workouts[name].types.has(this.filterType)
      );
    }

    return names;
  }

  // Pagination logic
  getPaginatedUsers(): string[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.getUserNames().slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.getUserNames().length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
