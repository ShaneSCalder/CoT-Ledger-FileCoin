// dev.js

const app = require('./app');
const PORT = 3003;

app.listen(PORT, () => {
  console.log(`🚀 Filecoin Agent running locally at http://localhost:${PORT}`);
});
