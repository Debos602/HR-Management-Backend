import { Employee } from '../models/types';
import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { AppError } from '../utils/appError';

export class EmployeeService {
    private employeeRepository: EmployeeRepository;

    constructor(employeeRepository: EmployeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    async createEmployee(employeeData: Employee): Promise<Employee> {
        // Validate age
        if (employeeData.age < 18 || employeeData.age > 70) {
            throw new AppError('Employee age must be between 18 and 70', 400);
        }

        // Validate salary
        if (employeeData.salary <= 0) {
            throw new AppError('Salary must be greater than 0', 400);
        }

        // Validate dates
        const hiringDate = new Date(employeeData.hiring_date);
        const dateOfBirth = new Date(employeeData.date_of_birth);

        if (hiringDate < dateOfBirth) {
            throw new AppError('Hiring date cannot be before date of birth', 400);
        }

        return this.employeeRepository.create(employeeData);
    }

    async getEmployeeById(id: number): Promise<Employee> {
        const employee = await this.employeeRepository.getEmployeeById(id);
        if (!employee) {
            throw new AppError('Employee not found', 404);
        }
        return employee;
    }

    async getAllEmployees(query?: Record<string, any>): Promise<Employee[] | { data: Employee[]; meta: any; }> {
        if (query && Object.keys(query).length > 0) {
            return this.employeeRepository.list(query);
        }
        return this.employeeRepository.getAllEmployees();
    }

    async getEmployeesByDesignation(designation: string): Promise<Employee[]> {
        const employees =
            await this.employeeRepository.getEmployeesByDesignation(designation);
        if (employees.length === 0) {
            throw new AppError(
                `No employees found with designation: ${designation}`,
                404
            );
        }
        return employees;
    }

    async updateEmployee(
        id: number,
        employeeData: Partial<Employee>
    ): Promise<Employee> {
        const employee = await this.employeeRepository.getEmployeeById(id);
        if (!employee) {
            throw new AppError('Employee not found', 404);
        }

        // Validate age if provided
        if (employeeData.age && (employeeData.age < 18 || employeeData.age > 70)) {
            throw new AppError('Employee age must be between 18 and 70', 400);
        }

        // Validate salary if provided
        if (employeeData.salary && employeeData.salary <= 0) {
            throw new AppError('Salary must be greater than 0', 400);
        }

        await this.employeeRepository.update(id, employeeData);
        return this.getEmployeeById(id);
    }

    async deleteEmployee(id: number): Promise<void> {
        const employee = await this.employeeRepository.getEmployeeById(id);
        if (!employee) {
            throw new AppError('Employee not found', 404);
        }

        await this.employeeRepository.delete(id);
    }

    async searchEmployees(searchTerm: string): Promise<Employee[]> {
        const employees = await this.employeeRepository.search(searchTerm);
        if (employees.length === 0) {
            throw new AppError(
                `No employees found matching: ${searchTerm}`,
                404
            );
        }
        return employees;
    }
}
