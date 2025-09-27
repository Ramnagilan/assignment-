#######Python###########
# Create virtual environment
python -m venv venv

# Activate venv
# On Linux/Mac
source venv/bin/activate
# On Windows
venv\Scripts\activate

# Install Django + DRF + JWT
pip install -r requirements.txt


# Start project
django-admin startproject backend .

# Create app
python manage.py startapp notes

# Run backend
python manage.py runserver



#######React###########

# To create react project 
npx create-react-app notes-app

cd notes-app

# Install packags
npm install axios react-router-dom

# To Start Frontend 
npm start