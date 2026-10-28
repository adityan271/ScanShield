/**
 * ScamShield India — Light/Dark Theme Verification Test Suite
 * Verifies palette compliance, ThemeToggle placement, localStorage isolation,
 * accessibility labels, anti-FOUC script, zero emojis, and zero glassmorphism.
 */

import fs from 'fs';
import path from 'path';

function runThemeVerification() {
  console.log(`\n======================================================`);
  console.log(`ScamShield India — Light/Dark Theme Verification Tests`);
  console.log(`======================================================\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Inspect index.css for exact required color palette tokens
  const indexCss = fs.readFileSync(path.resolve('./client/src/index.css'), 'utf-8');

  // Light theme checks
  assert(
    indexCss.includes('--bg-page: #FFFFFF;') &&
      indexCss.includes('--bg-secondary: #F7F9FC;') &&
      indexCss.includes('--bg-card: #FFFFFF;') &&
      indexCss.includes('--text-primary: #172033;') &&
      indexCss.includes('--text-secondary: #5E687B;') &&
      indexCss.includes('--brand-primary: #2457D6;') &&
      indexCss.includes('--border-main: #E1E6EF;') &&
      indexCss.includes('--bg-input: #FFFFFF;'),
    'Palette Verification (Light Theme): Matches all specified color codes (#FFFFFF, #F7F9FC, #172033, #5E687B, #2457D6, #E1E6EF)'
  );

  // Dark theme checks
  assert(
    indexCss.includes('--bg-page: #0B1120;') &&
      indexCss.includes('--bg-secondary: #111A2E;') &&
      indexCss.includes('--bg-card: #151F33;') &&
      indexCss.includes('--text-primary: #F1F5F9;') &&
      indexCss.includes('--text-secondary: #A7B2C5;') &&
      indexCss.includes('--brand-primary: #7CA2FF;') &&
      indexCss.includes('--border-main: #2A3850;') &&
      indexCss.includes('--bg-input: #10192B;'),
    'Palette Verification (Dark Theme): Matches all specified color codes (#0B1120, #111A2E, #151F33, #F1F5F9, #A7B2C5, #7CA2FF, #2A3850, #10192B)'
  );

  // Transition duration check (150-200ms)
  assert(
    indexCss.includes('transition-duration: 180ms;') ||
      indexCss.includes('transition-duration: 150ms;') ||
      indexCss.includes('transition-duration: 200ms;'),
    'Smooth Transitions: CSS defines transitions within 150-200ms without layout delays'
  );

  // 2. Inspect ThemeContext.tsx
  const themeContext = fs.readFileSync(
    path.resolve('./client/src/context/ThemeContext.tsx'),
    'utf-8'
  );

  assert(
    themeContext.includes("THEME_STORAGE_KEY = 'scamshield_theme'") &&
      themeContext.includes("saved === 'dark' ? 'dark' : 'light'") &&
      themeContext.includes("return 'light';"),
    'Default Theme & Storage: Light mode is default on first visit, stored under key scamshield_theme'
  );

  assert(
    themeContext.includes("document.documentElement.classList.add('dark')") &&
      themeContext.includes("document.documentElement.setAttribute('data-theme', 'dark')") &&
      themeContext.includes("document.documentElement.classList.remove('dark')"),
    'Theme Syncing: Root documentElement updates both dark class and data-theme attribute'
  );

  // 3. Inspect ThemeToggle.tsx
  const themeToggle = fs.readFileSync(
    path.resolve('./client/src/components/ThemeToggle.tsx'),
    'utf-8'
  );

  assert(
    themeToggle.includes("from 'lucide-react'") &&
      themeToggle.includes('<Sun') &&
      themeToggle.includes('<Moon'),
    'Toggle Design: Uses Lucide Sun and Moon icons (no emojis)'
  );

  assert(
    themeToggle.includes('Switch to dark mode') &&
      themeToggle.includes('Switch to light mode') &&
      themeToggle.includes('aria-label={label}') &&
      themeToggle.includes('title={label}'),
    'Accessibility: Accessible labels and tooltips configured for screen readers'
  );

  assert(
    themeToggle.includes('type="button"') &&
      themeToggle.includes('focus-visible:ring-2'),
    'Keyboard Accessibility: Uses semantic type="button" and visible focus ring'
  );

  // 4. Inspect Navbar.tsx for desktop and mobile placement
  const navbar = fs.readFileSync(
    path.resolve('./client/src/components/Navbar.tsx'),
    'utf-8'
  );

  assert(
    navbar.includes('<ThemeToggle') &&
      navbar.includes('hidden md:flex items-center gap-3') &&
      navbar.includes('flex md:hidden items-center gap-2'),
    'Navbar Placement: Theme toggle positioned at top-right corner on both desktop and mobile'
  );

  // 5. Inspect client/index.html for anti-FOUC script
  const indexHtml = fs.readFileSync(path.resolve('./client/index.html'), 'utf-8');

  assert(
    indexHtml.includes("localStorage.getItem('scamshield_theme')") &&
      indexHtml.includes("document.documentElement.classList.add('dark')") &&
      indexHtml.includes('<head>'),
    'Anti-FOUC Architecture: Inline theme script present in <head> to prevent flash of wrong theme'
  );

  // 6. Inspect main.tsx for ThemeProvider wrapping
  const mainTsx = fs.readFileSync(path.resolve('./client/src/main.tsx'), 'utf-8');

  assert(
    mainTsx.includes('<ThemeProvider>') &&
      mainTsx.includes('</ThemeProvider>'),
    'Root Level State: Entire application wrapped with ThemeProvider'
  );

  // 7. Inspect compiled CSS & JS bundles in dist
  const clientDistCssDir = path.resolve('./client/dist/assets');
  let combinedCss = '';
  if (fs.existsSync(clientDistCssDir)) {
    const files = fs.readdirSync(clientDistCssDir);
    const cssFile = files.find((f) => f.endsWith('.css'));
    if (cssFile) {
      combinedCss = fs.readFileSync(path.join(clientDistCssDir, cssFile), 'utf-8');
    }
  }

  assert(
    !combinedCss.includes('backdrop-filter:blur') &&
      !combinedCss.includes('backdrop-filter: blur'),
    'Design Compliance: Zero glassmorphism in production CSS'
  );

  const clientDistJsDir = path.resolve('./client/dist/assets');
  let combinedJs = '';
  if (fs.existsSync(clientDistJsDir)) {
    const files = fs.readdirSync(clientDistJsDir);
    const jsFile = files.find((f) => f.endsWith('.js'));
    if (jsFile) {
      combinedJs = fs.readFileSync(path.join(clientDistJsDir, jsFile), 'utf-8');
    }
  }

  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const hasEmoji = emojiRegex.test(combinedJs);
  assert(
    !hasEmoji,
    'Design Compliance: Zero emojis anywhere in compiled client bundle'
  );

  console.log(`\n======================================================`);
  console.log(`Theme Verification Results: ${passed} passed, ${failed} failed`);
  console.log(`======================================================\n`);

  process.exitCode = failed > 0 ? 1 : 0;
}

runThemeVerification();
