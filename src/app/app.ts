import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Note {
  id: string;
  title: string;
  text: string;
}

const STORAGE_KEY = 'notes';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly noteTitle = signal('');
  protected readonly noteText = signal('');

  protected readonly notes = signal<Note[]>(loadNotes());

  protected readonly canAdd = computed(
    () => this.noteTitle().trim() !== '' || this.noteText().trim() !== ''
  );

  protected add(): void {
    if (!this.canAdd()) {
      return;
    }

    const note: Note = {
      id: crypto.randomUUID(),
      title: this.noteTitle().trim(),
      text: this.noteText().trim()
    };

    this.notes.update(notes => [note, ...notes]);
    this.saveNotes();

    this.noteTitle.set('');
    this.noteText.set('');
  }

  protected remove(id: string): void {
    this.notes.update(notes => notes.filter(note => note.id !== id));
    this.saveNotes();
  }

  private saveNotes(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notes()));
  }
}

function loadNotes(): Note[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}
