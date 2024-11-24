import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: Number,
        required: true
    },
    hireDate: {
        type: Date,
        default: Date.now
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;