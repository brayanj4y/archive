-- Insert admin user profile (you'll need to create this user in Supabase Auth first)
-- This is a placeholder - replace with actual admin user ID from Supabase Auth
INSERT INTO profiles (id, email, full_name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@shiptrack.com', 'Admin User', 'admin')
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'Admin User';

-- Insert sample shipments
INSERT INTO shipments (
  tracking_number, client_name, client_email, client_phone, pickup_address,
  receiver_name, receiver_email, receiver_phone, receiver_address, delivery_address,
  package_name, package_weight, package_type, current_status, insurance_amount,
  special_instructions, created_by
) VALUES
  (
    'ST12345678ABCD',
    'John Smith',
    'john.smith@email.com',
    '+1-555-0123',
    '123 Main Street, New York, NY 10001',
    'Jane Doe',
    'jane.doe@email.com',
    '+1-555-0456',
    '456 Oak Avenue, Los Angeles, CA 90210',
    '456 Oak Avenue, Los Angeles, CA 90210',
    'Electronics Package',
    5.5,
    'fragile',
    'in_transit',
    500.00,
    'Handle with extreme care - contains sensitive electronics',
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    'ST87654321EFGH',
    'Sarah Johnson',
    'sarah.johnson@email.com',
    '+1-555-0789',
    '789 Pine Street, Chicago, IL 60601',
    'Mike Wilson',
    'mike.wilson@email.com',
    '+1-555-0321',
    '321 Elm Drive, Miami, FL 33101',
    '321 Elm Drive, Miami, FL 33101',
    'Important Documents',
    2.0,
    'general',
    'delivered',
    100.00,
    'Confidential business documents',
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    'ST11223344IJKL',
    'Robert Davis',
    'robert.davis@email.com',
    '+1-555-0654',
    '654 Cedar Lane, Seattle, WA 98101',
    'Lisa Brown',
    'lisa.brown@email.com',
    '+1-555-0987',
    '987 Maple Court, Denver, CO 80201',
    '987 Maple Court, Denver, CO 80201',
    'Golden Retriever - Max',
    65.0,
    'pet',
    'pending',
    800.00,
    'Friendly dog, needs water every 2 hours. Vet certificate attached.',
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    'ST55667788MNOP',
    'Emily Chen',
    'emily.chen@email.com',
    '+1-555-0147',
    '147 Birch Road, Boston, MA 02101',
    'David Martinez',
    'david.martinez@email.com',
    '+1-555-0258',
    '258 Spruce Street, Phoenix, AZ 85001',
    '258 Spruce Street, Phoenix, AZ 85001',
    'Antique Vase Collection',
    12.3,
    'fragile',
    'on_hold',
    2500.00,
    'Extremely fragile antiques from 18th century. Requires climate control.',
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    'ST99887766QRST',
    'Thomas Anderson',
    'thomas.anderson@email.com',
    '+1-555-0369',
    '369 Willow Way, Portland, OR 97201',
    'Jennifer Taylor',
    'jennifer.taylor@email.com',
    '+1-555-0741',
    '741 Aspen Avenue, Austin, TX 78701',
    '741 Aspen Avenue, Austin, TX 78701',
    'International Art Shipment',
    25.8,
    'international',
    'in_transit',
    5000.00,
    'Customs documentation included. Requires signature upon delivery.',
    '00000000-0000-0000-0000-000000000001'
  );

-- Insert status updates for the sample shipments
INSERT INTO status_updates (shipment_id, status, location, description) VALUES
  -- Updates for ST12345678ABCD (in_transit)
  (
    (SELECT id FROM shipments WHERE tracking_number = 'ST12345678ABCD'),
    'pending',
    'New York, NY',
    'Package received and processed at origin facility'
  ),
  (
    (SELECT id FROM shipments WHERE tracking_number = 'ST12345678ABCD'),
    'in_transit',
    'Chicago, IL',
    'Package in transit - passed through Chicago sorting facility'
  ),
  
  -- Updates for ST87654321EFGH (delivered)
  (
    (SELECT id FROM shipments WHERE tracking_number = 'ST87654321EFGH'),
    'pending',
    'Chicago, IL',
    'Package received and processed at origin facility'
  ),
  (
    (SELECT id FROM shipments WHERE tracking_number = 'ST87654321EFGH'),
    'in_transit',
    'Atlanta, GA',
    'Package in transit - passed through Atlanta hub'
  ),
  (
    (SELECT id FROM shipments WHERE tracking_number = 'ST87654321EFGH'),
    'delivered',
    'Miami, FL',
    'Package delivered successfully to recipient'
  ),
  
  -- Updates for ST11223344IJKL (pending - pet)
  (
    (SELECT id FROM shipments WHERE tracking_number = 'ST11223344IJKL'),
    'pending',
    'Seattle, WA',
    'Pet transportation request received. Awaiting veterinary documentation.'
  ),
  
  -- Updates for ST55667788MNOP (on_hold - fragile)
  (
    (SELECT id FROM shipments WHERE tracking_number = 'ST55667788MNOP'),
    'pending',
    'Boston, MA',
    'Fragile package received. Special packaging in progress.'
  ),
  (
    (SELECT id FROM shipments WHERE tracking_number = 'ST55667788MNOP'),
    'on_hold',
    'Boston, MA',
    'Package on hold - awaiting specialized climate-controlled transport vehicle'
  ),
  
  -- Updates for ST99887766QRST (international - in_transit)
  (
    (SELECT id FROM shipments WHERE tracking_number = 'ST99887766QRST'),
    'pending',
    'Portland, OR',
    'International shipment received. Customs documentation being processed.'
  ),
  (
    (SELECT id FROM shipments WHERE tracking_number = 'ST99887766QRST'),
    'in_transit',
    'Los Angeles, CA',
    'Package cleared customs and in transit to destination'
  );

-- Insert sample notifications
INSERT INTO notifications (shipment_id, recipient_email, notification_type, subject, message) VALUES
  (
    (SELECT id FROM shipments WHERE tracking_number = 'ST12345678ABCD'),
    'jane.doe@email.com',
    'status_update',
    'Your package ST12345678ABCD is in transit',
    'Your electronics package is currently in transit and passed through our Chicago facility. Expected delivery in 1-2 business days.'
  ),
  (
    (SELECT id FROM shipments WHERE tracking_number = 'ST87654321EFGH'),
    'mike.wilson@email.com',
    'delivery_confirmation',
    'Package ST87654321EFGH delivered successfully',
    'Your important documents have been delivered successfully to 321 Elm Drive, Miami, FL 33101.'
  );
