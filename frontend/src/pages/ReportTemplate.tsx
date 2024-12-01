import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LOGO_BASE64 } from '../config/config';
import Cookies from 'js-cookie';
import { Button, TextField, Snackbar, Alert } from '@mui/material';

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

interface Employee {
    name: string;
    position: string;
    department: string;
    hours_worked_per_week: number;
}

interface ReportTemplateProps {
    employees: Employee[];
}

const ReportTemplate: React.FC<ReportTemplateProps> = ({ employees }) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [reportName, setReportName] = useState<string>('Relatório Semanal');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const generatePDF = async () => {
        try {
            const doc = new jsPDF();

            // Adiciona o logotipo da empresa
            const imgData = LOGO_BASE64; // Substitua com o base64 do logotipo da empresa
            doc.addImage(imgData, 'PNG', 14, 10, 50, 20);

            // Adiciona o título do relatório
            doc.setFontSize(18);
            doc.text('Relatório Semanal de Horas Trabalhadas', 14, 40);

            // Adiciona a data de geração do relatório
            const date = new Date();
            doc.setFontSize(12);
            doc.text(`Data de Geração: ${date.toLocaleDateString()}`, 14, 50);

            const tableColumn = ["Nome", "Posição", "Departamento", "Horas Trabalhadas por Semana"];
            const tableRows: any[] = [];

            employees.forEach(employee => {
                const employeeData = [
                    employee.name,
                    employee.position,
                    employee.department,
                    employee.hours_worked_per_week
                ];
                tableRows.push(employeeData);
            });

            (doc as any).autoTable({
                startY: 60,
                head: [tableColumn],
                body: tableRows,
                theme: 'grid',
                headStyles: { fillColor: [22, 160, 133] },
                styles: { fontSize: 10, cellPadding: 3 },
            });

            const pdfBlob = doc.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPdfUrl(pdfUrl);
            setPdfBlob(pdfBlob);

            setSnackbarMessage('PDF gerado com sucesso');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage('Erro ao gerar o PDF');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSavePDF = async (pdfBlob: Blob) => {
        const formData = new FormData();
        formData.append('file', pdfBlob, `${reportName}.pdf`);
        formData.append('name', reportName);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

            const response = await fetch('http://localhost:3000/api/reports', {
                credentials: 'include',
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setSnackbarMessage('PDF salvo com sucesso');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage('Erro ao salvar o PDF');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div>
            <TextField
                label="Nome do Relatório"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                style={{ margin: '10px' }}
            />
            <Button style={{ margin: '10px' }} variant="contained" color="inherit" onClick={generatePDF}>Gerar PDF</Button>
            <Button style={{ margin: '10px' }} variant="contained" color="inherit" onClick={() => pdfBlob && handleSavePDF(pdfBlob)}>Salvar PDF</Button>
            {pdfUrl && (
                <iframe
                    src={pdfUrl}
                    width="100%"
                    height="600px"
                    style={{ border: 'none', marginTop: '20px' }}
                ></iframe>
            )}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default ReportTemplate;