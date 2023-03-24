import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import authRoutes from './routes/auth';

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error(error));

app.use('/api/auth', authRoutes);

app.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`);
});
