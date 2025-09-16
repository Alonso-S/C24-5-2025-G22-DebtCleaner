import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '../features/auth/pages/LoginPage'

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  </BrowserRouter>
)

export default AppRoutes
