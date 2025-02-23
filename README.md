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
| Метод | URL | Описание |
|---|---|---|
| `POST` | `/articles` | Создать статью |
| `GET` | `/articles/:id` | Получить статью по ID |
| `GET` | `/articles` | Получить список статей |
| `PATCH` | `/articles/:id` | Изменить статью |
| `PATCH` | `/articles/:id/reorder` | Смена позиции статьи |
| `DELETE` | `/articles/:id` | Удалить статью |

### 🔹 Категории
| Метод | URL | Описание |
|---|---|---|
| `GET` | `/categories` | Получить список категорий |
| `POST` | `/categories` | Создать категорию |
| `PATCH` | `/categories/:id` | Изменить категорию |
| `DELETE` | `/categories/:id` | Удалить категорию |

### 🔹 Теги
| Метод | URL | Описание |
|---|---|---|
| `GET` | `/tags` | Получить список тегов |
| `POST` | `/tags` | Создать тег |
| `DELETE` | `/tags/:id` | Удалить тег |

### 🔹 Изображения
| Метод | URL | Описание |
|---|---|---|
| `POST` | `/images/upload` | Загрузить изображение |
| `GET` | `/images` | Получить список изображений |
| `DELETE` | `/images/:id` | Удалить изображение |

### 🔹 Авторизация
| Метод | URL | Описание |
|---|---|---|
| `POST` | `/auth/register` | Регистрация |
| `POST` | `/auth/login` | Вход по паролю |
| `GET` | `/auth/user` | Получить информацию о пользователе |

## 🛠 Переменные окружения
Файл `.env`:
```ini
PORT=3000
MONGO_URI=mongodb://localhost:27017/documentation
JWT_SECRET=your_jwt_secret
```

## 📜 Лицензия (license)
This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.

