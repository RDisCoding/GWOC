
-- download extension
CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

--fake user
INSERT INTO users (user_name, user_email, user_password) VALUES ('test', 'test@gmail.com','test123');

-- Categories table to store different product categories
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Products table to store individual items
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(category_id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    is_bestseller BOOLEAN DEFAULT false,
    rating DECIMAL(2,1),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    is_eggless BOOLEAN DEFAULT false,
    shape VARCHAR(50),
    type VARCHAR(50),
    available_weights JSON,
    variants JSON
);

-- Reviews table to store product reviews
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example queries to retrieve data for the UI
-- Get all categories ordered by newest first with their products
CREATE VIEW category_products AS
SELECT 
    c.category_id,
    c.name as category_name,
    c.created_at as category_created_at,
    ARRAY_AGG(
        json_build_object(
            'product_id', p.product_id,
            'name', p.name,
            'price', p.price,
            'image_url', p.image_url,
            'rating', p.rating,
            'review_count', p.review_count
        )
    ) as products
FROM categories c
LEFT JOIN products p ON c.category_id = p.category_id
WHERE c.is_active = true AND p.is_active = true
GROUP BY c.category_id, c.name, c.created_at
ORDER BY c.created_at DESC;

-- Get first 4 products for a category
CREATE VIEW category_preview AS
SELECT 
    c.category_id,
    c.name as category_name,
    (
        SELECT json_agg(p.*)
        FROM (
            SELECT 
                product_id,
                name,
                price,
                image_url,
                rating,
                review_count
            FROM products
            WHERE category_id = c.category_id
                AND is_active = true
            LIMIT 4
        ) p
    ) as preview_products
FROM categories c
WHERE c.is_active = true
ORDER BY c.created_at DESC;



 
-- Cart table to store the main cart information
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cart items table to store individual items in the cart
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_time DECIMAL(10,2) NOT NULL, -- Price when added to cart
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- For hamper/bundle products, we need to track their contents
CREATE TABLE cart_item_contents (
    id SERIAL PRIMARY KEY,
    cart_item_id INTEGER NOT NULL REFERENCES cart_items(id) ON DELETE CASCADE,
    content_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1
);

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cart_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_item_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- -- Cart table to store the main cart information
-- CREATE TABLE carts (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER NOT NULL REFERENCES users(id),
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Cart items table to store individual items in the cart
-- CREATE TABLE cart_items (
--     id SERIAL PRIMARY KEY,
--     cart_id INTEGER NOT NULL REFERENCES carts(id),
--     product_id INTEGER NOT NULL REFERENCES products(id),
--     quantity INTEGER NOT NULL DEFAULT 1,
--     price_at_time DECIMAL(10,2) NOT NULL, -- Price when added to cart
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- For hamper/bundle products, we need to track their contents
-- CREATE TABLE cart_item_contents (
--     id SERIAL PRIMARY KEY,
--     cart_item_id INTEGER NOT NULL REFERENCES cart_items(id),
--     content_name VARCHAR(255) NOT NULL,
--     quantity INTEGER NOT NULL DEFAULT 1
-- );

-- -- Trigger to update the updated_at timestamp
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- CREATE TRIGGER update_cart_updated_at
--     BEFORE UPDATE ON carts
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_cart_item_updated_at
--     BEFORE UPDATE ON cart_items
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();