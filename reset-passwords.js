import pool from './src/config/db.js';
import fs from 'fs';

async function updatePasswordsToPlainText() {
    try {
        console.log('Fetching all users...');
        const [users] = await pool.query('SELECT id, email, password FROM companies');
        
        let updateCount = 0;
        const newPassword = 'password123'; // Setting a default plain text password for existing hashed accounts

        for (const user of users) {
             // Check if it looks like a bcrypt hash (usually starts with $2b$, $2a$, etc.)
            if (user.password.startsWith('$2')) {
                console.log(`Updating password for ${user.email} from hash to plain text -> '${newPassword}'`);
                await pool.query('UPDATE companies SET password = ? WHERE id = ?', [newPassword, user.id]);
                updateCount++;
            }
        }
        
        console.log(`\nSuccessfully updated ${updateCount} user(s) to use plain text password: '${newPassword}'`);
        console.log('You can now use this password to login for existing accounts.');
        
        pool.end();
    } catch (error) {
        console.error('Error updating passwords:', error.message);
        pool.end();
    }
}

updatePasswordsToPlainText();
