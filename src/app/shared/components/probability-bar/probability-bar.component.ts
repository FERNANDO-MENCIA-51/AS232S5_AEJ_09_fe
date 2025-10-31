import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-probability-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="probability-bar-container"
      role="region"
      aria-label="Indicador de probabilidad de contenido generado por IA">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-text-muted" id="probability-label">Probabilidad de IA</span>
        <span 
          class="text-sm font-semibold" 
          [ngClass]="getTextColorClass()"
          aria-live="polite"
          [attr.aria-label]="'Probabilidad de IA: ' + getPercentage() + ' por ciento'">
          {{ getPercentage() }}%
        </span>
      </div>
      <div 
        class="probability-bar relative h-3 bg-bg-tertiary rounded-full overflow-hidden"
        role="progressbar"
        [attr.aria-valuenow]="aiProbability * 100"
        aria-valuemin="0"
        aria-valuemax="100"
        [attr.aria-label]="'Probabilidad de IA: ' + getPercentage() + '%'">
        <div 
          class="probability-fill h-full rounded-full transition-all duration-500 ease-out"
          [ngClass]="getBarColorClass()"
          [style.width.%]="aiProbability * 100"
          aria-hidden="true">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
      <div class="flex justify-between mt-1 text-xs text-text-muted" aria-hidden="true">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  `,
  styles: [`
    .probability-bar-container {
      width: 100%;
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    .animate-shimmer {
      animation: shimmer 2s infinite;
    }
  `]
})
export class ProbabilityBarComponent {
  @Input() aiProbability: number = 0;

  getPercentage(): string {
    return (this.aiProbability * 100).toFixed(2);
  }

  getBarColorClass(): string {
    const percentage = this.aiProbability * 100;
    if (percentage >= 70) {
      return 'bg-red-500';
    } else if (percentage >= 40) {
      return 'bg-yellow-500';
    } else {
      return 'bg-green-500';
    }
  }

  getTextColorClass(): string {
    const percentage = this.aiProbability * 100;
    if (percentage >= 70) {
      return 'text-red-400';
    } else if (percentage >= 40) {
      return 'text-yellow-400';
    } else {
      return 'text-green-400';
    }
  }
}
