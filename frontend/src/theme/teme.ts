import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#163936', // Verde escuro
            light: '#4a6b68', // Tom mais claro de verde
            dark: '#0d2624', // Tom mais escuro de verde
            contrastText: '#ffffff', // Texto branco para contraste
        },
        secondary: {
            main: '#ff4081', // Rosa para contraste
            light: '#ff79b0',
            dark: '#c60055',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f4f6f8', // Cinza claro para o fundo
            paper: '#ffffff', // Branco para papéis
        },
        text: {
            primary: '#000000', // Preto para texto principal
            secondary: '#ffffff', // Branco para texto secundário
        },
    },
    shape: {
        borderRadius: 8,
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
});

export default theme;