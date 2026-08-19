# 🚀 Ridexd.com — Hostinger Par Host Karne Ki Puri Guide (MySQL)

Yeh guide follow karke aap code download kar ke Hostinger par live kar sakte hain.
**Total time: ~20 minute.**

---

## STEP 0 — Code download karein

Poora project folder download karein (`.next`, `node_modules` aur `.env` chhor dein).
Zip ka structure kuch aisa hona chahiye:

```
ridexd/
├─ src/                 (poora Next.js code)
├─ mysql/schema.sql     ← Hostinger ki database mein import hoga
├─ scripts/use-mysql.mjs
├─ .env.example
├─ package.json
└─ HOSTINGER-DEPLOY.md
```

---

## STEP 1 — Hostinger par MySQL database banayein

1. **hPanel** → login → apna domain select karein
2. **Databases → MySQL Databases** par jayein
3. Naya database banayein:
   - **Database name:** `ridexd`  → Hostinger isay banaye ga `u123456789_ridexd`
   - **Database user:** `ridexd`  → banega `u123456789_ridexd`
   - **Password:** strong password (kahin save kar lein)
4. Database ban jane ke baad **phpMyAdmin** ka button dabayein → apni database select karein
5. **Import** tab → `mysql/schema.sql` file choose karein → **Go/Import**
   → 4 tables ban jayengi: `categories`, `products`, `orders`, `order_items`

> ✅ Products/categories khud seed ho jate hain — site pehli dafa khulne par
> 25 categories + 100 products automatic insert ho jate hain. Kuch manual karna nahi.

---

## STEP 2 — `.env` file banayein (root folder mein)

`.env.example` ko copy kar ke `.env` naam rakhein, phir yeh values bharein:

```env
# --- Hostinger MySQL ---
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=u123456789_ridexd
DB_USER=u123456789_ridexd
DB_PASSWORD=aapka_database_password

DATABASE_URL=mysql://u123456789_ridexd:aapka_database_password@127.0.0.1:3306/u123456789_ridexd

# --- Admin panel ---
ADMIN_PASSWORD=aapka_strong_admin_password
ADMIN_SECRET=koi_bhi_lamba_random_string_8f7s6d5f4g

# --- Store ---
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
NEXT_PUBLIC_SITE_URL=https://ridexd.com
```

⚠️ **Important:**
- `u123456789_` prefix Hostinger khud lagata hai — exactly wahi likhein jo phpMyAdmin mein nazar aata hai
- Password mein `@ : / #` ho to URL mein encode karein (`@` → `%40`, `:` → `%3A`, `/` → `%2F`)
- Host hamesha `127.0.0.1` (Hostinger shared hosting par remote connect allowed nahi)

---

## STEP 3 — MySQL mode ON karein (1 command)

Project folder mein terminal/SSH kholein:

```bash
node scripts/use-mysql.mjs
```

Ye command `src/db/schema.ts` aur `src/db/index.ts` ko MySQL (mysql2 driver) par switch kar deti hai.
Wapas PostgreSQL par lene ke liye: `node scripts/use-postgres.mjs`

---

## STEP 4 — Node.js app banayein (Hostinger)

### Option A — hPanel “Node.js” app (recommended, Business+ / Cloud plans)
1. **hPanel → Advanced → Node.js**
2. **Create application**:
   - Node version: **20.x ya 22.x**
   - Application root: `domains/ridexd.com/ridexd` (jahan code upload kiya)
   - Application URL: `ridexd.com`
   - Application startup file: `node_modules/next/dist/bin/next` + arguments `start`
3. **Upload code** (File Manager ya FTP) usi folder mein
4. **NPM install** button dabayein (ya SSH: `npm install --omit=dev=false`)
5. Terminal/SSH mein build karein:
   ```bash
   npm install
   npm run build
   ```
6. **Restart** application

### Option B — Shared hosting (Node.js app support na ho)
Sirf static export support hota hai — dynamic store (database + admin) ke liye
**VPS plan** ya Node.js support karne wala plan chahiye. Admin panel aur checkout
database use karte hain, is liye Node server zaroori hai.

---

## STEP 5 — Start command

Hostinger Node.js app mein **start command**:

```bash
npm run start
```

(ye `next start` chalata hai, default port `3000`)

Agar Hostinger `PORT` env deta hai to `next start -p $PORT` use karein.

---

## STEP 6 — Live check list

| Check | URL |
| --- | --- |
| Store | `https://ridexd.com` |
| 5 rotating banners (Women/Men/Kids/Bed/Bath) | home page |
| Admin panel | `https://ridexd.com/admin` → `ADMIN_PASSWORD` se login |
| Products CRUD | Admin → Products |
| Category CRUD | Admin → Categories |
| Order notification + delete | Admin → Orders |
| Health | `https://ridexd.com/api/health` → `{"ok":true}` |
| DB connection | Admin dashboard numbers aa rahe hain = DB connected ✅ |

---

## Common Problems (troubleshooting)

| Error | Hal |
| --- | --- |
| `DATABASE_URL is required` | `.env` file project root mein hai? (na ke `src` ke andar) |
| `ER_ACCESS_DENIED_ERROR` | DB user/password ghalat — phpMyAdmin se test karein |
| `ER_BAD_DB_ERROR` (unknown database) | `DB_NAME` mein Hostinger ka `u123456789_` prefix missing |
| `ECONNREFUSED 3306` | `DB_HOST=127.0.0.1` rakhein (localhost kabhi kabhi socket use karta hai) |
| Blank page / 500 | `npm run build` dobara chalayein aur app restart karein |
| Tables missing | phpMyAdmin → Import → `mysql/schema.sql` |
| Admin login nahi ho raha | `.env` mein `ADMIN_PASSWORD` set hai? App restart karein |

---

## Database backup

phpMyAdmin → **Export** → Quick → SQL. (Ya Hostinger ke automatic daily backups.)

## Ek naya server par move karna ho

1. `mysql/schema.sql` import karein
2. `.env` ki values update karein
3. `node scripts/use-mysql.mjs && npm install && npm run build`
