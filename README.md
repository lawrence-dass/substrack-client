# 📱 SubsTrack Client

> A modern subscription tracking application built with Next.js and TypeScript

[![Next.js](https://img.shields.io/badge/Next.js-15.3.9-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-black?style=flat-square)](https://ui.shadcn.com/)

## 📸 Screenshots

| Dashboard | Add Subscription |
|-----------|-----------------|
| ![Dashboard overview showing active subscriptions, free trials, monthly spending and quick actions](./public/substract%201.png) | ![Add subscription modal with fields for name, price, billing frequency, category and payment method](./public/substract%202.png) |

## 🎯 Overview

SubsTrack Client is a comprehensive subscription management application that helps users track their subscriptions, manage free trials, and optimize their spending. Built with modern web technologies, it provides an intuitive interface for managing all your digital subscriptions in one place.

## ✨ Features

### 🔐 **Authentication**
- Secure JWT-based authentication
- Sign up and sign in functionality
- Protected routes and user sessions

### 📊 **Dashboard**
- Real-time subscription statistics
- Active subscriptions overview
- Free trial monitoring
- Monthly spending calculations
- Recent activity tracking

### 💳 **Subscription Management**
- **Add Subscriptions**: Create new subscription entries with detailed information
- **Edit Subscriptions**: Update existing subscription details
- **Delete Subscriptions**: Permanently remove subscriptions
- **Cancel Subscriptions**: Mark subscriptions as cancelled
- **Website Links**: Direct links to subscription services

### 🆓 **Free Trial Tracking**
- Trial duration management (days, weeks, months)
- Automatic trial end date calculation
- Post-trial pricing information
- Auto-conversion settings
- Trial status monitoring

### 🏷️ **Advanced Features**
- **Categories**: 13+ subscription categories (Entertainment, Productivity, Health, etc.)
- **Payment Methods**: Multiple payment method support
- **Currency Support**: USD, EUR, GBP, CAD, AUD
- **Billing Frequencies**: Weekly, Monthly, Quarterly, Yearly
- **Status Management**: Active, Inactive, Cancelled, Pending

### 🎨 **User Interface**
- Modern, responsive design with Tailwind CSS
- shadcn/ui components for consistent UX
- Dark mode support
- Elegant confirmation dialogs (no more browser alerts!)
- Toast notifications for user feedback
- Accordion-style subscription details
- Mobile-friendly responsive layout

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.3.4](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Fetch API with custom utilities

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or later
- **npm**, **yarn**, or **pnpm** package manager
- **Backend API** (SubsTrack API server)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/substrack-client.git
   cd substrack-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5500/api/v1
   ```
   
   **Environment Variables:**
   - `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL
     - Development: `http://localhost:5500/api/v1`
     - Production: `http://18.207.173.104:5500/api/v1`

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
substrack-client/
├── app/                          # Next.js App Router
│   ├── dashboard/               # Dashboard page
│   ├── home/                    # Home/landing page
│   ├── signin/                  # Sign in page
│   ├── signup/                  # Sign up page
│   ├── subscriptions/           # All subscriptions page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Root page
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   │   ├── accordion.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   └── select.tsx
│   ├── AddSubscriptionModal.tsx  # Add subscription form
│   ├── EditSubscriptionModal.tsx # Edit subscription form
│   ├── ConfirmationPopover.tsx   # Confirmation dialogs
│   ├── NotificationToast.tsx     # Toast notifications
│   └── Navbar.tsx               # Navigation component
├── lib/                         # Utility functions
│   ├── api.ts                   # API utilities and endpoints
│   └── utils.ts                 # General utilities
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── next.config.ts               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🌐 API Integration

The application integrates with a backend API for data management:

### Authentication Endpoints
- `POST /auth/sign-in` - User login
- `POST /auth/sign-up` - User registration

### Subscription Endpoints
- `GET /subscriptions/user/:userId` - Get user subscriptions
- `POST /subscriptions` - Create new subscription
- `PUT /subscriptions/:id` - Update subscription
- `DELETE /subscriptions/:id` - Delete subscription

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## 🎨 UI Components

The application uses a custom component library built on top of shadcn/ui:

### Form Components
- **Input**: Text inputs with validation
- **Select**: Dropdown selectors with multiple options
- **Button**: Various button variants and sizes
- **Label**: Accessible form labels

### Layout Components
- **Card**: Content containers with headers
- **Accordion**: Expandable content sections
- **Dialog**: Modal dialogs for forms

### Feedback Components
- **ConfirmationPopover**: Elegant confirmation dialogs
- **NotificationToast**: Success/error toast messages

## 📱 Features Walkthrough

### 1. Authentication Flow
- Users can register with name, email, and password
- Secure login with JWT token storage
- Automatic redirection based on authentication status

### 2. Dashboard Overview
- Quick statistics of all subscriptions
- Active subscriptions count
- Free trials monitoring
- Monthly spending calculation

### 3. Subscription Management
- **Add New**: Comprehensive form for subscription details
- **Edit Existing**: Pre-populated form for updates
- **View All**: Accordion-style detailed view
- **Quick Actions**: Edit, cancel, delete, visit website

### 4. Free Trial Support
- Trial duration with flexible units
- Automatic end date calculation
- Post-trial pricing configuration
- Auto-conversion preferences

## 🚧 Roadmap

- [ ] **Enhanced Analytics**: Charts and spending trends
- [ ] **Notifications**: Email reminders for trial endings
- [ ] **Export Features**: CSV/PDF export of subscription data
- [ ] **Mobile App**: React Native companion app
- [ ] **Recurring Reminders**: Customizable notification system
- [ ] **Budget Tracking**: Monthly spending limits and alerts
- [ ] **Team Sharing**: Family/team subscription management

## 🤝 Contributing

We welcome contributions to SubsTrack Client! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Follow the existing component patterns
- Add proper error handling
- Write descriptive commit messages

### Code Style
- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use functional components with hooks
- Implement proper prop types and interfaces

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[shadcn/ui](https://ui.shadcn.com/)** - For the beautiful UI component library
- **[Lucide](https://lucide.dev/)** - For the clean, consistent icons
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework
- **[Next.js](https://nextjs.org/)** - For the powerful React framework
- **[Radix UI](https://www.radix-ui.com/)** - For accessible component primitives


