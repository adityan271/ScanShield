import { useState, useEffect, useRef } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar.js';
import { Hero } from './components/Hero.js';
import { Analyser } from './components/Analyser.js';
import { AnalysisResultView } from './components/AnalysisResult.js';
import { HowItWorks } from './components/HowItWorks.js';
import { LearningQuiz } from './components/LearningQuiz.js';
import { AboutSection } from './components/AboutSection.js';
import { Footer } from './components/Footer.js';
import { ReportWorkflow } from './components/ReportWorkflow.js';
import type { AnalysisResult } from './types/index.js';
import { analyzeMessageApi, checkServerHealth } from './services/api.js';
import { useReportForm } from './context/ReportFormContext.js';

const HOME_SECTION_BY_PATH: Record<string, string> = {
  '/': 'hero',
  '/analyse': 'analyser',
  '/learn': 'learn',
  '/about': 'about',
  '/how-it-works': 'how-it-works',
};

function LegacyHashRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectLegacyHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#report' || hash === '#/report-scam' || hash === '#report-scam') {
        navigate('/report-scam', { replace: true });
      }
    };

    redirectLegacyHash();
    window.addEventListener('hashchange', redirectLegacyHash);
    return () => window.removeEventListener('hashchange', redirectLegacyHash);
  }, [navigate]);

  return null;
}

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { applyAnalysisPrefill } = useReportForm();

  const [message, setMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [canFallbackToDemo, setCanFallbackToDemo] = useState(false);
  const [forceDemo, setForceDemo] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    checkServerHealth().then((health) => {
      if (health?.mode === 'demo') {
        setForceDemo(true);
      }
    });
  }, []);

  useEffect(() => {
    const sectionId = HOME_SECTION_BY_PATH[location.pathname];
    if (!sectionId) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (sectionId === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  const handleFocusInput = () => {
    navigate('/analyse');
    window.setTimeout(() => {
      document.getElementById('analyser')?.scrollIntoView({ behavior: 'smooth' });
      textareaRef.current?.focus();
    }, 120);
  };

  const handleOpenReport = (prefillMsg?: string, prefillAiObs?: string) => {
    if (prefillMsg || prefillAiObs) {
      applyAnalysisPrefill(prefillMsg || '', prefillAiObs || '');
    }
    navigate('/report-scam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyse = async () => {
    setValidationError(null);
    setServerError(null);
    setCanFallbackToDemo(false);

    const trimmed = message.trim();

    if (!trimmed) {
      setValidationError('Please enter a message to analyse.');
      textareaRef.current?.focus();
      return;
    }

    if (message.length > 5000) {
      setValidationError('Message cannot exceed 5,000 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await analyzeMessageApi(message, forceDemo);

      if (response.success && response.analysis) {
        setAnalysisResult(response.analysis);
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setServerError(
          response.error || 'Analysis could not be completed. Please try again.'
        );
        if (response.canFallbackToDemo) {
          setCanFallbackToDemo(true);
        }
      }
    } catch {
      setServerError('An unexpected network error occurred while contacting the server.');
      setCanFallbackToDemo(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessage('');
    setAnalysisResult(null);
    setValidationError(null);
    setServerError(null);
    setCanFallbackToDemo(false);
    textareaRef.current?.focus();
  };

  const handleAnalyseAnother = () => {
    setAnalysisResult(null);
    setValidationError(null);
    setServerError(null);
    navigate('/analyse');
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 200);
  };

  const handleReportThisScam = () => {
    let aiObs = '';
    if (analysisResult) {
      aiObs = `Assessed Risk: ${analysisResult.riskLevel}. ${analysisResult.summary}`;
      if (analysisResult.warningSigns.length > 0) {
        const signs = analysisResult.warningSigns.map((w) => w.title).join('; ');
        aiObs += ` Indicators observed: ${signs}.`;
      }
    }
    handleOpenReport(message, aiObs);
  };

  const homeContent = (
    <>
      <Hero
        onAnalyseClick={handleFocusInput}
        onReportClick={() => handleOpenReport()}
      />

      <Analyser
        message={message}
        setMessage={(val) => {
          setMessage(val);
          if (validationError) setValidationError(null);
        }}
        isLoading={isLoading}
        validationError={validationError}
        serverError={serverError}
        canFallbackToDemo={canFallbackToDemo}
        forceDemo={forceDemo}
        setForceDemo={setForceDemo}
        onAnalyse={handleAnalyse}
        onClear={handleClear}
        textareaRef={textareaRef}
      />

      <AnalysisResultView
        result={analysisResult}
        onAnalyseAnother={handleAnalyseAnother}
        onClear={handleClear}
        onLearnClick={() => navigate('/learn')}
        onReportThisScam={handleReportThisScam}
      />

      <HowItWorks />
      <LearningQuiz />
      <AboutSection />
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col font-sans">
      <LegacyHashRedirect />
      <Navbar />

      <main className="flex-1">
        {location.pathname === '/report-scam' ? (
          <ReportWorkflow />
        ) : HOME_SECTION_BY_PATH[location.pathname] ? (
          homeContent
        ) : (
          <Navigate to="/" replace />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
