from .. import db
from sqlalchemy import Enum
import enum


# class ChapterStates(enum.Enum):
#     unprocessed = 'unprocessed'
#     processing = 'processing'
#     processed = 'processed'
#     error = 'error'


class Chapter(db.Model):
    __tablename__ = 'chapter'
    id = db.Column(db.Integer, primary_key=True)
    manga_id = db.Column(db.Integer, db.ForeignKey('manga.id'), nullable=False)
    link = db.Column(db.String(500), nullable=False)
    chapter_name = db.Column(db.String(500), nullable=False)
    chapter_number = db.Column(db.Float, nullable=False)
    is_processing = db.Column(db.Boolean, default=False)
    # chapter_state = db.Column(Enum(ChapterStates, name="chapter_states"), nullable=False, default=ChapterStates.unprocessed)

    def __repr__(self):
        return f"Chapter('{self.link}')"
    
    def to_dict(self):
        return {
        'id': self.id,
        'manga_id': self.manga_id,
        'link': self.link,
        'chapter_name': self.chapter_name,
        'chapter_number': self.chapter_number,
        #'chapter_state': self.chapter_state.value
        'is_processing':self.is_processing,
    }