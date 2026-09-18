Today 5:57 PM
 ye counting  ka hai 
yrr ye sdahi nahi hoga har section catogery me  gap aa rahahi 
 ha bhai gap to hata lekin   ab idhar sapce ho giya 
avi 2 gap aa rahah hai 
 firvi nahi hua 
Pasted text(20260918-131527).txt
Document
 ab ye aa rahahhai
Pasted text(20260918-132903).txt
Document
Pasted text(20260918-133102).txt
Document
Pasted text(20260918-133146).txt
Document
 lo
 nahi  hua 
 ab ye aa rhahi
 lo ab
Pasted text(20260918-134322).txt
Document
 AK  BAR aCHHE SE READ KARO LINE BY LINE CODE KO OUR BATOE KAHA PE CHNAGE KARNA HAI 

Haan bhai, ab line-by-line check karne ke baad actual problem mil gayi. ❤️

Problem exactly yahan hai

Tumhare HomeScreen me abhi ye line hai:

<Row className="g-4">

Isme cartnova-product-grid class hata di gayi hai.

Tumhari CSS me .cartnova-product-grid ke liye already justify-content: flex-start !important aur columns ka flex-grow: 0 !important diya hua hai.

✅ Sirf EK line change karo

Current:

<Row className="g-4">

Final:

<Row className="cartnova-product-grid g-4">

Bas. Aur kuch change mat karna.

Tumhari existing CSS me .cartnova-product-grid ka justify-content: flex-start !important already present hai, isliye last row ke 2 products left/right corners par nahi jayenge.

Tumhara section final aisa rahega
<Row className="cartnova-product-grid g-4">
  {products.map((product) => (
    <Col
      key={product._id}
      xs={12}
      sm={6}
      lg={4}
      xl={3}
    >
      <Product product={product} />
    </Col>
  ))}
</Row>

Backend, actions, routing, pagination, Product component — kuch bhi touch nahi karna.

Save → browser me Ctrl + Shift + R karo.
Isse page 2 ke last 2 products bhi normal left se aayenge, beech me giant gap nahi rahega.

ab read banoe final achhe se pure project ko explainkaro 

Haan bhai ❤️ Ab main CartNova ko proper project ke form mein explain karta hoon — aise ki tum viva, project presentation aur interview mein confidently bata sako.

Maine tumhare available CartNova project files/code ko read karke explanation bana raha hoon. Jahan source code available hai, wahi functionality explain kar raha hoon; jo cheez source mein confirm nahi hoti, usko main assume nahi karunga.

🛒 CartNova — Complete Project Explanation
1. CartNova kya hai?

CartNova ek full-stack MERN-based e-commerce web application hai.

Iska main purpose hai user ko ek complete online shopping experience dena:

User
 ↓
Products browse/search
 ↓
Product details
 ↓
Add to Cart
 ↓
Shipping Address
 ↓
Payment
 ↓
Place Order
 ↓
Order Tracking

Saath hi Admin panel diya gaya hai jisse administrator:

Users manage kar sakta hai
Products manage kar sakta hai
Orders manage kar sakta hai
Product details update/delete kar sakta hai
Orders ko deliver mark kar sakta hai

Project description ke available material mein authentication, product management, shopping cart, orders aur payment functionality ko ek platform mein combine karne ka purpose diya gaya hai.

2. Technology Stack

Tumhare project ka main stack:

Technology	Use
React.js	Frontend UI
Redux	Global state management
React Router	Page/URL navigation
Node.js	Backend runtime
Express.js	REST API/backend
MongoDB	Database
Mongoose	MongoDB ke saath interaction
Axios	Frontend → Backend API requests
Bootstrap / React-Bootstrap	UI & responsive layout
CSS	Custom CartNova design
Razorpay	Online payment
JWT	Authentication
bcrypt	Password security
Git/GitHub	Version control

Project material bhi React, Node.js, MongoDB, Razorpay, Bootstrap aur Git/GitHub ko technology stack ke roop mein show karta hai.

3. Project Architecture

Sabse important cheez viva ke liye:

                CARTNOVA
                   │
          ┌────────┴────────┐
          │                 │
       FRONTEND           BACKEND
          │                 │
       React.js          Node.js
          │              Express.js
       Redux                │
          │                 │
       Axios ───────── REST APIs
                            │
                         Mongoose
                            │
                         MongoDB
                            │
                       Razorpay
Simple language mein:

React frontend user ko interface dikhata hai.

Redux frontend ka important data manage karta hai.

Axios API request backend ko bhejta hai.

Express/Node backend request process karta hai.

Mongoose MongoDB ke saath data handle karta hai.

MongoDB users, products, orders etc. store karta hai.

4. Frontend Structure

Tumhare project mein frontend broadly:

src/
│
├── components/
│
├── screens/
│
├── actions/
│
├── constants/
│
├── reducers/
│
├── App.js
├── CartNova.css
└── ...

Ye architecture important hai because project ko different responsibilities mein divide kiya gaya hai.

5. App.js — Main Routing File

Tumhare App.js mein React Router use ho raha hai.

For example:

<Route
  path='/product/:id'
  component={ProductScreen}
  exact
/>

Iska matlab:

/product/123

par ProductScreen open hoga.

Tumhare routes mein customer, checkout, authentication aur admin ke separate sections hain.

Main routes
Customer
/
 /page/:pageNumber
 /search/:keyword
 /search/:keyword/page/:pageNumber
 /product/:id
 /cart/:id?
 /profile
 /myorders
 /order/:id
Authentication
/login
/register
/forgotpassword
Checkout
/shipping
/payment
/placeorder
Admin
/admin/login
/admin/dashboard
/admin/userlist
/admin/user/:id/edit
/admin/productlist
/admin/productlist/:pageNumber
/admin/product/:id/edit
/admin/orderlist

Isliye App.js ko tum application ka navigation/routing controller bol sakte ho.

6. Header aur Footer

Application mein:

<Header />

global level par render hota hai.

Aur home page par:

<Footer />

render hota hai.

Tumhare newer App structure mein BackNavigation bhi global hai, jo website/browser/device back navigation ko handle karne ke liye use kiya gaya hai.

7. Home Page

Home page ka main component:

HomeScreen

Isme:

HeroSection
CategorySection
Product Listing
Pagination

hai.

HomeScreen Redux se products leta hai:

const productList = useSelector(
  (state) => state.productList
)

Aur products load karne ke liye:

dispatch(listProducts(keyword, pageNumber))

call hota hai.

8. Product Search

Tumhare backend mein search functionality:

const keyword = req.query.keyword

se keyword liya jaata hai.

Phir:

$or

ke through product ke:

name
category

mein search hoti hai.

Example:

/search/phone

To backend phone keyword ke basis par products search karta hai.

Regex:

$regex: req.query.keyword

aur:

$options: 'i'

use kiya gaya hai.

i ka matlab case-insensitive search.

Matlab:

Phone
phone
PHONE

same search ke roop mein work kar sakte hain.

9. Pagination

Tumhare backend mein:

const pageSize = 8

hai.

Page:

const page = Number(req.query.pageNumber) || 1

se decide hota hai.

Phir:

.limit(pageSize)
.skip(pageSize * (page - 1))

use hota hai.

Example

Page 1:

skip = 8 × (1 - 1)
     = 0

Page 2:

skip = 8 × (2 - 1)
     = 8

Page 3:

skip = 8 × (3 - 1)
     = 16

Isliye har page par 8 products aate hain.

Backend total pages calculate karta hai:

pages: Math.ceil(count / pageSize)
10. Product Card

Product card mein normally:

Image
Product Name
Rating
Reviews
Price
MRP
Deal
View Product

dikhaya jaata hai.

CSS mein product image wrapper ki height 190px aur image ko object-fit: contain diya gaya hai.

Product button:

width: 100%;

hai, isliye card ke andar full width leta hai.

11. Tumhari Recent Product Grid Problem

Tumhare HomeScreen mein final structure:

<Row className="cartnova-product-grid g-4">

hona chahiye.

Ye important hai because .cartnova-product-grid custom CSS class last row ke products ko unwanted stretching/gap se bachane ke liye use hoti hai.

Tumhari CSS mein product grid ke liye justify-content: flex-start aur columns ke flex-grow ko control kiya gaya hai.

12. Product Details Page

URL:

/product/:id

Example:

/product/64abc123

ProductScreen product ID leta hai:

match.params.id

aur:

listProductDetails(match.params.id)

dispatch karta hai.

Product details mein:

Product image
Name
Category
Rating
Reviews
Price
MRP
Offer
Stock
Description
Add to Cart
Reviews

handle kiye jaate hain.

13. Add to Cart

Product screen mein quantity:

const [qty, setQty] = useState(1)

se maintain hoti hai.

Add to cart par:

history.push(
  `/cart/${match.params.id}?qty=${qty}`
)

kiya jaata hai.

Matlab:

Product
 ↓
quantity select
 ↓
Add to Cart
 ↓
/cart/productId?qty=2
14. Rating & Reviews

User product review submit kar sakta hai.

Frontend:

createProductReview(
    productId,
    {
      rating,
      comment
    }
)

dispatch karta hai.

Backend mein check hota hai ki user already review kar chuka hai ya nahi.

product.reviews.find(...)

Agar already review hai:

Product already reviewed

error milta hai.

Otherwise review add hota hai.

15. Product Rating Calculation

Backend mein:

product.numReviews =
  product.reviews.length

aur rating calculate hoti hai:

product.rating =
  product.reviews.reduce(
    (acc, item) =>
      item.rating + acc,
    0
  ) / product.reviews.length

Matlab:

Suppose ratings:

5
4
3

To:

(5 + 4 + 3) / 3
= 4

Product rating = 4

16. Today's Deal Feature 🔥

Tumne product model/controller mein special deal functionality add ki hai.

Important fields:

isDealActive
dealDiscount
dealStartedAt
dealExpiresAt

Frontend check karta hai:

Boolean(product?.isDealActive)

discount:

dealDiscount > 0

aur expiry:

new Date(product.dealExpiresAt).getTime() >
Date.now()

Iska matlab deal tabhi live hai jab:

Deal active
+
Discount valid
+
Expiry future mein hai

Product details page mein live deal hone par Today's Deal badge show hota hai.

17. Authentication System

CartNova mein user authentication hai.

Main screens:

Register
Login
Forgot Password
Profile

Backend mein user authentication related functions available hain:

authUser
registerUser
getUserProfile
updateUserProfile
getUsers
deleteUser
getUserById
updateUser

Aur password recovery:

sendPasswordResetOtp
verifyPasswordResetOtp
resetPassword

available hai.

18. Forgot Password — OTP Flow

Tumhare project ka important feature:

Forgot Password

Flow:

User enters phone
        ↓
Send OTP
        ↓
User enters OTP
        ↓
OTP verified
        ↓
Reset Token generated
        ↓
New Password
        ↓
Password updated

Reset token database mein hashed form mein store hota hai.

Token ki validity:

10 minutes

hai.

Password reset ke time token verify hota hai aur new password save hota hai.

19. Profile System

Profile page mein user:

Personal information
Orders
Account settings
Addresses

manage kar sakta hai.

ProfileScreen Redux se:

userDetails
userLogin
orderListMy

state leta hai.

20. Address Management

Tumhare profile system mein saved addresses ka proper management hai.

Functions:

addAddress()
updateAddress()
deleteAddress()
setDefaultAddress()
getAddresses()

Profile screen mein address fields:

Full Name
Phone
House
Area
City
State
Pincode
Address Type
Default Address

available hain.

User address:

Add
Edit
Delete
Set Default

kar sakta hai.

21. Cart

Cart ka purpose:

Product
Quantity
Price
Subtotal
Total

manage karna hai.

Cart route:

/cart/:id?

hai.

User product add karne ke baad cart mein quantity change kar sakta hai aur checkout par ja sakta hai.

22. Checkout Flow

Tumhare checkout ke main steps:

Cart
 ↓
Shipping
 ↓
Payment
 ↓
Place Order
 ↓
Order Details

Routes bhi isi flow ko represent karte hain:

/shipping
/payment
/placeorder

23. Shipping Address

Shipping screen Redux se:

state.cart

aur:

state.userLogin

leta hai.

Saved addresses load hote hain.

Priority:

Default Address
       ↓
First Saved Address

Submit hone par:

saveShippingAddress(...)

dispatch hota hai.

Then:

history.push('/payment')

hota hai.

24. Payment System 💳

Tumhare project mein Razorpay payment integration hai.

Payment flow:

Order
 ↓
Create Razorpay Order
 ↓
Razorpay Checkout
 ↓
User Payment
 ↓
Payment Response
 ↓
Backend Verification
 ↓
Order marked Paid

Frontend:

/api/payment/create

ko amount send karta hai.

Payment complete hone ke baad:

razorpay_order_id
razorpay_payment_id
razorpay_signature

backend ko bheje jaate hain.

Agar verification successful ho:

payOrder(orderId, paymentResult)

dispatch hota hai.

25. Orders

Order system mein user apne orders dekh sakta hai.

Routes:

/myorders
/order/:id

available hain.

Order details page:

Order ID
Customer
Items
Price
Shipping
Payment
Delivery status

jaise information handle karta hai.

26. Order Payment & Delivery

OrderScreen mein:

getOrderDetails()
payOrder()
deliverOrder()

actions use ho rahe hain.

Admin delivery action:

deliverOrder(order)

dispatch karta hai.

27. Admin Panel 👨‍💼

Admin routes:

/admin/login
/admin/dashboard
/admin/userlist
/admin/user/:id/edit
/admin/productlist
/admin/product/:id/edit
/admin/orderlist

Tumhare App routing mein ye separate admin screens ke through handle ho rahe hain.

28. Admin Dashboard

Dashboard ka purpose administrator ko system ka overview dena hai.

Admin side par separate:

Dashboard
Users
Products
Orders

sections hain.

29. Admin User Management

Admin:

User List

dekh sakta hai.

User edit route:

/admin/user/:id/edit

hai.

User delete/update functionality backend ke user controller mein available hai.

30. Admin Product Management

Admin products:

Create
Read
Update
Delete

kar sakta hai.

Backend product controller mein:

getProducts
getProductById
deleteProduct
createProduct
updateProduct

available hain.

CRUD
C → Create
R → Read
U → Update
D → Delete
31. Product Create

New product create karne par initial/sample fields set kiye jaate hain:

name
price
user
image
brand
category
countInStock
numReviews
description

Aur Today's Deal fields bhi initialize kiye jaate hain:

isDealActive
dealDiscount
dealStartedAt
dealExpiresAt
32. Product Update

Admin product update karta hai to:

name
price
description
image
brand
category
countInStock

update hote hain.

Saath mein Today's Deal information bhi update hoti hai.

33. Redux Architecture

Tumhare frontend mein Redux important role play karta hai.

Basic flow:

Component
   ↓
Action
   ↓
Axios API
   ↓
Backend
   ↓
Response
   ↓
Reducer
   ↓
Redux Store
   ↓
Component

Example:

dispatch(listProducts())

↓

PRODUCT_LIST_REQUEST

↓

API call:

GET /api/products

↓

Backend response

↓

PRODUCT_LIST_SUCCESS

↓

Redux state update

↓

Product UI update.

34. Product Actions

Tumhare productActions mein:

listProducts
listProductDetails
deleteProduct
createProduct
updateProduct
createProductReview
listTopProducts

hain.

Example:

axios.get(
  `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
)

products fetch karta hai.

35. Redux Request States

Typical pattern:

REQUEST
SUCCESS
FAIL

Example:

PRODUCT_LIST_REQUEST
PRODUCT_LIST_SUCCESS
PRODUCT_LIST_FAIL
REQUEST

Loading start.

SUCCESS

Data successfully aaya.

FAIL

Error aaya.

Isliye UI mein:

{loading ? <Loader /> : ...}

use kar sakte ho.

36. Axios

Axios frontend aur backend ke beech communication karta hai.

Example:

axios.get('/api/products')

Matlab frontend backend ko request bhej raha hai.

POST:

axios.post(...)

PUT:

axios.put(...)

DELETE:

axios.delete(...)
37. REST API

Tumhara backend REST-style endpoints use karta hai.

Product example:

GET     /api/products
GET     /api/products/:id
POST    /api/products
PUT     /api/products/:id
DELETE  /api/products/:id

Reviews:

POST /api/products/:id/reviews
38. Backend Product Search + Pagination — Viva Explanation

Agar examiner bole:

"Aapne product pagination kaise implement ki?"

Tum bolo:

"Sir, backend mein page size 8 rakha hai. pageNumber query parameter se current page liya jaata hai. MongoDB query mein limit() aur skip() use karke required products fetch kiye jaate hain. Total documents countDocuments() se count karke Math.ceil(count/pageSize) se total pages calculate kiye jaate hain."

Ye perfect technical answer hai.

39. MongoDB

MongoDB tumhara main database hai.

MongoDB mein data document form mein store hota hai.

Example product document conceptually:

{
   name,
   price,
   image,
   brand,
   category,
   countInStock,
   rating,
   numReviews,
   reviews,
   description
}

Aur deal fields:

isDealActive
dealDiscount
dealStartedAt
dealExpiresAt

bhi use ho rahe hain.

40. Mongoose

Mongoose Node.js backend ko MongoDB se connect karne aur models ke through data handle karne ke liye use hota hai.

Example:

Product.find(...)
Product.findById(...)
product.save()
41. Authentication Security

User login ke baad userInfo Redux state mein use hota hai.

Protected requests mein token:

Authorization: `Bearer ${userInfo.token}`

send hota hai.

Example product delete action mein authorization header use kiya gaya hai.

Isse backend ko pata chalta hai ki request authenticated user se aa rahi hai.

42. Admin vs Public Access

Backend routes mein access concepts hain:

Public
Private
Private/Admin

Example:

GET products
→ Public

GET single product
→ Public

Delete product
→ Private/Admin

Create product
→ Private/Admin

Update product
→ Private/Admin

Create review
→ Private

Ye viva mein bahut important question hai.

43. CSS Design

Tumne custom:

CartNova.css

use kiya hai.

Product card ke liye custom classes hain:

.cartnova-product-card
.cartnova-product-image-wrapper
.cartnova-product-image
.cartnova-product-body
.cartnova-product-title
.cartnova-product-rating
.cartnova-price-row
.cartnova-product-btn

Product image:

object-fit: contain;

use karti hai.

Aur hover par product card:

transform: translateY(-6px);

use karta hai.

44. Responsive Design

React-Bootstrap ke:

Row
Col

use kiye gaye hain.

Example:

<Col
  xs={12}
  sm={6}
  lg={4}
  xl={3}
>

Meaning approximately:

Mobile      → 1 column
Small       → 2 columns
Large       → 3 columns
XL          → 4 columns

Isliye screen size ke according product grid change hoti hai.

45. Error Handling

Backend mein:

asyncHandler(...)

use ho raha hai.

Example:

if (!product) {
  res.status(404)
  throw new Error('Product not found')
}

Frontend mein:

<Message variant='danger'>
  {error}
</Message>

show kiya jaata hai.

Loading ke liye:

<Loader />

use hota hai.

46. Complete User Journey

Ab sabse important diagram yaad kar lo:

              CARTNOVA
                  │
                  ▼
             HOME PAGE
                  │
       ┌──────────┴──────────┐
       │                     │
    Search                Category
       │                     │
       └──────────┬──────────┘
                  ▼
             PRODUCTS
                  │
                  ▼
          PRODUCT DETAILS
                  │
                  ▼
             ADD TO CART
                  │
                  ▼
                CART
                  │
                  ▼
              SHIPPING
                  │
                  ▼
               PAYMENT
                  │
                  ▼
             PLACE ORDER
                  │
                  ▼
           ORDER DETAILS
                  │
                  ▼
            MY ORDERS
47. Admin Journey
Admin Login
     ↓
Dashboard
     ↓
 ┌───┼────────────┐
 ↓   ↓            ↓
Users Products   Orders
 ↓      ↓           ↓
Edit   CRUD       Details
Delete              ↓
                 Deliver
48. Project ka सबसे important technical flow

Agar examiner bole:

"Frontend se database tak request kaise jaati hai?"

Ye answer yaad karna:

React Component
      ↓
Redux Action
      ↓
Axios
      ↓
Express Route
      ↓
Controller
      ↓
Mongoose Model
      ↓
MongoDB
      ↓
Response
      ↓
Redux Reducer
      ↓
React UI
Example:

User product search karta hai:

/search/phone

↓

HomeScreen:

listProducts('phone', 1)

↓

Axios:

GET /api/products?keyword=phone&pageNumber=1

↓

Express route

↓

Product controller

↓

MongoDB:

name/category regex search

↓

Products return

↓

Redux:

PRODUCT_LIST_SUCCESS

↓

UI par products show.

49. Payment Flow

Payment ke liye:

Place Order
    ↓
Order Created
    ↓
Razorpay Order Create
    ↓
Razorpay Checkout
    ↓
Payment
    ↓
Razorpay Response
    ↓
Backend Verification
    ↓
Payment Status Update

Tumhare OrderScreen code mein Razorpay order create aur payment verification dono API calls clearly present hain.

50. Project ka Short Viva Introduction 🎤

Agar teacher bole:

"Introduce your project."

Tum ye bolo:

"My project name is CartNova. It is a full-stack MERN-based e-commerce web application. The frontend is developed using React.js and Redux, while the backend is built using Node.js and Express.js. MongoDB is used for database management. The application provides product browsing, search, pagination, user authentication, shopping cart, address management, order management, product reviews and Razorpay payment integration. It also contains an admin panel where administrators can manage users, products and orders. I used REST APIs for communication between frontend and backend and Axios for making API requests."

Bas ye confidently bol diya to project ka overall architecture clear ho jayega.

51. Agar examiner bole "Why MERN?"

Answer:

"I used MERN because JavaScript is used across the application stack. React provides component-based frontend development, Node.js and Express provide a lightweight backend, and MongoDB provides flexible document-based data storage. This makes development and integration easier."

52. Agar bole "Why Redux?"

"Redux is used for centralized state management. Data such as logged-in user information, product lists, cart information and order-related state can be managed centrally and accessed by different components."

53. Agar bole "Why Axios?"

"Axios is used to make HTTP requests from the React frontend to the Express backend. I use it for GET, POST, PUT and DELETE API operations."

54. Agar bole "What is REST API?"

"REST API is an architectural style for communication between client and server using HTTP methods such as GET, POST, PUT and DELETE. In CartNova, REST endpoints are used for products, users, orders and reviews."

55. Agar bole "What is JWT?"

"JWT is used for authentication. After successful login, the server provides a token. The frontend stores the user information and sends the token in the Authorization Bearer header when accessing protected APIs."

56. Agar bole "What is middleware?"

Simple:

"Middleware is a function that executes between the incoming request and the final route handler. In an e-commerce application it can be used for authentication, authorization and error handling."

57. Agar bole "What is CRUD?"
Create → POST
Read   → GET
Update → PUT/PATCH
Delete → DELETE

CartNova mein product management iska direct example hai.

58. Agar bole "What was your role?"

Tum apne actual work ke according bol sakte ho:

"I worked on the frontend and backend integration, product management, authentication, cart and checkout flow, order management, profile/address functionality, reviews, pagination and UI responsiveness."

59. Project ki 5 main strengths jo tum explain kar sakte ho

Technical features ke roop mein:

Full-stack architecture
Authentication & protected APIs
Complete shopping + checkout flow
Admin management system
Razorpay payment integration

Iske alawa:

Search
Pagination
Reviews
Saved Addresses
Today's Deals
Responsive UI

bhi project mein implemented hain.

60. One-line architecture — sabse important

Isko ratta nahi, samajh ke yaad karna:

"CartNova is a MERN-based e-commerce application where React handles the frontend, Redux manages application state, Axios communicates with REST APIs, Node.js and Express handle backend logic, Mongoose communicates with MongoDB, and Razorpay handles online payments."

❤️ Ye tumhare project ka core explanation hai.

Agar tumhara 7th-sem viva isi CartNova par hai, to next hum isko Viva Preparation Part-2 mein convert kar sakte hain: 50 most-likely questions + short answers + code-based questions — especially React, Redux, Express, MongoDB, JWT, API, Razorpay aur tumhare actual CartNova code se.

ok ab readme ko updated ka rdo 

Ho gaya bhai ❤️ CartNova ka updated README.md ready kar diya hai.

Isme project ke:

MERN tech stack
Customer features
Admin panel
Authentication + OTP
Product search & pagination
Cart/Checkout
Razorpay payment
Orders & delivery
Reviews
Today's Deals
Routes
API endpoints
Project structure
Environment variables
Local setup
Future improvements

sab properly documented hai.

Download updated README.md

Isko apne project ke root folder me README.md ke naam se rakh dena. 

README.md
Document

README.md
CartNova 🛒

CartNova is a full-stack MERN e-commerce web application built with React, Node.js, Express and MongoDB. It includes customer shopping features, authentication, checkout, payments, reviews, orders and a dedicated admin panel.

✨ Features
Customer
User registration and login
User profile and account settings
Forgot password with mobile OTP verification
Product browsing and product details
Keyword and category search
Product pagination
Add to cart and quantity management
Shipping and checkout
Razorpay payment
Order placement and order details
My Orders / order history
Product reviews and ratings
Top-rated products
Today's Deals with discount and expiry
Invoice generation
Responsive desktop/mobile UI
Route-aware back navigation
Admin
Dedicated admin login
Admin dashboard
User management and user editing
Product create, edit and delete
Product pagination
Order management
Order details
Mark paid orders as delivered
Today's Deal management
🛠️ Tech Stack

Frontend

React
React Router
Redux
Axios
React Bootstrap
CSS
Font Awesome

Backend

Node.js
Express.js
MongoDB
Mongoose
JWT authentication
express-async-handler

Payment

Razorpay
🏗️ Architecture
React Frontend
      │
      │ Axios API
      ▼
Node.js + Express Backend
      │
      ├── Authentication
      ├── Products
      ├── Reviews
      ├── Orders
      ├── Payments
      └── Admin Operations
      │
      ▼
MongoDB

Redux manages frontend application state through actions, reducers and constants.

📁 Main Structure
CartNova/
├── frontend/
│   ├── public/
│   └── src/
│       ├── actions/
│       ├── components/
│       ├── constants/
│       ├── reducers/
│       ├── screens/
│       ├── App.js
│       └── CartNova.css
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md
🔄 Shopping Flow
Home
 ↓
Search / Category
 ↓
Product Details
 ↓
Add to Cart
 ↓
Shipping
 ↓
Payment
 ↓
Place Order
 ↓
Order Details
 ↓
Razorpay Verification
 ↓
Admin Delivery Update
 ↓
Order Completed
🔎 Search & Pagination

The product API supports keyword search and pagination:

GET /api/products
GET /api/products?keyword=phone&pageNumber=2

The backend searches the product name and category fields using a case-insensitive regular expression and returns products, current page and total pages.

⭐ Reviews

Authenticated users can submit a rating and comment. A user can review a product only once. The product review count and average rating are updated after a successful review.

🔐 Authentication

CartNova separates customer and admin access. Protected operations use authenticated user information, while admin operations require administrator authorization.

🔑 Forgot Password
Mobile Number
     ↓
Send OTP
     ↓
Verify 6-Digit OTP
     ↓
New Password
     ↓
Password Reset
     ↓
Login

The frontend handles the recovery steps and reset token returned by the backend.

💳 Razorpay Payment
Unpaid Order
    ↓
Create Razorpay Order
    ↓
Razorpay Checkout
    ↓
Payment
    ↓
Verify Payment
    ↓
Mark Order Paid
    ↓
Admin Marks Delivered
    ↓
Order Completed

After payment, the order page also provides invoice generation.

🏷️ Today's Deals

Products support:

Deal activation
Discount percentage
Start time
Expiry time

A deal is shown as live only when it is active, has a valid discount, has an expiry date and has not expired.

🧩 Important Routes
/                         Home
/product/:id              Product details
/cart/:id?                Cart
/search/:keyword          Search
/search/:keyword/page/:pageNumber
/page/:pageNumber         Pagination

/login                    Login
/register                 Register
/forgotpassword           Forgot password
/profile                  Profile
/account-settings         Account settings

/shipping                 Shipping
/payment                  Payment
/placeorder               Place order
/order/:id                Order details
/myorders                 Order history

/admin/login              Admin login
/admin/dashboard          Dashboard
/admin/userlist            Users
/admin/user/:id/edit       Edit user
/admin/productlist         Products
/admin/product/:id/edit    Edit product
/admin/orderlist           Orders
🔌 Product API
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
POST   /api/products/:id/reviews
GET    /api/products/top
🎨 Responsive UI

CartNova uses custom CSS with React Bootstrap. Responsive layouts are provided for the product grid, authentication pages, forgot-password page, cart, checkout, order pages, profile and admin pages.

⚙️ Environment Variables

Backend configuration should contain values such as:

NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Frontend payment configuration:

REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key

For a separate backend URL:

REACT_APP_API_URL=your_backend_url

Do not commit real secrets, database credentials, JWT secrets or payment credentials to GitHub.

▶️ Run Locally
1. Clone
git clone <your-repository-url>
cd CartNova
2. Install dependencies

Run:

npm install

inside the frontend and backend directories when they have separate package.json files.

3. Configure .env

Add the required MongoDB, JWT and Razorpay configuration.

4. Start backend

Use the backend start/development script from its package.json.

5. Start frontend

Use the frontend start script from its package.json.

📌 Project Highlights
Full-stack MERN architecture
REST-style APIs
Redux state management
JWT authentication
Customer/admin role separation
Product search and pagination
Shopping cart and checkout
Razorpay payment integration
OTP password recovery
Reviews and ratings
Order and delivery management
Invoice generation
Today's Deals
Responsive design
🚀 Future Improvements
Wishlist
Advanced product filters
Coupons
Stock alerts
Admin analytics
Email/SMS notifications
Automated testing
CI/CD deployment
👨‍💻 Project

CartNova — MERN E-Commerce Application

A full-stack e-commerce project demonstrating React frontend development, REST APIs, MongoDB integration, authentication, payment processing, order management and admin functionality.