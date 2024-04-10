const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432
});

const getAll = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT 'concentrates' AS category, * FROM concentrates
            UNION ALL
            SELECT 'edible' AS category, * FROM edible
            UNION ALL
            SELECT 'flower' AS category, * FROM flower
            UNION ALL
            SELECT 'preroll' AS category, * FROM preroll
            UNION ALL
            SELECT 'vaporizer' AS category, * FROM vaporizer;
        `);
        return result.rows;
    } finally {
        client.release();
    }
}

const searchAll = async (searchTerm) => {
    const client = await pool.connect();
    try {
        // Split the search term into individual terms
        const terms = searchTerm.split(' ');

        // Create a LIKE clause for each term
        const clauses = terms.map(term => `
            (LOWER(name) LIKE LOWER('%${term}%') OR LOWER(quantity::text) LIKE LOWER('%${term}%') OR LOWER(type) LIKE LOWER('%${term}%') OR LOWER(strength) LIKE LOWER('%${term}%') OR LOWER(class) LIKE LOWER('%${term}%'))
        `);

        // Join the clauses with AND
        const clause = clauses.join(' AND ');

        const query = `
            SELECT 'concentrates' AS category, * FROM concentrates WHERE ${clause}
            UNION ALL
            SELECT 'edible' AS category, * FROM edible WHERE ${clause}
            UNION ALL
            SELECT 'flower' AS category, * FROM flower WHERE ${clause}
            UNION ALL
            SELECT 'preroll' AS category, * FROM preroll WHERE ${clause}
            UNION ALL
            SELECT 'vaporizer' AS category, * FROM vaporizer WHERE ${clause}
        `;

        const result = await client.query(query);
        return result.rows;
    } finally {
        client.release();
    }
}

const getByIdFromTable = async (table, id) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        return result.rows[0];
    } finally {
        client.release();
    }
};

const getAllFromTable = async (table) => {
    const client = await pool.connect();
    try {
       const result = await client.query(`SELECT * FROM ${table}`);
       return result.rows;
    } finally {
        client.release();
    }
};

const insertEntry = async (table, entryData) => {
    const client = await pool.connect();
    try {
        const columns = Object.keys(entryData).join(', ');
        const placeholders = Object.keys(entryData).map((_, index) => `$${index + 1}`).join(', ');
        const values = Object.values(entryData);
        
        const result = await client.query(
            `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
            values
        );
        return result.rowCount;
    } finally {
        client.release();
    }
};

const updateEntry = async (table, id, columnsToUpdate) => {
    const client = await pool.connect();
    try {
        const setClause = Object.keys(columnsToUpdate).map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = Object.values(columnsToUpdate);
        const result = await client.query(
            `UPDATE ${table} SET ${setClause} WHERE id = $${values.length + 1}`,
            [...values, id]
        );
        return result.rowCount;
    } finally {
        client.release();
    }
};

const deleteEntry = async (table, id) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
        return true;
    } finally {
        client.release();
    }
};

module.exports = {
    getAll,
    searchAll,
    getByIdFromTable,
    getAllFromTable,
    insertEntry,
    updateEntry,
    deleteEntry
};


