import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Button, Container, List, ListItem, ListItemText, Typography, Modal, Box, TextField, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';

interface PDF {
    _id: string;
    name: string;
    file: string; // Presume-se que o arquivo esteja em formato base64
    fileType: string;
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

const PdfList: React.FC = () => {
    const [pdfs, setPdfs] = useState<PDF[]>([]);
    const [selectedPdf, setSelectedPdf] = useState<PDF | null>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [emailOpen, setEmailOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchPdfs = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/reports', {
                    headers: {
                        'Authorization': 'Bearer ' + Cookies.get('token')
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao buscar os PDFs');
                }

                const data = await response.json();
                setPdfs(data);
            } catch (error) {
                setSnackbarMessage((error as Error).message);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };  

        fetchPdfs();
    }, []);

    const handleDownload = async (id: string, name: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/reports/${id}`, { 
                headers:{ 
                    'Authorization': 'Bearer ' + Cookies.get('token')
                }
            });
            
            if (!response.ok) {
                throw new Error('Erro ao baixar o PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();

            setSnackbarMessage('PDF baixado com sucesso');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage((error as Error).message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleViewPDF = async (pdfId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/reports/${pdfId}`, {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('token')
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const pdfBlob = await response.blob();
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPdfUrl(pdfUrl);
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

    const handleDelete = async (pdfId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/reports/${pdfId}`, {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('token')
                },
                method: 'DELETE'
            });
        
            if (!response.ok) {
                throw new Error('Erro ao apagar o PDF');
            }

            const fetchPdfs = async () => {
                try {
                    const response = await fetch('http://localhost:3000/api/reports', {
                        headers: {
                            'Authorization': 'Bearer ' + Cookies.get('token')
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error('Erro ao buscar os PDFs');
                    }
    
                    const data = await response.json();
                    setPdfs(data);
                } catch (error) {
                    setSnackbarMessage((error as Error).message);
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                }
            };  
    
            fetchPdfs();

            setSnackbarMessage('PDF apagado com sucesso');
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

    const handleSendEmail = async (pdfId: string) => {
 
        try {   
            await fetch(`http://localhost:3000/api/email`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ to: email, documentId: pdfId }),
            });

            const pdfName = pdfs.find(pdf => pdf._id === pdfId)?.name;

            setSnackbarMessage(`E-mail enviado com sucesso para o documento ${pdfName}`);
        } catch (error) {
            setSnackbarMessage((error as Error).message);
            setSnackbarSeverity('error');
        }
    };

    const handleOpenEmailModal = (pdf: PDF) => {
            
        setSelectedPdf(pdf);
        setEmailOpen(true);
    }

    const handleCloseEmailModal = () => {
        setEmailOpen(false);
        setEmail('');
    }

    return (
        <Container style={{ width: '100%', maxWidth: 'none' }}>
            <Typography variant="h4" gutterBottom style={{color: 'white'}}>Lista de PDFs</Typography>
            <List style={{ width: '100%' }}>
                {pdfs.map(pdf => (
                    <StyledListItem style={{ width: '100%'}} key={pdf._id}>
                        <ListItemText primary={pdf.name} />
                        <StyledButton variant="contained" color="primary" onClick={() => handleDownload(pdf._id, pdf.name)}>Download</StyledButton>
                        <StyledButton variant="contained" onClick={() => handleViewPDF(pdf._id)}>Visualizar</StyledButton>
                        <StyledButton variant="contained" data-pdfid={pdf._id} onClick={() => handleOpenEmailModal(pdf)}>Notificar por e-mail</StyledButton>
                        <StyledButton variant="contained" onClick={() => handleDelete(pdf._id)}>Apagar PDF</StyledButton>
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
            {/* Modal para selecionar o email do destinatário */}
            <Modal open={emailOpen} onClose={handleCloseEmailModal}>
                <Box sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: 400, 
                    bgcolor: 'background.paper', 
                    border: '2px solid #000', 
                    boxShadow: 24, 
                    p: 4 
                }}>
                    <h2>Enviar PDF por Email</h2>
                    <TextField
                        label="Email do Destinatário"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={() => selectedPdf?._id && handleSendEmail(selectedPdf._id)}>
                        Enviar
                    </Button>
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

export default PdfList;