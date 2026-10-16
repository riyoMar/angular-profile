import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, Renderer2, signal } from '@angular/core';

interface Project {
  number: string;
  name: string;
  category: string;
  year: string;
  image: string;
  alt: string;
  color: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly systemColorScheme = globalThis.matchMedia?.('(prefers-color-scheme: dark)') ?? null;
  private readonly systemTheme = signal<'light' | 'dark'>(this.systemColorScheme?.matches ? 'dark' : 'light');
  private themeOverride: 'light' | 'dark' | null = null;
  private readonly updateSystemTheme = (event: MediaQueryListEvent): void => {
    this.systemTheme.set(event.matches ? 'dark' : 'light');
  };

  constructor() {
    this.systemColorScheme?.addEventListener('change', this.updateSystemTheme);
    this.destroyRef.onDestroy(() => {
      this.systemColorScheme?.removeEventListener('change', this.updateSystemTheme);
    });
  }

  readonly projects: Project[] = [
    {
      number: '01',
      name: 'Personal Portfolio',
      category: 'Angular · TypeScript · Responsive design',
      year: '2026',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
      alt: 'Sunlit landscape used as the portfolio project cover',
      color: 'project--sage'
    }
  ];

  get currentTheme(): 'light' | 'dark' {
    return this.themeOverride ?? this.systemTheme();
  }

  get themeToggleLabel(): string {
    return `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} mode`;
  }

  toggleTheme(): void {
    this.themeOverride = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.renderer.setAttribute(this.document.documentElement, 'data-theme', this.themeOverride);
  }
}