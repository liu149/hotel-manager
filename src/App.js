import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './views/Login/Login';
import Layout from './views/Layout/Layout';
import { NotificationProvider } from './components/NotificationProvider';
import Role from './views/Roles/Role';
import User from './views/User/User';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './views/Profile/Profile'; // Import the new Profile component

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="role" element={<Role />} />
            <Route path="user" element={<User />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}
export default App;
