from .. import db

class Manga(db.Model):
    __tablename__ = 'manga' # Make sure you have this field on every model and make it match up to a table with the same name and fields
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    alternate_names = db.Column(db.String(200))
    authors = db.Column(db.String(200))
    genres = db.Column(db.String(200))
    description = db.Column(db.Text)
    status = db.Column(db.String(100))
    total_chapters = db.Column(db.Integer)
    banner_image = db.Column(db.String(500))

    # This class does not have an attribute called self.__dict__
    def __repr__(self):
        return f"Manga('{self.__dict__}')"
    
    # This class method written below may not be necessary now that we have a separate database
    # @classmethod
    # def insert_from_text(cls, file_path):
    #     with open(file_path, 'r') as file:
    #         entries = file.read().split('\n\n')  # Split entries by empty lines

    #         for entry in entries:
    #             manga_data = {}
    #             lines = entry.strip().split('\n')  # Split entry by lines

    #             for line in lines:
    #                 if ': ' in line:  # Check if the line contains ': '
    #                     key, value = line.split(': ', 1)  # Split each line by ': ' and get key-value pair
    #                     key = key.lower().replace(' ', '_')  # Convert key to lowercase and replace spaces with underscores
    #                     manga_data[key] = value
    #                 else:
    #                     # Handle lines that don't contain ': ', maybe log a warning or skip them
    #                     pass

    #             # Create Manga object and insert into database
    #             manga = cls(
    #                 title=manga_data.get('title'),
    #                 alternate_names=manga_data.get('alternate_names'),
    #                 authors=manga_data.get('author(s)'),
    #                 genres=manga_data.get('genre'),
    #                 description=manga_data.get('description'),
    #                 status=manga_data.get('status'),
    #                 total_chapters=manga_data.get('total_chapters'),
    #                 banner_image=manga_data.get('banner_image')
    #             )
    #             db.session.add(manga)
    #     db.session.commit()

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'alternate_names': self.alternate_names,
            'authors': self.authors,
            'genres': self.genres,
            'description': self.description,
            'status': self.status,
            'total_chapters': self.total_chapters,
            'banner_image': self.banner_image
        }
