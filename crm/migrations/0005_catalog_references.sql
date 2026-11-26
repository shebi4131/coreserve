-- Keep linked record labels in sync with catalogue renames, in the same transaction.
CREATE TRIGGER catalog_rename AFTER UPDATE OF data ON records
WHEN NEW.kind IN ('services','propertyTypes','areas') AND OLD.kind=NEW.kind
AND json_extract(OLD.data,'$.name')<>json_extract(NEW.data,'$.name')
BEGIN
 UPDATE records SET
 data=json_set(data,CASE NEW.kind WHEN 'services' THEN '$.service' WHEN 'propertyTypes' THEN '$.propertyType' ELSE '$.area' END,json_extract(NEW.data,'$.name')),
 version=version+1,updated=NEW.updated
 WHERE (kind IN ('jobs','enquiries') OR (NEW.kind='areas' AND kind='agents'))
 AND json_extract(data,CASE NEW.kind WHEN 'services' THEN '$.service' WHEN 'propertyTypes' THEN '$.propertyType' ELSE '$.area' END)=json_extract(OLD.data,'$.name');
END;
