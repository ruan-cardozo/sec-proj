import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Container, Button, Typography, Box, CircularProgress, Modal, TextField, Snackbar, Alert } from '@mui/material';


const SignDocumentPage = () => {
    const { documentId } = useParams<{ documentId: string }>();
    const [documentUrl, setDocumentUrl] = useState<string | null>(null);
    const [signedDocument, setSignedDocument] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [signOpenModal, setSignOpenModal] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

    useEffect(() => {

        const fetchDocument = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/api/reports/${documentId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + Cookies.get('token')
                    }
                });
                const blob = await response.blob();

                const url = URL.createObjectURL(blob);
                setDocumentUrl(url);
            } catch (error) {
                console.error('Erro ao buscar o documento:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [documentId]);

    const handleSignDocument = async () => {
          
        try {
          const response = await fetch(`http://localhost:3000/api/sign-document`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify({
            documentId: documentId,
            userName: userName
            })
          });
        
          if (!response.ok) {
            throw new Error('Failed to sign document');
          }
        
          const data = await response.json();
          const pdfBytes = new Uint8Array(data.signedDocument);

          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setSignedDocument(url);

         setSnackbar({ open: true, message: 'Documento assinado e salvo na base de dados com sucesso! Volte para o sistema para verificar seus documentos assinados', severity: 'success' });

        setTimeout(() => {
            window.location.href = '/login';
        }, 5000);
        } catch (error) {
          console.error('Error signing document:', error);
        }
      };

    const handleClose = () => {
        setSignOpenModal(false);
    } 

    const handleOpenSignModal = async () => {
        setSignOpenModal(true);
    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Assinar Documento
                </Typography>
                {loading && <CircularProgress />}
                {documentUrl && !loading && (
                    <iframe src={documentUrl} width="100%" height="500px" style={{ border: '1px solid #ccc', borderRadius: '4px' }} />
                )}
                <Box mt={2}>
                    <Button variant="contained" color="primary" onClick={handleOpenSignModal}>
                        Assinar Documento
                    </Button>
                </Box>
                <Modal open={signOpenModal} onClose={handleClose}>
                    <Box sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        width: 400, 
                        bgcolor: 'background.paper', 
                        boxShadow: 24, 
                        p: 4 
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Digite sua assinatura
                        </Typography>
                        <TextField
                            label="Assinatura"
                            variant="outlined"
                            fullWidth
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            margin="normal"
                        />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleSignDocument} 
                            disabled={loading || !userName}
                        >
                            Confirmar Assinatura
                        </Button>
                    </Box>
                </Modal>
                {signedDocument && (
                    <Box mt={4}>
                        <Typography style={{color: 'white'}} variant="h5" component="h2" gutterBottom>
                            Documento Assinado
                        </Typography>
                        <iframe src={signedDocument} width="100%" height="500px" style={{ border: '1px solid #ccc', borderRadius: '4px' }} />
                        <Box mt={2}>
                            <Button variant="contained" color="secondary" href={signedDocument} download="documento_assinado.pdf">
                                Baixar PDF
                            </Button>
                        </Box>
                    </Box>
                )}
                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default SignDocumentPage;