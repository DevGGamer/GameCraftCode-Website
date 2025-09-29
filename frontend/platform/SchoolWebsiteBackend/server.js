//#region Modules Import

const express = require("express");
const https = require('https');
const cors = require("cors");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = require('./database');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// #endregion


//#region Storages
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
      cb(null, req.params.id + "-" + Date.now() + ".png");
  }
});

const lessonsStorage = multer.diskStorage({
  destination: './uploads/videos/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.params.id}-${Date.now()}${ext}`);
  }
});

const uploadVideo = multer({ storage: lessonsStorage });
const upload = multer({ storage });

// #endregion

const privateKey = fs.readFileSync('/etc/letsencrypt/live/gamecraftcode.pro/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/gamecraftcode.pro/fullchain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate
  };

const app = express();
const PORT = process.env.PORT || 8080;

const baseURL = `https://gamecraftcode.pro:${PORT}`;
const dirname = __dirname;

app.use(cors({
  origin: '*',
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/uploads/videos', express.static(path.join(dirname, 'uploads/videos')));

const httpsServer = https.createServer(credentials, app);

// #region JWT Handlers
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'Требуется токен' });

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) return res.status(401).json({ message: 'Недействительный токен' });

  req.user = decoded;
  next();
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// #endregion


// #region Login User API
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { message: 'Слишком много попыток входа. Повторите позже.' }
});

app.post('/api/login', loginLimiter, async (req, res) => {
  const { login, password } = req.body;

  if (typeof login !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Неверные данные' });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE login = $1", [login]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Неверный логин' });
    }
    
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Неверный пароль'});
    }

    const token = generateToken(user);

    res.json({
      message: 'Успешный вход',
      token,
      user: { id: user.id, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
})

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Вы авторизованы!', user: req.user });
});

app.get('/api/user/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    const user = result.rows[0];

    res.json({ id: user.id, role: user.role, userInfo: user});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
})

app.get('/api/user/withoutToken/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    const user = result.rows[0];

    res.json({ id: user.id, role: user.role, userInfo: user});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
})

app.get("/api/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT id, role FROM users WHERE id = $1", [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const user = result.rows[0];
    res.json({ id: user.id, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

//#endregion


// #region Users API
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Пользователи не найдены' });
    }

    res.json({ users: result.rows});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/users', async (req, res) => {
  const { id = null, login, password, name = "", surname = "", email = "", phone = "", role, datebirth = null, need_confirmation = true } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    if (id)
      await pool.query("INSERT INTO users (id, login, password, name, surname, email, phone, role, datebirth, need_confirmation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [id, login, hashedPassword, name, surname, email, phone, role, datebirth, need_confirmation]);
    else
      await pool.query("INSERT INTO users (login, password, name, surname, email, phone, role, datebirth, need_confirmation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [login, hashedPassword, name, surname, email, phone, role, datebirth, need_confirmation]);
    
    res.status(201).send({ message: 'Пользователь добавлен!'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { login, password, name = "", surname = "", email = "", phone = "", role, datebirth = null, need_confirmation = true, google_meet_url = null } = req.body;

  try {
    await pool.query("UPDATE users SET login = $1, password = $2, name = $3, surname = $4, email = $5, phone = $6, role = $7, datebirth = $8, need_confirmation = $9, google_meet_url = $10 WHERE id = $11", [login, password, name, surname, email, phone, role, datebirth, need_confirmation, google_meet_url, id]);
    res.status(200).send({ message: 'Пользователь обновлен!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const userResult = await pool.query("SELECT imagepath FROM users WHERE id = $1", [id]);

    if (userResult.rows.length > 0) {
      const oldPath = userResult.rows[0].imagepath;

      if (oldPath && fs.existsSync(path.join(dirname, oldPath))) {
        fs.unlinkSync(path.join(dirname, oldPath));
      }
    }

    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(200).send({ message: 'Пользователь удален!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


app.post('/api/upload/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const newFilePath = `/uploads/${req.file.filename}`;

  try {
    const userResult = await pool.query("SELECT imagepath FROM users WHERE id = $1", [id]);

    if (userResult.rows.length > 0) {
      const oldPath = userResult.rows[0].imagepath;

      if (oldPath && fs.existsSync(path.join(dirname, oldPath))) {
        fs.unlinkSync(path.join(dirname, oldPath));
      }
    }

    const updateResult = await pool.query("UPDATE users SET imagepath = $1 WHERE id = $2", [newFilePath, id]);

    if (updateResult.rowCount === 0) {
      return res.status(500).json({ error: "Изображение не загружено" });
    }

    res.json({ message: "Изображение загружено!", imagePath: newFilePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при загрузке изображения" });
  }
});

app.get('/api/user/:id/image', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT imagepath FROM users WHERE id = $1", [id]);
  if (result.rowCount === 0) 
    return res.status(404).send("Изображение не найдено");

  res.json({ imageUrl: `${baseURL}${result.rows[0].imagepath}` });
});


app.get("/api/users/role/:role", async (req, res) => {
  try {
    const { role } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE role = $1", [role]);
    
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.post("/api/course-relations", async (req, res) => {
  const { teacher_id, student_id, course_id } = req.body;

  if (!teacher_id || !student_id || !course_id) {
    return res.status(400).json({ error: `teacher_id: ${teacher_id}, student_id: ${student_id} и course_id: ${course_id} обязательны`});
  }

  try {
    const existing = await pool.query(
      'SELECT * FROM teacher_student_course WHERE student_id = $1 AND course_id = $2',
      [student_id, course_id]
    );

    let result;
    if (existing.rows.length > 0) {
      if (existing.rows[0].id != teacher_id)
        result = await pool.query(
          'UPDATE teacher_student_course SET teacher_id = $1 WHERE student_id = $2 AND course_id = $3',
          [teacher_id, student_id, course_id]
        );
    }
    else
    {
      result = await pool.query(
        'INSERT INTO teacher_student_course (teacher_id, student_id, course_id) VALUES ($1, $2, $3) RETURNING *',
        [teacher_id, student_id, course_id]
      );
    }
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при создании связки:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get("/api/course-relations/:courseId/:userId", async (req, res) => {
  const { courseId, userId } = req.params;

  try {
    const course = await pool.query(
      'SELECT * FROM courses WHERE id = $1',
      [courseId]
    );

    if (course.rows.length === 0) {
      return res.status(404).json({ error: 'Курс не найден' });
    }

    // Проверим роль пользователя
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const role = user.rows[0].role;

    let relation, partner;

    if (role === 'student') {
      relation = await pool.query(
        'SELECT * FROM teacher_student_course WHERE student_id = $1 AND course_id = $2',
        [userId, courseId]
      );

      if (relation.rows.length === 0) {
        return res.status(404).json({ error: 'Связка не найдена' });
      }

      const teacherId = relation.rows[0].teacher_id;
      partner = await pool.query('SELECT id, name, surname, imagepath, datebirth, phone, google_meet_url FROM users WHERE id = $1', [teacherId]);

    } else if (role === 'teacher') {
      relation = await pool.query(
        'SELECT * FROM teacher_student_course WHERE teacher_id = $1 AND course_id = $2',
        [userId, courseId]
      );

      if (relation.rows.length === 0) {
        return res.status(404).json({ error: 'Связка не найдена' });
      }

      const studentId = relation.rows[0].student_id;
      partner = await pool.query('SELECT id, name, surname, imagepath, datebirth, phone FROM users WHERE id = $1', [studentId]);

    } else {
      return res.status(403).json({ error: 'Недопустимая роль пользователя' });
    }

    res.json({
      course: course.rows[0],
      partner: partner.rows[0]
    });

  } catch (err) {
    console.error('Ошибка при получении данных:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// #endregion


// #region Courses API
app.post('/api/upload-icon/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const newFilePath = `/uploads/${req.file.filename}`;

  try {
    if (id)
    {
      const userResult = await pool.query("SELECT course_icon_path FROM courses WHERE id = $1", [id]);

      if (userResult.rows.length > 0) {
        const oldPath = userResult.rows[0].course_icon_path;
  
        if (oldPath && fs.existsSync(path.join(dirname, oldPath))) {
          fs.unlinkSync(path.join(dirname, oldPath));
        }
      }
  
      const updateResult = await pool.query("UPDATE courses SET course_icon_path = $1 WHERE id = $2", [newFilePath, id]);
  
      if (updateResult.rowCount === 0) {
        return res.status(500).json({ error: "Изображение не загружено" });
      }  
    }

    res.json({ message: "Изображение загружено!", imagePath: newFilePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при загрузке изображения" });
  }
});


app.get('/api/courses', async (req, res) => {
  try {
    const courseResult = await pool.query("SELECT * FROM courses");
    const courses = courseResult.rows;

    const lessonsResult = await pool.query("SELECT * FROM lessons");
    const lessons = lessonsResult.rows;

    const linksResult = await pool.query("SELECT * FROM course_links");
    const links = linksResult.rows;

    const courseLessonsMap = {};
    for (const lesson of lessons) {
      if (!courseLessonsMap[lesson.course_id]) {
        courseLessonsMap[lesson.course_id] = [];
      }
      courseLessonsMap[lesson.course_id].push({
        id: lesson.id,
        title: lesson.title,
        video: lesson.video_url,
        description: lesson.description
      });
    }

    const courseLinksMap = {};
    for (const link of links) {
      if (!courseLinksMap[link.course_id]) {
        courseLinksMap[link.course_id] = [];
      }
      courseLinksMap[link.course_id].push({
        id: link.id,
        title: link.title,
        url: link.url
      });
    }

    const coursesWithData = courses.map(course => ({
      ...course,
      lessons: courseLessonsMap[course.id] || [],
      links: courseLinksMap[course.id] || []
    }));

    res.status(200).json({ courses: coursesWithData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.post('/api/courses', async (req, res) => {
  const { name, duration, description, lessons = [], course_icon_path, links = [] } = req.body;

  try {
    const courseResult = await pool.query(
      `INSERT INTO courses (name, duration, description, course_icon_path)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, duration, description, course_icon_path]
    );
    const courseId = courseResult.rows[0].id;

    for (const lesson of lessons) {
      await pool.query(
        `INSERT INTO lessons (course_id, title, video_url, description)
         VALUES ($1, $2, $3, $4)`,
        [courseId, lesson.title, lesson.video || null, lesson.description || '']
      );
    }

    for (const link of links) {
      await pool.query(
        `INSERT INTO course_links (course_id, title, url)
         VALUES ($1, $2, $3)`,
        [courseId, link.title, link.url]
      );
    }

    res.status(201).json({ message: 'Курс создан' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при создании курса' });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  const { name, duration, description, lessons = [], links = [], course_icon_path } = req.body;
  const courseId = req.params.id;

  try {
    await pool.query(
      `UPDATE courses SET name = $1, duration = $2, description = $3, course_icon_path = $4 WHERE id = $5`,
      [name, duration, description, course_icon_path, courseId]
    );

    await pool.query(`DELETE FROM lessons WHERE course_id = $1`, [courseId]);

    for (const lesson of lessons) {
      await pool.query(
        `INSERT INTO lessons (course_id, title, video_url, description)
         VALUES ($1, $2, $3, $4)`,
        [courseId, lesson.title, lesson.video || null, lesson.description || '']
      );
    }

    await pool.query(`DELETE FROM course_links WHERE course_id = $1`, [courseId]);

    for (const link of links) {
      await pool.query(
        `INSERT INTO course_links (course_id, title, url)
         VALUES ($1, $2, $3)`,
        [courseId, link.title, link.url]
      );
    }

    res.json({ message: 'Курс обновлён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при обновлении курса' });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const lessonsResult = await pool.query(
      `SELECT video_url FROM lessons WHERE course_id = $1`,
      [id]
    );

    const lessons = lessonsResult.rows;
    for (const lesson of lessons) {
      if (lesson.video_url) {
        const videoPath = path.join(dirname, "uploads/videos", lesson.video_url);
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }
      }
    }

    await pool.query(`DELETE FROM lessons WHERE course_id = $1`, [id]);
    await pool.query(`DELETE FROM courses WHERE id = $1`, [id]);
    res.status(200).json({ message: 'Курс и его уроки успешно удалены' });
  } catch (err) {
    console.error('Ошибка при удалении курса:', err);
    res.status(500).json({ error: 'Ошибка сервера при удалении курса' });
  }
});

app.delete('/api/lessons/:id', async (req, res) => {
  const lessonId = req.params.id;
  try {
    const lessonRes = await pool.query(`SELECT video_url FROM lessons WHERE id = $1`, [lessonId]);
    const lesson = lessonRes.rows[0];

    if (lesson && lesson.video_url) {
      const filePath = path.join(dirname, "uploads/videos", lesson.video_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await pool.query(`DELETE FROM lessons WHERE id = $1`, [lessonId]);

    res.json({ message: 'Урок удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении урока' });
  }
});

app.get('/api/user/:id/courses', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.duration,
        c.course_icon_path,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', l.id,
              'title', l.title,
              'video', l.video_url,
              'description', l.description
            )
          ) FILTER (WHERE l.id IS NOT NULL), 
          '[]'
        ) AS lessons,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', cl.id,
              'title', cl.title,
              'url', cl.url
            )
          ) FILTER (WHERE cl.id IS NOT NULL),
          '[]'
        ) AS links
      FROM user_courses uc
      JOIN courses c ON c.id = uc.course_id
      LEFT JOIN lessons l ON l.course_id = c.id
      LEFT JOIN course_links cl ON cl.course_id = c.id
      WHERE uc.user_id = $1
      GROUP BY c.id
    `, [id]);

    res.json({ courses: result.rows });
  } catch (err) {
    console.error('Ошибка при получении курсов пользователя:', err);
    res.status(500).json({ message: 'Ошибка сервера при получении курсов пользователя' });
  }
});

app.post('/api/user/:id/courses', async (req, res) => {
  const { id } = req.params;
  const { courseId } = req.body;

  await pool.query(`
    INSERT INTO user_courses (user_id, course_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `, [id, courseId]);

  res.status(200).json({ message: 'Курс добавлен' });
});

app.delete('/api/user/:id/courses/:courseId', async (req, res) => {
  const { id, courseId } = req.params;

  await pool.query(`
    DELETE FROM user_courses
    WHERE user_id = $1 AND course_id = $2
  `, [id, courseId]);

  res.status(200).json({ message: 'Курс удален' });
});

app.post('/api/video', uploadVideo.single('video'), (req, res) => {
  res.json({ path: req.file.filename });
});

app.delete('/api/video', (req, res) => {
  const {lesson} = req.body;

  if (lesson && lesson.video) {
    const filePath = path.join(dirname, "uploads/videos", lesson.video);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  res.status(200).json({ message: 'Все видео удалены' });
});

app.get('/:courseId/links', async (req, res) => {
  const { courseId } = req.params;
  const links = await pool.query('SELECT * FROM course_links WHERE course_id = $1', [courseId]);
  res.json(links.rows);
});

app.post('/:courseId/links', async (req, res) => {
  const { courseId } = req.params;
  const { title, url, description } = req.body;
  await pool.query(
    'INSERT INTO course_links (course_id, title, url, description) VALUES ($1, $2, $3, $4)',
    [courseId, title, url, description]
  );
  res.sendStatus(201);
});

app.delete('/:courseId/links/:linkId', async (req, res) => {
  const { linkId } = req.params;
  await pool.query('DELETE FROM course_links WHERE id = $1', [linkId]);
  res.sendStatus(204);
});

app.get('/:courseId/:userId/links', async (req, res) => {
  const { courseId, userId } = req.params;
  const links = await pool.query(
    'SELECT * FROM user_course_links WHERE course_id = $1 AND user_id = $2',
    [courseId, userId]
  );
  res.json(links.rows);
});

app.post('/:courseId/:userId/links', async (req, res) => {
  const { courseId, userId } = req.params;
  const { title, url, description, partner_id } = req.body;
  await pool.query(
    `INSERT INTO user_course_links (course_id, user_id, partner_id, title, url, description)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [courseId, userId, partner_id || null, title, url, description]
  );
  res.sendStatus(201);
});

app.delete('/:courseId/:userId/links/:linkId', async (req, res) => {
  const { linkId } = req.params;
  await pool.query('DELETE FROM user_course_links WHERE id = $1', [linkId]);
  res.sendStatus(204);
});

// #endregion

httpsServer.listen(PORT);
