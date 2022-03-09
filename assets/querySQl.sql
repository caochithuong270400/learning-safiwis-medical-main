CREATE OR REPLACE FUNCTION public.update_bill_number()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE config_date timestamp;

DECLARE this_day TEXT;
DECLARE this_month TEXT;
DECLARE this_year TEXT;
DECLARE tempBillNumber TEXT;
DECLARE idOLd INT;
DECLARE idNew INT;
DECLARE currentNumber INT;
DECLARE receiptId INT;
DECLARE machineName TEXT;
BEGIN
    IF OLD.vat_bill_number IS NOT NULL THEN
        RETURN NEW;
    END IF;
    IF NEW.receipt_id isNULL THEN
        RETURN NEW;
    END IF;
    SELECT date_part('year', (SELECT (current_timestamp + interval '7 hour'))) INTO this_year;
    SELECT to_char(date_part('month', (SELECT (current_timestamp + interval '7 hour'))), 'fm00') INTO this_month;
    SELECT to_char(date_part('day', (SELECT (current_timestamp + interval '7 hour'))), 'fm00') INTO this_day;
    SELECT use_time INTO config_date FROM "receipt_details" WHERE employee_id = NEW.bill_created_by_id AND receipt_id=NEW.receipt_id ORDER BY id DESC LIMIT 1;
    SELECT id INTO idOLd FROM "receipt_details" WHERE employee_id = NEW.bill_created_by_id AND receipt_id=NEW.receipt_id  ORDER BY id DESC LIMIT 1;
    
    -- SELECT current_number INTO currentNumber FROM "receipt_details" WHERE employee_id = NEW.bill_created_by_id AND receipt_id=NEW.receipt_id ORDER BY id DESC LIMIT 1;
    SELECT current_number INTO currentNumber FROM "receipt_details" WHERE receipt_id=NEW.receipt_id ORDER BY id DESC LIMIT 1;
    
    UPDATE receipt_details SET is_effect = false  WHERE receipt_id = NEW.receipt_id AND is_effect = true;
    SELECT machine_name INTO machineName FROM "receipt_details" WHERE employee_id = NEW.bill_created_by_id AND receipt_id=NEW.receipt_id ORDER BY id DESC LIMIT 1;
    IF currentNumber isNULL THEN
            NEW.bill_number = CONCAT(NEW.vat_seri_number,'\',1);
            NEW.vat_bill_number  = 1;
            INSERT INTO receipt_details(receipt_id,employee_id,machine_name,start_number,current_number,use_time) VALUES (NEW.receipt_id,NEW.bill_created_by_id,'03_01_TN02',1, 2, TO_TIMESTAMP(CONCAT(this_year,'-',this_month,'-',this_day,' 17:00:00'),'YYYY-MM-DD HH24:MI:SS')) RETURNING id INTO idNew;
            NEW.registration_bill_id = idNew;
        RETURN NEW;
    END IF;
    
    IF idOLd isNULL THEN

            NEW.bill_number = CONCAT(NEW.vat_seri_number,'\',currentNumber);
            NEW.vat_bill_number  = currentNumber;
            INSERT INTO receipt_details(receipt_id,employee_id,machine_name,start_number,current_number,use_time) VALUES (NEW.receipt_id,NEW.bill_created_by_id,'03_01_TN02',currentNumber, currentNumber + 1, TO_TIMESTAMP(CONCAT(this_year,'-',this_month,'-',this_day,' 17:00:00'),'YYYY-MM-DD HH24:MI:SS')) RETURNING id INTO idNew;
            NEW.registration_bill_id = idNew;
            RETURN NEW;
    ELSE
   
         IF current_timestamp < config_date THEN
            NEW.bill_number = CONCAT(NEW.vat_seri_number,'\',currentNumber);
            NEW.registration_bill_id = idOLd;
            NEW.vat_bill_number  = currentNumber;
            UPDATE receipt_details SET current_number = currentNumber + 1 , is_effect = true  WHERE id = idOLd;
            RETURN NEW;
        ELSE
            NEW.bill_number = CONCAT(NEW.vat_seri_number,'\',currentNumber);
            NEW.vat_bill_number  = currentNumber;
            INSERT INTO receipt_details(receipt_id,employee_id,machine_name,start_number,current_number,use_time) VALUES (NEW.receipt_id,NEW.bill_created_by_id,'03_01_TN02',currentNumber, currentNumber + 1, TO_TIMESTAMP(CONCAT(this_year,'-',this_month,'-',this_day,' 17:00:00'),'YYYY-MM-DD HH24:MI:SS')) RETURNING id INTO idNew;
            NEW.registration_bill_id = idNew;
            RETURN NEW;
        END IF;
      
    END IF;
    RETURN NEW;
END;
$function$





thêm cột
bills: company_payment, advance_payment
bill_logs: company_payment, advance_payment, type, computer_name
subclinical_request_details: percent_price_reason, is_company_payment, is_hide_payment
reception: social_insurance

CREATE FUNCTION patient_full_search(patient_row patients)
RETURNS TEXT AS $$
  SELECT COALESCE('' || patient_row.plain_name, '') || ' ' || COALESCE('' || patient_row.medical_code, '') || ' ' || COALESCE('' || patient_row.old_medical_code, '') ||' ' || COALESCE('' || patient_row.birthday, '') ||' ' || COALESCE('' || patient_row.id_card_no, '')
$$ LANGUAGE sql STABLE;
patients: computed field: full_search_1, full_search_2


CREATE FUNCTION service_pack_detail_compute(service_pack_detail_row service_pack_details)
RETURNS service_prices AS $$
  SELECT * from service_prices where service_id = service_pack_detail_row.service_id and price_type_id = service_pack_detail_row.price_type_id
$$ LANGUAGE sql STABLE;

service_pack_details: compute field: service_price