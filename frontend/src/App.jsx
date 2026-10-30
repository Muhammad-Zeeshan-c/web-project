import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ATSAnalyzer } from './pages/ATSAnalyzer';
import { InterviewPrep } from './pages/InterviewPrep';
import { InterviewResults } from './pages/InterviewResults';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyzer" element={<ATSAnalyzer />} />
        <Route path="/interview" element={<InterviewPrep />} />
        <Route path="/interview/results" element={<InterviewResults />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
