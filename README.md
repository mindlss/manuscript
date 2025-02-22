# 📚 Backend для хранения документации

## 📝 Описание проекта
Этот проект представляет собой API для хранения и управления документацией. Реализована поддержка статей с Markdown-разметкой, категорий, тегов и изображений.

## 🚀 Технологии
- **Node.js** (Express.js)
- **MongoDB** (Mongoose ODM)
- **JWT аутентификация**

## 📂 Структура базы данных
![manuscript](https://github.com/user-attachments/assets/fef7b2f2-26fa-4832-8ebc-229512be8a5f)


## 🔧 Установка и запуск
### 1️⃣ Клонирование репозитория
```bash
git clone https://github.com/your-repo/documentation-backend.git
cd documentation-backend
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
| Метод | URL | Описание |
|---|---|---|
| `POST` | `/articles` | Создать статью |
| `GET` | `/articles/:id` | Получить статью по ID |
| `GET` | `/articles` | Получить список статей |
| `PATCH` | `/articles/:id` | Обновить статью |
| `DELETE` | `/articles/:id` | Удалить статью |

### 🔹 Категории
| Метод | URL | Описание |
|---|---|---|
| `GET` | `/categories` | Получить список категорий |
| `POST` | `/categories` | Создать категорию |
| `PATCH` | `/categories/:id` | Обновить категорию |
| `DELETE` | `/categories/:id` | Удалить категорию |

### 🔹 Теги
| Метод | URL | Описание |
|---|---|---|
| `GET` | `/tags` | Получить список тегов |
| `POST` | `/tags` | Создать тег |
| `DELETE` | `/tags/:id` | Удалить тег |

### 🔹 Авторизация
| Метод | URL | Описание |
|---|---|---|
| `POST` | `/auth/register` | Регистрация |
| `POST` | `/auth/login` | Вход по паролю |
| `POST` | `/auth/logout` | Завершение сессии |
| `GET` | `/auth/user` | Получить информацию о пользователе |

## 🛠 Переменные окружения
Файл `.env`:
```ini
PORT=3000
MONGO_URI=mongodb://localhost:27017/documentation
JWT_SECRET=your_jwt_secret
```

## 📜 Лицензия (license)
This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License.

