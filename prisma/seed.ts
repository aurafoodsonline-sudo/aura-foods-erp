import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ─── Clear existing data ───────────────────────────────────────────────────
  console.log("Clearing existing data...");
  await prisma.$transaction([
    prisma.cartItem.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.inventoryTransaction.deleteMany(),
    prisma.inventoryStock.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.user.deleteMany(),
    prisma.setting.deleteMany(),
  ]);

  // ─── Users ─────────────────────────────────────────────────────────────────
  console.log("Creating users...");
  const adminPassword = await bcrypt.hash("Admin@12345", 12);
  const staffPassword = await bcrypt.hash("Staff@12345", 12);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@aurafoods.local",
      password: adminPassword,
      name: "Admin User",
      role: "SuperAdmin",
      phone: "0300-0000001",
      isActive: true,
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      email: "staff@aurafoods.local",
      password: staffPassword,
      name: "Staff User",
      role: "Admin",
      phone: "0300-0000002",
      isActive: true,
    },
  });

  const inventoryStaff = await prisma.user.create({
    data: {
      email: "inventory@aurafoods.local",
      password: staffPassword,
      name: "Inventory Staff",
      role: "InventoryStaff",
      phone: "0300-0000003",
      isActive: true,
    },
  });

  const salesStaff = await prisma.user.create({
    data: {
      email: "sales@aurafoods.local",
      password: staffPassword,
      name: "Sales Staff",
      role: "SalesStaff",
      phone: "0300-0000004",
      isActive: true,
    },
  });

  // ─── Categories ────────────────────────────────────────────────────────────
  console.log("Creating categories...");
  const categoriesData = [
    { name: "Red Chili Powder", slug: "red-chili-powder", description: "Premium quality red chili powder sourced from Kunri, Sindh — known as the chili capital of Pakistan.", sortOrder: 1 },
    { name: "Turmeric Powder", slug: "turmeric-powder", description: "Pure and aromatic turmeric powder made from handpicked turmeric roots.", sortOrder: 2 },
    { name: "Coriander Powder", slug: "coriander-powder", description: "Freshly ground coriander powder with an authentic aroma and flavor.", sortOrder: 3 },
    { name: "Garam Masala", slug: "garam-masala", description: "Signature blend of hand-roasted spices ground to perfection.", sortOrder: 4 },
    { name: "Premium Blends", slug: "premium-blends", description: "Curated spice blends for every palate and occasion.", sortOrder: 5 },
    { name: "Salt Range", slug: "salt-range", description: "Pure and natural salts sourced from the finest mines.", sortOrder: 6 },
  ];

  const categories = await prisma.$transaction(
    categoriesData.map((cat) =>
      prisma.category.create({ data: cat })
    )
  );

  const categoryMap: Record<string, number> = {};
  for (const cat of categories) {
    categoryMap[cat.slug] = cat.id;
  }

  // ─── Products ──────────────────────────────────────────────────────────────
  console.log("Creating products...");
  const productsData = [
    {
      sku: "AURA-RCP-001",
      name: "Kunri Red Chili Powder",
      slug: "kunri-red-chili-powder",
      tagline: "Pisi Lal Mirch — Authentic Heat from Kunri",
      description: "Our signature red chili powder is sourced directly from Kunri, Sindh — the chili capital of Pakistan. Carefully sun-dried and stone-ground to preserve the natural color, heat, and aroma. No artificial colors or additives.",
      ingredients: "100% Pure Red Chili Powder",
      usage: "Use in curries, marinades, BBQ seasonings, and traditional Pakistani dishes. Adjust quantity to taste.",
      price: 199,
      weight: "200g",
      unit: "g",
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      categorySlug: "red-chili-powder",
      imageUrl: "/images/products/product01.jpg",
    },
    {
      sku: "AURA-TUR-001",
      name: "Golden Turmeric Powder",
      slug: "golden-turmeric-powder",
      tagline: "Pisi Haldi — Pure Golden Goodness",
      description: "Premium turmeric powder made from handpicked turmeric roots, sun-dried and ground to a fine powder. Rich in curcumin with a vibrant golden-yellow color and earthy aroma.",
      ingredients: "100% Pure Turmeric Powder",
      usage: "Essential for curries, rice dishes, soups, and golden milk. Also used as a natural food colorant and in home remedies.",
      price: 180,
      weight: "200g",
      unit: "g",
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      categorySlug: "turmeric-powder",
      imageUrl: "/images/products/product02.jpg",
    },
    {
      sku: "AURA-COR-001",
      name: "Fresh Coriander Powder",
      slug: "fresh-coriander-powder",
      tagline: "Pisa Dhaniya — Aromatic & Freshly Ground",
      description: "Made from carefully selected coriander seeds, dry-roasted and ground to retain the citrusy, floral aroma. A staple spice in every kitchen.",
      ingredients: "100% Pure Coriander Powder",
      usage: "Used in curries, dals, marinades, and spice blends. Add towards the end of cooking for best flavor.",
      price: 160,
      weight: "200g",
      unit: "g",
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      categorySlug: "coriander-powder",
      imageUrl: "/images/products/product03.jpg",
    },
    {
      sku: "AURA-PBP-001",
      name: "Black Pepper Powder",
      slug: "black-pepper-powder",
      tagline: "Pisi Kali Mirch — Finest Ground Pepper",
      description: "Premium black pepper sourced from the finest plantations, ground to a consistent powder. Delivers the sharp, pungent kick that elevates any dish.",
      ingredients: "100% Pure Black Pepper Powder",
      usage: "Sprinkle on eggs, salads, soups, and steaks. Essential in marinades, pickles, and spice rubs.",
      price: 190,
      weight: "100g",
      unit: "g",
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      categorySlug: "premium-blends",
      imageUrl: "/images/products/product04.jpg",
    },
    {
      sku: "AURA-CM-001",
      name: "Tangy Chaat Masala",
      slug: "tangy-chaat-masala",
      tagline: "Zingy & Tangy — The Perfect Finish",
      description: "A lively blend of spices with a tangy kick, formulated to bring out the best in fruit chaat, salads, and street food. Includes black salt, dried mango powder, cumin, and a hint of chili.",
      ingredients: "Cumin, Black Salt, Dried Mango Powder (Amchur), Chili Powder, Mint, Black Pepper, Citric Acid",
      usage: "Sprinkle on fruit chaat, salads, yogurt, grilled corn, and roasted nuts. Also great as a tangy seasoning for fries and samosas.",
      price: 140,
      weight: "100g",
      unit: "g",
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      categorySlug: "premium-blends",
      imageUrl: "/images/products/product05.jpg",
    },
    {
      sku: "AURA-SLT-001",
      name: "Himalayan Pink Salt",
      slug: "himalayan-pink-salt",
      tagline: "Gulabi Namak — Pure & Mineral-Rich",
      description: "Hand-mined from the Himalayan salt ranges of Pakistan. Rich in trace minerals with a distinctive pink hue. Unrefined and free from additives.",
      ingredients: "100% Natural Himalayan Pink Salt",
      usage: "Use as a finishing salt on grilled meats, salads, and roasted vegetables. Also ideal for salt blocks and grilling.",
      price: 120,
      weight: "200g",
      unit: "g",
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      categorySlug: "salt-range",
      imageUrl: "/images/products/product06.jpg",
    },
    {
      sku: "AURA-SLT-002",
      name: "Rock Salt",
      slug: "rock-salt",
      tagline: "Kala Namak — The Authentic Touch",
      description: "Traditional black rock salt with a distinctive sulfurous aroma and flavor. A key ingredient in South Asian cuisine, especially in chaat and raita.",
      ingredients: "100% Natural Rock Salt (Kala Namak)",
      usage: "Essential for chaat masala, raita, chutneys, and tangy salads. Also used in Ayurvedic refreshment drinks.",
      price: 110,
      weight: "200g",
      unit: "g",
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      categorySlug: "salt-range",
      imageUrl: "/images/products/product07.jpg",
    },
    {
      sku: "AURA-GM-001",
      name: "Royal Garam Masala",
      slug: "royal-garam-masala",
      tagline: "The King of Spice Blends",
      description: "A regal blend of hand-roasted spices including cardamom, cinnamon, cloves, black pepper, cumin, coriander, nutmeg, and mace. Slow-roasted and ground to unlock deep, warming flavors.",
      ingredients: "Cardamom, Cinnamon, Cloves, Black Pepper, Cumin, Coriander, Nutmeg, Mace",
      usage: "Add towards the end of cooking curries, biryani, korma, and lentil dishes. Use sparingly for best results.",
      price: 250,
      weight: "100g",
      unit: "g",
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      categorySlug: "garam-masala",
      imageUrl: "/images/products/product08.jpg",
    },
  ];

  const createdProducts = await prisma.$transaction(
    productsData.map((p) =>
      prisma.product.create({
        data: {
          sku: p.sku,
          name: p.name,
          slug: p.slug,
          tagline: p.tagline,
          description: p.description,
          ingredients: p.ingredients,
          usage: p.usage,
          price: p.price,
          weight: p.weight,
          unit: p.unit,
          isFeatured: p.isFeatured,
          isBestSeller: p.isBestSeller,
          isNewArrival: p.isNewArrival,
          categoryId: categoryMap[p.categorySlug],
          images: {
            create: {
              url: p.imageUrl,
              alt: p.name,
              isPrimary: true,
              sortOrder: 0,
            },
          },
          inventoryStock: {
            create: {
              quantity: 100,
              lowStockThreshold: 10,
            },
          },
        },
      })
    )
  );

  // ─── Customers ─────────────────────────────────────────────────────────────
  console.log("Creating customers...");
  const customersData = [
    { name: "Ahmed Khan", email: "ahmed.khan@email.com", phone: "0312-1111111", address: "House 12, Street 5, F-7/1", city: "Islamabad" },
    { name: "Fatima Ali", email: "fatima.ali@email.com", phone: "0333-2222222", address: "Flat 3B, Panorama Heights, Clifton", city: "Karachi" },
    { name: "Bilal Ahmed", email: "bilal.ahmed@email.com", phone: "0300-3333333", address: "123 Main Boulevard, Gulberg", city: "Lahore" },
    { name: "Sana Tariq", email: "sana.tariq@email.com", phone: "0345-4444444", address: "House 7, Phase 5, DHA", city: "Rawalpindi" },
    { name: "Usman Malik", email: "usman.malik@email.com", phone: "0321-5555555", address: "Office 4, Plaza 22, Saddar", city: "Multan" },
  ];

  const customers = await prisma.$transaction(
    customersData.map((c) =>
      prisma.customer.create({ data: c })
    )
  );

  // ─── Orders ────────────────────────────────────────────────────────────────
  console.log("Creating orders...");

  function generateOrderNumber(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "AURA-";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const ordersData = [
    {
      customerId: customers[0].id,
      userId: salesStaff.id,
      status: "Delivered",
      items: [
        { productSku: "AURA-RCP-001", quantity: 2 },
        { productSku: "AURA-TUR-001", quantity: 1 },
        { productSku: "AURA-GM-001", quantity: 1 },
      ],
      createdAt: new Date("2026-07-15"),
    },
    {
      customerId: customers[1].id,
      userId: salesStaff.id,
      status: "Delivered",
      items: [
        { productSku: "AURA-CM-001", quantity: 3 },
        { productSku: "AURA-SLT-002", quantity: 2 },
      ],
      createdAt: new Date("2026-07-18"),
    },
    {
      customerId: customers[2].id,
      userId: salesStaff.id,
      status: "Processing",
      items: [
        { productSku: "AURA-PBP-001", quantity: 1 },
        { productSku: "AURA-GM-001", quantity: 2 },
        { productSku: "AURA-SLT-001", quantity: 1 },
      ],
      createdAt: new Date("2026-07-20"),
    },
    {
      customerId: customers[3].id,
      userId: undefined,
      status: "Pending",
      items: [
        { productSku: "AURA-COR-001", quantity: 2 },
        { productSku: "AURA-CM-001", quantity: 1 },
      ],
      createdAt: new Date("2026-07-22"),
    },
  ];

  const productPriceMap: Record<string, number> = {};
  for (const p of createdProducts) {
    productPriceMap[p.sku] = p.price;
  }

  for (const orderData of ordersData) {
    const orderItems = orderData.items.map((item) => {
      const unitPrice = productPriceMap[item.productSku] ?? 0;
      return {
        productId: createdProducts.find((p) => p.sku === item.productSku)!.id,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.totalPrice, 0);
    const deliveryCharge = subtotal >= 500 ? 0 : 40;
    const total = subtotal + deliveryCharge;

    await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: orderData.customerId,
        userId: orderData.userId ?? null,
        status: orderData.status,
        subtotal,
        deliveryCharge,
        total,
        createdAt: orderData.createdAt,
        customerName: customersData[orderData.customerId - 1]!.name,
        customerEmail: customersData[orderData.customerId - 1]!.email,
        customerPhone: customersData[orderData.customerId - 1]!.phone,
        customerAddress: customersData[orderData.customerId - 1]!.address,
        customerCity: customersData[orderData.customerId - 1]!.city,
        items: {
          create: orderItems,
        },
      },
    });
  }

  // ─── Inventory Transactions ───────────────────────────────────────────────
  console.log("Creating inventory transactions...");

  const initialStockTransactions = createdProducts.map((product) => ({
    productId: product.id,
    userId: adminUser.id,
    type: "STOCK_IN",
    quantity: 100,
    reference: "Initial Stock",
    notes: "Initial inventory setup via seed",
  }));

  const adjustmentTransactions = [
    {
      productId: createdProducts.find((p) => p.sku === "AURA-RCP-001")!.id,
      userId: inventoryStaff.id,
      type: "ADJUSTMENT" as const,
      quantity: -5,
      reference: "Quality Check",
      notes: "Removed damaged packaging",
    },
    {
      productId: createdProducts.find((p) => p.sku === "AURA-GM-001")!.id,
      userId: inventoryStaff.id,
      type: "STOCK_IN" as const,
      quantity: 25,
      reference: "Supplier Restock",
      notes: "Extra stock for upcoming promotion",
    },
  ];

  await prisma.$transaction(
    [...initialStockTransactions, ...adjustmentTransactions].map((t) =>
      prisma.inventoryTransaction.create({ data: t })
    )
  );

  // ─── Settings ──────────────────────────────────────────────────────────────
  console.log("Creating settings...");
  const settingsData = [
    { key: "site_name", value: "Aura Foods" },
    { key: "site_description", value: "Premium quality spices and culinary products from Pakistan" },
    { key: "phone", value: "0300-1234567" },
    { key: "email", value: "info@aurafoods.local" },
    { key: "address", value: "Spice Market, Lahore, Pakistan" },
    { key: "delivery_charge", value: "40" },
    { key: "free_shipping_threshold", value: "500" },
    { key: "currency", value: "Rs." },
    { key: "tax_rate", value: "0" },
    { key: "order_prefix", value: "AURA-" },
    { key: "low_stock_alert_threshold", value: "10" },
  ];

  await prisma.$transaction(
    settingsData.map((s) =>
      prisma.setting.create({ data: s })
    )
  );

  console.log("Seed completed successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
