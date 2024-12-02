import { ReportService } from './report-service.mjs';

export class ReportController {

    static #instance;
    #reportService;

    constructor() {
        this.#reportService = ReportService.getInstance();
        ['getAllReports', 'getOneReport', 'createReport', 'deleteReport', 'getAllReportsSigned'].forEach(method => {
            this[method] = this[method].bind(this);
        });
    }

    static getInstance() {
        
        if (!ReportController.#instance) {

            ReportController.#instance = new ReportController();
        }

        return ReportController.#instance;
    }

    get reportService() {
            
        return this.#reportService
    }

    getAllReports(req, res) {

        return this.reportService.getAllReports(req, res);
    }

    getOneReport(req, res) {
       
        return this.reportService.getOneReport(req, res);
    }

    createReport(req, res) {

       return this.reportService.createReport(req, res);
    }

    getAllReportsSigned(req, res) {

        return this.reportService.getAllReportsSigned(req, res);
    }

    deleteReport(req, res) {
        
        return this.reportService.deleteReport(req, res);
    }
}