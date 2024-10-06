import UserRegisterForm from './components/UserRegisterForm/UserRegisterForm'
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePageButton from './components/HomePageButton/HomePageButton';
import HeaderTitle from './components/HeaderTitle/HeaderTitle';
import UserLoginForm from './components/UserLoginForm/UserLoginForm';
import UpdateUserForm from './components/UpdateUserForm/UpdateUserForm';

function App() {

  return (
    <>
    <HeaderTitle/>
    <Router>
        <HomePageButton />
        <Routes>
          <Route path="/register" element={<UserRegisterForm />} />
          <Route path="/login" element={<UserLoginForm />} />
          <Route path="/update" element={<UpdateUserForm />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
