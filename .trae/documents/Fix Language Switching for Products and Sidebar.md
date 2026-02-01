I have analyzed the codebase and identified that the product list and sidebar are generated dynamically from `assets/products.json`, which currently **only contains Chinese text**. This is why switching to English or Japanese does not change the product names or sidebar menu.

To fix this and optimize the text for all languages, I will perform the following steps:

1.  **Update Translation Files (`messages_*.json`)**:
    *   Add missing translations for all **Categories** (e.g., "Kitchen", "Baby", "Pet") and **Subcategories** (e.g., "Silicone Kitchenware", "Teethers") to the English, Japanese, and Chinese translation files.
    *   This ensures the sidebar menu and page headings switch languages correctly.

2.  **Enhance Product Data (`assets/products.json`)**:
    *   Add `name_en` (English Name) and `name_ja` (Japanese Name) fields to every product in the database.
    *   I will generate professional translations for these product titles to ensure a high-quality experience in all three modes.

3.  **Upgrade Logic Script (`scripts/product_logic.js`)**:
    *   Modify the script to detect the current language.
    *   Update the **Sidebar** rendering to use the new translations from step 1.
    *   Update the **Product Grid** and **Detail Page** to display the correct product name (`name_en` or `name_ja`) based on the selected language.
    *   Add an event listener to instantly update the page content when you switch languages, without needing to refresh.

This will ensure that when you click "EN" or "JP", the entire product section (menu, titles, breadcrumbs) transforms to the correct language immediately.