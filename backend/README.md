# Flask Backend
## Dev Setup
### Installation
1. Navigate to the `backend` folder in the terminal
2. Create a virtual environment by running the command `python -m venv .venv`
3. Activate the virtual environment by running the command `.venv/Scripts/activate`
    * you should see a `(.venv)` annotation on your terminal window next to the file path
    * now all of your `pip` installations will go to the virtual environment instead of your local computer
    * **Make sure you change the compiler in your IDE or editor to `./.venv/Scripts/python.exe` or else your `pip` installations will not be recognized**
4. Install project dependencies by running `pip install -r requirements.txt`

### Environment Variables
Create a file inside the `backend` folder called `.env` and place these variables inside it
```
SECRET_KEY=<Secret key for flask server> ->  Just use a password generator to fill this
POSTGRES_CONNECTION_URI=<Your postgres connection url> -> used for postgres
PORT=<Your port number of choice> -> optional field
POSTGRES_DB_NAME=<Postgres DB Name>
POSTGRES_USER=<Postgres username>
POSTGRES_PASSWORD=<Postgres password>
POSTGRES_HOST=<Postgres host name>
POSTGRES_PORT=<Postgres port number>
```

### Inserting into the Database

#### Before doing this, make sure you
* have Postgres on your computer
* your database credentials are inside the `.env` file
* you have created all the necessary tables inside your database
* you have installed all dependencies for the backend inside the virtual environment

#### Script to create tables
```
CREATE TABLE manga (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    alternate_names VARCHAR(200),
    authors VARCHAR(200),
    genres VARCHAR(200),
    description TEXT,
    status VARCHAR(100),
    total_chapters INTEGER,
    banner_image VARCHAR(500),
    cover_image VARCHAR(500)
);

CREATE TABLE chapter (
    id SERIAL PRIMARY KEY,
    manga_id INTEGER NOT NULL,
    link VARCHAR(500) NOT NULL,
    chapter_number FLOAT NOT NULL,
    FOREIGN KEY (manga_id) REFERENCES manga(id)
);

CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    manga_id INTEGER NOT NULL,
    chapter_number INTEGER NOT NULL,
    scan_url VARCHAR(500) NOT NULL,
    page_number INTEGER NOT NULL,
    FOREIGN KEY (manga_id) REFERENCES manga(id)
);
```

#### Instructions

1. Navigate your terminal to the `scripts` folder inside the `backend`
2. Run the angular_spider script inside the scripts folder using scrapy -> ex: `scrapy runspider angular_spider.py`
    * You should see a new .txt file named `manga_data.txt` inside the scripts folder once this script is finished
3. Navigate back to the backend folder and run `python insert.py` to insert the data from the .txt file into your database
