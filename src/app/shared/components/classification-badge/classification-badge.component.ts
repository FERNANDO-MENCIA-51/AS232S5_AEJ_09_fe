import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AiClassification } from '../../../core/models/ai-detection.model';

@Component({
  selector: 'app-classification-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      class="classification-badge inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
      [ngClass]="getClassificationClass()"
      role="status"
      [attr.aria-label]="'Clasificación: ' + getClassificationText()">
      <span class="w-2 h-2 rounded-full mr-2" [ngClass]="getDotClass()" aria-hidden="true"></span>
      {{ getClassificationText() }}
    </span>
  `,
  styles: [`
    .classification-badge {
      transition: all 0.2s ease;
    }
  `]
})
export class ClassificationBadgeComponent {
  @Input() classification!: AiClassification;

  getClassificationClass(): string {
    const classes: Record<AiClassification, string> = {
      'AI_GENERATED': 'bg-red-500/10 text-red-400 border border-red-500/30',
      'HUMAN_WRITTEN': 'bg-green-500/10 text-green-400 border border-green-500/30',
      'MIXED_CONTENT': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
      'UNCERTAIN': 'bg-gray-500/10 text-gray-400 border border-gray-500/30',
      'PARSE_ERROR': 'bg-red-500/10 text-red-400 border border-red-500/30',
      'CONNECTION_ERROR': 'bg-red-500/10 text-red-400 border border-red-500/30'
    };
    return classes[this.classification] || classes['UNCERTAIN'];
  }

  getDotClass(): string {
    const classes: Record<AiClassification, string> = {
      'AI_GENERATED': 'bg-red-500',
      'HUMAN_WRITTEN': 'bg-green-500',
      'MIXED_CONTENT': 'bg-yellow-500',
      'UNCERTAIN': 'bg-gray-500',
      'PARSE_ERROR': 'bg-red-500',
      'CONNECTION_ERROR': 'bg-red-500'
    };
    return classes[this.classification] || classes['UNCERTAIN'];
  }

  getClassificationText(): string {
    const texts: Record<AiClassification, string> = {
      'AI_GENERATED': 'Generado por IA',
      'HUMAN_WRITTEN': 'Escrito por Humano',
      'MIXED_CONTENT': 'Contenido Mixto',
      'UNCERTAIN': 'Incierto',
      'PARSE_ERROR': 'Error de Análisis',
      'CONNECTION_ERROR': 'Error de Conexión'
    };
    return texts[this.classification] || 'Desconocido';
  }
}
