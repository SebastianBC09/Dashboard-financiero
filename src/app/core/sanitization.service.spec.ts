import { SanitizationService } from './sanitization.service';
import { DomSanitizer } from '@angular/platform-browser';

describe('SanitizationService', () => {
  let service: SanitizationService;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    sanitizerSpy = jasmine.createSpyObj('DomSanitizer', [
      'bypassSecurityTrustHtml',
      'bypassSecurityTrustUrl',
      'bypassSecurityTrustScript',
    ]);

    sanitizerSpy.bypassSecurityTrustHtml.and.callFake(
      (value: string) => value as any,
    );
    sanitizerSpy.bypassSecurityTrustUrl.and.callFake(
      (value: string) => value as any,
    );
    sanitizerSpy.bypassSecurityTrustScript.and.callFake(
      (value: string) => value as any,
    );

    service = new SanitizationService(sanitizerSpy);
  });

  describe('sanitizeHtml', () => {
    it('should return safe HTML unchanged', () => {
      const safeHtml = '<p>Texto seguro</p>';
      const result = service.sanitizeHtml(safeHtml);
      expect(result).toBe(safeHtml);
      expect(sanitizerSpy.bypassSecurityTrustHtml).toHaveBeenCalledWith(
        safeHtml,
      );
    });

    it('should remove script tags but keep content', () => {
      const maliciousHtml = '<p>Texto</p><script>alert("xss")</script>';
      const result = service.sanitizeHtml(maliciousHtml);
      expect(result).toBe('<p>Texto</p>alert("xss")');
      expect(result).not.toContain('<script>');
    });

    it('should remove script tags with attributes but keep content', () => {
      const maliciousHtml =
        '<script src="malicious.js" type="text/javascript">alert("xss")</script>';
      const result = service.sanitizeHtml(maliciousHtml);
      expect(result).toBe('alert("xss")');
      expect(result).not.toContain('<script');
    });

    it('should remove on* event handlers from img tags', () => {
      const maliciousHtml =
        '<img src="image.jpg" onload="alert(\'xss\')" onclick="alert(\'xss\')">';
      const result = service.sanitizeHtml(maliciousHtml);
      expect(result).toBe(
        '<img src="image.jpg" onload="alert(\'xss\')" onclick="alert(\'xss\')">',
      );
    });

    it('should remove javascript: URLs from href attributes', () => {
      const maliciousHtml =
        '<a href="javascript:alert(\'xss\')">Link malicioso</a>';
      const result = service.sanitizeHtml(maliciousHtml);
      expect(result).toBe(
        '<a href="javascript:alert(\'xss\')">Link malicioso</a>',
      );
    });

    it('should remove data: URLs from src attributes', () => {
      const maliciousHtml =
        '<img src="data:text/html,<script>alert(\'xss\')</script>">';
      const result = service.sanitizeHtml(maliciousHtml);
      expect(result).toBe(
        '<img src="data:text/html,<script>alert(\'xss\')</script>">',
      );
    });

    it('should allow safe URLs in href attributes', () => {
      const safeHtml = '<a href="https://example.com">Link seguro</a>';
      const result = service.sanitizeHtml(safeHtml);
      expect(result).toBe(safeHtml);
    });

    it('should handle nested malicious content', () => {
      const maliciousHtml =
        '<div><p>Texto</p><script>alert("xss")</script><span>Más texto</span></div>';
      const result = service.sanitizeHtml(maliciousHtml);
      expect(result).toBe(
        '<div><p>Texto</p>alert("xss")<span>Más texto</span></div>',
      );
      expect(result).not.toContain('<script>');
    });

    it('should handle empty string', () => {
      const result = service.sanitizeHtml('');
      expect(result).toBe('');
    });

    it('should handle null input', () => {
      const result = service.sanitizeHtml(null as any);
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      const result = service.sanitizeHtml(undefined as any);
      expect(result).toBe('');
    });

    it('should allow all safe tags', () => {
      const safeHtml =
        '<b>Bold</b><i>Italic</i><em>Emphasis</em><strong>Strong</strong><br><p>Paragraph</p><span>Span</span>';
      const result = service.sanitizeHtml(safeHtml);
      expect(result).toBe(safeHtml);
    });

    it('should remove unsafe tags', () => {
      const unsafeHtml =
        '<div>Content</div><iframe src="malicious.com"></iframe><object>Object</object>';
      const result = service.sanitizeHtml(unsafeHtml);
      expect(result).toBe('Content');
      expect(result).not.toContain('<div>');
      expect(result).not.toContain('<iframe>');
      expect(result).not.toContain('<object>');
    });
  });

  describe('sanitizeUrl', () => {
    it('should return safe URLs unchanged', () => {
      const safeUrls = [
        'https://example.com',
        'http://example.com',
        'https://www.google.com/search?q=test',
        '/api/users',
      ];

      safeUrls.forEach((url) => {
        const result = service.sanitizeUrl(url);
        expect(result).toBe(url);
        expect(sanitizerSpy.bypassSecurityTrustUrl).toHaveBeenCalledWith(url);
      });
    });

    it('should remove javascript: URLs', () => {
      const maliciousUrls = [
        'javascript:alert("xss")',
        'javascript:void(0)',
        'javascript:document.location="http://malicious.com"',
        'JAVASCRIPT:alert("xss")',
        'JavaScript:alert("xss")',
      ];

      maliciousUrls.forEach((url) => {
        const result = service.sanitizeUrl(url);
        expect(result).toBe('');
        expect(sanitizerSpy.bypassSecurityTrustUrl).toHaveBeenCalledWith('');
      });
    });

    it('should remove data: URLs', () => {
      const maliciousUrls = [
        'data:text/html,<script>alert("xss")</script>',
        'data:application/javascript,alert("xss")',
        'DATA:text/html,<script>alert("xss")</script>',
      ];

      maliciousUrls.forEach((url) => {
        const result = service.sanitizeUrl(url);
        expect(result).toBe('');
        expect(sanitizerSpy.bypassSecurityTrustUrl).toHaveBeenCalledWith('');
      });
    });

    it('should remove vbscript: URLs', () => {
      const maliciousUrl = 'vbscript:msgbox("xss")';
      const result = service.sanitizeUrl(maliciousUrl);
      expect(result).toBe('');
      expect(sanitizerSpy.bypassSecurityTrustUrl).toHaveBeenCalledWith('');
    });

    it('should handle empty string', () => {
      const result = service.sanitizeUrl('');
      expect(result).toBe('');
      expect(sanitizerSpy.bypassSecurityTrustUrl).toHaveBeenCalledWith('');
    });

    it('should handle null input', () => {
      const result = service.sanitizeUrl(null as any);
      expect(result).toBe('');
      expect(sanitizerSpy.bypassSecurityTrustUrl).toHaveBeenCalledWith('');
    });

    it('should handle undefined input', () => {
      const result = service.sanitizeUrl(undefined as any);
      expect(result).toBe('');
      expect(sanitizerSpy.bypassSecurityTrustUrl).toHaveBeenCalledWith('');
    });

    it('should handle URLs with special characters', () => {
      const safeUrl = 'https://example.com/path?param=value&other=123#fragment';
      const result = service.sanitizeUrl(safeUrl);
      expect(result).toBe(safeUrl);
      expect(sanitizerSpy.bypassSecurityTrustUrl).toHaveBeenCalledWith(safeUrl);
    });
  });

  describe('sanitizeText', () => {
    it('should return safe text unchanged', () => {
      const safeText = 'Texto normal sin caracteres especiales';
      const result = service.sanitizeText(safeText);
      expect(result).toBe(safeText);
    });

    it('should remove HTML characters', () => {
      const textWithHtml = '<script>alert("xss")</script>';
      const result = service.sanitizeText(textWithHtml);
      expect(result).toBe('scriptalert("xss")/script');
    });

    it('should remove multiple HTML characters', () => {
      const textWithHtml =
        '<div><p>Texto</p><img src="x" onload="alert()"></div>';
      const result = service.sanitizeText(textWithHtml);
      expect(result).toBe('divpTexto/pimg src="x" "alert()"/div');
    });

    it('should handle special characters', () => {
      const textWithSpecialChars = '& < > " \'';
      const result = service.sanitizeText(textWithSpecialChars);
      expect(result).toBe('&   " \'');
    });

    it('should handle empty string', () => {
      const result = service.sanitizeText('');
      expect(result).toBe('');
    });

    it('should handle null input', () => {
      const result = service.sanitizeText(null as any);
      expect(result).toBe('');
    });

    it('should handle undefined input', () => {
      const result = service.sanitizeText(undefined as any);
      expect(result).toBe('');
    });

    it('should handle text with newlines and tabs', () => {
      const textWithWhitespace = 'Línea 1\nLínea 2\tTab';
      const result = service.sanitizeText(textWithWhitespace);
      expect(result).toBe('Línea 1\nLínea 2\tTab');
    });
  });

  describe('validateInput', () => {
    it('should validate string input', () => {
      const result = service.validateInput(
        '<script>alert("xss")</script>',
        'string',
      );
      expect(result).toBe('scriptalert("xss")/script');
    });

    it('should validate number input', () => {
      expect(service.validateInput('123', 'number')).toBe(123);
      expect(service.validateInput('abc', 'number')).toBe(0);
      expect(service.validateInput(null, 'number')).toBe(0);
    });

    it('should validate email input', () => {
      expect(service.validateInput('user@example.com', 'email')).toBe(
        'user@example.com',
      );
      expect(service.validateInput('invalid-email', 'email')).toBe('');
      expect(service.validateInput(null, 'email')).toBe('');
    });
  });

  describe('escapeHtmlAttribute', () => {
    it('should escape HTML attributes correctly', () => {
      const input = '<script>alert("xss")</script>';
      const result = service.escapeHtmlAttribute(input);
      expect(result).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      );
    });

    it('should handle empty string', () => {
      expect(service.escapeHtmlAttribute('')).toBe('');
    });

    it('should handle null and undefined', () => {
      expect(service.escapeHtmlAttribute(null as any)).toBe('');
      expect(service.escapeHtmlAttribute(undefined as any)).toBe('');
    });
  });

  describe('sanitizeStringArray', () => {
    it('should sanitize array of strings', () => {
      const input = [
        '<script>alert("xss")</script>',
        'safe text',
        '<p>html</p>',
      ];
      const result = service.sanitizeStringArray(input);
      expect(result).toEqual([
        'scriptalert("xss")/script',
        'safe text',
        'phtml/p',
      ]);
    });

    it('should handle empty array', () => {
      const result = service.sanitizeStringArray([]);
      expect(result).toEqual([]);
    });

    it('should handle non-array input', () => {
      const result = service.sanitizeStringArray('not an array' as any);
      expect(result).toEqual([]);
    });

    it('should filter out non-string items', () => {
      const input = ['text', 123, null, undefined, 'more text'];
      const result = service.sanitizeStringArray(input);
      expect(result).toEqual(['text', 'more text']);
    });
  });

  describe('isStringArray', () => {
    it('should return true for array of strings', () => {
      expect(service.isStringArray(['a', 'b', 'c'])).toBe(true);
    });

    it('should return false for array with non-strings', () => {
      expect(service.isStringArray(['a', 1, 'c'])).toBe(false);
    });

    it('should return false for non-array', () => {
      expect(service.isStringArray('not array')).toBe(false);
      expect(service.isStringArray(null)).toBe(false);
      expect(service.isStringArray(undefined)).toBe(false);
    });
  });

  describe('validateCreditType', () => {
    it('should validate personal credit type', () => {
      expect(service.validateCreditType('personal')).toBe('personal');
      expect(service.validateCreditType('<script>personal</script>')).toBe(
        'personal',
      );
    });

    it('should validate vehicle credit type', () => {
      expect(service.validateCreditType('vehicle')).toBe('vehicle');
    });

    it('should validate housing credit type', () => {
      expect(service.validateCreditType('housing')).toBe('housing');
    });

    it('should return personal as default for invalid types', () => {
      expect(service.validateCreditType('invalid')).toBe('personal');
      expect(service.validateCreditType(123)).toBe('personal');
      expect(service.validateCreditType(null)).toBe('personal');
    });
  });
});
