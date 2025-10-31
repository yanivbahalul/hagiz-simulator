# 🚀 מדריך פריסה ל-Render

## תוכן עניינים
1. [הכנת הפרויקט](#הכנת-הפרויקט)
2. [פריסה ל-Render](#פריסה-ל-render)
3. [בדיקת הפריסה](#בדיקת-הפריסה)
4. [פתרון בעיות נפוצות](#פתרון-בעיות-נפוצות)

---

## הכנת הפרויקט

### 1. העלאת הקוד ל-GitHub/GitLab

אם עדיין לא העלית את הקוד:

```bash
# יצירת repository ב-GitHub
# לך ל-GitHub → New Repository → hagiz-simulator

# העלאת הקוד
git init
git add .
git commit -m "Ready for Render deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hagiz-simulator.git
git push -u origin main
```

### 2. בדיקת הקבצים הנדרשים

וודא שהקבצים הבאים קיימים בפרויקט:
- ✅ `Dockerfile` - הגדרות Docker
- ✅ `render.yaml` - תצורת Render
- ✅ `.dockerignore` - קבצים להתעלם
- ✅ `package.json` - תלויות Node.js
- ✅ `server.js` - שרת מעודכן עם PORT

---

## פריסה ל-Render

### שיטה 1: פריסה אוטומטית (מומלץ)

1. **גש ל-Render Dashboard**
   - היכנס ל-[Render](https://dashboard.render.com/)
   - לחץ על **"New +"** → **"Web Service"**

2. **חבר את ה-Repository**
   - בחר **"Connect a repository"**
   - אשר את GitHub/GitLab
   - בחר את `hagiz-simulator` repository

3. **תצורה אוטומטית**
   - Render יזהה את `render.yaml` ו-`Dockerfile` אוטומטית
   - לחץ **"Create Web Service"**
   - ⏳ המתן 3-5 דקות לבנייה ופריסה

4. **סיום!**
   - קבל URL ייחודי: `https://hagiz-simulator-XXXX.onrender.com`
   - האפליקציה זמינה! 🎉

### שיטה 2: תצורה ידנית

אם השיטה האוטומטית לא עובדת:

1. **יצירת Web Service**
   - Dashboard → **"New +"** → **"Web Service"**

2. **בחר Repository**
   - חבר את הקוד שלך

3. **הגדרות:**
   ```
   Name: hagiz-simulator
   Region: Frankfurt (או כל אזור קרוב)
   Branch: main
   Environment: Docker
   
   Build Command: (השאר ריק)
   Start Command: (השאר ריק)
   
   Instance Type: Free (או Starter)
   ```

4. **שמור ופרוס**
   - לחץ **"Create Web Service"**

---

## בדיקת הפריסה

### בדיקה ראשונית
לאחר הפריסה, בדוק את הקישורים הבאים:

```
https://YOUR-APP.onrender.com/
https://YOUR-APP.onrender.com/api/random-question
https://YOUR-APP.onrender.com/api/rescan-images
```

### בדיקת Logs
אם משהו לא עובד:
1. Dashboard → Your Service → **"Logs"**
2. חפש הודעות שגיאה
3. וודא שהשרת מאזין על `0.0.0.0:PORT`

---

## פתרון בעיות נפוצות

### 🔴 בעיה: "Application failed to respond"
**פתרון:**
- וודא ש-`server.js` משתמש ב-`process.env.PORT`
- בדוק ש-server מאזין על `0.0.0.0` ולא רק `localhost`

### 🔴 בעיה: "Build failed"
**פתרון:**
```bash
# בדוק מקומית:
docker build -t hagiz-simulator .
docker run -p 3000:3000 hagiz-simulator
```

### 🔴 בעיה: אין תמונות
**פתרון:**
- התמונות צריכות להיות ב-repository ב-`/images`
- וודא שהתיקייה `images/` דחופה ל-Git:
```bash
git add images/
git commit -m "Add images"
git push
```

### 🔴 בעיה: האתר איטי בטעינה הראשונה
**תשובה:**
- זה תקין! ב-Free tier, Render מכבה את השרת אחרי חוסר פעילות
- טעינה ראשונה לוקחת 30-60 שניות
- שדרוג ל-Starter plan ($7/חודש) שומר את השרת פעיל

### 🔴 בעיה: השינויים לא מתעדכנים
**פתרון:**
```bash
# דחוף עדכונים:
git add .
git commit -m "Update code"
git push

# Render יבנה מחדש אוטומטית
```

---

## תכונות נוספות

### הוספת Domain מותאם
1. Dashboard → Service → **"Settings"**
2. גלול ל-**"Custom Domains"**
3. הוסף את ה-domain שלך
4. עדכן DNS records

### הגדרת Environment Variables
1. Dashboard → Service → **"Environment"**
2. הוסף משתנים:
   ```
   NODE_ENV=production
   ```

### Persistent Storage (אופציונלי)
אם אתה רוצה שהתמונות ישמרו בין deployments:
1. Dashboard → **"New +"** → **"Disk"**
2. צור Disk בגודל 1GB
3. Mount ל-`/app/images`

---

## סיכום

✅ הפרויקט מוכן ל-Render  
✅ Docker מוגדר ומותאם  
✅ יכול לרוץ על Free tier  
✅ עדכונים אוטומטיים מ-Git  

**URL לאחר פריסה:**  
`https://hagiz-simulator-XXXX.onrender.com`

בהצלחה! 🚀

