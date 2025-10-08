export const create_user_table =
`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;


export const create_transactions_table =
`DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('income', 'expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    date TIMESTAMP,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    type transaction_type NOT NULL,
    description TEXT
);`;


export const insert_transaction = `
    INSERT INTO transactions (user_id,date,amount, category, description, type)
    VALUES ($1, $2, $3, $4, $5, $6);
`;

export const get_transactions_by_month = `
    SELECT id, user_id, amount, category, type, description,  TO_CHAR(date, 'YYYY-MM-DD') as date
    FROM transactions
    WHERE user_id = $1
      AND EXTRACT(YEAR FROM date) = $2
      AND EXTRACT(MONTH FROM date) = $3
    ORDER BY date DESC;
`;

export const get_transactions_by_category=`
SELECT id, user_id, amount, category, type, description,  TO_CHAR(date, 'YYYY-MM-DD') as date
FROM transactions
WHERE user_id = $1
  AND category LIKE $2
`

export const get_all_transactions=`
SELECT id, user_id, amount, category, type, description,  TO_CHAR(date, 'YYYY-MM-DD') as date
FROM transactions
WHERE user_id = $1 ORDER BY date DESC`