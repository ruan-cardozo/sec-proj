export type Employee = {
    id?: string;
    name: string;
    position: string;
    department: string;
    salary: string | number;
    hireDate: string;
}

export const getEmployees = async () => {
    try {   

        const url = 'http://localhost:3000/api/employees';

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
            
        });

        return response;
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

export const createEmployee = async (employee: Employee) => {
    const url = 'http://localhost:3000/api/employees';
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employee),
            credentials: 'include'
        });

        return response;
    } catch (error) {
        console.error('Error creating employee:', error);
    }
}

export const updateEmployee = async (employee: Employee) => {
    const url = 'http://localhost:3000/api/employees/' + employee.id;
    
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employee),
            credentials: 'include'
        });

        return response;
    } catch (error) {
        console.error('Error creating employee:', error);
    }
}

export const deleteEmployee = async (id: string) => {

    const url = `http://localhost:3000/api/employees/${id}`;

    try {
    
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'

        });

        return response;
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
}

