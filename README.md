# 📚 Backend для хранения документации

## 📝 Описание проекта
Этот проект представляет собой API для хранения и управления документацией. Реализована поддержка статей с Markdown-разметкой, категорий, тегов и изображений.

## 🚀 Технологии
- **Node.js** (Express.js)
- **MongoDB** (Mongoose ODM)
- **JWT аутентификация** (Bcrypt)

## 📂 Структура базы данных
![manuscript](https://github.com/user-attachments/assets/fef7b2f2-26fa-4832-8ebc-229512be8a5f)


## 🔧 Установка и запуск
### 1️⃣ Клонирование репозитория
```bash
git clone https://github.com/mindlss/manuscript.git
cd manuscript
```
### 2️⃣ Установка зависимостей
```bash
npm install
```
### 3️⃣ Запуск сервера
Запуск в режиме разработки:
```bash
npm run dev
```
Запуск в продакшн-режиме:
```bash
npm start
```

## 📌 API эндпоинты
### 🔹 Статьи

| Метод  | URL                        | Описание                       | Защита  |
|--------|----------------------------|--------------------------------|---------|
| `POST` | `/articles/`               | Создать статью                 | ✅ JWT  |
| `GET`  | `/articles/:articleId`     | Получить статью по ID          | ❌      |
| `GET`  | `/articles/`               | Получить список статей         | ❌      |
| `PATCH`| `/articles/:articleId`     | Обновить статью                | ✅ JWT  |
| `DELETE`| `/articles/:articleId`    | Удалить статью                 | ✅ JWT  |
| `PATCH`| `/articles/:articleId/reorder` | Изменить позицию статьи   | ✅ JWT  |

<details>
<summary>📄 Подробнее</summary>

## 🔹 Описание API

### 📌 Создание статьи (`POST /articles/`)

Создает новую статью. Если не указана категория, она будет помещена в "uncategorized".  
**Обязательные поля:** `title`, `content`.  
**Защита:** Требуется JWT токен.

**Пример тела запроса:**
```json
{
  "title": "myArticle",
  "category": "67bb6397ccdfe21a4a4d79cc",
  "content": "Article text content",
  "images": ["67bb0d5e3661b205d38f3ac8"],
  "tags": ["67bb60e0f184a9e9d4871c98"]
}
```

### 📌 Получение статьи (`GET /articles/:articleId`)

Возвращает статью по `articleId` с популяцией связанных данных (`category`, `author`, `images`, `tags`).  
**Защита:** Отсутствует.

**Пример ответа:**
```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "title": "Article Title",
  "category": {
    "_id": "60d0fe4f5311236168a109cb",
    "name": "Technology"
  },
  "author": {
    "_id": "60d0fe4f5311236168a109cc",
    "username": "john_doe"
  },
  "images": [],
  "tags": ["tech", "innovation"]
}
```

### 📌 Получение списка статей (`GET /articles/`)

Возвращает список всех статей, сгруппированных по категориям.  
**Защита:** Отсутствует.

**Пример ответа:**
```json
{
    "Uncategorized": {
        "description": "Articles without category",
        "position": 0,
        "articles": [
            {
                "_id": "67bb61d4f184a9e9d4871c9e",
                "title": "article1",
                "position": 1
            }
        ]
    },
    "myCategory": {
        "description": "Description of my category",
        "position": 1,
        "articles": [
            {
                "_id": "67bb63bbccdfe21a4a4d79cf",
                "title": "article2",
                "position": 1
            },
            {
                "_id": "67bb62bfcgdg22ydjs337dgf",
                "title": "article3",
                "position": 2
            }
        ]
    }
}
```

### 📌 Обновление статьи (`PATCH /articles/:articleId`)

Обновляет статью по `articleId`.  
**Защита:** Требуется JWT токен.

**Пример тела запроса:**
```json
{
  "title": "Updated Article Title",
  "category": "60d0fe4f5311236168a109cd"
}
```

### 📌 Удаление статьи (`DELETE /articles/:articleId`)

Удаляет статью и корректирует позиции оставшихся статей в категории.  
**Защита:** Требуется JWT токен.

**Пример ответа:**
```json
{
  "message": "The article has been removed and the order has been updated"
}
```

### 📌 Изменение позиции статьи (`PATCH /articles/:articleId/reorder`)

Меняет порядок статьи внутри категории. Если указанная позиция некорректна, выдаст ошибку.  
**Защита:** Требуется JWT токен.

**Пример тела запроса:**
```json
{
  "newPosition": 2
}
```

</details>

### 🔹 Категории

| Метод  | URL                          | Описание                                        | Защита   |
|--------|------------------------------|-------------------------------------------------|----------|
| `GET`  | `/categories`                | Получить все категории                         | ❌       |
| `GET`  | `/categories/:categoryId`            | Получить категорию по ID                       | ❌       |
| `POST` | `/categories`                | Создать категорию                              | ✅ JWT   |
| `PATCH`| `/categories/:categoryId`            | Обновить категорию                             | ✅ JWT   |
| `DELETE`| `/categories/:categoryId`           | Удалить категорию                              | ✅ JWT   |
| `PATCH`| `/categories/:categoryId/reorder`    | Переместить категорию (изменение позиции)      | ✅ JWT   |

<details>
<summary>📄 Подробнее</summary>

## 🔹 Описание API

### 📌 Получить все категории (`GET /categories`)

Возвращает список всех категорий.  
**Требуется:** Нет.  
**Защита:** Отсутствует.

**Пример запроса:**
```bash
GET /categories
```

**Пример ответа:**
```json
[
  {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "Category 1",
    "description": "Description for category 1",
    "position": 1
  },
  {
    "_id": "60d0fe4f5311236168a109cb",
    "name": "Category 2",
    "description": "Description for category 2",
    "position": 2
  }
]
```

### 📌 Получить категорию по ID (`GET /categories/:categoryId`)

Возвращает информацию о категории по ID.  
**Требуется:** ID категории в параметрах URL.  
**Защита:** Отсутствует.

**Пример запроса:**
```bash
GET /categories/60d0fe4f5311236168a109ca
```

**Пример ответа:**
```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "name": "Category 1",
  "description": "Description for category 1",
  "position": 1
}
```

### 📌 Создать категорию (`POST /categories`)

Создает новую категорию. Для создания требуется передать название категории и описание.  
**Требуется:** Поля `name`, `description`.  
**Защита:** JWT токен в заголовке.

**Пример запроса:**
```bash
POST /categories
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
{
  "name": "New Category",
  "description": "Description for new category"
}
```

**Пример ответа:**
```json
{
  "_id": "60d0fe4f5311236168a109cc",
  "name": "New Category",
  "description": "Description for new category",
  "position": 3
}
```

### 📌 Обновить категорию (`PATCH /categories/:categoryId`)

Обновляет категорию по ID.  
**Требуется:** ID категории в параметрах URL.  
**Защита:** JWT токен в заголовке.

**Пример запроса:**
```bash
PATCH /categories/60d0fe4f5311236168a109ca
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
{
  "name": "Updated Category",
  "description": "Updated description"
}
```

**Пример ответа:**
```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "name": "Updated Category",
  "description": "Updated description",
  "position": 1
}
```

### 📌 Удалить категорию (`DELETE /categories/:categoryId`)

Удаляет категорию по ID. После удаления пересчитываются позиции категорий.  
**Требуется:** ID категории в параметрах URL.  
**Защита:** JWT токен в заголовке.

**Пример запроса:**
```bash
DELETE /categories/60d0fe4f5311236168a109ca
Authorization: Bearer your_jwt_token_here
```

**Пример ответа:**
```json
{
  "message": "Category deleted"
}
```

### 📌 Переместить категорию (`PATCH /categories/:categoryId/reorder`)

Изменяет позицию категории. Для этого требуется новый номер позиции.  
**Требуется:** ID категории в параметрах URL, новое значение позиции в теле запроса.  
**Защита:** JWT токен в заголовке.

**Пример запроса:**
```bash
PATCH /categories/60d0fe4f5311236168a109ca/reorder
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
{
  "newPosition": 2
}
```

**Пример ответа:**
```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "name": "Updated Category",
  "description": "Updated description",
  "position": 2
}
```

</details>

### 🔹 Теги

| Метод  | URL                        | Описание                       | Защита  |
|--------|----------------------------|--------------------------------|---------|
| `GET`  | `/tags/`                   | Получить список тегов          | ❌      |
| `POST` | `/tags/`                   | Создать тег                    | ✅ JWT  |
| `DELETE`| `/tags/:id`               | Удалить тег по ID              | ✅ JWT  |

<details>
<summary>📄 Подробнее</summary>

## 🔹 Описание API

### 📌 Получение списка тегов (`GET /tags/`)

Возвращает список всех тегов.  
**Защита:** Отсутствует.

**Пример ответа:**
```json
[
  {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "Tech",
    "content": "Articles about technology"
  },
  {
    "_id": "60d0fe4f5311236168a109cb",
    "name": "Science",
    "content": "Articles about science"
  }
]
```

### 📌 Создание тега (`POST /tags/`)

Создает новый тег.  
**Защита:** Требуется JWT токен.

**Пример тела запроса:**
```json
{
  "name": "Tech",
  "content": "Articles about technology"
}
```

### 📌 Удаление тега по ID (`DELETE /tags/:id`)

Удаляет тег по `id`.  
**Защита:** Требуется JWT токен.

**Пример ответа:**
```json
{
  "message": "Tag deleted"
}
```

</details>

### 🔹 Изображения

| Метод  | URL                        | Описание                       | Защита  |
|--------|----------------------------|--------------------------------|---------|
| `POST` | `/images/upload`           | Загрузить изображение          | ✅ JWT  |
| `GET`  | `/images/`                 | Получить все изображения       | ❌      |
| `DELETE`| `/images/:id`             | Удалить изображение по ID      | ✅ JWT  |

<details>
<summary>📄 Подробнее</summary>

## 🔹 Описание API

### 📌 Загрузка изображения (`POST /images/upload`)

Загружает изображение. Файл отправляется в теле запроса.  
**Требуется поле:** `image` (файл).  
**Защита:** Требуется JWT токен.

**Пример запроса:**
```bash
POST /images/upload
Content-Type: multipart/form-data
image: [file]
```

**Пример ответа:**
```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "name": "example.jpg",
  "url": "/uploads/1632899456000-example.jpg"
}
```

### 📌 Получение всех изображений (`GET /images/`)

Возвращает список всех изображений.  
**Защита:** Отсутствует.

**Пример ответа:**
```json
[
  {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "example.jpg",
    "url": "/uploads/1632899456000-example.jpg"
  },
  {
    "_id": "60d0fe4f5311236168a109cb",
    "name": "another_image.png",
    "url": "/uploads/1632899456001-another_image.png"
  }
]
```

### 📌 Удаление изображения по ID (`DELETE /images/:id`)

Удаляет изображение по `id`.  
**Защита:** Требуется JWT токен.

**Пример ответа:**
```json
{
  "message": "Image deleted"
}
```

</details>

### 🔹 Пользователи

| Метод  | URL                        | Описание                       | Защита  |
|--------|----------------------------|--------------------------------|---------|
| `POST` | `/users/register`          | Регистрация пользователя       | ❌      |
| `POST` | `/users/login`             | Вход пользователя              | ❌      |
| `GET`  | `/users/user`              | Получение информации о пользователе | ✅ JWT  |

<details>
<summary>📄 Подробнее</summary>

## 🔹 Описание API

### 📌 Регистрация пользователя (`POST /users/register`)

Регистрирует нового пользователя. Для регистрации требуется передать имя пользователя и пароль.  
**Требуется поле:** `username`, `password`.  
**Защита:** Отсутствует.

**Пример запроса:**
```bash
POST /users/register
Content-Type: application/json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Пример ответа:**
```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "username": "john_doe"
}
```

### 📌 Вход пользователя (`POST /users/login`)

Выполняет аутентификацию пользователя, возвращая JWT токен.  
**Требуется поле:** `username`, `password`.  
**Защита:** Отсутствует.

**Пример запроса:**
```bash
POST /users/login
Content-Type: application/json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Пример ответа:**
```json
{
  "token": "your_jwt_token_here"
}
```

### 📌 Получение информации о пользователе (`GET /users/user`)

Получает информацию о текущем пользователе, для этого требуется передать JWT токен в заголовках.  
**Требуется:** JWT токен в заголовке `Authorization: Bearer <token>`.  
**Защита:** JWT токен обязательный.

**Пример запроса:**
```bash
GET /users/user
Authorization: Bearer your_jwt_token_here
```

**Пример ответа:**
```json
{
  "_id": "60d0fe4f5311236168a109ca",
  "username": "john_doe"
}
```

</details>

## 🛠 Переменные окружения
Файл `.env`:
```ini
PORT=3000
MONGO_URI=mongodb://localhost:27017/documentation
JWT_SECRET=your_jwt_secret
```

## 📜 Лицензия (license)
This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.

