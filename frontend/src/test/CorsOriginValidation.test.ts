import { describe, it, expect } from 'vitest';
import { vercelPreviewRegex, getCorsOptions } from '../../../backend/config/cors.js';

describe('CORS Allowed Origins and Vercel Deployment Regex Validation', () => {
  it('correctly validates genuine AlgoVault & TechSwitch Vercel deployment URLs', () => {
    const validOrigins = [
      'https://algovault.vercel.app',
      'https://algo-vault.vercel.app',
      'https://algovault-git-main-user.vercel.app',
      'https://algo-vault-pr-12.vercel.app',
      'https://techswitch.vercel.app',
      'https://techswitch-pro.vercel.app',
      'https://techswitch-git-dev.vercel.app',
      'https://techswitch-pro-preview-5.vercel.app',
      'https://AlgoVault.vercel.app',
      'https://TechSwitch-Pro.vercel.app'
    ];

    validOrigins.forEach((origin) => {
      expect(vercelPreviewRegex.test(origin)).toBe(true);
    });
  });

  it('strictly rejects malicious or non-matching origins attempting to spoof Vercel domains', () => {
    const invalidOrigins = [
      'https://evil-algovault.vercel.app',
      'https://fake-techswitch.vercel.app',
      'https://attacker.vercel.app',
      'https://random-app.vercel.app',
      'http://algovault.vercel.app', // Insecure HTTP
      'https://algovault.vercel.app.attacker.com',
      'https://techswitch.vercel.app.malicious.net',
      'https://otherbrand.com'
    ];

    invalidOrigins.forEach((origin) => {
      expect(vercelPreviewRegex.test(origin)).toBe(false);
    });
  });

  it('originValidator in getCorsOptions allows permitted origins and rejects unauthorized ones', () => {
    const corsOptions = getCorsOptions();
    const validator = corsOptions.origin;

    // 1. Non-browser / curl requests (null origin)
    validator(undefined as any, (err: any, allow: boolean) => {
      expect(err).toBeNull();
      expect(allow).toBe(true);
    });

    // 2. Local dev port
    validator('http://localhost:5173', (err: any, allow: boolean) => {
      expect(err).toBeNull();
      expect(allow).toBe(true);
    });

    // 3. AlgoVault without hyphen on Vercel
    validator('https://algovault.vercel.app', (err: any, allow: boolean) => {
      expect(err).toBeNull();
      expect(allow).toBe(true);
    });

    // 4. TechSwitch Pro on Vercel
    validator('https://techswitch-pro.vercel.app', (err: any, allow: boolean) => {
      expect(err).toBeNull();
      expect(allow).toBe(true);
    });

    // 5. Unauthorized origin
    validator('https://unauthorized-attacker.com', (err: any, allow: boolean) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toContain('CORS policy violation');
      expect(allow).toBe(false);
    });
  });
});
