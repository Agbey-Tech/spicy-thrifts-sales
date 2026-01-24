-- Categories
insert into categories (name, code) values
('Dresses', 'DRS'),
('Bikini Sets', 'BKN'),
('Corset Tops', 'CRS'),
('Crop Tops', 'CRP'),
('Denim Skirts', 'DNM'),
('Others', 'OTH');

-- Sample Product
insert into products (name, category_id, description, base_price, is_unique)
select
  'Black Lace Corset Top',
  id,
  'Elegant black corset with lace detail',
  180.00,
  false
from categories
where code = 'CRS';

-- Sample Variant
insert into product_variants (
  product_id,
  sku,
  size,
  primary_color,
  price,
  stock_quantity,
  attributes
)
select
  p.id,
  'ST-CRS-BLK-M-001',
  'M',
  'Black',
  180.00,
  5,
  '{"fabric":"Lace","fit":"Slim"}'
from products p
where p.name = 'Black Lace Corset Top';
