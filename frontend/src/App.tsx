import UserRegisterForm from './components/UserRegisterForm/UserRegisterForm'
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePageButton from './components/HomePageButton/HomePageButton';
import UserLoginForm from './components/UserLoginForm/UserLoginForm';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ProtectedRoute from './routes/ProtectedRoute';
import SignDocumentPage from './pages/SignDocumentPage';

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
            <HomePageButton />
            <Routes>
              <Route path="/register" element={<UserRegisterForm />} />
              <Route path="/login" element={<UserLoginForm />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path='/sign-document/:documentId' element={<SignDocumentPage/>}></Route>
              </Route>
            </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
