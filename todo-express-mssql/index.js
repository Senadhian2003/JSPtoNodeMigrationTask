const express = require('express');
const sql = require('mssql');
const app = express();
app.use(express.json());
const port = 5000;



  const config = {
   
    user: "Batman",
    password: "Batman@2003",
    server: "4N8CBX3\\SQLEXPRESS",
    database: "todo",
    options: {
        encrypt:false,
        trustedConnection: false
}
};
  


// Connect to the database
sql.connect(config)
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/register', (req, res) => {
    const { firstname, lastname, username, password } = req.body;
    
    const query = `INSERT INTO [user] (firstname, lastname, username, password) 
                   VALUES (@firstname, @lastname, @username, @password)`;
    
    const request = new sql.Request();
    request.input('firstname', sql.NVarChar, firstname);
    request.input('lastname', sql.NVarChar, lastname);
    request.input('username', sql.NVarChar, username);
    request.input('password', sql.NVarChar, password);
    
    request.query(query, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).send('Error registering user');
        } else {
            res.status(201).send('User registered successfully');
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM [user] WHERE username = @username AND password = @password`;

    const request = new sql.Request();
    request.input('username', sql.NVarChar, username);
    request.input('password', sql.NVarChar, password);

    request.query(query, (err, result) => {
        if (err) {
            console.error('Error during login:', err);
            res.status(500).send('Login error');
        } else if (result.recordset.length > 0) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});

app.post('/todo', (req, res) => {
    const { title, description, userid, targetdate, completed } = req.body;

    const query = `INSERT INTO todo (title, description, userid, targetdate, completed) 
                   VALUES (@title, @description, @userid, @targetdate, @completed)`;

    const request = new sql.Request();
    request.input('title', sql.NVarChar, title);
    request.input('description', sql.NVarChar, description);
    request.input('userid', sql.Int, userid);
    request.input('targetdate', sql.Date, targetdate);
    request.input('completed', sql.Bit, completed);

    request.query(query, (err, result) => {
        if (err) {
            console.error('Error adding todo:', err);
            res.status(500).send('Error adding todo');
        } else {
            res.status(201).send('Todo added successfully');
        }
    });
});

app.put('/todo/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, targetdate, completed } = req.body;

    const query = `UPDATE todo 
                   SET title = @title, description = @description, targetdate = @targetdate, completed = @completed 
                   WHERE id = @id`;

    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.input('title', sql.NVarChar, title);
    request.input('description', sql.NVarChar, description);
    request.input('targetdate', sql.Date, targetdate);
    request.input('completed', sql.Bit, completed);

    request.query(query, (err, result) => {
        if (err) {
            console.error('Error updating todo:', err);
            res.status(500).send('Error updating todo');
        } else {
            res.status(200).send('Todo updated successfully');
        }
    });
});

app.delete('/todo/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM todo WHERE id = @id`;

    const request = new sql.Request();
    request.input('id', sql.Int, id);

    request.query(query, (err, result) => {
        if (err) {
            console.error('Error deleting todo:', err);
            res.status(500).send('Error deleting todo');
        } else {
            res.status(200).send('Todo deleted successfully');
        }
    });
});

app.get('/todo/:id', (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM todo WHERE id = @id`;

    const request = new sql.Request();
    request.input('id', sql.Int, id);

    request.query(query, (err, result) => {
        if (err) {
            console.error('Error retrieving todo:', err);
            res.status(500).send('Error retrieving todo');
        } else if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).send('Todo not found');
        }
    });
});

app.get('/getcoffees', (req, res) => {
    const { userid } = req.params;

    const query = `SELECT * FROM todo WHERE userid = @userid`;

    const request = new sql.Request();
    request.input('userid', sql.Int, userid);

    request.query(query, (err, result) => {
        if (err) {
            console.error('Error retrieving todos:', err);
            res.status(500).send('Error retrieving todos');
        } else {
            res.status(200).json(result.recordset);
        }
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
