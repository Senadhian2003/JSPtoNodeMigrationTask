use todo

CREATE TABLE [user] (
    id INT PRIMARY KEY IDENTITY(1,1),
    firstname NVARCHAR(50) NOT NULL,
    lastname NVARCHAR(50) NOT NULL,
    username NVARCHAR(50) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL
);


CREATE TABLE todo (
    id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    userid INT,
    targetdate DATE NOT NULL,
    completed BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (userid) REFERENCES [user](id)
);



