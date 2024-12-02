import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from '../api/employee';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PencilIcon from '@mui/icons-material/Edit';
import { Alert, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, TextField, Modal } from '@mui/material';
import ReportTemplate from './ReportTemplate';
import PdfList from './PdfList';
import SignedPdfList from './SignedPdfList';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            style={{ height: '100%' }}
        >
            {value === index && <Box sx={{ p: 3, color: 'gray', height: '100%' }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function HomePage() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
        <p style={
            {
                marginTop: '-1%',
				color: 'white',
				fontWeight: '500',
				fontSize: '30px'
            }
        }>Bem vindo ao sistema de relatórios de horas semanais</p>
        <Box sx={{ width: '100%', height: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab
                        label="Colaboradores"
                        {...a11yProps(0)}
                        sx={{
                            color: value === 0 ? 'white' : 'white', // Cor do texto
                            backgroundColor: value === 0 ? 'white' : 'transparent', // Cor de fundo
                            '&:hover': {
                                backgroundColor: value === 0 ? 'white' : 'transparent', // Cor ao passar o mouse
                            },
                        }}
                    />
                    <Tab
                        label="Relatórios"
                        {...a11yProps(1)}
                        sx={{
                            color: value === 1 ? 'white' : 'white', // Cor do texto
                            backgroundColor: value === 1 ? 'white' : 'transparent', // Cor de fundo
                            '&:hover': {
                                backgroundColor: value === 1 ? 'white' : 'transparent', // Cor ao passar o mouse
                            },
                        }}
                    />
                    <Tab
                        label="Documentos assinados"
                        {...a11yProps(2)}
                        sx={{
                            color: value === 2 ? 'white' : 'white', // Cor do texto
                            backgroundColor: value === 2 ? 'white' : 'transparent', // Cor de fundo
                            '&:hover': {
                                backgroundColor: value === 2 ? 'white' : 'transparent', // Cor ao passar o mouse
                            },
                        }}
                    />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <EmployeeList />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <PdfList />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <SignedPdfList />
            </CustomTabPanel>
            </Box>
        </>
        
    );
}

function EmployeeList() {
    const [rows, setRows] = React.useState<{ id: string; name: string; position: string; department: string; salary: number; hireDate: string, hours_worked_per_week: number }[]>([]);
    const [open, setOpen] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [newEmployee, setNewEmployee] = React.useState({ id: '', name: '', position: '', department: '', salary: '', hireDate: '', hours_worked_per_week: 0 });
    const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
    const [showReportModal, setShowReportModal] = React.useState(false);

    React.useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await getEmployees();
            if (response && response.ok) {
                const employees = await response.json();
                const mappedEmployees = employees.map((employee: any) => ({
                    id: employee._id,
                    name: employee.name,
                    position: employee.position,
                    department: employee.department,
                    salary: employee.salary,
                    hireDate: new Date(employee.hireDate).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    }),
                    hours_worked_per_week: employee.hours_worked_per_week
                }));
                setRows(mappedEmployees);
            } else {
                console.error('Failed to fetch employees');
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await deleteEmployee(id);

            if (!response) {
                setSnackbar({ open: true, message: 'Failed to delete employee', severity: 'error' });
                return;
            }

            const getEmployeesResponse = await getEmployees();

            const employees = getEmployeesResponse ? await getEmployeesResponse.json() : [];

            const mappedEmployees = employees.map((employee: any) => ({
                id: employee._id,
                name: employee.name,
                position: employee.position,
                department: employee.department,
                salary: employee.salary,
                hireDate: new Date(employee.hireDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }),
            }));

            setRows(mappedEmployees);

            setRows(rows.filter((row: { id: string }) => row.id !== id));
            setSnackbar({ open: true, message: 'Colaborador deletado com sucesso', severity: 'success' });
        } catch (error) {
            console.error('Error deleting employee:', error);
            setSnackbar({ open: true, message: 'Erro ao deletar o colaborador', severity: 'error' });
        }
    };

    const handleSaveEmployee = async () => {
        try {
            const payload = {
                id: newEmployee.id ?? '',
                name: newEmployee.name,
                position: newEmployee.position,
                department: newEmployee.department,
                salary: parseFloat(newEmployee.salary),
                hireDate: new Date(newEmployee.hireDate).toISOString(),
                hours_worked_per_week: newEmployee.hours_worked_per_week || 0
            };

            let response;
            if (isEditing) {
                response = await updateEmployee(payload);
            } else {
                response = await createEmployee(payload);
            }

            if (response && response.ok) {
                fetchEmployees();
                handleClose();
                setSnackbar({ open: true, message: isEditing ? 'Colaborador atualizado com sucesso' : 'Colaborador criado com successo', severity: 'success' });
            } else {
                console.error('Houve uma falha ao salvar o colaborador');
                setSnackbar({ open: true, message: 'Houve uma falha ao salvar o colaborador', severity: 'error' });
            }
        } catch (error) {
            console.error('Error saving employee:', error);
            setSnackbar({ open: true, message: 'Houve uma falha ao salvar o colaborador', severity: 'error' });
        }
    };

    const parseDate = (dateString: string) => {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    };

    const handleEdit = (id: string) => {
        const employeeToEdit = rows.find((row) => row.id === id);
        if (employeeToEdit) {
            const hireDate = parseDate(employeeToEdit.hireDate);
            if (isNaN(hireDate.getTime())) {
                console.error('Invalid hire date:', employeeToEdit.hireDate);
                setSnackbar({ open: true, message: 'Invalid hire date', severity: 'error' });
                return;
            }
            setNewEmployee({
                id: employeeToEdit.id,
                name: employeeToEdit.name,
                position: employeeToEdit.position,
                department: employeeToEdit.department,
                salary: employeeToEdit.salary.toString(),
                hireDate: hireDate.toISOString().split('T')[0],
                hours_worked_per_week: employeeToEdit.hours_worked_per_week
            });
            setIsEditing(true);
            setOpen(true);
        } else {
            console.log('Employee to edit not found'); // Log for debugging
        }
    };

    const handleOpen = () => {
        setNewEmployee({ id: '', name: '', position: '', department: '', salary: '', hireDate: '', hours_worked_per_week: 0});
        setIsEditing(false);
        setOpen(true);
    };

    const handleReportOpen = () => {
        setShowReportModal(true);
    }

    const handleClose = () => setOpen(false);

    const handleCloseReportModal = () => setShowReportModal(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEmployee((prev) => ({ ...prev, [name]: value }));
    };
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Nome', width: 200 },
        { field: 'position', headerName: 'Cargo', width: 200 },
        { field: 'department', headerName: 'Departamento', width: 200 },
        { field: 'salary', headerName: 'Salário', type: 'number', width: 130 },
        { field: 'hireDate', headerName: 'Data de contratação', width: 150 },
        { field: 'hours_worked_per_week', headerName: 'Horas trabalhadas por semana', width: 250 },
        {
            field: 'actions',
            headerName: 'Ações',
            width: 100,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => handleDelete(params.row.id)} color="inherit">
                        <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(params.row.id)} color="inherit">
                        <PencilIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box sx={{ height: 'calc(100vh - 48px)', width: '100%' }}>
            <Paper sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowsPerPageOptions={[5, 10, 20]}
                    checkboxSelection
                    pagination
                    sx={{ border: 0 }}
                />
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                <div style={{margin: '10px'}}>
                    <Button variant="contained" color="inherit" onClick={handleReportOpen} sx={{ color: 'black' }}>
                        Gerar relatório
                    </Button>
                </div>
                <div style={{margin: '10px'}}>
                    <Button variant="contained" color="inherit" onClick={handleOpen} sx={{ color: 'black' }}>
                        Adicionar Colaborador
                    </Button>
                </div>
            </Box>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <h2>{isEditing ? 'Editar Colaborador' : 'Adicionar Colaborador'}</h2>
                    <TextField 
                        label="Nome" 
                        name="name" 
                        fullWidth 
                        margin="normal" 
                        value={newEmployee.name} 
                        onChange={handleChange} 
                        InputLabelProps={{ style: { color: 'black' } }}
                    />
                    <TextField 
                        label="Cargo" 
                        name="position" 
                        fullWidth 
                        margin="normal" 
                        value={newEmployee.position} 
                        onChange={handleChange} 
                        InputLabelProps={{ style: { color: 'black' } }}
                    />
                    <TextField 
                        label="Departamento" 
                        name="department" 
                        fullWidth 
                        margin="normal" 
                        value={newEmployee.department} 
                        onChange={handleChange} 
                        InputLabelProps={{ style: { color: 'black' } }}
                    />
                    <TextField 
                        label="Salário" 
                        name="salary" 
                        fullWidth 
                        margin="normal" 
                        value={newEmployee.salary} 
                        onChange={handleChange} 
                        InputLabelProps={{ style: { color: 'black' } }}
                    />
                    <TextField
                        label="Data de contratação"
                        name="hireDate"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={newEmployee.hireDate}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                            style: { color: 'black' }
                        }}
                    />
                    <TextField 
                        label="Horas trabalhadas por semana" 
                        name="hours_worked_per_week" 
                        fullWidth 
                        margin="normal" 
                        value={newEmployee.hours_worked_per_week} 
                        onChange={handleChange} 
                        InputLabelProps={{ style: { color: 'black' } }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button variant="contained" color="inherit" sx={{ color: 'black' }} onClick={handleSaveEmployee}>
                            {isEditing ? 'Salvar' : 'Adicionar'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <div>
                <Dialog open={showReportModal} onClose={handleCloseReportModal} maxWidth="lg" fullWidth>
                    <DialogTitle>Relatório Semanal</DialogTitle>
                    <DialogContent>
                        <ReportTemplate employees={rows} />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="inherit" onClick={handleCloseReportModal}>
                            Fechar
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}