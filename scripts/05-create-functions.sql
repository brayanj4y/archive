-- Function to generate tracking numbers
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS TEXT AS $$
DECLARE
  tracking_number TEXT;
  exists_check INTEGER;
BEGIN
  LOOP
    -- Generate tracking number: ST + 8 digit timestamp + 4 random chars
    tracking_number := 'ST' || 
                      LPAD(EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT, 8, '0') || 
                      UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
    
    -- Check if tracking number already exists
    SELECT COUNT(*) INTO exists_check 
    FROM shipments 
    WHERE shipments.tracking_number = generate_tracking_number.tracking_number;
    
    -- If unique, exit loop
    IF exists_check = 0 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN tracking_number;
END;
$$ LANGUAGE plpgsql;

-- Function to get shipment with status updates
CREATE OR REPLACE FUNCTION get_shipment_details(tracking_num TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'shipment', row_to_json(s),
    'status_updates', COALESCE(
      (SELECT json_agg(row_to_json(su) ORDER BY su.created_at DESC)
       FROM status_updates su 
       WHERE su.shipment_id = s.id), 
      '[]'::json
    )
  ) INTO result
  FROM shipments s
  WHERE s.tracking_number = tracking_num;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update shipment status with automatic status update creation
CREATE OR REPLACE FUNCTION update_shipment_status(
  tracking_num TEXT,
  new_status shipment_status,
  location_text TEXT DEFAULT NULL,
  description_text TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  shipment_id UUID;
BEGIN
  -- Get shipment ID
  SELECT id INTO shipment_id 
  FROM shipments 
  WHERE tracking_number = tracking_num;
  
  IF shipment_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update shipment status
  UPDATE shipments 
  SET current_status = new_status,
      updated_at = NOW()
  WHERE id = shipment_id;
  
  -- Create status update entry
  INSERT INTO status_updates (shipment_id, status, location, description, updated_by)
  VALUES (shipment_id, new_status, location_text, description_text, auth.uid());
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
BEGIN
  RETURN json_build_object(
    'total_shipments', (SELECT COUNT(*) FROM shipments),
    'pending_shipments', (SELECT COUNT(*) FROM shipments WHERE current_status = 'pending'),
    'in_transit_shipments', (SELECT COUNT(*) FROM shipments WHERE current_status = 'in_transit'),
    'delivered_shipments', (SELECT COUNT(*) FROM shipments WHERE current_status = 'delivered'),
    'on_hold_shipments', (SELECT COUNT(*) FROM shipments WHERE current_status = 'on_hold'),
    'total_revenue', (SELECT COALESCE(SUM(shipping_cost), 0) FROM shipments),
    'total_insurance', (SELECT COALESCE(SUM(insurance_amount), 0) FROM shipments),
    'recent_shipments', (
      SELECT json_agg(row_to_json(s) ORDER BY s.created_at DESC)
      FROM (SELECT * FROM shipments ORDER BY created_at DESC LIMIT 10) s
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
