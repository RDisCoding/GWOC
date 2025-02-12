// routes/cart.js
const router = require("express").Router();
const pool = require('../db');
const authorization = require("../middleware/authorization");

// // Add item to cart
// router.post("/add", authorization, async (req, res) => {
//     const client = await pool.connect();
//     try {
//         await client.query('BEGIN');

//         console.log("Adding to cart for user_id:", req.user); // Debugging log
        
//         if (!req.user) {  // ✅ Use req.user instead of req.user_id
//             throw new Error("User ID is required");
//         }

//         const { product_id, quantity, price, customizations } = req.body;

//         // Get or create cart for user
//         let cartResult = await client.query(
//             'SELECT id FROM carts WHERE user_id = $1',
//             [req.user]  // ✅ Use req.user
//         );

//         let cart_id;
//         if (cartResult.rows.length === 0) {
//             console.log("Creating new cart for user:", req.user);
            
//             const newCartResult = await client.query(
//                 'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
//                 [req.user]  // ✅ Use req.user
//             );
//             cart_id = newCartResult.rows[0].id;
//         } else {
//             cart_id = cartResult.rows[0].id;
//         }

//         // Add item to cart
//         const cartItem = await client.query(
//             `INSERT INTO cart_items 
//             (cart_id, product_id, quantity, price_at_time, customizations) 
//             VALUES ($1, $2, $3, $4, $5) 
//             RETURNING id`,
//             [cart_id, product_id, quantity, price, JSON.stringify(customizations)]
//         );

//         await client.query('COMMIT');
//         res.json({ success: true, cart_item_id: cartItem.rows[0].id });
//     } catch (err) {
//         await client.query('ROLLBACK');
//         console.error("Cart addition error:", err.message);
//         res.status(500).json({ error: err.message });
//     } finally {
//         client.release();
//     }
// });

// Add item to cart
router.post("/add", authorization, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log("Adding to cart for user_id:", req.user);

        if (!req.user) {
            throw new Error("User ID is required");
        }

        const { product_id, quantity, price, customizations } = req.body;

        // Get or create cart for user
        let cartResult = await client.query(
            'SELECT id FROM carts WHERE user_id = $1',
            [req.user]
        );

        let cart_id;
        if (cartResult.rows.length === 0) {
            console.log("Creating new cart for user:", req.user);
            const newCartResult = await client.query(
                'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
                [req.user]
            );
            cart_id = newCartResult.rows[0].id;
        } else {
            cart_id = cartResult.rows[0].id;
        }

        // Prepare customizations value (JSON string or NULL)
        const customizationsValue = customizations !== undefined ? JSON.stringify(customizations) : null;

        // Check for existing item with same product and customizations
        const existingItem = await client.query(
            `SELECT id, quantity FROM cart_items 
             WHERE cart_id = $1 
             AND product_id = $2 
             AND customizations IS NOT DISTINCT FROM $3`,
            [cart_id, product_id, customizationsValue]
        );

        let cartItem;
        if (existingItem.rows.length > 0) {
            // Update quantity of existing item
            const newQuantity = existingItem.rows[0].quantity + quantity;
            cartItem = await client.query(
                `UPDATE cart_items 
                 SET quantity = $1 
                 WHERE id = $2 
                 RETURNING id`,
                [newQuantity, existingItem.rows[0].id]
            );
        } else {
            // Insert new item
            cartItem = await client.query(
                `INSERT INTO cart_items 
                 (cart_id, product_id, quantity, price_at_time, customizations) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING id`,
                [cart_id, product_id, quantity, price, customizationsValue]
            );
        }

        await client.query('COMMIT');
        res.json({ success: true, cart_item_id: cartItem.rows[0].id });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Cart addition error:", err.message);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// // Remove item from cart
// router.delete("/remove/:itemId", authorization, async (req, res) => {
//     try {
//         const { itemId } = req.params;
//         const { user_id } = req;

//         const deleteQuery = `
//             DELETE FROM cart_items ci
//             USING carts c
//             WHERE ci.id = $1 
//             AND ci.cart_id = c.id 
//             AND c.user_id = $2
//         `;

//         const result = await pool.query(deleteQuery, [itemId, user_id]);

//         if (result.rowCount === 0) {
//             return res.status(404).json("Cart item not found");
//         }

//         res.json({ success: true });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json("Server Error");
//     }
// });

// // Get cart items
// router.get("/", authorization, async (req, res) => {
//     try {
//         const { user_id } = req;
//         const query = `
//             SELECT 
//                 ci.id as cart_item_id,
//                 ci.quantity,
//                 ci.price_at_time,
//                 ci.customizations,
//                 p.product_id,
//                 p.name,
//                 p.image_url,
//                 p.description
//             FROM cart_items ci
//             JOIN carts c ON ci.cart_id = c.id
//             JOIN products p ON ci.product_id = p.product_id
//             WHERE c.user_id = $1
//         `;

//         const result = await pool.query(query, [user_id]);
//         res.json(result.rows);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json("Server Error");
//     }
// });

router.get("/", authorization, async (req, res) => {
    try {
        const query = `
            WITH cart_summary AS (
                SELECT 
                    ci.id as cart_item_id,
                    ci.quantity,
                    ci.price_at_time,
                    ci.customizations,
                    p.product_id,
                    p.name,
                    p.image_url,
                    p.description,
                    p.category_id,
                    (ci.quantity * ci.price_at_time) as item_total
                FROM cart_items ci
                JOIN carts c ON ci.cart_id = c.id
                JOIN products p ON ci.product_id = p.product_id
                WHERE c.user_id = $1
            )
            SELECT 
                *,
                (SELECT SUM(item_total) FROM cart_summary) as cart_total
            FROM cart_summary
        `;

        const result = await pool.query(query, [req.user]);
        
        // Format the response
        const cartItems = result.rows;
        const total = cartItems.length > 0 ? cartItems[0].cart_total : 0;

        // res.json({
        //     items: cartItems.map(item => ({
        //         ...item,
        //         customizations: item.customizations ? JSON.parse(item.customizations) : null
        //     })),
        //     total: total
        // });

        res.json({
            items: cartItems.map(item => ({
                ...item,
               customizations: typeof item.customizations === "string" ? JSON.parse(item.customizations) : item.customizations
            })),
            total: total
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Update cart item quantity
router.put("/update/:itemId", authorization, async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        
        if (quantity < 1) {
            return res.status(400).json("Quantity must be at least 1");
        }

        const updateQuery = `
            UPDATE cart_items ci
            SET quantity = $1
            FROM carts c
            WHERE ci.id = $2 
            AND ci.cart_id = c.id 
            AND c.user_id = $3
            RETURNING *
        `;

        const result = await pool.query(updateQuery, [quantity, itemId, req.user]);

        if (result.rowCount === 0) {
            return res.status(404).json("Cart item not found");
        }

        res.json({ success: true, updated_item: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Remove item from cart
router.delete("/remove/:itemId", authorization, async (req, res) => {
    try {
        const { itemId } = req.params;

        const deleteQuery = `
            DELETE FROM cart_items ci
            USING carts c
            WHERE ci.id = $1 
            AND ci.cart_id = c.id 
            AND c.user_id = $2
            RETURNING *
        `;

        const result = await pool.query(deleteQuery, [itemId, req.user]);

        if (result.rowCount === 0) {
            return res.status(404).json("Cart item not found");
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

// Get recommended add-ons
router.get("/add-ons", authorization, async (req, res) => {
    try {
        const query = `
            SELECT 
                product_id,
                name,
                price,
                image_url
            FROM products
            WHERE is_addon = true
            AND is_active = true
            LIMIT 4
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
});

router.post("/checkout", authorization, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Get cart details with user information
        const cartRes = await client.query(`
            SELECT 
                ci.*, 
                p.name,
                p.image_url,
                u.user_email,
                u.user_name
            FROM cart_items ci
            JOIN carts c ON ci.cart_id = c.id
            JOIN products p ON ci.product_id = p.product_id
            JOIN users u ON c.user_id = u.user_id
            WHERE c.user_id = $1
        `, [req.user]);

        if (cartRes.rows.length === 0) {
            throw new Error('Cart is empty');
        }

        // 2. Create current order (without delivery address, with default pickup_status)
        const orderRes = await client.query(`
            INSERT INTO current_orders 
                (user_id, items, total, contact_phone, pickup_status)
            VALUES ($1, $2, $3, $4, 'pending')  -- Default pickup_status is 'pending'
            RETURNING *;
        `, [
            req.user,
            JSON.stringify(cartRes.rows.map(item => ({
                product_id: item.product_id,
                name: item.name,
                quantity: item.quantity,
                price: item.price_at_time,
                customizations: item.customizations
            }))),
            req.body.total,
            req.body.phone
        ]);

        // 3. Clear cart after order is placed
        await client.query(`
            DELETE FROM cart_items 
            WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1);
        `, [req.user]);

        await client.query('COMMIT');

        res.json({
            success: true,
            order: orderRes.rows[0],
            payment_status: 'completed'
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Checkout error:", err.message);
        res.status(500).json({ 
            error: err.message,
            payment_status: 'failed'
        });
    } finally {
        client.release();
    }
});


module.exports = router;