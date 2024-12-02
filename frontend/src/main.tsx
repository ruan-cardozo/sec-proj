import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import theme from './theme/teme.ts'
import { ThemeProvider } from '@mui/material/styles'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <ThemeProvider theme={theme}>
        <App />
     </ThemeProvider>
  </StrictMode>
)
