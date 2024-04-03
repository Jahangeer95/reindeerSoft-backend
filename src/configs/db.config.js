export const dbConfig = {
  url: process.env.DATABASE_URL,
  options: {
    useNewUrlParser: true, // New connection string parser
    useUnifiedTopology: true, // New Server Discovery and Monitoring engine
    useCreateIndex: true, // Index creation (ensureIndex() is deprecated)
    useFindAndModify: false, // MongoDB driver's findOneAndUpdate() and findOneAndRemove() are deprecated
  },
};
