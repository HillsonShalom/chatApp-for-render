import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import jwt from 'jsonwebtoken'
import path from 'path'
import { Token } from '../Tokem.model';

// הגדרת אופן שמירת הקבצים בתיקייה
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/images/')); // תיקיית היעד לשמירת הקבצים
  },
  filename: (req, file, cb) => {
    const token = req.headers.authorization?.split(' ')[1]; // הנחת פורמט 'Bearer <token>'
    if (!token) {
      return cb(new Error('Token is missing'), '');
    }
    try {
        // אימות הטוקן וחילוץ ה-ID
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as Token;
        const fileExtension = file.originalname.split('.').pop(); // קבלת סיומת הקובץ
        const newFileName = `${decoded.user}.${fileExtension}`; // שם חדש לפי ה-ID
  
        cb(null, newFileName); // שינוי שם הקובץ
      } catch (error) {
        cb(new Error('Invalid token'), '');
      }
  }
});


export const upload = multer({storage})

