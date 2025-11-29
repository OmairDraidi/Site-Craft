# SiteCraft – Full AI Prompt Library (Complete Edition)

This is the **full & final prompt library** for generating ALL pages, systems, and UI for SiteCraft using **Figma Make AI**.

Contains:
✔ Core pages  
✔ Marketing website  
✔ Pricing  
✔ Landing  
✔ Blog  
✔ Help Center  
✔ Profile pages  
✔ Dashboard  
✔ Template Builder  
✔ Everything in one place  

Use inside **Figma Make → Prompt Box**.

---

# ✅ 1) High‑Fidelity UI Kit (Design System)

```
You are generating a complete High-Fidelity UI Kit for a SaaS platform named “SiteCraft”.
Create all core components, tokens, and design foundations using a premium black & gold theme.

=====================================
   1. BRAND THEME & COLOR SYSTEM
=====================================
Create a full set of color variables with 10 shades each:

Primary Gold:
- gold-100 → #FFF3D9
- gold-200 → #FFE4AE
- gold-300 → #FFD892
- gold-400 → #F7CE7B
- gold-500 → #F6C453 (main)
- gold-600 → #D7A94D
- gold-700 → #B78C46
- gold-800 → #9A6F37
- gold-900 → #765627
- gold-950 → #4C3816

Black / Dark Base:
- black-950 → #0A0A0A
- black-900 → #121212
- black-800 → #1A1A1A
- black-700 → #1E1E1E
- black-600 → #222222
- black-500 → #2B2B2B
- black-400 → #3A3A3A
- black-300 → #4A4A4A

Neutrals:
- white → #FFFFFF
- gray-200 → #EAEAEA
- gray-300 → #CFCFCF
- gray-400 → #B5B5B5
- gray-500 → #9E9E9E
- gray-600 → #7E7E7E
- gray-700 → #5F5F5F
- gray-800 → #3F3F3F
- gray-900 → #222222

Create variables for semantic colors:
- success → #2ECC71
- warning → #F1C40F
- error → #E74C3C
- info → #3498DB

=====================================
      2. TYPOGRAPHY SYSTEM
=====================================
Create text styles:

H1 — Poppins 48 / 600 / white
H2 — Poppins 40 / 600 / white
H3 — Poppins 32 / 600 / white
H4 — Poppins 28 / 600 / white
H5 — Poppins 24 / 500 / white
H6 — Poppins 20 / 500 / white

Body 1 — Inter 18 / 400 / gray-300
Body 2 — Inter 16 / 400 / gray-400
Caption — Inter 14 / 400 / gray-500
Label — Inter 12 / 500 / gray-400
Button Text — Poppins 16 / 600 / black

=====================================
      3. SPACING & GRID
=====================================
Create spacing scale components:
4, 8, 12, 16, 24, 32, 48, 64, 96

Grid system:
- Container width: 1200px
- 12 columns
- 24px gutter

=====================================
      4. ELEVATION & SHADOWS
=====================================
Create effect styles:

Shadow 1:
0px 2px 6px rgba(0,0,0,0.35)

Shadow 2:
0px 4px 16px rgba(0,0,0,0.45)

Shadow 3 (gold glow):
0px 6px 20px rgba(246,196,83,0.25)

=====================================
      5. COMPONENTS
=====================================

=== BUTTONS (3 Variants × 3 Sizes × States) ===
Primary:
- BG: gold-500
- Text: black
- Radius: 8
- Hover: gold-400
- Pressed: gold-600
- Disabled: black-600

Secondary (Outline):
- Border: 2px gold-500
- Text: gold-500
- Hover: bg gold-100 (8% opacity)

Ghost:
- Transparent background
- Text: white
- Hover: black-700

Sizes:
- Small (32px height)
- Medium (44px)
- Large (52px)

States:
Default / Hover / Pressed / Disabled

=== INPUTS ===
Text Input:
- Height: 44px
- BG: black-800
- Border: 1px solid black-500
- Focus: border gold-500 + glow
- Error: border error

Textarea:
- Same but height auto

=== CARDS ===
Base Card:
- BG: black-900
- Radius: 16
- Padding: 24

Premium Card:
- Gradient black-900 → black-800
- Border: 1px solid gold-600

Stat Card:
- Icon: gold-500
- Label: gray-400
- Value: white (bold)

=== BADGES & TAGS ===
Success badge — green with rounded pill
Warning badge — yellow pill
Error badge — red pill

Tags:
- Dark mode tag (black-700)
- Active tag (gold-500)

=== NAVIGATION ===
Sidebar:
- Width: 260px
- BG: black-950
- Active item: gold-500 background (12% opacity)
- Text: white

Topbar:
- Height: 64px
- BG: black-900
- Shadow 1

=== TABLES ===
Header:
- BG: black-800
- Text: gray-300

Rows:
- BG: black-900
- Hover: black-700

Status pill:
- success / warning / error badges

=====================================
      6. OUTPUT FORMAT
=====================================
Generate a full UI Kit artboard containing:

✔ Color variables  
✔ Typography styles  
✔ All components fully styled  
✔ Auto-layout structures  
✔ Ready-to-use buttons, inputs, cards, badges  
✔ Sidebar + Topbar  
✔ Shadows  
✔ Spacing blocks

Produce everything in a clean, organized UI Kit page.

```

---

# ✅ 2) Admin Dashboard (Overview)

```
Design a premium, high-fidelity Admin Dashboard UI for a SaaS platform called “SiteCraft”.
Use a luxurious black & gold theme with clean spacing and modern components.
Follow the style of a high-end SaaS like Linear + Vercel + Stripe, but with elegant gold highlights.

=======================================================
            1) LAYOUT REQUIREMENTS
=======================================================
Create a full dashboard screen at 1440px width with:

✔ Left Sidebar (fixed)
✔ Top Navigation Bar
✔ Main content grid
✔ Overview section
✔ Charts + Analytics
✔ Recent activity
✔ Table for data
✔ Quick Actions section

Dark mode only.

=======================================================
            2) SIDEBAR DESIGN
=======================================================
Sidebar width: 260px  
Background: #0A0A0A  
Border-right: 1px solid rgba(255,255,255,0.05)

Sidebar elements:
- Logo (SiteCraft emblem in gold)
- Menu Sections:
  • Dashboard
  • Templates
  • Builder
  • Users
  • Payments
  • Settings

Menu item styles:
- Text: white (opacity 80%)
- Icon: gold-500 (#F6C453)
- Active item:
  • background: rgba(246,196,83,0.12)
  • text: gold-500
  • left highlight bar gold-500

Bottom:
- Account section with avatar

=======================================================
            3) TOPBAR DESIGN
=======================================================
Height: 64px  
BG: #121212  
Shadow: subtle gold glow (0 6px 20px rgba(246,196,83,0.10))

Elements:
- Page title: “Dashboard Overview”
- Search input
- Notification bell
- Profile menu

=======================================================
            4) OVERVIEW CARDS
=======================================================
Create a row of 4 statistic cards:

Card Layout:
- Rounded: 16px
- Padding: 24px
- BG: #1A1A1A
- Shadow: 0 2px 6px rgba(0,0,0,0.35)
- Icon: small gold circular icon

Cards include:
1) Users Overview  
   • 10,482 users  
   • +12% this month (green badge)

2) Active Sites  
   • 641 live websites  
   • +3% (green)

3) Templates Used  
   • 2,912 uses  
   • -4% (red)

4) Revenue  
   • $84,500  
   • +8% (green)

=======================================================
            5) MAIN CHART SECTION
=======================================================
Create a modern analytics area:

Left:
- Line chart (gold line)
- Title: "Users Growth"
- Subtitle: “Last 30 days”
- Grid in subtle gray

Right:
- Bar chart (gold bars)
- Title: “Revenue Breakdown”
- Time range filter chips:
   • 7d • 30d • 90d • 1y

=======================================================
            6) RECENT ACTIVITY FEED
=======================================================
Card with:
- Title: “Recent Activity”
- List items:
  • User created a new website  
  • Template published  
  • Subscription renewed  
  • Admin updated settings

Each item:
- Gold dot  
- Timestamp  
- Light gray text

=======================================================
            7) DATA TABLE
=======================================================
Create a responsive table with:

Columns:
- User
- Email
- Status (badge)
- Plan
- Created at
- Actions (3-dot menu)

Row style:
- BG: #111
- Hover: #1E1E1E

Status badges:
- active → green pill  
- pending → yellow  
- banned → red  

=======================================================
            8) QUICK ACTIONS
=======================================================
A small grid of actions:
- Create Template
- Add Custom Domain
- Open Builder
- Invite User

Buttons style:
- Primary → gold-500 background
- Secondary → outline gold

=======================================================
            9) ALIGN TO BRAND (IMPORTANT)
=======================================================
Use SiteCraft design identity:
- Primary gold: #F6C453
- Dark BG: #0A0A0A — #121212 — #1A1A1A
- Modern fonts: Poppins (titles), Inter (body)

=======================================================
            OUTPUT
=======================================================
Generate:

✔ Full Admin Dashboard Artboard  
✔ Sidebar  
✔ Topbar  
✔ Overview Stats  
✔ Charts  
✔ Table  
✔ Activity section  
✔ Quick Actions  
✔ Dark mode  
✔ Gold highlights  
✔ Premium SaaS style  
✔ Auto-layout everywhere

```

---

# ✅ 3) Templates Gallery Page

```
Design a high-fidelity “Templates Gallery” page for SiteCraft, a website-builder SaaS platform.
Use a premium black & gold dark UI theme consistent with SiteCraft’s identity.

=======================================================
            PAGE STRUCTURE
=======================================================
Create a responsive gallery layout at 1440px width with:

✔ Topbar  
✔ Filters & Sorting  
✔ Templates Grid  
✔ Template preview card  
✔ Pagination  
✔ Search  
✔ Tags  
✔ Categories  
✔ Favorites (heart icon)
✔ Template details hover overlay

Dark mode only.

=======================================================
            1) TOP BAR
=======================================================
Topbar:
- BG: #121212  
- Height: 72px  
- Title: “Templates Gallery” (Poppins 32 / white)
- Right side:
  • Search input  
  • Filter button  
  • Upload Template (Primary Gold Button)

Search bar:
- Width: 360px  
- Left icon: magnifier  
- BG: #1A1A1A  
- Border: 1px solid #2B2B2B  

=======================================================
            2) FILTERS SECTION
=======================================================
Below the topbar, create a horizontal filters row:

Filters:
- Category dropdown  
- Industry dropdown  
- Style dropdown  
- Free / Premium toggle  
- “Sort by” menu (Popular / Newest / Most used)

Tag chips:
- Gold border  
- Black background  
- Active tag → gold-500 fill

=======================================================
            3) TEMPLATE GRID
=======================================================
Create a 3-column or 4-column grid depending on width:

Each Template Card:
- Size: 360×280  
- Rounded: 16px  
- BG: #1A1A1A  
- Shadow: 0 4px 16px rgba(0,0,0,0.35)  
- Cover image (top 70%)  
- Bottom area:
    • Template name  
    • Category label  
    • Status: “Free” or “Premium badge (gold)”
    • Favorite (heart icon)

Hover state:
- Dark overlay with:
    • “Preview” button (Outline gold)
    • “Use Template” button (Primary gold)

Premium badge:
- Gold pill
- Text: black

=======================================================
            4) TEMPLATE DETAILS PANEL
=======================================================
(Optional if AI supports it)

When clicking a template:
Right-side slide panel:

Panel width: 420px  
Panel BG: #0A0A0A  
Panel contents:
- Large preview image  
- Description  
- Features list  
- Tags  
- Use Template (Primary)
- Preview in new tab (ghost button)

=======================================================
            5) PAGINATION
=======================================================
Bottom pagination row:

- Page numbers (1, 2, 3…)  
- Arrows left/right  
- Active page gold  
- Hover: gold opacity background  

=======================================================
            6) ALIGNMENT WITH BRAND
=======================================================
Use SiteCraft identity:
- Primary gold: #F6C453
- Dark backgrounds: #0A0A0A / #121212 / #1A1A1A
- Headings: Poppins
- Body: Inter

=======================================================
            OUTPUT
=======================================================
Generate a complete Templates Gallery UI with:

✔ Topbar  
✔ Filters  
✔ Tag chips  
✔ Template cards  
✔ Hover interactions  
✔ Premium badges  
✔ Slide details panel  
✔ Pagination  
✔ Dark gold theme  
✔ Auto-layout ready

```

---

# ✅ 4) Authentication UI (Login / Signup)

```
Design a high‑fidelity Authentication UI for SiteCraft using a premium black & gold theme.

Create a full authentication flow:
- Login page
- Signup page
- Forgot password
- Reset password

Design requirements:
✔ Centered card layout  
✔ Black background (#0A0A0A → #121212 gradient)
✔ Gold CTAs (#F6C453)
✔ Inputs with glowing gold focus ring
✔ Secondary ghost button for “Forgot password”
✔ Split-screen optional illustration
✔ Mobile‑friendly responsive layout

Output:
✔ Login page
✔ Signup page
✔ Forgot password
✔ Reset password
✔ Dark mode only
✔ Auto‑layout
```

---

# ✅ 5) Template Builder Interface (Drag & Drop Builder)

```
Design a complete Template Builder UI for SiteCraft.
It must include:

LEFT SIDEBAR:
- Elements (Text, Image, Button, Video, Form, Icon)
- Sections (Hero, Features, Pricing, Footer)
- Templates Library

TOPBAR:
- Undo / Redo
- Publish
- Preview
- Responsive preview (Desktop / Tablet / Mobile)

MAIN CANVAS:
- Editable artboard
- Drag & Drop blocks
- Resize handles
- Grid overlay
- Alignment guides

RIGHT PANEL:
- Element properties
- Typography settings
- Colors
- Borders
- Shadows
- Layout settings
- Animations

Theme:
- Black & gold
- High‑end editor look like Webflow + Framer

Output:
✔ Full builder layout
✔ All sidebars
✔ Interaction elements
✔ Artboard
✔ Property panel
```

---

# ✅ 6) Domains Management Page

```
Design a Domains Management page for SiteCraft.

Sections:
✔ Connected Domains list  
✔ Add new domain button (gold)  
✔ Domain status badges (active / verifying / error)  
✔ DNS instructions panel  
✔ Automatic SSL status  
✔ Domain deletion confirmation modal  

Layout:
- Table view + actions
- Slide-out DNS setup panel
- Dark mode black & gold

Output:
✔ Full domains page
✔ Table
✔ DNS panel
✔ Status badges
✔ Modals
```

---

# ✅ 7) Users Management Page

```
Design a Users Management Page.

Include:
✔ Users table (Avatar, Name, Email, Role, Status, Created At)
✔ Filters (Role, Status)
✔ Search input
✔ Add user button
✔ Role selector (Admin, Editor, Owner)
✔ Status badges (Active / Pending / Suspended)
✔ Slide-over panel for “Edit User”

Theme:
- Black & gold
- Modern SaaS layout

Output:
✔ Users table
✔ Filters
✔ Add user modal
✔ Edit user panel
```

---

# ✅ 8) Payments & Billing Page

```
Design a Billing & Payments page.

Include sections:
✔ Current plan (Free / Pro / Enterprise)
✔ Upgrade button (primary gold)
✔ Usage statistics
✔ Payment methods (credit card)
✔ Invoice history table
✔ Download invoice button
✔ Subscription management
✔ Auto-renew toggle

Theme:
- Premium black & gold
- Stripe‑style clean layout

Output:
✔ Full billing dashboard
✔ Card info UI
✔ Invoice table
✔ Pricing overview
```

---

# ✅ 9) Settings Page

```
Design a full Settings page for SiteCraft.

Sections:
✔ General settings
✔ Branding (logo upload)
✔ Custom colors
✔ Email notifications
✔ Security
✔ 2FA setup
✔ API keys
✔ Team members

Left sidebar:
- General
- Branding
- Notifications
- Security
- Billing
- API
- Team

Output:
✔ Full settings layout
✔ Sidebar
✔ Forms
✔ Toggles
✔ Upload components
```

---

# ✅ 10) Template Details Page

```
Design a Template Details Page.

Include:
✔ Large preview  
✔ Template name  
✔ Category & tags  
✔ Description  
✔ Used by X websites  
✔ Buttons: Preview / Use Template  
✔ Related templates section  

Theme:
- Black & gold
- Slick premium aesthetic

Output:
✔ Full template details layout
✔ Preview image
✔ Info panel
✔ Buttons
✔ Related items
```

---

---

# 🟩 11) Landing Page (Homepage)
```
Design a premium Landing Page for SiteCraft.

Sections:
- Hero section with main headline, subtext, CTA buttons
- Product mockups
- Features section (3 or 6 cards)
- How SiteCraft works (steps)
- Templates showcase
- Pricing preview
- Testimonials
- FAQ
- Footer

Theme:
- Black background
- Gold accents
- Smooth gradients
- Elevation shadows

CTAs:
- Start Free
- Explore Templates

Output:
✔ Complete landing page
✔ Hero, features, testimonials, FAQ, footer
✔ Dark gold theme
✔ Auto-layout
```

---

# 🟩 12) Pricing Page
```
Design a Pricing Page for SiteCraft.

Include:
✔ Three plans (Free, Pro, Enterprise)
✔ Monthly / Yearly toggle
✔ Features comparison table
✔ Benefits list
✔ Gold CTA buttons
✔ FAQ section at bottom
✔ Dark mode black & gold design

Output:
✔ Full pricing page
✔ Plans + comparison + FAQ
✔ Auto-layout
```

---

# 🟩 13) Marketing Website (About / Features / Why SiteCraft)
```
Design the Marketing Website pages for SiteCraft:

Pages:
1) About SiteCraft
   - Mission
   - Vision
   - Story
   - Team section

2) Features Page
   - Detailed feature blocks
   - Icons
   - Screenshots
   - Cards

3) Why SiteCraft
   - Comparison section
   - Value propositions
   - Testimonials
   - Gold highlights

Theme:
Luxury black & gold
Clean modern layout
Large visuals
```

---

# 🟩 14) Blog / Articles Page
```
Design a full Blog system:

Blog Home:
- Articles grid
- Search
- Categories
- Featured article
- Pagination

Article Page:
- Title
- Cover image
- Table of contents
- Article body
- Author card
- Related articles

Dark mode black & gold
Elegant typography
```

---

# 🟩 15) Help Center / Documentation
```
Design a Help Center for SiteCraft:

Sections:
- Search bar
- Categories grid
- Popular articles
- Contact support
- Article viewer with sidebar navigation

Theme:
- Black background
- Gold accents
- Clean documentation layout
```

---

# 🟩 16) Profile / Account Page
```
Design a Profile page:

Include:
- Avatar
- Name, email
- Update profile form
- Change password
- Connected accounts
- 2FA
- Delete account danger zone

Theme:
Black & gold
Modern spacing
```

---

# 🎉 End of the Complete SiteCraft Prompt Library
You now have a full system to generate the entire SaaS UI using Figma Make.
