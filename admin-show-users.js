import pool from './src/config/db.js';
import fs from 'fs';

async function showUsers() {
    try {
        const [rows] = await pool.query('SELECT id, company_name, email, password, business_type, created_at FROM companies');
        
        fs.writeFileSync('admin_output.json', JSON.stringify({
            users: rows,
            message: 'Passwords are now saved in plain text.'
        }, null, 2));
        
        pool.end();
    } catch (error) {
        fs.writeFileSync('admin_output.json', JSON.stringify({ error: error.message, stack: error.stack }));
    }
}

showUsers();
