# Flask Backend
## Dev Setup
### Installation
1. Create a virtual environment by running the command `python -m venv .venv`
2. Activate the virtual environment by running the command `venv/Scripts/activate`
    * you should see a `(.venv)` annotation on your terminal window next to the file path
    * now all of your `pip` installations will go to the virtual environment instead of your local computer
    * **Make sure you change the compiler in your IDE or editor to `./.venv/Scripts/python.exe` or else your `pip` installations will not be recognized**
3. Install project dependencies by running `pip install -r requirements.txt`

### Environment Variables
Create a file inside the `backend` folder called `.env` and place these variables inside it
```
SECRET_KEY=<Secret key for flask server> ->  Just use a password generator to fill this
DB_NAME=<Your database name. ex: database.db> -> used for sqlite
DB_CONNECTION=<Your postgres connection url> -> used for postgres
PORT=<Your port number of choice> -> optional field
```

### Running the boilerplate code
**Do this after installing dependencies and setting up environment variables**
1. Run the command `python run.py`
    * You should see a message such as this in the terminal: 
    ```
    WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
    Running on http://127.0.0.1:8080
    Press CTRL+C to quit
    Restarting with stat
    Debugger is active!
    Debugger PIN: 137-864-650    
    ```
    * You should also see a new folder called `instance` be created if it wasn't already (if using sqlite)
2. Navigate to the route `/api/hello` and you should see the following json:
```
{
    "message": "hello"
}
```

## Navigating the project
* Most of your code will be inside the `app` directory
* Within the `app` directory, you have four folders
    * `views` - where your routing logic will go
        * See: `Flask Blueprints`
    * `models` - where your SQLAlchemy models will go
        * See: `Flask SQLAlchemy`
    * `middleware` - where your middleware functions will go
        * may not be necessary for this project, but keep just in case
* If you want to create a new folder inside the `app` directory, make sure you add an empty `__init__.py` file inside it to tell your compiler that this is a python package directory
* When you run the Flask app for the first time, you should see a new folder named `instance`. Within this folder is your SQLite database. Deleting this folder will delete the database and force the app to create a new one when the app is rerun.
