
import express from 'express';
import multer from 'multer';
import sql from 'mssql';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const dbConfig = {
    user: process.env.SQLSERVER_USER,
    password: process.env.SQLSERVER_PASSWORD,
    server: process.env.SQLSERVER_HOST,
    database: process.env.SQLSERVER_DB,
    port: parseInt(process.env.SQLSERVER_PORT),
    options: { encrypt: process.env.SQLSERVER_ENCRYPT === 'true', trustServerCertificate: process.env.SQLSERVER_TRUST_CERT === 'true' }
};

app.post('/api/incidents', upload.array('files'), async (req, res) => {
  try {
    const payload = JSON.parse(req.body.payload);
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('reference', sql.VarChar, payload.reference)
      .input('status', sql.VarChar, payload.status)
      .input('createdAt', sql.DateTime, payload.createdAt)
      .input('formData', sql.NVarChar(sql.MAX), JSON.stringify(payload.formData))
      .query('INSERT INTO incidents (reference, status, createdAt, formData) VALUES (@reference, @status, @createdAt, @formData)');
    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'DB error' });
  }
});

app.listen(3000, () => console.log('API running'));
