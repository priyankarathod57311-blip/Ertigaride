ERTIGARIDE – FRONTEND STARTER PROJECT
=====================================

HOW TO RUN
1. Extract the ZIP file.
2. Open the ErtigaRide folder in VS Code.
3. Open index.html using Live Server (recommended).
4. Navigate using the website menu.

IMPORTANT CUSTOMIZATION
1. Open js/main.js.
2. Replace WHATSAPP_NUMBER = "91XXXXXXXXXX" with your real WhatsApp number.
   Use country code + number without plus sign or spaces, e.g. 919876543210.
3. Replace "Add your number" and other contact placeholders in the HTML files.
4. Replace sample Unsplash images with actual photos of your own Ertiga.
5. Set real prices in js/pricing.js. All current values are DEMO estimates only.
6. Review your actual service options, vehicle permissions, insurance and local transport requirements before taking paid bookings.

PROJECT FEATURES
- 7 responsive HTML pages
- Shared CSS design system
- Mobile navigation
- Booking enquiry form with validation
- Demo booking storage in browser LocalStorage
- WhatsApp enquiry handoff
- Sample fare calculator
- FAQ accordion
- Google Maps search link for Pune

IMPORTANT LIMITATIONS
- This is a frontend prototype, not a production booking platform.
- LocalStorage bookings are stored only in the same browser/device.
- There is no secure admin login, central database, payment gateway or real-time availability.
- To accept real customer bookings, connect a backend/database such as Firebase or Supabase and implement secure authentication and booking management.
- The fare calculator uses illustrative sample rates. Confirm actual rates and all extra charges before publishing.
- Self-drive rentals may require specific commercial permissions, insurance and legal compliance. Confirm these before offering that service.


ADMIN DASHBOARD (DEMO)
- Open admin.html in the same browser/device where booking enquiries were submitted.
- Search enquiries, filter by status, update status, contact customers on WhatsApp,
  delete entries, and export a CSV backup.
- Demo data is stored in browser LocalStorage. It does not sync between devices,
  browsers, or customers' phones. Clearing browser data can remove these records.
- This is not secure authentication. Before using this for a real business, connect
  a backend/database (for example Firebase or Supabase), add secure admin login,
  and apply proper access rules. Never store customer information in a public
  shared browser or rely on LocalStorage as the production booking database.
