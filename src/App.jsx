import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Toast from './components/Toast';
import ChatBot from './components/ChatBot';
import ScrollToTopBtn from './components/ScrollToTopBtn';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App min-h-screen bg-gray-50">
        <AppRoutes />
        <Toast />
        <ChatBot />
        <ScrollToTopBtn />
      </div>
    </BrowserRouter>
  );
}

export default App;
