import { Component, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly weight = signal<number | null>(null);
  protected readonly height = signal<number | null>(null);

  protected readonly bmi = signal<number | null>(null);
  protected readonly error = signal('');

  protected calculate(): void {
    const weight = this.weight();
    const height = this.height();

    if (weight === null || height === null) {
      this.showError('Please enter both weight and height.');
      return;
    }

    if (weight <= 0 || height <= 0) {
      this.showError('Weight and height must be greater than zero.');
      return;
    }

    const heightInMeters = height / 100;

    this.error.set('');
    this.bmi.set(weight / (heightInMeters * heightInMeters));
  }

  protected category(bmi: number): string {
    if (bmi < 18.5) {
      return 'Underweight';
    }
    if (bmi < 25) {
      return 'Normal weight';
    }
    if (bmi < 30) {
      return 'Overweight';
    }
    return 'Obese';
  }

  private showError(message: string): void {
    this.error.set(message);
    this.bmi.set(null);
  }
}
