import mongoose from 'mongoose';

const withDB = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }

  await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true
  });

  return handler(req, res);
};

export default withDB;
