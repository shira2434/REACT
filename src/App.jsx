import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Toast from './components/Toast';
import ChatBot from './components/ChatBot';
import ScrollToTopBtn from './components/ScrollToTopBtn';
import { EditModeProvider } from './admin/EditModeContext';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <EditModeProvider>
        <div className="App min-h-screen bg-gray-50">
          <AppRoutes />
          <Toast />
          <ChatBot />
          <ScrollToTopBtn />
        </div>
      </EditModeProvider>
    </BrowserRouter>
  );
}

export default App;
