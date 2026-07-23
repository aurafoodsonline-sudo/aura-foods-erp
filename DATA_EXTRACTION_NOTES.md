# Data Extraction Notes — Aura Foods

## Files Used

1. `Aura_Foods_Price_List.xlsx` — Excel file with 13 products and pricing by pack size
2. Old website seed script (`backend/shop/management/commands/seed.py`) — Product names, descriptions, prices, categories
3. Old website database (`backend/data/aurafoods.db`) — Queryable for product data
4. Combined ERP reference seed (`erp/shop/management/commands/seed.py`) — Extended products and data

## What Was Extracted

### Products (8)
Products were sourced from the old website seed data (most complete source):
1. Kunri Red Chili Powder — Rs. 199 (200g)
2. Golden Turmeric Powder — Rs. 180 (200g)
3. Fresh Coriander Powder — Rs. 160 (200g)
4. Black Pepper Powder — Rs. 190 (100g)
5. Tangy Chaat Masala — Rs. 140 (100g)
6. Himalayan Pink Salt — Rs. 120 (200g)
7. Rock Salt — Rs. 110 (200g)
8. Royal Garam Masala — Rs. 250 (100g)

### Categories (6)
1. Red Chili Powder
2. Turmeric Powder
3. Coriander Powder
4. Garam Masala
5. Premium Blends
6. Salt Range

### Prices
- Retail prices used from old website seed data (Rs. 110 - Rs. 250)
- Wholesale/bulk pricing from the XLSX file (100g-1000g) NOT used for retail display
- All prices in PKR (Rs.)

## What Was NOT Extracted or Needs Human Confirmation

### Missing Prices
- The XLSX price list has different pricing structure (wholesale by weight) vs. retail prices from old website
- The old website had Rs. 199, Rs. 180, Rs. 160, Rs. 190, Rs. 140, Rs. 120, Rs. 110, Rs. 250 (these were used)
- The new price list products like "Kashmiri Lal Mirch Powder", "Kuti Mirch (Coarse)", "Sabut Lal Mirch", "Dhaniya Sabut", "Zeera Sabut" were NOT added as they don't appear in the old website data

### Product-Image Matching
- Old website images are named `product01.jpg` through `product09.jpg` and `product_10.jpg` through `product_18.jpg`
- Mapping is approximate based on the old seed script references:
  - Red Chili → product01.jpeg
  - Turmeric → product02.jpeg
  - Coriander → product03.jpeg
  - Black Pepper → product09.jpeg
  - Chaat Masala → product05.jpeg
  - Pink Salt → product06.jpeg
  - Rock Salt → product07.jpeg
  - Garam Masala → product08.jpeg
- Images `product04.jpeg`, `product_10.jpeg` through `product_18.jpeg` were copied but not matched to any product
- 30+ WhatsApp images from the photos folder were copied but not named consistently for matching

### Website Structure
- The website structure document (DOCX) was binary/inaccessible via text extraction
- Manual inspection was not possible without a DOCX reader
- Page structure was inferred from old website templates

### ERP Data
- The combined ERP reference zip contained a sophisticated Django ERP system
- Only the conceptual model structure was used for inspiration
- No actual ERP data was extracted (it was empty Django app files)

## Assumptions Made

1. Old website seed data represents the canonical product catalog
2. Product images from old website uploads folder are the correct product photos
3. Prices from old seed data are current/valid
4. The 8 products represent the full retail catalog (may not include all items from XLSX)
5. New products from the XLSX price list (Kashmiri Lal Mirch Powder, etc.) could be added later

## Products Without Confirmed Prices
- Kashmiri Lal Mirch Powder — has XLSX price but not in old website
- Kuti Mirch (Coarse) — has XLSX price but not in old website
- Sabut Lal Mirch — has XLSX price but not in old website
- Sabut Degi/Kashmiri Mirch — has XLSX price but not in old website
- Dhaniya Sabut — has XLSX price but not in old website
- Zeera Sabut — has XLSX price but not in old website

## Images Without Matched Products
- product04.jpeg
- product_10.jpeg through product_18.jpeg
- WhatsApp images from photoes folder
- Gemini-generated images
