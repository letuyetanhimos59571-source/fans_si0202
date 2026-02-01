import os
import json
import shutil
import uuid

SOURCE_ROOT = r"F:\work\产品分类"
TARGET_IMG_ROOT = r"F:\work\si-main\si-main\assets\images\imported"
TARGET_JSON = r"F:\work\si-main\si-main\assets\products.json"

# Mapping folder names to English keys if needed, or just use Chinese for now as requested
# User wants "宠物产品", "厨房产品", "婴童产品"
# The folders are "宠物", "厨房", "婴童". I will map them.
CATEGORY_MAP = {
    "宠物": "Pet Products",
    "厨房": "Kitchen Products",
    "婴童": "Baby Products"
}

# Also need to keep existing "Glass Products" if possible, but user said "Current products are Glass, ADD these new ones".
# I will generate JSON for new ones, and maybe hardcode or migrate old ones later. 
# For now, let's focus on importing the new ones.

products = []

def process_product(category, subcategory, product_name, product_path):
    # Generate a unique ID for the product
    product_id = str(uuid.uuid4())[:8]
    
    # Target folder for this product's images
    target_dir = os.path.join(TARGET_IMG_ROOT, category, product_id)
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
        
    images = []
    # Copy images
    for f in os.listdir(product_path):
        if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            src_file = os.path.join(product_path, f)
            dst_file = os.path.join(target_dir, f)
            shutil.copy2(src_file, dst_file)
            # Web path relative to site root
            web_path = f"/assets/images/imported/{category}/{product_id}/{f}"
            images.append(web_path)
            
    if images:
        products.append({
            "id": product_id,
            "category": category,
            "subcategory": subcategory if subcategory else "General",
            "name": product_name,
            "images": sorted(images) # Sort to keep order like 1.jpg, 2.jpg
        })

def main():
    if os.path.exists(TARGET_IMG_ROOT):
        shutil.rmtree(TARGET_IMG_ROOT)
    
    for cat_folder in os.listdir(SOURCE_ROOT):
        cat_path = os.path.join(SOURCE_ROOT, cat_folder)
        if os.path.isdir(cat_path):
            # Check if it has subcategories or direct products
            # Heuristic: if a folder contains images, it's a product. If it contains folders, it's a subcategory.
            
            sub_items = os.listdir(cat_path)
            for item in sub_items:
                item_path = os.path.join(cat_path, item)
                if os.path.isdir(item_path):
                    # Check if this item folder has images directly -> Product
                    has_images = any(f.lower().endswith(('.jpg', '.png')) for f in os.listdir(item_path))
                    
                    if has_images:
                        # It's a product directly under Category
                        process_product(cat_folder, "", item, item_path)
                    else:
                        # It might be a subcategory
                        # Iterate its children
                        sub_sub_items = os.listdir(item_path)
                        for sub_item in sub_sub_items:
                            sub_item_path = os.path.join(item_path, sub_item)
                            if os.path.isdir(sub_item_path):
                                process_product(cat_folder, item, sub_item, sub_item_path)

    # Save JSON
    with open(TARGET_JSON, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    print(f"Imported {len(products)} products.")

if __name__ == "__main__":
    main()
