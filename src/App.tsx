import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import QA from './pages/QA';
import NextSteps from './pages/NextSteps';
import History from './pages/History';
import PrivacyCenter from './pages/PrivacyCenter';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/qa" element={<QA />} />
            <Route path="/next-steps" element={<NextSteps />} />
            <Route path="/history" element={<History />} />
            <Route path="/privacy" element={<PrivacyCenter />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}
