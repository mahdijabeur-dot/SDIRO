
CREATE TABLE incidents (
 id INT IDENTITY PRIMARY KEY,
 reference VARCHAR(100),
 status VARCHAR(20),
 createdAt DATETIME,
 formData NVARCHAR(MAX)
);
