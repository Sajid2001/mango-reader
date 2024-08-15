<div style="display: flex; align-items: center; justify-content:center;">
  <img src="https://github.com/user-attachments/assets/a091071c-4992-4a6e-a0aa-9fa0b60479c6" alt="Mango Reader" style="height: 200px;">
  <h1 style="font-size:48px">Mango Reader</h1>
</div>

## What is Mango Reader?

Mango Reader is an attempt to recreate popular manga reading applications such as Tachiyomi (Rest in Peace) and Houdoku. Mango Reader is also an attempt to recreate manga extensions libraries. This project was made purely for educational purposes.

## Features

- Self host your own manga reading server
- Set your own custom reader settings
- Adjacent chapters load in the background
- Choose from multiple, fruit-based themes

## Roadmap

- [ ] AI Chat
- [ ] Save backups

## Tech Stack

- TypeScript
- React (Vite)
- Electron
- Redux
- TailwindCSS
- Python
- Flask
- Postgres
- Redis
- Celery
- Docker

## Setup

**You must have Docker installed on your computer**

1. In the terminal, open the backend folder inside this project and run `docker-compose up`
2. Wait for similar statements to the ones below to pop up in your terminal:

```
2024-08-15 16:17:30 web_c     | [2024-08-15 20:17:30 +0000] [1399] [INFO] Starting gunicorn 22.0.0
2024-08-15 16:17:30 web_c     | [2024-08-15 20:17:30 +0000] [1399] [INFO] Listening at: http://0.0.0.0:8000 (1399)
2024-08-15 16:17:30 web_c     | [2024-08-15 20:17:30 +0000] [1399] [INFO] Using worker: sync
2024-08-15 16:17:30 web_c     | [2024-08-15 20:17:30 +0000] [1400] [INFO] Booting worker with pid: 1400
2024-08-15 16:17:30 web_c     | [2024-08-15 20:17:30 +0000] [1401] [INFO] Booting worker with pid: 1401
2024-08-15 16:17:30 web_c     | [2024-08-15 20:17:30 +0000] [1402] [INFO] Booting worker with pid: 1402
2024-08-15 16:17:30 web_c     | [2024-08-15 20:17:30 +0000] [1403] [INFO] Booting worker with pid: 1403
```

3. In the terminal, open the desktop folder inside this project and run `npm install`
4. In the terminal, inside the desktop folder run `npm run dev`

**There are plans to move the desktop app into Docker later on.**

## Screenshots

![Library](https://github.com/user-attachments/assets/e28bc60e-04b2-4858-a64d-f9f049714d1c)

![Reader](https://github.com/user-attachments/assets/9212138f-bda8-4aa9-9d99-e27e8912756d)

## License and Attribution

This project is licensed under the MIT License. If you decide to fork this repository, we kindly ask that you give credit to the original creators by linking back to this repository.

### Attribution

Please include the following notice in your README or documentation if you use or modify this project:

This project is based on [MangoReader](https://github.com/Sajid2001/mango-reader), created by [Sajid2001](https://github.com/Sajid2001), [ChrisCaliendo](https://github.com/ChrisCaliendo), [DavidVettuchirayil](https://github.com/DavidVettuchirayil)

Thank you very much for acknowledging our work!
