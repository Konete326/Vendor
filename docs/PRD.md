# MA Vendor Project PRD

## 1. Project Overview

Ye project ek `MERN-style admin system` hai jo bike related operations ko manage karta hai. System ka main focus ye hai:

- Bike categories create aur manage karna
- Har bike ke raw materials define karna
- Raw material stock maintain karna
- Raw materials use karke assemblies banana
- Ready-to-sale stock aur raw materials dono ko POS se sell karna
- Sales history aur payment status track karna

Frontend `React` me bana hua hai aur backend `Express + MongoDB` use karta hai. Images ke liye `Cloudinary` integrated hai.

## 2. Business Idea

Project ka idea ek workshop / vendor / small manufacturing unit ke liye suitable hai jahan:

- Alag alag bike models hotay hain
- Un ke spare parts ya raw materials alag configured hotay hain
- Front, Rear, aur Brake Show type ki assemblies banti hain
- Bana hua maal "Ready to Sale" stock me chala jata hai
- Zarurat ho to raw material bhi direct sale ho sakta hai
- Sale cash, online ya partial payment ke sath ho sakti hai

Simple alfaaz me:

`Bike Category -> Material Configuration -> Stock Control -> Assembly -> Ready to Sale -> POS Sale -> Sales Reports`

## 3. Target User

Is system ka main user abhi `Admin` hai.

Admin ke kaam:

- Login karna
- Bike models manage karna
- Raw materials aur un ki variations banana
- Inventory update karna
- Assembly records banana
- Sale process karna
- Reports dekhna

## 4. Tech Stack

### Frontend

- React 16
- React Router
- React Bootstrap
- Bootstrap / SCSS
- Fetch API

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- Multer
- Cloudinary

## 5. Authentication Summary

Authentication bohat simple hai:

- Login page `/api/auth/login` ko hit karti hai
- Backend `.env` ya fallback credentials se username/password check karta hai
- Success par frontend `localStorage` me `isAuthenticated = true` save karta hai
- Route guard `App.js` me hai jo non-login pages par auth check karta hai
- Logout par `localStorage` se auth flag remove hota hai

Important note:

- Koi JWT, session, role system, ya secure token based auth nahi hai
- Ye current setup internal admin panel type lightweight login lagta hai

## 6. Main Navigation / Modules

Sidebar ke mutabiq main modules ye hain:

1. Dashboard
2. Sales & Billing
3. Bikes Category
4. Inventory Management
5. Production & Sales

### Sales & Billing ke andar

- POS (Quick Sale)
- Sales Records

### Inventory Management ke andar

- Materials Config
- Stock Control

### Production & Sales ke andar

- New Assembly
- Ready to Sale

## 7. Functional Flow

System ka ideal workflow ye hai:

1. Admin login karta hai
2. Bike category add karta hai
3. Har bike ke liye raw materials configure karta hai
4. Har material ki multiple qualities/grades define karta hai
5. Stock control se quantities update karta hai
6. Assembly page par bike aur part type choose karke production record karta hai
7. Is step par raw material stock deduct hota hai
8. Completed assembly ready-to-sale stock ban jati hai
9. POS par raw material ya ready-to-sale item sell kiya jata hai
10. Sale par stock further deduct hota hai
11. Sales History me totals, due amounts, aur filters ke sath records show hotay hain

## 8. Category / Part Type Meaning

Project me "category" do levels par use ho rahi hai:

### A. Bike Category

Ye actual bike model/entity hai, jese:

- Honda CD70
- Unique 125
- Kisi bhi custom bike model ka name

Code me bike model `Bike` collection me save hota hai.

### B. Part Type

Raw material aur assembly dono ke liye part classification ye hai:

- `Front`
- `Rear`
- `Brake Show`
- `None` (sirf raw material config me)

Is ka purpose:

- Material ko kisi assembly side/type se attach karna
- Assembly page par tab wise materials filter karna
- POS aur reports me classification support dena

## 9. Page-wise PRD

### 9.1 Login Page

**Route:** `/user-pages/login-1`

**Purpose:**
Admin ko system me enter karwana.

**Kya hota hai:**

- Username ya email enter hoti hai
- Password enter hota hai
- Login API call hoti hai
- Success par dashboard par redirect hota hai
- Failure par error message show hota hai

**Business rule:**

- Single admin style login
- Login ke baad sirf local storage auth flag set hota hai

### 9.2 Dashboard

**Route:** `/dashboard`

**Purpose:**
Overview screen dena.

**Kya hota hai:**

- Weekly sales, weekly orders, visitors style cards dikhte hain
- Charts aur traffic widgets hain
- Todo list aur template tables bhi hain

**Analysis:**

- Ye page abhi mostly template/demo content use kar raha hai
- Real business data MongoDB se bind nahi ki gayi
- PRD point of view se isay future analytics dashboard me convert kiya ja sakta hai

### 9.3 Bikes Category Page

**Route:** `/bikes/category`

**Purpose:**
Bike models/categories manage karna.

**Kya hota hai:**

- Existing bikes list hoti hain
- Bike image aur name show hota hai
- Nayi bike add ho sakti hai
- Bike edit ho sakti hai
- Bike delete ho sakti hai

**Data fields:**

- Bike Name
- Bike Image

**Backend effect:**

- Data `Bike` collection me save hoti hai
- Image Cloudinary par upload hoti hai

**Business value:**

- Ye pura system ka master data hai
- Aage raw materials isi bike se map hote hain

### 9.4 Material Configuration Page

**Route:** `/bikes/raw-material`

**Purpose:**
Har bike ke liye raw materials define karna.

**Kya hota hai:**

- Material list show hoti hai
- Bike filter available hai
- Naya material register hota hai
- Existing material edit hota hai
- Material delete hota hai

**Material fields:**

- Material Name
- Bike Category
- Part Type
- Material Image
- Variations / Qualities

**Har variation me:**

- Quality Name
- Price
- Alert Threshold

**Business meaning:**

- Ek hi material ke multiple grades ho sakte hain
- Example:
  - Material: Rim
  - Quality A
  - Quality B
  - Quality C

**Important note:**

- Price field config me exist karta hai
- Lekin POS me abhi actual pricing logic fully use nahi ho rahi

### 9.5 Stock Control Page

**Route:** `/bikes/raw-material-inventory`

**Purpose:**
Raw material quantities maintain karna.

**Kya hota hai:**

- Bike filter
- Material name filter
- Live inventory table
- Health/progress bar
- Low stock badge
- Add stock action
- Edit total balance action

**Stock modes:**

- `Add`: incoming stock quantity existing quantity me add hoti hai
- `Edit`: total balance overwrite hota hai

**Business logic:**

- Har material quality ke liye separate quantity maintained hai
- Alert threshold ki basis par low stock highlight hota hai

**Why important:**

- Assembly aur POS dono isi stock data par depend karte hain

### 9.6 Assembly Page

**Route:** `/bikes/assemble`

**Purpose:**
Raw materials ko use karke bike related assembly record karna.

**Tabs / categories:**

- Front
- Rear
- Brake Show

**Kya hota hai:**

- User bike select karta hai
- Optional assembly/batch name de sakta hai
- Units produced enter karta hai
- Active tab ke mutabiq matching materials show hotay hain
- Har material se ek quality select ki jati hai
- Submit par assembly record save hota hai

**Backend effect:**

- Raw material quantities deduct hoti hain
- Assembly record create ya merge hota hai

**Merge behavior:**

- Agar same assembly type + same bike category + same items mil jayein
- To new record banne ke bajaye quantity existing record me add ho sakti hai

**Business meaning:**

- Ye production module hai
- Stock ko convert karta hai raw material se ready-to-sale form me

### 9.7 Ready to Sale / Assembly Logs

**Route:** `/bikes/assemble-history`

**Purpose:**
Completed assemblies dekhna aur manage karna.

**Kya hota hai:**

- Assembly history table show hoti hai
- Bike filter aur type filter available hai
- Date, bike model, type, quantity, parts used show hotay hain
- Status as `Ready to Sale` show hota hai
- Edit assembly record possible hai
- Delete assembly record possible hai

**Important backend behavior:**

- Delete par raw material stock wapas restore hota hai
- Quantity update par stock adjust hota hai

**Business meaning:**

- Ye finished goods register hai
- POS ka ek source yehi page ke records hain

### 9.8 POS Dashboard

**Route:** `/pos`

**Purpose:**
Sale process karna.

**Sales sources:**

- Raw Material
- Ready to Sale
- All Sources

**Filters:**

- Source type
- Bike
- Part category

**Kya hota hai:**

- Inventory items cards form me show hotay hain
- Admin items cart me add karta hai
- Cart quantity update kar sakta hai
- Checkout modal open hota hai
- Customer name enter hota hai
- Payment method select hota hai
- Cash received enter hota hai
- Sale submit hoti hai

**Business meaning:**

- Ye ek hybrid POS hai
- Is se direct raw material bhi bik sakta hai
- Ready-to-sale assemblies bhi bik sakti hain

**Current financial behavior:**

- System `totalAmount` store karta hai
- `receivedAmount` store karta hai
- `dueAmount` calculate karta hai

**Major limitation:**

- POS me item `price` abhi effectively zero hai
- Is liye sales amount logic abhi practical revenue calculation nahi de raha

### 9.9 Sales History & Reports

**Route:** `/sales-history`

**Purpose:**
Sales tracking aur reporting.

**Kya hota hai:**

- Total filtered sales
- Total received
- Total due / udhaar
- Bike filter
- Payment status filter
- Specific date filter
- Month filter
- Year filter
- Detailed sale rows

**Per sale visible data:**

- Date
- Customer
- Bike name
- Items sold
- Payment method
- Total amount
- Received amount
- Due amount

**Business value:**

- Basic reporting screen
- Udhaar tracking ke liye useful

## 10. Data Model Summary

### Bike

- `name`
- `image`
- `category` default `Bike`
- `createdAt`

### RawMaterial

- `name`
- `bike`
- `image`
- `partType`
- `qualities[]`

Quality object:

- `qualityName`
- `quantity`
- `price`
- `alertThreshold`

### Assemble

- `assemblyType`
- `assemblyName`
- `bike`
- `bikeCategory`
- `items[]`
- `totalQuantity`
- `createdAt`

Assembly item:

- `material`
- `qualityName`
- `usedQuantity`

### Sale

- `items[]`
- `totalAmount`
- `receivedAmount`
- `dueAmount`
- `paymentMethod`
- `customerName`
- `bikeId`
- `bikeName`
- `saleDate`

## 11. API Summary

### Auth

- `POST /api/auth/login`

### Bikes

- `GET /api/bikes`
- `POST /api/bikes/add`
- `PUT /api/bikes/:id`
- `DELETE /api/bikes/:id`

### Raw Materials

- `GET /api/raw-materials`
- `POST /api/raw-materials/add`
- `PUT /api/raw-materials/:id`
- `DELETE /api/raw-materials/:id`

### Assemblies

- `GET /api/assembles`
- `POST /api/assembles/add`
- `PUT /api/assembles/:id`
- `DELETE /api/assembles/:id`

### Sales

- `GET /api/sales`
- `POST /api/sales/add`

## 12. System Logic Summary

### Inventory Deduction Logic

#### During Assembly

- Selected raw material quality ki quantity kam hoti hai
- `usedQuantity` aur `totalQuantity` ke mutabiq deduction hota hai

#### During Sale

- Agar item raw material hai to raw material stock deduct hota hai
- Agar item ready-to-sale assembly hai to assembly total quantity deduct hoti hai

#### During Assembly Delete

- Raw material stock wapas increase hota hai

#### During Assembly Edit

- Quantity difference ke hisab se stock adjust hota hai

## 13. What Is Working Well

- Clear module separation hai
- Bike to material relation defined hai
- Material variations ka concept strong hai
- Inventory control practical lagta hai
- Assembly stock deduction integrated hai
- Sales history aur due tracking available hai
- Cloudinary image upload implemented hai

## 14. Gaps / Observations

Ye points project analyze karne ke baad important nazar aaye:

### Functional gaps

- Dashboard real data driven nahi hai, mostly template content hai
- POS pricing logic incomplete hai, total revenue mostly zero reh sakta hai
- Auth secure nahi hai, sirf localStorage flag based hai
- User management / roles nahi hain
- Register page route me hai lekin real onboarding flow ka part nahi lagti

### Technical gaps

- Backend me secure auth token system nahi
- Delete operations ke against dependency protection nahi
- Bike delete hone par linked material/assembly ka behavior guarded nahi
- Sales me stock negative hone se bachane ki proper validation nazar nahi aati
- Assembly save se pehle enough stock validation explicit nahi dikhti

### UX gaps

- Dashboard business metrics se connected nahi
- POS me price aur bill amount user ko realistic tarah show nahi hota
- Printable invoice / receipt nahi
- Search / export / audit tools nahi

## 15. Recommended Future Enhancements

### High priority

- Proper pricing model implement karna
- POS total amount calculation real banana
- Stock validation add karna
- Secure authentication with JWT/session lana
- Dashboard ko live KPIs ke sath replace karna

### Medium priority

- Customer ledger / udhaar recovery module
- Supplier / purchase module
- Reports export to PDF/Excel
- Sale invoice print
- Low stock notifications

### Advanced

- Multi-user roles
- Branch/store support
- Purchase orders
- Expense management
- Profit/loss dashboard

## 16. Final Executive Summary

Ye project ek `Bike Vendor / Workshop Management Admin Panel` hai jo inventory aur sales lifecycle ko manage karta hai.

Is ka core business flow ye hai:

1. Bike model banao
2. Us bike ke materials configure karo
3. Material ki stock maintain karo
4. Front / Rear / Brake Show assemblies banao
5. Finished assembly ko ready-to-sale stock ki tarah use karo
6. POS se sale karo
7. Sales aur udhaar reports dekho

Sab se strong modules:

- Bike category management
- Material configuration
- Inventory control
- Assembly workflow
- Sales history reporting

Sab se weak / incomplete modules:

- Dashboard analytics
- Pricing and billing calculations
- Secure authentication

Net result:

Ye project ek achi foundation deta hai ek `manufacturing + inventory + POS` system ke liye, khas tor par bike parts / assembly business ke context me. Agar pricing, security, aur dashboard ko improve kar diya jaye to ye real production-grade admin system ban sakta hai.
