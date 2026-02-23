import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    uri: process.env.DB_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export const initializeDatabase = async () => {
    try {
        const connection = await pool.getConnection();

        await connection.query(`
            CREATE TABLE IF NOT EXISTS companies (
                id INT AUTO_INCREMENT PRIMARY KEY,
                company_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                business_type VARCHAR(255) DEFAULT NULL,
                method VARCHAR(100) DEFAULT NULL,
                financial_year VARCHAR(50) DEFAULT NULL,
                currency VARCHAR(10) DEFAULT 'INR',
                branches JSON DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database connected and companies table ready.');
        connection.release();
    } catch (error) {
        console.error('Error connecting to or initializing the database:', error);
    }
};

export default pool;
