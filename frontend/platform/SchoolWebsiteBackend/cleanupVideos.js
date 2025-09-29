const fs = require('fs');
const path = require('path');
const pool = require('./database');

const cleanupVideos = async () => {
  const videosDir = path.join(__dirname, 'uploads/videos');
  const files = fs.readdirSync(videosDir);
  
  const dbVideos = await pool.query('SELECT video_url FROM lessons');
  const usedFiles = dbVideos.rows.map(row => path.basename(row.video_url));

  for (const file of files) {
    if (!usedFiles.includes(file)) {
      const filePath = path.join(videosDir, file);
      const stats = fs.statSync(filePath);
      const now = Date.now();

      if ((now - stats.mtimeMs) > 1000 * 60 * 60) {
        fs.unlinkSync(filePath);
        console.log(`Удалён неиспользуемый файл: ${file}`);
      }
    }
  }
};

cleanupVideos();