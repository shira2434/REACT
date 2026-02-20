import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
