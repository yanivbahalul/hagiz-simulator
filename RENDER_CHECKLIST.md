# ✅ רשימת בדיקה לפריסה ב-Render

## לפני הפריסה

### 1. בדיקת קבצים
- [ ] `Dockerfile` קיים
- [ ] `render.yaml` קיים
- [ ] `.dockerignore` קיים
- [ ] `.gitignore` קיים
- [ ] `package.json` מעודכן
- [ ] `server.js` משתמש ב-`process.env.PORT`

### 2. בדיקת תיקיית images
- [ ] תיקייה `images/` קיימת
- [ ] יש בה לפחות 7 תמונות (סט אחד)
- [ ] שמות הקבצים תקינים (YYYYMMDD-Name-00.png וכו')

### 3. בדיקה מקומית
```bash
# התקנת תלויות
npm install

# הרצה מקומית
npm start

# בדיקה בדפדפן
# http://localhost:3000
```

### 4. בדיקת Docker מקומית
```bash
# בנייה
docker build -t hagiz-simulator .

# הרצה
docker run -p 3000:3000 hagiz-simulator

# בדיקה בדפדפן
# http://localhost:3000
```

### 5. העלאה ל-Git
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

---

## תהליך הפריסה ב-Render

### שלב 1: יצירת חשבון
- [ ] נרשמתי ל-[Render](https://render.com/)
- [ ] חיברתי את GitHub/GitLab

### שלב 2: יצירת Web Service
- [ ] Dashboard → "New +" → "Web Service"
- [ ] בחרתי את ה-repository הנכון
- [ ] Render זיהה את `render.yaml`

### שלב 3: הגדרות (אם ידני)
- [ ] **Name**: hagiz-simulator
- [ ] **Environment**: Docker
- [ ] **Region**: Frankfurt / Oregon / Singapore
- [ ] **Plan**: Free / Starter
- [ ] **Build Command**: (ריק)
- [ ] **Start Command**: (ריק)

### שלב 4: פריסה
- [ ] לחצתי "Create Web Service"
- [ ] חיכיתי לסיום הבנייה (3-5 דקות)
- [ ] קיבלתי URL: `https://XXXXX.onrender.com`

---

## בדיקה לאחר הפריסה

### בדיקות בסיסיות
- [ ] האתר נטען: `https://YOUR-APP.onrender.com/`
- [ ] API עובד: `https://YOUR-APP.onrender.com/api/random-question`
- [ ] יש שאלה עם תמונות
- [ ] ניתן לענות על שאלה
- [ ] כפתור Reset עובד

### בדיקת Logs
- [ ] Dashboard → Service → "Logs"
- [ ] רואה: "Server running on port XXXX"
- [ ] אין הודעות שגיאה באדום

### בדיקת Performance
- [ ] זמן טעינה ראשון: ____ שניות
- [ ] זמן טעינה שאלה חדשה: ____ שניות
- [ ] תמונות נטענות תקין

---

## פתרון בעיות

### אם הבנייה נכשלת
1. בדוק את ה-Logs ב-Render
2. בדוק שהבנייה עובדת מקומית:
   ```bash
   docker build -t test .
   ```
3. ודא שכל הקבצים נדחפו ל-Git:
   ```bash
   git status
   ```

### אם האתר לא עובד
1. בדוק Logs: Dashboard → Service → "Logs"
2. ודא ש-PORT נקרא נכון:
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```
3. ודא שהשרת מאזין על `0.0.0.0`:
   ```javascript
   app.listen(PORT, '0.0.0.0', ...)
   ```

### אם אין תמונות
1. ודא שהתיקייה `images/` ב-Git:
   ```bash
   git add images/
   git commit -m "Add images"
   git push
   ```
2. Redeploy ב-Render:
   - Dashboard → Service → "Manual Deploy" → "Deploy latest commit"

---

## שיפורים נוספים (אופציונלי)

### Custom Domain
- [ ] רכשתי domain
- [ ] הוספתי ב-Render: Settings → Custom Domains
- [ ] עדכנתי DNS records

### Environment Variables
- [ ] הגדרתי `NODE_ENV=production`
- [ ] הוספתי משתנים נוספים אם נדרש

### Monitoring
- [ ] בדקתי את "Metrics" ב-Render
- [ ] הגדרתי התראות (Starter plan)

### SSL Certificate
- [ ] Render יצר SSL אוטומטי (✅ תמיד)
- [ ] האתר נגיש ב-HTTPS

---

## סיכום סופי

✅ הפרויקט פרוס בהצלחה!  
✅ URL: `https://________________.onrender.com`  
✅ תאריך פריסה: __________  
✅ גרסה: __________  

---

## לינקים שימושיים

- 📊 [Render Dashboard](https://dashboard.render.com/)
- 📖 [Render Docs](https://render.com/docs)
- 🐛 [Render Status](https://status.render.com/)
- 💬 [Render Community](https://community.render.com/)

---

**זכור:** 
- Free tier נכבה אחרי 15 דקות חוסר פעילות
- טעינה ראשונה אחרי השבתה: 30-60 שניות
- שדרוג ל-Starter ($7/חודש) שומר את השרת פעיל 24/7

