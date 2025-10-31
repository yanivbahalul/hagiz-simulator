# 🚀 התחלה מהירה - Hagiz Simulator

## אפשרות 1: פריסה מהירה ל-Render (5 דקות)

### צעדים:
1. **דחוף את הקוד ל-GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **פתח Render**
   - גש ל-https://dashboard.render.com/
   - לחץ "New +" → "Web Service"
   - בחר את ה-repository
   - לחץ "Create Web Service"

3. **סיום!**
   - המתן 3-5 דקות
   - קבל את ה-URL שלך
   - האתר חי! 🎉

---

## אפשרות 2: הרצה מקומית (2 דקות)

### עם Node.js:
```bash
npm install
npm start
```
פתח: http://localhost:3000

### עם Docker:
```bash
docker-compose up
```
פתח: http://localhost:3000

---

## אפשרות 3: בדיקת Docker לפני פריסה

### Windows:
```powershell
.\test-docker.ps1
```

### Mac/Linux:
```bash
chmod +x test-docker.sh
./test-docker.sh
```

---

## מה הלאה?

📖 **מדריך מפורט:** קרא את `DEPLOYMENT.md`  
✅ **רשימת בדיקה:** השתמש ב-`RENDER_CHECKLIST.md`  
🐛 **בעיות?** קרא את חלק "פתרון בעיות" ב-`DEPLOYMENT.md`

---

## פקודות שימושיות

```bash
# הרצה מקומית
npm start

# Docker - בנייה
npm run docker:build

# Docker - הרצה
npm run docker:run

# Docker Compose
npm run docker:up
npm run docker:down

# בדיקת status
docker ps
docker logs hagiz-simulator
```

---

## צריך עזרה?

1. בדוק את קובץ `DEPLOYMENT.md` לפרטים מלאים
2. בדוק את `RENDER_CHECKLIST.md` לרשימת בדיקה
3. חפש בעיות נפוצות ב-"פתרון בעיות"

**בהצלחה!** 🚀

