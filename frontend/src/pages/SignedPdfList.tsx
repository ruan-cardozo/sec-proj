import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Button, Container, List, ListItem, ListItemText, Typography, Snackbar, Alert, Modal } from '@mui/material';
import { Box, styled } from '@mui/system';

interface SignedPDF {
    _id: string;
    name: string;
    file: string; // Presume-se que o arquivo esteja em formato base64
    fileType: string;
    signed: boolean;
}

const StyledListItem = styled(ListItem)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.common.white,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    color: theme.palette.common.white,
}));

const SignedPdfList: React.FC = () => {
    const [signedPdfs, setSignedPdfs] = useState<SignedPDF[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [viewOpen, setViewOpen] = useState(false);

    useEffect(() => {
        const fetchSignedPdfs = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/reports/signed', {
                    method: 'GET',
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao buscar os PDFs assinados');
                }

                const data = await response.json();
                
                setSignedPdfs(data);
            } catch (error) {
                setSnackbarMessage((error as Error).message);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };  

        fetchSignedPdfs();
    }, []);

    const handleValidateSignature = async (id: string) => {

        try {
            const response = await fetch(`http://localhost:3000/api/verify-signature`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ documentId: id})
            });
            
            if (!response.ok) {
                throw new Error('Erro ao validar a assinatura do PDF');
            }

            const result = await response.json();
            setSnackbarMessage(result.message);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage((error as Error).message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleViewPDF = async (pdfId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/reports/signed?documentId=${pdfId}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const pdfBytes = new Uint8Array(data.pdfBytes);

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            setViewOpen(true);

            setSnackbarMessage('PDF visualizado com sucesso');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage((error as Error).message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setPdfUrl(null);
    };

    return (
        <Container style={{ width: '100%', maxWidth: 'none' }}>
            <Typography variant="h4" gutterBottom style={{color: 'white'}}>Lista de PDFs Assinados</Typography>
            <List style={{ width: '100%' }}>
                {signedPdfs.map(pdf => (
                    <StyledListItem style={{ width: '100%'}} key={pdf._id}>
                        <ListItemText primary={pdf.name} />
                        <StyledButton variant="contained" color="primary" onClick={() => handleValidateSignature(pdf._id)}>Validar Assinatura</StyledButton>
                        <StyledButton variant="contained" color="primary" onClick={() => handleViewPDF(pdf._id)}>Visualizar documento</StyledButton>
                    </StyledListItem>
                ))}
            </List>
            <Modal open={viewOpen} onClose={handleViewClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    {pdfUrl && (
                        <iframe
                            id="pdfIframe"
                            src={pdfUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                        ></iframe>
                    )}
                </Box>
            </Modal>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default SignedPdfList;