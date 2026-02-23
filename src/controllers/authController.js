import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const registerCompany = async (req, res) => {
    try {
        const { companyName, email, password, type, method, financialYear, currency, branches } = req.body;

        if (!companyName || !email || !password) {
            return res.status(400).json({ message: 'Please provide company name, email, and password.' });
        }

        // Check if company already exists
        const [existing] = await pool.query('SELECT * FROM companies WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Company with this email already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Convert branches array to JSON string if it exists
        const branchesJson = branches ? JSON.stringify(branches) : null;

        const [result] = await pool.query(
            `INSERT INTO companies (company_name, email, password, business_type, method, financial_year, currency, branches)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [companyName, email, hashedPassword, type, method, financialYear, currency, branchesJson]
        );

        res.status(201).json({
            id: result.insertId,
            companyName,
            email,
            token: generateToken(result.insertId),
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

export const loginCompany = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password.' });
        }

        const [companies] = await pool.query('SELECT * FROM companies WHERE email = ?', [email]);

        if (companies.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const company = companies[0];
        const isMatch = await bcrypt.compare(password, company.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            id: company.id,
            companyName: company.company_name,
            email: company.email,
            businessType: company.business_type,
            method: company.method,
            financialYear: company.financial_year,
            currency: company.currency,
            token: generateToken(company.id),
            branches: company.branches, // Automatically parsed from JSON by mysql2 if configured, or might need JSON.parse
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};
