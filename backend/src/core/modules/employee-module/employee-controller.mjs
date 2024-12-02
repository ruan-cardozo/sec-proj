import { EmployeeService } from './employee-service.mjs';

export class EmployeeController {

    static #instance;
    #employeeService;

    constructor() {
        this.#employeeService = EmployeeService.getInstance();
        ['getAllEmployees', 'getOneEmployee', 'createEmployee', 'updateEmployee', 'deleteEmployee'].forEach(method => {
            this[method] = this[method].bind(this);
        });
    }
    
    get employeeService() {

        return this.#employeeService;
    }

    static getInstance() {
        
        if (!EmployeeController.#instance) {

            EmployeeController.#instance = new EmployeeController();
        }

        return EmployeeController.#instance;
    }

    async getAllEmployees(req, res) {

       return this.employeeService.getAllEmployees(req, res);
    }

    async getOneEmployee(req, res) {
       
        return this.employeeService.getOneEmployee(req, res);
    }

    async createEmployee(req, res) {

       return this.employeeService.createEmployee(req, res);
    }

    async updateEmployee(req, res) {
        
        return this.employeeService.updateEmployee(req, res);
    }

    async deleteEmployee(req, res) {
        
        return this.employeeService.deleteEmployee(req, res);
    }
}