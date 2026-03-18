# User Management and Order System

A complete e-commerce user management and order system built with Next.js, MongoDB, and React Context API.

## Features

### 🔐 User Authentication
- **Mobile-based OTP Authentication**: Users log in using their mobile number
- **Automatic Registration**: New users are automatically registered after OTP verification
- **JWT Token Management**: Secure authentication with HTTP-only cookies
- **Session Management**: Persistent login sessions with automatic token refresh

### 👤 User Profile Management
- **Profile CRUD Operations**: Users can view and update their profile information
- **Address Management**: Store and manage shipping addresses
- **Account Information**: View account creation date and user details

### 🛒 Shopping Cart
- **Add to Cart**: Add products with quantity selection
- **Update Quantities**: Modify product quantities in cart
- **Remove Items**: Remove products from cart
- **Real-time Updates**: Cart updates reflect immediately across the app
- **Stock Validation**: Prevents adding more items than available stock

### ❤️ Wishlist
- **Add to Wishlist**: Save products for later
- **Remove from Wishlist**: Remove unwanted items
- **Move to Cart**: Transfer items from wishlist to cart
- **Wishlist Management**: View and manage saved products

### 🛍️ Order Management
- **Checkout Process**: Complete order placement with shipping address
- **Order History**: View all past orders with filtering options
- **Order Status Tracking**: Track order progress (Pending → Processing → Completed)
- **Order Cancellation**: Cancel pending orders
- **Cash on Delivery**: COD payment method support

### 👨‍💼 Admin Panel
- **Order Management**: View and manage all customer orders
- **Status Updates**: Update order status and delivery information
- **User Management**: View customer information and order history
- **Order Analytics**: Basic statistics and reporting

## Database Schema

### Users Collection
```javascript
{
  mobile: String (unique, required),
  name: String (required),
  email: String (optional),
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Verification Collection
```javascript
{
  mobile: String (required),
  otp: String (required, 6 digits),
  expiresAt: Date (10 minutes from creation),
  isUsed: Boolean,
  attempts: Number (max 3),
  createdAt: Date
}
```

### Products Collection
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  originalPrice: Number,
  images: [{ url: String, alt: String }],
  category: ObjectId (ref: Category),
  stock: Number (required),
  isActive: Boolean,
  tags: [String],
  weight: String,
  dimensions: { length: Number, width: Number, height: Number },
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Collection
```javascript
{
  user: ObjectId (ref: User, unique),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number (min: 1),
    price: Number
  }],
  totalAmount: Number,
  totalItems: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Wishlist Collection
```javascript
{
  user: ObjectId (ref: User, unique),
  products: [{
    product: ObjectId (ref: Product),
    addedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  orderId: String (unique, auto-generated),
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    name: String,
    price: Number,
    quantity: Number,
    subtotal: Number
  }],
  totalAmount: Number,
  status: String (pending, processing, completed, cancelled),
  paymentMethod: String (cod, online),
  paymentStatus: String (pending, paid, failed),
  shippingAddress: {
    name: String,
    mobile: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  orderDate: Date,
  deliveryDate: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to mobile number
- `POST /api/auth/verify-otp` - Verify OTP and login/register
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Cart Management
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[productId]` - Update item quantity
- `DELETE /api/cart/[productId]` - Remove item from cart

### Wishlist Management
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/[productId]` - Remove item from wishlist
- `POST /api/wishlist/[productId]` - Move item to cart

### Order Management
- `GET /api/orders` - Get user's orders (with filtering)
- `POST /api/orders` - Create new order
- `GET /api/orders/[orderId]` - Get order details
- `PUT /api/orders/[orderId]` - Update order (cancel)

### Admin APIs
- `GET /api/admin/orders` - Get all orders (admin only)
- `GET /api/admin/orders/[orderId]` - Get order details (admin)
- `PUT /api/admin/orders/[orderId]` - Update order status (admin)
- `GET /api/admin/users` - Get all users (admin only)

### Products
- `GET /api/products` - Get products with filtering and pagination
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin only)

## Frontend Components

### Context Providers
- **AuthContext**: Manages user authentication state and methods
- **CartContext**: Manages cart and wishlist state and operations

### Key Components
- **LoginModal**: Mobile OTP authentication modal
- **CartDrawer**: Sliding cart sidebar
- **ProfilePage**: User profile management
- **CheckoutPage**: Order placement with address form
- **OrdersPage**: Order history with filtering
- **OrderDetailsPage**: Individual order details
- **AdminOrdersPage**: Admin order management dashboard

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env.local` and configure:

```bash
# Database
MONGODB_URI=your-mongodb-connection-string

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Admin Mobile Numbers
ADMIN_MOBILES=9712752469,1234567890

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Run Development Server
```bash
npm run dev
# or
yarn dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/orders (requires admin mobile number)

## Usage Guide

### For Customers

1. **Login/Register**:
   - Click login button
   - Enter mobile number
   - Receive and enter OTP
   - For new users, provide name and email

2. **Shopping**:
   - Browse products
   - Add items to cart or wishlist
   - Update quantities in cart
   - Proceed to checkout

3. **Checkout**:
   - Fill shipping address
   - Review order summary
   - Place order (COD only)

4. **Order Management**:
   - View order history
   - Track order status
   - Cancel pending orders

### For Admins

1. **Access Admin Panel**:
   - Login with admin mobile number
   - Navigate to `/admin/orders`

2. **Order Management**:
   - View all orders with filtering
   - Update order status
   - View customer details
   - Process orders through workflow

3. **User Management**:
   - View customer list
   - See order history per customer
   - Access customer contact information

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Prevents XSS attacks
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: OTP request rate limiting
- **Admin Authorization**: Role-based access control
- **Data Sanitization**: MongoDB injection prevention

## Production Considerations

1. **SMS Integration**: Replace console.log OTP with actual SMS service (Twilio, AWS SNS)
2. **Payment Gateway**: Integrate Stripe, Razorpay, or other payment processors
3. **Email Notifications**: Send order confirmations and updates
4. **Image Uploads**: Implement product image upload functionality
5. **Search & Filtering**: Add advanced product search and filtering
6. **Inventory Management**: Real-time stock updates and low stock alerts
7. **Analytics**: Order analytics and reporting dashboard
8. **Mobile App**: React Native app for mobile users

## Technology Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HTTP-only cookies
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (recommended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.