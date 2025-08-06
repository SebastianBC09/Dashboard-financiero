import { Injectable } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeUrl,
  SafeScript,
} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SanitizationService {
  constructor(private sanitizer: DomSanitizer) {}

  sanitizeText(text: string): string {
    if (!text || typeof text !== 'string') {
      return '';
    }

    return text
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  sanitizeHtml(html: string): SafeHtml {
    if (!html || typeof html !== 'string') {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }

    const allowedTags = ['b', 'i', 'em', 'strong', 'br', 'p', 'span'];
    const cleanHtml = this.stripUnsafeTags(html, allowedTags);

    return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
  }

  sanitizeUrl(url: string): SafeUrl {
    if (!url || typeof url !== 'string') {
      return this.sanitizer.bypassSecurityTrustUrl('');
    }

    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('/')
    ) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    return this.sanitizer.bypassSecurityTrustUrl('');
  }

  validateInput(input: unknown, type: 'string'): string;
  validateInput(input: unknown, type: 'number'): number;
  validateInput(input: unknown, type: 'email'): string;
  validateInput(
    input: unknown,
    type: 'string' | 'number' | 'email',
  ): string | number {
    if (input === null || input === undefined) {
      return type === 'string' || type === 'email' ? '' : 0;
    }

    switch (type) {
      case 'string':
        return this.sanitizeText(String(input));
      case 'number':
        const num = Number(input);
        return isNaN(num) ? 0 : num;
      case 'email':
        const email = String(input).toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) ? email : '';
      default:
        return type === 'string' || type === 'email' ? '' : 0;
    }
  }

  private stripUnsafeTags(html: string, allowedTags: string[]): string {
    const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    return html.replace(tagRegex, (match, tagName) => {
      if (allowedTags.includes(tagName.toLowerCase())) {
        return match;
      }
      return '';
    });
  }

  escapeHtmlAttribute(value: string): string {
    if (!value || typeof value !== 'string') {
      return '';
    }

    return value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  sanitizeStringArray(input: unknown): string[] {
    if (!Array.isArray(input)) {
      return [];
    }

    return input
      .filter((item): item is string => typeof item === 'string')
      .map((item) => this.sanitizeText(item))
      .filter((item) => item.length > 0);
  }

  isStringArray(value: unknown): value is string[] {
    return (
      Array.isArray(value) && value.every((item) => typeof item === 'string')
    );
  }

  validateCreditType(input: unknown): 'personal' | 'vehicle' | 'housing' {
    if (typeof input === 'string') {
      const sanitized = this.sanitizeText(input);
      if (
        sanitized === 'personal' ||
        sanitized === 'vehicle' ||
        sanitized === 'housing'
      ) {
        return sanitized;
      }
    }
    return 'personal';
  }
}
